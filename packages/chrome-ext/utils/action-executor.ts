// action-executor.ts — 浏览器操作执行引擎
// 定义 BrowserAction 接口与所有支持的 DOM 操作类型，
// 在 content script 上下文中执行 click/type/scroll/querySelector 等操作

import { buildDomSnapshot, type SnapshotOptions, type DomSnapshotNode } from './dom-snapshot';
import { buildNodeAnchor, type NodeAnchor } from './anchor-resolver';
import { imtRegistry } from './imt-registry';
import { immersiveOverlay } from './imt-overlay';

/** 支持的浏览器操作类型枚举 */
export type ActionType =
  | 'click'
  | 'type'
  | 'scroll'
  | 'navigate'
  | 'querySelector'
  | 'querySelectorAll'
  | 'getTextContent'
  | 'getAttribute'
  | 'getValue'
  | 'screenshot'
  | 'waitForElement'
  | 'highlight'
  | 'evaluate'
  | 'selectOption'
  | 'getLinks'
  | 'extractParagraphs'
  | 'injectBilingual'
  | 'getPageInfo'
  | 'compositeDownload'
  | 'domSnapshot';

/** 滚动模式 */
export type ScrollMode = 'to-top' | 'to-bottom' | 'by-pixels' | 'to-element';

/** 浏览器操作请求 */
export interface BrowserAction {
  /** 操作类型 */
  type: ActionType;
  /** CSS 选择器，定位目标元素 */
  selector?: string;
  /** 文本匹配过滤（click 时可选，用于从多个匹配中筛选含指定文本的元素） */
  text?: string;
  /** type 操作要输入的文本 */
  value?: string;
  /** scroll 操作的模式 */
  scrollMode?: ScrollMode;
  /** scroll by-pixels 模式的像素数（正数向下，负数向上） */
  scrollPixels?: number;
  /** getAttribute 要获取的属性名 */
  attributeName?: string;
  /** navigate 操作的目标 URL */
  url?: string;
  /** waitForElement 的超时毫秒数（默认 5000） */
  timeout?: number;
  /** highlight 高亮颜色（默认 rgba(255, 165, 0, 0.4)） */
  highlightColor?: string;
  /** highlight 持续时间毫秒数（默认 2000） */
  highlightDuration?: number;
  /** evaluate 操作要执行的 JavaScript 表达式 */
  expression?: string;
  /** selectOption 操作要选择的 option value 属性 */
  optionValue?: string;
  /** selectOption 操作要选择的 option 可见文本 */
  optionText?: string;
  /** getLinks / querySelectorAll 返回的最大元素数 */
  maxCount?: number;
  /** extractParagraphs 的范围选择器 */
  scopeSelector?: string;
  /** injectBilingual 的操作模式: inject / toggle / clear */
  injectMode?: 'inject' | 'toggle' | 'clear';
  /** injectBilingual inject 模式的翻译数据（JSON 字符串） */
  translations?: string;
  /** compositeDownload: base64 截图数组的 JSON 字符串（每项为 data:image/png;base64,... 格式） */
  screenshots?: string;
  /** compositeDownload: 下载文件名（默认 composite-screenshot.png） */
  fileName?: string;
  /** domSnapshot: DOM 树最大遍历深度（默认 12） */
  maxDepth?: number;
  /** domSnapshot: 快照中包含的最大节点数（默认 3000） */
  maxNodes?: number;
  /** domSnapshot: 是否采集节点边界矩形（默认 true） */
  includeRect?: boolean;
  /** domSnapshot: 是否采集不可见节点（默认 false） */
  includeHidden?: boolean;
  /** domSnapshot: 文本预览最大字符数（默认 120） */
  textPreviewMaxLength?: number;
}

/** 操作执行结果 */
export interface ActionResult {
  /** 是否成功 */
  success: boolean;
  /** 返回数据（根据操作类型不同而不同） */
  data?: unknown;
  /** 失败时的错误信息 */
  error?: string;
}

/** querySelector 返回的元素信息 */
export interface ElementInfo {
  tagName: string;
  id: string;
  className: string;
  textContent: string;
  href?: string;
  src?: string;
  value?: string;
  type?: string;
  placeholder?: string;
}

/**
 * 从 DOM 元素提取关键属性信息
 */
function extractElementInfo(el: Element): ElementInfo {
  const htmlEl = el as HTMLElement;
  const inputEl = el as HTMLInputElement;
  const anchorEl = el as HTMLAnchorElement;
  const imgEl = el as HTMLImageElement;

  return {
    tagName: el.tagName.toLowerCase(),
    id: el.id || '',
    className: el.className || '',
    textContent: (htmlEl.textContent || '').trim().slice(0, 500),
    ...(anchorEl.href ? { href: anchorEl.href } : {}),
    ...(imgEl.src ? { src: imgEl.src } : {}),
    ...(inputEl.value !== undefined && inputEl.value !== '' ? { value: inputEl.value } : {}),
    ...(inputEl.type ? { type: inputEl.type } : {}),
    ...(inputEl.placeholder ? { placeholder: inputEl.placeholder } : {}),
  };
}

/**
 * 根据 selector 和可选 text 过滤定位元素
 */
function findElement(selector: string, text?: string): Element | null {
  if (text) {
    // 找到所有匹配 selector 的元素，再按 textContent 筛选
    const candidates = document.querySelectorAll(selector);
    for (const el of candidates) {
      if ((el as HTMLElement).textContent?.includes(text)) {
        return el;
      }
    }
    return null;
  }
  return document.querySelector(selector);
}

/**
 * 执行 click 操作
 * 支持 CSS selector 定位 + 可选的文本匹配过滤
 */
function executeClick(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'click 操作需要 selector 参数' };
  }
  const el = findElement(action.selector, action.text);
  if (!el) {
    return { success: false, error: `未找到元素: ${action.selector}${action.text ? ` (text: "${action.text}")` : ''}` };
  }
  (el as HTMLElement).click();
  return { success: true, data: { clicked: action.selector } };
}

/**
 * 执行 type 操作
 * focus → 清空 → 逐字输入 → 触发 input/change 事件
 */
function executeType(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'type 操作需要 selector 参数' };
  }
  if (action.value === undefined) {
    return { success: false, error: 'type 操作需要 value 参数' };
  }
  const el = findElement(action.selector) as HTMLInputElement | HTMLTextAreaElement | null;
  if (!el) {
    return { success: false, error: `未找到元素: ${action.selector}` };
  }

  // focus
  el.focus();

  // 清空现有值
  el.value = '';
  el.dispatchEvent(new Event('input', { bubbles: true }));

  // 设置新值
  // 使用 native input setter 以确保 React 受控组件也能正确更新
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(el),
    'value',
  )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(el, action.value);
  } else {
    el.value = action.value;
  }

  // 触发事件
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));

  return { success: true, data: { typed: action.value, selector: action.selector } };
}

/**
 * 执行 scroll 操作
 * 支持 to-top / to-bottom / by-pixels / to-element 四种模式
 */
function executeScroll(action: BrowserAction): ActionResult {
  const mode = action.scrollMode || 'by-pixels';

  switch (mode) {
    case 'to-top':
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return { success: true, data: { scrolled: 'to-top' } };

    case 'to-bottom':
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return { success: true, data: { scrolled: 'to-bottom' } };

    case 'by-pixels': {
      const pixels = action.scrollPixels || 300;
      window.scrollBy({ top: pixels, behavior: 'smooth' });
      return { success: true, data: { scrolled: 'by-pixels', pixels } };
    }

    case 'to-element': {
      if (!action.selector) {
        return { success: false, error: 'scroll to-element 模式需要 selector 参数' };
      }
      const el = document.querySelector(action.selector);
      if (!el) {
        return { success: false, error: `未找到元素: ${action.selector}` };
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return { success: true, data: { scrolled: 'to-element', selector: action.selector } };
    }

    default:
      return { success: false, error: `不支持的滚动模式: ${mode}` };
  }
}

/**
 * 执行 querySelector 操作
 * 返回匹配元素的 tagName/id/className/textContent/href/src 等属性
 */
function executeQuerySelector(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'querySelector 操作需要 selector 参数' };
  }
  const el = document.querySelector(action.selector);
  if (!el) {
    return { success: false, error: `未找到元素: ${action.selector}` };
  }
  return { success: true, data: extractElementInfo(el) };
}

/**
 * 执行 querySelectorAll 操作
 * 返回所有匹配元素的属性数组
 */
function executeQuerySelectorAll(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'querySelectorAll 操作需要 selector 参数' };
  }
  const elements = document.querySelectorAll(action.selector);
  const results: ElementInfo[] = [];
  // 最多返回 maxCount 个元素（默认 50），防止数据过大
  const limit = Math.min(elements.length, action.maxCount || 50);
  for (let i = 0; i < limit; i++) {
    results.push(extractElementInfo(elements[i]));
  }
  return { success: true, data: { count: elements.length, elements: results } };
}

/**
 * 执行 getTextContent 操作
 */
function executeGetTextContent(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'getTextContent 操作需要 selector 参数' };
  }
  const el = document.querySelector(action.selector);
  if (!el) {
    return { success: false, error: `未找到元素: ${action.selector}` };
  }
  return { success: true, data: { textContent: (el as HTMLElement).textContent?.trim() || '' } };
}

/**
 * 执行 getAttribute 操作
 */
function executeGetAttribute(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'getAttribute 操作需要 selector 参数' };
  }
  if (!action.attributeName) {
    return { success: false, error: 'getAttribute 操作需要 attributeName 参数' };
  }
  const el = document.querySelector(action.selector);
  if (!el) {
    return { success: false, error: `未找到元素: ${action.selector}` };
  }
  return { success: true, data: { attribute: action.attributeName, value: el.getAttribute(action.attributeName) } };
}

/**
 * 执行 getValue 操作
 */
function executeGetValue(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'getValue 操作需要 selector 参数' };
  }
  const el = document.querySelector(action.selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  if (!el) {
    return { success: false, error: `未找到元素: ${action.selector}` };
  }
  return { success: true, data: { value: el.value || '' } };
}

/**
 * 执行 waitForElement 操作
 * 使用 MutationObserver 等待元素出现
 */
async function executeWaitForElement(action: BrowserAction): Promise<ActionResult> {
  if (!action.selector) {
    return { success: false, error: 'waitForElement 操作需要 selector 参数' };
  }

  const timeout = action.timeout || 5000;

  // 先检查元素是否已存在
  const existing = document.querySelector(action.selector);
  if (existing) {
    return { success: true, data: extractElementInfo(existing) };
  }

  return new Promise<ActionResult>((resolve) => {
    let resolved = false;

    const observer = new MutationObserver(() => {
      const el = document.querySelector(action.selector!);
      if (el && !resolved) {
        resolved = true;
        observer.disconnect();
        resolve({ success: true, data: extractElementInfo(el) });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 超时处理
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        observer.disconnect();
        resolve({ success: false, error: `等待元素超时 (${timeout}ms): ${action.selector}` });
      }
    }, timeout);
  });
}

/**
 * 执行 highlight 操作
 * 为目标元素添加临时高亮边框
 */
function executeHighlight(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'highlight 操作需要 selector 参数' };
  }
  const el = document.querySelector(action.selector) as HTMLElement | null;
  if (!el) {
    return { success: false, error: `未找到元素: ${action.selector}` };
  }

  const color = action.highlightColor || 'rgba(255, 165, 0, 0.4)';
  const duration = action.highlightDuration || 2000;

  // 保存原有样式
  const originalOutline = el.style.outline;
  const originalBgColor = el.style.backgroundColor;

  // 应用高亮
  el.style.outline = `3px solid ${color}`;
  el.style.backgroundColor = color;

  // 定时恢复
  setTimeout(() => {
    el.style.outline = originalOutline;
    el.style.backgroundColor = originalBgColor;
  }, duration);

  return { success: true, data: { highlighted: action.selector, duration } };
}

/**
 * 执行 evaluate 操作
 * 在页面上下文中执行任意 JavaScript 代码并返回结果
 */
async function executeEvaluate(action: BrowserAction): Promise<ActionResult> {
  if (!action.expression) {
    return { success: false, error: 'evaluate 操作需要 expression 参数' };
  }
  try {
    // 使用 new Function 以便支持 return 语句
    // eslint-disable-next-line no-new-func
    const fn = new Function(action.expression);
    const result = await fn();
    // 安全序列化：undefined → null，其余 JSON 化
    const serialized = result === undefined ? null : JSON.parse(JSON.stringify(result));
    return { success: true, data: { result: serialized } };
  } catch (err) {
    return {
      success: false,
      error: `evaluate 执行失败: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * 执行 selectOption 操作
 * 通过 value 或 text 选择 <select> 下拉框选项，触发 change 事件
 */
function executeSelectOption(action: BrowserAction): ActionResult {
  if (!action.selector) {
    return { success: false, error: 'selectOption 操作需要 selector 参数' };
  }
  const el = document.querySelector(action.selector) as HTMLSelectElement | null;
  if (!el) {
    return { success: false, error: `未找到元素: ${action.selector}` };
  }
  if (el.tagName.toLowerCase() !== 'select') {
    return { success: false, error: `目标元素不是 <select>，而是 <${el.tagName.toLowerCase()}>` };
  }

  let matched = false;
  const options = el.options;

  if (action.optionValue !== undefined) {
    // 按 value 匹配
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === action.optionValue) {
        el.selectedIndex = i;
        matched = true;
        break;
      }
    }
  } else if (action.optionText !== undefined) {
    // 按可见文本匹配
    for (let i = 0; i < options.length; i++) {
      if (options[i].text.trim() === action.optionText.trim()) {
        el.selectedIndex = i;
        matched = true;
        break;
      }
    }
  } else {
    return { success: false, error: 'selectOption 需要 optionValue 或 optionText 参数' };
  }

  if (!matched) {
    return {
      success: false,
      error: `未找到匹配的选项: ${action.optionValue !== undefined ? `value="${action.optionValue}"` : `text="${action.optionText}"`}`,
    };
  }

  // 触发 change 事件
  el.dispatchEvent(new Event('change', { bubbles: true }));

  const selected = options[el.selectedIndex];
  return {
    success: true,
    data: {
      selectedIndex: el.selectedIndex,
      selectedValue: selected.value,
      selectedText: selected.text.trim(),
    },
  };
}

/**
 * 执行 getLinks 操作
 * 提取页面中所有含 href 的 <a> 元素，返回 { href, text } 数组
 */
function executeGetLinks(action: BrowserAction): ActionResult {
  const maxCount = action.maxCount || 100;
  const scope = action.selector
    ? document.querySelector(action.selector)
    : document;

  if (action.selector && !scope) {
    return { success: false, error: `未找到范围元素: ${action.selector}` };
  }

  const anchors = (scope || document).querySelectorAll('a[href]');
  const links: Array<{ href: string; text: string }> = [];
  const limit = Math.min(anchors.length, maxCount);

  for (let i = 0; i < limit; i++) {
    const a = anchors[i] as HTMLAnchorElement;
    links.push({
      href: a.href,
      text: (a.textContent || '').trim().slice(0, 200),
    });
  }

  return {
    success: true,
    data: { totalFound: anchors.length, returned: links.length, links },
  };
}

// ── evo_v19_001: 沉浸式翻译 — 段落提取 + 双语注入 ──

/** 需要跳过的标签（导航、脚本、样式、广告等） */
const IMT_SKIP_TAGS = new Set([
  'script', 'style', 'noscript', 'iframe', 'svg', 'canvas',
  'nav', 'footer', 'header', 'aside', 'form', 'button',
  'input', 'textarea', 'select', 'label',
]);

/** 内容段落标签 */
const IMT_PARAGRAPH_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'li', 'blockquote', 'td', 'th', 'dt', 'dd',
  'figcaption', 'caption', 'summary', 'pre',
]);

/**
 * 行内文本叶节点标签 — 智能叶节点提取(inline leaf extraction)
 * 当段落级容器(如 <td>)内含这些行内元素时，优先提取叶节点而非整个容器
 * 适用于 HN titleline <a> 等场景，提取粒度从 <td> 降到 <a>/<span> 级别
 */
const IMT_INLINE_LEAF_TAGS = new Set([
  'a', 'span', 'em', 'strong', 'b', 'i', 'mark', 'code', 'label', 'time',
]);

/**
 * 自动检测页面主内容区域
 * 优先级: article > main > [role="main"] > 表格布局(itemlist) > .content/.post/.article > body
 *
 * 表格布局支持：HN 等站点使用 table.itemlist 作为内容容器，
 * 需要显式识别才能正确进入表格内部提取
 */
function detectMainContent(): Element {
  const candidates = [
    'article',
    'main',
    '[role="main"]',
    // 表格布局支持：HN itemlist 等使用 <table> 作为内容容器的站点
    'table.itemlist',
    '#hnmain',
    '.itemlist',
    '.content',
    '.post',
    '.article',
    '.post-content',
    '.entry-content',
    '.article-content',
    '#content',
  ];
  for (const sel of candidates) {
    const el = document.querySelector(sel);
    if (el && el.textContent && el.textContent.trim().length > 100) {
      return el;
    }
  }
  return document.body;
}

/**
 * 智能叶节点提取(leaf node extraction)：从段落容器中提取有意义的行内文本元素
 *
 * 当段落容器(如 <td>)内含 <a>/<span> 等行内元素时，提取最深层的叶节点，
 * 而非整个容器文本。例如 HN 的 <td class="title"> 内的 <a class="titleline">。
 *
 * 仅对表格单元格(<td>/<th>)自动启用；对 <p>/<li> 等普通段落保持整段提取。
 */
function extractInlineLeafNodes(container: Element): Element[] {
  const containerTag = container.tagName.toLowerCase();

  // 仅对表格单元格启用智能叶节点提取，普通段落保持整段
  if (containerTag !== 'td' && containerTag !== 'th') {
    return [];
  }

  const selectorStr = Array.from(IMT_INLINE_LEAF_TAGS).join(',');
  const inlineEls = container.querySelectorAll(selectorStr);
  const leaves: Element[] = [];

  for (const el of inlineEls) {
    const text = (el.textContent || '').trim();
    if (text.length < 2) { continue; }
    if (el.closest('.imt-overlay-item')) { continue; }

    // 检查是否为真正的叶节点：不含有实质文本的子行内元素
    const childInlines = el.querySelectorAll(selectorStr);
    let hasTextChild = false;
    for (const child of childInlines) {
      if ((child.textContent || '').trim().length >= 2) {
        hasTextChild = true;
        break;
      }
    }

    // 只收集叶节点（无有意义子行内元素的）
    if (!hasTextChild) {
      leaves.push(el);
    }
  }

  return leaves;
}

/**
 * 执行 extractParagraphs 操作
 * 智能提取页面段落，使用 ImtElementRegistry 内存注册表存储 id↔element 映射，
 * 零 DOM 属性篡改，返回结构化数据 { id, tag, text }[]
 */
function executeExtractParagraphs(action: BrowserAction): ActionResult {
  const scope = action.scopeSelector
    ? document.querySelector(action.scopeSelector)
    : detectMainContent();

  if (!scope) {
    return { success: false, error: `未找到范围元素: ${action.scopeSelector}` };
  }

  const maxCount = action.maxCount || 200;
  const paragraphs: Array<{ id: string; tag: string; text: string }> = [];
  let idCounter = 0;

  // 递归遍历 DOM 树，提取内容段落
  // 智能叶节点提取：对表格单元格(<td>/<th>)优先提取内部 <a>/<span> 等行内元素
  function walk(node: Element): void {
    if (paragraphs.length >= maxCount) { return; }

    const tag = node.tagName.toLowerCase();

    // 跳过不相关的标签
    if (IMT_SKIP_TAGS.has(tag)) { return; }

    // 跳过隐藏元素
    if (node instanceof HTMLElement) {
      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') { return; }
    }

    // 跳过 Overlay 容器及其子元素（翻译渲染在独立层，不参与段落提取）
    if (node.id === 'imt-overlay-container' || node.classList.contains('imt-overlay-item')) { return; }

    // 如果是段落级标签且有有效文本内容
    if (IMT_PARAGRAPH_TAGS.has(tag)) {
      const text = (node.textContent || '').trim();
      // 跳过空段落和极短段落（少于2字符）
      if (text.length >= 2) {
        // ── 智能叶节点提取 ──
        // 对表格单元格(<td>/<th>)，优先提取内部的行内文本叶节点(<a>/<span>等)
        // 例如 HN 的 titleline <a> 标题链接，而非整个 <td> 单元格文本
        const leafNodes = extractInlineLeafNodes(node);
        if (leafNodes.length > 0) {
          for (const leaf of leafNodes) {
            if (paragraphs.length >= maxCount) { break; }
            const leafText = (leaf.textContent || '').trim();
            if (leafText.length >= 2) {
              const id = `imt-${idCounter++}`;
              imtRegistry.register(id, leaf);
              paragraphs.push({
                id,
                tag: leaf.tagName.toLowerCase(),
                text: leafText.slice(0, 2000),
              });
            }
          }
          return; // 叶节点已提取，不再整段提取
        }

        // 无叶节点 → 整段提取（原逻辑）
        const id = `imt-${idCounter++}`;
        imtRegistry.register(id, node);
        paragraphs.push({ id, tag, text: text.slice(0, 2000) });
      }
      return; // 不再向下递归，避免重复提取
    }

    // 非段落级标签 → 继续向下遍历子元素
    for (let i = 0; i < node.children.length; i++) {
      walk(node.children[i]);
    }
  }

  walk(scope as Element);

  return {
    success: true,
    data: {
      totalExtracted: paragraphs.length,
      scope: action.scopeSelector || '(auto-detected)',
      paragraphs,
    },
  };
}

// evo_v33_004: 旧的 DOM 兄弟插入函数和样式注入已移除
// 翻译渲染由 ImmersiveOverlay 绝对定位层全权负责，零原始 DOM 篡改

/**
 * 执行 injectBilingual 操作
 * 支持三种模式: inject（注入翻译）/ toggle（切换显示/隐藏）/ clear（清除所有翻译）
 */
function executeInjectBilingual(action: BrowserAction): ActionResult {
  const mode = action.injectMode || 'inject';

  switch (mode) {
    case 'inject': {
      if (!action.translations) {
        return { success: false, error: 'inject 模式需要 translations 参数（JSON 字符串）' };
      }

      let items: Array<{ id: string; translated: string }>;
      try {
        let parsed = JSON.parse(action.translations);

        // 防御性自动解包：当 translations 为 {translations:[...]} 包装对象时自动提取数组
        if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
          // 检测 .translations 属性是否为 Array，是则自动解包
          const inner = (parsed as Record<string, unknown>).translations;
          if (inner && Array.isArray(inner)) { parsed = inner; }
        }

        if (!Array.isArray(parsed)) {
          return { success: false, error: 'translations 必须是数组或 {translations:[...]} 包装对象' };
        }

        // 支持 string[] 平坦数组：自动按索引与 data-imt-id 元素配对
        // 例如 ["str1","str2"] → [{id:"imt-0",translated:"str1"},{id:"imt-1",translated:"str2"}]
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          items = (parsed as string[]).map((text, idx) => ({
            id: `imt-${idx}`,
            translated: text,
          }));
        } else {
          items = parsed;
        }
      } catch {
        return { success: false, error: 'translations 参数 JSON 解析失败' };
      }

      // ── evo_v33_004: Overlay 注入 — 翻译渲染在独立绝对定位层，不篡改原始 DOM ──

      // ── 注册表空时自动重建（SPA 重渲染 / tab 切换导致注册表与 DOM 不同步） ──
      let autoRemarkDone = false;
      const existingRegistered = imtRegistry.size;
      if (existingRegistered === 0 && items.length > 0) {
        console.log('[imt] 自动重建注册表：ImtElementRegistry 为空，重新提取段落并注册');
        const reExtractResult = executeExtractParagraphs({ type: 'extractParagraphs' });
        if (reExtractResult.success && reExtractResult.data) {
          const reData = reExtractResult.data as { totalExtracted: number; paragraphs: Array<{ id: string; tag: string; text: string }> };
          console.log(`[imt] 注册表重建完成：注册了 ${reData.totalExtracted} 个段落`);
          autoRemarkDone = true;

          // ID 重映射：重建后 items 中的旧 ID 可能与新注册的 ID 不一致，
          // 按索引将 items[i].id 重映射为 reData.paragraphs[i].id。
          const newParagraphs = reData.paragraphs;
          for (let i = 0; i < items.length && i < newParagraphs.length; i++) {
            const oldId = items[i].id;
            const newId = newParagraphs[i].id;
            if (oldId !== newId) {
              items[i].id = newId;
            }
          }
          console.log(`[imt] ID 重映射完成：${Math.min(items.length, newParagraphs.length)} 项已对齐`);
        } else {
          console.warn('[imt] 注册表重建失败：', reExtractResult.error);
        }
      }

      // 确保 Overlay 容器已创建
      immersiveOverlay.createOverlay();

      let injected = 0;
      let skipped = 0;

      for (const item of items) {
        if (!item.id || !item.translated) {
          skipped++;
          continue;
        }

        // 通过 ImtElementRegistry 查找原始元素
        const original = imtRegistry.get(item.id);
        if (!original) {
          skipped++;
          continue;
        }

        // 使用 ImmersiveOverlay.addTranslation() 在 Overlay 层创建翻译元素
        // addTranslation 内置去重逻辑：已存在同 id 条目时自动更新文本
        const overlayEl = immersiveOverlay.addTranslation(item.id, item.translated, original);
        if (overlayEl) {
          injected++;
        } else {
          skipped++;
        }
      }

      // ── 注入结果诊断增强 ──
      // injected=0 且 skipped>0 时附加诊断信息，帮助用户/Agent 理解失败原因
      let diagnostic: { possibleCauses: string[]; suggestedActions: string[] } | undefined;
      if (injected === 0 && skipped > 0) {
        const possibleCauses: string[] = [];
        const suggestedActions: string[] = [];

        if (autoRemarkDone) {
          possibleCauses.push(
            '自动重建注册表已执行，但翻译数据与当前页面段落无法匹配（页面内容可能已发生变化）',
          );
          suggestedActions.push('重新执行完整翻译流程（extractParagraphs → translate → injectBilingual）');
        } else {
          const registeredCount = imtRegistry.size;
          if (registeredCount > 0) {
            possibleCauses.push(
              `注册表存在 ${registeredCount} 个已注册段落，但翻译数据中的 id/translated 字段可能缺失或格式不正确`,
            );
            suggestedActions.push('检查 translations 数据格式：每项需包含 { id: "imt-N", translated: "翻译文本" }');
          } else {
            possibleCauses.push('Tab 切换导致工具执行到了不同页面，注册表为空');
            possibleCauses.push('SPA 页面重渲染导致之前注册的 DOM 节点已失效');
            suggestedActions.push('确保翻译期间不要切换浏览器标签页');
            suggestedActions.push('重新执行完整翻译流程（extractParagraphs → translate → injectBilingual）');
          }
        }

        diagnostic = { possibleCauses, suggestedActions };
        console.warn('[imt] 诊断：注入数为 0', diagnostic);
      }

      return {
        success: true,
        data: {
          mode: 'inject',
          injected,
          skipped,
          total: items.length,
          ...(autoRemarkDone ? { autoRemarkDone: true } : {}),
          ...(diagnostic ? { diagnostic } : {}),
        },
      };
    }

    case 'toggle': {
      // ── evo_v33_004: 使用 ImmersiveOverlay.toggleAll() 切换可见性 ──
      const overlaySize = immersiveOverlay.size;
      if (overlaySize === 0) {
        return { success: true, data: { mode: 'toggle', message: '没有已注入的翻译', toggled: 0 } };
      }

      const isVisible = immersiveOverlay.toggleAll();

      return {
        success: true,
        data: {
          mode: 'toggle',
          newState: isVisible ? 'visible' : 'hidden',
          toggled: overlaySize,
        },
      };
    }

    case 'clear': {
      // ── evo_v33_004: 使用 ImmersiveOverlay.removeAll() + ImtElementRegistry.clear() ──
      const overlayCount = immersiveOverlay.size;
      const registryCount = imtRegistry.size;

      // 销毁 Overlay 容器及所有翻译元素（含 ResizeObserver / scroll 监听器）
      immersiveOverlay.removeAll();

      // 清除内存注册表
      imtRegistry.clear();

      return {
        success: true,
        data: {
          mode: 'clear',
          removed: overlayCount,
          registryCleared: registryCount,
        },
      };
    }

    default:
      return { success: false, error: `不支持的 injectBilingual 模式: ${mode}` };
  }
}

// ── evo_v28_003: 截图合成下载 — Canvas 纵向拼接 + Blob 下载 ──

/**
 * compositeScreenshots — 将多张 base64 截图纵向拼接成一张长图并触发浏览器下载
 *
 * 实现思路：
 * 1. 将每张 base64 data URL 加载为 Image 对象
 * 2. 计算合成画布尺寸：宽度取最大值，高度为所有图片高度之和
 * 3. 使用 OffscreenCanvas（降级 Canvas）纵向绘制所有图片
 * 4. 导出为 Blob → 创建 Object URL → <a download> 触发浏览器下载
 * 5. 下载后清理临时 URL
 */
async function executeCompositeDownload(action: BrowserAction): Promise<ActionResult> {
  const raw = action.screenshots;
  if (!raw) {
    return { success: false, error: 'compositeDownload 需要 screenshots 参数（base64 data URL 数组的 JSON 字符串）' };
  }

  // 支持 JSON 字符串或已解析的数组（防御性处理）
  let screenshots: string[];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { success: false, error: 'screenshots 必须是非空数组' };
    }
    screenshots = parsed as string[];
  } catch {
    return { success: false, error: 'screenshots 参数 JSON 解析失败' };
  }

  const fileName = action.fileName || 'composite-screenshot.png';

  try {
    // 1. 并行加载所有 base64 图片为 Image 对象
    const images = await Promise.all(
      screenshots.map((src) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`图片加载失败: ${src.slice(0, 60)}...`));
          img.src = src;
        });
      }),
    );

    // 2. 计算合成画布尺寸
    const maxWidth = Math.max(...images.map((img) => img.naturalWidth));
    const totalHeight = images.reduce((sum, img) => sum + img.naturalHeight, 0);

    if (maxWidth <= 0 || totalHeight <= 0) {
      return { success: false, error: '图片尺寸无效（宽或高为 0）' };
    }

    // 3. 创建 Canvas 并纵向绘制
    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { success: false, error: '无法创建 Canvas 2D 上下文' };
    }

    // 白色背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, maxWidth, totalHeight);

    let yOffset = 0;
    for (const img of images) {
      // 每张图片左对齐绘制，宽度不足 maxWidth 的部分保持白色背景
      ctx.drawImage(img, 0, yOffset, img.naturalWidth, img.naturalHeight);
      yOffset += img.naturalHeight;
    }

    // 4. Canvas → Blob → 触发下载
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) {
          resolve(b);
        } else {
          reject(new Error('Canvas toBlob 失败'));
        }
      }, 'image/png');
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 1000);

    return {
      success: true,
      data: {
        fileName,
        imageCount: images.length,
        width: maxWidth,
        height: totalHeight,
        fileSizeBytes: blob.size,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: `截图合成失败: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * 主执行入口 — 根据 action.type 分发到对应执行函数
 *
 * 注意：screenshot 操作需要在 background script 中使用 chrome.tabs.captureVisibleTab，
 * content script 无法执行此操作，返回特殊标记由 background 处理。
 */
/**
 * 执行 getPageInfo 操作 — CSP 安全的页面度量工具
 * 直接读取 DOM 属性获取页面尺寸、滚动位置、URL、标题等信息，
 * 不依赖 eval / new Function，在 CSP 严格页面上可正常调用。
 */
function executeGetPageInfo(): ActionResult {
  const docEl = document.documentElement;
  return {
    success: true,
    data: {
      url: window.location.href,
      title: document.title,
      scrollHeight: docEl.scrollHeight,
      scrollWidth: docEl.scrollWidth,
      clientHeight: docEl.clientHeight,
      clientWidth: docEl.clientWidth,
      scrollTop: window.scrollY || window.pageYOffset || 0,
      scrollLeft: window.scrollX || window.pageXOffset || 0,
      // 计算总屏数（向上取整），方便 batch_screenshot 等 Skill 使用
      totalScreens: Math.ceil(docEl.scrollHeight / (docEl.clientHeight || 1)),
      // 文档就绪状态
      readyState: document.readyState,
    },
  };
}

// ── evo_v32_004: DOM Snapshot 工具 ──

/**
 * 从 DomSnapshotNode 树中收集可交互节点的 selectorHint + nodeId，
 * 用于后续构建稳定锚点。最多收集 maxAnchors 个。
 */
function collectInteractiveNodes(
  node: DomSnapshotNode,
  result: Array<{ nodeId: string; selectorHint: string }>,
  maxAnchors: number,
): void {
  if (result.length >= maxAnchors) return;

  if (node.interactive && node.selectorHint) {
    result.push({ nodeId: node.nodeId, selectorHint: node.selectorHint });
  }

  if (node.children) {
    for (const child of node.children) {
      if (result.length >= maxAnchors) break;
      collectInteractiveNodes(child, result, maxAnchors);
    }
  }
}

/**
 * 执行 domSnapshot 操作
 * 调用 buildDomSnapshot 采集结构化 DOM 快照树，
 * 调用 buildNodeAnchor 为可交互节点构建稳定多路锚点，
 * 返回紧凑的 DomSnapshotNode 树 + 锚点映射供 Agent 消费。
 */
function executeDomSnapshot(action: BrowserAction): ActionResult {
  try {
    const options: SnapshotOptions = {};
    if (action.scopeSelector !== undefined) { options.scopeSelector = action.scopeSelector; }
    if (action.maxDepth !== undefined) { options.maxDepth = action.maxDepth; }
    if (action.maxNodes !== undefined) { options.maxNodes = action.maxNodes; }
    if (action.includeRect !== undefined) { options.includeRect = action.includeRect; }
    if (action.includeHidden !== undefined) { options.includeHidden = action.includeHidden; }
    if (action.textPreviewMaxLength !== undefined) { options.textPreviewMaxLength = action.textPreviewMaxLength; }

    const root = action.scopeSelector
      ? document.querySelector(action.scopeSelector) || document.body
      : document.body;

    const snapshot = buildDomSnapshot(root, options);

    if (!snapshot) {
      return {
        success: false,
        error: `DOM Snapshot 采集失败${action.scopeSelector ? `（scopeSelector "${action.scopeSelector}" 未匹配到可见元素）` : ''}`,
      };
    }

    // ── 构建稳定锚点：为可交互节点生成多路定位信息 ──
    // 收集快照中的可交互节点，通过 selectorHint 定位回 DOM 元素，
    // 调用 buildNodeAnchor 构建稳定多路锚点，供后续操作复用。
    const interactiveNodes: Array<{ nodeId: string; selectorHint: string }> = [];
    const MAX_ANCHORS = 50; // 限制锚点数量，避免大页面性能问题
    collectInteractiveNodes(snapshot, interactiveNodes, MAX_ANCHORS);

    const anchors: Record<string, NodeAnchor> = {};
    for (const { nodeId, selectorHint } of interactiveNodes) {
      try {
        const el = document.querySelector(selectorHint);
        if (el) {
          anchors[nodeId] = buildNodeAnchor(el, nodeId);
        }
      } catch {
        // 选择器匹配失败，跳过该节点的锚点构建
      }
    }

    return {
      success: true,
      data: {
        snapshot,
        anchors,
        anchorCount: Object.keys(anchors).length,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: `domSnapshot 执行失败: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function executeAction(action: BrowserAction): Promise<ActionResult> {
  try {
    switch (action.type) {
      case 'click':
        return executeClick(action);

      case 'type':
        return executeType(action);

      case 'scroll':
        return executeScroll(action);

      case 'navigate':
        // navigate 在 content script 中通过 location.href 实现
        if (!action.url) {
          return { success: false, error: 'navigate 操作需要 url 参数' };
        }
        window.location.href = action.url;
        return { success: true, data: { navigated: action.url } };

      case 'querySelector':
        return executeQuerySelector(action);

      case 'querySelectorAll':
        return executeQuerySelectorAll(action);

      case 'getTextContent':
        return executeGetTextContent(action);

      case 'getAttribute':
        return executeGetAttribute(action);

      case 'getValue':
        return executeGetValue(action);

      case 'screenshot':
        // screenshot 需要 background script 权限，content script 返回特殊标记
        return { success: false, error: '__SCREENSHOT_NEEDS_BACKGROUND__' };

      case 'waitForElement':
        return executeWaitForElement(action);

      case 'highlight':
        return executeHighlight(action);

      case 'evaluate':
        return executeEvaluate(action);

      case 'selectOption':
        return executeSelectOption(action);

      case 'getLinks':
        return executeGetLinks(action);

      // ── evo_v19_001: 沉浸式翻译工具 ──
      case 'extractParagraphs':
        return executeExtractParagraphs(action);

      case 'injectBilingual':
        return executeInjectBilingual(action);

      // ── evo_v28_001: CSP 安全的页面度量工具 ──
      case 'getPageInfo':
        return executeGetPageInfo();

      // ── evo_v28_003: 截图合成下载 ──
      case 'compositeDownload':
        return executeCompositeDownload(action);

      // ── evo_v32_004: 结构化 DOM Snapshot ──
      case 'domSnapshot':
        return executeDomSnapshot(action);

      default:
        return { success: false, error: `不支持的操作类型: ${(action as BrowserAction).type}` };
    }
  } catch (err) {
    return {
      success: false,
      error: `执行操作 ${action.type} 失败: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
