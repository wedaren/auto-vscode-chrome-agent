## 任务
evo_v10_001: VSCode 侧 LLM 请求细节采集模块

## 假设
创建 LlmRequestCollector 类，定义 LlmRequestDetail 接口，在 message-handler.ts 的 stream 和 agent 两条处理路径中集成采集逻辑，采集 model/systemPrompt/messages/timing/response/agentSteps 完整链路数据。

## 执行内容摘要
- 新增 `packages/vscode-ext/src/llm-request-collector.ts`
  - 导出 `LlmRequestDetail` 接口（id/mode/model/systemPrompt/messages/timing/response/agentSteps/error/cancelled）
  - 导出辅助接口 `LlmMessageRecord`、`LlmAgentStepRecord`、`LlmTimingInfo`
  - 导出 `LlmRequestCollector` 类（startRequest/addMessage/addAgentStep/endRequest/getDetail/getLatest/clear）
  - 内置 MAX_HISTORY=50 自动淘汰策略
- 修改 `packages/vscode-ext/src/message-handler.ts`
  - 导入 LlmRequestCollector 和 LlmRequestDetail
  - 新增 `llmCollector` 实例字段
  - `handleChatStreamMode`: startRequest → addMessage(user) → streaming → addMessage(assistant) + endRequest → 附加 llmDetail 到 chat_response_end payload
  - `handleChatAgentMode`: startRequest → addMessage(user) → onStep 中 addAgentStep → endRequest → 附加 llmDetail 到 agent_complete payload
  - 新增 `getLlmCollector()` 公开方法供外部访问
  - 错误/取消路径同样调用 endRequest 记录

## 验收命令输出
```
src/llm-request-collector.ts: LlmRequestDetail, LlmRequestCollector (多处)
src/message-handler.ts: import { LlmRequestCollector, LlmRequestDetail }, llmCollector 实例, getLlmCollector()
compile: tsc -p ./tsconfig.json (0 errors)
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
