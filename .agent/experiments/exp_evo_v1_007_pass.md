## 任务
evo_v1_007: Chrome 侧流式响应：App.tsx 处理 chunk 增量渲染 + 停止生成按钮

## 假设
在 App.tsx 中新增 isStreaming 状态和 streamingMsgIdRef 来追踪流式消息。处理 chat_response_chunk 时首个 chunk 创建新 assistant message，后续 chunk 增量追加；chat_response_end 用 fullText 校正最终内容并清除流式状态。停止按钮在 isStreaming 时显示，点击发送 cancel_chat。流式期间禁用 ChatInput。

## 执行内容摘要
- App.tsx 新增 `isStreaming` state 和 `streamingMsgIdRef` ref
- 新增 `chat_response_chunk` 消息处理：首 chunk 创建 assistant message，后续 chunk 用 `.map()` 增量追加 content
- 新增 `chat_response_end` 消息处理：用 fullText 校正最终内容，清除 streamingMsgIdRef 和 isStreaming
- 保留 `chat_response` 兼容旧式全量响应
- 新增 `handleCancelChat` 回调，发送 `cancel_chat` WebSocket 消息
- 流式期间快捷按钮区域替换为红色"停止生成"按钮（含 stop icon SVG）
- 流式期间 ChatInput 禁用（disabled={isStreaming}）
- handleSendMessage 增加 isStreaming 守卫

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
