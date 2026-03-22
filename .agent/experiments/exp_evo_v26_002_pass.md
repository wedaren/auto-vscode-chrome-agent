## 任务
evo_v26_002: Chrome SkillPanel 场景展示区 UI + 一键执行（零参数）

## 假设
在 SkillPanel.tsx 中新增 ScenarioInfo 接口、ScenarioCard 子组件、executeScenario 函数，并在顶部添加「一键体验」场景展示区，点击场景卡片直接执行不弹参数弹窗。

## 执行内容摘要
- 新增 `ScenarioInfo` 接口（id / skillName / displayName / description / icon / targetUrl / prefilledParams）
- 新增 `scenarios` 状态，从 `skill_list_result` 的 payload 中解析 `scenarios` 字段
- `executeSkill` 函数扩展可选 `targetUrl` 参数，发送 `skill_execute` 时携带 `targetUrl`
- 新增 `executeScenario()` 回调，接收 ScenarioInfo 后直接调用 `executeSkill(skillName, prefilledParams, targetUrl)`，不弹参数弹窗
- 新增 `ScenarioCard` 子组件：紫色渐变卡片，包含 emoji icon + 标题 + 描述 + hover 播放按钮
- SkillPanel 渲染区在沉浸式翻译之后、预设 Skill 之前插入「一键体验」展示区，2 列 grid 布局

## 验收命令输出
```
✔ Finished in 1.710 s
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
