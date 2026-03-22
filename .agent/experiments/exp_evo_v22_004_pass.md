## 任务
evo_v22_004: SkillRunner 步骤失败诊断增强：打印插值后实际 args + resultText 摘要辅助排查

## 假设
在 SkillRunner.execute() 的步骤失败分支中，调用新的 logStepFailureDiagnostics 方法，输出：
1. 插值后的实际 toolArgs（截断前 300 字符）
2. 上一步 resultText 摘要（截断前 300 字符）
3. 错误信息

## 执行内容摘要
- 在 skill-runner.ts 的步骤失败分支（可选/必需）前插入 `this.logStepFailureDiagnostics()` 调用
- 新增 `logStepFailureDiagnostics` 私有方法：
  - 打印失败步骤的工具名
  - 打印插值后的 resolvedArgs JSON（截断 300 字符）
  - 打印上一步 resultText 摘要（截断 300 字符）
  - 打印错误信息

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
