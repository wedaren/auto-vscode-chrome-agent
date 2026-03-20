# program.md — Browser Agent

## 目标
开发一个 agent 工具，用户在 Chrome side panel 里对话，
agent 能感知浏览器上下文、自主探索网页、获取数据，
最终生成深度报告。

---

## 系统组成

### Chrome 插件（前端入口）
- Side panel 作为对话窗口（React + Tailwind）
- 感知当前页面上下文：URL、DOM 选中文本、截图
- 通过 WebSocket 与 VSCode 插件通信（localhost:7777）
- 集成 chrome-devtools-mcp 能力

### VSCode 插件（agent 大脑）
- 使用 vscode.lm API 调用语言模型
- 接收 Chrome 上下文和用户指令
- 控制浏览器执行探索任务
- 管理 Karpathy Loop

### WebSocket 桥接
- 本地直连，不经过外部服务器
- 端口：7777
- 消息格式：JSON，包含 type / payload / sessionId

---

## PM Agent 默认决策

**Side panel 交互风格**
决策：文字对话为主 + 底部快捷按钮（"探索此页"、"生成报告"、"停止"）
原因：参考 Perplexity / Arc Browser 行业标准

**报告触发方式**
决策：双模式——用户明确触发 + agent 收集足够信息后主动建议

**浏览器探索边界**
决策：agent 可开新 tab，最多同时 3 个，完成后自动关闭

**报告格式**
决策：Markdown 渲染为 HTML，side panel 内展示，提供复制和导出按钮

**MVP 范围**
决策：Phase 1 先跑通 WebSocket 通信链路，报告功能第二阶段

---

## 技术选型

| 模块 | 选型 |
|---|---|
| Chrome 插件框架 | WXT + React + Tailwind |
| VSCode 插件 | Extension API + vscode.lm |
| WebSocket 服务端 | ws (Node.js，跑在 VSCode 插件里) |
| 浏览器控制 | chrome-devtools-mcp |
| 报告格式 | Markdown → HTML (marked.js) |
| 构建工具 | pnpm workspaces（monorepo） |

---

## 停止条件（分阶段）

### Phase 1 — 通信链路（当前目标）
- [ ] pnpm install 无报错
- [ ] VSCode 插件启动，WebSocket 在 7777 端口监听
- [ ] Chrome 插件加载，side panel 可打开
- [ ] 用户发消息，VSCode 侧能收到并回显
- [ ] 当前页面 URL 自动附加到消息上下文

### Phase 2 — Agent 能力
- [ ] vscode.lm 调用成功，能返回 AI 回复
- [ ] Agent 能执行导航指令
- [ ] 上下文感知完整

### Phase 3 — 深度报告
- [ ] 触发报告后 agent 自主探索 3+ 页面
- [ ] Karpathy Loop 跑通
- [ ] 报告在 side panel 正确渲染

---

## Karpathy Loop 规则

每个编码任务：
1. 形成假设 → 实现代码
2. 运行验收命令（见 tasks.json 各任务 acceptance 字段）
3. 通过 → git commit + 记录 experiments/exp_NNN.md
4. 失败 → git revert + 记录到 knowledge/errors.md
5. 换假设重试，最多 3 次，超过则写 inbox/needs-you.md

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