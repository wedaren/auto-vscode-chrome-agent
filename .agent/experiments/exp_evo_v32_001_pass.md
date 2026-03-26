## 任务
evo_v32_001: VSCode 侧 browser-runtime-contract.ts — 浏览器智能层共享 TypeScript 类型定义

## 假设
根据 docs/browser-intelligence-architecture.md 中定义的类型规范，创建完整的共享类型定义文件，涵盖 DOM Snapshot、Node Anchor、Semantic Page Model（stub）、DOM Patch Plan（stub）等核心数据结构。

## 执行内容摘要
- 创建了 `packages/vscode-ext/src/browser-runtime-contract.ts`
- 定义了 12+ 个核心 interface/type：
  - NodeRect, DomSnapshotNode, SnapshotOptions
  - NodeAnchor（多路锚点：nodeId/cssSelector/xpath/textQuote/parentSignature/rectHint/semanticRegionId）
  - PageRegion, ContentBlock, ActionZone, InsertionCandidate, DangerousZone
  - SemanticPageModel（stub，阶段 2 完整实现）
  - MutationStrategy type, PatchTarget, PatchPayload, PatchConstraints, VerificationPlan
  - DomPatchPlan（stub，阶段 3 完整实现）
  - MutationSurface, BrowserAnalysisResult, BrowserMutationRequest, BrowserMutationResult

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
