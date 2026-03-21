## 任务
evo_v16_002: Client 连接去重保护：connect() 增加 OPEN/CONNECTING 状态跳过 + 重连次数降至 10

## 假设
在 connect() 方法开头检查 ws.readyState，若为 OPEN 或 CONNECTING 则直接 return 跳过；将 DEFAULT_MAX_RECONNECT_ATTEMPTS 从 20 改为 10；更新 jitter 注释移除多客户端描述。

## 执行内容摘要
- connect() 开头增加 readyState === OPEN/CONNECTING 的去重保护，打印日志后直接 return
- DEFAULT_MAX_RECONNECT_ATTEMPTS 从 20 降为 10
- jitter 注释从"防止多客户端同步重连"改为"防止定时器对齐导致重连风暴"
- 头部注释和 WsClientOptions.maxReconnectAttempts 的 JSDoc 同步更新

## 验收命令输出
```
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
PASS
```

## 结果
pass
