# exp_evo_v1_010 — Copilot 级体验全量验收

## 任务
evo_v1_010: Copilot 级体验全量验收：流式 + Markdown + 指示器 + 停止，双端构建通过

## 验收命令输出
```
PASS
```

## 检查项

### VSCode 侧
- [x] `sendMessageStreaming` 流式调用存在于 extension.ts
- [x] `chat_response_chunk` 消息发送存在
- [x] `chat_response_end` 消息发送存在
- [x] `cancel_chat` 消息处理存在（AbortController 取消机制）
- [x] `npm run compile` 零错误

### Chrome 侧
- [x] `chat_response_chunk` 处理存在于 App.tsx
- [x] `chat_response_end` 处理存在于 App.tsx
- [x] `cancel_chat` 发送存在于 App.tsx（停止生成按钮）
- [x] `isStreaming` 状态管理完整
- [x] `components/MessageBubble.tsx` 存在，使用 marked + highlight.js
- [x] `components/TypingIndicator.tsx` 存在，三点跳动动画
- [x] `npm run build` 零错误

### program.md 约束
- [x] 模型调用只通过 vscode.lm API（lm-service.ts 封装）
- [x] Chrome 插件不内置模型（无 openai/anthropic 依赖）
- [x] 不引入需要外部 API key 的依赖
- [x] 新文件有顶部注释

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
