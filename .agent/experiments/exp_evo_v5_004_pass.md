## 任务
evo_v5_004: Agent 循环可视化 TreeView：ReAct 步骤实时展示 + 历史执行记录浏览

## 假设
本次尝试：将 agent-tree.ts 从占位实现替换为完整的 2 级树 TreeDataProvider，采用与 message-tree.ts 相同的全局函数模式（startAgentRun/addAgentStep/completeAgentRun），在 message-handler.ts 的 handleChatAgentMode 中注入 TreeView 更新钩子。

## 执行内容摘要
- 重写 agent-tree.ts（34 行 → 370 行）：
  - AgentRunRecord 数据模型：id, startTime, endTime, status, steps[], userMessage, errorMessage
  - 全局运行记录管理：最多保留 20 次（MAX_RUNS=20），最新在前
  - 全局函数：startAgentRun() / addAgentStep() / completeAgentRun()
  - onDidChangeRuns 事件驱动 TreeView 自动刷新
  - AgentTreeItem 支持 nodeType（run/step）和 runId/stepIndex
  - 2 级树结构：
    - 顶级节点：每次运行，显示状态图标 + 时间戳 + 步骤数 + 用户消息摘要
    - 子节点：think🧠/act⚡/observe📋 步骤，含序号、工具名、截断内容
  - 运行中节点自动展开（Expanded），已完成节点折叠（Collapsed）
  - 丰富的 Markdown tooltip（运行详情/步骤详情）
  - 4 种状态图标：running(sync~spin) / completed(pass) / cancelled(debug-stop) / error(error)
- 修改 message-handler.ts：
  - 导入 startAgentRun/addAgentStep/completeAgentRun
  - handleChatAgentMode 中：
    - 循环开始前调用 startAgentRun(text)
    - onStep 回调中追加 addAgentStep(runId, step)
    - 成功时 completeAgentRun(runId, 'completed')
    - 取消时 completeAgentRun(runId, 'cancelled')
    - 错误时 completeAgentRun(runId, 'error', errMsg)

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

### 验收详情
| 项目 | 分值 | 得分 | 说明 |
|---|---|---|---|
| acceptance_cmd 通过 | 60 | 60 | `grep -q TreeDataProvider / onDidChangeTreeData / think\|act\|observe` 全部匹配，`npm run compile` 零错误 |
| 代码无 TypeScript 错误 | 20 | 20 | tsconfig.base.json `strict: true`，编译输出无任何 error/warning |
| 符合 program.md 约束 | 20 | 20 | agent-tree.ts 仅 import vscode + 本地 agent-loop；不引入外部依赖；无外部 API key 需求；模型调用在 agent-loop.ts 中通过 vscode.lm API 完成 |

### 代码质量确认
- ✅ agent-tree.ts 顶部注释完整（功能 + 职责说明）
- ✅ TreeDataProvider 实现完整（getTreeItem / getChildren / onDidChangeTreeData）
- ✅ 2 级树结构：运行记录（顶级）→ think🧠/act⚡/observe📋 步骤（子级）
- ✅ 运行中节点自动展开（Expanded），已完成节点折叠（Collapsed）
- ✅ 全局函数模式（startAgentRun / addAgentStep / completeAgentRun）与 message-handler.ts 集成
- ✅ 最多保留 20 次运行记录（MAX_RUNS=20）
- ✅ 丰富的 Markdown tooltip + contextValue + ThemeIcon
