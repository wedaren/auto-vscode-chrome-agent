# Research: Chrome 对话无法正常工作 — 根因分析

## 调研日期: 2026-03-20

## 问题概述
Chrome side panel 对话功能无法正常工作，经代码审查发现以下根因：

---

## Bug #1 (P0) — models_list 响应格式不匹配

**位置**:
- VSCode 发送: `packages/vscode-ext/src/extension.ts:44-48`
- Chrome 接收: `packages/chrome-ext/entrypoints/sidepanel/App.tsx:146`

**问题**:
```typescript
// VSCode 发送 — payload 直接是数组
payload: models   // ModelInfo[]

// Chrome 接收 — 期望 payload 是对象 { models: ModelInfo[] }
const modelsList = (msg.payload as { models: ModelInfo[] })?.models ?? [];
// 结果：models 属性为 undefined，降级为空数组 []
```

**影响**: 模型列表永远为空，下拉框没有可选模型。

**修复方案**: VSCode 侧改为 `payload: { models }` 或 Chrome 侧直接使用 `msg.payload as ModelInfo[]`

---

## Bug #2 (P0) — select_model 字段名不匹配

**位置**:
- Chrome 发送: `App.tsx:206` — `{ modelId }`
- VSCode 接收: `extension.ts:64` — `{ id }`

**影响**: 模型 ID 解析为 undefined，selectModelById(undefined) 永远失败。

**修复方案**: 统一字段名。

---

## Bug #3 (P1) — chat 消息 context 被完全忽略

**位置**: `extension.ts:89`

Chrome 发送了 `{ text, context: { url, title, selectedText } }`，但 VSCode 侧只提取 `text`，context 完全丢弃。违反了"浏览器上下文感知"核心设计目标。

**修复方案**: 提取 context，拼入 system prompt 或 user message。

---

## Bug #4 (P1) — isStreaming 状态无法恢复

**位置**: `App.tsx:220-247`

handleSendMessage 在发送前设置 `isStreaming = true`，但如果 WebSocket 发送失败（send 返回 false），isStreaming 无法恢复到 false，导致 UI 永久锁定。

**修复方案**: 检查 sendMessage 返回值，失败时恢复状态并提示用户。

---

## Bug #5 (P2) — chat_response_end fullText 边缘情况

**位置**: `App.tsx:116`

`if (targetId && endPayload?.fullText)` — 当 fullText 为空字符串（取消场景）时条件失败，不会执行清理逻辑。虽然 streamingMsgIdRef 和 isStreaming 在后面还是会被重置，但消息内容可能不一致。

**修复方案**: 改用 `endPayload?.fullText !== undefined` 或 `typeof endPayload?.fullText === 'string'`。
