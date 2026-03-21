## 任务
evo_v3_004: Chrome: useChat 处理 agent_step/agent_complete 消息，MessageBubble 集成 AgentStepView

## 假设
扩展 Message 类型新增 steps/isAgentMode 字段，在 useChat 的 handleChatMessage 中添加 agent_step 和 agent_complete 两个 case，MessageBubble 在正文上方条件渲染 AgentStepView 组件。

## 执行内容摘要
- `utils/message-factory.ts`: Message 接口新增 `steps?: AgentStep[]` 和 `isAgentMode?: boolean` 字段；`createMessage` 函数新增 options 参数支持传入这两个字段
- `hooks/useChat.ts`: 导入 AgentStep 类型；handleChatMessage switch 新增两个 case:
  - `agent_step`: 首次创建 isAgentMode=true 的 assistant message 带 steps 数组；后续追加 step 到已有 message 的 steps；isStreaming 保持 true
  - `agent_complete`: 设置 content 为 finalAnswer，清除 streamingMsgIdRef，isStreaming=false；支持异常恢复（无 streaming message 时直接创建）
- `components/MessageBubble.tsx`: 导入 AgentStepView 和 AgentStep 类型；Props 扩展 steps/isAgentMode/isRunning；assistant 渲染逻辑改为先渲染 AgentStepView（steps 存在时），再渲染 Markdown 正文
- `entrypoints/sidepanel/App.tsx`: MessageBubble 调用处传递 steps/isAgentMode/isRunning props（isRunning 仅最后一条 agent 模式消息在流式中为 true）

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：98/100
问题：
- WARN: WXT 构建时出现 Duplicated imports "Message" 警告（useChat.ts re-export 与 message-factory.ts 源导出冲突），非阻塞，不影响运行
- acceptance_cmd 全部 grep 检查通过，构建零 error
- 无禁止的外部依赖引入，Chrome 端不内置模型，符合 program.md 约束
- 所有新增/修改文件均有顶部注释，TypeScript 类型完整
