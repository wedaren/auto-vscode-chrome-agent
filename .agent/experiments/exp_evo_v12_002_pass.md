## 任务
evo_v12_002: CancellationToken 生命周期修复：message-handler activeChatTokens WebSocket 断开自动清理 + agent-loop/lm-service 孤立 CTS 修复

## 假设
本次尝试：修复三个文件中的 CancellationTokenSource 生命周期问题：
1. message-handler.ts：添加 WebSocket close 事件监听 + 重发时先 dispose 旧 CTS
2. agent-loop.ts：callLlm 中临时 CTS 用 try/finally 保证 dispose
3. lm-service.ts：sendMessage/sendMessageStreaming 同理

## 执行内容摘要
- message-handler.ts 新增 `wsCloseRegistered` WeakSet 跟踪已注册 close 监听的 ws
- message-handler.ts 新增 `ensureWsCloseHandler(ws)` 方法：注册 ws.on('close') 自动 cancel+dispose CTS
- message-handler.ts 新增 `disposeExistingCts(ws)` 方法：同一 ws 重发 chat 时先清理旧 CTS
- message-handler.ts 在 handleChatAgentMode 和 handleChatStreamMode 入口处调用两个新方法
- agent-loop.ts callLlm：用 `let localCts` + try/finally 模式替代孤立 `new CTS().token`
- lm-service.ts sendMessage：同上模式修复
- lm-service.ts sendMessageStreaming：同上模式修复
- 全项目 src/ 下已无 `new vscode.CancellationTokenSource().token` 孤立模式

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

1
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
| 维度 | 分值 | 结果 |
|---|---|---|
| acceptance_cmd 通过 | 60/60 | ✅ 编译无错误，grep 匹配 ws.on('close') 1 处，无孤立 CTS 模式 |
| TypeScript 无编译错误 | 20/20 | ✅ `tsc -p ./tsconfig.json` 零错误 |
| 符合 program.md 约束 | 20/20 | ✅ 仅使用 vscode.lm API、无外部 API key 依赖 |

### 逐条需求核验
- ✅ MessageHandler 监听 WebSocket close 事件 → `ensureWsCloseHandler()` 注册 `ws.on('close', ...)` 自动 cancel+dispose+delete
- ✅ 同一 ws 快速重发 chat 时先 dispose 旧 CTS → `disposeExistingCts()` 方法
- ✅ agent-loop callLlm 不再创建孤立 CTS → `localCts` + `try/finally { localCts?.dispose() }` 模式
- ✅ lm-service sendMessage/sendMessageStreaming 同理 → 同样 `localCts` + `finally` 模式
- ✅ 编译通过
