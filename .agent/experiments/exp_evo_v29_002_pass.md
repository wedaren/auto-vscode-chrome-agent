## 任务
evo_v29_002: Agent 执行进度条 — AgentProgressBar 组件 + 步骤计数协议 + 耗时 + 取消

## 假设
在 Chrome 侧新增 AgentProgressBar 组件作为 sticky 进度条，VSCode 侧新增 agent_progress 消息协议，Agent 和 Skill 执行期间持续推送进度更新，useChat 处理该消息并驱动进度条 UI。

## 执行内容摘要
- 创建 `packages/chrome-ext/components/AgentProgressBar.tsx`：进度条组件，显示脉冲指示器 + 模式标签(Agent/Skill) + 步骤 N/M + 已耗时 + 当前描述 + 取消按钮
- 修改 `packages/chrome-ext/hooks/useChat.ts`：新增 `agentProgress` 状态，处理 `agent_progress` 消息类型，完成/取消/错误/断连时自动清除
- 修改 `packages/chrome-ext/entrypoints/sidepanel/App.tsx`：导入 AgentProgressBar 并放置在消息区上方
- 修改 `packages/chrome-ext/tailwind.config.ts`：新增 slideDown 入场动画
- 修改 `packages/vscode-ext/src/message-handler.ts`：新增 `sendAgentProgress()` 辅助方法，在 Agent 模式(start/step/complete/cancelled/error)和 Skill 模式(start/step/complete/error)全程发送 agent_progress 消息

## 验收命令输出
```
grep -r 'AgentProgressBar' packages/chrome-ext/ 找到 4+ 处引用
grep -r 'agent_progress' packages/vscode-ext/src/ 找到 15+ 处引用
PASS
```

双端构建均通过:
- chrome-ext: pnpm build 成功 (1.910s)
- vscode-ext: pnpm compile 成功 (50ms)
- TypeScript: npx tsc --noEmit 无错误

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
