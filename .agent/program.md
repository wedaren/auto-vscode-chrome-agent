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
- [~] 修复 debug 持续显示 [render] Should have a queue. This is likely a bug in React. Please file an issue.（已拆解为 evo_v14_001, evo_v14_002, evo_v14_003, evo_v14_004, evo_v14_005 — debugLog 对象引用不稳定导致 React 渲染队列错误：useEffect/useCallback 依赖修复 + useDebugLog 返回值 useMemo 稳定化）