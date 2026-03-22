# 浏览器智能层最优架构设计

面向长期演进的最优方案，不以实现速度为优先，而以稳定性、可解释性、可验证性和可扩展性为目标。本文档描述 Browser Agent 从“单 Agent + 浏览器工具”升级到“页面语义建模 + 结构化执行”的目标架构。

---

## 设计目标

- 不让通用 LLM 直接消费整页 HTML 并直接修改 DOM
- 将页面理解、执行规划、DOM 改写、结果验证拆为独立层
- 让浏览器操作从自由脚本调用升级为受控的结构化执行
- 支持复杂页面，包括 React/Vue、动态重渲染、长页面、浮层、Shadow DOM、iframe
- 支持注入、更新、回滚、重定位、调试和自动测试

---

## 核心设计原则

### 1. 语义模型优先于原始 HTML

浏览器页面不应作为“大块 HTML 文本”送给模型。页面应先在浏览器侧被转换成多层表示，模型消费的是裁剪后的结构化语义数据，而不是无边界的原始 DOM。

### 2. Agent 负责决策，Runtime 负责执行

模型负责判断“做什么”，程序负责控制“怎么做”。执行过程必须由受控 Runtime 完成，而不是让模型直接返回任意 JavaScript 并在页面中运行。

### 3. 一切 DOM 变更都应可验证、可回滚

任何页面注入、替换、装饰、事件绑定都必须经过 preflight、apply、verify、rollback 四阶段流程，避免出现“执行成功但页面状态不正确”的假阳性。

### 4. 节点定位必须具备稳定锚点

复杂页面会重排、重渲染、懒加载。单一 selector 不足以支撑长期稳定定位。应使用多路锚点系统，支持节点重定位和操作续接。

### 5. 浏览器理解需要 DOM 与视觉联合建模

页面结构语义不完全等于 DOM 语义。最优方案应联合使用 DOM、文本、布局、元素边界框、可见性、截图等信息，形成更可靠的页面理解。

---

## 总体架构

```text
┌──────────────────────────────────────────────────────────────────┐
│                        Orchestrator Agent                        │
│  - 理解用户目标                                                  │
│  - 选择浏览器能力 / 技能 / 其他工具                               │
│  - 协调各子模块                                                   │
└───────────────┬───────────────────────────────┬──────────────────┘
                │                               │
                │                               │
┌───────────────▼────────────────┐  ┌──────────▼───────────────────┐
│ Browser Understanding Agent    │  │ Browser Mutation Agent        │
│ - 页面语义理解                 │  │ - 生成结构化 DOM Patch Plan   │
│ - 区域识别                     │  │ - 选择注入策略                │
│ - 插入点发现                   │  │ - 产出校验与回滚要求          │
└───────────────┬────────────────┘  └──────────┬───────────────────┘
                │                               │
                └───────────────┬───────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                       Browser Runtime                             │
│  - DOM Snapshot Builder                                           │
│  - Semantic Model Builder                                         │
│  - Anchor Resolver                                                │
│  - Patch Applier                                                  │
│  - Verifier                                                       │
│  - Rollback Manager                                               │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                        State Store                                │
│  - 页面快照                                                         │
│  - 节点锚点                                                         │
│  - 操作历史                                                         │
│  - 回滚信息                                                         │
│  - 会话级页面语义状态                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 分层模型

### 1. Orchestrator Agent

职责：

- 理解用户意图
- 判断当前任务属于问答、提取、分析、注入、操作还是复合任务
- 选择是否调用浏览器理解能力、浏览器变更能力、技能系统或其他工具
- 在多轮任务中维护高层目标

约束：

- 不直接操作 DOM
- 不直接消费整页 HTML
- 不直接生成执行脚本

### 2. Browser Understanding Agent

职责：

- 分析页面的结构和语义
- 识别页面类型、主区域、交互区、危险区域
- 找到可用于注入、提取、解释、翻译的候选位置
- 将页面转换为适合下游消费的语义模型

输入：

- 结构化 DOM Snapshot
- 视觉和布局信息
- 页面元信息
- 用户目标

输出：

- Semantic Page Model
- Insertion Candidates
- 风险标记

### 3. Browser Mutation Agent

职责：

- 根据用户目标和页面语义模型产出结构化 Patch Plan
- 选择注入策略
- 指定验证规则和回滚需求

约束：

- 不返回任意 JavaScript
- 不直接返回执行后的最终结果
- 输出必须符合 Patch DSL

### 4. Browser Runtime

职责：

- 采集页面快照
- 解析和重定位目标节点
- 执行结构化 patch
- 验证执行结果
- 在失败时回滚

特点：

- 确定性
- 可测试
- 可审计
- 可记录和重放

### 5. State Store

职责：

- 保存页面分析结果
- 保存节点锚点与重定位所需信息
- 保存注入痕迹和回滚点
- 保存多轮任务的页面语义状态

---

## 页面表示模型

最优方案不直接把 `document.body.innerHTML` 交给模型，而是使用四层表示。

### 1. Raw DOM Layer

原始 DOM 信息层，主要供 Runtime 使用。

包含：

- tagName
- attributes
- textContent
- parent/child 关系
- visibility
- computed style 摘要
- bounding box
- event 能力摘要

### 2. Structural Snapshot Layer

裁剪后的结构树，用于在浏览器和模型之间传输。

目标：

- 降低 token 消耗
- 保留结构与位置线索
- 不暴露无关细节

建议字段：

```ts
interface DomSnapshotNode {
  nodeId: string;
  tag: string;
  role?: string;
  selectorHint?: string;
  textPreview?: string;
  attributes?: Record<string, string>;
  visible: boolean;
  interactive: boolean;
  rect?: { x: number; y: number; width: number; height: number };
  children?: DomSnapshotNode[];
}
```

### 3. Semantic Page Model

页面语义模型，是 Understanding Agent 的核心产出。

建议字段：

```ts
interface SemanticPageModel {
  pageType: 'article' | 'form' | 'feed' | 'dashboard' | 'search' | 'editor' | 'unknown';
  frameworkHints: string[];
  regions: PageRegion[];
  contentBlocks: ContentBlock[];
  actionZones: ActionZone[];
  insertionCandidates: InsertionCandidate[];
  dangerousZones: DangerousZone[];
}
```

其目标不是“还原 DOM”，而是告诉系统：

- 这是什么页面
- 主要内容在哪
- 哪些区域适合读
- 哪些区域适合写
- 哪些区域不该碰

### 4. Mutation Surface Model

这是 Mutation Agent 的直接输入，描述哪些地方可变、怎么变更更安全。

建议字段：

```ts
interface MutationSurface {
  candidateId: string;
  anchor: NodeAnchor;
  strategyHints: Array<'overlay' | 'inline-after' | 'inline-before' | 'append' | 'replace-inner' | 'annotate'>;
  riskLevel: 'low' | 'medium' | 'high';
  likelyStable: boolean;
  frameworkSensitive: boolean;
}
```

---

## 注入与变更策略

“插入 HTML”不是单一动作，最优方案应区分不同 mutation strategy。

### 1. Overlay Injection

适合：

- 助手面板
- 浮层提示
- 悬浮按钮
- 边栏工具

优点：

- 对宿主 DOM 侵入最小
- 不依赖页面结构稳定性

缺点：

- 与正文内容融合较弱

### 2. Inline Augmentation

适合：

- 在正文段落后插入解释块
- 在表单字段旁插入辅助说明
- 在列表项内插入标签或摘要

优点：

- 与页面内容结合最自然

缺点：

- 对节点定位和幂等要求最高

### 3. Replacement Patch

适合：

- 局部替换节点内容
- 修复页面局部输出

风险：

- 更容易被前端框架重渲染覆盖
- 更容易破坏宿主页面行为

### 4. Decorative Annotation

适合：

- 高亮
- 批注
- 标签
- 导航标记

优点：

- 风险较低
- 更容易撤销

### 5. Behavior Injection

适合：

- 绑定事件
- 观察节点变化
- 与宿主页面保持同步

注意：

- 必须由 Runtime 统一管理生命周期
- 不能放任模型生成任意事件脚本

---

## DOM Patch DSL

最优方案中，Mutation Agent 不直接返回脚本，而返回结构化 Patch Plan。

示例：

```json
{
  "target": {
    "nodeId": "main.article.p.12",
    "fallbackSelectors": [
      ".article-content p:nth-of-type(12)"
    ]
  },
  "operation": "insert_after",
  "payload": {
    "kind": "card",
    "html": "<section data-agent-block=\"translation-12\">...</section>"
  },
  "constraints": {
    "idempotencyKey": "translation-block-12",
    "preserveExisting": true,
    "sanitize": true
  },
  "verify": {
    "selectors": [
      "[data-agent-block='translation-12']"
    ]
  },
  "rollback": true
}
```

建议类型：

```ts
interface DomPatchPlan {
  target: PatchTarget;
  operation: 'insert_before' | 'insert_after' | 'append_child' | 'prepend_child' | 'replace_inner' | 'annotate';
  payload: PatchPayload;
  constraints: PatchConstraints;
  verify: VerificationPlan;
  rollback: boolean;
}
```

这个 DSL 应具备以下能力：

- 明确目标节点
- 明确变更方式
- 明确内容来源
- 明确幂等键
- 明确验证标准
- 明确是否需要回滚

---

## 稳定锚点系统

复杂页面中的节点定位不能只靠 selector。最优方案应构建 `NodeAnchor` 多路锚点。

建议结构：

```ts
interface NodeAnchor {
  nodeId?: string;
  cssSelector?: string;
  xpath?: string;
  textQuote?: string;
  textContextBefore?: string;
  textContextAfter?: string;
  parentSignature?: string;
  siblingSignature?: string;
  rectHint?: { x: number; y: number; width: number; height: number };
  semanticRegionId?: string;
}
```

重定位顺序建议：

1. `nodeId`
2. `cssSelector`
3. `textQuote + context`
4. `parent/sibling signature`
5. `rectHint + semanticRegion`

这样即使页面重渲染、列表重排、广告插入，系统仍有机会重新找到正确节点。

---

## 执行流水线

最优方案的页面改写应采用固定四阶段流水线。

### 1. Preflight

检查：

- 目标节点是否存在
- 目标区域是否可写
- 是否位于 Shadow DOM
- 是否跨 iframe
- 是否存在 React/Vue 重渲染风险
- HTML 是否需要清洗

### 2. Apply

执行结构化 patch：

- 插入容器
- 附加幂等标记
- 保存回滚点
- 记录执行日志

### 3. Verify

验证：

- 目标节点是否存在
- 注入内容是否在正确位置
- 文本和属性是否符合预期
- 是否立即被宿主页面移除
- 是否影响关键交互

### 4. Rollback

当验证失败时：

- 撤销插入
- 恢复被替换节点
- 清理监听器
- 输出失败原因与调试信息

---

## 视觉联合建模

只依赖 DOM 的页面理解不够稳定，最优方案应引入视觉 grounding。

建议联合信息：

- 页面截图
- 节点边界框
- 可见性
- z-index
- 在 viewport 内的位置
- 遮挡关系
- 屏幕上可读文本

视觉层可用于回答这些关键问题：

- 这个区域视觉上是不是主内容
- 这个按钮是否真正可点击
- 这个注入区域是否会遮挡原页面
- 这个注入结果是否符合用户预期

---

## 复杂页面支持

最优方案应将以下问题视为一等公民，而不是后续补丁。

### 1. Shadow DOM

要求：

- 支持遍历 open shadow roots
- 节点锚点需要记录 shadow root 边界

### 2. iframe

要求：

- 建立 frame tree
- 在不同 frame 中生成独立 snapshot
- patch target 需要明确 frame 归属

### 3. React/Vue/Svelte 等框架

要求：

- 检测框架根节点
- 避免直接覆盖框架控制节点
- 优先在稳定边界处注入 wrapper

### 4. 长页面与懒加载

要求：

- 支持分段 snapshot
- 支持分页/滚动采集
- 支持按区域分析

---

## 状态与持久化

最优方案中的状态存储不仅仅是聊天记录。

建议持久化对象：

- 最近页面的 Semantic Page Model
- 节点锚点缓存
- Patch 执行历史
- 回滚点
- 用户已确认的注入结果
- 多轮任务上下文

其作用：

- 支持后续更新、删除、重定位
- 支持调试
- 支持自动回放和测试

---

## 与当前项目的映射

当前项目已有以下基础：

- VSCode 侧已有主 `AgentLoop`
- Chrome 侧已有 `action-executor`
- 已有 `browser_*` 工具注册和桥接链路
- 已有初步页面上下文采集

当前主要缺口：

- 页面上下文过轻，只包含 `url/title/selectedText`
- 缺少结构化 DOM Snapshot
- 缺少页面语义模型
- 缺少受控 Patch DSL
- 缺少 preflight / verify / rollback 体系
- 缺少稳定锚点系统
- 缺少视觉联合验证

因此该项目的长期最优演进方向，不是单纯再增加一个“会读 HTML 的 agent”，而是增加一整层浏览器智能基础设施。

---

## 建议的模块拆分

以当前仓库为基础，建议未来增加如下模块。

### Chrome 侧

- `packages/chrome-ext/utils/dom-snapshot.ts`
  负责构建结构化 DOM Snapshot

- `packages/chrome-ext/utils/semantic-model-builder.ts`
  负责浏览器侧的基础语义预处理

- `packages/chrome-ext/utils/anchor-resolver.ts`
  负责节点锚点构建与重定位

- `packages/chrome-ext/utils/patch-applier.ts`
  负责执行 Patch DSL

- `packages/chrome-ext/utils/patch-verifier.ts`
  负责执行后验证与失败回滚

### VSCode 侧

- `packages/vscode-ext/src/browser-understanding-agent.ts`
  负责消费 Snapshot 并生成 Semantic Page Model

- `packages/vscode-ext/src/browser-mutation-agent.ts`
  负责将用户目标转换为 Patch Plan

- `packages/vscode-ext/src/browser-runtime-contract.ts`
  统一定义 Runtime 协议与数据结构

- `packages/vscode-ext/src/browser-state-store.ts`
  负责页面语义状态、patch 历史、锚点缓存

---

## 建议的数据结构

### Browser Analysis Result

```ts
interface BrowserAnalysisResult {
  page: SemanticPageModel;
  mutationSurfaces: MutationSurface[];
  risks: string[];
  recommendedActions: string[];
}
```

### Browser Mutation Request

```ts
interface BrowserMutationRequest {
  userGoal: string;
  targetIntent: 'overlay' | 'augment' | 'replace' | 'annotate' | 'behavior';
  content: {
    html?: string;
    markdown?: string;
    text?: string;
  };
}
```

### Browser Mutation Result

```ts
interface BrowserMutationResult {
  success: boolean;
  appliedPlan?: DomPatchPlan;
  verificationPassed: boolean;
  rollbackApplied?: boolean;
  diagnostics: string[];
}
```

---

## 演进路线

### 阶段 1. DOM Snapshot

目标：

- 从轻量上下文升级到结构化页面快照
- 让系统第一次拥有“页面结构视图”

### 阶段 2. Semantic Model

目标：

- 在 snapshot 之上建立页面类型、区域、候选插入点和风险模型

### 阶段 3. Patch DSL 与 Runtime

目标：

- 将 HTML 注入从任意脚本执行升级为受控 patch

### 阶段 4. Browser Specialist Agents

目标：

- 引入 Understanding Agent 和 Mutation Agent
- 让它们消费语义模型而不是原始 DOM

### 阶段 5. Verifier 与 Visual Grounding

目标：

- 增加视觉验证、截图辅助理解、复杂页面校验和自动回滚

---

## 非目标

以下内容不应作为第一优先级：

- 让模型直接运行任意 JavaScript
- 直接把整页 HTML 拼进 system prompt
- 只靠 selector 完成长期稳定定位
- 不做验证就认定注入成功
- 把浏览器变更能力和自由问答耦合在同一层

---

## 结论

最优解不是“再加一个浏览器 agent”，而是建立一套完整的浏览器智能层：

- 用结构化 Snapshot 替代原始 HTML
- 用语义页面模型替代页面文本拼接
- 用 Patch DSL 替代自由脚本注入
- 用稳定锚点替代脆弱 selector
- 用 Runtime + Verify + Rollback 替代一次性执行
- 用多层协作替代单 Agent 直接操作 DOM

对于当前仓库，这意味着未来的浏览器能力应从“工具集合”演进为“页面理解与变更平台”。在这个平台之上，新增专职 Browser Agent 才是合理且可持续的。
