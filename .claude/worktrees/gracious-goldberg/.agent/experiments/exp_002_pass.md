## 任务
task_002: VSCode 插件骨架 + vscode.lm 基础调用

## 假设
本次尝试：创建 lm-service.ts 封装 vscode.lm API，更新 extension.ts 注册命令，更新 package.json 添加 contributes 和 extensionDependencies

## 执行内容摘要
- 创建了 src/lm-service.ts：封装 selectModel / sendMessage / sendMessageStreaming
- 更新了 src/extension.ts：注册 browser-agent.ask 命令，初始化 LmService
- 更新了 package.json：添加 contributes.commands、extensionDependencies（github.copilot-chat）

## 验收命令输出
```
src//lm-service.ts:// lm-service.ts — 封装 vscode.lm API，提供语言模型调用能力
src//lm-service.ts: * LmService 负责与 vscode.lm API 交互，
src//lm-service.ts:    const models = await vscode.lm.selectChatModels({
src//lm-service.ts:    const fallbackModels = await vscode.lm.selectChatModels({ vendor: 'copilot' });
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
