## 任务
evo_v8_002: VSCode Skill 管理 TreeView：Activity Bar 新增 Skill 视图，展示/运行/管理所有 Skill

## 假设
基于 evo_v8_001 的 SkillRegistry，创建 SkillTreeDataProvider 按 preset/custom 分组展示所有 Skill，每个 Skill 节点支持 inline 运行/切换按钮。参考已有的 connection-tree.ts / message-tree.ts 模式实现。

## 执行内容摘要
- 新建 `packages/vscode-ext/src/skill-tree.ts`：
  - SkillTreeItem 类（带 nodeType: category | skill）
  - SkillTreeDataProvider 类（按 preset/custom 两组展示，订阅 SkillRegistry.onDidChange 刷新）
  - 每个 Skill 节点：图标（play-circle/debug-pause）、description（已禁用状态）、MarkdownString tooltip（完整描述+步骤列表）
  - contextValue 区分 4 种状态：skill-preset-enabled/disabled、skill-custom-enabled/disabled
  - runSkillCommand：支持 TreeView inline 触发和命令面板触发，弹出参数输入框（QuickPick/InputBox）
  - toggleSkillCommand：切换 enabled 状态
  - addCustomSkillCommand：打开 JSON 编辑器让用户创建自定义 Skill
- 修改 `package.json`：
  - views 新增 browser-agent-skills 视图
  - commands 新增 3 个命令（runSkill、toggleSkill、addCustomSkill）
  - menus 新增 view/title（添加按钮）和 view/item/context（inline 运行 + 切换按钮）
- 修改 `src/extension.ts`：
  - 导入 SkillTreeDataProvider 和 3 个命令函数
  - 创建 skillTree 并 bind(skillRegistry)
  - 注册 3 个命令
  - 添加到 subscriptions 和 deactivate

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
