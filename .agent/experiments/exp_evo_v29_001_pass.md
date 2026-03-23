## 任务
evo_v29_001: 智能跟进建议 — VSCode 侧 LLM 生成 + follow_up_suggestions 协议 + SmartSuggestions 组件

## 假设
本次尝试：完整实现三层架构 — VSCode 侧异步 LLM 生成建议、WebSocket follow_up_suggestions 协议、Chrome SmartSuggestions 芯片组件

## 执行内容摘要
- **VSCode 侧 (message-handler.ts)**:
  - 新增 `generateFollowUpSuggestions()` 方法：AI 回复完成后异步调用 LLM 生成 2-3 条上下文相关建议
  - 在 `handleChatAgentMode()` 的 agent_complete 之后调用
  - 在 `handleChatStreamMode()` 的 chat_response_end 之后调用
  - 使用 JSON 数组格式解析，带容错（正则提取 JSON）
  - 失败时静默记录日志，不影响主流程

- **WebSocket 协议**: 新增 `follow_up_suggestions` 消息类型
  - payload: `{ suggestions: string[], targetMessageId?: string }`

- **Chrome 侧**:
  - `message-factory.ts`: Message 接口新增 `suggestions?: string[]` 字段
  - `SmartSuggestions.tsx`: 新建芯片组件，带淡入动画、禁用状态、截断样式
  - `useChat.ts`: 处理 `follow_up_suggestions` 消息，挂载到最后一条 assistant 消息
  - `MessageBubble.tsx`: 集成 SmartSuggestions 组件渲染
  - `App.tsx`: 传递 suggestions + onSuggestionClick 到 MessageBubble

## 验收命令输出
```
packages/chrome-ext/components/SmartSuggestions.tsx:...
packages/chrome-ext/components/MessageBubble.tsx:import SmartSuggestions...
packages/chrome-ext/hooks/useChat.ts:        case 'follow_up_suggestions':...
packages/vscode-ext/src/message-handler.ts:          type: 'follow_up_suggestions',...
PASS
```

Chrome ext build: ✔ Built extension in 1.845s
VSCode ext compile: ⚡ Done in 46ms

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

验收明细：
- acceptance_cmd：PASS（60/60）— SmartSuggestions 组件存在于 chrome-ext，follow_up_suggestions 协议双端均已实现
- TypeScript 类型检查：chrome-ext tsc --noEmit 零错误，vscode-ext tsc --noEmit 零错误（20/20）
- program.md 约束符合度（20/20）：
  - 模型调用仅通过 vscode.lm API ✅
  - Chrome 插件不内置模型 ✅（SmartSuggestions 纯展示组件，无 LLM 调用）
  - 未引入需要外部 API key 的依赖 ✅
- 新增文件 SmartSuggestions.tsx 顶部注释完整 ✅
