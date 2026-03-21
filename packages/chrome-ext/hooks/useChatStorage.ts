// useChatStorage.ts — Chrome Storage 持久化 Hook：会话数据的 CRUD 操作
// 使用 chrome.storage.local 存储，支持多会话的索引+详情分离存储策略
import { useCallback } from 'react';
import type { Message } from '../utils/message-factory';

/** 会话数据模型 */
export interface Conversation {
  /** 会话唯一 ID */
  id: string;
  /** 会话标题（自动取首条用户消息前 20 字） */
  title: string;
  /** 消息列表 */
  messages: Message[];
  /** 创建时间戳 */
  createdAt: number;
  /** 最后更新时间戳 */
  updatedAt: number;
}

/** 会话列表索引项（轻量元数据，不含消息体） */
export interface ConversationMeta {
  id: string;
  title: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
}

/** chrome.storage.local 键前缀 */
const CONV_PREFIX = 'conv:';
/** 会话索引表键名 */
const INDEX_KEY = 'conv_index';

/**
 * 生成会话标题：取首条用户消息的前 20 个字符
 * 若无用户消息则返回默认标题
 */
function generateTitle(messages: Message[]): string {
  const firstUserMsg = messages.find((m) => m.role === 'user');
  if (!firstUserMsg || !firstUserMsg.content) return '新对话';
  const text = firstUserMsg.content.trim();
  return text.length > 20 ? text.slice(0, 20) + '...' : text;
}

/**
 * 聊天记录持久化 Hook
 *
 * 存储策略：
 * - 索引表 conv_index: ConversationMeta[]（轻量，列表展示用）
 * - 单条会话 conv:{id}: Conversation（完整数据，按需加载）
 *
 * 使用 chrome.storage.local 实现持久化，所有操作异步。
 */
export function useChatStorage() {
  /** 保存会话（创建或更新），自动生成标题并维护索引 */
  const saveConversation = useCallback(
    async (conversation: Conversation): Promise<void> => {
      try {
        const convKey = `${CONV_PREFIX}${conversation.id}`;

        // 自动生成标题 & 更新时间
        const updated: Conversation = {
          ...conversation,
          title: generateTitle(conversation.messages),
          updatedAt: Date.now(),
        };

        // 写入完整会话数据
        await chrome.storage.local.set({ [convKey]: updated });

        // 更新索引表
        const result = await chrome.storage.local.get(INDEX_KEY);
        const index: ConversationMeta[] = result[INDEX_KEY] ?? [];

        const meta: ConversationMeta = {
          id: updated.id,
          title: updated.title,
          messageCount: updated.messages.length,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        };

        const existingIdx = index.findIndex((m) => m.id === updated.id);
        if (existingIdx >= 0) {
          index[existingIdx] = meta;
        } else {
          index.unshift(meta);
        }

        // 按 updatedAt 降序排列
        index.sort((a, b) => b.updatedAt - a.updatedAt);
        await chrome.storage.local.set({ [INDEX_KEY]: index });

        console.log('[useChatStorage] 会话已保存:', updated.id, updated.title);
      } catch (err) {
        console.error('[useChatStorage] 保存会话失败:', err);
      }
    },
    [],
  );

  /** 加载单条会话（含完整消息列表） */
  const loadConversation = useCallback(
    async (id: string): Promise<Conversation | null> => {
      try {
        const convKey = `${CONV_PREFIX}${id}`;
        const result = await chrome.storage.local.get(convKey);
        return (result[convKey] as Conversation) ?? null;
      } catch (err) {
        console.error('[useChatStorage] 加载会话失败:', err);
        return null;
      }
    },
    [],
  );

  /** 列出所有会话元数据（按最近更新排序） */
  const listConversations = useCallback(async (): Promise<ConversationMeta[]> => {
    try {
      const result = await chrome.storage.local.get(INDEX_KEY);
      return (result[INDEX_KEY] as ConversationMeta[]) ?? [];
    } catch (err) {
      console.error('[useChatStorage] 列出会话失败:', err);
      return [];
    }
  }, []);

  /** 删除会话（同时清除数据和索引） */
  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    try {
      const convKey = `${CONV_PREFIX}${id}`;

      // 删除会话数据
      await chrome.storage.local.remove(convKey);

      // 更新索引
      const result = await chrome.storage.local.get(INDEX_KEY);
      const index: ConversationMeta[] = result[INDEX_KEY] ?? [];
      const filtered = index.filter((m) => m.id !== id);
      await chrome.storage.local.set({ [INDEX_KEY]: filtered });

      console.log('[useChatStorage] 会话已删除:', id);
    } catch (err) {
      console.error('[useChatStorage] 删除会话失败:', err);
    }
  }, []);

  return {
    saveConversation,
    loadConversation,
    listConversations,
    deleteConversation,
  };
}
