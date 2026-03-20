// ws-server.ts — WebSocket 服务端，负责与 Chrome 插件的双向通信
import { WebSocketServer, WebSocket } from 'ws';
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
export class WsServer {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private outputChannel: vscode.OutputChannel;
  private port: number;

  constructor(outputChannel: vscode.OutputChannel, port: number = 7777) {
    this.outputChannel = outputChannel;
    this.port = port;
  }

  /**
   * 启动 WebSocket 服务端
   * @returns Promise 在服务端开始监听后 resolve
   */
  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.wss = new WebSocketServer({ port: this.port });

      this.wss.on('listening', () => {
        this.outputChannel.appendLine(
          `[WsServer] WebSocket 服务端已在端口 ${this.port} 上监听`,
        );
        vscode.window.showInformationMessage(
          `Browser Agent WebSocket listening on port ${this.port}`,
        );
        resolve();
      });

      this.wss.on('connection', (ws: WebSocket) => {
        this.clients.add(ws);
        this.outputChannel.appendLine(
          `[WsServer] 新客户端连接 (当前连接数: ${this.clients.size})`,
        );

        ws.on('message', (data: Buffer) => {
          try {
            const msg = JSON.parse(data.toString()) as BridgeMessage;
            this.outputChannel.appendLine(
              `[WsServer] 收到消息: type=${msg.type}, sessionId=${msg.sessionId}`,
            );
            this.handleMessage(ws, msg);
          } catch (err) {
            this.outputChannel.appendLine(
              `[WsServer] 消息解析失败: ${String(err)}`,
            );
          }
        });

        ws.on('close', () => {
          this.clients.delete(ws);
          this.outputChannel.appendLine(
            `[WsServer] 客户端断开 (当前连接数: ${this.clients.size})`,
          );
        });

        ws.on('error', (err: Error) => {
          this.outputChannel.appendLine(
            `[WsServer] 客户端错误: ${err.message}`,
          );
        });
      });

      this.wss.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          const msg = `端口 ${this.port} 已被占用，请修改 browserAgent.port 设置`;
          this.outputChannel.appendLine(`[WsServer] ${msg}`);
          vscode.window.showErrorMessage(`Browser Agent: ${msg}`);
        } else {
          this.outputChannel.appendLine(
            `[WsServer] 服务端错误: ${err.message}`,
          );
        }
        reject(err);
      });
    });
  }

  /** 消息处理回调，供外部注册自定义处理逻辑 */
  private externalHandler: ((ws: WebSocket, msg: BridgeMessage) => void) | null = null;

  /**
   * 注册外部消息处理器（用于 extension.ts 中接入 LmService 等）
   */
  onMessage(handler: (ws: WebSocket, msg: BridgeMessage) => void): void {
    this.externalHandler = handler;
  }

  /**
   * 处理收到的桥接消息
   */
  private handleMessage(ws: WebSocket, msg: BridgeMessage): void {
    switch (msg.type) {
      case 'ping':
        this.send(ws, { type: 'pong', payload: null, sessionId: msg.sessionId });
        break;
      case 'chat': {
        // 收到 Chrome 侧的用户聊天消息
        const text = (msg.payload as { text?: string })?.text ?? '';
        this.outputChannel.appendLine(`[WsServer] 收到聊天消息: ${text}`);

        // 如果有外部处理器，委托处理；否则 echo 回去
        if (this.externalHandler) {
          this.externalHandler(ws, msg);
        } else {
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
        this.outputChannel.appendLine(
          `[WsServer] 未处理的消息类型: ${msg.type}`,
        );
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
  send(ws: WebSocket, msg: BridgeMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }

  /**
   * 向所有已连接客户端广播消息
   */
  broadcast(msg: BridgeMessage): void {
    const data = JSON.stringify(msg);
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  /**
   * 关闭服务端和所有连接
   */
  dispose(): void {
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
