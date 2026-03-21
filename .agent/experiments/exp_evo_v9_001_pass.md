## 任务
evo_v9_001: React Error Boundary + 全局错误拦截层：防止组件崩溃白屏，自动恢复不丢会话

## 假设
本次尝试：创建 React Error Boundary 类组件包裹 App 根节点，利用 componentDidCatch 捕获渲染错误；通过 window.addEventListener('error') 和 window.addEventListener('unhandledrejection') 拦截异步错误；所有 hooks 关键操作添加 try-catch 防护。恢复策略是 ErrorBoundary 仅重置 hasError 状态，hooks 中的会话状态不丢失。

## 执行内容摘要
- 创建 `components/ErrorBoundary.tsx`：React 类组件，getDerivedStateFromError + componentDidCatch，fallback UI 含错误摘要/堆栈/恢复按钮，超过3次恢复失败提示刷新页面
- 修改 `entrypoints/sidepanel/App.tsx`：拆分为 AppRoot（ErrorBoundary 包装 + 全局错误监听）和 AppContent（原 App 逻辑），errorLog 状态维护
- 修改 `hooks/useChat.ts`：handleChatMessage、handleSendMessage、handleCancel 添加 try-catch，异常时自动恢复流式状态
- 修改 `hooks/useWebSocket.ts`：sendMessage 和消息分发循环逐 handler 添加 try-catch
- 修改 `hooks/usePageContext.ts`：消息处理回调添加 try-catch

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
