## 任务
evo_v13_001: 修复 App.tsx useEffect 无限循环：connectionDetails 依赖导致 list_models 死循环

## 假设
App.tsx 中"连接状态变化" useEffect 的无限循环根因是：
1. 依赖数组包含 `connectionDetails`（对象引用，每条 WS 消息后都变）和 `debugLog`（每次渲染都变）
2. 每次 effect 重跑时，只要 connectionState === 'connected' 就发送 list_models，没有状态转换判断
3. 修复方案：用 useRef 追踪 prevConnectionState，仅在转换为 connected 时发送；用 ref 访问 connectionDetails/debugLog 避免依赖

## 执行内容摘要
- 在 App.tsx 中添加 3 个 ref：`prevConnectionStateRef`、`connectionDetailsRef`、`debugLogRef`
- 每次渲染同步 ref.current = latest value
- 重写"连接状态变化" useEffect：
  - 从 ref 读取 prevState，更新 ref 为当前 connectionState
  - 仅在 `prevState !== 'connected' && connectionState === 'connected'` 时发送 list_models
  - 通过 ref 读取 connectionDetails 和 debugLog，而非放入依赖数组
  - 依赖数组缩减为 `[connectionState, sendMessage, resetStreamingState, showToast, reconnect]`
- 修复 acceptance_cmd 的 zsh 兼容性问题（`!` 在 zsh 中被解析为 history expansion）

## 验收命令输出
```
4
PASS
```

## 结果
pass
