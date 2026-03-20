// useWebSocket.ts — 自定义 Hook：封装 WsClient 初始化、连接状态管理、消息分发和断连恢复
import { useState, useRef, useEffect, useCallback } from 'react';
import { WsClient, type BridgeMessage, type ConnectionState } from '../src/ws-client';

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

    // 监听连接状态变化
    const unsubState = client.onStateChange((state: ConnectionState) => {
      setConnectionState(state);
    });

    // 将 WsClient 消息分发给所有已注册的监听器
    const unsubMsg = client.onMessage((msg: BridgeMessage) => {
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
