// background.ts — Service Worker，消息中枢，管理 side panel 生命周期
// 负责在 content script ↔ side panel 之间中转消息，包括页面上下文
// 增强：EXECUTE_ACTION 消息路由，将操作请求转发到活动 tab 的 content script
//       screenshot 操作直接在 background 使用 chrome.tabs.captureVisibleTab 执行

import type { BrowserAction, ActionResult } from '../utils/action-executor';

export default defineBackground(() => {
  // 点击插件图标时打开 side panel
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.id) {
      await browser.sidePanel.open({ tabId: tab.id });
    }
  });

  /**
   * 执行截图操作（使用 chrome.tabs.captureVisibleTab）
   * 仅在 background script 中可用
   */
  async function executeScreenshot(): Promise<ActionResult> {
    try {
      const dataUrl = await browser.tabs.captureVisibleTab(undefined as unknown as number, {
        format: 'png',
      });
      return { success: true, data: { screenshot: dataUrl } };
    } catch (err) {
      return {
        success: false,
        error: `截图失败: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

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

      case 'EXECUTE_ACTION': {
        // 浏览器操作执行：转发到活动 tab 的 content script
        const action = message.payload as BrowserAction;
        console.log('[background] 转发浏览器操作:', action.type);

        // screenshot 操作直接在 background 执行（需要 chrome.tabs.captureVisibleTab）
        if (action.type === 'screenshot') {
          executeScreenshot().then((result) => {
            sendResponse({ type: 'ACTION_RESULT', payload: result });
          });
          return true; // 异步响应
        }

        // navigate 操作：如果有 url，使用 chrome.tabs.update（比 content script location.href 更可靠）
        if (action.type === 'navigate' && action.url) {
          browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) {
              sendResponse({
                type: 'ACTION_RESULT',
                payload: { success: false, error: '没有活动标签页' } satisfies ActionResult,
              });
              return;
            }
            browser.tabs.update(tabId, { url: action.url }).then(() => {
              sendResponse({
                type: 'ACTION_RESULT',
                payload: { success: true, data: { navigated: action.url } } satisfies ActionResult,
              });
            }).catch((err) => {
              sendResponse({
                type: 'ACTION_RESULT',
                payload: { success: false, error: `导航失败: ${err instanceof Error ? err.message : String(err)}` } satisfies ActionResult,
              });
            });
          });
          return true; // 异步响应
        }

        // 其他操作：转发到 content script
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          const tabId = tabs[0]?.id;
          if (!tabId) {
            sendResponse({
              type: 'ACTION_RESULT',
              payload: { success: false, error: '没有活动标签页' } satisfies ActionResult,
            });
            return;
          }
          browser.tabs.sendMessage(tabId, { type: 'EXECUTE_ACTION', payload: action }).then((response) => {
            sendResponse(response);
          }).catch((err) => {
            sendResponse({
              type: 'ACTION_RESULT',
              payload: {
                success: false,
                error: `转发操作到 content script 失败: ${err instanceof Error ? err.message : String(err)}`,
              } satisfies ActionResult,
            });
          });
        }).catch((err) => {
          sendResponse({
            type: 'ACTION_RESULT',
            payload: {
              success: false,
              error: `查询活动标签页失败: ${err instanceof Error ? err.message : String(err)}`,
            } satisfies ActionResult,
          });
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
