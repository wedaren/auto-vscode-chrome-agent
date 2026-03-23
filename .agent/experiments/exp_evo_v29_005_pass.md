## 任务
evo_v29_005: 长回复增强 — 代码块折叠 (>15行默认折叠) + 长回复标题导航 + 全量验收

## 假设
在 MessageBubble 的 marked code renderer 中统计代码行数，>15 行时添加 collapsible CSS 类和展开按钮；通过正则提取 Markdown 标题生成 HeadingNav 组件；利用事件委托绑定折叠/展开交互。

## 执行内容摘要
- 修改 `packages/chrome-ext/components/MessageBubble.tsx`:
  - 增加 CODE_COLLAPSE_THRESHOLD(15) / CODE_COLLAPSE_VISIBLE_LINES(5) / HEADING_NAV_THRESHOLD(500) 常量
  - 重写 marked code renderer：增加 code-block-header（语言标签+复制按钮）、折叠类名、展开按钮
  - 增加 marked heading renderer：为标题添加 id 属性用于锚点跳转
  - 增加 extractHeadings() 函数：解析 markdown 文本提取标题（排除代码块内的 #）
  - 增加 HeadingNav 组件：折叠式目录导航，支持点击跳转
  - 增加 useEffect 为 .code-collapse-toggle 绑定展开/收起事件
  - 在 assistant 消息渲染区增加 HeadingNav 条件渲染
- 修改 `packages/chrome-ext/assets/style.css`:
  - 重构 code-block-wrapper 样式，增加 code-block-header 语言标签栏
  - 增加 code-collapsible / code-collapsed 折叠状态样式（max-height + 渐隐遮罩）
  - 增加 code-collapse-toggle 按钮样式
  - 增加 heading-nav / heading-nav-toggle / heading-nav-list / heading-nav-item 全套导航样式

## 验收命令输出
```
grep 匹配 7 处 code-collapse/collapsible 引用
chrome-ext built ✔ Finished in 2.314s
vscode-ext compiled ✔ Done in 51ms
PASS
```

## 结果
pass
