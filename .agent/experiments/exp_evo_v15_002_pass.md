## 任务
evo_v15_002: Navigate 等待页面加载完成：background.ts browser.tabs.update 后监听 onUpdated(status=complete) + 验证 content script 就绪再返回成功

## 假设
在 background.ts 的 navigate 处理中，tabs.update() 之后不应立即返回成功，而应等待 onUpdated status='complete' 事件确认页面加载完毕，再通过 ping content script 确认就绪，最后才返回成功。添加 15s 超时保护防止无限等待。

## 执行内容摘要
- 新增 `waitForTabComplete(tabId, timeoutMs)` 函数：注册 `browser.tabs.onUpdated` 监听器，等待指定 tab 的 `status === 'complete'` 事件，带超时保护
- 新增 `waitForContentScriptReady(tabId, maxRetries, retryIntervalMs)` 函数：循环发送 `GET_PAGE_CONTEXT` 消息 ping content script，最多 10 次，每次间隔 500ms
- 重写 navigate 处理逻辑：tabs.update() -> waitForTabComplete(15s) -> waitForContentScriptReady() -> sendResponse
- 即使 content script 未就绪也返回成功（页面已加载），但在 data 中附带 contentScriptReady 状态
- 所有步骤均有详细 console.log 日志

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
