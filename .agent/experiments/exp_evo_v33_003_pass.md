## 任务
evo_v33_003: 重构 extractParagraphs — 使用 ImtElementRegistry 零属性标记提取

## 假设
将 extractParagraphs 中的 `setAttribute('data-imt-id', id)` 替换为 `imtRegistry.register(id, element)`，实现零 DOM 属性篡改。同时更新 injectBilingual 的元素查找逻辑，优先通过注册表查找以保证翻译流兼容。

## 执行内容摘要
- 在 action-executor.ts 顶部新增 `import { imtRegistry } from './imt-registry'`
- extractParagraphs walk 函数内两处 `setAttribute('data-imt-id', id)` 改为 `imtRegistry.register(id, element)`
- injectBilingual inject 模式：自动重标记逻辑改为检测 `imtRegistry.size`，重新调用 extractParagraphs 重建注册表
- injectBilingual inject 模式：元素查找改为 `imtRegistry.get(item.id) ?? document.querySelector(...)` 双路查找
- injectBilingual clear 模式：`querySelectorAll('[data-imt-id]') + removeAttribute` 改为 `imtRegistry.clear()`
- 诊断信息从 "已标记段落" 更新为 "已注册段落"

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
