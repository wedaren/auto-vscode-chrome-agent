// useWebSocket.ts — 自定义 Hook：封装 WsClient 初始化、连接状态管理、消息分发和断连恢复
// 集成 tool_execute / tool_result 工具调用协议（不阻塞聊天 UI）
// 同时支持 skill_list / skill_list_result / skill_execute / skill_progress / skill_complete 消息
// （Skill 相关消息通过 onMessage 分发到 SkillPanel 组件处理）
// 暴露手动重连方法和连接详情（重连次数、延迟、最后活跃时间）供 UI 展示
// 优化：connectionDetails 使用浅比较，仅在 state/reconnectCount/latency 实际变化时才触发 setState，
//       避免每条消息都产生不必要的 React 重渲染
import { useState, useRef, useEffect, useCallback } from 'react';
import { WsClient, type BridgeMessage, type ConnectionState, type ConnectionDetails } from '../src/ws-client';
import { createToolBridgeHandler } from '../utils/tool-bridge';

/**
 * ConnectionDetails 浅比较：仅比较会影响 UI 渲染的关键字段
 * （state / reconnectCount / latency / url）
 * lastActiveTime 每条消息都变化但不影响 UI 渲染逻辑，跳过比较以减少无意义的 setState 调用
 */
function shallowEqualDetails(prev: ConnectionDetails, next: ConnectionDetails): boolean {
  return (
    prev.state === next.state &&
    prev.reconnectCount === next.reconnectCount &&
    prev.latency === next.latency &&
    prev.url === next.url
  );
}

/** useWebSocket Hook 返回值 */
export interface UseWebSocketReturn {
  /** 是否已连接 */
  isConnected: boolean;
  /** 当前连接状态（disconnected / connecting / connected / reconnecting / failed） */
  connectionState: ConnectionState;
  /** 连接详情信息（重连次数、延迟、最后活跃时间） */
  connectionDetails: ConnectionDetails;
  /** 发送消息到 VSCode 侧，返回是否发送成功 */
  sendMessage: (type: string, payload: unknown) => boolean;
  /** 注册消息监听器，返回取消注册函数 */
  onMessage: (handler: (msg: BridgeMessage) => void) => () => void;
  /** 手动重连（重置重连计数并立即发起连接） */
  reconnect: () => void;
}

/**
 * WebSocket 连接管理 Hook
 *
 * 职责：
 * - WsClient 初始化与生命周期管理
 * - 连接状态跟踪（disconnected / connecting / connected / reconnecting / failed）
 * - 消息分发：注册多个监听器，收到消息时逐一通知
 * - 断连自动重连（由 WsClient 内部处理）+ 手动重连
 * - tool_execute 消息自动处理：收到 VSCode 发来的 tool_execute 时，
 *   通过 tool-bridge 调用 background EXECUTE_ACTION 并发回 tool_result（不阻塞聊天 UI）
 * - 连接详情暴露：重连次数、心跳延迟、最后活跃时间
 */
export function useWebSocket(url: string): UseWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>({
    state: 'disconnected',
    reconnectCount: 0,
    lastActiveTime: 0,
    latency: -1,
    url,
  });
  const wsClientRef = useRef<WsClient | null>(null);
  const messageListenersRef = useRef<Set<(msg: BridgeMessage) => void>>(new Set());
  /** 缓存上一次 connectionDetails，用于浅比较避免不必要的 setState */
  const prevDetailsRef = useRef<ConnectionDetails>(connectionDetails);

  const isConnected = connectionState === 'connected';

  /** 发送消息到 VSCode 侧（try-catch 防护，防止序列化或发送异常导致调用方崩溃） */
  const sendMessage = useCallback((type: string, payload: unknown): boolean => {
    try {
      return wsClientRef.current?.sendMessage(type, payload) ?? false;
    } catch (err) {
      console.error('[useWebSocket] sendMessage 发送失败:', err, '类型:', type);
      return false;
    }
  }, []);

  /** 注册消息监听器，返回取消注册函数 */
  const onMessage = useCallback((handler: (msg: BridgeMessage) => void): (() => void) => {
    messageListenersRef.current.add(handler);
    return () => {
      messageListenersRef.current.delete(handler);
    };
  }, []);

  /** 手动重连 */
  const reconnect = useCallback(() => {
    wsClientRef.current?.reconnect();
  }, []);

  // 初始化 WsClient，管理连接生命周期
  useEffect(() => {
    const client = new WsClient({ url });
    wsClientRef.current = client;

    // 创建 tool_execute 消息处理器（自动处理工具调用，不阻塞聊天 UI）
    const toolBridgeHandler = createToolBridgeHandler((type, payload) => {
      return client.sendMessage(type, payload);
    });

    // 监听连接状态变化 + 浅比较后同步更新连接详情（避免不必要的重渲染）
    const unsubState = client.onStateChange((state: ConnectionState) => {
      setConnectionState(state);
      const nextDetails = { ...client.details };
      if (!shallowEqualDetails(prevDetailsRef.current, nextDetails)) {
        prevDetailsRef.current = nextDetails;
        setConnectionDetails(nextDetails);
      }
    });

    // 将 WsClient 消息分发给所有已注册的监听器 + tool bridge（try-catch 防护每个 handler）
    const unsubMsg = client.onMessage((msg: BridgeMessage) => {
      // 浅比较 connectionDetails：仅在 state/reconnectCount/latency 实际变化时才 setState
      // lastActiveTime 每条消息都变但不影响 UI，跳过以避免无意义的重渲染
      const nextDetails = { ...client.details };
      if (!shallowEqualDetails(prevDetailsRef.current, nextDetails)) {
        prevDetailsRef.current = nextDetails;
        setConnectionDetails(nextDetails);
      }

      // tool_execute 消息由 tool bridge 自动处理（异步，不阻塞）
      try {
        toolBridgeHandler(msg);
      } catch (err) {
        console.error('[useWebSocket] toolBridgeHandler 处理异常:', err);
      }

      // 其他消息分发给所有已注册的监听器（聊天 UI 等）
      for (const handler of messageListenersRef.current) {
        try {
          handler(msg);
        } catch (err) {
          console.error('[useWebSocket] 消息监听器处理异常:', err);
        }
      }
    });

    client.connect();

    return () => {
      unsubState();
      unsubMsg();
      client.dispose();
      wsClientRef.current = null;
    };
  }, [url]);

  return { isConnected, connectionState, connectionDetails, sendMessage, onMessage, reconnect };
}
