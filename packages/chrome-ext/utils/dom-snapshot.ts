/**
 * dom-snapshot.ts — 结构化 DOM Snapshot 采集器
 *
 * 职责：
 *   遍历 DOM 树，构建结构化 DomSnapshotNode 树，
 *   包含节点标签、ARIA role、可见性、可交互性、边界矩形、文本预览、
 *   CSS 选择器提示等元信息。供 Browser Understanding Agent 消费，
 *   替代直接将原始 HTML 传输给 LLM。
 *
 * 设计依据：docs/browser-intelligence-architecture.md §Structural Snapshot Layer
 *
 * 安全性：
 *   - 不使用 eval、new Function、innerHTML 解析等 CSP 敏感操作
 *   - 仅读取 DOM 属性，不修改页面内容
 *   - 所有操作均为同步遍历 + 只读 API 调用
 */

// ════════════════════════════════════════════════════════════════
// 类型定义（镜像 browser-runtime-contract.ts，避免跨包依赖）
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
 * 由本模块 buildDomSnapshot 采集，经 WebSocket 传输到 VSCode 侧。
 */
export interface DomSnapshotNode {
  /** 节点唯一标识（格式如 "n-0", "n-1"） */
  nodeId: string;
  /** HTML 标签名（小写） */
  tag: string;
  /** WAI-ARIA role，无则省略 */
  role?: string;
  /** CSS 选择器提示（用于锚点和调试） */
  selectorHint?: string;
  /** 文本内容预览（截断到合理长度） */
  textPreview?: string;
  /** 关键 HTML 属性子集 */
  attributes?: Record<string, string>;
  /** 节点是否在 viewport 中可见 */
  visible: boolean;
  /** 节点是否可交互 */
  interactive: boolean;
  /** 节点边界矩形 */
  rect?: NodeRect;
  /** 子节点列表 */
  children?: DomSnapshotNode[];
}

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
// 常量
// ════════════════════════════════════════════════════════════════

/** 默认选项值 */
const DEFAULTS: Required<SnapshotOptions> = {
  maxDepth: 12,
  maxNodes: 3000,
  scopeSelector: '',
  includeRect: true,
  includeHidden: false,
  textPreviewMaxLength: 120,
};

/** 需要跳过的标签集合（脚本、样式等无语义标签） */
const SKIP_TAGS = new Set([
  'script', 'style', 'noscript', 'link', 'meta',
  'br', 'wbr', 'template',
]);

/** 被认为是可交互的标签 */
const INTERACTIVE_TAGS = new Set([
  'a', 'button', 'input', 'select', 'textarea', 'details', 'summary',
  'label', 'option',
]);

/** 被认为是可交互的 ARIA role */
const INTERACTIVE_ROLES = new Set([
  'button', 'link', 'textbox', 'checkbox', 'radio', 'switch',
  'slider', 'spinbutton', 'combobox', 'listbox', 'option',
  'menuitem', 'tab', 'treeitem',
]);

/** 值得保留到快照中的 HTML 属性白名单 */
const ATTRIBUTE_WHITELIST = new Set([
  'href', 'src', 'alt', 'title', 'type', 'name', 'value',
  'placeholder', 'aria-label', 'aria-describedby', 'aria-expanded',
  'aria-hidden', 'aria-checked', 'aria-selected', 'aria-disabled',
  'role', 'id', 'class', 'for', 'action', 'method',
  'data-testid', 'data-id', 'data-type',
  'contenteditable', 'tabindex', 'disabled', 'readonly', 'checked',
]);

// ════════════════════════════════════════════════════════════════
// 内部工具函数
// ════════════════════════════════════════════════════════════════

/**
 * 获取元素的直接文本内容（不含子元素文本）。
 * 只采集 Text 子节点的内容并合并。
 */
function getDirectTextContent(el: Element): string {
  let text = '';
  for (let i = 0; i < el.childNodes.length; i++) {
    const child = el.childNodes[i];
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent ?? '';
    }
  }
  return text.trim();
}

/**
 * 截断文本到指定长度，超出部分用 "…" 替代。
 */
function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

/**
 * 判断元素是否在 viewport 中可见。
 * 检查: display/visibility/opacity + getBoundingClientRect 尺寸。
 * 不使用 eval，纯 DOM API。
 */
function isElementVisible(el: Element): boolean {
  // 快速检查：HTMLElement 的 offsetParent 为 null 通常表示不可见
  // （固定定位元素和 body 例外）
  if (el instanceof HTMLElement) {
    if (
      el.offsetParent === null &&
      el.tagName.toLowerCase() !== 'body' &&
      getComputedStyle(el).position !== 'fixed' &&
      getComputedStyle(el).position !== 'sticky'
    ) {
      return false;
    }
  }

  const style = getComputedStyle(el);
  if (style.display === 'none') return false;
  if (style.visibility === 'hidden' || style.visibility === 'collapse') return false;
  if (parseFloat(style.opacity) === 0) return false;

  const rect = el.getBoundingClientRect();
  // 零尺寸元素视为不可见
  if (rect.width === 0 && rect.height === 0) return false;

  return true;
}

/**
 * 判断元素是否可交互。
 * 综合标签名、ARIA role、tabindex、contenteditable。
 */
function isElementInteractive(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  if (INTERACTIVE_TAGS.has(tag)) return true;

  const role = el.getAttribute('role');
  if (role && INTERACTIVE_ROLES.has(role)) return true;

  // 带有正 tabindex 的元素可聚焦/可交互
  const tabIndex = el.getAttribute('tabindex');
  if (tabIndex !== null && parseInt(tabIndex, 10) >= 0) return true;

  // contenteditable 元素可交互
  if (el.getAttribute('contenteditable') === 'true') return true;

  // 带有 onclick 等内联事件属性的元素（不使用 eval，只读取属性存在性）
  if (el.hasAttribute('onclick') || el.hasAttribute('onmousedown')) return true;

  return false;
}

/**
 * 构建元素的 CSS 选择器提示。
 * 优先使用 id，其次 tag.class 组合，再加 nth-of-type 去重。
 */
function buildSelectorHint(el: Element): string {
  const tag = el.tagName.toLowerCase();

  // 优先使用 id（如果存在且看起来像稳定 id）
  const id = el.id;
  if (id && /^[a-zA-Z][\w-]*$/.test(id)) {
    return `#${id}`;
  }

  // 使用 tag + 有意义的 class
  const classes = Array.from(el.classList)
    .filter(c => /^[a-zA-Z][\w-]*$/.test(c))    // 排除动态 hash class
    .filter(c => c.length < 40)                    // 排除超长 class
    .slice(0, 3);                                  // 最多保留 3 个

  let selector = tag;
  if (classes.length > 0) {
    selector += '.' + classes.join('.');
  }

  // 添加 nth-of-type 去重（仅在父节点下有同名兄弟时）
  const parent = el.parentElement;
  if (parent) {
    const siblings = parent.querySelectorAll(`:scope > ${tag}`);
    if (siblings.length > 1) {
      let index = 0;
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === el) {
          index = i + 1;
          break;
        }
      }
      if (index > 0) {
        selector += `:nth-of-type(${index})`;
      }
    }
  }

  return selector;
}

/**
 * 提取元素的关键属性子集（白名单过滤）。
 * 返回 undefined 如果没有任何有意义的属性。
 */
function extractAttributes(el: Element): Record<string, string> | undefined {
  const result: Record<string, string> = {};
  let count = 0;

  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (ATTRIBUTE_WHITELIST.has(attr.name)) {
      let value = attr.value;

      // 截断过长的属性值（如超长 href / class）
      if (value.length > 200) {
        value = value.slice(0, 197) + '...';
      }

      // class 属性只保留前几个有意义的
      if (attr.name === 'class') {
        const trimmed = value.split(/\s+/).filter(c => c.length < 40).slice(0, 5).join(' ');
        if (trimmed) {
          result[attr.name] = trimmed;
          count++;
        }
        continue;
      }

      result[attr.name] = value;
      count++;
    }
  }

  return count > 0 ? result : undefined;
}

/**
 * 获取元素的边界矩形（相对于 viewport），四舍五入到整数。
 */
function getNodeRect(el: Element): NodeRect {
  const r = el.getBoundingClientRect();
  return {
    x: Math.round(r.x),
    y: Math.round(r.y),
    width: Math.round(r.width),
    height: Math.round(r.height),
  };
}

// ════════════════════════════════════════════════════════════════
// 核心采集函数
// ════════════════════════════════════════════════════════════════

/** 遍历上下文：在递归中共享，跟踪全局状态 */
interface WalkContext {
  nodeCounter: number;
  maxNodes: number;
  maxDepth: number;
  includeRect: boolean;
  includeHidden: boolean;
  textPreviewMaxLength: number;
}

/**
 * 递归遍历 DOM 树，构建 DomSnapshotNode。
 */
function walkElement(
  el: Element,
  depth: number,
  ctx: WalkContext,
): DomSnapshotNode | null {
  // 超出节点数限制，停止采集
  if (ctx.nodeCounter >= ctx.maxNodes) return null;

  const tag = el.tagName.toLowerCase();

  // 跳过无语义标签
  if (SKIP_TAGS.has(tag)) return null;

  // 可见性检测
  const visible = isElementVisible(el);

  // 如果不采集隐藏节点且当前不可见，跳过
  if (!visible && !ctx.includeHidden) return null;

  // 分配节点 ID
  const nodeId = `n-${ctx.nodeCounter++}`;

  // 基础字段
  const interactive = isElementInteractive(el);
  const role = el.getAttribute('role') || undefined;
  const selectorHint = buildSelectorHint(el);
  const attributes = extractAttributes(el);

  // 文本预览：采集直接文本内容
  const directText = getDirectTextContent(el);
  let textPreview: string | undefined;
  if (directText) {
    textPreview = truncateText(directText, ctx.textPreviewMaxLength);
  }

  // 边界矩形
  let rect: NodeRect | undefined;
  if (ctx.includeRect && visible) {
    rect = getNodeRect(el);
  }

  // 构建快照节点
  const node: DomSnapshotNode = {
    nodeId,
    tag,
    visible,
    interactive,
  };

  // 仅在有值时添加可选字段（减少 JSON 体积）
  if (role) node.role = role;
  if (selectorHint) node.selectorHint = selectorHint;
  if (textPreview) node.textPreview = textPreview;
  if (attributes) node.attributes = attributes;
  if (rect) node.rect = rect;

  // 递归子节点（未超深度限制时）
  if (depth < ctx.maxDepth) {
    const children: DomSnapshotNode[] = [];

    // 遍历普通子元素
    for (let i = 0; i < el.children.length; i++) {
      if (ctx.nodeCounter >= ctx.maxNodes) break;
      const childNode = walkElement(el.children[i], depth + 1, ctx);
      if (childNode) {
        children.push(childNode);
      }
    }

    // 遍历 Shadow DOM（open shadow root）
    if (el.shadowRoot) {
      for (let i = 0; i < el.shadowRoot.children.length; i++) {
        if (ctx.nodeCounter >= ctx.maxNodes) break;
        const shadowChild = walkElement(el.shadowRoot.children[i], depth + 1, ctx);
        if (shadowChild) {
          children.push(shadowChild);
        }
      }
    }

    if (children.length > 0) {
      node.children = children;
    }
  }

  return node;
}

// ════════════════════════════════════════════════════════════════
// 公共 API
// ════════════════════════════════════════════════════════════════

/**
 * 构建结构化 DOM Snapshot。
 *
 * 从指定根元素出发遍历 DOM 树，采集每个元素的标签、ARIA role、
 * 可见性、可交互性、边界矩形、文本预览、CSS 选择器提示等元信息，
 * 构建出紧凑的 DomSnapshotNode 树结构。
 *
 * @param root - 采集的根元素（通常为 document.body 或 scopeSelector 匹配的元素）
 * @param options - 采集选项（深度限制、节点数限制等）
 * @returns DomSnapshotNode 树，或 null（如根元素无效/不可见）
 *
 * @example
 * ```ts
 * // 采集整个页面
 * const snapshot = buildDomSnapshot(document.body);
 *
 * // 限定范围和深度
 * const snapshot = buildDomSnapshot(document.body, {
 *   maxDepth: 6,
 *   maxNodes: 1000,
 *   scopeSelector: '#main-content',
 * });
 * ```
 */
export function buildDomSnapshot(
  root: Element,
  options?: SnapshotOptions,
): DomSnapshotNode | null {
  const opts = { ...DEFAULTS, ...options };

  // 如果指定了 scopeSelector，定位到具体子树
  let targetRoot = root;
  if (opts.scopeSelector) {
    const scoped = root.querySelector(opts.scopeSelector);
    if (!scoped) {
      // scopeSelector 未匹配到任何元素，返回 null
      return null;
    }
    targetRoot = scoped;
  }

  const ctx: WalkContext = {
    nodeCounter: 0,
    maxNodes: opts.maxNodes,
    maxDepth: opts.maxDepth,
    includeRect: opts.includeRect,
    includeHidden: opts.includeHidden,
    textPreviewMaxLength: opts.textPreviewMaxLength,
  };

  return walkElement(targetRoot, 0, ctx);
}

/**
 * 便捷函数：采集当前文档的 DOM Snapshot。
 *
 * 自动以 document.body 为根进行采集。
 *
 * @param options - 采集选项
 * @returns DomSnapshotNode 树
 */
export function snapshotCurrentPage(
  options?: SnapshotOptions,
): DomSnapshotNode | null {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }
  return buildDomSnapshot(document.body, options);
}
