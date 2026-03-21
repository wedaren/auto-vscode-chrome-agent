## 任务
evo_v17_001: Context Budget 常量与截断工具模块：vscode-ext/src/context-budget.ts

## 假设
创建独立的 context-budget.ts 模块，集中管理所有上下文预算常量和截断工具函数，供后续 evo_v17_002/003/004 统一引用。

## 执行内容摘要
- 创建 `packages/vscode-ext/src/context-budget.ts`
- 导出 6 个预算常量：MAX_SELECTED_TEXT_CHARS(8000)、MAX_URL_CHARS(2000)、MAX_TITLE_CHARS(500)、MAX_SYSTEM_PROMPT_CONTEXT_CHARS(12000)、MAX_OBSERVATION_CHARS(6000)、MAX_MESSAGES_CHARS(80000)
- 导出 `estimateTokens(text)` — 混合文本按 ~3 chars/token 保守估算
- 导出 `smartTruncate(text, maxChars, options?)` — 保留头部(60%)+尾部(40%)，中间插入 `...[已截断 N 字符]...` 占位符
- SmartTruncateOptions 接口支持 headRatio 和 placeholderTemplate 自定义

## 验收命令输出
```
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
