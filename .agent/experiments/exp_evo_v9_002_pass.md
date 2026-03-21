## 任务
evo_v9_002: Toast 通知系统 + 消息发送重试机制：非阻塞错误提示，失败消息可一键重试

## 假设
本次尝试：实现三层架构 —— Toast UI 组件 + useToast 队列管理 Hook + useChat 中的消息状态跟踪与重试逻辑，通过回调桥接避免 Hook 间直接耦合。

## 执行内容摘要
- 创建 `components/Toast.tsx`：非阻塞 Toast 通知组件，固定右上角，支持 4 种类型（success/error/warning/info）、入场/退场动画、操作按钮、手动关闭
- 创建 `hooks/useToast.ts`：Toast 队列管理 Hook，最多 5 条，自动超时关闭（按类型不同 3-6 秒），提供 showToast/dismissToast API
- 修改 `utils/message-factory.ts`：Message 接口新增 `status` 字段（`MessageStatus = 'sending' | 'sent' | 'failed'`）
- 修改 `hooks/useChat.ts`：
  - handleSendMessage 中跟踪消息状态（sending → sent/failed）
  - 收到首个 chat_response_chunk 时自动将 sending 消息标记为 sent
  - 发送失败时通过 onToast 回调显示带"重试"按钮的 Toast
  - 新增 retryMessage 方法：移除失败消息后重新发送
- 修改 `components/MessageBubble.tsx`：支持 status/onRetry props，failed 消息显示红色背景 + 重试按钮
- 修改 `entrypoints/sidepanel/App.tsx`：集成 ToastContainer + useToast + 连接状态 Toast 提示

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无。acceptance_cmd 全部通过，构建 0 TS 错误，四个核心文件（Toast.tsx / useToast.ts / useChat.ts / message-factory.ts）均有顶部注释、类型完备、无外部 API key 依赖、Chrome 侧未内置模型调用，完全符合 program.md 约束。
