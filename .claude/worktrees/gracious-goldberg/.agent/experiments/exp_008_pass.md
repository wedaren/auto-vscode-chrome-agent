## 任务
task_008: 深度报告生成

## 假设
创建 ReportGenerator 类，整合 LmService（规划+分析+生成）和 McpClient（页面探索），通过 WsServer 推送进度和结果。

## 执行内容摘要
- 创建了 `packages/vscode-ext/src/report-generator.ts`，包含完整的多页面探索和 Markdown 报告生成流程
- 修改了 `extension.ts`，集成 ReportGenerator 并注册 `browser-agent.generateReport` 命令
- 更新了 `package.json`，添加 generateReport 命令声明

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
