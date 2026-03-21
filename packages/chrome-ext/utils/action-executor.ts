// action-executor.ts — 浏览器操作执行引擎
// 定义 BrowserAction 接口与所有支持的 DOM 操作类型，
// 在 content script 上下文中执行 click/type/scroll/querySelector 等操作

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
  | 'getLinks';

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

/**
 * 主执行入口 — 根据 action.type 分发到对应执行函数
 *
 * 注意：screenshot 操作需要在 background script 中使用 chrome.tabs.captureVisibleTab，
 * content script 无法执行此操作，返回特殊标记由 background 处理。
 */
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
