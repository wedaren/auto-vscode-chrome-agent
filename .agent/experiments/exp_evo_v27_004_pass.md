## 任务
evo_v27_004: 提取-翻译-注入全链路适配 — ID 映射验证 + toggle/clear 兼容新 DOM 结构

## 假设
evo_v27_001/002/003 引入了智能叶节点提取（<a>/<span>）和表格布局兼容注入（in-cell / inline / block 三种策略），需要确保全链路端到端正确：
1. CSS 需要显式处理 `.imt-inline.imt-hidden` 组合的 specificity
2. toggle 需要覆盖新 DOM 结构下的三种翻译元素类型
3. clear 需要清除所有类型的翻译元素和叶节点 `data-imt-id` 标记
4. 自动重标记需要在重新提取后按索引重映射 translation IDs，确保 `<a>` 叶节点的 `data-imt-id` 与翻译结果正确配对

## 执行内容摘要
- **CSS 增强**: 新增 `.imt-translation.imt-inline.imt-hidden { display: none; }` 显式规则，确保 toggle 隐藏 inline 翻译元素时不被 `.imt-inline` 的 `display:block` 覆盖
- **toggle 增强**: 新增 `inlineCount`/`blockCount` 统计，返回数据中区分 in-cell/inline/block 三种翻译类型的切换数量
- **clear 增强**: 新增 `inlineRemoved`/`blockRemoved`/`untagged` 统计，覆盖 `<a>`/`<span>` 叶节点的 `data-imt-id` 清除
- **auto-remark ID 重映射**: 自动重标记后，按索引将 `items[i].id` 重映射为新提取的 `paragraphs[i].id`，确保结构化格式翻译数据与新叶节点 ID 正确配对

## 验收命令输出
```
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 预存 TS 错误（browser/chrome 全局变量类型，WXT 项目特性，非本任务引入，20 个错误均在 content.ts / useChatStorage.ts / usePageContext.ts / tool-bridge.ts，不涉及 action-executor.ts）
