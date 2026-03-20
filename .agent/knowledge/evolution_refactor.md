# Research: 重构这个项目

## 分析日期：2026-03-20

## 核心问题

### VSCode 侧 (packages/vscode-ext/src/)

| 文件 | 行数 | 质量 | 问题 |
|------|------|------|------|
| extension.ts | 294 | ❌ 差 | God Object，10+ 职责混合 |
| lm-service.ts | 176 | ✅ 好 | 无需重构 |
| ws-server.ts | 177 | ✅ 好 | 无需重构 |
| mcp-client.ts | 145 | ✅ 好 | 无需重构 |
| report-generator.ts | 363 | ✅ 好 | 无需重构 |

**extension.ts 混合的职责：**
1. VSCode 生命周期管理（activate/deactivate）
2. WebSocket 服务器初始化
3. WebSocket 消息路由（list_models/select_model/chat/cancel_chat）
4. 浏览器上下文处理 → system prompt 构建
5. 流式响应管理 + CancellationToken 生命周期
6. 3 个 VSCode 命令注册（generateReport/connectDevtools/ask）
7. 错误处理 + 用户通知
8. 输出日志

**应抽取的模块：**
- `message-handler.ts` — 消息路由 + 上下文构建 + 流式管理 + 取消令牌
- `command-registry.ts` — VSCode 命令注册

### Chrome 侧 (packages/chrome-ext/)

| 文件 | 行数 | 质量 | 问题 |
|------|------|------|------|
| App.tsx | 358 | ❌ 差 | 单体组件，7 职责混合 |
| ws-client.ts | 184 | ✅ 好 | 无需重构 |
| MessageBubble.tsx | 119 | ✅ 好 | 无需重构 |
| ModelSelector.tsx | 74 | ✅ 好 | 无需重构 |
| ChatInput.tsx | 59 | ✅ 好 | 无需重构 |
| TypingIndicator.tsx | 25 | ✅ 好 | 无需重构 |
| background.ts | 87 | ✅ 好 | 无需重构 |
| content.ts | 47 | ✅ 好 | 无需重构 |

**App.tsx 混合的职责：**
1. 状态管理（messages, connection, streaming, models, pageContext）
2. WebSocket 连接管理（初始化、状态监听、断连恢复）
3. 消息处理（6 种消息类型的 switch 路由，92 行）
4. 浏览器 runtime 消息监听（页面上下文同步）
5. 事件处理（模型选择、发送消息、取消生成）
6. 消息创建重复 3 次
7. UI 渲染

**应抽取的模块：**
- `hooks/useChat.ts` — 消息状态 + 流式处理 + 发送/取消
- `hooks/useWebSocket.ts` — WebSocket 连接管理 + 消息分发
- `hooks/usePageContext.ts` — 页面上下文获取与同步
- `utils/message-factory.ts` — createMessage 工具函数

## 重构目标

- extension.ts 缩减到 < 100 行（纯编排层）
- App.tsx 缩减到 < 150 行（纯 UI 渲染层）
- 不改变任何外部行为（纯内部重构）
- 双端构建必须通过
