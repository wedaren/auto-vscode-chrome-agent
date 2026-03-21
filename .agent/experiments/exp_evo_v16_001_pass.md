## 任务
evo_v16_001: Server 单客户端模式：Set<WebSocket> → activeClient 单引用 + 新连接踢旧连接

## 假设
将 ws-server.ts 中的 clients: Set<WebSocket> 替换为 activeClient: WebSocket | null 单引用，新连接到达时若旧连接存在且处于 OPEN/CONNECTING 状态则 close(4001)，clientAliveMap 替换为 isClientAlive: boolean，所有遍历 Set 的逻辑简化为直接操作 activeClient。

## 执行内容摘要
- `clients: Set<WebSocket>` → `activeClient: WebSocket | null`
- `clientAliveMap: Map<WebSocket, boolean>` → `isClientAlive: boolean`
- `connection` 事件：新连接到达时检查旧 activeClient，若 OPEN/CONNECTING 则 close(4001, 'replaced by new connection')
- `clientCount` getter：返回 activeClient 处于 OPEN 状态时 1，否则 0
- `firstClient` getter：直接返回 activeClient（OPEN 状态检查）
- `broadcast()`：简化为发送到 activeClient
- `startHeartbeat()`：仅检测 activeClient 一个连接
- `dispose()`：关闭 activeClient 并置 null
- `close` 事件：仅当断开的是 activeClient 时才清理引用

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
