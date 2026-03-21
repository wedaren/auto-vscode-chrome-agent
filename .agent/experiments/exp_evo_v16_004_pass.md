## 任务
evo_v16_004: Server welcome 握手：新连接发送 welcome 消息 + 记录 sessionId + Client 处理 welcome

## 假设
在 ws-server.ts connection 事件中立即发送 welcome 消息（含 replacedPrevious 标志），同时追踪客户端 sessionId；在 ws-client.ts onmessage 中识别 welcome 类型并 console.log。

## 执行内容摘要
- ws-server.ts: 新增 `activeSessionId` 字段追踪客户端 sessionId
- ws-server.ts: connection 事件中计算 `replacedPrevious` 布尔值，发送 `{ type: 'welcome', payload: { replacedPrevious }, sessionId: '' }` 消息
- ws-server.ts: message 事件中首次/变更时记录客户端 sessionId 到 outputChannel
- ws-server.ts: close 事件中清理 activeSessionId
- ws-client.ts: onmessage 中新增 welcome 消息处理分支，console.log 输出 replacedPrevious 信息
- ws-client.ts: 顶部注释新增握手类消息说明

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无显著问题。welcome 握手实现完整，Server 发送 { type: 'welcome', payload: { replacedPrevious } }，Client 正确处理并 console.log，sessionId 追踪逻辑正确，双端编译零错误，符合 program.md 全部约束。
