## 任务
evo_v25_001: VSCode 侧图片类型识别：toMcpToolResult 区分 image 类型 + agent_step 增加 imageData 字段 + formatToolResult 图片摘要

## 假设
本次尝试：在 VSCode 侧完成图片数据流的识别与分离——toMcpToolResult 检测 screenshot 字段并返回 MCP image 内容项，formatToolResult 将 image 类型转为文本摘要避免 base64 进入 LLM 上下文，imageData 通过 AgentStep 和 WebSocket 传递到 Chrome 前端。

## 执行内容摘要
- browser-tools.ts `toMcpToolResult`: 新增 screenshot 字段检测，解析 data URL 提取 mimeType 和 base64，返回 `{ type: 'image', data, mimeType }` 内容项
- agent-loop.ts `AgentStep` 接口: 新增可选 `imageData` 字段
- agent-loop.ts 新增 `ToolResultFormatted` 内部接口 (`{ text, imageData? }`)
- agent-loop.ts `formatToolResult`: 返回值由 string 改为 ToolResultFormatted，image 类型返回 `[截图已获取]` 摘要文本 + imageData
- agent-loop.ts `executeTool`: 返回值由 string 改为 ToolResultFormatted，run_skill 路径包裹为 `{ text }`
- agent-loop.ts observe 步骤创建: 从 toolResult 中提取 imageData 传入 createStep
- agent-loop.ts `createStep`: 新增 imageData 参数
- message-handler.ts `onStep` 回调: agent_step payload 新增可选 imageData 字段

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
