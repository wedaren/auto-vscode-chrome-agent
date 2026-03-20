// content.ts — Content Script，注入页面采集上下文信息（URL / 标题 / 选中文本）
// 监听来自 background 的上下文请求，实时采集并返回

export interface PageContext {
  url: string;
  title: string;
  selectedText: string;
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('[content] Browser Agent content script loaded on:', location.href);

    // 响应来自 background / side panel 的上下文请求
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === 'GET_PAGE_CONTEXT') {
        const context: PageContext = {
          url: location.href,
          title: document.title,
          selectedText: window.getSelection()?.toString() || '',
        };
        console.log('[content] 采集页面上下文:', context.url, '选中文本长度:', context.selectedText.length);
        sendResponse({ type: 'PAGE_CONTEXT', payload: context });
        return true; // 表示异步响应
      }
      return false;
    });

    // 监听选中文本变化，主动推送给 background
    document.addEventListener('selectionchange', () => {
      const selectedText = window.getSelection()?.toString() || '';
      if (selectedText.length > 0) {
        browser.runtime.sendMessage({
          type: 'SELECTION_CHANGED',
          payload: {
            url: location.href,
            title: document.title,
            selectedText,
          },
        }).catch(() => {
          // side panel 可能未打开，忽略
        });
      }
    });
  },
});
