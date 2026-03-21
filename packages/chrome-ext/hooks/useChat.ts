// useChat.ts — 自定义 Hook：封装 messages 状态、isStreaming、streamingMsgIdRef、handleSendMessage、handleCancel 逻辑
// 支持普通聊天流式响应 + Agent 模式（agent_step / agent_complete）消息处理
// 集成 useChatStorage 实现消息持久化：页面刷新后自动恢复会话
import { useState, useRef, useCallback, useEffect } from 'react';
import type { BridgeMessage } from '../src/ws-client';
import { createMessage, type Message } from '../utils/message-factory';
import type { AgentStep } from '../components/AgentStepView';
import { useChatStorage, type Conversation } from './useChatStorage';

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
  /** 当前会话 ID（持久化标识） */
  conversationId: string;
  /** 当前流式消息 ID ref（用于 TypingIndicator 显示判断） */
  streamingMsgIdRef: React.RefObject<string | null>;
  /** 发送用户消息 */
  handleSendMessage: (content: string, context?: ChatContext) => void;
  /** 取消当前流式生成 */
  handleCancel: () => void;
  /** 处理来自 WebSocket 的聊天相关消息（chat_response / chat_response_chunk / chat_response_end / echo / agent_step / agent_complete） */
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
 * - 处理 6 种聊天相关 WebSocket 消息（含 agent_step / agent_complete）
 * - 发送消息（附加页面上下文）
 * - 取消流式生成
 */
export function useChat({ sendMessage }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingMsgIdRef = useRef<string | null>(null);

  // --- 持久化：useChatStorage 集成 ---
  const { saveConversation, loadConversation, listConversations } = useChatStorage();
  const conversationIdRef = useRef<string>(crypto.randomUUID());
  const conversationCreatedAtRef = useRef<number>(Date.now());
  const isStorageInitializedRef = useRef(false);

  // 挂载时加载最近一次会话
  useEffect(() => {
    (async () => {
      try {
        const convList = await listConversations();
        if (convList.length > 0) {
          const latestMeta = convList[0]; // 已按 updatedAt 降序排列
          const conv = await loadConversation(latestMeta.id);
          if (conv && conv.messages.length > 0) {
            conversationIdRef.current = conv.id;
            conversationCreatedAtRef.current = conv.createdAt;
            setMessages(conv.messages);
            console.log('[useChat] 已恢复会话:', conv.id, conv.title);
          }
        }
      } catch (err) {
        console.error('[useChat] 加载会话失败:', err);
      } finally {
        isStorageInitializedRef.current = true;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 消息变更时自动持久化（防抖 500ms，避免流式 chunk 频繁写入）
  useEffect(() => {
    if (!isStorageInitializedRef.current) return;
    if (messages.length === 0) return;

    const timer = setTimeout(() => {
      const conversation: Conversation = {
        id: conversationIdRef.current,
        title: '', // saveConversation 内部自动生成
        messages,
        createdAt: conversationCreatedAtRef.current,
        updatedAt: Date.now(),
      };
      saveConversation(conversation);
    }, 500);

    return () => clearTimeout(timer);
  }, [messages, saveConversation]);

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

      case 'agent_step': {
        // Agent ReAct 循环步骤：追加到当前 assistant message 的 steps 数组
        const stepPayload = msg.payload as AgentStep;
        if (!stepPayload) break;

        if (!streamingMsgIdRef.current) {
          // 首个 agent_step：创建新的 agent 模式 assistant message
          const newMsg = createMessage('assistant', '', {
            isAgentMode: true,
            steps: [stepPayload],
          });
          streamingMsgIdRef.current = newMsg.id;
          setIsStreaming(true);
          setMessages((prev) => [...prev, newMsg]);
        } else {
          // 后续 agent_step：追加步骤到已有消息的 steps 数组
          const targetId = streamingMsgIdRef.current;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === targetId
                ? {
                    ...m,
                    isAgentMode: true,
                    steps: [...(m.steps ?? []), stepPayload],
                  }
                : m,
            ),
          );
        }
        // isStreaming 保持 true，Agent 仍在执行
        break;
      }

      case 'agent_complete': {
        // Agent 循环结束：设置 finalAnswer 为 content，标记 isStreaming=false
        const completePayload = msg.payload as { content?: string; cancelled?: boolean };
        const targetId = streamingMsgIdRef.current;

        if (targetId) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === targetId
                ? { ...m, content: completePayload?.content ?? m.content }
                : m,
            ),
          );
        } else if (completePayload?.content) {
          // 没有对应的 streaming message（异常恢复）：直接创建新消息
          setMessages((prev) => [
            ...prev,
            createMessage('assistant', completePayload.content!, { isAgentMode: true }),
          ]);
        }

        streamingMsgIdRef.current = null;
        setIsStreaming(false);
        console.log(
          '[useChat] Agent 循环结束',
          completePayload?.cancelled ? '(已取消)' : '',
        );
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
    conversationId: conversationIdRef.current,
    streamingMsgIdRef,
    handleSendMessage,
    handleCancel,
    handleChatMessage,
    resetStreamingState,
  };
}
