## 任务
evo_v1_013: 修复 isStreaming 状态管理：发送失败恢复 + chat_response_end 边缘情况

## 假设
App.tsx 中 isStreaming 状态在三种边缘场景下无法正确恢复：
1. sendMessage 发送失败（返回 false 或 client 为 null）
2. chat_response_end 的 fullText 为空字符串时条件判断失败
3. WebSocket 断连时流式状态未清理

通过检查返回值、改用 typeof 判断、监听断连事件三处修复即可解决。

## 执行内容摘要
- 修改 handleSendMessage：检查 client.sendMessage() 返回值，失败时恢复 isStreaming=false 并追加错误提示消息
- 修改 chat_response_end 处理：`endPayload?.fullText` → `typeof endPayload?.fullText === 'string'`，兼容空字符串
- 修改 onStateChange 处理：state === 'disconnected' 时检查 streamingMsgIdRef，自动恢复 isStreaming 状态

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
