// usePageContext.ts — 自定义 Hook：封装页面上下文感知（fetchPageContext、browser.runtime.onMessage 监听、pageContext 状态）
import { useState, useEffect, useCallback } from 'react';

/** 页面上下文数据 */
export interface PageContext {
  url: string;
  title: string;
  selectedText: string;
}

/** usePageContext Hook 返回值 */
export interface UsePageContextReturn {
  /** 当前页面上下文 */
  pageContext: PageContext;
  /** 手动刷新页面上下文 */
  fetchPageContext: () => Promise<void>;
}

/** 空上下文初始值 */
const EMPTY_CONTEXT: PageContext = { url: '', title: '', selectedText: '' };

/** 触发上下文更新的 background 消息类型 */
const CONTEXT_MESSAGE_TYPES = new Set([
  'PAGE_CONTEXT',
  'SELECTION_CHANGED',
  'TAB_CHANGED',
  'TAB_UPDATED',
]);

/**
 * 页面上下文感知 Hook
 *
 * 职责：
 * - 维护当前页面的 URL、标题、选中文本状态
 * - 初始化时主动请求一次页面上下文（GET_PAGE_CONTEXT）
 * - 监听 background 推送的上下文变化消息（PAGE_CONTEXT / SELECTION_CHANGED / TAB_CHANGED / TAB_UPDATED）
 * - 自动清理 listener
 */
export function usePageContext(): UsePageContextReturn {
  const [pageContext, setPageContext] = useState<PageContext>(EMPTY_CONTEXT);

  /** 主动请求当前页面上下文 */
  const fetchPageContext = useCallback(async () => {
    try {
      const response = await browser.runtime.sendMessage({ type: 'GET_PAGE_CONTEXT' });
      if (response?.payload) {
        setPageContext(response.payload as PageContext);
      }
    } catch {
      console.log('[usePageContext] 无法获取页面上下文');
    }
  }, []);

  // 监听来自 background 的上下文变化消息 + 初始化时主动拉取一次
  useEffect(() => {
    const handleMessage = (message: { type: string; payload?: PageContext }) => {
      if (CONTEXT_MESSAGE_TYPES.has(message.type) && message.payload) {
        setPageContext(message.payload);
      }
    };
    browser.runtime.onMessage.addListener(handleMessage);
    fetchPageContext();
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [fetchPageContext]);

  return { pageContext, fetchPageContext };
}
