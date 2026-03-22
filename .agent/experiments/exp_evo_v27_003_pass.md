## 任务
evo_v27_003: 注入 DOM 策略重构 — 表格布局兼容注入（不在 <tr> 内插 <div>）+ 行内元素适配

## 假设
当前 executeInjectBilingual 总是创建 `<div>` 并用 `parentNode.insertBefore` 插入。当原始元素是 `<td>`（父元素是 `<tr>`）时，在 `<tr>` 内插入 `<div>` 是无效 HTML，会破坏表格布局。需要根据 DOM 上下文选择不同的插入策略和元素类型。

## 执行内容摘要
- 新增 `insertTranslationElement()` 函数：根据原始元素的 DOM 上下文智能选择注入策略
  - Case 1: 父元素是 `<tr>` → 在单元格内部 appendChild，不在 `<tr>` 内插 `<div>`
  - Case 2: 原始元素是行内元素（`<a>`/`<span>` 等）→ 使用 `<span>` 替代 `<div>`，添加 `imt-inline` 类
  - Case 3: 普通块级元素（`<p>`/`<li>` 等）→ 保持原逻辑 `insertBefore(div, nextSibling)`
- CSS 新增 `.imt-translation.imt-inline { display: block; }` 确保行内翻译元素占独立行
- 将 `executeInjectBilingual` 的注入逻辑从内联代码替换为调用 `insertTranslationElement()`
- 文章页面（`<p>` 结构）注入效果完全不变（走 Case 3 原逻辑）

## 验收命令输出
```
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：98/100
问题：
- 预存 TS 错误（browser/chrome 全局变量类型，WXT 项目特性，非本任务引入）— 扣 2 分
- acceptance_cmd: PASS（60/60）
- 代码一致性：文件有顶部注释，无外部依赖引入，insertTranslationElement 三分支策略清晰（18/20）
- 需求符合度：Chrome 不内置模型，无需外部 API key（20/20）
