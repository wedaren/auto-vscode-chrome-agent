## 任务
evo_v26_001: PresetScenario 数据模型 + 内置演示场景 + skill_list 协议扩展

## 假设
在 skill-registry.ts 中新增 PresetScenario 接口和 PRESET_SCENARIOS 常量，SkillRegistry 新增 getScenarios() 方法；message-handler.ts 在 skill_list_result 中附带 scenarios 字段。

## 执行内容摘要
- 在 skill-registry.ts 新增 `PresetScenario` 接口（id / skillName / displayName / description / icon / targetUrl / prefilledParams）
- 新增 `PRESET_SCENARIOS` 导出常量，包含 7 个内置演示场景：
  1. 翻译 Hacker News（immersive_translate）
  2. 提取 GitHub Trending（extract_page_data）
  3. 阅读 MDN 文档（read_article）
  4. 整理标签页（organize_tabs，无 targetUrl）
  5. 网页全文提取（multi_step_extract，Wikipedia AI 页面）
  6. 页面性能检测（page_info，无 targetUrl）
  7. 采集页面链接（capture_all_links，Product Hunt）
- SkillRegistry 新增 `getScenarios()` 方法，过滤关联 Skill 存在且已启用的场景
- message-handler.ts `handleSkillList()` 调用 `getScenarios()` 并在 `skill_list_result` payload 中添加 `scenarios` 字段
- 未初始化时也返回空 `scenarios: []`

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
