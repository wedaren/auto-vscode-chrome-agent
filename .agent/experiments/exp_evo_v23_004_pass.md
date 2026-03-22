## 任务
evo_v23_004: injectBilingual 注入结果诊断增强：injected=0 时返回诊断信息（可能原因 + 建议操作）

## 假设
在 executeInjectBilingual 返回结果中附加 diagnostic 字段（包含 possibleCauses 和 suggestedActions），
并在 SkillRunner 步骤成功后检测 injected=0 并输出结构化警告到 outputChannel。

## 执行内容摘要
- 修改 `packages/chrome-ext/utils/action-executor.ts`：
  - 在 inject case 返回前，当 `injected === 0 && skipped > 0` 时构建 diagnostic 对象
  - 分三种场景：autoRemark 后仍失败 / data-imt-id 存在但数据格式问题 / 标记全部缺失（tab 切换/SPA 重渲染）
  - diagnostic 包含 possibleCauses[] 和 suggestedActions[]
  - 附加到返回 data 中
- 修改 `packages/vscode-ext/src/skill-runner.ts`：
  - 新增 detectInjectZeroDiagnostic 私有方法，解析步骤 resultText JSON
  - 检测 injected === 0 时在 outputChannel 输出可能原因和建议操作
  - 在步骤成功后调用该方法

## 验收命令输出
✔ Finished in 2.023 s
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无。acceptance_cmd 通过；action-executor.ts 零 TS 错误；diagnostic 字段逻辑完整覆盖三种场景；SkillRunner 侧 detectInjectZeroDiagnostic 正确解析并输出警告；无外部依赖引入，符合 program.md 约束。
