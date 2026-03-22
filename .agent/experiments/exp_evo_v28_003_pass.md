## 任务
evo_v28_003: 新增截图合成下载能力 — Canvas 拼接多张 base64 截图 + Blob 触发浏览器下载

## 假设
在 action-executor.ts 新增 compositeDownload ActionType，实现 Canvas 纵向拼接 + Blob 下载；在 browser-tools.ts 注册 browser_composite_download 工具供 Agent/Skill 调用。

## 执行内容摘要
- action-executor.ts: 新增 `compositeDownload` ActionType 枚举值
- action-executor.ts: 新增 `screenshots`(string) 和 `fileName`(string) 字段到 BrowserAction 接口
- action-executor.ts: 实现 `executeCompositeDownload` 异步函数 — 并行加载 Image → Canvas 纵向拼接 → toBlob → `<a download>` 触发浏览器下载
- action-executor.ts: executeAction switch 中新增 `compositeDownload` case
- browser-tools.ts: TOOL_MAPPINGS 新增 `browser_composite_download` → `compositeDownload` 映射
- browser-tools.ts: BROWSER_TOOLS 新增完整工具定义（screenshots + file_name 参数）

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
