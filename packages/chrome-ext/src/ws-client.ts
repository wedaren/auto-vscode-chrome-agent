// ws-client.ts — WebSocket 客户端，负责与 VSCode 插件的双向通信
// 提供自动重连（指数退避 + jitter）、心跳检测、完整连接状态机、消息类型校验
//
// === 连接状态机 ===
// disconnected → connecting → connected ⇄ reconnecting → failed
// 心跳：每 15 秒发送 ping，10 秒内未收到 pong 或任何业务消息则判定失效并触发重连
// 心跳容错：收到任何有效 BridgeMessage（不限于 pong）都会重置超时计时器
// 重连：指数退避 1s→2s→4s→8s→...→max30s + 随机 jitter，最多 10 次
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
// 心跳类：heartbeat_ping / heartbeat_pong（内部使用，区别于业务 ping/pong）

/** Chrome ↔ VSCode 桥接消息协议（与 VSCode 侧 BridgeMessage 保持一致） */
export interface BridgeMessage {
  type: string;
  payload: unknown;
  sessionId: string;
}

/** 完整连接状态机：disconnected → connecting → connected ⇄ reconnecting → failed */
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

/** 连接详情信息（供 UI 状态面板展示） */
export interface ConnectionDetails {
  /** 当前连接状态 */
  state: ConnectionState;
  /** 已重连次数 */
  reconnectCount: number;
  /** 最后活跃时间（最后收到消息的时间戳，0 表示从未活跃） */
  lastActiveTime: number;
  /** 心跳延迟（ms），-1 表示无数据 */
  latency: number;
  /** WebSocket 服务端地址 */
  url: string;
}

/** 重连指数退避常量 */
const BASE_RECONNECT_INTERVAL = 1000;   // 首次重连等待 1s
const MAX_RECONNECT_INTERVAL = 30_000;  // 指数退避上限 30s
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
/** 重连日志合并：首次 / 每 5 次 / 最后一次 打印 */
const RECONNECT_LOG_INTERVAL = 5;

export interface WsClientOptions {
  /** WebSocket 服务端地址，默认 ws://localhost:7777 */
  url?: string;
  /** 重连基准间隔（毫秒），默认 1000，实际间隔按指数退避计算 */
  reconnectInterval?: number;
  /** 最大重连次数，默认 10 */
  maxReconnectAttempts?: number;
  /** 心跳发送间隔（毫秒），默认 15000 */
  heartbeatInterval?: number;
  /** 心跳超时（毫秒），默认 10000 */
  heartbeatTimeout?: number;
}

type MessageHandler = (msg: BridgeMessage) => void;
type StateHandler = (state: ConnectionState) => void;

/**
 * WsClient 封装浏览器原生 WebSocket，提供：
 * - 自动重连 + 手动重连
 * - 心跳检测（ping/pong）
 * - 完整连接状态机（disconnected/connecting/connected/reconnecting/failed）
 * - BridgeMessage 协议收发 + 入站消息类型校验
 * - 连接详情查询（重连次数、延迟、最后活跃时间）
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

  // --- 心跳相关 ---
  private heartbeatInterval: number;
  private heartbeatTimeout: number;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private lastPingSentAt = 0;
  private _latency = -1;
  private _lastActiveTime = 0;

  // --- 可见性感知重连 ---
  private _pausedByVisibility = false;
  private readonly boundVisibilityHandler: () => void;

  private messageHandlers: Set<MessageHandler> = new Set();
  private stateHandlers: Set<StateHandler> = new Set();
  private currentState: ConnectionState = 'disconnected';

  constructor(options: WsClientOptions = {}) {
    this.url = options.url ?? 'ws://localhost:7777';
    this.reconnectInterval = options.reconnectInterval ?? BASE_RECONNECT_INTERVAL;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? DEFAULT_MAX_RECONNECT_ATTEMPTS;
    this.heartbeatInterval = options.heartbeatInterval ?? 15000;
    this.heartbeatTimeout = options.heartbeatTimeout ?? 10000;
    this.sessionId = crypto.randomUUID();

    // 可见性感知重连：Side Panel 隐藏时暂停重连，可见时立即恢复
    this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.boundVisibilityHandler);
    }
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

  /** 获取连接详情（供 UI 状态面板展示） */
  get details(): ConnectionDetails {
    return {
      state: this.currentState,
      reconnectCount: this.reconnectCount,
      lastActiveTime: this._lastActiveTime,
      latency: this._latency,
      url: this.url,
    };
  }

  /** 连接到 WebSocket 服务端（已连接或正在连接时跳过，防止重复连接） */
  connect(): void {
    if (this.disposed) return;

    // 连接去重：已处于 OPEN 或 CONNECTING 状态时直接跳过，防止重复连接
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        console.log('[WsClient] already connected, skipping connect()');
        return;
      }
      if (this.ws.readyState === WebSocket.CONNECTING) {
        console.log('[WsClient] already connecting, skipping connect()');
        return;
      }
    }

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
      const wasReconnecting = this.reconnectCount > 0;
      if (wasReconnecting) {
        console.log(`[WsClient] 重连成功（经过 ${this.reconnectCount} 次尝试），已连接到 ${this.url}`);
      } else {
        console.log('[WsClient] 已连接到', this.url);
      }
      this.reconnectCount = 0;
      this.setState('connected');
      this._lastActiveTime = Date.now();

      // 发送 ping 确认连接
      this.send({ type: 'ping', payload: null, sessionId: this.sessionId });

      // 启动心跳
      this.startHeartbeat();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string);

        // 入站消息基础类型校验：必须包含 type 字段
        if (!msg || typeof msg.type !== 'string') {
          console.warn('[WsClient] 收到无效消息（缺少 type 字段），已丢弃:', msg);
          return;
        }

        const bridgeMsg = msg as BridgeMessage;

        // 更新最后活跃时间
        this._lastActiveTime = Date.now();

        // ★ 心跳容错：收到任何有效业务消息时重置 pong 超时计时器
        // 只要有数据流动就认为连接存活，避免 Agent 执行期间误判断连
        this.resetPongTimeout();

        // 处理心跳 pong 响应（内部消息，不分发给外部 handler）
        if (bridgeMsg.type === 'heartbeat_pong' || bridgeMsg.type === 'pong') {
          this.handlePong();
          // pong 消息仍然分发，业务层可能需要
          if (bridgeMsg.type === 'pong') {
            console.log('[WsClient] 收到消息:', bridgeMsg.type);
            for (const handler of this.messageHandlers) {
              handler(bridgeMsg);
            }
          }
          return;
        }

        console.log('[WsClient] 收到消息:', bridgeMsg.type);
        for (const handler of this.messageHandlers) {
          handler(bridgeMsg);
        }
      } catch (err) {
        console.error('[WsClient] 消息解析失败:', err);
      }
    };

    this.ws.onclose = () => {
      console.log('[WsClient] 连接已断开');
      this.stopHeartbeat();
      // 如果之前是 connected 状态，切换到 reconnecting（而非直接 disconnected）
      if (this.currentState === 'connected') {
        this.setState('reconnecting');
      } else if (this.currentState !== 'failed') {
        this.setState('disconnected');
      }
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('[WsClient] 连接错误:', err);
      // onclose 会在 onerror 后触发，无需重复处理
    };
  }

  /** 手动重连（供 UI 按钮调用，重置重连计数并立即连接） */
  reconnect(): void {
    if (this.disposed) return;
    // 清除已有的重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectCount = 0;
    this._latency = -1;
    console.log('[WsClient] 手动重连...');
    this.connect();
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
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    // 移除可见性监听器
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    }
    this.cleanup();
    this.messageHandlers.clear();
    this.stateHandlers.clear();
  }

  // --- 心跳机制 ---

  /** 启动心跳定时器：每 heartbeatInterval 发送一次 heartbeat_ping */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeatPing();
    }, this.heartbeatInterval);
  }

  /** 停止心跳 */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.pongTimeoutTimer) {
      clearTimeout(this.pongTimeoutTimer);
      this.pongTimeoutTimer = null;
    }
  }

  /** 发送心跳 ping 并启动超时检测 */
  private sendHeartbeatPing(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.lastPingSentAt = Date.now();
    this.send({ type: 'heartbeat_ping', payload: { timestamp: this.lastPingSentAt }, sessionId: this.sessionId });

    // 启动 pong 超时检测（复用 resetPongTimeout 统一管理超时计时器）
    this.resetPongTimeout();
  }

  /**
   * 重置 pong 超时计时器：收到任何有效业务消息时调用
   * 只要有数据流动（不限于 pong），就认为连接存活，
   * 避免 Agent 执行期间 VSCode 忙于 LLM 调用导致心跳超时误判断连
   */
  private resetPongTimeout(): void {
    // 清除现有超时
    if (this.pongTimeoutTimer) {
      clearTimeout(this.pongTimeoutTimer);
      this.pongTimeoutTimer = null;
    }
    // 仅在心跳运行中才重新启动超时计时器（连接断开后不再重启）
    if (this.heartbeatTimer) {
      this.pongTimeoutTimer = setTimeout(() => {
        this.pongTimeoutTimer = null;
        console.warn('[WsClient] 心跳超时，未收到 pong 或任何业务消息，判定连接失效');
        this._latency = -1;
        this.cleanup();
        this.setState('reconnecting');
        this.scheduleReconnect();
      }, this.heartbeatTimeout);
    }
  }

  /** 处理 pong 响应：计算延迟 + 重置超时计时器 */
  private handlePong(): void {
    this.resetPongTimeout();
    if (this.lastPingSentAt > 0) {
      this._latency = Date.now() - this.lastPingSentAt;
    }
  }

  // --- 可见性感知重连 ---

  /**
   * 处理 document.visibilitychange 事件：
   * - hidden：暂停重连（清除 reconnectTimer，标记 _pausedByVisibility）
   * - visible：若未连接则重置计数并立即重连
   */
  private handleVisibilityChange(): void {
    if (this.disposed) return;

    if (document.visibilityState === 'hidden') {
      // Side Panel 隐藏：暂停重连，节省资源
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      this._pausedByVisibility = true;
      console.log('[WsClient] Side Panel 隐藏，暂停重连');
    } else if (document.visibilityState === 'visible') {
      // Side Panel 恢复可见：若非连接状态则立即重连
      this._pausedByVisibility = false;
      console.log('[WsClient] Side Panel 可见');
      if (this.currentState !== 'connected' && this.currentState !== 'connecting') {
        console.log('[WsClient] 可见性恢复，重置计数并立即重连');
        this.reconnectCount = 0;
        this.connect();
      }
    }
  }

  // --- 内部方法 ---

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

  /**
   * 指数退避重连：delay = min(base * 2^count, MAX_RECONNECT_INTERVAL) + jitter
   * 日志合并：仅首次、每 RECONNECT_LOG_INTERVAL 次、最后一次打印
   */
  private scheduleReconnect(): void {
    if (this.disposed) return;
    // 可见性感知：Side Panel 隐藏时不调度重连，等待 visible 事件恢复
    if (this._pausedByVisibility) {
      console.log('[WsClient] Side Panel 隐藏中，跳过重连调度');
      return;
    }
    if (this.reconnectCount >= this.maxReconnectAttempts) {
      console.log(`[WsClient] 已达最大重连次数 (${this.maxReconnectAttempts})，停止重连`);
      this.setState('failed');
      return;
    }
    this.reconnectCount++;

    // 指数退避：base * 2^(count-1)，上限 MAX_RECONNECT_INTERVAL
    const exponentialDelay = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectCount - 1),
      MAX_RECONNECT_INTERVAL,
    );
    // 随机 jitter：±25% 防止定时器对齐导致重连风暴
    const jitter = exponentialDelay * (0.75 + Math.random() * 0.5);
    const delay = Math.round(jitter);

    // 合并重连日志：首次 / 每 N 次 / 最后一次
    const isFirst = this.reconnectCount === 1;
    const isLast = this.reconnectCount === this.maxReconnectAttempts;
    const isNth = this.reconnectCount % RECONNECT_LOG_INTERVAL === 0;
    if (isFirst || isLast || isNth) {
      console.log(
        `[WsClient] 第 ${this.reconnectCount}/${this.maxReconnectAttempts} 次重连，${delay}ms 后尝试...`,
      );
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }
}
