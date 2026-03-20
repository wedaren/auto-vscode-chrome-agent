# Research: Chrome 对话做到 VSCode Copilot 一样好用

## 日期: 2026-03-20

## VSCode Copilot Chat 的核心体验特征

### 1. 流式响应（Streaming）
- Token-by-token 实时显示，用户无需等待完整响应
- 光标闪烁动画表示正在生成
- 这是 Copilot 最核心的"好用"体验

### 2. Markdown 渲染 + 代码高亮
- 支持完整 Markdown：标题、列表、粗体、链接等
- 代码块有语法高亮（基于语言标识）
- 每个代码块右上角有"复制"按钮
- 行内代码有背景色区分

### 3. 思考中/加载指示器
- 发送消息后立即显示 typing indicator（三点动画或进度条）
- 用户明确知道 agent 正在处理

### 4. 停止生成
- 生成过程中可点击"停止"中断
- 已生成的部分保留显示
- 使用 CancellationToken 机制

### 5. 其他增强（本次不在 scope）
- 消息历史持久化
- 代码插入到编辑器
- @workspace 上下文引用
- 多轮对话上下文管理

## 当前项目差距分析

| 特性 | Copilot | 当前实现 | 差距 |
|------|---------|----------|------|
| 流式响应 | ✅ token-by-token | ❌ 全量缓冲 | **关键缺失** - LmService 有 sendMessageStreaming 但未接入 |
| Markdown 渲染 | ✅ 完整支持 | ❌ 纯文本 | **关键缺失** - program.md 已选型 marked.js |
| 代码高亮 | ✅ highlight.js | ❌ 无 | **关键缺失** |
| 思考指示器 | ✅ 动画 | ❌ 无反馈 | **体验差** |
| 停止生成 | ✅ CancellationToken | ❌ 无 | **体验差** - 底部有停止按钮但未接入取消逻辑 |
| 复制代码块 | ✅ 按钮 | ❌ 无 | 增强功能 |

## 优先级排序

1. **P0 - 流式响应**：最大体验提升，消除等待黑洞
2. **P0 - Markdown + 代码高亮**：AI 响应可读性的基础
3. **P1 - 思考指示器 + 停止生成**：用户控制感
4. **P2 - 复制代码块**：可在 Markdown 组件中一并实现

## 技术方案

### 流式响应链路
```
LmService.sendMessageStreaming(text, onFragment)
  → 每个 fragment 通过 WsServer 发送 { type: 'chat_response_chunk', payload: { text, done: false } }
  → 完成时发送 { type: 'chat_response_end', payload: { fullText } }

Chrome 侧:
  → 收到 chat_response_chunk: 追加到当前 assistant message.content
  → 收到 chat_response_end: 标记消息完成
```

### 取消机制
```
Chrome 发送 { type: 'cancel_chat' }
  → VSCode 侧 AbortController.abort()
  → LmService 中断流式迭代
  → 发送 chat_response_end 标记结束
```

### Markdown 渲染
- 使用 marked.js 解析 Markdown → HTML
- 使用 highlight.js 对代码块语法高亮
- 封装为 MessageBubble 组件，区分 user/assistant 渲染逻辑
- assistant 消息用 dangerouslySetInnerHTML 渲染（需 DOMPurify 清理）
