// usePageContext.ts — 自定义 Hook：封装页面上下文感知（fetchPageContext、browser.runtime.onMessage 监听、pageContext 状态）
// 二次防护：对 url/title/selectedText 做截断防护，即使 content.ts 预截断失效也能兜底
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

// ─── 二次防护截断常量（与 vscode-ext/context-budget.ts 保持一致） ───
const MAX_URL_CHARS = 2000;
const MAX_TITLE_CHARS = 500;
const MAX_SELECTED_TEXT_CHARS = 8000;

/**
 * 对 PageContext 做截断防护，确保各字段不超过预算上限。
 * 作为 content.ts 预截断之后的第二道防线。
 */
function sanitizeContext(ctx: PageContext): PageContext {
  return {
    url: ctx.url ? ctx.url.substring(0, MAX_URL_CHARS) : '',
    title: ctx.title ? ctx.title.substring(0, MAX_TITLE_CHARS) : '',
    selectedText: ctx.selectedText ? ctx.selectedText.substring(0, MAX_SELECTED_TEXT_CHARS) : '',
  };
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

  /** 主动请求当前页面上下文（二次防护截断） */
  const fetchPageContext = useCallback(async () => {
    try {
      const response = await browser.runtime.sendMessage({ type: 'GET_PAGE_CONTEXT' });
      if (response?.payload) {
        setPageContext(sanitizeContext(response.payload as PageContext));
      }
    } catch {
      console.log('[usePageContext] 无法获取页面上下文');
    }
  }, []);

  // 监听来自 background 的上下文变化消息 + 初始化时主动拉取一次（try-catch 防护消息处理）
  useEffect(() => {
    const handleMessage = (message: { type: string; payload?: PageContext }) => {
      try {
        if (CONTEXT_MESSAGE_TYPES.has(message.type) && message.payload) {
          setPageContext(sanitizeContext(message.payload));
        }
      } catch (err) {
        console.error('[usePageContext] 处理上下文消息时出错:', err);
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
