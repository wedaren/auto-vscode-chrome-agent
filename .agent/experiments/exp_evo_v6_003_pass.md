## 任务
evo_v6_003: VSCode 侧浏览器工具提供者 BrowserToolProvider：定义原生浏览器工具注册表 + 通过 WebSocket 执行工具调用

## 假设
创建 BrowserToolProvider 类，定义 10 个 browser_ 前缀工具（browser_click / browser_type / browser_navigate / browser_scroll / browser_screenshot / browser_query_selector / browser_get_text / browser_get_attribute / browser_wait / browser_highlight），每个工具附带 JSON Schema inputSchema 供 LLM 理解参数结构。callTool() 通过 WsServer.sendAndWait 发送 tool_execute 到 Chrome 侧，并将 ToolResultPayload 转换为与 McpClient 对齐的 McpToolResult 格式。

## 执行内容摘要
- 新建 `packages/vscode-ext/src/browser-tools.ts`：
  - `BrowserToolDef` 接口（name / description / inputSchema）
  - `TOOL_MAPPINGS` 字典：browser_ 前缀工具名 → Chrome ActionType 映射（含参数名映射）
  - `BROWSER_TOOLS` 完整工具定义列表（10 个工具，每个含描述和 JSON Schema）
  - `BrowserToolProvider` 类：
    - constructor(wsServer, outputChannel, toolTimeoutMs)
    - `connected` getter：检查 WsServer 是否 listening 且有连接客户端
    - `discoveredTools` getter：对齐 McpClient 接口
    - `listTools()` / `listToolDefs()`：返回工具列表
    - `callTool(name, args)`：映射工具名/参数 → sendAndWait → 转换结果为 McpToolResult
    - `dispose()`：清理事件
- 修改 `packages/vscode-ext/src/ws-server.ts`：添加 `firstClient` getter 获取第一个 OPEN 状态客户端
- 修改 `packages/vscode-ext/src/extension.ts`：创建 BrowserToolProvider 实例并注册到 subscriptions

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
