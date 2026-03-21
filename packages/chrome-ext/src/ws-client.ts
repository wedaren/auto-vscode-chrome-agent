// ws-client.ts — WebSocket 客户端，负责与 VSCode 插件的双向通信
// 提供自动重连、消息收发、连接状态回调
//
// === 支持的消息类型 ===
// 聊天类：ping/pong, chat, chat_response_chunk, chat_response_end
// 模型类：list_models, models_list, select_model, model_selected
// Agent 类：agent_step, agent_complete
// 工具调用类（双向工具协议）：
//   tool_execute  — VSCode → Chrome：请求执行浏览器操作
//                   payload: { requestId, toolName, toolArgs }
//   tool_result   — Chrome → VSCode：返回工具执行结果
//                   payload: { requestId, success, data, error }
// Skill 类（Skill 面板协议）：
//   skill_list         — Chrome → VSCode：请求可用 Skill 列表
//   skill_list_result  — VSCode → Chrome：返回 Skill 数组
//                        payload: { skills: Skill[] }
//   skill_execute      — Chrome → VSCode：触发 Skill 执行
//                        payload: { skillName, params }
//   skill_progress     — VSCode → Chrome：每步进度推送
//                        payload: { skillName, stepIndex, totalSteps, status, description, result? }
//   skill_complete     — VSCode → Chrome：执行完成/失败
//                        payload: { skillName, success, summary }

/** Chrome ↔ VSCode 桥接消息协议（与 VSCode 侧 BridgeMessage 保持一致） */
export interface BridgeMessage {
  type: string;
  payload: unknown;
  sessionId: string;
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected';

export interface WsClientOptions {
  /** WebSocket 服务端地址，默认 ws://localhost:7777 */
  url?: string;
  /** 自动重连间隔（毫秒），默认 3000 */
  reconnectInterval?: number;
  /** 最大重连次数，默认 Infinity */
  maxReconnectAttempts?: number;
}

type MessageHandler = (msg: BridgeMessage) => void;
type StateHandler = (state: ConnectionState) => void;

/**
 * WsClient 封装浏览器原生 WebSocket，提供：
 * - 自动重连
 * - BridgeMessage 协议收发
 * - 连接状态回调
 */
export class WsClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;
  private sessionId: string;

  private messageHandlers: Set<MessageHandler> = new Set();
  private stateHandlers: Set<StateHandler> = new Set();
  private currentState: ConnectionState = 'disconnected';

  constructor(options: WsClientOptions = {}) {
    this.url = options.url ?? 'ws://localhost:7777';
    this.reconnectInterval = options.reconnectInterval ?? 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? Infinity;
    this.sessionId = crypto.randomUUID();
  }

  /** 注册消息回调 */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /** 注册连接状态变化回调 */
  onStateChange(handler: StateHandler): () => void {
    this.stateHandlers.add(handler);
    return () => this.stateHandlers.delete(handler);
  }

  /** 当前连接状态 */
  get state(): ConnectionState {
    return this.currentState;
  }

  /** 当前 session ID */
  get session(): string {
    return this.sessionId;
  }

  /** 连接到 WebSocket 服务端 */
  connect(): void {
    if (this.disposed) return;
    this.cleanup();
    this.setState('connecting');

    try {
      this.ws = new WebSocket(this.url);
    } catch {
      console.error('[WsClient] WebSocket 构造失败');
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.log('[WsClient] 已连接到', this.url);
      this.reconnectCount = 0;
      this.setState('connected');

      // 发送 ping 确认连接
      this.send({ type: 'ping', payload: null, sessionId: this.sessionId });
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string) as BridgeMessage;
        console.log('[WsClient] 收到消息:', msg.type);
        for (const handler of this.messageHandlers) {
          handler(msg);
        }
      } catch (err) {
        console.error('[WsClient] 消息解析失败:', err);
      }
    };

    this.ws.onclose = () => {
      console.log('[WsClient] 连接已断开');
      this.setState('disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('[WsClient] 连接错误:', err);
      // onclose 会在 onerror 后触发，无需重复处理
    };
  }

  /** 发送 BridgeMessage */
  send(msg: BridgeMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[WsClient] 未连接，无法发送消息');
      return false;
    }
    this.ws.send(JSON.stringify(msg));
    return true;
  }

  /** 发送便捷方法：自动填充 sessionId */
  sendMessage(type: string, payload: unknown): boolean {
    return this.send({ type, payload, sessionId: this.sessionId });
  }

  /** 断开连接并释放资源 */
  dispose(): void {
    this.disposed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.cleanup();
    this.messageHandlers.clear();
    this.stateHandlers.clear();
  }

  private cleanup(): void {
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
  }

  private setState(state: ConnectionState): void {
    if (this.currentState === state) return;
    this.currentState = state;
    for (const handler of this.stateHandlers) {
      handler(state);
    }
  }

  private scheduleReconnect(): void {
    if (this.disposed) return;
    if (this.reconnectCount >= this.maxReconnectAttempts) {
      console.log('[WsClient] 已达最大重连次数，停止重连');
      return;
    }
    this.reconnectCount++;
    console.log(
      `[WsClient] ${this.reconnectInterval}ms 后第 ${this.reconnectCount} 次重连...`,
    );
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectInterval);
  }
}
