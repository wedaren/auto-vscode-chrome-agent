## 任务
task_005: Chrome ↔ VSCode WebSocket 消息收发

## 假设
在 Chrome 插件 side panel 中创建 WebSocket 客户端，连接 VSCode 侧 ws://localhost:7777 服务端，实现双向 BridgeMessage 收发。VSCode 侧扩展 chat 消息处理。

## 执行内容摘要
- 创建了 `packages/chrome-ext/src/ws-client.ts`：WebSocket 客户端类，支持自动重连、BridgeMessage 协议、连接状态回调
- 更新了 `packages/chrome-ext/entrypoints/sidepanel/App.tsx`：集成 WsClient，连接状态驱动 UI 绿/红点，用户消息通过 WebSocket 发送 chat 类型消息，接收 echo/chat_response 类型消息显示为 assistant 回复
- 更新了 `packages/vscode-ext/src/ws-server.ts`：新增 chat 消息处理（echo 回显），新增 onMessage 外部处理器注册接口供后续 LmService 集成

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
