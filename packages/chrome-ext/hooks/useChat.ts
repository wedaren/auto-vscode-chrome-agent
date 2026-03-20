// useChat.ts — 自定义 Hook：封装 messages 状态、isStreaming、streamingMsgIdRef、handleSendMessage、handleCancel 逻辑
import { useState, useRef, useCallback } from 'react';
import type { BridgeMessage } from '../src/ws-client';
import { createMessage, type Message } from '../utils/message-factory';

// 从 message-factory 统一导出 Message 类型
export type { Message } from '../utils/message-factory';

/** 页面上下文（发送消息时附加） */
interface ChatContext {
  url: string;
  title: string;
  selectedText: string;
}

/** useChat Hook 配置项 */
interface UseChatOptions {
  /** WebSocket 消息发送函数（来自 useWebSocket） */
  sendMessage: (type: string, payload: unknown) => boolean;
}

/** useChat Hook 返回值 */
export interface UseChatReturn {
  /** 消息列表 */
  messages: Message[];
  /** 是否正在流式接收 */
  isStreaming: boolean;
  /** 当前流式消息 ID ref（用于 TypingIndicator 显示判断） */
  streamingMsgIdRef: React.RefObject<string | null>;
  /** 发送用户消息 */
  handleSendMessage: (content: string, context?: ChatContext) => void;
  /** 取消当前流式生成 */
  handleCancel: () => void;
  /** 处理来自 WebSocket 的聊天相关消息（chat_response / chat_response_chunk / chat_response_end / echo） */
  handleChatMessage: (msg: BridgeMessage) => void;
  /** 重置流式状态（WebSocket 断连时调用，防止 UI 锁死） */
  resetStreamingState: () => void;
}

/**
 * 聊天消息管理 Hook
 *
 * 职责：
 * - messages 状态管理（添加用户消息、创建/更新 assistant 消息）
 * - isStreaming 状态管理（流式接收中 / 发送失败恢复 / 断连恢复）
 * - streamingMsgIdRef 生命周期管理
 * - 处理 4 种聊天相关 WebSocket 消息
 * - 发送消息（附加页面上下文）
 * - 取消流式生成
 */
export function useChat({ sendMessage }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingMsgIdRef = useRef<string | null>(null);

  /** 处理来自 WebSocket 的聊天相关消息 */
  const handleChatMessage = useCallback((msg: BridgeMessage) => {
    switch (msg.type) {
      case 'chat_response': {
        // 兼容旧式全量响应
        setMessages((prev) => [...prev, createMessage('assistant', String(msg.payload ?? ''))]);
        break;
      }
      case 'chat_response_chunk': {
        // 流式响应：增量追加到当前 assistant message
        const chunkPayload = msg.payload as { text: string; done: boolean };
        const fragment = chunkPayload?.text ?? '';

        if (!streamingMsgIdRef.current) {
          // 首个 chunk：创建新的 assistant message
          const newMsg = createMessage('assistant', fragment);
          streamingMsgIdRef.current = newMsg.id;
          setIsStreaming(true);
          setMessages((prev) => [...prev, newMsg]);
        } else {
          // 后续 chunk：追加到已有消息
          const targetId = streamingMsgIdRef.current;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === targetId ? { ...m, content: m.content + fragment } : m,
            ),
          );
        }
        break;
      }
      case 'chat_response_end': {
        // 流式结束：标记完成，清除流式状态
        const endPayload = msg.payload as { fullText?: string; cancelled?: boolean };
        const targetId = streamingMsgIdRef.current;

        if (targetId && typeof endPayload?.fullText === 'string') {
          // 用服务端的完整文本校正最终内容（防止丢片段，兼容空字符串场景）
          setMessages((prev) =>
            prev.map((m) =>
              m.id === targetId ? { ...m, content: endPayload.fullText! } : m,
            ),
          );
        }

        streamingMsgIdRef.current = null;
        setIsStreaming(false);
        console.log(
          '[useChat] 流式响应结束',
          endPayload?.cancelled ? '(已取消)' : '',
        );
        break;
      }
      case 'echo': {
        // 服务端回显消息
        setMessages((prev) => [...prev, createMessage('assistant', String(msg.payload ?? ''))]);
        break;
      }
    }
  }, []);

  /** 发送用户消息 */
  const handleSendMessage = useCallback(
    (content: string, context?: ChatContext) => {
      // 流式生成中不允许发送新消息
      if (isStreaming) return;

      setMessages((prev) => [...prev, createMessage('user', content)]);

      // 进入等待状态（TypingIndicator 立即显示）
      setIsStreaming(true);

      // 通过 WebSocket 发送到 VSCode 侧，附加页面上下文
      const sent = sendMessage('chat', {
        text: content,
        context: context
          ? {
              url: context.url,
              title: context.title,
              selectedText: context.selectedText,
            }
          : undefined,
      });

      if (!sent) {
        // 发送失败：恢复 isStreaming 状态并显示错误提示
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          createMessage('assistant', '\u26A0\uFE0F 消息发送失败，请检查 WebSocket 连接状态。'),
        ]);
      }
    },
    [isStreaming, sendMessage],
  );

  /** 取消当前流式生成 */
  const handleCancel = useCallback(() => {
    if (isStreaming) {
      sendMessage('cancel_chat', null);
      console.log('[useChat] 已发送 cancel_chat');
    }
  }, [isStreaming, sendMessage]);

  /** 重置流式状态（WebSocket 断连时调用，防止 UI 锁死） */
  const resetStreamingState = useCallback(() => {
    if (streamingMsgIdRef.current) {
      streamingMsgIdRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return {
    messages,
    isStreaming,
    streamingMsgIdRef,
    handleSendMessage,
    handleCancel,
    handleChatMessage,
    resetStreamingState,
  };
}
