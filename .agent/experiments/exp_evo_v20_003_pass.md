## 任务
evo_v20_003: AgentLoop 工具 Schema 增强：将 MCP 工具的完整 inputSchema 注入 LLM 系统提示词

## 假设
修改 getToolDescriptions() 方法，让 MCP 工具的 inputSchema（JSON Schema）被解析为人类可读的函数签名格式注入系统提示词，browser_* 原生工具保持现有简洁格式不受影响。

## 执行内容摘要
- 修改 `agent-loop.ts` 的 `getToolDescriptions()` 方法：
  - 将内部数据结构从 `allTools` 数组改为 `lines` 字符串数组，支持不同工具源的差异化渲染
  - MCP 工具调用新增的 `formatMcpToolSignature()` 渲染完整参数签名
  - browser_* 工具保持 `- name: description` 简洁格式
  - run_skill 工具保持现有格式
- 新增 `formatMcpToolSignature()` 私有方法：
  - 从 inputSchema 中提取 properties 和 required 字段
  - 渲染为 `name(param: type [必填] — desc, param2?: type — desc) — toolDesc` 格式
  - 无 schema 时退化为简洁格式 `- name: description`
  - 有 schema 但无 properties 时渲染为 `- name(): description`

## 验收命令输出
PASS

## 结果
pass
