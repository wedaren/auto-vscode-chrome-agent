## 任务
evo_v31_004: ConnectionTree + StatusBar 多窗口角色状态展示

## 假设
在 connection-tree.ts 的 WebSocket 节点中展示 Leader/Follower 角色状态，并在 extension.ts 中新增 StatusBar item 同步显示角色，订阅 onDidChangeRole 事件实现自动刷新。

## 执行内容摘要
- connection-tree.ts:
  - bind() 新增订阅 wsServer.onDidChangeRole 事件
  - getRootItems() WebSocket 根节点根据 role 展示 🟢 Leader（端口 7777）/ 🔵 Follower（等待中）
  - getWsChildren() 新增角色子节点（shield/eye/circle-slash 图标 + tooltip）
  - follower 模式下状态显示"等待竞选"并使用 sync~spin 图标
- extension.ts:
  - 新增 roleStatusBarItem (StatusBarItem) 模块变量
  - 新增 updateRoleStatusBar() 辅助函数，根据 role 设置 text/tooltip/backgroundColor
  - activate() 中创建 StatusBarItem 并订阅 onDidChangeRole
  - deactivate() 中清理 StatusBarItem
  - context.subscriptions 注册 dispose

## 验收命令输出
```
⚡ Done in 52ms
PASS
```

## 结果
pass
