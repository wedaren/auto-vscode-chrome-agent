## 任务
evo_v35_005: deep_research 预设 Skill + /research 斜杠命令 + 端到端集成验收

## 假设
本次尝试：在 SkillRegistry 添加 deep_research 预设 Skill（#21），在 ChatInput 添加 /research 斜杠命令（支持 /research <主题> 直接启动 + 无参数仅切换 Tab），在 ResearchPanel 添加 initialTopic 自动启动和追问输入 UI（报告完成后可迭代优化），在 App.tsx 连接所有组件

## 执行内容摘要
- **skill-registry.ts**: 新增第 21 个 PRESET_SKILLS `deep_research`（含 topic/maxIterations/maxPages 参数，5 步浏览器工具流程）+ `scenario_deep_research_ai` 预设场景
- **ChatInput.tsx**: 新增 `onStartResearch` prop + `/research` 斜杠命令（category=工具）+ handleSubmit 中拦截 `/research <topic>` 和 `/research`
- **App.tsx**: 新增 `pendingResearchTopic` 状态 + `handleStartResearch` 回调（切换 Tab + 存 topic） + `handleResearchTopicConsumed` + 传递 props 到 ChatInput 和 ResearchPanel
- **ResearchPanel.tsx**: 新增 `initialTopic`/`onInitialTopicConsumed` props + useEffect 自动消费 initialTopic + `handleFollowUp` 追问回调（将前报告摘要作为 pageContext 传给新调研）+ `ReportRenderer` 新增追问输入区（textarea + Enter 发送 + 提示文案）

## 验收命令输出
PASS

## 结果
pass
