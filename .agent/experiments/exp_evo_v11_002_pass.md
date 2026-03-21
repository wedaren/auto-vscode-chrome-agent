## 任务
evo_v11_002: 在 extension.ts 中集成 UserDataManager 生命周期：激活时初始化目录，监听配置变更

## 假设
在 extension.ts 的 activate() 中最先创建 UserDataManager 实例并调用 init()，使用 vscode.workspace.onDidChangeConfiguration 监听 browserAgent.userDataDir 变更事件，变更时重新调用 init()。

## 执行内容摘要
- 在 extension.ts 顶部添加 `import { UserDataManager } from './user-data-manager'`
- 添加模块级变量 `let userDataManager: UserDataManager | undefined`
- 在 activate() 中 outputChannel 创建后立即初始化 UserDataManager（最先初始化，其他模块可能依赖）
- 注册 `vscode.workspace.onDidChangeConfiguration` 监听器，检测 `browserAgent.userDataDir` 变更后重新 init()
- 将 configChangeDisposable 和 userDataManager dispose 添加到 context.subscriptions
- 在 deactivate() 中清理 userDataManager

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无重大问题
- acceptance_cmd 通过 (60/60)
- TypeScript compile 零错误 (20/20)
- 符合 program.md 约束：仅使用 vscode + node 内置模块，无外部 API key 依赖 (15/20，扣5分因 SkillRegistry 尚未注入 UserDataManager，但属于 evo_v11_003 范围)
