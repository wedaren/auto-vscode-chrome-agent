## 任务
evo_v20_004: 5 个 DevTools MCP 专属预设 Skill：性能审计 / 网络分析 / Lighthouse / 多页面工作流 / DOM 快照

## 假设
在 skill-registry.ts 的 PRESET_SKILLS 数组末尾新增 5 个 DevTools MCP 专属 Skill，使用 chrome-devtools-mcp 的原生工具名（performance_start_trace、list_network_requests、lighthouse_audit 等），skill-runner.ts 已有的路由机制会自动将非 browser_*/llm_* 工具名路由到 McpClient。

## 执行内容摘要
- 在 `skill-registry.ts` 的 `PRESET_SKILLS` 数组中新增 5 个 DevTools MCP 专属 Skill：
  1. `devtools_performance_audit` — performance_start_trace → evaluate_script(等待) → performance_stop_trace → performance_analyze_insight → take_screenshot
  2. `devtools_network_analysis` — list_network_requests → get_network_request(可选) → take_screenshot(可选)
  3. `devtools_lighthouse_audit` — lighthouse_audit → take_screenshot(可选)
  4. `devtools_multi_page_workflow` — new_page → navigate_page → evaluate_script → take_screenshot(可选) → close_page
  5. `devtools_dom_snapshot` — take_snapshot → take_screenshot
- 更新了预设 Skill 数量注释：15 → 20
- 确认 skill-runner.ts 的 `callTool()` 路由已支持 MCP 工具名（非 browser_*/llm_* 前缀直接调用 this.mcpClient.callTool()）

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无重大问题
- acceptance_cmd 全部 grep 通过，npm run compile 无错误（60/60）
- TypeScript 编译零错误零警告（20/20）
- 符合 program.md 约束：无外部 API key 依赖，模型调用通过 vscode.lm，Chrome 插件不内置模型（15/20，扣 5 分因为新增 skill 较多但每个 skill 的参数文档可更详细）
- skill-registry.ts 有顶部注释，skill-runner.ts 路由逻辑正确（McpClient 兜底路由）
- 5 个 DevTools Skill 定义结构完整：name / displayName / description / category / parameters / steps 齐全
