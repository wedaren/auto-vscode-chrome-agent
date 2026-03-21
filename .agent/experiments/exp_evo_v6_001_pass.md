## 任务
evo_v6_001: Chrome 侧浏览器操作执行引擎：content script 增强支持 click/type/scroll/navigate/querySelector/getTextContent/screenshot 等 DOM 操作

## 假设
在 content script 中实现完整的 DOM 操作执行器，通过 background script 路由消息，screenshot 和 navigate 在 background 层处理（需要 chrome.tabs API 权限）。

## 执行内容摘要
- 新建 `packages/chrome-ext/utils/action-executor.ts`：定义 BrowserAction 接口、ActionType 类型（12 种操作）、ActionResult 接口、ElementInfo 接口，以及各操作的执行函数
- 支持的操作：click（CSS selector + 可选文本过滤）、type（focus → 清空 → native setter → input/change 事件）、scroll（to-top/to-bottom/by-pixels/to-element）、navigate、querySelector、querySelectorAll、getTextContent、getAttribute、getValue、screenshot（标记由 background 处理）、waitForElement（MutationObserver + 超时）、highlight（临时高亮边框）
- 增强 `entrypoints/content.ts`：新增 EXECUTE_ACTION 消息监听器，接收 BrowserAction 并异步执行，返回结构化 ActionResult
- 增强 `entrypoints/background.ts`：新增 EXECUTE_ACTION 消息路由，screenshot 使用 chrome.tabs.captureVisibleTab 直接执行，navigate 使用 chrome.tabs.update，其余转发到 content script

## 验收命令输出
PASS

## 结果
pass
