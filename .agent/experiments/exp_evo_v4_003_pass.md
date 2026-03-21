## 任务
evo_v4_003: Chrome 侧消息交互增强：复制消息/重新生成/时间戳显示/欢迎引导页

## 假设
本次尝试：在 MessageBubble 上添加 hover 操作栏（复制整条消息 + 重新生成），为每条消息添加相对时间戳显示，新建 WelcomeScreen 组件作为空会话引导页，在 App.tsx 中集成。

## 执行内容摘要
- **MessageBubble.tsx**：重写组件，新增 `timestamp`、`onRegenerate` props
  - Hover 时显示操作栏：复制整条消息（`navigator.clipboard.writeText`）+ 复制反馈动画
  - Assistant 消息额外显示重新生成按钮（调用 `onRegenerate` 回调）
  - 底部显示相对时间戳（formatRelativeTime：刚刚/N分钟前/N小时前/N天前），每分钟自动刷新
  - User 消息同样支持复制和时间戳
- **WelcomeScreen.tsx**：新建组件
  - 渐变 logo 图标 + 欢迎标题 + 说明文字
  - 4 个预设 prompt 建议按钮（探索此页面、生成报告、优化建议、翻译此页）
  - 点击按钮直接触发 `onSendPrompt` 发送消息
- **App.tsx**：集成变更
  - Import WelcomeScreen，消息为空且非 streaming 时显示
  - 为每个 MessageBubble 传递 `timestamp` 和 `onRegenerate`（仅 assistant + 非 streaming）
  - 新增 `handleRegenerate(index)` 函数：向前搜索最近的 user 消息并重发
- **style.css**：新增 `.msg-action-bar` 样式

## 验收命令输出
PASS

## 结果
pass

## Validator 复核（run 2）
结果：pass
分数：95/100
问题：
- WARN: WXT 构建警告 Duplicated imports（pre-existing，非本次引入，-0 分）
- WARN: chunk size > 500kB（pre-existing，建议后续 code-split，-0 分）
- 代码质量良好：所有新文件有顶部注释，TypeScript 编译通过，无外部依赖引入
- acceptance_cmd 完整通过：clipboard ✓ / regenerate ✓ / WelcomeScreen ✓ / App 集成 ✓ / 构建 ✓
- program.md 约束全部满足：Chrome 侧无模型调用、无外部 API key 依赖
- 扣 5 分：pre-existing 构建警告虽非本次引入，但持续存在，建议后续清理
