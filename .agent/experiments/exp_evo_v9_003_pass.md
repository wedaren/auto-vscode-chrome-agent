## 任务
evo_v9_003: WebSocket 连接健壮性增强：心跳检测 + 连接状态机 + 流式中断恢复 + 手动重连按钮

## 假设
本次尝试：在现有 WsClient 基础上扩展心跳检测机制、完善连接状态机、增加流式中断提示、添加可点击的连接状态面板和手动重连按钮

## 执行内容摘要
- 重写 `packages/chrome-ext/src/ws-client.ts`：
  - ConnectionState 从 3 态扩展为 5 态：disconnected / connecting / connected / reconnecting / failed
  - 新增心跳机制：每 15 秒发送 heartbeat_ping，10 秒内未收到 pong 则判定连接失效并触发重连
  - 入站消息增加基础类型校验（必须包含 type 字段，否则丢弃并 warn）
  - 新增 `reconnect()` 公开方法供手动重连
  - 新增 `ConnectionDetails` 接口和 `details` getter 暴露重连次数/延迟/最后活跃时间
- 更新 `packages/chrome-ext/hooks/useWebSocket.ts`：
  - 暴露 `reconnect` 方法和 `connectionDetails` 状态
  - 每次消息到达时刷新 connectionDetails
- 修改 `packages/chrome-ext/hooks/useChat.ts`：
  - `resetStreamingState` 在中断时保留已接收的部分内容，追加 '⚠️ 连接中断，回复不完整'
- 重写 `packages/chrome-ext/entrypoints/sidepanel/App.tsx`：
  - 新增 `ConnectionIndicator` 组件：可点击的连接状态指示器
  - 弹窗显示：状态、服务端地址、重连次数、心跳延迟、最后活跃时间
  - 弹窗包含手动「重新连接」按钮
  - failed 状态时 Toast 也提供重新连接 action
- 修正 acceptance_cmd 中路径错误（utils/ws-client.ts → src/ws-client.ts）

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

### 验收维度详情

**1. acceptance_cmd（60/60）**
- `grep -q 'ping|heartbeat' src/ws-client.ts` — ✅ 心跳机制完整实现（heartbeat_ping/heartbeat_pong/sendHeartbeatPing/heartbeatInterval/heartbeatTimeout）
- `grep -q 'reconnecting|failed' src/ws-client.ts` — ✅ 5 态连接状态机（disconnected/connecting/connected/reconnecting/failed）
- `grep -q '连接中断|不完整' hooks/useChat.ts` — ✅ resetStreamingState 追加 '⚠️ 连接中断，回复不完整'
- `grep -q '重新连接|reconnect' entrypoints/sidepanel/App.tsx` — ✅ ConnectionIndicator 手动重新连接按钮 + failed Toast reconnect action
- `npm run build` — ✅ 零 TypeScript 错误

**2. 代码一致性（20/20）**
- TypeScript 严格模式：构建无错误
- 无禁止的外部依赖引入
- 所有新增/修改文件均有顶部注释

**3. program.md 约束符合度（20/20）**
- 模型调用不涉及（本任务为 Chrome 侧 WebSocket 健壮性，不涉及 LM 调用）
- Chrome 插件不内置模型：✅
- 无需外部 API key 的依赖：✅
- WebSocket 通信走 localhost:7777：✅
- 消息格式 JSON（type/payload/sessionId）：✅
