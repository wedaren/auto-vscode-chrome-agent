## 任务
evo_v32_002: Chrome 侧 dom-snapshot.ts — 结构化 DOM Snapshot 采集器

## 假设
根据 docs/browser-intelligence-architecture.md 中 Structural Snapshot Layer 的规范，创建 `buildDomSnapshot(root, options)` 函数，递归遍历 DOM 树生成 DomSnapshotNode 树。所有操作使用纯 DOM API（不使用 eval），CSP 安全。本地定义类型（镜像 browser-runtime-contract.ts），避免跨包依赖。

## 执行内容摘要
- 创建了 `packages/chrome-ext/utils/dom-snapshot.ts`
- 定义了本地镜像类型：NodeRect、DomSnapshotNode、SnapshotOptions
- 实现了核心函数 `buildDomSnapshot(root, options)`：
  - 深度限制（默认 12）
  - 节点数限制（默认 3000）
  - scopeSelector 子树限定
  - visibility 检测（display/visibility/opacity/offsetParent/getBoundingClientRect）
  - interactivity 检测（标签白名单 + ARIA role + tabindex + contenteditable）
  - rect 边界矩形采集（四舍五入到整数）
  - textPreview 直接文本内容预览（可配置截断长度，默认 120）
  - selectorHint 构建（id > tag.class > nth-of-type 去重）
  - attributes 白名单过滤（href/src/alt/title/aria-*/data-testid 等）
  - Shadow DOM open shadow root 遍历支持
  - 跳过 script/style/noscript/template 等无语义标签
- 导出便捷函数 `snapshotCurrentPage(options)`
- 不使用 eval、new Function、innerHTML 等 CSP 敏感操作

## 验收命令输出
PASS

## 结果
pass
