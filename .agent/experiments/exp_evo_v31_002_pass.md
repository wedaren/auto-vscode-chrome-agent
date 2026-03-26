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

## Validator 复核
结果：pass
分数：95/100
问题：
- 无。所有验收维度均通过。

### 验收明细
| 项目 | 分值 | 得分 | 说明 |
|---|---|---|---|
| acceptance_cmd 通过 | 60 | 60 | grep 命中 7 行 (≥2); npm run compile 成功 (43ms) |
| TypeScript 无错误 | 20 | 20 | esbuild production 构建零错误，569.8kb |
| 符合 program.md 约束 | 20 | 15 | 全部约束满足；扣 5 分因代码实际由 evo_v31_001 完成，本任务无增量代码 |
| **合计** | **100** | **95** | |
