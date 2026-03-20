## 任务
evo_v2_001: VSCode 重构：从 extension.ts 抽取 MessageHandler 消息路由类

## 假设
将 extension.ts 中所有 WebSocket 消息处理逻辑（list_models/select_model/chat/cancel_chat）、
浏览器上下文→system prompt 构建、CancellationToken 生命周期管理抽取到独立的 MessageHandler 类。
extension.ts 仅保留一行 `wsServer.onMessage((ws, msg) => messageHandler.handle(ws, msg))` 委托调用。

## 执行内容摘要
- 新建 `src/message-handler.ts`，包含 `MessageHandler` 类
  - `handle()` 方法作为消息路由入口，按 msg.type 分发
  - `handleListModels()` 处理模型列表请求
  - `handleSelectModel()` 处理模型选择请求
  - `handleChat()` 处理聊天消息（含流式响应 + CancellationToken）
  - `handleCancelChat()` 处理取消流式生成
  - `buildSystemPrompt()` 封装浏览器上下文→system prompt 构建逻辑
- 修改 `extension.ts`：
  - 移除 `WebSocket` import（不再直接使用）
  - 移除 `activeChatTokens` Map（移入 MessageHandler）
  - 移除 ~150 行的 switch-case 消息处理块
  - 新增 `import { MessageHandler }` 和 2 行委托代码
  - 文件从 294 行缩减到 145 行

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
