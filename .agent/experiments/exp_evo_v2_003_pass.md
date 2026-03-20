## 任务
evo_v2_003: Chrome 重构：从 App.tsx 抽取 useChat + useWebSocket 自定义 Hooks

## 假设
将 App.tsx 中的 WebSocket 连接管理逻辑抽取到 useWebSocket Hook（封装 WsClient 初始化、连接状态、消息分发），将聊天消息逻辑抽取到 useChat Hook（封装 messages 状态、isStreaming、streamingMsgIdRef、发送/取消/流式处理），App.tsx 通过 Hook 组合模式将两者连接。

## 执行内容摘要
- 创建 hooks/useWebSocket.ts：封装 WsClient 初始化、connectionState 状态管理、sendMessage 方法、onMessage 监听器注册模式
- 创建 hooks/useChat.ts：封装 messages/isStreaming 状态、streamingMsgIdRef 生命周期、handleSendMessage（附加上下文）、handleCancel、handleChatMessage（处理 4 种聊天消息）、resetStreamingState
- 重写 App.tsx：移除内联 WebSocket 和聊天逻辑，改用 useWebSocket + useChat Hook，通过 useEffect 注册消息处理和连接状态变化响应，保留模型选择和页面上下文逻辑（evo_v2_004 将继续抽取）

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
