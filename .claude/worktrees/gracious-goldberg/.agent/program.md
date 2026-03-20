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

## 功能进化区

> Evolution Agent 在此区域管理进化方向。
> `- [ ]` 待处理 | `- [~]` 已拆解为任务 | `- [x]` 已完成

### 体验优化
- [ ] 流式输出：AI 回复逐字渲染而非整段出现
- [ ] Markdown 渲染：报告在 Side Panel 内正确渲染为 HTML
- [ ] 错误提示：友好的用户可见错误信息，而非原始堆栈
- [ ] 加载状态：发送消息后显示 typing indicator

### 能力扩展
- [ ] 多页探索：agent 自主打开多个 tab 收集信息
- [ ] 截图能力：通过 MCP 截取页面截图并分析
- [ ] 历史记录：对话历史持久化，支持回溯
- [ ] 报告导出：复制到剪贴板、下载为 .md 文件

### 稳定性
- [ ] WebSocket 断线重连：Chrome 侧自动重连 + 状态恢复
- [ ] MCP 进程管理：crash 后自动重启
- [ ] 内存优化：长对话不 OOM

### 开发者体验
- [ ] E2E 测试：WebSocket 通信的自动化测试
- [ ] 类型共享：Chrome 和 VSCode 共享 BridgeMessage 类型定义
- [ ] 日志分级：debug/info/warn/error 分级输出

---

## 自评估指标

进化循环每轮需要评估以下指标，写入 `.agent/metrics.json`：

| 指标 | 计算方式 | 健康阈值 |
|------|---------|---------|
| build_success | 两个包构建是否通过 | 必须 true |
| type_errors | TypeScript 编译错误数 | 0 |
| feedback_sentiment | complaint / total interactions | < 20% |
| knowledge_coverage | knowledge/ 文件数 | 持续增长 |
| evolution_velocity | 过去 5 轮完成的进化任务数 | ≥ 1 |
| idle_rounds | 连续 NONE 轮次数 | < 3 则进入巡航 |

---

## Karpathy Loop 规则（扩展版）

### Build 阶段（初始任务）
每个编码任务：
1. 形成假设 → 实现代码
2. 运行验收命令（见 tasks.json 各任务 acceptance 字段）
3. 通过 → git commit + 记录 experiments/exp_NNN.md
4. 失败 → 调用 Research Agent 研究根因 → 重试
5. 连续失败 3 次 → Research Agent 深度分析，重置计数
6. Research 后仍失败 → 写 inbox/needs-you.md

### Evolve 阶段（持续进化）
每轮进化循环：
1. Reflection Agent 审视系统状态 → 输出 reflection.md
2. Evolution Agent 基于反思 + 用户反馈 → 生成改进任务
3. Coder Agent 实施改进 → Validator 验收
4. 通过 → git commit（evo 前缀）
5. 失败 → revert，不阻塞下一轮
6. 记录进化日志 → evolution_log.md
7. 连续 3 轮无改进 → 进入巡航模式（降频监听）

---

## 文件约定

.agent/
├── program.md         ← 本文件（需求基准 + 进化方向）
├── tasks.json         ← 任务队列（build + evo 任务共存）
├── state.json         ← 当前状态（含进化轮次）
├── decisions.md       ← 自动决策日志
├── experiments/       ← Loop 记录
├── knowledge/         ← Research 积累（被动 + 主动）
├── feedback.jsonl     ← 用户反馈日志（进化数据源）
├── reflection.md      ← 最近一轮反思结果
├── evolution_log.md   ← 进化历史记录
├── metrics.json       ← 自评估指标快照
└── inbox/
    └── needs-you.md   ← 卡住时才写这里
