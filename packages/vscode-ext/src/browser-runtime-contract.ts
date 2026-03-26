/**
 * browser-runtime-contract.ts — 浏览器智能层共享 TypeScript 类型定义
 *
 * 职责：
 *   统一定义 Browser Runtime 协议中使用的核心数据结构，
 *   供 VSCode 侧（Agent、Understanding、Mutation）和 Chrome 侧（Snapshot、Anchor、Patch）共享引用。
 *
 * 设计依据：docs/browser-intelligence-architecture.md
 *   - 结构化 DOM Snapshot 替代原始 HTML
 *   - 稳定多路锚点替代脆弱 selector
 *   - Patch DSL 替代自由脚本注入
 *   - 分层页面表示模型
 */

// ════════════════════════════════════════════════════════════════
// 1. DOM Snapshot — 结构化页面快照节点
// ════════════════════════════════════════════════════════════════

/** 节点边界矩形（相对于 viewport） */
export interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 结构化 DOM 快照节点。
 *
 * 由 Chrome 侧 dom-snapshot.ts 采集，经 WebSocket 传输到 VSCode 侧，
 * 供 Understanding Agent 消费。比原始 HTML 更紧凑且包含布局/交互元信息。
 */
export interface DomSnapshotNode {
  /** 节点唯一标识（采集时生成，格式如 "n-0", "n-1"） */
  nodeId: string;
  /** HTML 标签名（小写，如 "div", "a", "input"） */
  tag: string;
  /** WAI-ARIA role（如 "button", "navigation"），无则省略 */
  role?: string;
  /** CSS 选择器提示（用于锚点和调试） */
  selectorHint?: string;
  /** 文本内容预览（截断到合理长度） */
  textPreview?: string;
  /** 关键 HTML 属性子集（href、src、type、placeholder 等） */
  attributes?: Record<string, string>;
  /** 节点是否在 viewport 中可见 */
  visible: boolean;
  /** 节点是否可交互（可点击、可输入、可聚焦） */
  interactive: boolean;
  /** 节点边界矩形 */
  rect?: NodeRect;
  /** 子节点列表 */
  children?: DomSnapshotNode[];
}

// ════════════════════════════════════════════════════════════════
// 2. Snapshot 采集选项
// ════════════════════════════════════════════════════════════════

/** buildDomSnapshot 函数的配置选项 */
export interface SnapshotOptions {
  /** DOM 树最大遍历深度（默认 12） */
  maxDepth?: number;
  /** 快照中包含的最大节点数（默认 3000） */
  maxNodes?: number;
  /** 限定采集范围的 CSS 选择器（默认整个 document.body） */
  scopeSelector?: string;
  /** 是否采集节点边界矩形（默认 true） */
  includeRect?: boolean;
  /** 是否采集不可见节点（默认 false） */
  includeHidden?: boolean;
  /** 文本预览最大字符数（默认 120） */
  textPreviewMaxLength?: number;
}

// ════════════════════════════════════════════════════════════════
// 3. Node Anchor — 稳定多路锚点
// ════════════════════════════════════════════════════════════════

/**
 * 节点稳定锚点。
 *
 * 复杂页面会重排、重渲染、懒加载。单一 selector 不足以支撑长期稳定定位。
 * NodeAnchor 提供多路定位信息，按优先级依次尝试：
 *   1. nodeId（快照内唯一 ID）
 *   2. cssSelector（精确 CSS 选择器）
 *   3. xpath（XPath 路径）
 *   4. textQuote + context（文本片段 + 上下文）
 *   5. parentSignature + siblingSignature（结构签名）
 *   6. rectHint + semanticRegionId（视觉 + 语义区域）
 */
export interface NodeAnchor {
  /** 快照内节点 ID */
  nodeId?: string;
  /** CSS 选择器 */
  cssSelector?: string;
  /** XPath 路径 */
  xpath?: string;
  /** 节点包含的文本片段（用于文本匹配定位） */
  textQuote?: string;
  /** 文本片段之前的上下文（辅助精确匹配） */
  textContextBefore?: string;
  /** 文本片段之后的上下文（辅助精确匹配） */
  textContextAfter?: string;
  /** 父节点结构签名（tag + class + id 摘要） */
  parentSignature?: string;
  /** 兄弟节点结构签名 */
  siblingSignature?: string;
  /** 节点在 viewport 中的位置提示 */
  rectHint?: NodeRect;
  /** 所属语义区域 ID（来自 SemanticPageModel） */
  semanticRegionId?: string;
}

// ════════════════════════════════════════════════════════════════
// 4. Semantic Page Model — 页面语义模型（interface stub）
// ════════════════════════════════════════════════════════════════

/** 页面区域 */
export interface PageRegion {
  /** 区域唯一标识 */
  regionId: string;
  /** 区域类型 */
  regionType: 'header' | 'nav' | 'main' | 'sidebar' | 'footer' | 'modal' | 'overlay' | 'other';
  /** 区域锚点 */
  anchor: NodeAnchor;
  /** 区域描述 */
  description?: string;
}

/** 内容块 */
export interface ContentBlock {
  /** 块唯一标识 */
  blockId: string;
  /** 内容类型 */
  contentType: 'text' | 'image' | 'video' | 'form' | 'table' | 'list' | 'code' | 'other';
  /** 块锚点 */
  anchor: NodeAnchor;
  /** 文本预览 */
  textPreview?: string;
}

/** 操作区域 */
export interface ActionZone {
  /** 区域唯一标识 */
  zoneId: string;
  /** 操作类型 */
  actionType: 'button' | 'link' | 'input' | 'select' | 'toggle' | 'other';
  /** 区域锚点 */
  anchor: NodeAnchor;
  /** 操作描述 */
  label?: string;
}

/** 可注入候选位置 */
export interface InsertionCandidate {
  /** 候选唯一标识 */
  candidateId: string;
  /** 推荐注入策略 */
  strategyHints: MutationStrategy[];
  /** 候选锚点 */
  anchor: NodeAnchor;
  /** 风险等级 */
  riskLevel: 'low' | 'medium' | 'high';
}

/** 危险区域（不应修改的区域） */
export interface DangerousZone {
  /** 区域唯一标识 */
  zoneId: string;
  /** 危险原因 */
  reason: string;
  /** 区域锚点 */
  anchor: NodeAnchor;
}

/**
 * 页面语义模型（stub — 阶段 2 完整实现）。
 *
 * Understanding Agent 的核心产出。描述页面类型、主要区域、
 * 可操作点、可注入候选位置和危险区域。
 */
export interface SemanticPageModel {
  /** 页面类型 */
  pageType: 'article' | 'form' | 'feed' | 'dashboard' | 'search' | 'editor' | 'unknown';
  /** 检测到的前端框架提示 */
  frameworkHints: string[];
  /** 页面区域列表 */
  regions: PageRegion[];
  /** 内容块列表 */
  contentBlocks: ContentBlock[];
  /** 操作区域列表 */
  actionZones: ActionZone[];
  /** 可注入候选位置 */
  insertionCandidates: InsertionCandidate[];
  /** 危险区域（不应修改） */
  dangerousZones: DangerousZone[];
}

// ════════════════════════════════════════════════════════════════
// 5. DOM Patch DSL — 结构化变更计划（interface stub）
// ════════════════════════════════════════════════════════════════

/** 注入/变更策略 */
export type MutationStrategy =
  | 'overlay'
  | 'inline-after'
  | 'inline-before'
  | 'append'
  | 'replace-inner'
  | 'annotate';

/** Patch 目标节点 */
export interface PatchTarget {
  /** 快照内节点 ID */
  nodeId?: string;
  /** 备选 CSS 选择器列表（按优先级） */
  fallbackSelectors?: string[];
  /** 完整节点锚点（用于复杂重定位） */
  anchor?: NodeAnchor;
}

/** Patch 载荷 */
export interface PatchPayload {
  /** 载荷类型 */
  kind: 'card' | 'inline' | 'overlay' | 'annotation' | 'raw';
  /** 要注入的 HTML 片段 */
  html?: string;
  /** 要注入的纯文本 */
  text?: string;
  /** CSS 类名 */
  className?: string;
  /** 附加属性 */
  attributes?: Record<string, string>;
}

/** Patch 约束条件 */
export interface PatchConstraints {
  /** 幂等键（防止重复注入） */
  idempotencyKey: string;
  /** 是否保留已存在的同 key 内容 */
  preserveExisting?: boolean;
  /** 是否对 HTML 进行清洗 */
  sanitize?: boolean;
}

/** 验证计划 */
export interface VerificationPlan {
  /** 验证目标存在的选择器列表 */
  selectors?: string[];
  /** 预期包含的文本 */
  expectedText?: string;
  /** 预期属性值 */
  expectedAttributes?: Record<string, string>;
}

/**
 * DOM Patch 执行计划（stub — 阶段 3 完整实现）。
 *
 * Mutation Agent 的核心产出。结构化描述一次 DOM 变更的
 * 目标、操作方式、载荷、约束、验证规则和回滚需求。
 */
export interface DomPatchPlan {
  /** 目标节点 */
  target: PatchTarget;
  /** 变更操作类型 */
  operation:
    | 'insert_before'
    | 'insert_after'
    | 'append_child'
    | 'prepend_child'
    | 'replace_inner'
    | 'annotate';
  /** 变更载荷 */
  payload: PatchPayload;
  /** 约束条件 */
  constraints: PatchConstraints;
  /** 验证计划 */
  verify: VerificationPlan;
  /** 是否需要回滚支持 */
  rollback: boolean;
}

// ════════════════════════════════════════════════════════════════
// 6. Mutation Surface — 可变更表面模型
// ════════════════════════════════════════════════════════════════

/** 可变更表面（描述页面中哪些位置可以安全变更） */
export interface MutationSurface {
  /** 候选 ID */
  candidateId: string;
  /** 节点锚点 */
  anchor: NodeAnchor;
  /** 推荐策略 */
  strategyHints: MutationStrategy[];
  /** 风险等级 */
  riskLevel: 'low' | 'medium' | 'high';
  /** 是否可能保持稳定（不被框架重渲染覆盖） */
  likelyStable: boolean;
  /** 是否对前端框架敏感（React/Vue 管理的节点） */
  frameworkSensitive: boolean;
}

// ════════════════════════════════════════════════════════════════
// 7. 高层聚合类型 — Agent 输入输出
// ════════════════════════════════════════════════════════════════

/** 浏览器分析结果（Understanding Agent 输出） */
export interface BrowserAnalysisResult {
  /** 页面语义模型 */
  page: SemanticPageModel;
  /** 可变更表面列表 */
  mutationSurfaces: MutationSurface[];
  /** 风险提示 */
  risks: string[];
  /** 推荐操作 */
  recommendedActions: string[];
}

/** 浏览器变更请求（Mutation Agent 输入） */
export interface BrowserMutationRequest {
  /** 用户目标描述 */
  userGoal: string;
  /** 目标意图类型 */
  targetIntent: 'overlay' | 'augment' | 'replace' | 'annotate' | 'behavior';
  /** 要注入/变更的内容 */
  content: {
    html?: string;
    markdown?: string;
    text?: string;
  };
}

/** 浏览器变更结果（Mutation Agent 输出） */
export interface BrowserMutationResult {
  /** 是否执行成功 */
  success: boolean;
  /** 实际执行的 Patch Plan */
  appliedPlan?: DomPatchPlan;
  /** 验证是否通过 */
  verificationPassed: boolean;
  /** 是否已执行回滚 */
  rollbackApplied?: boolean;
  /** 诊断信息 */
  diagnostics: string[];
}
