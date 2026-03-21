## 任务
evo_v18_004: AgentLoop 复杂任务编排增强：优化 system prompt 加入工具组合 few-shot 范例 + Skill 编排建议

## 假设
在 buildAgentSystemPrompt 方法中直接嵌入结构化的 few-shot 范例、多步骤编排指南和错误恢复策略，使 LLM 在 ReAct 循环中更好地进行工具组合和复杂任务拆解。

## 执行内容摘要
- 增强 `buildAgentSystemPrompt` 方法，新增以下部分：
  - **Tool Combination Examples (Few-Shot)** — 3 个完整的多步骤范例：
    1. 跨页面数据提取与比较（browser_get_text + browser_navigate 组合）
    2. Skill + browser_ 工具混合使用（run_skill + browser_get_text）
    3. 多步表单交互（browser_query_selector_all + run_skill fill_and_submit + 验证）
  - **Multi-Step Task Orchestration Guide** — 4 阶段编排框架：Reconnaissance → Action Execution → Verification → Synthesis
  - **Skill vs. Individual Tools Decision** — 何时用 run_skill 何时用 browser_ 工具的决策指南
  - **Error Recovery Guide** — 6 类常见错误的恢复策略（selector not found / navigation timeout / skill failure / empty text / stale state / general principle）

## 验收命令输出
```
grep -c 'Example|example|示例|few.shot|multi.step|EXAMPLE' src/agent-loop.ts → 8 (>= 3 ✓)
grep -q 'run_skill|browser_' src/agent-loop.ts → 找到 ✓
npm run compile → 通过 ✓
PASS
```

## 结果
pass
