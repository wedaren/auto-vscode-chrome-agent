## 任务
evo_v31_002: Extension 多窗口生命周期适配 — follower 模式跳过 MessageHandler + 状态标记

## 假设
evo_v31_001 已完整实现 ws-server.ts 的 leader/follower 角色体系，同时 extension.ts 中的角色判断、MessageHandler 注册门控、wsServerHealthy 联动也已同步完成。本次验证已有代码满足所有 acceptance 标准。

## 执行内容摘要
- 验证 extension.ts 中无 showErrorMessage + EADDRINUSE 模式（确认：无匹配）
- 验证 extension.ts 行 130-168 根据 wsServer.role 判断是否注册 MessageHandler：leader 注册、follower 跳过并记录日志
- 验证 wsServerHealthy 标记与 role 联动：leader+listening → healthy=true，follower → healthy=false（非 error）
- ws-server.ts EADDRINUSE 分支使用 showInformationMessage（非 showErrorMessage），resolve（不 reject）
- 无需新增代码，evo_v31_001 已覆盖全部需求

## 验收命令输出
```
⚡ Done in 62ms
PASS
```

## 结果
pass
