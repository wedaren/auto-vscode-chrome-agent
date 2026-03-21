## 任务
task_evo_v16_003: Client 可见性感知重连：Side Panel 隐藏时暂停重连，可见时立即恢复

## 假设
在 WsClient 中监听 document.visibilitychange 事件，hidden 时暂停重连（清除 timer + 设置 _pausedByVisibility 标记），visible 时若未连接则重置计数并立即 connect()。scheduleReconnect 检查 _pausedByVisibility 标记跳过调度。dispose 时移除监听器。

## 执行内容摘要
- 在 WsClient 类中新增 `_pausedByVisibility` 布尔标记和 `boundVisibilityHandler` 绑定方法
- constructor 中注册 `document.addEventListener('visibilitychange', ...)`（带 typeof document 防护）
- 新增 `handleVisibilityChange()` 方法：
  - hidden → 清除 reconnectTimer + 设置 _pausedByVisibility=true
  - visible → 清除 _pausedByVisibility + 若非 connected/connecting 则 reconnectCount=0 并 connect()
- `scheduleReconnect()` 中增加 _pausedByVisibility 提前返回检查
- `dispose()` 中 removeEventListener 清理监听器

## 验收命令输出
PASS

## 结果
pass
