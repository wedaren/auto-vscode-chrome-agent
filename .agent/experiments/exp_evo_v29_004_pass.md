## 任务
evo_v29_004: 斜杠命令扩展 — /skill 快捷触发 + /template prompt 模板 + Skill 名称自动补全

## 假设
在现有 ChatInput 斜杠命令基础上扩展 /skill 和 /template 命令，使用三模式菜单（commands/skills/templates）+ 模糊搜索实现自动补全

## 执行内容摘要
- 重写 ChatInput.tsx：
  - 新增 SlashMenuMode 状态机（commands/skills/templates）
  - 新增 /skill 命令：输入 `/skill ` 后进入 Skill 自动补全子菜单，支持按 preset/custom 分类显示
  - 新增 /template 命令：输入 `/template ` 后进入 Prompt 模板选择子菜单，8 个内置模板按分类分组
  - 新增 fuzzyMatch 函数：支持 contains + 字符顺序匹配的模糊搜索
  - 斜杠命令菜单升级为分类显示（会话/工具/模板三个分组）
  - Tab 自动补全支持三种模式
  - Enter 执行支持三种模式（命令执行/Skill触发/模板填入）
  - 导出 SkillItem 和 PromptTemplate 类型
- 修改 App.tsx：
  - 新增 chatSkills 状态，通过 skill_list_result 消息同步 Skill 列表
  - 连接建立时同时请求 skill_list（与 list_models 并行）
  - 新增 handleExecuteSkill 回调：发送 skill_execute WebSocket 消息 + Toast 提示
  - 新增 handleSwitchToSkills 回调
  - ChatInput 组件传入 skills/onExecuteSkill/onSwitchToSkills props

## 验收命令输出
```
packages/chrome-ext/components/ChatInput.tsx:// 扩展命令：/skill（Skill 快捷触发 + 名称自动补全）、/template（Prompt 模板选择）
packages/chrome-ext/components/ChatInput.tsx:  /** 可用 Skill 列表（由 App 传入，/skill 命令使用） */
packages/chrome-ext/components/ChatInput.tsx:    // /skill + 空格 → 进入 Skill 自动补全子菜单
packages/chrome-ext/components/ChatInput.tsx:    if (/^\/skill\s/i.test(value)) return 'skills';
packages/chrome-ext/components/ChatInput.tsx:    // /template + 空格 → 进入模板选择子菜单
packages/chrome-ext/components/ChatInput.tsx:    if (/^\/template\s/i.test(value)) return 'templates';
...
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
