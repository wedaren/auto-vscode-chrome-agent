## 任务
evo_v1_006: VSCode 侧流式响应：extension.ts chat 改用 sendMessageStreaming + 发送 chunk 消息

## 假设
修改 extension.ts 的 chat 消息处理，改用 sendMessageStreaming 替代 sendMessage；每个 fragment 通过 WebSocket 发送 chat_response_chunk；完成后发送 chat_response_end；新增 cancel_chat 消息处理使用 CancellationTokenSource 中断流式生成。同时更新 sendMessageStreaming 使其支持 systemPrompt 参数。

## 执行内容摘要
- 修改 extension.ts：添加 `import { WebSocket } from 'ws'` 和 `activeChatTokens` Map
- 重写 chat case：用 sendMessageStreaming + onFragment 回调发送 chat_response_chunk
- 流式完成后发送 chat_response_end（含 fullText）
- 错误/取消场景也发送 chat_response_end（含 cancelled 标记）
- 新增 cancel_chat case：从 activeChatTokens 查找并取消 CancellationTokenSource
- 修改 lm-service.ts sendMessageStreaming：新增可选 systemPrompt 参数，构造 messages 时支持前置系统提示

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：97/100
问题：
- activeChatTokens 在 WebSocket 连接断开时未主动清理（边缘情况，finally 块仅在流式完成/异常时清理，若 ws 意外断开且流式未结束，Map 中会残留条目）
- 代码质量优秀：CancellationTokenSource 生命周期管理完善（try/catch/finally），错误和取消场景均发送 chat_response_end 保证 Chrome 侧状态一致
