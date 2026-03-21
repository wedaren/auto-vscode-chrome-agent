## 任务
evo_v8_001: Skill 数据模型 + SkillRegistry + 5 个内置预设 Skill 定义

## 假设
创建 MCP Tool Schema 风格的 Skill/SkillStep 接口，实现 SkillRegistry 类管理预设+自定义 Skill，内置 5 个浏览器操作预设 Skill，在 extension.ts 中初始化并注入生命周期。

## 执行内容摘要
- 新建 `packages/vscode-ext/src/skill-registry.ts`
  - 定义 `SkillParameterProperty` / `SkillParametersSchema` / `SkillStep` / `Skill` 接口
  - `SkillStep` 包含 toolName、argsTemplate（支持 {{param}} 插值）、description、optional
  - `Skill` 包含 name、displayName、description、category（preset/custom）、enabled、parameters（JSON Schema）、steps
  - 硬编码 5 个预设 Skill：navigate_to_url / organize_tabs / translate_page / extract_page_data / smart_form_fill
  - 实现 `SkillRegistry` 类：loadSkills()（合并预设+workspace config自定义）、saveSkills()（持久化自定义+预设enabled覆盖）、getAll() / getAllCustom() / getAllPreset() / getByName() / addSkill() / removeSkill() / toggleEnabled() / dispose()
  - onDidChange 事件供 TreeView 等消费方刷新
- 修改 `packages/vscode-ext/src/extension.ts`
  - import SkillRegistry
  - activate 中创建实例并调用 loadSkills()
  - subscriptions 和 deactivate 中加入 dispose

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
