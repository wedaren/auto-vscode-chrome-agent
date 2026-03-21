"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsServer = void 0;
// ws-server.ts — WebSocket 服务端，负责与 Chrome 插件的双向通信
// 支持双向工具调用协议：sendAndWait() 发送 tool_execute 并等待 tool_result 响应
//
// === 工具调用协议（tool_execute / tool_result） ===
//
// VSCode → Chrome:
//   { type: 'tool_execute', payload: { requestId, toolName, toolArgs }, sessionId }
//     requestId: string  — 唯一请求 ID（UUID），用于匹配响应
//     toolName:  string  — 工具名称（对应 Chrome 侧 BrowserAction.type）
//     toolArgs:  object  — 工具参数（对应 BrowserAction 字段，如 selector/value/url 等）
//
// Chrome → VSCode:
//   { type: 'tool_result', payload: { requestId, success, data, error }, sessionId }
//     requestId: string  — 与 tool_execute 中的 requestId 一致
//     success:   boolean — 执行是否成功
//     data:      unknown — 成功时的返回数据
//     error:     string  — 失败时的错误信息
//
// 使用方式（VSCode 侧）：
//   const result = await wsServer.sendAndWait(ws, {
//     type: 'tool_execute',
//     payload: { requestId: uuid(), toolName: 'click', toolArgs: { selector: '#btn' } },
//     sessionId,
//   }, 30000);
//   // result 是 tool_result 的 payload
//
const ws_1 = require("ws");
const vscode = __importStar(require("vscode"));
const crypto = __importStar(require("crypto"));
const message_tree_1 = require("./message-tree");
/**
 * WsServer 封装 WebSocket 服务端逻辑。
 * 在 VSCode 插件 activate() 中创建，deactivate() 时自动关闭。
 */
class WsServer {
    wss = null;
    clients = new Set();
    outputChannel;
    _port;
    _listening = false;
    /**
     * 待响应的请求 Map：requestId → PendingRequest
     * 用于 sendAndWait() 发送 tool_execute 后，通过 requestId 匹配 tool_result 响应
     */
    pendingRequests = new Map();
    /** 状态变更事件，当 listening / clientCount 变化时触发 */
    _onDidChangeState = new vscode.EventEmitter();
    onDidChangeState = this._onDidChangeState.event;
    constructor(outputChannel, port = 7777) {
        this.outputChannel = outputChannel;
        this._port = port;
    }
    /** 当前监听端口 */
    get port() {
        return this._port;
    }
    /** 是否正在监听 */
    get listening() {
        return this._listening;
    }
    /** 已连接客户端数 */
    get clientCount() {
        return this.clients.size;
    }
    /** 获取第一个已连接且处于 OPEN 状态的 WebSocket 客户端（通常只有一个 Chrome 插件连接） */
    get firstClient() {
        for (const client of this.clients) {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                return client;
            }
        }
        return null;
    }
    /**
     * 启动 WebSocket 服务端
     * @returns Promise 在服务端开始监听后 resolve
     */
    start() {
        return new Promise((resolve, reject) => {
            this.wss = new ws_1.WebSocketServer({ port: this._port });
            this.wss.on('listening', () => {
                this._listening = true;
                this.outputChannel.appendLine(`[WsServer] WebSocket 服务端已在端口 ${this._port} 上监听`);
                vscode.window.showInformationMessage(`Browser Agent WebSocket listening on port ${this._port}`);
                this._onDidChangeState.fire();
                resolve();
            });
            this.wss.on('connection', (ws) => {
                this.clients.add(ws);
                this.outputChannel.appendLine(`[WsServer] 新客户端连接 (当前连接数: ${this.clients.size})`);
                this._onDidChangeState.fire();
                ws.on('message', (data) => {
                    try {
                        const msg = JSON.parse(data.toString());
                        this.outputChannel.appendLine(`[WsServer] 收到消息: type=${msg.type}, sessionId=${msg.sessionId}`);
                        (0, message_tree_1.captureMessage)('receive', msg);
                        this.handleMessage(ws, msg);
                    }
                    catch (err) {
                        this.outputChannel.appendLine(`[WsServer] 消息解析失败: ${String(err)}`);
                    }
                });
                ws.on('close', () => {
                    this.clients.delete(ws);
                    this.outputChannel.appendLine(`[WsServer] 客户端断开 (当前连接数: ${this.clients.size})`);
                    this._onDidChangeState.fire();
                });
                ws.on('error', (err) => {
                    this.outputChannel.appendLine(`[WsServer] 客户端错误: ${err.message}`);
                });
            });
            this.wss.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    const msg = `端口 ${this._port} 已被占用，请修改 browserAgent.port 设置`;
                    this.outputChannel.appendLine(`[WsServer] ${msg}`);
                    vscode.window.showErrorMessage(`Browser Agent: ${msg}`);
                }
                else {
                    this.outputChannel.appendLine(`[WsServer] 服务端错误: ${err.message}`);
                }
                reject(err);
            });
        });
    }
    /** 消息处理回调，供外部注册自定义处理逻辑 */
    externalHandler = null;
    /**
     * 注册外部消息处理器（用于 extension.ts 中接入 LmService 等）
     */
    onMessage(handler) {
        this.externalHandler = handler;
    }
    /**
     * 处理收到的桥接消息
     */
    handleMessage(ws, msg) {
        switch (msg.type) {
            case 'ping':
                this.send(ws, { type: 'pong', payload: null, sessionId: msg.sessionId });
                break;
            case 'chat': {
                // 收到 Chrome 侧的用户聊天消息
                const text = msg.payload?.text ?? '';
                this.outputChannel.appendLine(`[WsServer] 收到聊天消息: ${text}`);
                // 如果有外部处理器，委托处理；否则 echo 回去
                if (this.externalHandler) {
                    this.externalHandler(ws, msg);
                }
                else {
                    this.send(ws, {
                        type: 'echo',
                        payload: `[echo] ${text}`,
                        sessionId: msg.sessionId,
                    });
                }
                break;
            }
            case 'tool_result': {
                // Chrome 侧返回的工具执行结果，路由到对应的 pending Promise
                const resultPayload = msg.payload;
                const requestId = resultPayload?.requestId;
                if (!requestId) {
                    this.outputChannel.appendLine('[WsServer] tool_result 消息缺少 requestId，忽略');
                    break;
                }
                const pending = this.pendingRequests.get(requestId);
                if (pending) {
                    clearTimeout(pending.timer);
                    this.pendingRequests.delete(requestId);
                    pending.resolve(resultPayload);
                    this.outputChannel.appendLine(`[WsServer] tool_result 已匹配: requestId=${requestId}, success=${resultPayload.success}`);
                }
                else {
                    this.outputChannel.appendLine(`[WsServer] tool_result 未找到匹配请求: requestId=${requestId}（可能已超时）`);
                }
                break;
            }
            default:
                // 后续任务会扩展更多消息类型处理
                this.outputChannel.appendLine(`[WsServer] 未处理的消息类型: ${msg.type}`);
                // 委托给外部处理器（如果有）
                if (this.externalHandler) {
                    this.externalHandler(ws, msg);
                }
                break;
        }
    }
    /**
     * 向指定客户端发送消息
     */
    send(ws, msg) {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
            (0, message_tree_1.captureMessage)('send', msg);
        }
    }
    /**
     * 向所有已连接客户端广播消息
     */
    broadcast(msg) {
        const data = JSON.stringify(msg);
        for (const client of this.clients) {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data);
            }
        }
        // 广播只记录一条（避免每个客户端重复记录）
        (0, message_tree_1.captureMessage)('send', msg);
    }
    /**
     * 发送消息并等待 Chrome 侧的 tool_result 响应（请求-响应匹配）
     *
     * 工作原理：
     * 1. 如果 payload 中没有 requestId，自动生成一个 UUID
     * 2. 创建一个 Promise，存入 pendingRequests Map（以 requestId 为 key）
     * 3. 发送消息到 Chrome 侧
     * 4. Chrome 侧处理后返回 tool_result（含相同的 requestId）
     * 5. handleMessage 中 tool_result 分支匹配 requestId 并 resolve Promise
     * 6. 如果超时未收到响应，自动 reject
     *
     * @param ws - 目标 WebSocket 客户端连接
     * @param msg - 要发送的 BridgeMessage（通常 type='tool_execute'）
     * @param timeoutMs - 超时毫秒数，默认 30000（30 秒）
     * @returns Promise<ToolResultPayload> — Chrome 侧返回的工具执行结果
     * @throws Error — 超时或发送失败时
     */
    sendAndWait(ws, msg, timeoutMs = 30000) {
        // 确保 payload 中有 requestId
        const payload = msg.payload;
        const requestId = payload?.requestId || crypto.randomUUID();
        // 如果 payload 中没有 requestId，补充上
        if (!payload?.requestId) {
            msg = {
                ...msg,
                payload: { ...payload, requestId },
            };
        }
        return new Promise((resolve, reject) => {
            // 设置超时定时器
            const timer = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                this.outputChannel.appendLine(`[WsServer] sendAndWait 超时: requestId=${requestId} (${timeoutMs}ms)`);
                reject(new Error(`tool_execute 超时 (${timeoutMs}ms): requestId=${requestId}`));
            }, timeoutMs);
            // 存入待响应 Map
            this.pendingRequests.set(requestId, { resolve, reject, timer });
            // 发送消息
            this.send(ws, msg);
            this.outputChannel.appendLine(`[WsServer] sendAndWait 已发送: requestId=${requestId}, timeout=${timeoutMs}ms`);
        });
    }
    /**
     * 关闭服务端和所有连接
     */
    dispose() {
        // 清理所有待响应请求，reject 防止 Promise 悬挂
        for (const [requestId, pending] of this.pendingRequests) {
            clearTimeout(pending.timer);
            pending.reject(new Error('WsServer 正在关闭'));
            this.pendingRequests.delete(requestId);
        }
        if (this.wss) {
            for (const client of this.clients) {
                client.close();
            }
            this.clients.clear();
            this.wss.close();
            this.wss = null;
            this._listening = false;
            this._onDidChangeState.fire();
            this.outputChannel.appendLine('[WsServer] 服务端已关闭');
        }
        this._onDidChangeState.dispose();
    }
}
exports.WsServer = WsServer;
//# sourceMappingURL=ws-server.js.map