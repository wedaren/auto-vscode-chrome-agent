// background.ts — Service Worker，消息中枢，管理 side panel 生命周期
export default defineBackground(() => {
  // 点击插件图标时打开 side panel
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.id) {
      await browser.sidePanel.open({ tabId: tab.id });
    }
  });

  // 消息路由：content script ↔ side panel
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[background] received message:', message.type, 'from:', sender.id);

    // 转发消息到所有 side panel / popup 连接
    if (message.type === 'PAGE_CONTEXT') {
      // 来自 content script 的页面上下文，转发给 side panel
      browser.runtime.sendMessage(message).catch(() => {
        // side panel 可能未打开，忽略错误
      });
    }

    return false;
  });

  console.log('[background] Browser Agent service worker started');
});
