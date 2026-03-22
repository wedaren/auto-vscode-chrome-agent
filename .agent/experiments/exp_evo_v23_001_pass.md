## 任务
evo_v23_001: Skill 执行 Tab 锁定：SkillPanel 获取 activeTabId 并附在 skill_execute 消息中，VSCode 侧 SkillRunner 透传 targetTabId 到每个 tool_execute

## 假设
在 Skill 执行前锁定当前活动 tab 的 ID，并在整个多步骤执行链路中透传该 ID 到每个 tool_execute 消息，为后续 Chrome 侧 background 路由提供依据，防止用户在 Skill 执行期间切换 tab 导致操作目标漂移。

## 执行内容摘要
- **SkillPanel.tsx**: `executeSkill` 改为 async，执行前通过 `chrome.tabs.query({ active: true, currentWindow: true })` 获取 activeTabId，附在 `skill_execute` payload 的 `targetTabId` 字段
- **message-handler.ts**: `handleSkillExecute` 从 payload 提取 `targetTabId`，透传给 `skillRunner.execute()` 的新参数
- **skill-runner.ts**: `execute()` 新增 `targetTabId` 参数，逐层传递到 `executeStep()` → `callTool()`，最终传给 `browserToolProvider.callTool()`
- **browser-tools.ts**: `callTool()` 新增 `targetTabId` 参数，当存在时附在 `tool_execute` WebSocket 消息的 payload 中

## 验收命令输出
```
✔ Finished in 2.014 s

PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
