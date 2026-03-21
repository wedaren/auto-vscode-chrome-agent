## 任务
evo_v6_002: WebSocket 双向工具调用协议：新增 tool_execute/tool_result 消息类型，实现请求-响应匹配（requestId + Promise + 超时）

## 假设
本次尝试：实现完整的 tool_execute / tool_result 双向工具调用协议。
- VSCode 侧：ws-server.ts 新增 pendingRequests Map + sendAndWait() 方法 + tool_result 消息路由
- Chrome 侧：新建 utils/tool-bridge.ts 处理 tool_execute → background EXECUTE_ACTION → tool_result
- 集成层：useWebSocket.ts 自动挂载 tool bridge handler，App.tsx 过滤工具消息不干扰聊天 UI

## 执行内容摘要
- 新建 `packages/chrome-ext/utils/tool-bridge.ts`：
  - `ToolExecutePayload` / `ToolResultPayload` 接口定义
  - `toAction()` 将 toolName+toolArgs 转为 BrowserAction
  - `executeViaBackground()` 通过 chrome.runtime.sendMessage 调用 background EXECUTE_ACTION
  - `handleToolExecute()` 处理单条 tool_execute 并发回 tool_result
  - `createToolBridgeHandler()` 创建消息过滤器（异步执行不阻塞）

- 修改 `packages/vscode-ext/src/ws-server.ts`：
  - 新增 `ToolResultPayload` / `PendingRequest` 接口
  - 新增 `pendingRequests: Map<string, PendingRequest>` 字段
  - `handleMessage()` 新增 `tool_result` case：通过 requestId 匹配 pending Promise 并 resolve
  - 新增 `sendAndWait(ws, msg, timeoutMs=30000)` 方法：发送消息+创建 Promise+超时自动 reject
  - `dispose()` 中清理所有 pending requests 防止 Promise 悬挂
  - 顶部添加完整的工具调用协议文档注释

- 修改 `packages/chrome-ext/hooks/useWebSocket.ts`：
  - 导入 `createToolBridgeHandler`
  - useEffect 中创建 tool bridge handler 并挂载到 WsClient 消息分发链
  - tool_execute 消息自动处理，不阻塞聊天 UI

- 修改 `packages/chrome-ext/entrypoints/sidepanel/App.tsx`：
  - onMessage 回调中过滤 tool_execute/tool_result 消息，不传给 handleChatMessage

- 修改 `packages/chrome-ext/src/ws-client.ts`：
  - 顶部注释增加工具调用消息类型文档

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
