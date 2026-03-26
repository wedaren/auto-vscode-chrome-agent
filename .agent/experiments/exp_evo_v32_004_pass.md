## 任务
evo_v32_004: browser_snapshot 工具注册 — VSCode browser-tools.ts + Chrome action-executor.ts 联通

## 假设
VSCode 侧 browser-tools.ts 已有 browser_snapshot 工具定义和映射（在之前的提交中完成）。
Chrome 侧 action-executor.ts 已有 domSnapshot ActionType 和 executeDomSnapshot 函数，但仅调用 buildDomSnapshot，未集成 buildNodeAnchor。
需要增加 anchor-resolver 导入，增强 executeDomSnapshot 以同时构建稳定锚点，并修复 anchor-resolver.ts 的 TS 编译错误。

## 执行内容摘要
- action-executor.ts 顶部增加 `import { buildNodeAnchor, type NodeAnchor } from './anchor-resolver'`
- 新增 `collectInteractiveNodes` 辅助函数：从 DomSnapshotNode 树中收集可交互节点的 nodeId + selectorHint（上限 50 个）
- 增强 `executeDomSnapshot`：snapshot 采集后遍历可交互节点，通过 selectorHint 定位回 DOM 元素，调用 buildNodeAnchor 构建多路锚点
- 返回数据结构从单一 snapshot 升级为 `{ snapshot, anchors, anchorCount }`
- 修复 anchor-resolver.ts 两处 TS 编译错误：
  - 行 135: `const parent` → `const parent: Element | null`（消除隐式 any 循环引用）
  - 行 716: `let node` → `let node: Element | null`（walker.nextNode 可返回 null）

## 验收命令输出
```
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

### 验收维度详情

| 项目 | 分值 | 得分 | 说明 |
|---|---|---|---|
| acceptance_cmd 通过 | 60 | 60 | `tsc --noEmit` 双端零错误，输出 PASS |
| 代码无 TypeScript 错误 | 20 | 20 | vscode-ext 和 chrome-ext 均编译通过 |
| 符合 program.md 约束 | 20 | 20 | 无外部 API key 依赖；模型调用仅通过 vscode.lm API；新文件均有顶部注释 |

### 需求符合度
- [x] BrowserToolProvider.listTools() 包含 browser_snapshot 工具（inputSchema: maxDepth, maxNodes, scopeSelector）
- [x] action-executor.ts 新增 domSnapshot ActionType，调用 buildDomSnapshot + buildNodeAnchor
- [x] WebSocket tool_execute/tool_result 通过 requestId 正常传输 Snapshot 数据
- [x] 模型调用只通过 vscode.lm API
- [x] Chrome 插件不内置模型
- [x] 不引入需要外部 API key 的依赖
