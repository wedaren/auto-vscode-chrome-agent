## 任务
evo_v14_003: 修复 App.tsx handleModelSelect/handleSendMessage useCallback 依赖：移除 debugLog，改用 debugLogRef.current.logOutbound

## 假设
handleModelSelect 和 handleSendMessage 两个 useCallback 的依赖数组包含 debugLog 对象引用，导致每次 debugLog 对象重建时回调也会重建，引发下游组件不必要重渲染和 React 渲染队列警告。改用 debugLogRef.current.logOutbound 可通过 ref 读取最新值而无需将 debugLog 加入依赖。

## 执行内容摘要
- 修改 handleModelSelect useCallback：`debugLog.logOutbound(...)` → `debugLogRef.current.logOutbound(...)`，依赖数组 `[sendMessage, debugLog]` → `[sendMessage]`
- 修改 handleSendMessage useCallback：`debugLog.logOutbound(...)` → `debugLogRef.current.logOutbound(...)`，依赖数组 `[chatSend, pageContext, debugLog]` → `[chatSend, pageContext]`

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
