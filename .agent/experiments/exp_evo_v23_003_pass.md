## 任务
evo_v23_003: injectBilingual 自动重标记兜底：当 data-imt-id 元素全部缺失时自动重新提取段落并按索引注入翻译

## 假设
在 executeInjectBilingual 的 inject 模式中，注入前先检查页面上是否存在 data-imt-id 标记元素。如果全部缺失（SPA 重渲染/tab 切换导致 DOM 重建），自动调用 executeExtractParagraphs 重新标记段落，然后正常按 imt-N 索引查找并注入翻译。

## 执行内容摘要
- 修改 `packages/chrome-ext/utils/action-executor.ts` 的 `executeInjectBilingual` inject 分支
- 在 `ensureImtStyle()` 之后、注入循环之前，增加自动重标记检测逻辑：
  - `document.querySelectorAll('[data-imt-id]').length === 0 && items.length > 0` 时触发
  - 调用 `executeExtractParagraphs({ type: 'extractParagraphs' })` 重新标记 DOM
  - 输出 `[imt] 自动重标记` 日志
  - 设置 `autoRemarkDone` 标志，在返回结果中附带
- 重标记后，后续的 `document.querySelector('[data-imt-id="imt-N"]')` 能正常找到元素

## 验收命令输出
✔ Finished in 2.048 s
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- pre-existing TS errors in other files (content.ts, useChatStorage.ts, usePageContext.ts, tool-bridge.ts) — WXT 环境类型问题，与本任务无关
- action-executor.ts 本身无 TS 错误，WXT build 通过
- 验收命令: `grep data-imt-id` ✓ / `grep 重标记|autoRemark` ✓ / `npm run build` ✓
- program.md 约束全部满足：无模型调用、无外部 API key 依赖
- 需求符合度：自动重标记逻辑完整（检测→重提取→日志→标志位返回）
