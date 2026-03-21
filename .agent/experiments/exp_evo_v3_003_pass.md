## 任务
evo_v3_003: Chrome: 创建 AgentStepView 组件，展示 Agent 思考和工具调用过程

## 假设
本次尝试：创建 AgentStepView.tsx 组件，接收 steps 数组（AgentStep 类型，与 VSCode 侧对齐），按 think/act/observe 分色渲染；整体支持折叠/展开旧步骤（默认展开最近3步）；observe 内容超过 200 字默认折叠；isRunning 控制最后一步脉冲动画和全局旋转指示。同步在 style.css 中添加 agent-pulse 和 agent-spin 两个 CSS 动画。

## 执行内容摘要
- 创建 `components/AgentStepView.tsx`
  - 导出 AgentStep 接口（step, type, content, toolName?, toolArgs?）
  - 导出 AgentStepViewProps（steps, isRunning?）
  - ObserveContent 子组件：超过 200 字自动折叠，可展开/收起
  - StepLoadingIndicator：脉冲圆点，isRunning 时显示在最后一步
  - StepItem 子组件：按类型分色渲染
    - think：灰色斜体 + 🧠 图标
    - act：蓝色 + ⚡ 图标 + 工具名徽章（蓝色背景圆角标签）+ 参数提示
    - observe：绿色 + 📋 图标 + 可折叠内容
  - AgentStepView 主组件：默认展开最近3步，可折叠/展开旧步骤，运行中显示 spinner
- 修改 `assets/style.css`
  - 新增 `@keyframes agent-pulse` 脉冲动画
  - 新增 `.agent-step-pulse` 样式
  - 新增 `@keyframes agent-spin` 旋转动画
  - 新增 `.agent-step-spinner` 样式

## 验收命令输出
PASS

## 结果
pass
