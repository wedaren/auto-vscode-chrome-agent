## 任务
evo_v14_001: 修复 App.tsx useEffect(onMessage) 依赖：移除 debugLog，改用 debugLogRef.current 读取日志方法

## 假设
第一个 useEffect（onMessage 消息注册）的依赖数组包含 debugLog 对象引用，每次 useDebugLog 返回新对象时会导致 effect 重新执行，触发 React 渲染队列错误。通过在 effect 内部用 debugLogRef.current 读取最新 debugLog 方法，移除依赖数组中的 debugLog，即可打断无限循环。

## 执行内容摘要
- 在 useEffect 回调内部声明 `const debug = debugLogRef.current`，替代直接引用 `debugLog`
- 将 `debugLog.logInbound`、`debugLog.logExecution`、`debugLog.startTimeline` 全部改为 `debug.logInbound`、`debug.logExecution`、`debug.startTimeline`
- 依赖数组从 `[onMessage, handleChatMessage, debugLog]` 改为 `[onMessage, handleChatMessage]`

## 验收命令输出
```
}, [onMessage, handleChatMessage]);

// 连接状态变化：仅在状态从非 connected 转换为 connected 时请求模型列表
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

验收明细：
- acceptance_cmd：PASS（60/60）— 依赖数组 `[onMessage, handleChatMessage]` 不含 debugLog，grep 过滤通过；npm run build 零 error
- TypeScript 编译（20/20）— Chrome 插件构建通过，无 TS 编译错误
- program.md 约束（20/20）— 无外部 API key 依赖，Chrome 侧不内置模型，架构一致
