## 任务
evo_v32_005: AgentLoop 集成 — system prompt 更新 + Snapshot 工具使用说明 + 全量验收

## 假设
在 buildAgentSystemPrompt 中添加完整的 browser_snapshot 工具使用指南章节，并更新 Multi-Step Task Orchestration Guide 将 snapshot 作为 Reconnaissance 首选工具，即可满足验收标准。

## 执行内容摘要
- 在 agent-loop.ts 的 buildAgentSystemPrompt 方法中新增 **"DOM Snapshot — Structured Page Understanding (browser_snapshot)"** 完整章节，包含：
  - **When to use browser_snapshot**：4 种典型场景（页面交互前、导航后、selector 失败时、复杂页面）
  - **What browser_snapshot returns**：snapshot 树 + anchors 映射 + anchorCount 的完整说明
  - **How to use the snapshot data**：3 步骤工作流（浏览树 → 查锚点 → 用 selector）
  - **browser_snapshot parameters**：scope_selector / max_depth / max_nodes 参数说明
  - **Example: Using browser_snapshot for page understanding**：完整 3 步 few-shot 示例（snapshot → click → confirm）
- 更新 **Multi-Step Task Orchestration Guide**：
  - Reconnaissance 阶段：browser_snapshot 提升为首选（加粗标记）
  - Action Execution 阶段：新增 navigate → snapshot → click 工作流链
  - Verification 阶段：新增 snapshot 作为状态确认工具
  - Skill vs. Individual Tools Decision：新增 browser_snapshot 作为首步推荐

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
