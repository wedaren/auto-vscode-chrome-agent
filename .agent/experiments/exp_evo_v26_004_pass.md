## 任务
evo_v26_004: ExecutionOverlay Debug 增强 — 可展开步骤详情 + 执行耗时 + 日志导出

## 假设
本次尝试：扩展 skill_progress 协议增加 toolName/resolvedArgs/durationMs 可选字段，在 SkillRunner 中计时并发送增强 debug 信息，Chrome 侧 StepItem 组件增加点击展开/收起详情面板，ExecutionOverlay 增加导出日志按钮。

## 执行内容摘要
- 修改 `packages/vscode-ext/src/skill-runner.ts`：SkillProgress 接口扩展 toolName / resolvedArgs / durationMs 可选字段；execute() 方法每步执行前记录 startTime，执行后计算 durationMs，在 success/failed/skipped 三种 onProgress 回调中传递增强 debug 信息
- 修改 `packages/vscode-ext/src/message-handler.ts`：skill_progress 消息转发时包含 toolName、resolvedArgs、durationMs 新字段（使用条件展开避免 undefined）
- 修改 `packages/chrome-ext/components/SkillPanel.tsx`：
  - StepProgress 接口扩展 toolName / resolvedArgs / durationMs
  - StepItem 组件增加 useState(expanded) 状态，点击主行展开/收起详情面板，面板显示工具名称、耗时、参数 JSON（可滚动）、完整结果文本（可滚动）
  - ExecutionOverlay 标题栏显示总耗时标签，底部增加「导出日志」按钮生成包含所有步骤详情的 JSON 文件下载
  - 新增 formatDuration 工具函数，将毫秒格式化为 ms/s/m 可读字符串

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
