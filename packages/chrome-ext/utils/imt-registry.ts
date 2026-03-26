/**
 * imt-registry.ts — ImtElementRegistry 内存元素注册表
 *
 * 职责：替代 data-imt-id DOM 属性标记，使用纯内存双向映射存储
 * 元素与翻译 ID 的对应关系，实现零 DOM 篡改的元素追踪。
 *
 * 数据结构：
 *   - Map<string, Element>     id → element（强引用，保证按 id 查找）
 *   - WeakMap<Element, string> element → id（弱引用，GC 友好）
 *
 * 当元素被浏览器 GC 回收后，WeakMap 条目自动清除；
 * 调用方可通过 has(id) 检测 Map 中的元素是否仍在 DOM 中。
 */

export class ImtElementRegistry {
  /** id → element 正向映射 */
  private readonly idToElement: Map<string, Element> = new Map();

  /** element → id 反向映射（WeakMap，不阻止 GC） */
  private readonly elementToId: WeakMap<Element, string> = new WeakMap();

  /**
   * 注册一个 id ↔ element 双向映射。
   * 如果 id 已存在，会先解除旧元素的反向映射再覆盖。
   * 如果 element 已注册过其他 id，旧 id 的正向映射也会被移除。
   */
  register(id: string, element: Element): void {
    // 若此 id 已绑定其他元素，先清除旧元素的反向映射
    const existingElement = this.idToElement.get(id);
    if (existingElement && existingElement !== element) {
      this.elementToId.delete(existingElement);
    }

    // 若此 element 已绑定其他 id，先清除旧 id 的正向映射
    const existingId = this.elementToId.get(element);
    if (existingId !== undefined && existingId !== id) {
      this.idToElement.delete(existingId);
    }

    this.idToElement.set(id, element);
    this.elementToId.set(element, id);
  }

  /**
   * 根据 id 获取对应的 Element。
   * 返回 undefined 表示该 id 未注册。
   */
  get(id: string): Element | undefined {
    return this.idToElement.get(id);
  }

  /**
   * 根据 Element 获取对应的 id。
   * 返回 undefined 表示该元素未注册。
   */
  getIdByElement(el: Element): string | undefined {
    return this.elementToId.get(el);
  }

  /**
   * 检查 id 是否已注册。
   */
  has(id: string): boolean {
    return this.idToElement.has(id);
  }

  /**
   * 清除所有注册数据。
   * 注意：WeakMap 没有 clear()，但丢弃旧引用后由引擎 GC 处理。
   * 这里重新创建 idToElement 的反向引用不可行（WeakMap 无法遍历），
   * 所以逐条删除 elementToId 中的条目。
   */
  clear(): void {
    // 逐条清除 WeakMap 中的反向映射
    for (const element of this.idToElement.values()) {
      this.elementToId.delete(element);
    }
    this.idToElement.clear();
  }

  /**
   * 当前注册的 id ↔ element 对数量。
   */
  get size(): number {
    return this.idToElement.size;
  }

  /**
   * 返回所有 [id, element] 条目的迭代器。
   */
  entries(): IterableIterator<[string, Element]> {
    return this.idToElement.entries();
  }

  /**
   * 批量注册多个 id ↔ element 映射。
   * 便于 extractParagraphs 一次性注册所有段落。
   */
  registerBatch(items: Array<{ id: string; element: Element }>): void {
    for (const { id, element } of items) {
      this.register(id, element);
    }
  }

  /**
   * 检查某个已注册的元素是否仍然连接在 DOM 树中。
   * 用于检测 SPA 重渲染导致的元素失效。
   */
  isConnected(id: string): boolean {
    const el = this.idToElement.get(id);
    return el ? el.isConnected : false;
  }

  /**
   * 移除单个 id 的注册。
   */
  unregister(id: string): boolean {
    const element = this.idToElement.get(id);
    if (!element) {
      return false;
    }
    this.elementToId.delete(element);
    this.idToElement.delete(id);
    return true;
  }
}

/**
 * 全局单例 — Content Script 生命周期内共享一个注册表。
 * extractParagraphs 写入，injectBilingual / toggle / clear 读取。
 */
export const imtRegistry = new ImtElementRegistry();
