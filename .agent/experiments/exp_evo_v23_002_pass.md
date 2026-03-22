## 任务
evo_v23_002: Background EXECUTE_ACTION targetTabId 路由：当 payload 包含 targetTabId 时直接 tabs.sendMessage 到指定 tab，回退到 active tab 查询

## 假设
本次尝试：在 tool-bridge.ts 中提取 targetTabId 并透传到 EXECUTE_ACTION payload，在 background.ts 中通过 resolveTargetTabId() 统一处理路由逻辑（优先 targetTabId + tabs.get 验证，回退到 active tab 查询）

## 执行内容摘要
- **tool-bridge.ts**:
  - `ToolExecutePayload` 接口新增 `targetTabId?: number` 字段
  - `toAction` 函数返回 `{ action, targetTabId }`，从 toolArgs 中提取并移除 targetTabId
  - `executeViaBackground` 新增 `targetTabId` 参数，存在时附在 EXECUTE_ACTION payload 中
  - `handleToolExecute` 从 payload 级别和 toolArgs 级别双重提取 targetTabId（payload 优先）
- **background.ts**:
  - EXECUTE_ACTION 处理中从 rawPayload 解构提取 targetTabId，与 action 字段分离
  - 新增 `resolveTargetTabId()` 异步辅助函数：targetTabId 有效时通过 tabs.get 验证后返回，无效时回退到 active tab 查询
  - navigate 操作和其他操作均统一使用 resolveTargetTabId() 获取目标 tab

## 验收命令输出
```
✔ Finished in 2.118 s
PASS
```

## 结果
pass
