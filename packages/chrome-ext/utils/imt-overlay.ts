/**
 * imt-overlay.ts — ImmersiveOverlay 绝对定位容器模块
 *
 * 职责：提供独立渲染层基础设施，替代直接 DOM 兄弟插入方式注入翻译。
 * 所有翻译文本渲染在一个绝对定位的 overlay 容器中，不修改原始页面 DOM 结构。
 *
 * 核心设计：
 *   - Overlay 容器：position:absolute + pointer-events:none + 高 z-index
 *   - 翻译元素通过 getBoundingClientRect() 定位到原始元素下方
 *   - ResizeObserver + scroll 监听自动重新定位
 *   - CSS 隔离：all:initial 重置 + contain:content 防止样式泄漏
 *   - 三种显示模式（DisplayMode）：bilingual / original / translated
 */

/**
 * 显示模式类型：
 *   - bilingual:   双语对照 — 翻译显示在原文下方（默认）
 *   - original:    仅原文 — 隐藏 Overlay，只显示页面原始内容
 *   - translated:  仅译文 — 翻译覆盖在原文上方，用不透明白底遮住原文
 */
export type DisplayMode = 'bilingual' | 'original' | 'translated';

/** Overlay 容器的 DOM id */
const OVERLAY_CONTAINER_ID = 'imt-overlay-container';

/** Overlay 内部样式的 DOM id */
const OVERLAY_STYLE_ID = 'imt-overlay-style';

/** Overlay 内部样式 — 使用 all:initial 重置继承 + contain:content 隔离 */
const OVERLAY_CSS = `
#${OVERLAY_CONTAINER_ID} {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 2147483646;
  contain: layout style;
}
#${OVERLAY_CONTAINER_ID} .imt-overlay-item {
  all: initial;
  position: absolute;
  display: block;
  box-sizing: border-box;
  contain: content;
  pointer-events: none;
  color: #888;
  font-size: 0.88em;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  word-break: break-word;
  padding: 2px 0;
  opacity: 1;
  visibility: visible;
}
#${OVERLAY_CONTAINER_ID}.imt-overlay-hidden .imt-overlay-item {
  visibility: hidden;
}
#${OVERLAY_CONTAINER_ID}.imt-overlay-translated .imt-overlay-item {
  background: #fff;
  color: #222;
  font-size: 1em;
  line-height: 1.6;
  padding: 2px 4px;
  opacity: 1;
  visibility: visible;
  pointer-events: none;
}
`;

/**
 * 翻译条目的内部记录，用于位置重算和 toggle/clear 操作。
 */
interface OverlayEntry {
  /** 翻译 ID（对应 ImtElementRegistry 中的 id） */
  id: string;
  /** 翻译文本 */
  text: string;
  /** 对应的原始 DOM 元素（弱引用避免阻止 GC） */
  originalElement: WeakRef<Element>;
  /** Overlay 中创建的翻译 DOM 元素 */
  overlayElement: HTMLDivElement;
}

/**
 * ImmersiveOverlay — 独立渲染层管理器
 *
 * 使用方式：
 *   1. createOverlay() — 初始化容器（幂等）
 *   2. addTranslation(id, text, originalElement) — 逐条添加翻译
 *   3. recalculatePositions() — 手动触发全量位置刷新（窗口变化时自动触发）
 *   4. toggleAll() — 切换翻译显示/隐藏
 *   5. setDisplayMode(mode) — 切换三种显示模式（bilingual/original/translated）
 *   6. getDisplayMode() — 获取当前显示模式
 *   7. removeAll() — 销毁整个 Overlay（包括 ResizeObserver）
 */
export class ImmersiveOverlay {
  /** Overlay 容器 DOM 元素 */
  private container: HTMLDivElement | null = null;

  /** 所有翻译条目（按 id 索引） */
  private entries: Map<string, OverlayEntry> = new Map();

  /** ResizeObserver 实例（监听 document.body 尺寸变化） */
  private resizeObserver: ResizeObserver | null = null;

  /** scroll 事件监听器引用（用于解绑） */
  private scrollHandler: (() => void) | null = null;

  /** requestAnimationFrame 节流标记 */
  private rafPending = false;

  /** 当前显示模式，默认 bilingual（双语对照） */
  private _displayMode: DisplayMode = 'bilingual';

  /**
   * 创建 Overlay 容器并追加到 body 末尾。
   * 幂等操作——若容器已存在则直接返回。
   * 同时注入隔离样式并启动 ResizeObserver。
   */
  createOverlay(): HTMLDivElement {
    // 幂等：已存在则直接返回
    if (this.container && this.container.isConnected) {
      return this.container;
    }

    // 尝试复用页面中已存在的容器（如 content script 重注入场景）
    const existing = document.getElementById(OVERLAY_CONTAINER_ID) as HTMLDivElement | null;
    if (existing) {
      this.container = existing;
      this._ensureStyle();
      this._startObservers();
      return this.container;
    }

    // 创建新容器
    const container = document.createElement('div');
    container.id = OVERLAY_CONTAINER_ID;
    document.body.appendChild(container);
    this.container = container;

    // 注入隔离样式
    this._ensureStyle();

    // 启动位置自动刷新
    this._startObservers();

    return this.container;
  }

  /**
   * 添加一条翻译到 Overlay。
   * 根据 originalElement 的 getBoundingClientRect() 计算绝对定位坐标，
   * 将翻译元素放置在原始元素正下方。
   *
   * @param id          翻译 ID（与 ImtElementRegistry 一致）
   * @param text        翻译文本
   * @param originalElement 对应的原始 DOM 元素
   * @returns 创建的翻译 DOM 元素，若容器未初始化则返回 null
   */
  addTranslation(id: string, text: string, originalElement: Element): HTMLDivElement | null {
    // 确保容器已创建
    if (!this.container) {
      this.createOverlay();
    }

    // 避免重复：已存在同 id 条目则更新文本
    const existing = this.entries.get(id);
    if (existing) {
      existing.overlayElement.textContent = text;
      existing.overlayElement.classList.remove('imt-overlay-hidden');
      // 更新引用（元素可能因 SPA 重渲染而变化）
      this.entries.set(id, {
        ...existing,
        text,
        originalElement: new WeakRef(originalElement),
      });
      this._positionEntry(existing);
      return existing.overlayElement;
    }

    // 创建翻译元素
    const overlayEl = document.createElement('div');
    overlayEl.className = 'imt-overlay-item';
    overlayEl.setAttribute('data-imt-overlay-id', id);
    overlayEl.textContent = text;

    // 计算位置
    const entry: OverlayEntry = {
      id,
      text,
      originalElement: new WeakRef(originalElement),
      overlayElement: overlayEl,
    };

    this._positionEntry(entry);

    // 追加到容器
    this.container!.appendChild(overlayEl);
    this.entries.set(id, entry);

    return overlayEl;
  }

  /**
   * 移除整个 Overlay 容器及所有翻译元素。
   * 同时停止 ResizeObserver 和 scroll 监听。
   */
  removeAll(): void {
    this._stopObservers();

    if (this.container && this.container.isConnected) {
      this.container.remove();
    }
    this.container = null;

    // 清除样式
    const styleEl = document.getElementById(OVERLAY_STYLE_ID);
    if (styleEl) {
      styleEl.remove();
    }

    this.entries.clear();
  }

  /**
   * 切换所有翻译的可见性（CSS visibility 切换）。
   * 不销毁 DOM，仅切换 CSS 类名。
   *
   * @returns 切换后是否可见
   */
  toggleAll(): boolean {
    if (!this.container) {
      return false;
    }

    const isHidden = this.container.classList.toggle('imt-overlay-hidden');
    return !isHidden; // toggle 返回 true 表示类被添加（即隐藏），所以取反
  }

  /**
   * 设置显示模式并立即应用到 Overlay 容器。
   *
   * 模式行为：
   *   - bilingual:   移除隐藏/覆盖类名，翻译显示在原文下方（rect.bottom）
   *   - original:    添加 imt-overlay-hidden，隐藏所有翻译
   *   - translated:  添加 imt-overlay-translated，翻译定位到 rect.top 并用白底覆盖原文
   *
   * @param mode 目标显示模式
   */
  setDisplayMode(mode: DisplayMode): void {
    this._displayMode = mode;
    this._applyDisplayMode();
    this.recalculatePositions();
  }

  /**
   * 获取当前显示模式。
   */
  getDisplayMode(): DisplayMode {
    return this._displayMode;
  }

  /**
   * 重新计算所有翻译元素的绝对定位坐标。
   * 当页面滚动、窗口 resize 或 DOM 结构变化时调用。
   * 根据当前 displayMode 决定定位策略：
   *   - bilingual/original: 翻译定位到原文下方（rect.bottom）
   *   - translated: 翻译定位到原文上方（rect.top），覆盖原文
   * 自动清理已脱离 DOM 的条目。
   */
  recalculatePositions(): void {
    const toRemove: string[] = [];

    for (const [id, entry] of this.entries) {
      const original = entry.originalElement.deref();

      // 原始元素已被 GC 回收或脱离 DOM
      if (!original || !original.isConnected) {
        toRemove.push(id);
        continue;
      }

      this._positionEntry(entry);
    }

    // 清理无效条目
    for (const id of toRemove) {
      const entry = this.entries.get(id);
      if (entry) {
        entry.overlayElement.remove();
        this.entries.delete(id);
      }
    }
  }

  /**
   * 当前 Overlay 中翻译条目数量。
   */
  get size(): number {
    return this.entries.size;
  }

  /**
   * Overlay 容器是否已创建且连接在 DOM 中。
   */
  get isConnected(): boolean {
    return this.container !== null && this.container.isConnected;
  }

  // ──────── 内部方法 ────────

  /**
   * 确保 Overlay 隔离样式已注入到 <head>。
   */
  private _ensureStyle(): void {
    if (document.getElementById(OVERLAY_STYLE_ID)) {
      return;
    }
    const styleEl = document.createElement('style');
    styleEl.id = OVERLAY_STYLE_ID;
    styleEl.textContent = OVERLAY_CSS;
    document.head.appendChild(styleEl);
  }

  /**
   * 计算单个条目的绝对定位坐标并设置到翻译元素上。
   *
   * 定位策略根据 displayMode 分为两种：
   *   - bilingual / original: 翻译放置在原始元素正下方（rect.bottom）
   *   - translated: 翻译放置在原始元素顶部（rect.top），不透明白底覆盖原文
   *
   * 通用：
   *   - 使用 getBoundingClientRect() 获取原始元素的视口坐标
   *   - 转换为页面绝对坐标（加上 scrollX/scrollY）
   *   - width 匹配原始元素宽度
   */
  private _positionEntry(entry: OverlayEntry): void {
    const original = entry.originalElement.deref();
    if (!original || !original.isConnected) {
      return;
    }

    const rect = original.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const el = entry.overlayElement;
    el.style.left = `${rect.left + scrollX}px`;
    el.style.width = `${rect.width}px`;

    if (this._displayMode === 'translated') {
      // translated 模式：定位到原文顶部，覆盖原文
      el.style.top = `${rect.top + scrollY}px`;
      el.style.minHeight = `${rect.height}px`;
    } else {
      // bilingual / original 模式：定位到原文下方
      el.style.top = `${rect.bottom + scrollY}px`;
      el.style.minHeight = '';
    }
  }

  /**
   * 将当前 displayMode 应用到容器的 CSS 类名上。
   * 互斥切换 imt-overlay-hidden / imt-overlay-translated 类名。
   */
  private _applyDisplayMode(): void {
    if (!this.container) {
      return;
    }

    // 先移除所有模式类名
    this.container.classList.remove('imt-overlay-hidden', 'imt-overlay-translated');

    switch (this._displayMode) {
      case 'original':
        // 仅原文 — 隐藏 Overlay
        this.container.classList.add('imt-overlay-hidden');
        break;
      case 'translated':
        // 仅译文 — 翻译覆盖在原文上方
        this.container.classList.add('imt-overlay-translated');
        break;
      case 'bilingual':
      default:
        // 双语对照 — 无额外类名（默认样式）
        break;
    }
  }

  /**
   * 启动 ResizeObserver 和 scroll 监听器，自动触发位置刷新。
   * 使用 requestAnimationFrame 节流避免高频重算。
   */
  private _startObservers(): void {
    // 避免重复绑定
    this._stopObservers();

    // ResizeObserver — 监听 body 尺寸变化（DOM 增删、字体加载等）
    this.resizeObserver = new ResizeObserver(() => {
      this._scheduleRecalculate();
    });
    this.resizeObserver.observe(document.body);

    // scroll 监听 — 使用 passive 提升性能
    this.scrollHandler = () => {
      this._scheduleRecalculate();
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    window.addEventListener('resize', this.scrollHandler, { passive: true });
  }

  /**
   * 停止所有自动位置刷新监听器。
   */
  private _stopObservers(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      window.removeEventListener('resize', this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  /**
   * 节流式触发位置重算 — 合并同一帧内的多次请求。
   */
  private _scheduleRecalculate(): void {
    if (this.rafPending) {
      return;
    }
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      this.recalculatePositions();
    });
  }
}

/**
 * 全局单例 — Content Script 生命周期内共享一个 Overlay 实例。
 * extractParagraphs 注册元素后，injectBilingual 通过此实例添加翻译；
 * toggle / clear 通过此实例控制可见性和销毁。
 */
export const immersiveOverlay = new ImmersiveOverlay();
