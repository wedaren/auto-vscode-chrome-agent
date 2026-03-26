## 任务
evo_v33_002: ImmersiveOverlay 绝对定位容器模块 — 独立渲染层基础设施

## 假设
创建 ImmersiveOverlay 类，使用绝对定位容器覆盖在页面上方，通过 getBoundingClientRect 将翻译文本定位在原始元素下方，使用 ResizeObserver + scroll/resize 监听自动重新定位，CSS 隔离（all:initial + contain:content）防止样式泄漏。

## 执行内容摘要
- 创建了 `packages/chrome-ext/utils/imt-overlay.ts`
- 导出 `ImmersiveOverlay` 类，提供 5 个核心方法：
  - `createOverlay()` — 创建绝对定位容器追加到 body 末尾（幂等）
  - `addTranslation(id, text, originalElement)` — 根据 getBoundingClientRect 计算位置创建翻译元素
  - `removeAll()` — 移除整个容器及所有监听器
  - `toggleAll()` — CSS visibility 切换
  - `recalculatePositions()` — 重算所有翻译位置，自动清理脱离 DOM 的条目
- Overlay 容器使用 `position:absolute + pointer-events:none + z-index:2147483646`
- 使用 WeakRef 引用原始元素，GC 友好
- ResizeObserver 监听 body 尺寸变化 + scroll/resize 事件，通过 requestAnimationFrame 节流
- 导出全局单例 `immersiveOverlay` 供 Content Script 共享

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无重大问题
- acceptance_cmd 全部通过（文件存在、关键符号匹配、tsc --noEmit 编译通过）
- 无外部依赖引入，纯 DOM API 实现
- 顶部注释完备，CSS 隔离设计合理（all:initial + contain:content）
- 符合 program.md 约束：Chrome 插件不内置模型、不引入需要外部 API key 的依赖
