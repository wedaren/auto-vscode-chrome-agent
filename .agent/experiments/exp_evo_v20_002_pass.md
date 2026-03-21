## 任务
evo_v20_002: McpClient 子进程健壮性：崩溃自动重启 + 健康检查 + 连接状态生命周期管理

## 假设
在现有 McpClient 上增加三大健壮性机制：
1. transport onclose 事件监听 → 指数退避自动重连（最多 3 次）
2. 周期性健康检查（每 60s 调用 listTools 验证子进程存活）
3. 完整的连接状态生命周期（idle → connecting → connected → reconnecting → disconnected）
4. dispose() 清理所有定时器和监听器

## 执行内容摘要
- 重写 `packages/vscode-ext/src/mcp-client.ts`：
  - 新增 `McpConnectionState` 类型（idle / connecting / connected / reconnecting / disconnected）
  - 新增常量：`MAX_RESTART_ATTEMPTS = 3`，`RESTART_BASE_DELAY_MS = 2000`，`HEALTH_CHECK_INTERVAL_MS = 60_000`
  - `setupTransportListeners()`：在 client.connect 之前注册 transport.onclose/onerror 回调链
  - `handleTransportClose()`：检测子进程崩溃，connected 状态下触发 `scheduleReconnect()`
  - `scheduleReconnect()`：指数退避（2s → 4s → 8s），超过 3 次放弃并通知用户
  - `startHealthCheck()` / `stopHealthCheck()` / `performHealthCheck()`：60s 间隔调用 listTools 验证存活
  - `dispose()`：stopHealthCheck → cancelReconnectTimer → cleanupConnection → 重置状态 → 释放 EventEmitter
  - 新增 `disconnect()` 方法（主动断开不触发自动重连）
  - `_disposing` / `_manualDisconnect` 标志防止 dispose/主动断开期间误触发重连
  - 全生命周期日志输出（[LIFECYCLE]、[HEALTH] 前缀标记）

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
