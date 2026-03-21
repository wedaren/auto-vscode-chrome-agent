## 任务
evo_v17_004: AgentLoop 观察结果截断 + 消息窗口管理：防止 ReAct 循环 token 溢出

## 假设
在 agent-loop.ts 中：
1. 导入 context-budget.ts 的 smartTruncate + 常量
2. 工具观察结果在添加到 messages 前通过 smartTruncate 截断到 MAX_OBSERVATION_CHARS
3. 新增 trimMessages() 方法，当 messages 总字符数超过 MAX_MESSAGES_CHARS 时移除最早的非系统消息
4. 新增辅助方法 getMessageTextLength() 和 calcMessagesChars() 安全读取 LanguageModelChatMessage 文本内容
5. 所有截断事件记录日志

## 执行内容摘要
- 在 agent-loop.ts 顶部新增 import { smartTruncate, estimateTokens, MAX_OBSERVATION_CHARS, MAX_MESSAGES_CHARS }
- ACTION 分支中：executeTool 返回的 rawObservation 通过 smartTruncate(rawObservation, MAX_OBSERVATION_CHARS) 截断，截断时输出日志
- 添加 observation 到 messages 后调用 this.trimMessages(messages) 进行窗口管理
- 新增 getMessageTextLength(): 安全解析 LanguageModelChatMessage.content 部件的文本长度
- 新增 calcMessagesChars(): 聚合所有消息的总字符数
- 新增 trimMessages(): 保护前 2 条消息（system prompt + 用户初始消息），从位置 2 开始移除最早消息直到总量 ≤ MAX_MESSAGES_CHARS

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
