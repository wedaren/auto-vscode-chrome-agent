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
import { WebSocketServer, WebSocket } from 'ws';
import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { captureMessage } from './message-tree';

/** Chrome ↔ VSCode 桥接消息协议 */
export interface BridgeMessage {
  type: string;
  payload: unknown;
  sessionId: string;
}

/** tool_result 消息的 payload 结构 */
export interface ToolResultPayload {
  requestId: string;
  success: boolean;
  data?: unknown;
  error?: string;
}

/** 待响应请求的内部跟踪结构 */
interface PendingRequest {
  resolve: (result: ToolResultPayload) => void;
  reject: (err: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * WsServer 封装 WebSocket 服务端逻辑。
 * 在 VSCode 插件 activate() 中创建，deactivate() 时自动关闭。
 */
export class WsServer {
  private wss: WebSocketServer | null = null;
  /** 当前唯一活跃客户端（单客户端模式：新连接到达时踢掉旧连接） */
  private activeClient: WebSocket | null = null;
  private outputChannel: vscode.OutputChannel;
  private _port: number;
  private _listening = false;

  /**
   * 待响应的请求 Map：requestId → PendingRequest
   * 用于 sendAndWait() 发送 tool_execute 后，通过 requestId 匹配 tool_result 响应
   */
  private readonly pendingRequests = new Map<string, PendingRequest>();

  /** disposed 标志：dispose 后 pendingRequests 拒绝新增 */
  private _disposed = false;

  /** 心跳检测定时器（30s 间隔 ping activeClient，pong 超时自动断开死连接） */
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  /** 心跳间隔毫秒数 */
  private static readonly HEARTBEAT_INTERVAL_MS = 30_000;

  /** 单客户端存活标记（收到 pong 时标记为 true） */
  private isClientAlive = false;

  /** 当前活跃客户端的 sessionId（从第一条消息中获取） */
  private activeSessionId: string | null = null;

  /** 状态变更事件，当 listening / clientCount 变化时触发 */
  private readonly _onDidChangeState = new vscode.EventEmitter<void>();
  readonly onDidChangeState = this._onDidChangeState.event;

  constructor(outputChannel: vscode.OutputChannel, port: number = 7777) {
    this.outputChannel = outputChannel;
    this._port = port;
  }

  /** 当前监听端口 */
  get port(): number {
    return this._port;
  }

  /** 是否正在监听 */
  get listening(): boolean {
    return this._listening;
  }

  /** 已连接客户端数（单客户端模式：0 或 1） */
  get clientCount(): number {
    return this.activeClient && this.activeClient.readyState === WebSocket.OPEN ? 1 : 0;
  }

  /** 获取当前活跃客户端（单客户端模式：直接返回 activeClient） */
  get firstClient(): WebSocket | null {
    return this.activeClient && this.activeClient.readyState === WebSocket.OPEN
      ? this.activeClient
      : null;
  }

  /**
   * 启动 WebSocket 服务端
   * @returns Promise 在服务端开始监听后 resolve
   */
  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.wss = new WebSocketServer({ port: this._port });

      this.wss.on('listening', () => {
        this._listening = true;
        this.outputChannel.appendLine(
          `[WsServer] WebSocket 服务端已在端口 ${this._port} 上监听`,
        );
        vscode.window.showInformationMessage(
          `Browser Agent WebSocket listening on port ${this._port}`,
        );
        this.startHeartbeat();
        this._onDidChangeState.fire();
        resolve();
      });

      this.wss.on('connection', (ws: WebSocket) => {
        // 单客户端模式：新连接到达时踢掉旧连接
        const replacedPrevious = !!(this.activeClient && (this.activeClient.readyState === WebSocket.OPEN || this.activeClient.readyState === WebSocket.CONNECTING));
        if (replacedPrevious) {
          this.outputChannel.appendLine(
            '[WsServer] 新连接到达，踢掉旧客户端 (replaced by new connection)',
          );
          this.activeClient!.close(4001, 'replaced by new connection');
        }

        this.activeClient = ws;
        // 心跳：标记新连接为存活
        this.isClientAlive = true;
        this.outputChannel.appendLine(
          '[WsServer] 新客户端连接 (单客户端模式)',
        );
        this._onDidChangeState.fire();

        // welcome 握手：通知客户端连接已建立，告知是否替换了旧连接
        this.send(ws, {
          type: 'welcome',
          payload: { replacedPrevious },
          sessionId: '',
        });
        this.outputChannel.appendLine(
          `[WsServer] 已发送 welcome 握手 (replacedPrevious=${replacedPrevious})`,
        );

        // 心跳：收到 pong 时标记为存活
        ws.on('pong', () => {
          this.isClientAlive = true;
        });

        ws.on('message', (data: Buffer) => {
          try {
            const msg = JSON.parse(data.toString()) as BridgeMessage;
            this.outputChannel.appendLine(
              `[WsServer] 收到消息: type=${msg.type}, sessionId=${msg.sessionId}`,
            );

            // 记录客户端 sessionId（首次消息时记录，后续变更时更新）
            if (msg.sessionId && msg.sessionId !== this.activeSessionId) {
              this.activeSessionId = msg.sessionId;
              this.outputChannel.appendLine(
                `[WsServer] 记录客户端 sessionId=${msg.sessionId}`,
              );
            }

            captureMessage('receive', msg);
            this.handleMessage(ws, msg);
          } catch (err) {
            this.outputChannel.appendLine(
              `[WsServer] 消息解析失败: ${String(err)}`,
            );
          }
        });

        ws.on('close', () => {
          // 仅当断开的是当前活跃客户端时才清理
          if (this.activeClient === ws) {
            this.activeClient = null;
            this.isClientAlive = false;
            this.activeSessionId = null;
          }
          this.outputChannel.appendLine(
            '[WsServer] 客户端断开',
          );
          this._onDidChangeState.fire();
        });

        ws.on('error', (err: Error) => {
          this.outputChannel.appendLine(
            `[WsServer] 客户端错误: ${err.message}`,
          );
        });
      });

      this.wss.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          const msg = `端口 ${this._port} 已被占用，请修改 browserAgent.port 设置`;
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
      case 'heartbeat_ping':
        this.send(ws, { type: 'heartbeat_pong', payload: msg.payload, sessionId: msg.sessionId });
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
      case 'tool_result': {
        // Chrome 侧返回的工具执行结果，路由到对应的 pending Promise
        const resultPayload = msg.payload as ToolResultPayload;
        const requestId = resultPayload?.requestId;
        if (!requestId) {
          this.outputChannel.appendLine(
            '[WsServer] tool_result 消息缺少 requestId，忽略',
          );
          break;
        }
        const pending = this.pendingRequests.get(requestId);
        if (pending) {
          clearTimeout(pending.timer);
          this.pendingRequests.delete(requestId);
          pending.resolve(resultPayload);
          this.outputChannel.appendLine(
            `[WsServer] tool_result 已匹配: requestId=${requestId}, success=${resultPayload.success}`,
          );
        } else {
          this.outputChannel.appendLine(
            `[WsServer] tool_result 未找到匹配请求: requestId=${requestId}（可能已超时）`,
          );
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
      captureMessage('send', msg);
    }
  }

  /**
   * 向活跃客户端发送消息（单客户端模式下等同于 send(activeClient, msg)）
   */
  broadcast(msg: BridgeMessage): void {
    if (this.activeClient && this.activeClient.readyState === WebSocket.OPEN) {
      this.activeClient.send(JSON.stringify(msg));
      captureMessage('send', msg);
    }
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
  sendAndWait(
    ws: WebSocket,
    msg: BridgeMessage,
    timeoutMs: number = 30000,
  ): Promise<ToolResultPayload> {
    // 确保 payload 中有 requestId
    const payload = msg.payload as Record<string, unknown>;
    const requestId = (payload?.requestId as string) || crypto.randomUUID();

    // 如果 payload 中没有 requestId，补充上
    if (!payload?.requestId) {
      msg = {
        ...msg,
        payload: { ...payload, requestId },
      };
    }

    // disposal guard：dispose 后拒绝新增 pendingRequests
    if (this._disposed) {
      return Promise.reject(new Error('WsServer 已 disposed，无法发送请求'));
    }

    return new Promise<ToolResultPayload>((resolve, reject) => {
      // 设置超时定时器
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.outputChannel.appendLine(
          `[WsServer] sendAndWait 超时: requestId=${requestId} (${timeoutMs}ms)`,
        );
        reject(new Error(`tool_execute 超时 (${timeoutMs}ms): requestId=${requestId}`));
      }, timeoutMs);

      // 存入待响应 Map
      this.pendingRequests.set(requestId, { resolve, reject, timer });

      // 发送消息
      this.send(ws, msg);

      this.outputChannel.appendLine(
        `[WsServer] sendAndWait 已发送: requestId=${requestId}, timeout=${timeoutMs}ms`,
      );
    });
  }

  /**
   * 启动心跳检测定时器（单客户端模式）。
   * 每 30 秒检测 activeClient：
   * - 如果上次 ping 后未收到 pong（isClientAlive=false），说明是死连接 → terminate
   * - 否则标记 isClientAlive=false 并发送 ping，等待下次检测周期收到 pong
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (!this.activeClient) {
        return;
      }
      if (!this.isClientAlive) {
        // 上次 ping 后未收到 pong，判定为死连接
        this.outputChannel.appendLine(
          '[WsServer] 心跳超时，终止死连接',
        );
        this.activeClient.terminate();
        this.activeClient = null;
        this.isClientAlive = false;
        this._onDidChangeState.fire();
        return;
      }
      // 标记为未响应，发送 ping 等待 pong
      this.isClientAlive = false;
      this.activeClient.ping();
    }, WsServer.HEARTBEAT_INTERVAL_MS);
    this.outputChannel.appendLine(
      `[WsServer] 心跳检测已启动 (间隔 ${WsServer.HEARTBEAT_INTERVAL_MS}ms)`,
    );
  }

  /**
   * 停止心跳检测定时器
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 关闭服务端和所有连接
   */
  dispose(): void {
    this._disposed = true;
    this.stopHeartbeat();

    // 清理所有待响应请求，reject 防止 Promise 悬挂
    for (const [requestId, pending] of this.pendingRequests) {
      clearTimeout(pending.timer);
      pending.reject(new Error('WsServer 正在关闭'));
      this.pendingRequests.delete(requestId);
    }

    if (this.wss) {
      if (this.activeClient) {
        this.activeClient.close();
        this.activeClient = null;
      }
      this.isClientAlive = false;
      this.wss.close();
      this.wss = null;
      this._listening = false;
      this._onDidChangeState.fire();
      this.outputChannel.appendLine('[WsServer] 服务端已关闭');
    }
    this._onDidChangeState.dispose();
  }
}
