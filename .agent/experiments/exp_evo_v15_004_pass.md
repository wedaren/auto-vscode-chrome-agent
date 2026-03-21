## 任务
evo_v15_004: 心跳容错优化：ws-client.ts 收到任何业务消息时重置 pong 超时计时器，避免 Agent 执行期间误判断连

## 假设
在 onmessage 回调中，对所有有效 BridgeMessage 统一调用 resetPongTimeout()，将超时重置逻辑从仅 pong 响应扩展到全部消息类型。同时抽取 resetPongTimeout() 方法统一管理超时计时器的清除与重启。

## 执行内容摘要
- 新增 `resetPongTimeout()` 私有方法：清除现有 pongTimeoutTimer 并在心跳运行中重新启动超时计时器
- 在 `onmessage` 回调中，消息校验通过后立即调用 `resetPongTimeout()`（不限于 pong，任何有效消息都重置）
- 重构 `sendHeartbeatPing()` 复用 `resetPongTimeout()` 消除重复的超时逻辑
- 重构 `handlePong()` 复用 `resetPongTimeout()` + 计算延迟
- 更新文件头注释说明心跳容错行为

## 验收命令输出
PASS

## 结果
pass
