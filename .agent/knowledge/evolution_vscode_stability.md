# VSCode 插件稳定性分析

## 分析日期: 2026-03-21

## 总体评估: 稳定性 7/10

---

## 崩溃根因分类

### 1. 全局异常无兜底 (CRITICAL)
- extension.ts 的 `activate()` 中所有异步初始化使用 `.catch()` 记录日志但不阻断后续流程
- 如果 `wsServer.start()` 失败, wsServer 对象仍被传给 MessageHandler 等下游, 导致运行时崩溃
- 没有进程级 `uncaughtException` / `unhandledRejection` 处理器
- `void (async () => { ... })()` 模式中的异常只被局部 try/catch 捕获, 逃逸的异常直接崩溃扩展宿主进程

### 2. CancellationToken 生命周期问题 (HIGH)
- `message-handler.ts` 的 `activeChatTokens` Map:
  - WebSocket 断开时不会自动清理残留 token → 内存泄漏
  - 同一 WebSocket 快速 cancel+start 会覆盖旧 CTS 而不 dispose → 资源泄漏
- `agent-loop.ts` line 255: `new vscode.CancellationTokenSource().token` 创建了 CTS 但从未 dispose → 资源泄漏

### 3. 内存泄漏 (HIGH)
- `activeChatTokens` Map 无大小限制, WebSocket 断开不触发清理
- `LlmRequestCollector` 存储所有请求, 无淘汰策略
- `pendingRequests` Map 在极端情况下（Chrome 发送无 requestId 的 tool_result）可能累积孤立条目
- `ConnectionTree.updateDiskUsage()` 异步回调可能在 dispose 后执行

### 4. 服务初始化级联失败 (MEDIUM)
- 所有服务初始化是 fire-and-forget, 无健康检查
- wsServer 初始化失败 → browserToolProvider 拿到一个不工作的 wsServer → 工具调用崩溃
- skillRegistry.loadSkills() 失败 → skill 功能静默不可用, 用户无感知
- 无自动重试或恢复机制

### 5. WebSocket 连接脆弱性 (MEDIUM)
- 无心跳/ping-pong 检测死连接
- 客户端断开时, 如果有 pending agent loop, 后续 `wsServer.send()` 静默失败但 agent loop 继续执行浪费资源
- 无重连机制
- `firstClient` 返回第一个 OPEN 客户端, 多客户端时非确定性

---

## 受影响文件清单

| 文件 | 主要问题 |
|------|----------|
| extension.ts | 服务初始化无健康检查, 无全局错误兜底 |
| message-handler.ts | activeChatTokens 泄漏, void IIFE 异常处理 |
| agent-loop.ts | CTS 泄漏, 无超时控制, LLM 调用可能无限挂起 |
| ws-server.ts | 无心跳检测, pendingRequests 可能泄漏 |
| lm-service.ts | sendMessage/sendMessageStreaming 创建孤立 CTS |
| connection-tree.ts | 异步回调在 dispose 后可能执行 |
| llm-request-collector.ts | 无数据淘汰策略 |

---

## 修复优先级

1. **P0**: 全局错误兜底 + 服务初始化健康检查
2. **P1**: CancellationToken 生命周期修复 + WebSocket 断开清理
3. **P2**: 内存管理（有界集合 + 淘汰策略 + disposal guard）
4. **P3**: WebSocket 心跳 + Agent Loop 超时保护
5. **P4**: 全链路验收（压力测试场景）
