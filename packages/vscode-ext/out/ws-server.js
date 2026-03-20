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
/**
 * WsServer 封装 WebSocket 服务端逻辑。
 * 在 VSCode 插件 activate() 中创建，deactivate() 时自动关闭。
 */
class WsServer {
    wss = null;
    clients = new Set();
    outputChannel;
    port;
    constructor(outputChannel, port = 7777) {
        this.outputChannel = outputChannel;
        this.port = port;
    }
    /**
     * 启动 WebSocket 服务端
     * @returns Promise 在服务端开始监听后 resolve
     */
    start() {
        return new Promise((resolve, reject) => {
            this.wss = new ws_1.WebSocketServer({ port: this.port });
            this.wss.on('listening', () => {
                this.outputChannel.appendLine(`[WsServer] WebSocket 服务端已在端口 ${this.port} 上监听`);
                vscode.window.showInformationMessage(`Browser Agent WebSocket listening on port ${this.port}`);
                resolve();
            });
            this.wss.on('connection', (ws) => {
                this.clients.add(ws);
                this.outputChannel.appendLine(`[WsServer] 新客户端连接 (当前连接数: ${this.clients.size})`);
                ws.on('message', (data) => {
                    try {
                        const msg = JSON.parse(data.toString());
                        this.outputChannel.appendLine(`[WsServer] 收到消息: type=${msg.type}, sessionId=${msg.sessionId}`);
                        this.handleMessage(ws, msg);
                    }
                    catch (err) {
                        this.outputChannel.appendLine(`[WsServer] 消息解析失败: ${String(err)}`);
                    }
                });
                ws.on('close', () => {
                    this.clients.delete(ws);
                    this.outputChannel.appendLine(`[WsServer] 客户端断开 (当前连接数: ${this.clients.size})`);
                });
                ws.on('error', (err) => {
                    this.outputChannel.appendLine(`[WsServer] 客户端错误: ${err.message}`);
                });
            });
            this.wss.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    const msg = `端口 ${this.port} 已被占用，请修改 browserAgent.port 设置`;
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
    /**
     * 处理收到的桥接消息
     */
    handleMessage(ws, msg) {
        switch (msg.type) {
            case 'ping':
                this.send(ws, { type: 'pong', payload: null, sessionId: msg.sessionId });
                break;
            default:
                // 后续任务会扩展更多消息类型处理
                this.outputChannel.appendLine(`[WsServer] 未处理的消息类型: ${msg.type}`);
                break;
        }
    }
    /**
     * 向指定客户端发送消息
     */
    send(ws, msg) {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
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
            this.outputChannel.appendLine('[WsServer] 服务端已关闭');
        }
    }
}
exports.WsServer = WsServer;
//# sourceMappingURL=ws-server.js.map