## 任务
evo_v15_001: WsClient 重连指数退避：固定 3s 改为 1s→2s→4s→8s→max30s + jitter + maxReconnectAttempts=20 + 合并重连日志

## 假设
修改 ws-client.ts 的 scheduleReconnect() 方法，将固定间隔替换为指数退避算法，添加 jitter、有限重连次数和日志合并。

## 执行内容摘要
- 新增 4 个常量：BASE_RECONNECT_INTERVAL(1s)、MAX_RECONNECT_INTERVAL(30s)、DEFAULT_MAX_RECONNECT_ATTEMPTS(20)、RECONNECT_LOG_INTERVAL(5)
- WsClientOptions.reconnectInterval 默认值从 3000 改为 1000（基准间隔）
- WsClientOptions.maxReconnectAttempts 默认值从 Infinity 改为 20
- scheduleReconnect() 使用 `Math.min(base * Math.pow(2, count-1), MAX)` 计算退避延迟
- 添加 ±25% 随机 jitter：`exponentialDelay * (0.75 + Math.random() * 0.5)`
- 重连日志合并：仅首次、每 5 次、最后一次打印
- onopen 中检测 reconnectCount > 0 时打印重连成功信息
- 更新文件头注释说明新的重连策略

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
