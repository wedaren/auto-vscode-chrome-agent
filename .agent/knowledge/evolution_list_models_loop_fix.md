# Research: 修复 list_models 无限循环导致 VSCode 卡死

## 问题描述
Chrome 插件连接后，消息日志中不断出现 `list_models` 消息，导致 VSCode 插件卡死。

## 根因分析

### 无限循环路径

```
Chrome App.tsx useEffect (依赖: connectionDetails)
  → connectionState === 'connected' → sendMessage('list_models')
  → VSCode handleListModels → vscode.lm.selectChatModels() → send models_list
  → Chrome 收到 models_list → useWebSocket onMessage → setConnectionDetails({...new ref})
  → connectionDetails 引用变化 → useEffect 重新执行
  → connectionState 仍是 'connected' → 再次 sendMessage('list_models')
  → ∞ 无限循环
```

### 核心原因

1. **App.tsx L319-343**: `useEffect` 的依赖数组包含 `connectionDetails`（对象引用）
2. **useWebSocket.ts L93**: 每条消息都执行 `setConnectionDetails({ ...client.details })`，创建新的对象引用
3. **React 引用比较**: `connectionDetails` 是对象，每次 `{ ...spread }` 都是新引用，导致 useEffect 判定依赖变化并重新执行
4. **无条件发送**: useEffect 内只判断 `connectionState === 'connected'` 但没有判断是否是**状态转换**（transition）

### VSCode 侧雪崩效应

- `vscode.lm.selectChatModels({})` 被反复调用（昂贵的 API 调用）
- `outputChannel.appendLine` 大量写入日志
- `captureMessage()` → `_onDidCaptureMessage.fire()` → MessageTreeDataProvider 每条消息都触发 TreeView 刷新
- 上述三者叠加导致 Extension Host 进程 CPU 100%、UI 冻结

## 修复方案

### 1. App.tsx: 用 ref 追踪状态转换（根本修复）
- 引入 `useRef` 保存前一次 `connectionState`
- 只在 `prevState !== 'connected' && currentState === 'connected'` 时发送 `list_models`
- 从依赖数组中移除 `connectionDetails`，改用 ref 读取最新值
- 将 `debugLog` 调用也移到独立 effect 或使用 ref

### 2. MessageHandler: list_models 节流（纵深防御）
- 维护 `_lastListModelsTime` 和 `_cachedModels`
- 5 秒内重复请求直接返回缓存，不调用 `vscode.lm.selectChatModels()`
- 防止未来其他客户端也触发类似问题

### 3. useWebSocket: connectionDetails 浅比较（性能优化）
- 不再每条消息都 `setConnectionDetails`
- 浅比较 `reconnectCount / latency / state`，只在值实际变化时才更新 state

### 4. MessageTreeDataProvider: 刷新节流（UI 优化）
- 对 `_onDidCaptureMessage` 添加 debounce（200ms）
- 高频消息不会每条都触发 TreeView 重绘

## 涉及文件

| 文件 | 修改类型 |
|------|----------|
| `packages/chrome-ext/entrypoints/sidepanel/App.tsx` | 修复 useEffect 依赖 + ref 追踪 |
| `packages/vscode-ext/src/message-handler.ts` | list_models 节流 |
| `packages/chrome-ext/hooks/useWebSocket.ts` | connectionDetails 浅比较 |
| `packages/vscode-ext/src/message-tree.ts` | TreeView 刷新 debounce |
