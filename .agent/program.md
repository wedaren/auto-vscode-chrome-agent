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
├── program.md       ← 本文件
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
- [ ] 希望有简要的功能使用文档及使用案例，指导用户使用
- [ ] 不考虑时间，使用最优解，希望能遵循 skill， mcp 规范，有个 vsocde 视图配置配置，可以预设一批操作浏览器的 skill，进入指定页面，整理 tab，友好型将页面翻译，等；如果需要可以考虑重构；