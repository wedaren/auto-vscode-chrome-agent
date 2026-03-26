## 任务
evo_v33_001: ImtElementRegistry 内存元素注册表 — 替代 data-imt-id 属性标记

## 假设
创建一个纯内存的双向映射注册表，使用 Map<string, Element> + WeakMap<Element, string> 实现 id ↔ element 双向查找，完全不依赖 DOM 属性，为后续 extractParagraphs / injectBilingual 重构提供基础设施。

## 执行内容摘要
- 创建了 `packages/chrome-ext/utils/imt-registry.ts`
- 导出 `ImtElementRegistry` 类，包含完整 API：
  - `register(id, element)` — 双向注册，自动处理覆盖
  - `get(id)` — 正向查找
  - `getIdByElement(el)` — 反向查找
  - `has(id)` — 存在检查
  - `clear()` — 清空注册表
  - `size` — 当前条目数
  - `entries()` — 迭代器
  - `registerBatch(items)` — 批量注册便捷方法
  - `isConnected(id)` — SPA 重渲染元素失效检测
  - `unregister(id)` — 单条移除
- 导出全局单例 `imtRegistry`

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
