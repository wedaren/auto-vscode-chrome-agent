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
const ws_1 = require("ws");
const vscode = __importStar(require("vscode"));
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
     * 关闭服务端和所有连接
     */
    dispose() {
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