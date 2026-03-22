## 任务
evo_v22_001: 修复 immersive_translate Skill step3 路径表达式：translations 从 {{$prev}} 改为 {{$prev.translations}}

## 假设
llm_translate 工具返回的是 `{translations: [...]}` 完整对象，而 browser_inject_bilingual 步骤期望接收的是 translations 数组本身。只需将 argsTemplate 中的路径表达式从 `{{$prev}}` 改为 `{{$prev.translations}}`，SkillRunner 已有的 dot 路径解析能力会自动提取正确字段。

## 执行内容摘要
- 修改 `packages/vscode-ext/src/skill-registry.ts` 中 immersive_translate 的 step3（browser_inject_bilingual）argsTemplate
- 将 `translations: '{{$prev}}'` 改为 `translations: '{{$prev.translations}}'`

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
