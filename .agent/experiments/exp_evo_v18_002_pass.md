## 任务
evo_v18_002: SkillRunner 步骤结果传递增强：支持 {{$prev}} 和 {{$step_N}} 插值语法

## 假设
在 interpolateValue 的正则表达式中扩展匹配模式，增加 `$prev` 和 `$step_\d+` 两个分支；
通过 previousResults（SkillStepResult[]）参数逐层传递已完成步骤的结果，实现步骤间数据传递。

## 执行内容摘要
- 修改 `skill-runner.ts`:
  - 文件头注释增加 `{{$prev}}` / `{{$step_N}}` 说明
  - SkillRunner 类 JSDoc 更新，列出三种占位符语法
  - `execute()` 调用 `executeStep()` 时传入累积的 `stepResults`
  - `executeStep()` 签名增加 `previousResults: SkillStepResult[]` 参数
  - `interpolateArgs()` 签名增加 `previousResults` 参数（默认空数组）
  - `interpolateValue()` 正则从 `/\{\{(\w+)\}\}/g` 扩展为 `/\{\{(\$prev|\$step_\d+|\w+)\}\}/g`
  - 新增 `{{$prev}}` 解析逻辑：取 `previousResults` 最后一项的 `resultText`
  - 新增 `{{$step_N}}` 解析逻辑：取 `previousResults[N]` 的 `resultText`
  - 越界/空引用场景通过 outputChannel 输出警告并返回空字符串
- 修改 `skill-registry.ts`:
  - SkillStep.argsTemplate 注释更新，说明三种插值语法

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
分数：100/100
问题：
- 无
