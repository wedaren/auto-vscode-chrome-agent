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

  /**
   * 等待指定 tab 页面加载完成（监听 onUpdated status='complete'）
   * @param tabId 目标 tab ID
   * @param timeoutMs 超时毫秒数
   */
  function waitForTabComplete(tabId: number, timeoutMs: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        browser.tabs.onUpdated.removeListener(listener);
        reject(new Error(`页面加载超时 (${timeoutMs}ms)`));
      }, timeoutMs);

      function listener(updatedTabId: number, changeInfo: { status?: string }) {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          clearTimeout(timer);
          browser.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      }

      browser.tabs.onUpdated.addListener(listener);
    });
  }

  /**
   * 等待 content script 就绪（通过发送 ping 消息验证）
   * 导航后 content script 需要重新注入，可能有短暂延迟
   * @param tabId 目标 tab ID
   * @param maxRetries 最大重试次数
   * @param retryIntervalMs 重试间隔毫秒数
   * @returns true 表示就绪，false 表示超时未就绪
   */
  async function waitForContentScriptReady(
    tabId: number,
    maxRetries: number = 10,
    retryIntervalMs: number = 500,
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await browser.tabs.sendMessage(tabId, { type: 'GET_PAGE_CONTEXT' });
        console.log(`[background] Content script 就绪 (第 ${i + 1} 次尝试)`);
        return true;
      } catch {
        // content script 尚未注入或未就绪，等待后重试
        if (i < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, retryIntervalMs));
        }
      }
    }
    console.warn(`[background] Content script 在 ${maxRetries} 次尝试后仍未就绪`);
    return false;
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

        // navigate 操作：tabs.update + 等待 onUpdated(status=complete) + 验证 content script 就绪
        if (action.type === 'navigate' && action.url) {
          const NAVIGATE_TIMEOUT_MS = 15000; // 15s 超时保护
          const targetUrl = action.url;

          browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) {
              sendResponse({
                type: 'ACTION_RESULT',
                payload: { success: false, error: '没有活动标签页' } satisfies ActionResult,
              });
              return;
            }

            try {
              // 1. 发起导航
              console.log(`[background] 导航到: ${targetUrl}`);
              await browser.tabs.update(tabId, { url: targetUrl });

              // 2. 等待页面加载完成（onUpdated status='complete'）
              console.log(`[background] 等待页面加载完成...`);
              await waitForTabComplete(tabId, NAVIGATE_TIMEOUT_MS);
              console.log(`[background] 页面加载完成`);

              // 3. 验证 content script 就绪（ping）
              console.log(`[background] 验证 content script 就绪...`);
              const contentReady = await waitForContentScriptReady(tabId, 10, 500);

              if (contentReady) {
                console.log(`[background] 导航完成，content script 已就绪: ${targetUrl}`);
              } else {
                console.warn(`[background] 导航完成但 content script 未就绪: ${targetUrl}`);
              }

              // 即使 content script 未就绪也返回成功（页面已加载），但附带就绪状态
              sendResponse({
                type: 'ACTION_RESULT',
                payload: {
                  success: true,
                  data: { navigated: targetUrl, contentScriptReady: contentReady },
                } satisfies ActionResult,
              });
            } catch (err) {
              sendResponse({
                type: 'ACTION_RESULT',
                payload: {
                  success: false,
                  error: `导航失败: ${err instanceof Error ? err.message : String(err)}`,
                } satisfies ActionResult,
              });
            }
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
