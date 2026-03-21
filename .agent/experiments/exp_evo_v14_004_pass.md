## 任务
evo_v14_004: useDebugLog 返回值稳定化：用 useMemo 包裹返回对象，仅在 logs/timeline/toggles/stats 变化时重建

## 假设
将 useDebugLog 的 return 语句从普通对象字面量改为 useMemo 包裹，依赖数组包含所有状态值和 useCallback 函数引用，这样返回对象引用在依赖不变时保持稳定，避免消费者因对象引用变化触发不必要的重渲染。

## 执行内容摘要
- 修改 `packages/chrome-ext/hooks/useDebugLog.ts` 第 268-303 行
- 将 `return { logs, timeline, toggles, ... }` 改为 `return useMemo<UseDebugLogReturn>(() => ({ ... }), [deps])`
- 依赖数组包含：logs, timeline, toggles, logInbound, logOutbound, logConnection, logExecution, logError, startTimeline, endTimeline, clearLogs, clearTimeline, setToggles, exportLogs, getFilteredLogs, stats
- useMemo 已在文件第 9 行 import，无需额外引入

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
