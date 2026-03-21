# Debug Log 分析报告 — debug-log-2026-03-21T14-34-26-549Z.json

## 日志概况

- 总日志数：146 条
- 时间跨度：190.4 秒
- 日志类型分布：connection 68 (47%)、message_in 43、execution 28、message_out 7

---

## 问题 1：重连风暴 — 固定间隔无指数退避（严重度：HIGH）

### 现象
- 27 次重连尝试，固定 3 秒间隔，持续 ~81 秒才成功连接
- 每次重连 `connecting → disconnected` 间隔仅 3ms（连接瞬间失败）
- 占总日志 47%，严重干扰调试

### 根因
`ws-client.ts` 的 `scheduleReconnect()` 使用固定 `reconnectInterval: 3000`，`maxReconnectAttempts: Infinity`

### 修复方案
- 实现指数退避：1s → 2s → 4s → 8s → 16s → max 30s
- 添加随机抖动（jitter）防止多客户端同步重连
- 设置合理的最大重连次数（如 20 次后进入 `failed` 状态）
- 重连日志合并（不每次都记录，改为 `第 N 次重连...`）

---

## 问题 2：导航后内容脚本失效 — Agent 无法操作新页面（严重度：HIGH）

### 现象
- `browser_navigate` 到 google.com 后，`browser_type(selector: "input[name='q']")` 失败
- `querySelector('input')` 只找到 `<input type="file">`（不是搜索框）
- `waitForElement` 也超时（5000ms）
- Agent 耗尽 5 步都无法完成任务

### 根因
`background.ts` 的 `browser.tabs.update(tabId, { url })` 立即返回成功，
但新页面尚未加载完成，content script 未注入。VSCode 立即发下一个工具调用时，
content script 要么不存在，要么还在旧页面。

### 修复方案
在 `background.ts` 的 navigate 处理中：
1. 调用 `browser.tabs.update()` 后
2. 监听 `browser.tabs.onUpdated` 等待 `status === 'complete'`
3. 尝试 ping content script 确认已就绪
4. 全部完成后才 `sendResponse({ success: true })`

---

## 问题 3：WebSocket 在 Agent 执行期间频繁断连（严重度：MEDIUM）

### 现象
- 连接在 entries 68、114、150 处中断（分别在第 1、2、3 次对话中）
- 大约每 25 秒断一次
- 断连后重连成功，但 agent 执行上下文丢失

### 根因
心跳机制：每 15 秒发 heartbeat_ping，10 秒内未收 pong 则断开。
Agent 执行时 VSCode 端可能忙于 LLM 调用，未及时回复 heartbeat_pong。
实际上如果 VSCode 正在发送 agent_step 消息，说明连接是活的，不应该被心跳超时断开。

### 修复方案
- 收到任何业务消息时重置 pong 超时计时器（不仅仅是 pong 消息）
- 即：只要有数据流动，就认为连接存活

---

## 问题 4：LLM 重复发送错误参数名（严重度：MEDIUM）

### 现象
- `browser_type` 被 LLM 调用时传 `text` 参数（应为 `value`）
- 第一次对话 5 步中有 2 步因此浪费
- 第二次对话 3 步中有 2 步因此浪费
- 即使工具定义明确要求 `value`，LLM 仍然混淆（可能因为 `browser_click` 有 `text` 参数）

### 修复方案
在 `tool-bridge.ts` 的 `toAction()` 中：
- 如果 `toolName === 'type'` 且有 `text` 无 `value`，自动将 `text` 映射为 `value`
- 或在 `browser-tools.ts` 的 `BrowserToolProvider.callTool()` 中做参数修正
- 同时优化 tool description 使其更明确

---

## 问题 5：Duplicate Messages + 每次重连都 list_models（严重度：LOW）

### 现象
- `skill_list_result` 重复收到 2 条（entries 66-67）
- 每次重连成功后立即发送 `list_models`（4 次重连 = 4 次 list_models）
- 模型列表短期内不会变化

### 影响
不影响功能，但造成不必要的开销和日志噪音。
此问题优先级较低，不在本轮处理。
