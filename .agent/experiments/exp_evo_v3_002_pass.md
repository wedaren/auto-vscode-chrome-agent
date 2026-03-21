## 任务
evo_v3_002: VSCode: MessageHandler 集成 AgentLoop，新增 agent_step/agent_complete 消息类型

## 假设
本次尝试：在 message-handler.ts 中注入 McpClient，handleChat 根据 mcpClient.connected 分流——已连接时创建 AgentLoop 实例并调用 run()，通过 onStep 回调发送 agent_step 消息，循环结束发送 agent_complete；未连接时保持原有流式对话行为。同步更新 extension.ts 构造函数调用。

## 执行内容摘要
- 修改 message-handler.ts：
  - 新增 import McpClient, AgentLoop, AgentStep
  - 构造函数新增 mcpClient 参数
  - handleChat 增加 mcpClient.connected 判断分流
  - 新增 handleChatAgentMode()：创建 AgentLoop，run() 带 onStep 回调发送 agent_step，完成后发送 agent_complete
  - 新增 handleChatStreamMode()：保持原有流式 LM 对话行为
  - 错误/取消场景均通过 agent_complete 消息通知 Chrome 端
- 修改 extension.ts：MessageHandler 构造调用传入 mcpClient

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
