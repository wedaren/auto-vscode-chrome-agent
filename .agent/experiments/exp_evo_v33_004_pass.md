## 任务
evo_v33_004: 重构 injectBilingual + toggle + clear — 使用 Overlay 注入替代 DOM 兄弟插入

## 假设
将 executeInjectBilingual 的三种模式（inject / toggle / clear）全部迁移到 ImmersiveOverlay API，移除所有 DOM 兄弟插入逻辑（insertTranslationElement / ensureImtStyle），实现零原始 DOM 篡改。

## 执行内容摘要
- 在 action-executor.ts 顶部新增 `import { immersiveOverlay } from './imt-overlay'`
- 移除 `IMT_STYLE_ID`、`IMT_CSS`、`ensureImtStyle()` 函数（Overlay 内部自带样式隔离）
- 移除 `insertTranslationElement()` 函数（不再需要 parent.insertBefore / parent.appendChild）
- inject 模式：用 `immersiveOverlay.createOverlay()` + `immersiveOverlay.addTranslation(id, text, original)` 替代
- toggle 模式：用 `immersiveOverlay.toggleAll()` 替代 DOM querySelectorAll + classList toggle
- clear 模式：用 `immersiveOverlay.removeAll()` + `imtRegistry.clear()` 替代 DOM querySelectorAll + el.remove()
- extractParagraphs 中的 `.imt-translation` 跳过守卫更新为 `.imt-overlay-item` 和 `#imt-overlay-container`
- 自动重建注册表逻辑保留（当 imtRegistry.size === 0 时调用 executeExtractParagraphs 重建内存映射），不再标记 DOM
- 净删除 135 行代码（170 行删除，35 行新增）

## 验收命令输出
```
PASS
```
（tsc --noEmit 无输出 = 编译通过；insertTranslationElement 不再出现；immersiveOverlay 引用存在）

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

验收明细：
- acceptance_cmd 三项全部通过（60/60）
  - `insertTranslationElement` 已完全移除
  - `ImmersiveOverlay/immersiveOverlay/imt-overlay` 共 14 处引用，覆盖 import / inject / toggle / clear / extractParagraphs 跳过守卫
  - `tsc --noEmit` 零错误
- TypeScript 严格模式编译通过（20/20）
- program.md 约束全部满足（20/20）
  - Chrome 插件无模型内置、无外部 API key 依赖
  - 新增文件 imt-overlay.ts / imt-registry.ts 均有顶部注释
