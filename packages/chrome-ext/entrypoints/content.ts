// content.ts — Content Script，注入页面采集上下文信息
export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('[content] Browser Agent content script loaded on:', location.href);
  },
});
