## 任务
evo_v26_003: VSCode SkillRunner 场景执行流 — 自动导航到预设 URL + 参数注入

## 假设
在 message-handler.ts 提取 targetUrl，在 SkillRunner 新增 navigateToTargetUrl() 方法调用 browser_navigate + browser_wait，导航失败时降级继续执行。

## 执行内容摘要
- message-handler.ts: handleSkillExecute 从 payload 提取 targetUrl 字段
- message-handler.ts: 在调用 skillRunner.execute() 前，若 targetUrl 非空则调用 skillRunner.navigateToTargetUrl()
- skill-runner.ts: 新增公开方法 navigateToTargetUrl(targetUrl, targetTabId)
  - 调用 browser_navigate 导航到目标 URL
  - 调用 browser_wait 等待 body 加载（8秒超时）
  - 导航失败返回 false，调用方降级为直接执行 Skill 步骤
  - 等待超时仍返回 true（导航已发出，页面可能在加载中）

## 验收命令输出
```
CHECK1: targetUrl in message-handler.ts ✓
CHECK2: navigate in skill-runner.ts ✓
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
