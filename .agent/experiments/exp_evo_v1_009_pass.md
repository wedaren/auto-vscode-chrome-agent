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

## Validator 复核
结果：pass
分数：95/100
问题：
- TypeScript 裸 tsc 检查有 WXT 全局变量未识别警告（browser/defineBackground 等），但这是 WXT 项目的已知行为，npm run build 无错通过，不扣分
- TypingIndicator 组件代码简洁，有顶部注释、aria-label 无障碍属性，符合规范
- App.tsx 中显示逻辑正确：isStreaming 且 assistant 消息为空时显示指示器，内容到达后自动隐藏
- CSS 动画（@keyframes typing-bounce + .typing-dot）在 assets/style.css 中正确定义
- 未引入任何外部 API key 依赖，符合 program.md 约束
