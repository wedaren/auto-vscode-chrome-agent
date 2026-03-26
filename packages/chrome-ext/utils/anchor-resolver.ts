/**
 * anchor-resolver.ts — 稳定锚点构建与重定位解析
 *
 * 职责：
 *   为 DOM 元素构建多路稳定锚点（NodeAnchor），
 *   以及在页面重排/重渲染后根据锚点信息重定位元素。
 *
 *   复杂页面会重排、重渲染、懒加载。单一 selector 不足以支撑长期稳定定位。
 *   anchor-resolver 提供多路定位信息，按优先级依次尝试，
 *   即使页面结构变化也能大概率找到目标节点。
 *
 * 设计依据：docs/browser-intelligence-architecture.md §稳定锚点系统
 *
 * 安全性：
 *   - 不使用 eval、new Function、innerHTML 等 CSP 敏感操作
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
 * 节点稳定锚点。
 *
 * 提供多路定位信息，按优先级依次尝试：
 *   1. nodeId（快照内唯一 ID）
 *   2. cssSelector（精确 CSS 选择器）
 *   3. xpath（XPath 路径）
 *   4. textQuote + context（文本片段 + 上下文）
 *   5. parentSignature + siblingSignature（结构签名）
 *   6. rectHint（视觉位置提示）
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

/** resolveAnchor 的解析结果，附带命中的定位路径 */
export interface AnchorResolveResult {
  /** 解析成功定位的元素 */
  element: Element;
  /** 命中的定位策略名称 */
  resolvedBy: 'nodeId' | 'cssSelector' | 'xpath' | 'textQuote' | 'parentSignature' | 'rectHint';
  /** 匹配置信度 0-1 */
  confidence: number;
}

// ════════════════════════════════════════════════════════════════
// 常量
// ════════════════════════════════════════════════════════════════

/** 文本上下文采集长度（前后各取这么多字符） */
const CONTEXT_LENGTH = 40;

/** 文本引用最大长度 */
const TEXT_QUOTE_MAX_LENGTH = 80;

/** rectHint 匹配允许的偏移容差（像素） */
const RECT_TOLERANCE = 50;

// ════════════════════════════════════════════════════════════════
// 锚点构建：内部工具函数
// ════════════════════════════════════════════════════════════════

/**
 * 构建元素的精确 CSS 选择器。
 * 策略：
 *   1. 有稳定 id → #id
 *   2. 从元素到根逐层拼接 tag:nth-of-type → 精确路径选择器
 */
function buildCssSelector(el: Element): string {
  // 如果有稳定 id，直接返回
  const id = el.id;
  if (id && /^[a-zA-Z][\w-]*$/.test(id)) {
    // 验证 id 的唯一性
    try {
      if (el.ownerDocument.querySelectorAll(`#${CSS.escape(id)}`).length === 1) {
        return `#${CSS.escape(id)}`;
      }
    } catch {
      // CSS.escape 可能不存在或 querySelectorAll 失败，回退到路径构建
    }
  }

  // 逐层向上构建路径选择器
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current !== el.ownerDocument.documentElement) {
    const tag = current.tagName.toLowerCase();

    // 如果当前层有稳定 id，可提前终止
    const currentId = current.id;
    if (currentId && /^[a-zA-Z][\w-]*$/.test(currentId)) {
      try {
        if (current.ownerDocument.querySelectorAll(`#${CSS.escape(currentId)}`).length === 1) {
          parts.unshift(`#${CSS.escape(currentId)}`);
          break;
        }
      } catch {
        // 回退
      }
    }

    // 计算 nth-of-type 索引
    let nthIndex = 1;
    const parent: Element | null = current.parentElement;
    if (parent) {
      const siblings = parent.children;
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === current) break;
        if (siblings[i].tagName === current.tagName) {
          nthIndex++;
        }
      }
      // 只在有同名兄弟时才添加 nth-of-type
      let hasSameTagSibling = false;
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] !== current && siblings[i].tagName === current.tagName) {
          hasSameTagSibling = true;
          break;
        }
      }
      if (hasSameTagSibling) {
        parts.unshift(`${tag}:nth-of-type(${nthIndex})`);
      } else {
        parts.unshift(tag);
      }
    } else {
      parts.unshift(tag);
    }

    current = parent;
  }

  return parts.join(' > ');
}

/**
 * 构建元素的 XPath 路径。
 * 使用 tag[position] 从根到元素的绝对路径。
 */
function buildXPath(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    const tag = current.tagName.toLowerCase();

    // 如果有稳定 id，可以用 id() 快捷定位
    const id = current.id;
    if (id && /^[a-zA-Z][\w-]*$/.test(id)) {
      parts.unshift(`//*[@id="${id}"]`);
      break;
    }

    // 计算在兄弟节点中的位置索引
    let index = 1;
    let sibling = current.previousElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === tag) {
        index++;
      }
      sibling = sibling.previousElementSibling;
    }

    parts.unshift(`${tag}[${index}]`);
    current = current.parentElement;
  }

  // 如果第一个部分已经是 id 定位，直接使用
  if (parts.length > 0 && parts[0].startsWith('//*[@id=')) {
    return parts.join('/');
  }

  return '/' + parts.join('/');
}

/**
 * 获取元素的直接文本内容（不含子元素文本），用于 textQuote。
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
 * 获取元素的完整可见文本内容，用于 textQuote。
 * 如果直接文本为空，退回到 textContent。
 */
function getTextQuote(el: Element, maxLength: number): string {
  // 优先取直接文本（不含子元素）
  let text = getDirectTextContent(el);

  // 如果直接文本过短或为空，取完整文本（含子元素）
  if (text.length < 5) {
    text = (el.textContent ?? '').trim();
  }

  if (text.length > maxLength) {
    return text.slice(0, maxLength - 1) + '\u2026';
  }
  return text;
}

/**
 * 获取文本上下文：元素之前的兄弟节点文本。
 */
function getTextContextBefore(el: Element): string {
  let text = '';
  let sibling = el.previousSibling;
  while (sibling && text.length < CONTEXT_LENGTH) {
    const content = (sibling.textContent ?? '').trim();
    if (content) {
      text = content + ' ' + text;
    }
    sibling = sibling.previousSibling;
  }
  text = text.trim();
  if (text.length > CONTEXT_LENGTH) {
    return '\u2026' + text.slice(text.length - CONTEXT_LENGTH);
  }
  return text;
}

/**
 * 获取文本上下文：元素之后的兄弟节点文本。
 */
function getTextContextAfter(el: Element): string {
  let text = '';
  let sibling = el.nextSibling;
  while (sibling && text.length < CONTEXT_LENGTH) {
    const content = (sibling.textContent ?? '').trim();
    if (content) {
      text = text + ' ' + content;
    }
    sibling = sibling.nextSibling;
  }
  text = text.trim();
  if (text.length > CONTEXT_LENGTH) {
    return text.slice(0, CONTEXT_LENGTH) + '\u2026';
  }
  return text;
}

/**
 * 构建父节点结构签名。
 * 格式：tag#id.class1.class2 或 tag.class1.class2
 */
function buildParentSignature(el: Element): string {
  const parent = el.parentElement;
  if (!parent) return '';

  const tag = parent.tagName.toLowerCase();
  const id = parent.id;
  const classes = Array.from(parent.classList)
    .filter(c => /^[a-zA-Z][\w-]*$/.test(c) && c.length < 40)
    .slice(0, 3);

  let sig = tag;
  if (id && /^[a-zA-Z][\w-]*$/.test(id)) {
    sig += `#${id}`;
  }
  if (classes.length > 0) {
    sig += '.' + classes.join('.');
  }

  return sig;
}

/**
 * 构建兄弟节点结构签名。
 * 格式：[prev_tag|next_tag] 或 [prev_tag|] 或 [|next_tag]
 */
function buildSiblingSignature(el: Element): string {
  const prev = el.previousElementSibling;
  const next = el.nextElementSibling;

  const prevTag = prev ? prev.tagName.toLowerCase() : '';
  const nextTag = next ? next.tagName.toLowerCase() : '';

  if (!prevTag && !nextTag) return '';

  return `[${prevTag}|${nextTag}]`;
}

/**
 * 获取元素的边界矩形。
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
// 公共 API：锚点构建
// ════════════════════════════════════════════════════════════════

/**
 * 为 DOM 元素构建多路稳定锚点。
 *
 * 生成的 NodeAnchor 包含多种定位信息（CSS 选择器、XPath、文本引用、
 * 结构签名、位置提示等），使得即使页面重排、重渲染、懒加载后，
 * 也能通过 resolveAnchor 重新定位到该元素。
 *
 * @param element - 目标 DOM 元素
 * @param nodeId - 可选的快照内节点 ID（来自 dom-snapshot.ts 采集的 nodeId）
 * @returns NodeAnchor 多路锚点对象
 *
 * @example
 * ```ts
 * const anchor = buildNodeAnchor(document.querySelector('#submit-btn')!);
 * // anchor.cssSelector = '#submit-btn'
 * // anchor.xpath = '//*[@id="submit-btn"]'
 * // anchor.textQuote = 'Submit'
 * // anchor.parentSignature = 'form#login-form'
 * ```
 */
export function buildNodeAnchor(element: Element, nodeId?: string): NodeAnchor {
  const anchor: NodeAnchor = {};

  // 1. nodeId（如果提供）
  if (nodeId) {
    anchor.nodeId = nodeId;
  }

  // 2. CSS 选择器
  try {
    const selector = buildCssSelector(element);
    if (selector) {
      // 验证选择器有效性
      try {
        const matched = element.ownerDocument.querySelector(selector);
        if (matched === element) {
          anchor.cssSelector = selector;
        }
      } catch {
        // 选择器无法解析，跳过
      }
    }
  } catch {
    // 构建失败，跳过
  }

  // 3. XPath
  try {
    const xpath = buildXPath(element);
    if (xpath) {
      anchor.xpath = xpath;
    }
  } catch {
    // 构建失败，跳过
  }

  // 4. 文本引用 + 上下文
  try {
    const textQuote = getTextQuote(element, TEXT_QUOTE_MAX_LENGTH);
    if (textQuote) {
      anchor.textQuote = textQuote;

      const before = getTextContextBefore(element);
      if (before) {
        anchor.textContextBefore = before;
      }

      const after = getTextContextAfter(element);
      if (after) {
        anchor.textContextAfter = after;
      }
    }
  } catch {
    // 文本获取失败，跳过
  }

  // 5. 父节点签名
  try {
    const parentSig = buildParentSignature(element);
    if (parentSig) {
      anchor.parentSignature = parentSig;
    }
  } catch {
    // 签名构建失败，跳过
  }

  // 6. 兄弟节点签名
  try {
    const siblingSig = buildSiblingSignature(element);
    if (siblingSig) {
      anchor.siblingSignature = siblingSig;
    }
  } catch {
    // 签名构建失败，跳过
  }

  // 7. 边界矩形提示
  try {
    const rect = getNodeRect(element);
    if (rect.width > 0 || rect.height > 0) {
      anchor.rectHint = rect;
    }
  } catch {
    // 矩形获取失败，跳过
  }

  return anchor;
}

// ════════════════════════════════════════════════════════════════
// 公共 API：锚点解析（重定位）
// ════════════════════════════════════════════════════════════════

/**
 * 通过 nodeId 查找元素（在 Snapshot 标记的元素上查找 data 属性）。
 * 如果页面元素被标记了 data-snapshot-id，可据此查找。
 */
function resolveByNodeId(anchor: NodeAnchor, root: Element): Element | null {
  if (!anchor.nodeId) return null;

  // 尝试通过 data-snapshot-id 属性查找
  try {
    return root.querySelector(`[data-snapshot-id="${anchor.nodeId}"]`);
  } catch {
    return null;
  }
}

/**
 * 通过 CSS 选择器查找元素。
 */
function resolveByCssSelector(anchor: NodeAnchor, root: Element): Element | null {
  if (!anchor.cssSelector) return null;

  try {
    // 优先在 root 的 ownerDocument 上查找（支持 #id 选择器）
    const doc = root.ownerDocument;
    const el = doc.querySelector(anchor.cssSelector);
    // 确认找到的元素在 root 子树内
    if (el && root.contains(el)) {
      return el;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 通过 XPath 查找元素。
 */
function resolveByXPath(anchor: NodeAnchor, root: Element): Element | null {
  if (!anchor.xpath) return null;

  try {
    const doc = root.ownerDocument;
    const result = doc.evaluate(
      anchor.xpath,
      doc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    const node = result.singleNodeValue;
    if (node && node.nodeType === Node.ELEMENT_NODE && root.contains(node)) {
      return node as Element;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 通过文本引用 + 上下文查找元素。
 * 遍历 root 下所有元素，找到包含 textQuote 的元素。
 * 如果有 contextBefore/After，进一步验证上下文匹配。
 */
function resolveByTextQuote(anchor: NodeAnchor, root: Element): Element | null {
  if (!anchor.textQuote) return null;

  const quote = anchor.textQuote.replace(/\u2026$/, ''); // 去掉末尾省略号
  if (!quote) return null;

  // 使用 TreeWalker 遍历所有元素节点
  const walker = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    null,
  );

  let bestMatch: Element | null = null;
  let bestScore = 0;

  let node: Element | null = walker.currentNode as Element;
  while (node) {
    // 检查元素的直接文本内容
    let directText = '';
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE) {
        directText += child.textContent ?? '';
      }
    }
    directText = directText.trim();

    // 也检查完整文本
    const fullText = (node.textContent ?? '').trim();

    const containsInDirect = directText.includes(quote);
    const containsInFull = fullText.includes(quote);

    if (containsInDirect || containsInFull) {
      let score = containsInDirect ? 2 : 1;

      // 上下文匹配加分
      if (anchor.textContextBefore) {
        const ctxBefore = anchor.textContextBefore.replace(/^\u2026/, '');
        const prevText = getPreviousSiblingText(node);
        if (prevText.includes(ctxBefore)) {
          score += 2;
        }
      }

      if (anchor.textContextAfter) {
        const ctxAfter = anchor.textContextAfter.replace(/\u2026$/, '');
        const nextText = getNextSiblingText(node);
        if (nextText.includes(ctxAfter)) {
          score += 2;
        }
      }

      // 优先选择更具体的匹配（叶节点比容器节点更好）
      if (node.children.length === 0) {
        score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = node;
      }
    }

    node = walker.nextNode() as Element | null;
  }

  return bestMatch;
}

/**
 * 获取元素前面兄弟节点的文本（用于上下文验证）。
 */
function getPreviousSiblingText(el: Element): string {
  let text = '';
  let sibling = el.previousSibling;
  while (sibling && text.length < CONTEXT_LENGTH * 2) {
    text = (sibling.textContent ?? '').trim() + ' ' + text;
    sibling = sibling.previousSibling;
  }
  return text.trim();
}

/**
 * 获取元素后面兄弟节点的文本（用于上下文验证）。
 */
function getNextSiblingText(el: Element): string {
  let text = '';
  let sibling = el.nextSibling;
  while (sibling && text.length < CONTEXT_LENGTH * 2) {
    text = text + ' ' + (sibling.textContent ?? '').trim();
    sibling = sibling.nextSibling;
  }
  return text.trim();
}

/**
 * 通过父节点签名 + 兄弟签名查找元素。
 * 在 root 下找到匹配 parentSignature 的父元素，
 * 再在其子元素中用 siblingSignature 和标签过滤。
 */
function resolveByParentSignature(anchor: NodeAnchor, root: Element): Element | null {
  if (!anchor.parentSignature) return null;

  // 解析 parentSignature：tag#id.class1.class2
  const sigMatch = anchor.parentSignature.match(/^(\w+)(#[\w-]+)?((?:\.[\w-]+)*)$/);
  if (!sigMatch) return null;

  const pTag = sigMatch[1];
  const pId = sigMatch[2] ? sigMatch[2].slice(1) : null; // 去掉 #
  const pClasses = sigMatch[3]
    ? sigMatch[3].split('.').filter(Boolean)
    : [];

  // 查找匹配的父元素
  const candidates = root.querySelectorAll(pTag);
  const matchedParents: Element[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    // 验证 id
    if (pId && candidate.id !== pId) continue;
    // 验证 class
    let classMatch = true;
    for (const cls of pClasses) {
      if (!candidate.classList.contains(cls)) {
        classMatch = false;
        break;
      }
    }
    if (!classMatch) continue;
    matchedParents.push(candidate);
  }

  if (matchedParents.length === 0) return null;

  // 如果有 siblingSignature，解析 [prev_tag|next_tag]
  let prevTag = '';
  let nextTag = '';
  if (anchor.siblingSignature) {
    const sibMatch = anchor.siblingSignature.match(/^\[(\w*)\|(\w*)\]$/);
    if (sibMatch) {
      prevTag = sibMatch[1];
      nextTag = sibMatch[2];
    }
  }

  // 在每个匹配的父元素中查找子元素
  for (const parent of matchedParents) {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];

      // 如果有兄弟签名，验证前后兄弟
      if (prevTag || nextTag) {
        const prev = child.previousElementSibling;
        const next = child.nextElementSibling;

        if (prevTag && (!prev || prev.tagName.toLowerCase() !== prevTag)) continue;
        if (nextTag && (!next || next.tagName.toLowerCase() !== nextTag)) continue;

        return child;
      }

      // 无兄弟签名但有文本引用，用文本辅助过滤
      if (anchor.textQuote) {
        const text = (child.textContent ?? '').trim();
        const quote = anchor.textQuote.replace(/\u2026$/, '');
        if (text.includes(quote)) {
          return child;
        }
      }
    }

    // 如果没有更细的过滤条件，返回第一个子元素
    if (!prevTag && !nextTag && !anchor.textQuote && parent.children.length > 0) {
      return parent.children[0];
    }
  }

  return null;
}

/**
 * 通过 rectHint 查找距离最近的可见元素。
 * 遍历 root 下的所有元素，找到位置最接近 rectHint 的元素。
 */
function resolveByRectHint(anchor: NodeAnchor, root: Element): Element | null {
  if (!anchor.rectHint) return null;

  const hint = anchor.rectHint;
  let bestMatch: Element | null = null;
  let bestDistance = Infinity;

  const walker = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    null,
  );

  let node: Element | null = walker.currentNode as Element;
  while (node) {
    const rect = node.getBoundingClientRect();
    // 跳过零尺寸元素
    if (rect.width > 0 && rect.height > 0) {
      const dx = Math.abs(Math.round(rect.x) - hint.x);
      const dy = Math.abs(Math.round(rect.y) - hint.y);
      const dw = Math.abs(Math.round(rect.width) - hint.width);
      const dh = Math.abs(Math.round(rect.height) - hint.height);
      const distance = dx + dy + dw + dh;

      if (distance < bestDistance && distance < RECT_TOLERANCE * 4) {
        bestDistance = distance;
        bestMatch = node;
      }
    }
    node = walker.nextNode() as Element | null;
  }

  return bestMatch;
}

/**
 * 根据锚点信息在页面中重定位元素。
 *
 * 按优先级依次尝试多种定位策略：
 *   1. nodeId — 通过 data-snapshot-id 属性查找
 *   2. cssSelector — 精确 CSS 选择器
 *   3. xpath — XPath 路径
 *   4. textQuote + context — 文本片段匹配
 *   5. parentSignature + siblingSignature — 结构签名
 *   6. rectHint — 视觉位置最近邻
 *
 * 当高优先级策略成功时直接返回，无需尝试低优先级策略。
 * 每种策略返回的置信度不同（nodeId 最高，rectHint 最低）。
 *
 * @param anchor - 之前通过 buildNodeAnchor 构建的锚点信息
 * @param root - 搜索范围的根元素（通常为 document.body 或 document.documentElement）
 * @returns AnchorResolveResult（含元素、命中策略、置信度）或 null（所有策略均未匹配）
 *
 * @example
 * ```ts
 * const result = resolveAnchor(anchor, document.body);
 * if (result) {
 *   console.log(`Found via ${result.resolvedBy}, confidence: ${result.confidence}`);
 *   result.element.scrollIntoView();
 * }
 * ```
 */
export function resolveAnchor(
  anchor: NodeAnchor,
  root: Element,
): AnchorResolveResult | null {
  // 策略 1: nodeId
  const byNodeId = resolveByNodeId(anchor, root);
  if (byNodeId) {
    return { element: byNodeId, resolvedBy: 'nodeId', confidence: 1.0 };
  }

  // 策略 2: cssSelector
  const byCss = resolveByCssSelector(anchor, root);
  if (byCss) {
    return { element: byCss, resolvedBy: 'cssSelector', confidence: 0.95 };
  }

  // 策略 3: xpath
  const byXPath = resolveByXPath(anchor, root);
  if (byXPath) {
    return { element: byXPath, resolvedBy: 'xpath', confidence: 0.9 };
  }

  // 策略 4: textQuote + context
  const byText = resolveByTextQuote(anchor, root);
  if (byText) {
    // 如果有上下文匹配，置信度更高
    const hasContext = !!(anchor.textContextBefore || anchor.textContextAfter);
    return {
      element: byText,
      resolvedBy: 'textQuote',
      confidence: hasContext ? 0.8 : 0.65,
    };
  }

  // 策略 5: parentSignature + siblingSignature
  const byParent = resolveByParentSignature(anchor, root);
  if (byParent) {
    const hasSibling = !!anchor.siblingSignature;
    return {
      element: byParent,
      resolvedBy: 'parentSignature',
      confidence: hasSibling ? 0.6 : 0.45,
    };
  }

  // 策略 6: rectHint（最低优先级，仅作为兜底）
  const byRect = resolveByRectHint(anchor, root);
  if (byRect) {
    return { element: byRect, resolvedBy: 'rectHint', confidence: 0.3 };
  }

  // 所有策略均未匹配
  return null;
}
