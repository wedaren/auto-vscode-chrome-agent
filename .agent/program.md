# program.md — Browser Agent

## 目标
开发一个 agent，用户在 Chrome side panel 里对话，vsocde 作为 agent 的大脑，记录所有日志，方便排查分析问题

---

## 系统组成

### Chrome 插件（前端入口）
- Side panel 作为对话窗口（React + Tailwind）
- 感知当前页面上下文：URL、DOM 选中文本、截图
- 通过 WebSocket 与 VSCode 插件通信（localhost:7777）

### VSCode 插件（agent 大脑）
- 使用 vscode.lm API 调用语言模型
- 接收 Chrome 上下文和用户指令
- 管理 Karpathy Loop

### WebSocket 桥接
- 本地直连，不经过外部服务器
- 端口：7777
- 消息格式：JSON，包含 type / payload / sessionId

---


---

## 文件约定

.agent/
├── program.md       ← 本文件（用户原始模糊想法）
├── requirements.md  ← PM 提炼的结构化需求文档
├── tasks.json       ← 任务队列
├── state.json       ← 当前状态
├── decisions.md     ← 自动决策日志
├── experiments/     ← Loop 记录
├── knowledge/       ← Research 积累
└── inbox/
    └── needs-you.md ← 卡住时才写这里
    
## 功能进化区（MVP 完成后持续追加）

### 待实现功能

- [x] chrome 插件对话能选 vscode.lm 模型对话（已拆解为 evo_v1_001, evo_v1_002, evo_v1_003, evo_v1_004, evo_v1_005）
- [x] chrome 对话要做到 vscode Copilot 一样好用（已拆解为 evo_v1_006, evo_v1_007, evo_v1_008, evo_v1_009, evo_v1_010）
- [x] 现在 chrome 对话无法正常对话（已拆解为 evo_v1_011, evo_v1_012, evo_v1_013, evo_v1_014）
- [x] 重构这个项目（已拆解为 evo_v2_001, evo_v2_002, evo_v2_003, evo_v2_004, evo_v2_005）
- [~] 不考虑时间，仅考虑你认为这个 agent 的愿景，规划实现它（已拆解为 evo_v3_001, evo_v3_002, evo_v3_003, evo_v3_004, evo_v3_005 — Agentic Tool Use: ReAct 循环让 LM 在对话中自主使用 MCP 浏览器工具）
- [x] 不考虑时间，使用最优解，优化聊天体验（已拆解为 evo_v4_001, evo_v4_002, evo_v4_003, evo_v4_004, evo_v4_005 — 聊天记录持久化 + 多会话管理 + 消息交互增强 + 输入体验增强）
- [x] 不考虑时间，使用最优解，方便调试体验，在 vsocde 插件有对应的视图方便查看与使用（已拆解为 evo_v5_001, evo_v5_002, evo_v5_003, evo_v5_004, evo_v5_005 — VSCode 调试视图体系：Activity Bar 容器 + 连接状态 TreeView + 消息检查器 TreeView + Agent 循环可视化 TreeView）
- [x] 不考虑时间，使用最优解，让 agent 能使用工具替用户在浏览器上操作（已拆解为 evo_v6_001, evo_v6_002, evo_v6_003, evo_v6_004, evo_v6_005 — 原生浏览器操作工具：Chrome content script 操作执行器 + WebSocket 双向工具调用协议 + BrowserToolProvider 工具注册表 + AgentLoop 多工具源集成）
- [x] 希望有简要的功能使用文档及使用案例，指导用户使用（已拆解为 evo_v7_001, evo_v7_002, evo_v7_003, evo_v7_004, evo_v7_005 — 项目 README + Chrome 插件使用指南 + VSCode 插件使用指南 + 5 个典型使用案例）
- [x] 不考虑时间，使用最优解，希望能遵循 skill， mcp 规范，有个 vsocde 视图配置配置，可以预设一批操作浏览器的 skill，进入指定页面，整理 tab，友好型将页面翻译，等；如果需要可以考虑重构（已拆解为 evo_v8_001, evo_v8_002, evo_v8_003, evo_v8_004, evo_v8_005 — Skill 系统：MCP 风格数据模型 + VSCode TreeView 管理视图 + SkillRunner 执行引擎 + Chrome Skill 面板 + 5 个内置预设 Skill）
- [x] 不考虑时间，使用最优解，希望 chrome 对话体验要稳定，尽可能避免出错。可以考虑补充相关开关或者 tab 页面等，背后执行逻辑方便用户查看，或者说方便 debug（已拆解为 evo_v9_001, evo_v9_002, evo_v9_003, evo_v9_004, evo_v9_005 — 稳定性体系：React Error Boundary + Toast 通知系统 + 消息重试 + WebSocket 心跳健壮性 + Chrome Debug 调试面板）
- [x] 不考虑时间，使用最优解，在对话窗口提供按钮，可以下载完整的 llm 请求细节，方便 debugger 也方便分析优化（已拆解为 evo_v10_001, evo_v10_002, evo_v10_003, evo_v10_004, evo_v10_005 — LLM 请求细节下载：VSCode 侧 LlmRequestCollector 数据采集 + WebSocket llmDetail 协议扩展 + Chrome 下载工具函数 + MessageBubble 下载按钮）
- [x] vsocde 插件可以配置用户信息的目录，默认配置在 ～ 目录下；可以存放 skills 等等需要持久化的信息（已拆解为 evo_v11_001, evo_v11_002, evo_v11_003, evo_v11_004, evo_v11_005 — 全局用户数据目录：UserDataManager 服务 + 配置 schema + SkillRegistry 文件持久化迁移 + 管理命令 + 调试视图状态展示）
- [x] vscode 插件容易崩溃；分析优化（已拆解为 evo_v12_001, evo_v12_002, evo_v12_003, evo_v12_004, evo_v12_005 — 稳定性优化：全局错误兜底 + CancellationToken 生命周期修复 + 内存管理 + WebSocket 心跳 + AgentLoop 超时保护）
- [x] 修复消息日志一直出现list_models 导致 vsocde 卡死（已拆解为 evo_v13_001, evo_v13_002, evo_v13_003, evo_v13_004, evo_v13_005 — React useEffect 无限循环修复 + VSCode 侧 list_models 节流 + connectionDetails 浅比较优化 + TreeView 刷新节流）
- [x] 修复 debug 持续显示 [render] Should have a queue. This is likely a bug in React. Please file an issue.（已拆解为 evo_v14_001, evo_v14_002, evo_v14_003, evo_v14_004, evo_v14_005 — debugLog 对象引用不稳定导致 React 渲染队列错误：useEffect/useCallback 依赖修复 + useDebugLog 返回值 useMemo 稳定化）
- [~] 结合 debug-log 日志文件优化（已拆解为 evo_v15_001, evo_v15_002, evo_v15_003, evo_v15_004, evo_v15_005 — 重连指数退避 + 导航等待页面加载 + 工具参数自动修正 + 心跳容错优化）
- [x] 考虑只有唯一客户端，减少没必要的重连（已拆解为 evo_v16_001, evo_v16_002, evo_v16_003, evo_v16_004, evo_v16_005 — 单客户端优化：Server activeClient 单引用 + 踢旧连接 + Client 连接去重 + 可见性感知重连 + welcome 握手）
- [x] 不考虑时间，使用最优解，处理浏览器上下文爆炸的问题（已拆解为 evo_v17_001, evo_v17_002, evo_v17_003, evo_v17_004, evo_v17_005 — 上下文预算体系：Context Budget 常量与截断工具 + Chrome 侧采集预截断 + System Prompt 预算控制 + AgentLoop 观察截断与消息窗口管理）
- [~] 不考虑时间，使用最优解，想优化 内置 skill ，提供尽可能多有价值的 skill，用户能再让 agent 执行多步骤任务，复杂复杂，如果需要可以补充核心工具；（已拆解为 evo_v18_001, evo_v18_002, evo_v18_003, evo_v18_004, evo_v18_005 — Skill 体系增强：5 个新核心浏览器工具 + SkillRunner 步骤结果传递 + 10 个新预设 Skill + AgentLoop few-shot 编排增强）
- [x] 不考虑时间，使用最优解，提供沉浸式翻译的 skill，要参考 chrome 插件 沉浸式翻译，提供最好的用户体验（已拆解为 evo_v19_001, evo_v19_002, evo_v19_003, evo_v19_004, evo_v19_005 — 沉浸式翻译体系：browser_extract_paragraphs 智能段落提取 + browser_inject_bilingual 双语注入 + llm_translate LLM 工具路由 + immersive_translate 4 步预设 Skill + Chrome Toggle/Clear UI 控制）
- [~] 内置 MCP https://github.com/ChromeDevTools/chrome-devtools-mcp；不考虑时间，使用最优解，提供用户使用 agent 的体验；结合 mcp 的工具再内置 skill（已拆解为 evo_v20_001, evo_v20_002, evo_v20_003, evo_v20_004, evo_v20_005 — DevTools MCP 深度集成：可配置启动参数 + 完整工具 Schema + 子进程健壮性 + AgentLoop Schema 增强 + 5 个 DevTools 预设 Skill）
- [x] [text](～/Downloads/debug-log-2026-03-22T01-04-28-123Z.json) 不考虑时间，使用最优解，优化体验（已拆解为 evo_v21_001, evo_v21_002, evo_v21_003, evo_v21_004, evo_v21_005 — Debug-log 驱动优化：immersive_translate 参数名修复 + llm_translate 多格式兼容 + SkillRunner 路径表达式插值 + SkillPanel 请求去重）
- [x] /Users/wedaren/Downloads/debug-log-2026-03-22T02-16-57-430Z.json, 不考虑时间，使用最优解，优化体验（已拆解为 evo_v22_001, evo_v22_002, evo_v22_003, evo_v22_004, evo_v22_005 — immersive_translate inject 失败修复：Skill 路径表达式修正 + injectBilingual 多格式兼容 + 防御性自动解包 + 步骤失败诊断增强）
- [x] /Users/wedaren/Downloads/debug-log-2026-03-22T03-12-19-971Z.json,不考虑时间，使用最优解，优化体验,当前页面内容没有沉浸式翻译的效果（已拆解为 evo_v23_001, evo_v23_002, evo_v23_003, evo_v23_004, evo_v23_005 — Tab 锁定防止 Skill 多步骤执行期间目标页漂移 + injectBilingual 自动重标记兜底 + 注入诊断增强）
- [x] 不考虑时间，使用最优解，vsocde 插件可以配置默认模型，隐藏模型等，浏览器默认提供 5 个下拉选（已拆解为 evo_v24_001, evo_v24_002, evo_v24_003, evo_v24_004, evo_v24_005 — 模型管理配置：VSCode 配置 Schema + LmService 过滤/默认模型 + MessageHandler 配置传递 + Chrome 下拉 5 项限制）
- [x] [text](～/Downloads/debug-log-2026-03-22T04-21-45-769Z.json) 不考虑时间，使用最优解，优化图片展示体验（已拆解为 evo_v25_001, evo_v25_002, evo_v25_003, evo_v25_004, evo_v25_005 — 图片展示体系：VSCode 侧 image 类型识别 + ImagePreview 缩略图/Lightbox 组件 + AgentStepView 图片渲染 + MessageBubble Markdown 图片支持 + 图片 CSS 样式）
- [ ] 不考虑时间，使用最优解，优化 chrome skill，提供预设场景执行，用户点击预设场景执行，不需要填写任何内容，skill 会进入预设的场景页面等执行，让用户感受 skill 的的能力；skill 执行也要提供方便的 debug 体验；