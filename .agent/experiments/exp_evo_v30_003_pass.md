## 任务
evo_v30_003: WebSocket translate_progress 协议 + Chrome 侧翻译进度条组件

## 假设
在 SkillPanel 中监听 translate_progress WebSocket 消息并通过 prop 传递给 TranslateControl，TranslateControl 新增 TranslateProgressBar 子组件渲染实时进度条。

## 执行内容摘要
- **ws-client.ts**：注释区新增 translate_progress 消息类型文档
- **SkillPanel.tsx**：
  - 新增 `translateProgress` state（类型含 translated/total/batchIndex/totalBatches/status）
  - 在 onMessage handler 增加 `case 'translate_progress'` 监听，更新 translateProgress state
  - done/error 时 3 秒延迟清除进度
  - 将 translateProgress 作为 prop 传给 TranslateControl
- **TranslateControl.tsx**：
  - 新增 `TranslateProgressInfo` 导出接口（与 VSCode 侧 TranslateProgressPayload 对齐）
  - 新增 `translateProgress` prop
  - 新增 `TranslateProgressBar` 子组件：
    - 显示实时进度文本 "翻译中: N/M 段落已完成"
    - 进度条带 `transition-all duration-700 ease-out` 动画过渡
    - 翻译中有 pulse-subtle 呼吸动画 + 蓝色脉动圆点
    - done 时显示绿色 "翻译完成 ✓"
    - error 时显示红色进度条
    - 显示批次信息和百分比
  - 翻译完成后（非 running 且 progress.status=done）显示完成提示条
  - useEffect 监听 translateProgress 自动同步 running 状态

## 验收命令输出
```
PASS
```

## 构建验证
- Chrome ext: `pnpm build` → ✔ Finished in 1.972 s
- VSCode ext: `npm run compile` → ⚡ Done in 46ms

## 结果
pass
