## 任务
evo_v1_009: TypingIndicator 组件：等待/流式响应时显示思考中动画

## 假设
创建一个三点跳动 CSS 动画的 TypingIndicator 组件，在用户发送消息后立即显示（设置 isStreaming=true），当流式内容的第一个 chunk 到达并创建 assistant 消息后自动隐藏。显示条件：isStreaming 为 true 且最后一条消息不是 assistant 或 assistant 消息内容为空。

## 执行内容摘要
- 新建 `components/TypingIndicator.tsx`：三个 `.typing-dot` span，带 aria-label 无障碍属性
- `assets/style.css` 添加 `@keyframes typing-bounce` 和 `.typing-dot` 样式（含 nth-child 延迟）
- `App.tsx` import TypingIndicator 组件
- `App.tsx handleSendMessage` 中发送消息时立即 `setIsStreaming(true)` 进入等待状态
- `App.tsx` 消息列表末尾添加条件渲染：isStreaming 且无 assistant 内容时显示 TypingIndicator

## 验收命令输出
PASS

## 结果
pass
