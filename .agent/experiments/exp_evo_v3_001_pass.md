## 任务
evo_v3_001: VSCode: 创建 AgentLoop 类，实现 ReAct 风格的 think→act→observe 循环

## 假设
创建 agent-loop.ts，实现 ReAct (Reasoning + Acting) 模式的 AgentLoop 类。
LLM 输出遵循 THOUGHT→ACTION/FINAL_ANSWER 格式，通过 McpClient 执行 MCP 工具，
通过 onStep 回调实时报告每步 (think/act/observe)，MAX_STEPS 限制防止无限循环。
对话历史累积在 messages 数组中，LLM 可看到完整上下文。

## 执行内容摘要
- 创建了 `packages/vscode-ext/src/agent-loop.ts`（约 310 行）
- 导出接口：AgentStep, AgentLoopOptions, AgentLoopResult
- 导出类：AgentLoop（含 MAX_STEPS=15 静态常量）
- 核心方法 `run()` 实现 ReAct 主循环：
  - 获取 MCP 工具描述 → 构建 Agent 系统提示 → LLM 多轮对话
  - 解析 THOUGHT/ACTION/ACTION_INPUT/FINAL_ANSWER
  - ACTION → McpClient.callTool() → OBSERVATION 反馈
  - FINAL_ANSWER → 返回结果
  - 达到 maxSteps → fallback 总结
- 支持 CancellationToken 中断
- 支持 onStep 回调实时通知
- 完整日志输出到 OutputChannel

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：92/100
问题：
- parseLlmOutput 正则在 edge case（用户消息含 "ACTION:" 字符串）可能误匹配，建议后续加 boundary 或更严格分隔符
- 其余全部符合：acceptance_cmd PASS、TypeScript strict 编译零错误、vscode.lm API 调用路径正确、无外部 API key 依赖、文件顶部注释完整
