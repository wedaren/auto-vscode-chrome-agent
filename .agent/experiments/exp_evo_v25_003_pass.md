## 任务
evo_v25_003: AgentStepView observe 步骤图片渲染：AgentStep 接口增加 imageData + ObserveContent 识别并渲染图片

## 假设
Chrome 侧 AgentStep 接口缺少 imageData 字段，导致 VSCode 发送的截图数据被丢弃。只需：
1. AgentStep 接口增加 imageData 字段
2. ObserveContent 组件检测 imageData 或 content 中的 data:image 模式，使用 ImagePreview 渲染
3. App.tsx 调试日志增加 imageData 感知

## 执行内容摘要
- AgentStepView.tsx：AgentStep 接口增加 `imageData?: string` 字段
- AgentStepView.tsx：import ImagePreview 组件
- AgentStepView.tsx：ObserveContent 接受 imageData prop，优先使用 imageData 渲染图片，也支持从 content 中检测 data:image 模式作为 fallback
- AgentStepView.tsx：StepItem observe 分支传递 `step.imageData` 给 ObserveContent
- App.tsx：agent_step debug 日志增加 imageData 字段检测和标注

## 验收命令输出
```
✔ Finished in 2.084 s
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无。acceptance_cmd 全部通过，构建成功，TypeScript 类型正确，符合 program.md 约束。
