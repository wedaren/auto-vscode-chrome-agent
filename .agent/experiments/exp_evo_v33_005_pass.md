## 任务
evo_v33_005: 全链路验收 — 零 DOM 篡改验证 + CSS 隔离 + 双端编译

## 假设
evo_v33_001~004 已完成核心重构，本任务逐项验证 5 条验收标准，对遗留的 IMT_INLINE_LEAF_TAGS / extractInlineLeafNodes 补充 @deprecated 标记。

## 执行内容摘要
- 验证 ① action-executor.ts 无 setAttribute('data-imt-id') 调用 → PASS
- 验证 ② 无 parent.insertBefore / parent.appendChild 用于翻译注入 → PASS（唯一 appendChild 用于下载锚点，Overlay 内部 appendChild 属预期行为）
- 验证 ③ ensureImtStyle 已从 action-executor.ts 移除，imt-overlay.ts 的 _ensureStyle() 包含 all:initial + contain:content → PASS
- 标记 ④ IMT_INLINE_LEAF_TAGS + extractInlineLeafNodes 为 @deprecated（原注入辅助逻辑，现仅用于提取阶段）→ PASS
- 验证 ⑤ Chrome + VSCode 双端 tsc --noEmit → PASS (exit 0)

## 验收命令输出
```
=== ① setAttribute data-imt-id 检查 ===
PASS: 无 setAttribute data-imt-id 调用

=== ② parent.insertBefore / parent.appendChild 检查(翻译注入用途) ===
PASS: 无 parent.insertBefore/appendChild

=== ③ ensureImtStyle → Overlay 内部样式 (all:initial + contain:content) ===
PASS: ensureImtStyle 已从 action-executor.ts 清除
PASS: imt-overlay.ts 包含 all:initial + contain:content

=== ④ insertTranslationElement / IMT_INLINE_LEAF_TAGS deprecated ===
PASS: insertTranslationElement 逻辑已清除（仅 @deprecated 注释中引用）
PASS: IMT_INLINE_LEAF_TAGS 已标记 @deprecated

=== ⑤ 双端 tsc --noEmit ===
chrome-ext tsc exit: 0
vscode-ext tsc exit: 0

=== Final: PASS ===
```

## 结果
pass
