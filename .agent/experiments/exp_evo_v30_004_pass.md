## 任务
evo_v30_004: 单批失败隔离与重试 + 原 llm_translate 保留兼容

## 假设
evo_v30_001 已实现 failedBatches/retriedBatches 的结构，但 translateBatch 内部 catch 会吞掉所有错误并返回原文，导致 progressive 模式的外层 catch 永远不会触发（dead code）。修复方式：为 translateBatch 添加 throwOnError 参数，progressive 模式传 true 让失败实际抛出。

## 执行内容摘要
- **llm-tools.ts**：
  - `translateBatch` 新增 `throwOnError = false` 参数；当 true 时 catch 块 re-throw 而非降级返回原文
  - `executeProgressiveTranslation` 主循环调用 `translateBatch` 传 `throwOnError: true`，使翻译失败被外层 catch 捕获并记录到 `failedBatches`
  - 重试循环同样传 `throwOnError: true`，重试仍失败的进入 `stillFailedBatches`
  - 完成通知 status 改为根据 `stillFailedBatches.length > 0` 决定 `'error'` 或 `'done'`
  - 完成日志增加重试成功批次数统计
  - 原 `handleLlmTranslate` 调用 `translateBatch` 不传 throwOnError（默认 false），行为完全不变

## 验收命令输出
```
⚡ Done in 45ms
PASS
```

## 构建验证
- VSCode ext: `npm run compile` → ⚡ Done in 45ms (566.5kb)
- Chrome ext: `pnpm build` → ✔ Finished in 1.952 s

## 5 项验收逐项确认
1. ✅ 单批翻译失败时跳过并记录失败批次索引（failedBatches.push + throwOnError=true 使 catch 真正可达）
2. ✅ 全部批次处理完后对失败批次重试一次（RETRY 循环）
3. ✅ 重试仍失败的批次在最终结果中标记为未翻译（stillFailedBatches + 原文占位）
4. ✅ 原 llm_translate 工具保留不删除（handleLlmTranslate 在 LLM_TOOL_REGISTRY 中）
5. ✅ 返回结果包含 failedBatches 字段供调试

## 结果
pass
