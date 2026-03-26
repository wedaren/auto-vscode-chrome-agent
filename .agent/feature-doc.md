# feature-doc.md — 功能文档

> 本文件由 PM Agent 维护，用来把 `program.md` 里的模糊想法整理成“人能快速读懂”的功能说明。它不是任务清单，也不是最终用户文档。

---

## 文档目标

- 用最少的篇幅说明 Browser Agent 当前到底提供什么能力
- 在需求还不够清晰时，明确区分“已确定”“合理假设”“待确认”
- 为后续 `requirements.md` 和 `docs/*` 提供稳定的上游定义

---

## 当前结论

### 已确定

- 产品形态是 Chrome 插件 + VSCode 插件协作的 AI Agent 系统。
- 用户主要在 Chrome Side Panel 发起对话，VSCode 负责模型调用、Agent 循环和调试能力。
- 当前产品已经覆盖对话、浏览器上下文感知、工具调用基础设施、Skill 体系、调试能力和使用文档。

### 合理假设

- 这个项目的核心竞争力不是单一聊天窗口，而是“浏览器上下文 + 工具执行 + 调试可见性”的组合体验。
- 后续功能演进应该优先提高任务完成率、预设场景可体验性和调试友好度，而不是单纯增加功能数量。
- 用户需要的是“可直接上手的能力包”，因此功能说明应该按场景和结果组织，而不是按源码模块组织。

### 待确认

- 长期目标更偏“开放式代理”还是“高质量预设场景集合”，边界仍需继续收敛。
- DevTools MCP 能力在默认工作流中的权重还没有完全定稿。
- PM 后续输出是否还需要单独的“交互/流程文档”，当前暂按功能文档 + 结构化需求两层处理。

---

## 用户与场景

- 目标用户：
  - 需要在浏览器页面上直接调用 AI 辅助工作的开发者和重度信息处理用户
  - 需要观察 Agent 行为、调试请求和排查问题的开发者

- 核心场景：
  1. 用户在当前网页发起对话，希望 AI 理解页面上下文并给出回答
  2. 用户希望 AI 代替自己执行浏览器操作，例如点击、输入、导航、整理页面
  3. 用户希望通过预设 Skill 或预设场景，快速体验一整套自动化流程
  4. 用户在能力失效或体验不稳定时，需要直接看到日志、请求详情和执行链路

---

## 功能范围

### 当前已提供

- 浏览器内对话工作台：支持模型选择、流式回复、多会话、消息持久化
- 页面上下文感知：自动带上 URL、标题、选中文本
- 浏览器工具基础设施：支持 Agent 调用浏览器操作能力
- Skill 体系：支持预设 Skill、执行引擎和运行入口
- 调试体系：支持连接状态、消息日志、Agent 步骤和请求详情下载
- 特定场景能力：沉浸式翻译、图片展示优化、模型管理配置等

### 当前重点补强

- Agent 多步规划与工具调用的稳定性和完成率
- Skill 体系的场景化包装，让用户无需理解参数也能直接体验能力
- DevTools MCP 集成后的可用性和可感知价值
- 文档体验：让功能定义、需求定义和正式说明不再混在一起

### 当前不追求

- 独立于 VSCode 的纯浏览器侧模型调用能力
- 需要用户自行提供第三方 API key 的外部云服务模式
- 在文档中超前描述尚未稳定实现的能力

---

## 关键体验

### 体验 1：基于当前页面的 AI 对话

1. 用户打开 Chrome Side Panel
2. 选择可用模型并发送问题
3. 系统自动附带当前页面上下文
4. VSCode 侧调用 `vscode.lm` 返回流式响应
5. 用户可以继续追问、切换会话或下载请求详情做分析

### 体验 2：让 Agent 帮我操作浏览器

1. 用户在对话中描述目标任务
2. Agent 根据当前页面和工具能力拆分步骤
3. 系统执行点击、输入、导航、提取内容等动作
4. 用户在界面或调试视图中看到执行过程和结果

### 体验 3：直接运行一个预设能力

1. 用户打开 Skill 面板或预设场景入口
2. 点击一个无需额外填写参数的场景
3. 系统自动进入目标页面并执行完整流程
4. 用户看到结果，同时可以查看调试信息理解系统做了什么

---

## 当前状态

| 模块 | 状态 | 说明 |
|------|------|------|
| 对话工作台 | 已实现 | 已具备模型选择、流式、多会话、持久化、Markdown、图片展示 |
| 页面上下文感知 | 已实现 | 已支持 URL、标题、选中文本等基础上下文 |
| 浏览器工具调用 | 进行中 | 基础能力已具备，高阶自主规划仍在补强 |
| Skill 体系 | 进行中 | 已有执行框架和预设，场景化体验仍需优化 |
| 沉浸式翻译 | 补强中 | 基础能力已有，正在升级至渐进式翻译体验（避免长等待） |
| DevTools MCP | 进行中 | 已完成基础接入，后续继续补强可用性 |
| 调试与稳定性 | 已实现 | 已有错误兜底、日志、调试面板和请求详情下载 |
| 正式使用文档 | 已实现 | `docs/` 已覆盖项目总览、双端指南和用例 |
| CSP 安全工具 + 长截图体验 | 进行中 | evaluate 在 CSP 严格页面失败，需新增安全工具 + 图片拼接下载 |
| 多 Workspace 端口冲突 | 进行中 | 多窗口 EADDRINUSE 修复，Leader/Follower 自动竞选 |
| 浏览器智能层 — 阶段1 DOM Snapshot | 未开始 | 结构化 DOM Snapshot + 稳定锚点 + browser_snapshot 工具 + AgentLoop 集成 |
| 沉浸式翻译零 DOM 篡改 | 未开始 | Overlay 绝对定位层 + 内存注册表替代属性标记，原始 DOM 零修改 |

---

## 沉浸式翻译体验升级（evo_v27）

### 文档目标

说明当前沉浸式翻译的核心体验差距，以及升级方向。

### 当前结论

#### 已确定

- 当前翻译在 Hacker News 等表格布局页面上体验严重不达标：翻译结果无法正确注入到页面对应位置。
- 根因有三：① 提取算法不支持 `<a>` 等行内文本元素，导致 HN 标题提取为整个 `<td>` 粒度过粗；② 在 `<tr>` 内插入 `<div>` 是无效 HTML，导致注入布局破坏；③ 蓝色边框卡片样式与专业沉浸式翻译的纯文本风格差距大。
- 期待效果已有截图参考：每个标题下方紧跟一行简洁中文翻译，无边框无背景，与页面融为一体。

#### 合理假设

- 修复应覆盖表格布局（HN）、列表布局、文章布局三类典型场景。
- 参考行业标准（沉浸式翻译 Chrome 扩展）的风格：翻译文本使用略小字号 + 柔和颜色，不添加任何装饰元素。
- 提取算法需要「智能叶节点检测」，优先提取实际承载文本的最小元素（如 `<a>`），而非其父容器（如 `<td>`）。

#### 待确认

- 是否需要为不同站点提供可配置的提取策略（当前按通用策略处理）。

### 用户与场景

- 用户在 Hacker News、Reddit、新闻列表等页面点击沉浸式翻译
- 期待每个标题/段落下方出现对应翻译，不破坏原始布局
- 翻译结果在视觉上与原文融为一体，而非作为外挂卡片

### 功能范围

#### 本次要做

- 提取算法支持行内文本元素（`<a>`、`<span>` 等），智能检测文本叶节点
- 内容区检测兼容表格布局（`table.itemlist` 等）
- 注入 DOM 策略适配表格结构（不在 `<tr>` 内插 `<div>`）
- 注入样式改为纯文本沉浸式风格（无边框、无背景、柔和色彩）
- 提取—翻译—注入全链路验证

#### 本次不做

- 站点级自定义提取规则配置
- 翻译缓存与离线翻译

### 关键体验

1. 用户在 Hacker News 打开沉浸式翻译
2. 每个英文标题下方出现一行中文翻译
3. 翻译文本字号略小、颜色柔和，视觉上不喧宾夺主
4. 页面原始布局完全不被破坏
5. 切换/清除功能正常工作

### 当前状态

- 基础翻译流程可工作（提取 → 翻译 → 注入）
- 在文章页面（`<article>/<p>` 结构）效果尚可
- 在表格/列表布局页面（HN）效果严重不达标

---

## Debug-Log 驱动体验优化 — CSP 安全工具 + 长截图合成下载 + Agent 语言一致性（evo_v28）

### 文档目标

基于真实用户会话日志（debug-log-2026-03-22T06-26-33-177Z.json）分析出的体验痛点，逐一消除核心阻断问题，使截图、长页面归档、下载等高频场景在 CSP 严格页面上也能正常完成。

### 当前结论

#### 已确定

- `browser_evaluate` 工具使用 `new Function()`（等价 `eval()`），在 CSP 包含 `script-src 'self'` 且不允许 `unsafe-eval` 的页面上被完全阻断。Hacker News 是典型代表。
- `batch_screenshot` 技能的第 2 步依赖 `browser_evaluate` 获取页面尺寸，CSP 阻断后整个技能提前终止，退化为 Agent 手动滚动截图。
- Agent 手动滚动截图时无法获取页面总高度，不知何时停止，导致重复截取底部区域或遗漏内容。
- 用户明确要求"合成一张长图下载"，但系统不具备图片拼接能力，也没有截图下载工具。
- Agent 回复的 think/act 步骤中英文混杂，系统 prompt 全英文导致模型有时用英文思考，体验不一致。

#### 合理假设

- 新增一个 CSP 安全的 `browser_get_page_info` 工具（在 content script 上下文直接读取 DOM 属性，不依赖 eval），可以替代 `evaluate` 在页面度量场景的使用。
- 图片拼接可通过 Chrome 侧 OffscreenCanvas / Canvas API 实现，在 content script 或 background service worker 中合成后触发下载。
- 系统 prompt 加入明确的语言一致性指令（"始终使用用户输入的语言回复"），可有效统一 Agent 输出语言。

#### 待确认

- `browser_evaluate` 是否应增加 CSP 检测 + 自动降级逻辑（当前方案是新增独立工具，不修改 evaluate 本身）。
- 长图拼接的最大截图数量限制（内存考虑）。

### 用户与场景

- 用户在 Hacker News 等 CSP 严格页面使用"截取整页"功能
- 用户希望一键获得完整长截图并下载到本地
- 用户对 Agent 回复语言有一致性预期（全中文对话应全中文回复）

### 功能范围

#### 本次要做

- 新增 `browser_get_page_info` CSP 安全工具，返回页面尺寸、滚动位置、URL、标题
- 升级 `batch_screenshot` 技能，用 `browser_get_page_info` 替代 `browser_evaluate`
- 新增截图合成下载能力（Canvas 拼接 + Blob 下载）
- 系统 prompt 加入语言一致性指令

#### 本次不做

- 修改 `browser_evaluate` 工具本身（保持原有能力，不退化）
- 跨页面截图（仅当前 tab 可见区域逐屏拼接）

### 关键体验

1. 用户在 HN 等 CSP 严格页面说"截取整页"
2. batch_screenshot 技能正常执行（不因 CSP 失败）
3. Agent 获得页面尺寸后精确计算需要滚动的屏数
4. 用户说"合成一张长图下载"
5. 系统将多张截图拼接为一张长图并触发浏览器下载
6. 全程 Agent 回复语言与用户一致

### 当前状态

- `browser_evaluate` 在 CSP 严格页面失败，无降级方案
- `batch_screenshot` 依赖 evaluate 获取页面度量，CSP 下完全不可用
- 无图片拼接和截图下载能力
- Agent 语言混杂无明确约束

---

## 全方位用户体验优化（evo_v29）

### 文档目标

基于 28 轮迭代后的现状，系统性识别用户体验短板，以"让用户更容易发现能力、更清晰感知进度、更高效管理历史"为目标，对 Chrome 侧核心交互链路做一轮完整升级。

### 当前结论

#### 已确定

- **对话后引导缺失**：AI 回复后，用户面对空白输入框，不知道下一步该问什么。WelcomeScreen 有 4 个静态预设 prompt，但仅限首次对话；后续对话中没有任何上下文感知的跟进建议。
- **Agent 多步执行进度不透明**：AgentStepView 展示单步详情（think/act/observe），但没有全局进度概览（第几步/共几步），用户不知道任务完成了多少、预计还要多久。
- **会话管理能力薄弱**：ConversationList 展示标题+时间+消息数，但没有搜索、没有置顶。当会话积累到 10+ 个时，找到特定历史对话只能逐个扫描。
- **输入发现性不足**：斜杠命令仅有 3 个（/new、/clear、/models），无法从输入框快速触发 Skill 或使用 prompt 模板。用户需要手动切到 Skills Tab 才能运行技能。
- **长回复导航体验差**：长 Markdown 回复中代码块没有折叠能力，多段回复缺少段落级快速跳转，用户需要反复滚动。

#### 合理假设

- 上下文感知的跟进建议可以显著提升"连续对话"场景的使用效率，让用户感觉 Agent 是"主动的"而不是"被动等指令的"。
- Agent 执行进度条在多步任务场景（Skill 执行、长截图、沉浸式翻译）中对用户感知帮助最大。
- 会话搜索和置顶是"会话管理"场景的刚需，参考 ChatGPT / Claude 的会话列表都已提供。
- 斜杠命令扩展为"统一入口"是 IDE 类工具的标准模式（VS Code Cmd+P、Raycast、Arc）。
- 代码块折叠和长回复导航是开发者用户的高频需求，参考 GitHub Issues / Notion 的折叠模式。

#### 待确认

- 跟进建议的生成是否应在 VSCode 侧由 LLM 生成，还是在 Chrome 侧基于规则匹配（前者质量高但有延迟，后者即时但泛化能力弱）。当前按"VSCode 侧 LLM 生成"方案实施，如果延迟不可接受再降级为规则。

### 用户与场景

- **场景 A：连续对话的跟进引导** — 用户问了一个问题，AI 回答后出现 2-3 个相关跟进建议，用户点击即可继续深入，无需手动构思 prompt。
- **场景 B：多步任务的进度感知** — 用户触发一个需要 5+ 步工具调用的任务，期望看到"步骤 3/7：正在提取页面内容…"的全局进度条，以及耗时和取消能力。
- **场景 C：快速找到历史对话** — 用户有 20+ 个历史会话，想找"上周讨论 Hacker News 的那个对话"，通过搜索框输入关键词即可过滤。
- **场景 D：从输入框快速触发能力** — 用户输入 `/skill immersive_translate` 直接运行技能，不需要切换到 Skills Tab；输入 `/template` 浏览 prompt 模板。
- **场景 E：高效阅读长回复** — 用户收到一个包含 3 个代码块和 500+ 字分析的长回复，代码块默认折叠只显示前 5 行，点击展开查看全部；长回复顶部有小型标题导航。

### 功能范围

#### 本次要做

- 智能跟进建议：AI 回复后展示 2-3 个动态建议芯片
- Agent 执行进度条：全局步骤计数 + 当前步骤描述 + 耗时 + 取消
- 会话搜索与置顶：搜索框 + 置顶标记 + 持久化
- 斜杠命令扩展：新增 /skill、/template 命令 + Skill 名称自动补全
- 长回复增强：代码块折叠 + 长回复标题导航

#### 本次不做

- 跨设备同步会话历史
- AI 自动生成会话标题（现有标题取自首条消息即可）
- 语音输入
- 回复评分/反馈机制

### 关键体验

1. 用户发送"分析这个页面"，AI 回复后出现"深入分析某个部分"、"翻译关键段落"、"截取长图"三个建议芯片
2. 用户触发沉浸式翻译 Skill，顶部出现进度条"步骤 2/4：翻译段落中… (12s)"
3. 用户打开会话侧栏，输入"HN"，只显示标题包含 HN 的会话
4. 用户在输入框输入"/skill "，弹出 Skill 列表自动补全，选择后一键执行
5. 长回复中的 50 行代码块只显示前 5 行 + "展开全部"按钮

### 当前状态

- WelcomeScreen 有 4 个静态预设 prompt，但对话中无动态建议
- AgentStepView 展示单步详情，无全局进度
- ConversationList 无搜索无置顶
- 斜杠命令仅 3 个（/new, /clear, /models）
- 代码块有复制按钮但无折叠能力

---

## 沉浸式翻译渐进式体验优化（evo_v30）

### 文档目标

说明当前沉浸式翻译的核心体验瓶颈（长等待、无中间反馈），以及渐进式翻译的解决方案。

### 当前结论

#### 已确定

- 当前 `immersive_translate` 是 3 步串行流：`extract ALL → translate ALL → inject ALL`。用户必须等所有段落翻译完成后才能看到任何翻译结果。
- `llm_translate` 内部虽已分批（`TRANSLATE_BATCH_SIZE = 20`），但所有批次必须全部完成才返回。对于 200 段落的页面，翻译阶段耗时 30-50 秒，全程无中间反馈。
- `injectBilingual` 已支持增量注入——按 `data-imt-id` 匹配，只注入对应 ID 的翻译，不影响已有翻译或未翻译段落。这意味着可以安全地多次调用注入。
- Chrome 侧 `TranslateControl.tsx` 只展示 Skill 级别的步骤进度（1/3、2/3），无法展示翻译批次级别的细粒度进度。

#### 合理假设

- 新增 `llm_translate_progressive` 工具，在每个翻译批次完成后立即调用 `browser_inject_bilingual` 注入该批次，用户 3-5 秒内看到首批翻译结果。
- 首批使用较小批量（5 段）优先产出第一屏翻译，后续批次用较大批量（15 段）提升吞吐。
- 通过 WebSocket `translate_progress` 消息推送批次级进度，Chrome 侧展示"翻译中: 15/42 段落已完成"的实时进度。
- 单批失败不阻断整体翻译，失败批次记录后在末尾重试一次。

#### 待确认

- 首批 5 段和后续 15 段的批量大小是否为最佳值，可能需要根据 LLM 响应速度微调。
- 是否需要提供"取消正在进行的翻译"的能力（当前按支持取消方案实施）。

### 用户与场景

- 用户在 Hacker News、Reddit、长文章等页面触发沉浸式翻译
- 期望在几秒内看到第一部分翻译出现，而非等待数十秒
- 翻译过程中能看到进度（N/M 段落已翻译），知道系统在工作
- 翻译质量不因渐进式而降低——每个批次仍使用完整翻译 prompt

### 功能范围

#### 本次要做

- 新增 `llm_translate_progressive` 工具：翻译一批 → 注入一批 → 推送进度 → 继续下批
- 首批 5 段快速出结果，后续每批 15 段
- WebSocket `translate_progress` 消息推送批次级进度
- Chrome 侧 `TranslateControl` 展示实时翻译进度条（N/M 段落）
- 更新 `immersive_translate` Skill 定义为 2 步流：extract → progressive_translate_inject
- 单批失败隔离 + 末尾重试

#### 本次不做

- 翻译缓存（已翻译段落跳过重新翻译）
- 并发多批次翻译（LLM 并发可能导致 token 竞争）
- 翻译结果预测/占位符显示

### 关键体验

1. 用户点击"沉浸式翻译"，3-5 秒内页面上方出现第一批翻译
2. 翻译持续渐进出现，每隔 2-3 秒新增一批
3. Chrome 侧显示"翻译中: 15/42 段落已完成"进度条
4. 全部完成后进度消失，显示"翻译完成 ✓"
5. 翻译质量与非渐进式完全一致

### 当前状态

- `immersive_translate` 是串行 3 步流，翻译全部完成才注入
- `llm_translate` 内部分批但不返回中间结果
- Chrome 侧只有 Skill 步骤级进度，无翻译段落级进度
- `injectBilingual` 已支持增量调用（技术可行性已具备）

---

## 多 Workspace 窗口 WebSocket 端口冲突修复（evo_v31）

### 文档目标

说明当用户打开多个 VSCode workspace 窗口时，Browser Agent WebSocket 服务因端口冲突导致启动失败的问题，以及 Leader/Follower 模式的解决方案。

### 当前结论

#### 已确定

- VSCode 插件的 `activationEvents: ["*"]` 使每个打开的 workspace 窗口都独立执行 `activate()`，各自尝试在同一端口（默认 7777）启动 WebSocket 服务器。
- 第二个及后续窗口的 `wsServer.start()` 必定触发 `EADDRINUSE` 错误，当前处理逻辑是弹出错误对话框（`vscode.window.showErrorMessage`）并标记 `wsServerHealthy = false`，导致 MessageHandler 不注册、整个插件在该窗口不可用。
- Chrome 侧只连接固定端口（默认 7777），不感知哪个 VSCode 窗口是服务端。
- `WsServer.dispose()` 在 `deactivate()` 中被正确调用，关闭窗口时端口会释放。

#### 合理假设

- 采用 **Leader/Follower** 模式是最简方案：成功绑定端口的窗口为 leader，失败的窗口进入 follower（passive）模式，不报错、不弹窗。
- Follower 窗口应有定时重试机制（如每 10 秒检测），当 leader 窗口关闭后自动竞选为新 leader。
- 竞选成功后需完整初始化 MessageHandler，恢复 Chrome 侧通信能力。
- StatusBar 和 ConnectionTree 应展示当前窗口的角色（leader/follower），帮助用户理解系统状态。

#### 待确认

- Follower 的重试间隔（当前按 10 秒设计）是否合适，可能需要根据实际使用场景微调。
- 是否需要在 follower 窗口提供"手动竞选"命令（当前仅自动竞选，不提供手动入口）。

### 用户与场景

- 用户日常打开多个 VSCode workspace 窗口（不同项目或同一项目的不同分支）
- 安装 Browser Agent 插件后，每个窗口都会尝试启动 WS 服务
- 期望：只有一个窗口运行服务器，其他窗口安静等待；关闭活跃窗口后，另一个窗口自动接管
- 不期望：看到令人困惑的错误弹窗，或需要手动修改端口配置

### 功能范围

#### 本次要做

- WsServer EADDRINUSE 处理从"报错弹窗"改为"进入 follower 模式 + 信息通知"
- Extension 适配 follower 模式：跳过 MessageHandler 注册、标记状态
- 定时竞选机制：follower 周期性尝试绑定端口，成功后升级为 leader
- Leader 升级后完整初始化 MessageHandler 及下游依赖
- ConnectionTree 和 StatusBar 展示当前角色状态

#### 本次不做

- 多窗口间的进程通信或共享状态（不引入 IPC/lock file 等复杂机制）
- Chrome 侧适配多端口连接（保持只连接固定端口）
- 让 follower 窗口也能处理消息（follower 就是不运行 WS 的安静角色）

### 关键体验

1. 用户打开第一个 workspace 窗口 → Browser Agent WS 服务正常启动（leader）
2. 打开第二个窗口 → 不弹错误对话框，StatusBar 显示"follower"状态，通知"另一个窗口已启动 WebSocket 服务"
3. 关闭第一个窗口 → 10 秒内第二个窗口自动竞选为 leader，WS 服务启动，Chrome 可正常连接
4. 调试视图清楚显示当前窗口角色：🟢 Leader / 🔵 Follower

### 当前状态

- EADDRINUSE 处理为错误弹窗 + wsServerHealthy = false，用户体验差
- 无 leader/follower 概念，无自动竞选机制
- 多窗口场景下用户只能手动改端口或关闭多余窗口

---

## 浏览器智能层 — 阶段 1：结构化 DOM Snapshot（evo_v32）

### 文档目标

说明当前浏览器上下文和操作体系的核心短板，以及浏览器智能层第一阶段（DOM Snapshot）的解决方案。本阶段是整个智能层五阶段演进的基础，后续的语义模型、Patch DSL、专职 Agent、视觉验证都依赖于此。

### 当前结论

#### 已确定

- 当前页面上下文仅包含 `url`、`title`、`selectedText` 三个字段，Agent 对页面结构一无所知——它不知道页面上有哪些区域、哪些元素可交互、哪些位置适合注入内容。
- 当前浏览器操作全靠 Agent 猜测 CSS selector 后直接执行，没有预检、没有验证、没有回滚。操作失败后 Agent 只能靠错误信息再试，成功率低。
- 当前沉浸式翻译等注入场景的节点定位完全依赖单一 selector，页面重排或框架重渲染后定位即失效。
- `browser-intelligence-architecture.md` 已定义了完整的五阶段演进路线，第一阶段是"结构化 DOM Snapshot"——让系统第一次拥有页面结构视图。

#### 合理假设

- Chrome 侧在 content script 中构建 `DomSnapshotNode` 树（含 tag、role、visibility、interactivity、rect、textPreview、selectorHint），通过新的 `browser_snapshot` 工具返回给 VSCode 侧，是技术可行的。
- DOM Snapshot 需要深度和节点数限制（默认深度 12 层、最多 3000 节点），避免在复杂页面上产出超大快照。
- 稳定锚点（NodeAnchor）应作为 Snapshot 的伴生能力同步实现——每个关键节点同时生成 cssSelector、textQuote、parentSignature 等多路锚点，为后续 Patch 定位和回滚打基础。
- 共享数据结构（DomSnapshotNode、NodeAnchor、SemanticPageModel 接口、DomPatchPlan 接口）应独立定义在 `browser-runtime-contract.ts` 中，避免 Chrome 和 VSCode 两端重复定义。

#### 待确认

- Snapshot 的默认深度和节点数上限是否需要根据实际 LLM token 限制微调（当前按 12 层 / 3000 节点先实施）。
- 是否需要在 Snapshot 中包含 computed style 摘要（当前阶段不包含，留给阶段 2 语义模型）。
- Agent 是否应在每次对话轮次自动触发 Snapshot，还是仅在需要时主动调用工具（当前按"工具调用"方式，Agent 主动请求）。

### 用户与场景

- **场景 A：Agent 理解页面结构后再操作** — 用户说"点击页面上的登录按钮"，Agent 先调用 `browser_snapshot` 获取页面结构树，识别出登录按钮的确切位置和 selector，再精准执行点击，而不是凭猜测。
- **场景 B：Agent 选择注入位置** — 用户说"在每个标题后面加上翻译"，Agent 先分析 Snapshot 找到所有标题节点及其锚点信息，再决定在哪些位置注入，而不是硬编码 selector。
- **场景 C：开发者调试工具调用** — 开发者在 VSCode 调试视图中查看 Agent 获取的 Snapshot 数据，理解 Agent 为什么选择了某个 selector，定位工具调用失败的原因。

### 功能范围

#### 本次要做

- Chrome 侧 `dom-snapshot.ts`：构建结构化 DOM Snapshot 树（DomSnapshotNode）
- Chrome 侧 `anchor-resolver.ts`：为关键节点构建 NodeAnchor 多路锚点 + 锚点重定位解析
- VSCode 侧 `browser-runtime-contract.ts`：定义浏览器智能层共享 TypeScript 类型（DomSnapshotNode、NodeAnchor、SemanticPageModel、DomPatchPlan 等）
- `browser_snapshot` 工具注册：VSCode browser-tools.ts 新增工具 + Chrome action-executor.ts 新增 ActionType
- AgentLoop system prompt 更新：告知 Agent 可用 `browser_snapshot` 获取结构化页面视图

#### 本次不做

- 语义页面模型构建（阶段 2）
- Patch DSL 与受控执行（阶段 3）
- Understanding / Mutation 专职 Agent（阶段 4）
- 视觉联合验证（阶段 5）
- Snapshot 自动附加到每轮对话（当前阶段按工具调用方式）
- 包含 computed style 或 event 能力摘要

### 关键体验

1. Agent 收到用户任务后，调用 `browser_snapshot` 获取当前页面的结构化视图
2. Snapshot 返回一棵精简的 DOM 树，每个节点包含 tag、role、可见性、可交互性、文本预览和边界框
3. Agent 基于 Snapshot 精准选择操作目标，不再凭空猜测 selector
4. 关键节点同时携带 NodeAnchor 信息，为后续定位和回滚提供稳定基础
5. 开发者可在调试日志中看到 Snapshot 数据，辅助排查

### 当前状态

- 页面上下文仅有 url / title / selectedText，无任何结构信息
- Agent 工具调用靠 LLM 自行猜测 selector，无预检
- 注入操作无验证、无回滚
- 浏览器智能层架构文档已完成（`docs/browser-intelligence-architecture.md`），但零实现

---

## 沉浸式翻译零 DOM 篡改优化（evo_v33）

### 文档目标

说明当前沉浸式翻译对原始 HTML 的修改方式及其导致的布局破坏问题，以及通过 Overlay 绝对定位架构实现零 DOM 篡改的解决方案。

### 当前结论

#### 已确定

- 当前沉浸式翻译在注入时会修改原始 DOM：① 给原始元素添加 `data-imt-id` 属性用于标记和回查；② 在原始元素旁插入 `<div>` 或 `<span>` 兄弟节点作为翻译容器。
- 这两种修改在以下场景会破坏原始页面布局：
  - **Flex/Grid 容器**：插入兄弟节点变为新的 flex/grid item，改变布局排列和间距
  - **CSS 选择器依赖**：`:nth-child`、`+` 相邻兄弟选择器、`>` 直接子选择器因新增元素而失效或错位
  - **复杂表格嵌套**：虽然 v27 做了表格适配，但深层嵌套表格仍有边界情况
  - **属性污染**：`data-imt-id` 属性可能与页面自身的属性选择器或 JavaScript 逻辑冲突
- 行业标杆（沉浸式翻译 Chrome 扩展）使用类似 Overlay 方案，翻译元素不直接修改原始 DOM 结构。

#### 合理假设

- 采用 **Overlay 绝对定位层** 是避免 DOM 篡改的最优解：将所有翻译元素放入一个独立的绝对定位容器中，通过 `getBoundingClientRect()` 计算位置，与原始 DOM 完全解耦。
- 使用 **内存元素注册表**（`Map<string, Element>`）替代 `data-imt-id` 属性，在 content script 生命周期内维护元素映射，无需修改原始元素。
- Overlay 容器使用 `position: absolute`（相对于 body）而非 `position: fixed`，翻译元素随页面自然滚动，无需额外滚动监听。
- 需要 `ResizeObserver` + `requestAnimationFrame` 在窗口大小变化时重新计算翻译元素位置。

#### 待确认

- 极端动态页面（频繁 DOM 变更的 SPA）中 Overlay 位置同步的性能表现是否可接受。
- 是否需要为 Overlay 添加 Shadow DOM 实现完全的样式隔离（当前先用 scoped CSS + `all: initial` 重置）。

### 用户与场景

- 用户在 Flex/Grid 布局页面（现代 SPA、Dashboard、Tailwind/Bootstrap 站点）使用沉浸式翻译，不希望翻译破坏精心设计的布局
- 用户在 Hacker News 等表格布局页面翻译，不希望表格结构因注入节点而变形
- 用户在使用 `:nth-child` 等选择器做样式控制的页面翻译，不希望因插入元素导致奇偶行颜色错乱
- 用户期望翻译"浮现"在原文下方，而非"嵌入"到 DOM 中

### 功能范围

#### 本次要做

- 新增 `imt-registry.ts`：内存元素注册表，替代 `data-imt-id` 属性标记
- 新增 `imt-overlay.ts`：Overlay 绝对定位容器，翻译元素在独立层中渲染
- 重构 `extractParagraphs`：使用注册表存储元素引用，不修改原始元素
- 重构 `injectBilingual`：翻译元素创建在 Overlay 中，通过坐标定位到原文下方
- 适配 toggle/clear 到 Overlay 架构
- 添加 ResizeObserver 窗口变化时重新定位
- CSS 隔离防止样式泄漏

#### 本次不做

- Shadow DOM 完全隔离（后续视实际需求追加）
- Overlay 内翻译元素的拖拽或位置调整
- 跨 iframe 翻译注入

### 关键体验

1. 用户触发沉浸式翻译后，翻译文本出现在原文下方，视觉效果与之前一致
2. 打开浏览器 DevTools 检查 DOM，原始元素无任何新增属性（无 `data-imt-id`）或新增兄弟节点
3. Flex/Grid 布局页面翻译后布局完全不变，`:nth-child` 等选择器不受影响
4. 翻译文本随页面自然滚动，不需要额外同步
5. toggle/clear 功能正常工作，clear 后 Overlay 容器被移除

### 当前状态

- 翻译通过 sibling 插入 + `data-imt-id` 属性标记，会修改原始 DOM
- 在 Flex/Grid 容器中插入兄弟节点会破坏布局排列
- CSS 选择器（如 `:nth-child`）因新增元素而失效
- 基础翻译流程（提取→翻译→注入）和渐进式翻译已稳定可用

---

## 约束与风险

- 所有模型调用必须走 `vscode.lm`，不能把模型能力下沉到 Chrome 插件侧。
- 本地通信架构要求浏览器侧和 VSCode 侧状态保持一致，连接稳定性直接影响核心体验。
- 模糊需求很多，如果 PM 不先做归纳，需求文档会退化成“任务清单”而不是“功能定义”。
- 预设 Skill 和预设场景如果只追求数量，会迅速降低成功率和可维护性。

---

## 后续文档策略

- `feature-doc.md` 负责讲清“功能是什么、给谁用、边界在哪”
- `requirements.md` 负责讲清“要交付什么、怎么验收、影响哪里”
- `docs/*` 负责讲清“已经实现的能力怎么使用”
