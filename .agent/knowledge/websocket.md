# VSCode Extension WebSocket Server Research

## 结论
1. 在 VSCode 插件的 `activate()` 中使用 `ws` 库（Node.js）创建 `WebSocketServer` 是可行且常见的模式，插件运行在 Node.js 环境中可直接使用。
2. 端口冲突处理推荐：先尝试目标端口，失败则提示用户修改配置；也可用 `net.createServer` 预检测端口可用性。
3. program.md 指定端口为 **7777**（非 tasks.json 中的 7890），以 program.md 为准。

## 关键 API / 配置

### 基本实现
```typescript
import { WebSocketServer, WebSocket } from 'ws';
import * as vscode from 'vscode';

let wss: WebSocketServer | null = null;

export function activate(context: vscode.ExtensionContext) {
  const port = vscode.workspace
    .getConfiguration('browserAgent')
    .get<number>('port', 7777);

  wss = new WebSocketServer({ port });

  wss.on('listening', () => {
    vscode.window.showInformationMessage(
      `Browser Agent WebSocket listening on port ${port}`
    );
  });

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (data: Buffer) => {
      const msg = JSON.parse(data.toString());
      // { type, payload, sessionId }
    });
    ws.on('close', () => { /* cleanup */ });
  });

  wss.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      vscode.window.showErrorMessage(
        `Port ${port} is in use. Change browserAgent.port setting.`
      );
    }
  });

  context.subscriptions.push({ dispose() { wss?.close(); } });
}
```

### 端口冲突处理策略
```typescript
async function findAvailablePort(startPort: number): Promise<number> {
  const net = require('net');
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}
```

### 消息协议
```typescript
interface BridgeMessage {
  type: string;        // 'user_message' | 'context_update' | 'ai_response' | ...
  payload: unknown;
  sessionId: string;
}
```

## 注意事项
- **用 `ws` 库而非 webview 内 WebSocket**：插件 host 是 Node.js 进程，直接用 `ws` 包。
- **Proxy 干扰**：VSCode 代理设置可能干扰，但 localhost 通常不受影响。
- **端口映射不支持 ws**：VSCode 端口映射 API 对 WebSocket 不生效，本地直连不需要。
- **deactivate 时关闭**：必须在 `context.subscriptions` 注册 dispose。
- **端口不一致**：tasks.json task_003 写 7890，program.md 写 7777，以 program.md 为准。

⚠️ 存在争议：tasks.json task_003 acceptance 中检查 7890，但 program.md 明确写 7777。后续需修正 tasks.json。

## 来源
- [VSCode Extension Samples - LSP Log Streaming](https://github.com/microsoft/vscode-extension-samples/blob/main/lsp-log-streaming-sample/client/src/extension.ts)
- [VSCode Issue #188008 - WebSocket Connection](https://github.com/microsoft/vscode/issues/188008)
- [VSCode Issue #74085 - Port Mapping for WebSockets](https://github.com/microsoft/vscode/issues/74085)
