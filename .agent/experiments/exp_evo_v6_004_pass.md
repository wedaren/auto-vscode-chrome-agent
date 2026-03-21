## 任务
evo_v6_004: AgentLoop 集成原生浏览器工具：多工具源支持（MCP + BrowserTools），无 MCP 也能进入 Agent 模式

## 假设
本次尝试：在 AgentLoop 中添加可选的 BrowserToolProvider 参数，getToolDescriptions 合并 MCP 和浏览器工具（browser_* 前缀优先原生通道），executeTool 根据工具名前缀路由到不同提供者。MessageHandler 的 Agent 模式入口条件从仅检查 MCP 改为同时检查 browserToolProvider.connected。连接树新增浏览器工具状态节点。

## 执行内容摘要
- **agent-loop.ts**:
  - import BrowserToolProvider
  - 构造函数新增可选 `browserToolProvider?: BrowserToolProvider` 参数
  - `getToolDescriptions()` 重写为合并两个工具源，browser_* 同名工具去重（原生优先）
  - `executeTool()` 新增路由逻辑：`browser_*` 前缀 + BrowserToolProvider 可用 → 原生通道，否则 MCP
- **message-handler.ts**:
  - import BrowserToolProvider
  - 构造函数新增 `browserToolProvider: BrowserToolProvider` 参数
  - `handleChat()` 条件从 `this.mcpClient.connected` 改为 `this.mcpClient.connected || this.browserToolProvider.connected`
  - `handleChatAgentMode()` 构造 AgentLoop 时传入 browserToolProvider
- **connection-tree.ts**:
  - import BrowserToolProvider
  - nodeType 扩展：新增 'browser-tools' 和 'browser-tool'
  - `bind()` 新增可选 `browserToolProvider` 参数并订阅其状态变更
  - `getRootItems()` 新增第4个顶级节点「原生浏览器工具」
  - 新增 `getBrowserToolsChildren()` 方法显示连接状态和工具列表
- **extension.ts**:
  - MessageHandler 构造传入 browserToolProvider
  - connectionTree.bind() 传入 browserToolProvider

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
