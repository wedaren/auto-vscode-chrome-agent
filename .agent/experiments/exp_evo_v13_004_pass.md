## 任务
evo_v13_004: message-tree.ts TreeView 刷新节流：批量聚合 captureMessage 事件，防止高频消息导致 TreeView 疯狂刷新拖慢 VSCode

## 假设
在 MessageTreeDataProvider 构造函数中，将 onDidCaptureMessage 回调从直接调用 `_onDidChangeTreeData.fire()` 改为通过 debounce（200ms）的 `batchRefresh()` 方法间接调用。高频消息在 200ms 窗口内聚合为一次刷新。

## 执行内容摘要
- 在 `MessageTreeDataProvider` 中添加 `_refreshTimer` 字段和 `REFRESH_DEBOUNCE_MS = 200` 常量
- 新增 `batchRefresh()` 私有方法：使用 `setTimeout` + `clearTimeout` 实现 debounce
- 构造函数中 `onDidCaptureMessage` 回调改为调用 `batchRefresh()` 而非直接 `fire()`
- `dispose()` 方法中增加计时器清理逻辑
- `refresh()` 和 `clearMessageLog()` 保持直接 `fire()` — 用户主动操作不需要节流

## 验收命令输出
```
12
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
