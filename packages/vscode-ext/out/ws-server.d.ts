import { WebSocket } from 'ws';
import * as vscode from 'vscode';
/** Chrome ↔ VSCode 桥接消息协议 */
export interface BridgeMessage {
    type: string;
    payload: unknown;
    sessionId: string;
}
/**
 * WsServer 封装 WebSocket 服务端逻辑。
 * 在 VSCode 插件 activate() 中创建，deactivate() 时自动关闭。
 */
export declare class WsServer {
    private wss;
    private clients;
    private outputChannel;
    private port;
    constructor(outputChannel: vscode.OutputChannel, port?: number);
    /**
     * 启动 WebSocket 服务端
     * @returns Promise 在服务端开始监听后 resolve
     */
    start(): Promise<void>;
    /**
     * 处理收到的桥接消息
     */
    private handleMessage;
    /**
     * 向指定客户端发送消息
     */
    send(ws: WebSocket, msg: BridgeMessage): void;
    /**
     * 向所有已连接客户端广播消息
     */
    broadcast(msg: BridgeMessage): void;
    /**
     * 关闭服务端和所有连接
     */
    dispose(): void;
}
//# sourceMappingURL=ws-server.d.ts.map