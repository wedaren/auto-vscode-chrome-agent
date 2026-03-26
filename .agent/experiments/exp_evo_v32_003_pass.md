## 任务
evo_v32_003: Chrome 侧 anchor-resolver.ts — 稳定锚点构建与重定位解析

## 假设
根据 docs/browser-intelligence-architecture.md §稳定锚点系统 的规范，创建 anchor-resolver.ts，实现 buildNodeAnchor(element) 构建多路稳定锚点和 resolveAnchor(anchor, root) 按优先级依次尝试多种定位策略重定位元素。所有操作使用纯 DOM API（不使用 eval），CSP 安全。本地定义类型（镜像 browser-runtime-contract.ts），避免跨包依赖。

## 执行内容摘要
- 创建了 `packages/chrome-ext/utils/anchor-resolver.ts`
- 定义了本地镜像类型：NodeRect、NodeAnchor、AnchorResolveResult
- 实现了锚点构建函数 `buildNodeAnchor(element, nodeId?)`：
  - nodeId（可选快照 ID）
  - cssSelector（逐层路径选择器，含 id 优化和 nth-of-type 去重，构建后验证有效性）
  - xpath（XPath 绝对路径，含 id 快捷定位）
  - textQuote（直接文本 + 完整文本兜底，截断到 80 字符）
  - textContextBefore / textContextAfter（前后兄弟文本上下文，各 40 字符）
  - parentSignature（tag#id.class 格式）
  - siblingSignature（[prev_tag|next_tag] 格式）
  - rectHint（边界矩形位置提示）
- 实现了锚点解析函数 `resolveAnchor(anchor, root)`，按优先级依次尝试 6 种策略：
  1. nodeId → data-snapshot-id 属性查找（confidence: 1.0）
  2. cssSelector → CSS 选择器查找（confidence: 0.95）
  3. xpath → XPath 路径查找（confidence: 0.9）
  4. textQuote + context → 文本片段匹配 + 上下文验证（confidence: 0.65-0.8）
  5. parentSignature + siblingSignature → 结构签名匹配（confidence: 0.45-0.6）
  6. rectHint → 视觉位置最近邻（confidence: 0.3）
- 不使用 eval、new Function、innerHTML 等 CSP 敏感操作
- 每种策略都有 try/catch 保护，单个策略失败不影响其他策略

## 验收命令输出
PASS

## 结果
pass
