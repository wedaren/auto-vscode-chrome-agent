## 任务
evo_v28_004: Agent 系统 prompt 语言一致性指令 — 强制 Agent 使用用户输入语言回复（含 think 步骤）

## 假设
在 agent-loop.ts 的 buildAgentSystemPrompt 方法中，Rules 部分之后添加一个 "Language Consistency (CRITICAL)" 指令段，明确要求 LLM 在所有自然语言输出（THOUGHT、FINAL_ANSWER）中使用与用户输入一致的语言，同时保留工具名和 JSON key 为英文。

## 执行内容摘要
- 在 `packages/vscode-ext/src/agent-loop.ts` 的 `buildAgentSystemPrompt` 方法中，Rules 段后新增 `## Language Consistency (CRITICAL)` 段落
- 包含 7 条明确指令：匹配用户语言、覆盖 THOUGHT/FINAL_ANSWER、中文/英文/其他语言具体示例、工具名例外、兜底检测策略

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
