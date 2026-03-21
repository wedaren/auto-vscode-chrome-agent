## 任务
evo_v12_004: WebSocket 心跳 + AgentLoop 超时保护

## 假设
在 ws-server.ts 中使用标准 WebSocket ping/pong 协议实现心跳检测，每 30 秒遍历所有客户端发送 ping，未收到 pong 的连接判定为死连接并 terminate。在 agent-loop.ts 中通过 CancellationTokenSource + setTimeout 实现总超时保护，与外部 CancellationToken 合并使用。

## 执行内容摘要
- ws-server.ts:
  - 新增 heartbeatInterval、HEARTBEAT_INTERVAL_MS (30s)、clientAliveMap 字段
  - 新增 startHeartbeat() 方法：setInterval 30s 遍历客户端，isAlive=false → terminate，否则设 false + ping
  - 新增 stopHeartbeat() 方法：clearInterval
  - connection 事件：设置 clientAliveMap(ws, true)，监听 pong 事件恢复 alive
  - close 事件：清理 clientAliveMap
  - listening 事件：调用 startHeartbeat()
  - dispose()：调用 stopHeartbeat()，清理 clientAliveMap
- agent-loop.ts:
  - AgentLoopOptions 新增 totalTimeout 字段（默认 TOTAL_TIMEOUT_MS = 300000）
  - AgentLoop 新增 static TOTAL_TIMEOUT_MS = 5 * 60 * 1000
  - run() 方法：创建 timeoutCts + setTimeout 实现超时中断
  - 合并外部 token 和超时 token（外部取消也会触发 timeoutCts.cancel）
  - finally 块中清理 timer、listener、CTS
  - 超时时返回含超时原因的 fallback 答案

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

10
10
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

### 验收详情
1. **acceptance_cmd 通过 (60/60)**：`npm run compile` 零错误；`ws-server.ts` 匹配心跳关键词 10 处；`agent-loop.ts` 匹配超时关键词 10 处；最终输出 PASS。
2. **TypeScript 编译无错误 (20/20)**：`tsc -p ./tsconfig.json` 零 error/warning。
3. **符合 program.md 约束 (20/20)**：
   - 模型调用仅通过 `vscode.lm` API（LmService → model.sendRequest）
   - Chrome 插件不内置模型
   - 未引入需要外部 API key 的依赖
4. **代码质量**：两个文件均有顶部注释；心跳实现完整（startHeartbeat/stopHeartbeat/dispose 清理）；超时保护完整（CancellationTokenSource + setTimeout + finally 清理 + fallback 答案）。
