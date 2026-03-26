## 任务
evo_v35_003: Chrome 深度调研 UI — ResearchPanel + 研究计划编辑 + 思考流 + 报告渲染

## 假设
创建独立的 useResearch hook 管理调研状态机（idle→starting→plan_review→executing→done→error），
创建 ResearchPanel 组件包含 5 个子组件（TopicInput、PlanEditor、ProgressIndicator、ThinkingStream、ReportRenderer），
集成到 App.tsx 作为第 4 个 Tab（Research）。

## 执行内容摘要
- 创建 `hooks/useResearch.ts`：管理 ResearchPhase 状态机 + 处理 5 种 deep_research_* 消息 + 暴露 startResearch/confirmPlan/rejectPlan/reset 操作
- 创建 `components/ResearchPanel.tsx`：
  - TopicInput — 主题输入表单（textarea + 启动按钮）
  - PlanEditor — 子问题列表可增删改 + 搜索策略编辑 + 确认/取消按钮
  - ProgressIndicator — 实时进度（阶段图标 + 状态标签 + 引用数 + 思考步骤数 + 计时器）
  - ThinkingStream — 思考流正序展示，自动滚动到底部
  - ReportRenderer — Markdown 渲染 + [N] 引用标注可点击跳转 + 参考文献列表 + 子问题完成摘要
- 修改 App.tsx：ActiveTab 新增 'research'，添加 Research Tab 按钮 + ResearchPanel 渲染
- 修改 assets/style.css：新增 .research-report Markdown 样式 + .citation-link 引用标注样式
- 修改 tailwind.config.ts：content 新增 hooks 路径

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：92/100
问题：
- 无（acceptance_cmd PASS, tsc --noEmit 零错误, 无禁止依赖, 新文件含顶部注释, Chrome 侧不内置模型）
