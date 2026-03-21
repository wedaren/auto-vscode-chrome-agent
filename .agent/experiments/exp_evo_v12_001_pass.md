## 任务
evo_v12_001: 全局错误兜底 + 服务初始化健康检查

## 假设
在 extension.ts activate() 中增加 process-level 错误处理器（uncaughtException / unhandledRejection），
并将 wsServer.start() 从 fire-and-forget 改为 await 模式，通过健康状态标记决定是否注册 MessageHandler 消息回调。

## 执行内容摘要
- 在 activate() 顶部注册 process.on('uncaughtException', handler) 和 process.on('unhandledRejection', handler)
- 两个处理器均记录到 outputChannel 并通过 showErrorMessage 通知用户
- 添加 wsServerHealthy 布尔标记，初始为 false
- 将 wsServer.start().catch() fire-and-forget 改为 async IIFE 中 await wsServer.start()
- start 成功时 wsServerHealthy=true，失败时保持 false 并 showErrorMessage
- MessageHandler 创建和 onMessage 注册仅在 wsServerHealthy=true 时执行
- 在 context.subscriptions 中注册 dispose 回调，deactivate 时 removeListener 进程级处理器

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

7
8
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
