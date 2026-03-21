## 任务
task_evo_v14_002: 修复 App.tsx errorLog 同步 useEffect 依赖：移除 debugLog，改用 debugLogRef.current.logError

## 假设
errorLog 同步 useEffect 的依赖数组包含 debugLog 对象引用，每次 useDebugLog 返回新对象时都会触发 effect 重新执行，导致 React 渲染队列异常。移除 debugLog 依赖，改用已有的 debugLogRef.current 读取最新值即可。

## 执行内容摘要
- 修改 App.tsx 第 370-376 行的 errorLog 同步 useEffect
- `debugLog.logError(...)` 改为 `debugLogRef.current.logError(...)`
- 依赖数组从 `[errorLog, debugLog]` 改为 `[errorLog]`
- 添加注释说明修复原因

## 验收命令输出
```
  const [errorLog, setErrorLog] = useState<ErrorLogEntry[]>([]);

  /** 添加错误日志条目（限制最大条目数） */
--
  }, [errorLog]);

  const handleModelSelect = useCallback((modelId: string) => {
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
