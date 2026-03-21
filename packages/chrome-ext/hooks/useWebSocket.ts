// useWebSocket.ts — 自定义 Hook：封装 WsClient 初始化、连接状态管理、消息分发和断连恢复
// 集成 tool_execute / tool_result 工具调用协议（不阻塞聊天 UI）
// 同时支持 skill_list / skill_list_result / skill_execute / skill_progress / skill_complete 消息
// （Skill 相关消息通过 onMessage 分发到 SkillPanel 组件处理）
import { useState, useRef, useEffect, useCallback } from 'react';
import { WsClient, type BridgeMessage, type ConnectionState } from '../src/ws-client';
import { createToolBridgeHandler } from '../utils/tool-bridge';

/** useWebSocket Hook 返回值 */
export interface UseWebSocketReturn {
  /** 是否已连接 */
  isConnected: boolean;
  /** 当前连接状态（connecting / connected / disconnected） */
  connectionState: ConnectionState;
  /** 发送消息到 VSCode 侧，返回是否发送成功 */
  sendMessage: (type: string, payload: unknown) => boolean;
  /** 注册消息监听器，返回取消注册函数 */
  onMessage: (handler: (msg: BridgeMessage) => void) => () => void;
}

/**
 * WebSocket 连接管理 Hook
 *
 * 职责：
 * - WsClient 初始化与生命周期管理
 * - 连接状态跟踪（connecting / connected / disconnected）
 * - 消息分发：注册多个监听器，收到消息时逐一通知
 * - 断连自动重连（由 WsClient 内部处理）
 * - tool_execute 消息自动处理：收到 VSCode 发来的 tool_execute 时，
 *   通过 tool-bridge 调用 background EXECUTE_ACTION 并发回 tool_result（不阻塞聊天 UI）
 */
export function useWebSocket(url: string): UseWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const wsClientRef = useRef<WsClient | null>(null);
  const messageListenersRef = useRef<Set<(msg: BridgeMessage) => void>>(new Set());

  const isConnected = connectionState === 'connected';

  /** 发送消息到 VSCode 侧 */
  const sendMessage = useCallback((type: string, payload: unknown): boolean => {
    return wsClientRef.current?.sendMessage(type, payload) ?? false;
  }, []);

  /** 注册消息监听器，返回取消注册函数 */
  const onMessage = useCallback((handler: (msg: BridgeMessage) => void): (() => void) => {
    messageListenersRef.current.add(handler);
    return () => {
      messageListenersRef.current.delete(handler);
    };
  }, []);

  // 初始化 WsClient，管理连接生命周期
  useEffect(() => {
    const client = new WsClient({ url });
    wsClientRef.current = client;

    // 创建 tool_execute 消息处理器（自动处理工具调用，不阻塞聊天 UI）
    const toolBridgeHandler = createToolBridgeHandler((type, payload) => {
      return client.sendMessage(type, payload);
    });

    // 监听连接状态变化
    const unsubState = client.onStateChange((state: ConnectionState) => {
      setConnectionState(state);
    });

    // 将 WsClient 消息分发给所有已注册的监听器 + tool bridge
    const unsubMsg = client.onMessage((msg: BridgeMessage) => {
      // tool_execute 消息由 tool bridge 自动处理（异步，不阻塞）
      toolBridgeHandler(msg);

      // 其他消息分发给所有已注册的监听器（聊天 UI 等）
      for (const handler of messageListenersRef.current) {
        handler(msg);
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

  return { isConnected, connectionState, sendMessage, onMessage };
}
