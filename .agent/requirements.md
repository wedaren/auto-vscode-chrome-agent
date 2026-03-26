# requirements.md — 结构化需求

> 本文件由 PM Agent 维护。`program.md` 保存原始想法，`feature-doc.md` 负责把功能讲清楚，本文件负责把交付目标写成可执行需求。

---

## 需求总览

| ID | 需求 | 优先级 | 状态 | 简述 |
|----|------|--------|------|------|
| R-01 | 对话工作台 | P0 | ✅ 已实现 | Chrome Side Panel 支持模型选择、发送消息、流式回复 |
| R-02 | 对话体验增强 | P0 | ✅ 已实现 | 多会话、历史持久化、消息复制/重试、Markdown 展示、输入增强 |
| R-03 | 页面上下文感知 | P0 | ✅ 已实现 | 采集当前页 URL、标题、选中文本，并作为对话上下文传递 |
| R-04 | 浏览器工具调用 | P0 | 🔄 进行中 | Agent 基于 ReAct 循环调用浏览器工具完成多步操作 |
| R-05 | Skill 体系 | P1 | 🔄 进行中 | 支持预设 Skill、Skill 面板、SkillRunner、多步骤编排 |
| R-06 | 沉浸式翻译能力 | P1 | ✅ 已实现 | 提供段落提取、双语注入、开关控制与预设 Skill |
| R-07 | DevTools MCP 集成 | P1 | 🔄 进行中 | 提供 chrome-devtools-mcp 能力接入与相关预设 Skill |
| R-08 | 调试与稳定性 | P0 | ✅ 已实现 | 错误兜底、重试、心跳、调试面板、日志可视化 |
| R-09 | 请求细节与结果可视化 | P1 | ✅ 已实现 | 支持下载 LLM 请求详情、展示图片和 Agent 执行步骤 |
| R-10 | VSCode 调试视图 | P1 | ✅ 已实现 | Activity Bar 中展示连接、消息、Agent 循环与状态 |
| R-11 | 配置与持久化 | P1 | ✅ 已实现 | 用户数据目录、默认模型、隐藏模型等配置可持久化 |
| R-12 | 正式使用文档 | P1 | ✅ 已实现 | README、Chrome 指南、VSCode 指南、使用案例持续同步 |
| R-13 | 一键预设场景执行 | P2 | 🔄 进行中 | 预设场景无需额外输入即可自动导航并执行完整 Skill 流程 |
| R-14 | 沉浸式翻译体验升级 | P0 | 🔄 进行中 | 提取/注入/样式全链路升级，支持表格布局，达到专业沉浸式翻译效果 |
| R-15 | CSP 安全工具 + 长截图合成下载 + 语言一致性 | P0 | 🔄 进行中 | CSP 安全的页面度量工具 + batch_screenshot 升级 + 长图拼接下载 + Agent 语言一致性 |
| R-16 | 全方位用户体验优化 | P0 | 🔄 进行中 | 智能跟进建议 + Agent 执行进度条 + 会话搜索置顶 + 斜杠命令扩展 + 长回复增强 |
| R-17 | 沉浸式翻译渐进式体验 | P0 | 🔄 进行中 | 翻译一批注入一批，首批 3-5s 可见，段落级进度展示 |
| R-18 | 多 Workspace WebSocket 端口冲突修复 | P0 | 🔄 进行中 | Leader/Follower 模式解决多窗口 EADDRINUSE + 自动竞选 |
| R-19 | 浏览器智能层 — 阶段 1：结构化 DOM Snapshot | P0 | ⬚ 未开始 | Chrome 侧 DOM Snapshot 采集 + 稳定锚点 + 共享类型 + browser_snapshot 工具 + AgentLoop 集成 |
| R-20 | 沉浸式翻译零 DOM 篡改 | P0 | ⬚ 未开始 | Overlay 绝对定位层 + 内存注册表替代属性标记，零修改原始 DOM |
| R-21 | 沉浸式翻译三种显示模式 | P1 | 🔄 进行中 | 原文版/翻译版/混合版三模式切换，零篡改前端 Overlay 定位切换 |
| R-22 | 深度调研能力（Deep Research） | P1 | ⬚ 未开始 | 迭代式研究循环 + 可编辑研究计划 + 实时思考流 + 引用系统 + Chrome 调研 UI + 报告导出 |

---

## 详细需求

### R-01 对话工作台

| 字段 | 内容 |
|------|------|
| 来源 | program.md 系统组成 + evo_v1 |
| 优先级 | P0 |
| 状态 | ✅ 已实现 |
| 描述 | Chrome Side Panel 提供稳定的 AI 对话入口，支持模型选择、消息发送和流式回复 |
| 用户价值 | 用户无需离开浏览器即可发起基于页面上下文的 AI 对话 |
| 验收 | 用户可以在 Chrome 侧选择可用模型、发送消息并收到流式响应 |
| 影响范围 | chrome-ext / vscode-ext |
| 备注 | 模型调用必须通过 `vscode.lm`，Chrome 侧不内置模型能力 |

### R-02 对话体验增强

| 字段 | 内容 |
|------|------|
| 来源 | evo_v1_006~010 + evo_v4 + evo_v25 |
| 优先级 | P0 |
| 状态 | ✅ 已实现 |
| 描述 | 对话体验需要接近 Copilot 级别，包括多会话、消息持久化、Markdown 渲染、图片展示和输入增强 |
| 用户价值 | 提高连续使用效率，降低对话中断和上下文丢失成本 |
| 验收 | 多会话可切换且互不污染；刷新后历史保留；消息支持 Markdown；图片可预览；支持停止生成与快捷输入 |
| 影响范围 | chrome-ext |
| 备注 | “体验更好”必须落到具体可见行为，不接受空泛表述 |

### R-03 页面上下文感知

| 字段 | 内容 |
|------|------|
| 来源 | program.md 系统组成 + task_006 |
| 优先级 | P0 |
| 状态 | ✅ 已实现 |
| 描述 | Chrome 侧需要采集当前页面的 URL、标题、选中文本等上下文并传给 VSCode 侧 |
| 用户价值 | Agent 能理解用户当前正在看的页面，提高回答和操作准确性 |
| 验收 | 发起对话时，服务端可收到页面上下文；上下文异常时不影响基础对话 |
| 影响范围 | chrome-ext / vscode-ext |
| 备注 | 后续可继续扩展上下文预算与截断策略 |

### R-04 浏览器工具调用

| 字段 | 内容 |
|------|------|
| 来源 | evo_v3 + evo_v6 + evo_v17 |
| 优先级 | P0 |
| 状态 | 🔄 进行中 |
| 描述 | Agent 需要通过 ReAct 循环自主使用浏览器工具完成点击、输入、导航、滚动、取文本等操作 |
| 用户价值 | 用户可以用自然语言交付多步浏览器任务，而不是手动逐步操作 |
| 验收 | 用户输入任务后，Agent 能分步执行至少一条完整工具链并回传执行结果；上下文预算受控，避免消息爆炸 |
| 影响范围 | vscode-ext / chrome-ext |
| 备注 | 当前已具备工具基础设施，但高阶自主规划能力仍在增强中 |

### R-05 Skill 体系

| 字段 | 内容 |
|------|------|
| 来源 | evo_v8 + evo_v18 + evo_v26 |
| 优先级 | P1 |
| 状态 | 🔄 进行中 |
| 描述 | 系统需要提供可复用 Skill 数据模型、执行引擎、管理视图和 Chrome 侧运行入口 |
| 用户价值 | 用户可以复用成熟操作模板，而不是每次重新描述步骤 |
| 验收 | 用户可查看 Skill 列表并执行预设 Skill；Skill 支持多步骤传值；失败时可查看调试信息 |
| 影响范围 | vscode-ext / chrome-ext / user-data |
| 备注 | 后续重点是内置 Skill 质量和一键场景能力，而不是单纯增加数量 |

### R-06 沉浸式翻译能力

| 字段 | 内容 |
|------|------|
| 来源 | evo_v19 + evo_v21 + evo_v22 + evo_v23 + evo_v27 |
| 优先级 | P1 |
| 状态 | 🔄 进行中 |
| 描述 | 提供面向网页内容的沉浸式翻译能力，包括段落提取、翻译、双语注入、开关与清理能力 |
| 用户价值 | 用户可在当前页面直接获得双语阅读体验，而无需切换工具 |
| 验收 | 支持触发翻译 Skill；目标页面出现双语内容；可关闭或清理注入结果；失败时可诊断；表格/列表布局页面不破坏原始排版 |
| 影响范围 | chrome-ext / vscode-ext |
| 备注 | 基础流程已通，R-14 升级表格布局适配与样式质量 |

### R-07 DevTools MCP 集成

| 字段 | 内容 |
|------|------|
| 来源 | task_007 + evo_v20 |
| 优先级 | P1 |
| 状态 | 🔄 进行中 |
| 描述 | VSCode 插件需要集成 `chrome-devtools-mcp`，让 Agent 可使用更完整的浏览器与 DevTools 能力 |
| 用户价值 | 扩展 Agent 的浏览器观察与操作能力，支持更复杂的问题诊断与自动化任务 |
| 验收 | VSCode 侧可启动/连接 MCP；工具 schema 可被 Agent 使用；至少有一组可运行的相关 Skill |
| 影响范围 | vscode-ext / knowledge / skills |
| 备注 | 当前已打通基础集成，后续继续补强配置、健壮性与预设 Skill |

### R-08 调试与稳定性

| 字段 | 内容 |
|------|------|
| 来源 | evo_v9 + evo_v12 + evo_v13 + evo_v14 + evo_v15 + evo_v16 |
| 优先级 | P0 |
| 状态 | ✅ 已实现 |
| 描述 | 系统需要具备稳定运行和可诊断能力，包括错误兜底、连接健壮性、重试机制、调试面板和日志优化 |
| 用户价值 | 出错时可定位、可恢复，避免 Chrome 或 VSCode 侧频繁卡死或白屏 |
| 验收 | 异常场景下不崩溃；单客户端连接稳定；日志可观测；出现错误时用户有反馈 |
| 影响范围 | chrome-ext / vscode-ext |
| 备注 | 基础稳定性已具备，后续围绕 debug-log 持续优化 |

### R-09 请求细节与结果可视化

| 字段 | 内容 |
|------|------|
| 来源 | evo_v10 + evo_v25 |
| 优先级 | P1 |
| 状态 | ✅ 已实现 |
| 描述 | 用户可以下载完整 LLM 请求详情，并在对话中查看图片或 Agent 执行步骤等可视化结果 |
| 用户价值 | 方便调试、复盘和优化 prompt / 工具链效果 |
| 验收 | AI 回复旁可下载详情 JSON；图片消息可预览；Agent 步骤可在 UI 中查看 |
| 影响范围 | chrome-ext / vscode-ext |
| 备注 | 此类能力偏调试辅助，要求信息完整但展示不打扰主流程 |

### R-10 VSCode 调试视图

| 字段 | 内容 |
|------|------|
| 来源 | evo_v5 |
| 优先级 | P1 |
| 状态 | ✅ 已实现 |
| 描述 | VSCode 侧需要提供集中化视图，展示连接状态、消息日志、Agent 循环和调试信息 |
| 用户价值 | 开发者可以在一个地方看到系统运行情况，减少在终端和日志文件间来回切换 |
| 验收 | Activity Bar 中存在对应容器和 TreeView；关键状态可查看且可刷新 |
| 影响范围 | vscode-ext |
| 备注 | 当前已实现基础视图，后续关注信息层次和可读性 |

### R-11 配置与持久化

| 字段 | 内容 |
|------|------|
| 来源 | evo_v11 + evo_v24 |
| 优先级 | P1 |
| 状态 | ✅ 已实现 |
| 描述 | VSCode 插件需要支持用户数据目录、默认模型、模型隐藏等配置，并持久化到稳定位置 |
| 用户价值 | 用户可按自己的环境和偏好长期使用系统，而不是每次重新配置 |
| 验收 | 配置项可见且生效；用户数据目录自动创建；模型下拉受默认值和隐藏规则控制 |
| 影响范围 | vscode-ext / config / user-data |
| 备注 | 持久化目录是 Skill 与用户偏好的基础依赖 |

### R-12 正式使用文档

| 字段 | 内容 |
|------|------|
| 来源 | evo_v7 |
| 优先级 | P1 |
| 状态 | ✅ 已实现 |
| 描述 | 需要有覆盖安装、配置、核心流程和典型案例的正式使用文档 |
| 用户价值 | 降低首次使用门槛，减少靠读源码理解系统的成本 |
| 验收 | `docs/README.md`、`docs/chrome-extension-guide.md`、`docs/vscode-extension-guide.md`、`docs/use-cases.md` 存在且内容完整 |
| 影响范围 | docs |
| 备注 | 文档只描述已实现能力，不超前承诺 |

### R-13 一键预设场景执行

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区最新条目 + evo_v26 |
| 优先级 | P2 |
| 状态 | 🔄 进行中 |
| 描述 | Chrome 侧提供一组无需填写输入的一键预设场景，点击后自动进入指定页面并执行完整 Skill 流程 |
| 用户价值 | 让用户无需理解 Skill 参数也能直接体验系统能力，并方便演示和验证 |
| 验收 | Chrome 侧可见预设场景列表；点击后可自动导航并开始执行；执行过程可查看调试信息 |
| 影响范围 | chrome-ext / vscode-ext / skills |
| 备注 | 该需求重点是“可体验”和“可调试”，不是再造一个复杂配置界面 |

### R-14 沉浸式翻译体验升级

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区 + evo_v27 + 用户截图对比 |
| 优先级 | P0 |
| 状态 | 🔄 进行中 |
| 描述 | 沉浸式翻译在表格/列表布局页面（如 Hacker News）效果严重不达标：提取粒度过粗（`<td>` 而非 `<a>`）、注入产生无效 HTML（`<div>` in `<tr>`）、样式与专业沉浸式翻译差距大。需要提取算法、注入策略、CSS 样式全链路升级。 |
| 用户价值 | 用户在任何常见页面类型上都能获得与「沉浸式翻译」扩展相当的双语阅读体验 |
| 验收 | ① HN 页面每个标题下方出现对应中文翻译且布局不破坏；② 翻译样式为无边框纯文本、字号略小、颜色柔和；③ 文章页面（`<article>/<p>` 结构）翻译效果不退化；④ toggle/clear 功能正常 |
| 影响范围 | chrome-ext（action-executor.ts 提取+注入逻辑 + CSS） |
| 备注 | R-06 的升级迭代，不新增工具或 Skill，仅优化现有链路的质量 |

### R-15 CSP 安全工具 + 长截图合成下载 + 语言一致性

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区 + debug-log-2026-03-22T06-26-33-177Z.json 分析 |
| 优先级 | P0 |
| 状态 | 🔄 进行中 |
| 描述 | `browser_evaluate` 在 CSP 严格页面被完全阻断（`new Function()` 触发 `unsafe-eval` 违规），导致依赖它的 `batch_screenshot` 技能失败、手动截图时无法获取页面尺寸。同时系统缺少截图拼接和下载能力，Agent 回复语言中英文混杂。需要：① 新增 CSP 安全的 `browser_get_page_info` 工具；② 升级 batch_screenshot 技能使用新工具；③ 新增截图合成下载能力；④ 系统 prompt 加语言一致性指令。 |
| 用户价值 | 在 HN 等 CSP 严格页面也能正常使用截图相关功能；可一键获得长截图文件；Agent 回复语言与用户一致 |
| 验收 | ① 在 CSP 严格页面调用 `browser_get_page_info` 正常返回页面尺寸；② batch_screenshot 技能在 HN 上不因 CSP 终止；③ 多张截图可合成一张长图并触发浏览器下载；④ 用户用中文提问时 Agent 全程中文回复（含 think 步骤） |
| 影响范围 | chrome-ext（action-executor.ts 新 action + background.ts 截图合成）/ vscode-ext（browser-tools.ts 工具注册 + skill-registry.ts 技能升级 + agent-loop.ts prompt 修改） |
| 备注 | 不修改 `browser_evaluate` 本身，保持其在非 CSP 页面的完整能力；新工具专注页面度量场景 |

### R-16 全方位用户体验优化

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区 + 28 轮迭代后的系统性 UX 审计 |
| 优先级 | P0 |
| 状态 | 🔄 进行中 |
| 描述 | 针对 Chrome 侧核心交互链路的 5 项体验短板进行系统性升级：① 智能跟进建议（AI 回复后动态生成 2-3 个上下文相关的跟进 prompt 芯片）；② Agent 执行进度条（全局步骤计数 + 当前步骤描述 + 耗时 + 取消）；③ 会话搜索与置顶（ConversationList 增加搜索框 + pin 能力）；④ 斜杠命令扩展（新增 /skill、/template 命令 + 自动补全）；⑤ 长回复增强（代码块折叠 + 长回复标题导航）。 |
| 用户价值 | 降低"不知道下一步该做什么"的迷茫感；多步任务执行时有清晰进度反馈；快速找到历史对话；从输入框一键触达 Skill 和模板；长回复高效阅读 |
| 验收 | ① AI 回复后出现 2-3 个动态建议芯片，点击可直接发送；② Agent 多步执行时显示进度条（步骤计数 + 描述 + 耗时），可取消；③ 会话列表有搜索框可过滤，可置顶且置顶持久化；④ 输入 `/skill ` 弹出 Skill 列表自动补全，选择后触发执行；⑤ 超过 15 行的代码块默认折叠，点击可展开 |
| 影响范围 | chrome-ext（新组件 SmartSuggestions + AgentProgressBar；增强 ConversationList + ChatInput + MessageBubble）/ vscode-ext（message-handler.ts 生成跟进建议 + ws 协议扩展 follow_up_suggestions） |
| 备注 | 跟进建议由 VSCode 侧 LLM 生成（在 chat_response_end 后追加一次轻量 LLM 调用），延迟不可接受时降级为 Chrome 侧规则匹配 |

### R-17 沉浸式翻译渐进式体验

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区 + evo_v27/v19 沉浸式翻译迭代反馈 |
| 优先级 | P0 |
| 状态 | 🔄 进行中 |
| 描述 | 当前 `immersive_translate` 是串行 3 步流（extract ALL → translate ALL → inject ALL），用户必须等全部翻译完成才能看到结果，200 段落页面等待 30-50 秒。需要改为渐进式翻译：每翻译完一小批立即注入页面并推送进度，首批 3-5 秒可见。具体包括：① 新增 `llm_translate_progressive` 工具实现翻译-注入循环；② 首批 5 段、后续 15 段的自适应批量；③ WebSocket `translate_progress` 批次级进度推送；④ Chrome 侧翻译进度条展示；⑤ 更新 Skill 定义为 2 步流。 |
| 用户价值 | 用户在几秒内看到翻译结果开始出现，减少"系统是否在工作"的焦虑；翻译质量不因渐进式而降低 |
| 验收 | ① 触发沉浸式翻译后 5 秒内页面出现首批翻译；② Chrome 侧显示"翻译中: N/M 段落"实时进度；③ 全部翻译完成后进度消失，显示完成状态；④ 单批失败不阻断整体翻译；⑤ 翻译质量与原串行流一致（相同 prompt、相同 batch 翻译逻辑） |
| 影响范围 | vscode-ext（`llm-tools.ts` 新增渐进式工具 + `skill-registry.ts` 更新 Skill 定义 + `ws-server.ts` 进度推送）/ chrome-ext（`TranslateControl.tsx` 进度条 + `action-executor.ts` 增量注入已支持） |
| 备注 | `injectBilingual` 已支持按 `data-imt-id` 增量注入，不需要修改注入逻辑。核心改动在 VSCode 侧新工具和 Chrome 侧进度展示。 |

### R-18 多 Workspace WebSocket 端口冲突修复

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区 — 用户反馈安装插件后打开多个 workspace 导致 EADDRINUSE |
| 优先级 | P0 |
| 状态 | 🔄 进行中 |
| 描述 | VSCode 插件 `activationEvents: ["*"]` 导致每个 workspace 窗口独立激活，各自尝试在端口 7777 启动 WebSocket 服务器。第二个窗口 EADDRINUSE 后弹出错误对话框且整个插件不可用。需要改为 Leader/Follower 模式：① WsServer 检测到 EADDRINUSE 时进入 follower 模式（信息通知替代错误弹窗）；② Extension 在 follower 模式下跳过 MessageHandler 注册；③ Follower 定时（10s）检测端口可用性，leader 窗口关闭后自动竞选为新 leader；④ 竞选成功后完整初始化 MessageHandler 及下游依赖；⑤ ConnectionTree 和 StatusBar 展示当前角色。 |
| 用户价值 | 用户可以放心打开多个 workspace 窗口，不再看到令人困惑的错误弹窗；关闭活跃窗口后另一个窗口自动接管服务 |
| 验收 | ① 打开第二个 workspace 不弹出 EADDRINUSE 错误对话框；② StatusBar 或 ConnectionTree 正确显示 leader/follower 角色；③ 关闭 leader 窗口后 follower 在 15 秒内自动升级为 leader 并启动 WS 服务；④ 升级后 Chrome 可正常连接并通信；⑤ 双端编译通过 |
| 影响范围 | vscode-ext（`ws-server.ts` EADDRINUSE 处理逻辑 + `extension.ts` 激活流程 + `connection-tree.ts` 状态展示） |
| 备注 | Chrome 侧无需改动，始终连接固定端口。不引入进程间通信或 lock file，利用端口绑定本身作为 leader 选举机制。 |

### R-19 浏览器智能层 — 阶段 1：结构化 DOM Snapshot

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区 + `docs/browser-intelligence-architecture.md` 阶段 1 |
| 优先级 | P0 |
| 状态 | ⬚ 未开始 |
| 描述 | 当前页面上下文仅含 url/title/selectedText，Agent 对页面结构零感知，工具调用靠猜测 selector。需要实现浏览器智能层的第一阶段：① Chrome 侧 `dom-snapshot.ts` 构建结构化 DOM Snapshot 树（tag、role、visibility、interactivity、rect、textPreview、selectorHint）；② Chrome 侧 `anchor-resolver.ts` 为关键节点构建多路 NodeAnchor（cssSelector、textQuote、parentSignature 等）并支持锚点重定位；③ VSCode 侧 `browser-runtime-contract.ts` 统一定义浏览器智能层共享 TypeScript 类型；④ 新增 `browser_snapshot` 工具（browser-tools.ts 注册 + action-executor.ts 新 ActionType）；⑤ AgentLoop system prompt 更新，使 Agent 知道并能使用结构化 Snapshot。 |
| 用户价值 | Agent 首次拥有页面结构视图，工具调用从"猜 selector"升级为"基于结构精准定位"，操作成功率和注入稳定性预期显著提升 |
| 验收 | ① `browser_snapshot` 工具在普通页面和 CSP 严格页面均返回有效 DomSnapshotNode 树；② Snapshot 节点包含 tag、role、visible、interactive、textPreview、rect 字段；③ 关键节点携带 NodeAnchor 信息；④ Snapshot 深度限制 12 层、节点上限 3000；⑤ AgentLoop system prompt 包含 `browser_snapshot` 工具说明；⑥ 双端编译通过 |
| 影响范围 | chrome-ext（新增 `dom-snapshot.ts` + `anchor-resolver.ts` + action-executor.ts 扩展）/ vscode-ext（新增 `browser-runtime-contract.ts` + browser-tools.ts 扩展 + agent-loop.ts prompt 更新） |
| 备注 | 本阶段是架构文档五阶段演进的基础，不涉及语义模型、Patch DSL、专职 Agent 或视觉验证。Snapshot 通过工具调用获取（非自动附加），避免不必要的性能开销。 |

### R-20 沉浸式翻译零 DOM 篡改

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区 + R-06/R-14 沉浸式翻译迭代反馈 |
| 优先级 | P0 |
| 状态 | ⬚ 未开始 |
| 描述 | 当前沉浸式翻译通过修改原始 DOM（添加 `data-imt-id` 属性 + 插入兄弟节点）注入翻译，在 Flex/Grid/复杂 CSS 布局页面会破坏原始布局。需要重构为 Overlay 绝对定位层架构：所有翻译元素在独立容器中渲染，通过坐标计算定位到原文下方，原始 DOM 零修改。内存元素注册表替代属性标记，ResizeObserver 处理布局变化。 |
| 用户价值 | 在任何页面布局类型（Flex/Grid/Table/Block）上使用沉浸式翻译都不会破坏原始页面结构和视觉效果 |
| 验收 | ① 翻译注入后原始元素无新增属性（无 `data-imt-id`）；② 原始元素无新增兄弟/子节点；③ Flex/Grid 布局页面翻译后布局不变；④ 翻译文本正确定位在原文下方且随页面自然滚动；⑤ toggle/clear 功能正常；⑥ 双端编译通过 |
| 影响范围 | chrome-ext（`action-executor.ts` 提取+注入逻辑重构 + 新增 `imt-overlay.ts` Overlay 模块 + 新增 `imt-registry.ts` 元素注册表） |
| 备注 | 属于 R-06/R-14 的进一步升级，核心改动全在 Chrome 侧 content script 层，VSCode 侧和 WebSocket 协议无需变更 |

### R-21 沉浸式翻译三种显示模式

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区 + R-06/R-14/R-20 沉浸式翻译系列迭代 |
| 优先级 | P1 |
| 状态 | 🔄 进行中 |
| 描述 | 当前沉浸式翻译仅支持"双语显示/隐藏"二态切换。需要扩展为三种显示模式：① **原文版**（隐藏 Overlay，现有行为）；② **混合版/双语版**（翻译在原文下方，现有默认行为）；③ **翻译版**（Overlay 条目重定位到原文位置 + 不透明背景视觉替换原文）。核心改动：ImmersiveOverlay 新增 `DisplayMode` 和 `setDisplayMode()`；action-executor 新增 `setDisplayMode` 操作；TranslateControl toggle 替换为三模式分段控制器；VSCode 侧 Schema 更新。 |
| 用户价值 | 用户可在"沉浸式阅读译文"和"对照原文检查质量"之间自由切换，覆盖不同阅读场景需求 |
| 验收 | ① 翻译完成后出现三模式切换器（原文 / 双语 / 译文）；② 点击"译文"后原文位置被翻译覆盖、页面变为全翻译视觉；③ 点击"双语"恢复翻译在原文下方；④ 点击"原文"隐藏所有翻译；⑤ 模式切换毫秒级（纯 CSS/定位操作）；⑥ 零 DOM 篡改原则不变；⑦ 双端编译通过 |
| 影响范围 | chrome-ext（`imt-overlay.ts` DisplayMode 引擎 + `action-executor.ts` setDisplayMode 处理 + `TranslateControl.tsx` 三模式 UI）/ vscode-ext（`browser-tools.ts` Schema 更新） |
| 备注 | 翻译版模式使用白色不透明背景覆盖原文，在深色页面可能不完美，后续可扩展自动适配背景色。不需要重新翻译，模式切换是纯前端操作。 |

### R-22 深度调研能力（Deep Research）

| 字段 | 内容 |
|------|------|
| 来源 | program.md 功能进化区："希望能做一些深度调研的工作，类似 google 的 gemini 的深度调研" |
| 优先级 | P1 |
| 状态 | ⬚ 未开始 |
| 描述 | 将现有 `report-generator.ts` 升级为迭代式深度调研引擎（DeepResearchEngine）。核心循环：研究计划生成 → 用户确认 → 多轮搜索-阅读-推理-补缺 → 结构化引用报告。Chrome 侧提供专属调研 UI（计划编辑 + 思考流 + 报告渲染 + 导出）。`/research` 斜杠命令 + `deep_research` 预设 Skill 双入口。 |
| 用户价值 | 用户发起一个研究主题后可以放手，Agent 自主完成多源信息收集和综合分析，产出可交付的带引用结构化报告，替代手动打开数十个 tab 阅读和整理的工作 |
| 验收 | ① 用户输入 `/research <主题>` 后 Agent 生成研究计划并展示；② 用户可编辑计划中的子问题后确认；③ 执行过程中 Chrome 侧实时显示思考流（当前动作 + 已学到什么 + 下一步计划）；④ Agent 完成多轮迭代后产出 Markdown 报告，包含目录、摘要、分主题论述、`[N]` 行内引用标注、参考文献列表；⑤ 用户可一键导出为 .md 或 .html；⑥ 双端编译通过 |
| 影响范围 | vscode-ext（`report-generator.ts` → `deep-research-engine.ts` 重构 + `message-handler.ts` 新消息类型 + `ws-server.ts` 协议扩展 + `skill-registry.ts` 新预设 Skill）/ chrome-ext（`ResearchPanel` 组件 + `useResearch` hook + 斜杠命令扩展 + 导出工具函数） |
| 备注 | 当前方案通过 `browser_navigate` 导航搜索引擎页面实现搜索，不依赖外部搜索 API。后续可考虑接入搜索 API 提升搜索精度。 |

---

## 非功能需求

| ID | 需求 | 状态 |
|----|------|------|
| NF-01 | 本地通信，不经过外部服务器 | ✅ |
| NF-02 | 模型调用只通过 `vscode.lm` API | ✅ |
| NF-03 | Chrome 插件不内置模型，也不依赖外部 API key | ✅ |
| NF-04 | Chrome 扩展符合 Manifest V3 | ✅ |
| NF-05 | VSCode 最低版本为 1.96.0 | ✅ |
| NF-06 | 文档必须区分原始想法、功能定义、结构化需求、正式使用文档 | ✅ |

---

## 状态说明

| 标记 | 含义 |
|------|------|
| ✅ 已实现 | 已完成并在代码中可见 |
| 🔄 进行中 | 已有基础能力，但还在补强 |
| ⬚ 未开始 | 仅在文档中定义，尚未进入实现 |

---

## 待确认项

- `R-04` 和 `R-05` 的上限目标是“高质量预设自动化”还是“开放式自主代理”，当前还需持续收敛边界。
- `R-07` DevTools MCP 的长期定位是默认工具源还是高级可选工具源，暂未完全定稿。
- `R-13` 预设场景的数量不是重点，优先验证入口清晰、成功率高、调试友好。
