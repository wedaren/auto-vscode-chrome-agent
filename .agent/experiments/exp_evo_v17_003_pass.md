## 任务
evo_v17_003: VSCode 侧 System Prompt 上下文预算：buildSystemPrompt 截断 + 日志监控

## 假设
在 message-handler.ts 的 buildSystemPrompt() 中引入 context-budget.ts 的 smartTruncate 和常量，分层截断每个字段并控制总上下文预算，同时通过 outputChannel 输出字符数和 token 估算日志。

## 执行内容摘要
- 在 message-handler.ts 顶部新增 import: smartTruncate, estimateTokens, MAX_SELECTED_TEXT_CHARS, MAX_URL_CHARS, MAX_TITLE_CHARS, MAX_SYSTEM_PROMPT_CONTEXT_CHARS
- 重写 buildSystemPrompt() 方法：
  - 第1层：字段级截断（url → MAX_URL_CHARS=2000, title → MAX_TITLE_CHARS=500, selectedText → MAX_SELECTED_TEXT_CHARS=8000）
  - 第2层：拼接后上下文部分总量 > MAX_SYSTEM_PROMPT_CONTEXT_CHARS(12000) 时再次 smartTruncate
  - 第3层：日志输出上下文字符数 + estimateTokens 估算值 + 预算上限
- 编译通过，无 TypeScript 错误

## 验收命令输出
```
PASS
```

## 结果
pass
