# VSCode 插件使用指南

Browser Agent 的 VSCode 插件是整个系统的"大脑"。它负责启动 WebSocket 服务、调用语言模型、管理 Agent 循环、连接 MCP 工具，并提供丰富的调试视图帮助你监控系统运行状态。

---

## 目录

- [安装与激活](#安装与激活)
- [WebSocket 服务器](#websocket-服务器)
- [Activity Bar 调试视图](#activity-bar-调试视图)
  - [连接状态 TreeView](#连接状态-treeview)
  - [消息检查器 TreeView](#消息检查器-treeview)
  - [Agent 循环可视化 TreeView](#agent-循环可视化-treeview)
- [连接 DevTools MCP](#连接-devtools-mcp)
- [Agent 模式](#agent-模式)
- [浏览器工具（Browser Tools）](#浏览器工具browser-tools)
  - [原生浏览器工具](#原生浏览器工具)
  - [MCP DevTools 工具](#mcp-devtools-工具)
- [常用命令](#常用命令)
- [配置项](#配置项)
- [常见问题](#常见问题)

---

## 安装与激活

### 开发版加载

1. 克隆仓库并安装依赖：

```bash
git clone <repo-url>
cd auto-vscode-chrome-agent
pnpm install
```

2. 编译 VSCode 插件：

```bash
pnpm --filter vscode-ext compile
```

3. 在 VSCode 中打开项目根目录，按 **F5** 启动「Extension Development Host」窗口。

> 插件会在新窗口中自动激活，无需手动操作。

### 开发模式（监听文件变化）

```bash
pnpm dev:vscode
```

使用此命令后，修改源码会自动重新编译，按 `Ctrl+Shift+F5` 重启调试宿主即可加载最新代码。

### 激活条件

插件在 VSCode 启动时自动激活（`*` 激活事件），激活后会：

1. 创建 Output Channel（日志通道），用于输出调试信息
2. 初始化核心服务：LmService、McpClient、WsServer、BrowserToolProvider
3. 在配置的端口上启动 WebSocket 服务器
4. 注册所有命令和 TreeView
5. 设置虚拟文档提供器（用于查看消息详情）

---

## WebSocket 服务器

VSCode 插件启动后会在本地运行一个 WebSocket 服务器，作为与 Chrome 插件通信的桥梁。

### 默认端口

- **端口 7777**（默认）
- 通过 VSCode 设置项 `browserAgent.port` 可自定义端口

### 修改端口

1. 打开 VSCode 设置（`Cmd+,` / `Ctrl+,`）
2. 搜索 `browserAgent.port`
3. 修改为目标端口号
4. 重启 VSCode 或重新加载窗口使配置生效

### 通信协议

所有消息使用 JSON 格式，结构如下：

```json
{
  "type": "chat_message | context_update | tool_call | tool_result | ...",
  "payload": { ... },
  "sessionId": "uuid"
}
```

### 状态确认

在 VSCode 输出面板（Output Panel）中选择 Browser Agent 通道，可以看到 WebSocket 服务器的启动日志：

```
[WsServer] WebSocket 服务已启动，端口: 7777
[WsServer] 客户端已连接 (1/N)
```

---

## Activity Bar 调试视图

插件在 VSCode 左侧 Activity Bar 中注册了一个专属容器，包含三个调试 TreeView，帮助你实时了解系统运行状态。

点击 Activity Bar 中的 **Browser Agent 图标** 即可展开调试面板。

### 连接状态 TreeView

**视图 ID：** `browser-agent-connection`

连接状态视图展示四个顶级节点，一目了然地显示系统各组件的连接状况：

#### 1. WebSocket Server

显示 WebSocket 服务端的运行状态。

| 信息 | 说明 |
|------|------|
| 状态 | ✅ 监听中 / ❌ 未启动 |
| 端口 | 当前监听端口（默认 7777） |
| 已连接客户端 | Chrome 插件连接数量 |

- **图标**：绿色 `broadcast`（正在监听）/ 红色 `debug-disconnect`（未启动）

#### 2. MCP Connection

显示 chrome-devtools-mcp 的连接状态。

| 信息 | 说明 |
|------|------|
| 状态 | ✅ 已连接 / ❌ 未连接 |
| 已发现工具 | MCP 工具列表（展开查看每个工具的名称和描述） |

- **图标**：绿色 `plug`（已连接）/ 红色 `debug-disconnect`（未连接）
- 连接后自动发现可用工具，展开可看到工具列表

#### 3. Native Browser Tools

显示原生浏览器操作工具的可用状态。

| 信息 | 说明 |
|------|------|
| 状态 | ✅ 可用 (N tools) / ❌ 不可用 |
| 前提 | 需要 Chrome 插件已通过 WebSocket 连接 |
| 工具列表 | 展开查看所有注册的浏览器工具 |

- **图标**：绿色 `browser`（可用）/ 红色 `debug-disconnect`（不可用）

#### 4. Current Model

显示当前选择的语言模型信息。

| 信息 | 说明 |
|------|------|
| 模型名称 | 如 `gpt-4o`、`claude-3.5-sonnet` |
| 供应商 | 如 `copilot`、`anthropic` |
| 模型族 | 模型系列标识 |
| 最大输入 Token | 模型支持的最大输入 Token 数 |

- **图标**：`hubot`（已选中模型）/ `question`（未选中）

> 💡 所有节点会实时响应状态变化自动刷新，无需手动操作。

---

### 消息检查器 TreeView

**视图 ID：** `browser-agent-messages`

消息检查器是一个实时的 WebSocket 消息流日志，帮助你追踪 Chrome 插件与 VSCode 插件之间的每一条通信。

#### 消息列表

每条消息显示以下信息：

```
↑ chat_response [14:32:05.123] {"text":"Hello..."}
↓ chat_message  [14:32:04.567] {"message":"Hi"...}
```

| 符号 | 含义 |
|------|------|
| `↑` | 发送（VSCode → Chrome） |
| `↓` | 接收（Chrome → VSCode） |

- 时间精确到毫秒（`HH:MM:SS.MMM`）
- 载荷（payload）预览截断为 60 字符
- 最多保留最近 **200 条**消息（环形缓冲区）
- 最新消息在最上方

#### 查看完整消息 JSON

**点击任意消息条目**，会在编辑器中打开一个虚拟文档，展示完整的消息 JSON：

```json
// Direction: receive
// Timestamp: 2026-03-21T14:32:04.567Z
// MessageId: 42

{
  "type": "chat_message",
  "payload": {
    "message": "Hi, tell me about this page",
    "context": { "url": "https://example.com", "title": "Example" }
  },
  "sessionId": "abc-123"
}
```

#### 清空消息日志

使用命令 `Browser Agent: Clear Message Log`（命令 ID：`browser-agent.clearMessageLog`）清空消息检查器中的所有记录。

> 💡 消息检查器非常适合排查通信问题，比如确认消息是否送达、载荷格式是否正确。

---

### Agent 循环可视化 TreeView

**视图 ID：** `browser-agent-agent-loop`

Agent 循环可视化展示每一次 Agent 运行的详细 ReAct 步骤历史，帮助你理解 AI 的思考和决策过程。

#### 运行记录（第一级）

每次 Agent 运行显示为一条记录：

```
🔄 [14:35:20] Running (3 steps) — 帮我点击页面上的登录按钮...
✅ [14:33:10] Completed (5 steps) — 分析当前页面结构并...
⏹️ [14:30:05] Cancelled (2 steps) — 查找所有链接...
❌ [14:28:00] Error (1 steps) — 导航到 https://...
```

| 图标 | 状态 | 说明 |
|------|------|------|
| 🔄 | Running | 正在执行中（节点自动展开） |
| ✅ | Completed | 执行成功完成 |
| ⏹️ | Cancelled | 被用户取消 |
| ❌ | Error | 执行过程中出错 |

- 最多保留最近 **20 条**运行记录
- 运行中的记录自动展开，已完成的默认折叠
- 鼠标悬停（Tooltip）显示：运行 ID、状态、开始时间、持续时长、步骤数、用户消息全文

#### ReAct 步骤（第二级）

展开运行记录，可以看到每个 ReAct 步骤：

```
🧠 #1 Think  分析用户需求，需要找到登录按钮...
⚡ #2 Act [browser_click]  {"selector":"#login-btn"...}
📋 #3 Observe  {"success":true,"data":...}
🧠 #4 Think  按钮已点击成功，页面跳转到...
```

| 图标 | 步骤类型 | 说明 |
|------|----------|------|
| 🧠 | Think（思考） | AI 的推理和规划过程 |
| ⚡ | Act（行动） | 调用工具执行操作，显示工具名和参数 |
| 📋 | Observe（观察） | 工具返回的执行结果 |

- 内容预览截断为 60 字符
- 鼠标悬停（Tooltip）可查看完整内容（最多 1000 字符）
- Act 步骤的 Tooltip 额外显示工具名称和参数 JSON

> 💡 这个视图是理解 Agent 决策过程的最佳工具。当 Agent 行为不符合预期时，查看步骤历史可以快速定位问题。

---

## 连接 DevTools MCP

Browser Agent 可以通过 MCP（Model Context Protocol）连接 `chrome-devtools-mcp`，获取强大的浏览器 DevTools 调试能力。

### 什么是 MCP？

MCP（Model Context Protocol）是一种让 AI 模型调用外部工具的标准协议。`chrome-devtools-mcp` 提供了 Chrome DevTools 的 MCP 工具集，包括 DOM 检查、网络监控、性能分析等。

### 连接方式

在 VSCode 命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）中执行：

```
Browser Agent: 连接 DevTools MCP
```

命令 ID：`browser-agent.connectDevtools`

### 连接过程

1. 插件通过 `npx chrome-devtools-mcp@latest` 启动子进程
2. 使用 `@modelcontextprotocol/sdk` 建立 stdio 通信
3. 自动发现所有可用的 MCP 工具
4. 工具列表显示在连接状态 TreeView 的 MCP 节点下

### 连接状态

连接成功后，Activity Bar 调试视图中的 **MCP Connection** 节点会变为绿色 ✅，并列出所有已发现的工具。

### 注意事项

- 首次连接可能需要下载 `chrome-devtools-mcp` 包，请耐心等待
- 连接过程会自动启动一个 Chrome 浏览器实例（如果尚未打开）
- MCP 工具与原生浏览器工具可以同时使用，Agent 会自动选择最合适的工具
- 断开连接后，MCP 子进程会自动清理

---

## Agent 模式

Agent 模式让 AI 具备自主执行多步操作的能力，通过 ReAct（Reasoning + Acting）循环，AI 可以思考、使用工具、观察结果，并持续迭代直到完成任务。

### 触发条件

Agent 模式在以下条件满足时**自动启用**：

1. **MCP 已连接** — 通过 `Browser Agent: 连接 DevTools MCP` 连接后
2. **或 Chrome 浏览器已连接** — Chrome 插件通过 WebSocket 连接后，原生浏览器工具可用

只要有**任何工具可用**（MCP 工具或原生浏览器工具），Agent 模式即自动激活。无需手动开关。

### ReAct 循环流程

```
用户发送消息
    ↓
构建系统提示词（包含可用工具列表）
    ↓
┌─→ 调用语言模型
│   ↓
│   解析输出：FINAL_ANSWER? ACTION?
│   ↓
│   ├─ FINAL_ANSWER → 返回最终回答 → 结束
│   │
│   └─ ACTION → 执行工具 → 获取观察结果
│       ↓
└───── 将观察结果加入上下文，继续循环
```

### 最大步骤限制

- 单次 Agent 运行最多执行 **15 轮** LLM 调用
- 达到上限时，Agent 会自动汇总已有信息并返回最终回答

### 工具优先级

当 MCP 和原生浏览器工具同时可用时：

- `browser_*` 前缀的工具优先使用原生浏览器工具（通过 WebSocket 直连 Chrome，速度更快）
- 其他工具通过 MCP 协议调用
- 系统会自动去重，确保不会出现同名工具冲突

### 取消执行

在 Chrome 插件 Side Panel 中点击**停止按钮**，可以取消正在进行的 Agent 循环。

---

## 浏览器工具（Browser Tools）

Browser Agent 提供两类浏览器工具，供 Agent 在对话中自主调用。

### 原生浏览器工具

原生浏览器工具通过 WebSocket 直接与 Chrome 插件的 Content Script 通信执行，速度快、延迟低。

**前提条件：** Chrome 插件已通过 WebSocket 连接到 VSCode 插件。

| 工具名 | 功能 | 参数 |
|--------|------|------|
| `browser_click` | 点击页面元素 | `selector`（CSS 选择器），`text`（可选，按文本过滤） |
| `browser_type` | 在输入框中输入文字 | `selector`（CSS 选择器），`value`（输入内容） |
| `browser_navigate` | 导航到指定 URL | `url`（目标地址） |
| `browser_scroll` | 滚动页面 | `mode`（`to-top` / `to-bottom` / `by-pixels` / `to-element`），`pixels`，`selector` |
| `browser_screenshot` | 截取页面可见区域截图 | 无参数，返回 base64 编码图片 |
| `browser_query_selector` | 查询 DOM 元素属性 | `selector`（CSS 选择器） |
| `browser_get_text` | 获取元素文本内容 | `selector`（CSS 选择器） |
| `browser_get_attribute` | 获取元素 HTML 属性值 | `selector`（CSS 选择器），`attributeName`（属性名） |
| `browser_wait` | 等待元素出现 | `selector`（CSS 选择器），`timeout`（可选，超时毫秒数） |
| `browser_highlight` | 临时高亮元素 | `selector`（CSS 选择器），`color`（可选，高亮颜色），`duration`（可选，持续时间） |

**执行超时：** 每个工具调用默认 30 秒超时。

**执行流程：**

```
Agent 调用工具 → BrowserToolProvider → WebSocket tool_execute 消息
    → Chrome Background Script → Content Script 执行操作
    → tool_result 返回 → Agent 获取观察结果
```

### MCP DevTools 工具

通过 `chrome-devtools-mcp` 连接后获得的 DevTools 工具集，提供更底层的浏览器调试能力（DOM 检查、网络分析、性能监控等）。

连接 MCP 后，可在**连接状态 TreeView** 的 MCP 节点下查看所有已发现的工具。

> 💡 原生浏览器工具适合日常操作（点击、输入、导航等），MCP 工具适合高级调试场景（DevTools 功能）。两者可以在同一次 Agent 运行中混合使用。

---

## 常用命令

在 VSCode 命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）中输入 "Browser Agent" 可找到所有命令。

| 命令 | 命令 ID | 说明 |
|------|---------|------|
| **Browser Agent: 提问** | `browser-agent.ask` | 直接在 VSCode 中向语言模型提问，结果以通知弹窗显示 |
| **Browser Agent: 连接 DevTools MCP** | `browser-agent.connectDevtools` | 手动连接 chrome-devtools-mcp，发现并注册 MCP 工具 |
| **Browser Agent: 生成报告** | `browser-agent.generateReport` | 基于浏览器上下文生成结构化深度报告，输出到 Output Channel |
| **Browser Agent: Clear Message Log** | `browser-agent.clearMessageLog` | 清空消息检查器中的所有消息记录 |

### 使用示例

#### 快速提问

1. `Cmd+Shift+P` → 输入 "Browser Agent: 提问"
2. 在输入框中键入问题，按 Enter
3. AI 回答将以 VSCode 通知弹窗显示

#### 生成报告

1. 确保 Chrome 插件已连接
2. `Cmd+Shift+P` → 输入 "Browser Agent: 生成报告"
3. 输入报告主题（如"当前页面用户体验分析"）
4. 报告将输出到 VSCode 的 Output Channel（查看 → 输出 → Browser Agent）

#### 连接 MCP

1. `Cmd+Shift+P` → 输入 "Browser Agent: 连接 DevTools MCP"
2. 等待连接完成（首次可能需要下载依赖）
3. 连接成功后，Activity Bar 中 MCP 节点变为绿色

---

## 配置项

在 VSCode 设置中搜索 `browserAgent` 可找到所有配置：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `browserAgent.port` | number | `7777` | WebSocket 服务器监听端口 |

---

## 常见问题

### WebSocket 服务没有启动？

1. 检查 VSCode 输出面板（Output Panel）中是否有错误日志
2. 确认端口 7777 没有被其他程序占用：`lsof -i :7777`
3. 尝试在设置中修改 `browserAgent.port` 为其他端口
4. 重新加载 VSCode 窗口（`Cmd+Shift+P` → "Reload Window"）

### 连接 MCP 失败？

1. 确认已安装 Node.js 和 npm/npx
2. 检查网络连接（首次需要下载 `chrome-devtools-mcp` 包）
3. 查看输出面板中 `[McpClient]` 前缀的日志信息
4. 确认没有防火墙阻止子进程启动

### Agent 没有使用工具？

Agent 模式需要工具可用才能激活：

1. 确认 Chrome 插件已通过 WebSocket 连接（原生工具）
2. 或者手动连接 DevTools MCP（MCP 工具）
3. 在连接状态 TreeView 中确认工具节点显示为绿色 ✅
4. 如果两类工具都不可用，AI 会以普通对话模式直接回答

### 调试视图不显示内容？

1. 点击 Activity Bar 中的 Browser Agent 图标确保面板已展开
2. 消息检查器只在有消息流时才有内容
3. Agent 循环视图只在触发 Agent 运行后才有记录
4. 尝试刷新视图：右键点击视图标题 → Refresh
