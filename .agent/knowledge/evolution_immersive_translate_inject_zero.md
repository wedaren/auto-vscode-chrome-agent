# Evolution Research: 沉浸式翻译注入失败 (injected: 0, skipped: 200)

## 问题现象

Debug log: `debug-log-2026-03-22T03-12-19-971Z.json`

immersive_translate Skill 执行 4 步：
1. ✅ Step 0 (extractParagraphs): 成功提取 200 段落，DOM 标记 `data-imt-id="imt-0"` ~ `data-imt-id="imt-199"`
2. ✅ Step 1 (llm_translate): 成功翻译 200 段落为中文（耗时 ~61 秒）
3. ❌ Step 2 (injectBilingual): `{ injected: 0, skipped: 200, total: 200 }` — 所有翻译被跳过
4. ✅ Step 3 (screenshot): 截图显示页面无任何翻译效果

## 根因分析

### 直接原因
`executeInjectBilingual` 中 `document.querySelector('[data-imt-id="imt-N"]')` 对所有 200 个 ID 均返回 null。

### 根本原因 1: Tab 切换导致工具执行目标页不同

**执行链路**:
```
tool_execute (WebSocket) → tool-bridge (side panel) → EXECUTE_ACTION (background)
→ browser.tabs.query({active: true, currentWindow: true}) → content script
```

`background.ts` 对每个 EXECUTE_ACTION 都独立执行 `browser.tabs.query({active: true, currentWindow: true})`。
extractParagraphs 和 injectBilingual 间隔 61 秒（LLM 翻译耗时），用户可能切换了 tab。
injectBilingual 被路由到错误 tab 的 content script —— 该页面无 `data-imt-id` 属性。

### 根本原因 2: SPA 页面重渲染

GitHub 等 SPA 使用 Turbo/React 等框架。页面内容区可能在 61 秒内被框架重新渲染，
新 DOM 节点不保留之前通过 JS 添加的 `data-imt-id` 属性。

## 修复方案

### 方案 A: Tab 锁定（关键修复）

Skill 执行开始时锁定目标 tab ID，后续所有步骤复用同一 tab ID，不再每次查询 active tab。

**改动点**:
1. `SkillPanel.tsx`: 执行 skill 前用 `chrome.tabs.query` 获取 activeTabId，附在 `skill_execute` 消息中
2. VSCode `message-handler.ts` / `skill-runner.ts`: 将 targetTabId 透传到每个 `tool_execute`
3. `tool-bridge.ts`: 从 `tool_execute` 中提取 targetTabId，附在 EXECUTE_ACTION payload 中
4. `background.ts`: 若 EXECUTE_ACTION 含 targetTabId 且有效，直接 `tabs.sendMessage(targetTabId, ...)`；否则回退到查询 active tab

### 方案 B: injectBilingual 自动重标记（兜底修复）

当 `data-imt-id` 选择器全部失败时，自动重新执行段落提取以重标记 DOM，然后按索引匹配翻译。

**改动点**:
- `action-executor.ts` 的 `executeInjectBilingual`:
  - 注入前先检查 `document.querySelectorAll('[data-imt-id]').length`
  - 若为 0，调用 `executeExtractParagraphs` 重新标记
  - 按索引顺序将翻译与新标记的段落配对
  - 注入翻译

## 涉及文件

| 文件 | 改动 |
|------|------|
| `packages/chrome-ext/components/SkillPanel.tsx` | 获取并传递 activeTabId |
| `packages/chrome-ext/utils/tool-bridge.ts` | 转发 targetTabId |
| `packages/chrome-ext/entrypoints/background.ts` | targetTabId 路由 |
| `packages/chrome-ext/utils/action-executor.ts` | injectBilingual 自动重标记 |
| `packages/vscode-ext/src/skill-runner.ts` | 透传 targetTabId |
| `packages/vscode-ext/src/browser-tools.ts` | tool_execute 附 targetTabId |
| `packages/vscode-ext/src/message-handler.ts` | skill_execute → SkillRunner 传 targetTabId |
