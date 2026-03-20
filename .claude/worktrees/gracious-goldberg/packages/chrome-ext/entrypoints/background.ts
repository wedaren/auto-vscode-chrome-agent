// background.ts — Service Worker，消息中枢，管理 side panel 生命周期
// 负责在 content script ↔ side panel 之间中转消息，包括页面上下文
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

    switch (message.type) {
      case 'PAGE_CONTEXT':
      case 'SELECTION_CHANGED':
        // 来自 content script 的页面上下文，转发给 side panel
        browser.runtime.sendMessage(message).catch(() => {
          // side panel 可能未打开，忽略错误
        });
        break;

      case 'GET_PAGE_CONTEXT': {
        // 来自 side panel 的上下文请求，转发给当前活动 tab 的 content script
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          const tabId = tabs[0]?.id;
          if (!tabId) {
            sendResponse({ type: 'PAGE_CONTEXT', payload: { url: '', title: '', selectedText: '' } });
            return;
          }
          browser.tabs.sendMessage(tabId, { type: 'GET_PAGE_CONTEXT' }).then((response) => {
            sendResponse(response);
          }).catch(() => {
            // content script 未注入或不可用
            sendResponse({ type: 'PAGE_CONTEXT', payload: { url: '', title: '', selectedText: '' } });
          });
        }).catch(() => {
          sendResponse({ type: 'PAGE_CONTEXT', payload: { url: '', title: '', selectedText: '' } });
        });
        return true; // 异步响应
      }

      default:
        break;
    }

    return false;
  });

  // 监听 tab 切换，主动通知 side panel 更新上下文
  browser.tabs.onActivated.addListener(async (activeInfo) => {
    try {
      const tab = await browser.tabs.get(activeInfo.tabId);
      browser.runtime.sendMessage({
        type: 'TAB_CHANGED',
        payload: {
          url: tab.url || '',
          title: tab.title || '',
          selectedText: '',
        },
      }).catch(() => {
        // side panel 可能未打开
      });
    } catch {
      // tab 可能已关闭
    }
  });

  // 监听 tab URL 更新
  browser.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      browser.runtime.sendMessage({
        type: 'TAB_UPDATED',
        payload: {
          url: tab.url || '',
          title: tab.title || '',
          selectedText: '',
        },
      }).catch(() => {
        // side panel 可能未打开
      });
    }
  });

  console.log('[background] Browser Agent service worker started');
});
