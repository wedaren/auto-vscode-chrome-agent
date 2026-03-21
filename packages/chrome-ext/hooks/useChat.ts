// useChat.ts — 自定义 Hook：封装 messages 状态、isStreaming、streamingMsgIdRef、handleSendMessage、handleCancel 逻辑
// 支持普通聊天流式响应 + Agent 模式（agent_step / agent_complete）消息处理
// 集成 useChatStorage 实现消息持久化：页面刷新后自动恢复会话
// 支持多会话管理：创建新会话、切换会话、删除会话
// 支持消息发送状态跟踪（sending/sent/failed）+ 失败消息一键重试
import { useState, useRef, useCallback, useEffect } from 'react';
import type { BridgeMessage } from '../src/ws-client';
import { createMessage, type Message } from '../utils/message-factory';
import type { AgentStep } from '../components/AgentStepView';
import { useChatStorage, type Conversation, type ConversationMeta } from './useChatStorage';

// 从 message-factory 统一导出 Message 类型
export type { Message } from '../utils/message-factory';
// 导出 ConversationMeta 供 ConversationList 使用
export type { ConversationMeta } from './useChatStorage';

/** 页面上下文（发送消息时附加） */
interface ChatContext {
  url: string;
  title: string;
  selectedText: string;
}

/** Toast 回调类型（由调用方注入，避免 Hook 直接依赖 UI 层） */
export interface ChatToastCallback {
  (options: { type: 'success' | 'error' | 'warning' | 'info'; message: string; action?: { label: string; onClick: () => void } }): void;
}

/** useChat Hook 配置项 */
interface UseChatOptions {
  /** WebSocket 消息发送函数（来自 useWebSocket） */
  sendMessage: (type: string, payload: unknown) => boolean;
  /** Toast 通知回调（可选，用于非阻塞错误提示） */
  onToast?: ChatToastCallback;
}

/** useChat Hook 返回值 */
export interface UseChatReturn {
  /** 消息列表 */
  messages: Message[];
  /** 是否正在流式接收 */
  isStreaming: boolean;
  /** 当前会话 ID（持久化标识） */
  conversationId: string;
  /** 会话列表元数据（用于侧栏展示） */
  conversations: ConversationMeta[];
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
  /** 创建新会话：清空消息、生成新 conversationId */
  createNewConversation: () => void;
  /** 切换到指定会话：加载历史消息 */
  switchConversation: (id: string) => Promise<void>;
  /** 删除指定会话：从存储中移除，若为当前会话则自动切换 */
  deleteConversation: (id: string) => Promise<void>;
  /** 刷新会话列表（手动触发） */
  refreshConversations: () => Promise<void>;
  /** 重试发送失败的消息（一键重试） */
  retryMessage: (messageId: string) => void;
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
export function useChat({ sendMessage, onToast }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const streamingMsgIdRef = useRef<string | null>(null);

  // --- 持久化：useChatStorage 集成 ---
  const { saveConversation, loadConversation, listConversations, deleteConversation: storageDelete } = useChatStorage();
  const conversationIdRef = useRef<string>(crypto.randomUUID());
  const conversationCreatedAtRef = useRef<number>(Date.now());
  const isStorageInitializedRef = useRef(false);

  /** 刷新会话列表元数据 */
  const refreshConversations = useCallback(async () => {
    try {
      const convList = await listConversations();
      setConversations(convList);
    } catch (err) {
      console.error('[useChat] 刷新会话列表失败:', err);
    }
  }, [listConversations]);

  // 挂载时加载最近一次会话 + 会话列表
  useEffect(() => {
    (async () => {
      try {
        const convList = await listConversations();
        setConversations(convList);
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

  // 消息变更时自动持久化（防抖 500ms，避免流式 chunk 频繁写入）+ 刷新会话列表
  useEffect(() => {
    if (!isStorageInitializedRef.current) return;
    if (messages.length === 0) return;

    const timer = setTimeout(async () => {
      const conversation: Conversation = {
        id: conversationIdRef.current,
        title: '', // saveConversation 内部自动生成
        messages,
        createdAt: conversationCreatedAtRef.current,
        updatedAt: Date.now(),
      };
      await saveConversation(conversation);
      // 保存后刷新侧栏列表
      await refreshConversations();
    }, 500);

    return () => clearTimeout(timer);
  }, [messages, saveConversation, refreshConversations]);

  /** 创建新会话：重置消息列表，生成新会话 ID */
  const createNewConversation = useCallback(() => {
    if (isStreaming) return; // 流式生成中不允许切换
    conversationIdRef.current = crypto.randomUUID();
    conversationCreatedAtRef.current = Date.now();
    setMessages([]);
    console.log('[useChat] 新建会话:', conversationIdRef.current);
  }, [isStreaming]);

  /** 切换到指定会话：加载历史消息 */
  const switchConversation = useCallback(async (id: string) => {
    if (isStreaming) return; // 流式生成中不允许切换
    if (id === conversationIdRef.current) return; // 已在当前会话
    try {
      const conv = await loadConversation(id);
      if (conv) {
        conversationIdRef.current = conv.id;
        conversationCreatedAtRef.current = conv.createdAt;
        setMessages(conv.messages);
        console.log('[useChat] 已切换到会话:', conv.id, conv.title);
      }
    } catch (err) {
      console.error('[useChat] 切换会话失败:', err);
    }
  }, [isStreaming, loadConversation]);

  /** 删除指定会话：从存储移除，若为当前会话则自动切换到最近的会话或新建 */
  const handleDeleteConversation = useCallback(async (id: string) => {
    if (isStreaming) return;
    try {
      await storageDelete(id);
      const updatedList = await listConversations();
      setConversations(updatedList);

      // 如果删除的是当前会话，自动切换
      if (id === conversationIdRef.current) {
        if (updatedList.length > 0) {
          // 切换到最近的会话
          const next = await loadConversation(updatedList[0].id);
          if (next) {
            conversationIdRef.current = next.id;
            conversationCreatedAtRef.current = next.createdAt;
            setMessages(next.messages);
          }
        } else {
          // 没有会话了，新建一个空会话
          conversationIdRef.current = crypto.randomUUID();
          conversationCreatedAtRef.current = Date.now();
          setMessages([]);
        }
      }
      console.log('[useChat] 已删除会话:', id);
    } catch (err) {
      console.error('[useChat] 删除会话失败:', err);
    }
  }, [isStreaming, storageDelete, listConversations, loadConversation]);

  /** 处理来自 WebSocket 的聊天相关消息（try-catch 防护，防止单条消息处理失败导致整个 Hook 崩溃） */
  const handleChatMessage = useCallback((msg: BridgeMessage) => {
    try {
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
            // 同时将所有 sending 状态的用户消息标记为 sent（收到响应即确认发送成功）
            const newMsg = createMessage('assistant', fragment);
            streamingMsgIdRef.current = newMsg.id;
            setIsStreaming(true);
            setMessages((prev) => [
              ...prev.map((m) =>
                m.role === 'user' && m.status === 'sending' ? { ...m, status: 'sent' as const } : m,
              ),
              newMsg,
            ]);
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
    } catch (err) {
      console.error('[useChat] handleChatMessage 处理消息时出错:', err, '消息类型:', msg.type);
      // 确保异常不会导致流式状态锁死
      if (streamingMsgIdRef.current) {
        streamingMsgIdRef.current = null;
        setIsStreaming(false);
      }
    }
  }, []);

  /** 发送用户消息（try-catch 防护，防止发送过程异常导致 UI 卡死） */
  const handleSendMessage = useCallback(
    (content: string, context?: ChatContext) => {
      try {
        // 流式生成中不允许发送新消息
        if (isStreaming) return;

        // 创建带 sending 状态的用户消息
        const userMsg = createMessage('user', content, { status: 'sending' });
        setMessages((prev) => [...prev, userMsg]);

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

        if (sent) {
          // 发送成功：更新消息状态为 sent
          setMessages((prev) =>
            prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'sent' as const } : m)),
          );
        } else {
          // 发送失败：标记消息为 failed 状态，恢复 isStreaming
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'failed' as const } : m)),
          );
          // 通过 Toast 非阻塞提示
          onToast?.({
            type: 'error',
            message: '消息发送失败，请检查连接状态',
            action: {
              label: '重试',
              onClick: () => retryMessageById(userMsg.id),
            },
          });
        }
      } catch (err) {
        console.error('[useChat] handleSendMessage 发送消息时出错:', err);
        setIsStreaming(false);
        onToast?.({
          type: 'error',
          message: '发送消息时发生异常，请重试',
        });
      }
    },
    [isStreaming, sendMessage, onToast],
  );

  /**
   * 重试发送失败的消息（resend）：
   * 找到 failed 状态的消息，移除它，然后重新发送
   */
  const retryMessageById = useCallback(
    (messageId: string) => {
      const failedMsg = messages.find((m) => m.id === messageId && m.status === 'failed');
      if (!failedMsg) return;
      if (isStreaming) {
        onToast?.({ type: 'warning', message: '正在等待响应，请稍后重试' });
        return;
      }

      // 移除失败的消息（以及其后可能的错误提示 assistant 消息）
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === messageId);
        if (idx < 0) return prev;
        // 只移除该条 failed 消息
        return prev.filter((m) => m.id !== messageId);
      });

      // 重新发送
      handleSendMessage(failedMsg.content);
    },
    [messages, isStreaming, handleSendMessage, onToast],
  );

  /** 重试发送失败的消息（公开接口，按 messageId 查找） */
  const retryMessage = useCallback(
    (messageId: string) => {
      retryMessageById(messageId);
    },
    [retryMessageById],
  );

  /** 取消当前流式生成（try-catch 防护） */
  const handleCancel = useCallback(() => {
    try {
      if (isStreaming) {
        sendMessage('cancel_chat', null);
        console.log('[useChat] 已发送 cancel_chat');
      }
    } catch (err) {
      console.error('[useChat] handleCancel 取消生成时出错:', err);
      // 即使发送 cancel 失败，也确保 UI 状态恢复
      streamingMsgIdRef.current = null;
      setIsStreaming(false);
    }
  }, [isStreaming, sendMessage]);

  /** 重置流式状态（WebSocket 断连时调用，防止 UI 锁死）
   *  如果正在流式接收中断连，保留已接收的部分内容并追加中断提示
   */
  const resetStreamingState = useCallback(() => {
    if (streamingMsgIdRef.current) {
      const interruptedMsgId = streamingMsgIdRef.current;
      // 保留已接收的部分内容，追加连接中断提示
      setMessages((prev) =>
        prev.map((m) =>
          m.id === interruptedMsgId
            ? { ...m, content: m.content + '\n\n⚠️ 连接中断，回复不完整' }
            : m,
        ),
      );
      streamingMsgIdRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return {
    messages,
    isStreaming,
    conversationId: conversationIdRef.current,
    conversations,
    streamingMsgIdRef,
    handleSendMessage,
    handleCancel,
    handleChatMessage,
    resetStreamingState,
    createNewConversation,
    switchConversation,
    deleteConversation: handleDeleteConversation,
    refreshConversations,
    retryMessage,
  };
}
