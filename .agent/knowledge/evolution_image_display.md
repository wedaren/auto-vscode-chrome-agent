# 图片展示体验优化 — Research

## 问题现状

### Debug-log 发现
文件：`debug-log-2026-03-22T04-21-45-769Z.json`

用户执行 "进入 baidu.com"，Agent 调用 `browser_screenshot` 截图，返回的 base64 数据 `data:image/png;base64,...`
在 observe 步骤中作为 **纯 JSON 文本** 展示，用户看到的是一大段乱码字符而非图片。

### 数据流分析

```
browser_screenshot 调用
  → Chrome captureVisibleTab() → "data:image/png;base64,..."
  → ToolResultPayload: { success: true, data: { screenshot: "data:image/..." } }
  → toMcpToolResult(): JSON.stringify(data) → 纯文本 '{"screenshot": "data:image/..."}'
  → formatToolResult(): 提取 text 字段 → 纯字符串
  → observe step.content = 纯 base64 JSON 文本
  → AgentStepView.ObserveContent 渲染为 plain text ❌
```

### 关键断点

1. **VSCode 侧 `toMcpToolResult()`** (browser-tools.ts:484-499)：不区分 image 和 text，所有结果都 JSON.stringify
2. **VSCode 侧 `formatToolResult()`** (agent-loop.ts:784-801)：只处理 `{ type: 'text' }` 内容，无 image 类型
3. **Chrome 侧 `AgentStepView.ObserveContent`**：纯文本渲染，不识别 base64 图片 URL
4. **Chrome 侧 `MessageBubble` marked 实例**：未配置 `image()` 渲染器
5. **Chrome 侧 CSS**：无任何图片样式

## 行业最佳实践

### 图片渲染

- **内联预览**：在消息流中直接渲染缩略图（max-width: 100%, 圆角, 阴影）
- **点击放大**：Lightbox/Modal 全屏查看原图
- **懒加载**：base64 图片较大时使用 loading="lazy"
- **响应式**：side panel 宽度有限（~350px），图片需自适应

### 数据传输优化

- **MCP 标准 image 类型**：`{ type: 'image', data: base64, mimeType: 'image/png' }` 与 text 分离
- **observe 步骤**：截图摘要发给 LLM（"[截图已获取，分辨率 1920x1080]"），避免 base64 撑爆 token 预算
- **前端单独传图**：WebSocket 增加 image payload 字段，而非塞进 content 字符串

## 涉及文件

### VSCode 侧
- `packages/vscode-ext/src/browser-tools.ts` — toMcpToolResult 需区分 image
- `packages/vscode-ext/src/agent-loop.ts` — formatToolResult + observe step 图片摘要
- `packages/vscode-ext/src/message-handler.ts` — agent_step payload 增加 imageData 字段

### Chrome 侧
- `packages/chrome-ext/components/AgentStepView.tsx` — ObserveContent 渲染 base64 图片
- `packages/chrome-ext/components/MessageBubble.tsx` — marked image renderer
- `packages/chrome-ext/assets/style.css` — 图片样式 + Lightbox CSS

### 新增组件
- `packages/chrome-ext/components/ImagePreview.tsx` — 图片预览 + Lightbox 组件
