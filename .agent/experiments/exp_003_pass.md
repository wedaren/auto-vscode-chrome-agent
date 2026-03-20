## 任务
task_003: WebSocket server（VSCode 插件侧）

## 假设
创建独立的 ws-server.ts 模块封装 WebSocketServer，在 extension.ts 的 activate() 中启动，端口 7777，处理连接/断开事件，定义 BridgeMessage 协议接口。

## 执行内容摘要
- 创建了 `packages/vscode-ext/src/ws-server.ts`：WsServer 类，封装 WebSocketServer
- 修改了 `packages/vscode-ext/src/extension.ts`：集成 WsServer 启动和销毁
- 修改了 `packages/vscode-ext/package.json`：添加 `browserAgent.port` 配置项（默认 7777）
- BridgeMessage 接口定义：`{ type: string, payload: unknown, sessionId: string }`
- 实现了连接/断开/消息事件处理、EADDRINUSE 错误提示、broadcast/send 方法

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
