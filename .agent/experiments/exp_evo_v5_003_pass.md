## 任务
evo_v5_003: 消息检查器 TreeView：实时 WebSocket 消息流日志 + 点击查看完整 JSON

## 假设
本次尝试：实现完整的消息检查器 TreeView，包含环形缓冲区、消息采集钩子、虚拟文档 ContentProvider、清空命令

## 执行内容摘要
- **message-tree.ts** 完整重写（从占位符到完整实现）：
  - `RingBuffer<T>` 泛型环形缓冲区类，容量 200
  - `CapturedMessage` 接口：id、direction、message、timestamp
  - `captureMessage()` 全局函数，供 ws-server.ts 钩子调用
  - `clearMessageLog()` / `getCapturedMessages()` / `getCapturedMessageById()` 工具函数
  - `MessageDocumentProvider` 实现 `TextDocumentContentProvider`，按 message ID 返回完整 JSON
  - `MessageTreeItem` 支持点击打开详情命令
  - `MessageTreeDataProvider` 实现 `TreeDataProvider`：
    - 自动监听 `onDidCaptureMessage` 事件实时刷新
    - 每条显示 `↑/↓ type [HH:MM:SS.mmm] truncated_payload`
    - 图标使用 arrow-up / arrow-down ThemeIcon
    - MarkdownString tooltip 含详细信息
- **ws-server.ts** 注入采集钩子：
  - `send()` 中调用 `captureMessage('send', msg)`
  - `broadcast()` 中调用 `captureMessage('send', msg)`（只记一次避免重复）
  - `ws.on('message')` 中调用 `captureMessage('receive', msg)`
- **extension.ts** 注册：
  - `MessageDocumentProvider` 绑定 `browser-agent-message` scheme
  - `browser-agent.clearMessageLog` 命令
  - `browser-agent.openMessageDetail` 命令（点击消息节点触发）
- **package.json** 新增：
  - `browser-agent.clearMessageLog` 命令声明（含 clear-all 图标）
  - `menus.view/title` 配置将清空按钮添加到消息日志视图标题栏

## 验收命令输出
PASS

## 结果
pass
