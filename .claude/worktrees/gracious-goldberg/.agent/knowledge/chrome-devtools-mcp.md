# chrome-devtools-mcp Integration Research

## 结论
1. `chrome-devtools-mcp` 是 Chrome 官方团队出品的 MCP Server，通过 `npx chrome-devtools-mcp@latest` 启动，暴露浏览器自动化能力给 AI agent。
2. 从 VSCode 插件控制它有两种方式：(a) 作为 MCP Server 通过 stdio 启动子进程 (b) 通过 `--browser-url` 连接已有 Chrome 实例。推荐方式 (b) 连接用户当前浏览的 Chrome。
3. 提供 30+ 工具覆盖导航、输入、截图、网络监控、性能分析、JS 执行等，完全满足 agent 探索网页的需求。

## 关键 API / 配置

### 启动方式

**方式 A：子进程启动（推荐用于 MVP）**
```typescript
import { spawn } from 'child_process';

const mcpProcess = spawn('npx', ['-y', 'chrome-devtools-mcp@latest'], {
  stdio: ['pipe', 'pipe', 'pipe']  // stdin/stdout 用于 MCP 协议通信
});
```

**方式 B：连接已有 Chrome 实例**
```bash
npx chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222
```
需要 Chrome 以 `--remote-debugging-port=9222` 启动。

**方式 C：WebSocket 连接**
```bash
npx chrome-devtools-mcp@latest --ws-endpoint=ws://127.0.0.1:9222/devtools/browser/<id>
```

### MCP 标准配置（用于 VSCode MCP 客户端）
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

### 核心工具分类

| 类别 | 工具数 | 关键工具 |
|------|--------|----------|
| 导航 | 6 | `navigate_page`, `new_page`, `close_page`, `list_pages`, `select_page`, `wait_for` |
| 输入自动化 | 9 | `click`, `fill`, `fill_form`, `type_text`, `press_key`, `hover`, `drag`, `upload_file`, `handle_dialog` |
| 截图 & 快照 | 2 | `take_screenshot`, `take_snapshot`（DOM 快照） |
| JS 执行 | 1 | `evaluate_script` |
| 网络 | 2 | `get_network_request`, `list_network_requests` |
| 控制台 | 2 | `get_console_message`, `list_console_messages` |
| 性能 | 4 | `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight`, `take_memory_snapshot` |
| 设备模拟 | 2 | `emulate`, `resize_page` |
| 审计 | 1 | `lighthouse_audit` |

### slim 模式
```bash
npx chrome-devtools-mcp@latest --slim --headless
```
仅暴露 3 个核心工具，适合轻量场景。

### 在 VSCode 插件中的集成方案

```typescript
import { Client } from '@anthropic-ai/mcp';  // 或其他 MCP client SDK

// 方案：通过 stdio 启动 MCP Server 子进程
const mcpClient = new McpClient();
await mcpClient.connect({
  transport: 'stdio',
  command: 'npx',
  args: ['-y', 'chrome-devtools-mcp@latest']
});

// 调用工具
const result = await mcpClient.callTool('navigate_page', {
  url: 'https://example.com'
});
```

## 注意事项
- **浏览器自动启动**：首次调用需要浏览器的工具时，MCP Server 自动启动 Chrome 实例。
- **headless 模式**：加 `--headless` 可无界面运行，但用户场景需要看到浏览器，不建议 MVP 使用。
- **已有 Chrome 连接**：如果要连接用户正在使用的 Chrome，需要 Chrome 以 remote debugging 模式启动，这对普通用户有门槛。
- **MCP SDK 选择**：需要一个 TypeScript MCP Client 库，可用 `@anthropic-ai/sdk` 或 `@modelcontextprotocol/sdk`。
- **VSCode Marketplace 已有封装**：`Chrome DevTools MCP Relay` 扩展已封装了此集成，可参考其实现。
- **进程生命周期**：需要在 VSCode 插件 deactivate 时 kill MCP 子进程。

## 来源
- [chrome-devtools-mcp GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Chrome DevTools MCP 官方博客](https://developer.chrome.com/blog/chrome-devtools-mcp)
- [Chrome DevTools MCP Relay - VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=VijayNirmal.chrome-devtools-mcp-relay)
- [browser-devtools-mcp-vscode-extension](https://github.com/serkan-ozal/browser-devtools-mcp-vscode-extension)
