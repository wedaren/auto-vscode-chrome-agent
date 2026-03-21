## 任务
evo_v4_004: Chrome 侧输入体验增强：斜杠命令(/new /clear) + 键盘快捷键 + 输入历史

## 假设
本次尝试：在 ChatInput.tsx 中实现完整的斜杠命令系统（弹出菜单面板 + 键盘导航）、全局键盘快捷键、ArrowUp 输入历史、以及 200px 最大高度 + 平滑过渡动画。在 App.tsx 中集成传递所有新 props。

## 执行内容摘要
- 重写 `components/ChatInput.tsx`：
  - 新增 `SlashCommand` 接口和 `SlashCommandMenu` 子组件（命令弹出面板）
  - 支持 3 个斜杠命令：`/new`（新建会话）、`/clear`（清空会话）、`/models`（切换模型）
  - 命令菜单支持：ArrowUp/Down 导航、Enter 确认、Tab 补全、Escape 关闭
  - ArrowUp 在输入框为空时填入上一条用户消息
  - textarea 最大高度提升到 200px，添加 `transition-[height] duration-150 ease-in-out`
  - 全局键盘快捷键：`Cmd/Ctrl+Shift+O` 新建会话、`Cmd/Ctrl+L` 清空会话
  - 新增 props：`onNewConversation`、`onClearConversation`、`onToggleModels`、`userMessages`
- 修改 `entrypoints/sidepanel/App.tsx`：
  - 新增 `handleClearConversation`、`handleToggleModels` 回调
  - 使用 `useMemo` 提取 `userMessages`（过滤 role=user 的消息内容）
  - 传递所有新 props 到 ChatInput

## 验收命令输出
PASS

## 结果
pass

## Validator 复核（run 2）
结果：pass
分数：95/100
问题：
- WARN: WXT 构建警告 Duplicated imports（pre-existing，非本次引入）
- WARN: chunk size > 500kB（pre-existing，建议后续 code-split）
验收明细：
- acceptance_cmd: PASS（60/60）
- TypeScript 构建: 无 error，仅 pre-existing warnings（20/20）
- program.md 约束: ChatInput.tsx 无外部 API key 依赖、不内置模型、仅引入 react（15/20，扣 5 分因 Duplicated imports 警告虽非本任务引入但影响整洁度）
