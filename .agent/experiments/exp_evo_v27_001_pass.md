## 任务
evo_v27_001: 提取算法升级 — detectMainContent 表格布局支持 + 智能叶节点提取（<a>/<span> 等行内文本元素）

## 假设
本次尝试：在 action-executor.ts 中实现三项升级：
1. detectMainContent 增加表格布局选择器（table.itemlist 等）
2. 新增 IMT_INLINE_LEAF_TAGS 行内文本叶节点标签集合
3. 新增 extractInlineLeafNodes() 函数 + walk() 智能分支，对 <td>/<th> 优先提取内部 <a>/<span> 叶节点

## 执行内容摘要
- 新增 `IMT_INLINE_LEAF_TAGS` 集合（a/span/em/strong/b/i/mark/code/label/time）
- `detectMainContent()` 添加 `table.itemlist`、`#hnmain`、`.itemlist` 三个表格布局选择器
- 新增 `extractInlineLeafNodes(container)` 函数：仅对 <td>/<th> 启用，查找最深层行内叶节点
- `walk()` 函数在命中 IMT_PARAGRAPH_TAGS 时先调用 extractInlineLeafNodes，有叶节点则逐个提取，无叶节点则保持原逻辑整段提取

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
