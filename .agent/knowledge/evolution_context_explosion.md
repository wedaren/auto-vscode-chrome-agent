# 浏览器上下文爆炸问题 — 调研报告

## 问题分析

### 当前系统现状
1. **selectedText 无大小限制** — 用户可选中整页文本（可达 100K+ 字符）
2. **工具观察结果无截断** — browser_get_page_content 等工具可返回完整 DOM
3. **AgentLoop messages 数组无限增长** — 每轮 ReAct 添加 assistant + observation
4. **无 token 计数/预算** — 不知道已消耗/剩余多少上下文窗口
5. **System Prompt 无上下文预算** — buildSystemPrompt 全量拼接

### 风险
- LLM 超过 context window 直接报错（vscode.lm API 会 throw）
- 上下文过长导致 "context rot"（模型注意力稀释，质量下降）
- WebSocket 传输大文本造成延迟
- 内存占用过高

## 行业最佳实践（2025-2026）

### 分层防御（推荐）
参考 Anthropic Context Engineering 和 OpenClaw 4-layer defense：
1. **源头限制** — 采集时截断（Chrome 侧）
2. **入口过滤** — 收到后二次检查（VSCode 侧）
3. **运行时预算** — AgentLoop 中 token budget 管控
4. **溢出兜底** — 超限时 graceful degradation

### Token 估算公式
- 英文：~4 chars/token
- 中文：~2 chars/token
- 混合文本保守估算：~3 chars/token

### 截断策略
- **Smart Truncate**: 保留头部 + 尾部，中间用 `...[已截断 N 字符]...` 替代
- **观察结果截断**: 工具返回值保留前 N 字符 + 结构化摘要
- **消息窗口**: 保留 system prompt + 最近 K 轮对话，移除中间轮次

## 推荐常量

```typescript
// Chrome 侧采集限制
const MAX_SELECTED_TEXT_CHARS = 8000;     // ~2K-4K tokens
const MAX_URL_CHARS = 2000;
const MAX_TITLE_CHARS = 500;

// VSCode 侧 system prompt 预算
const MAX_SYSTEM_PROMPT_CONTEXT_CHARS = 12000;  // ~3K-6K tokens

// AgentLoop 限制
const MAX_OBSERVATION_CHARS = 6000;       // 单次工具结果
const MAX_MESSAGES_TOKEN_BUDGET = 80000;  // ~26K tokens，为回复留空间
const MAX_AGENT_ROUNDS = 15;             // 已有，保持
```

## 参考来源
- Anthropic: Effective Context Engineering for AI Agents
- Factory.ai: The Context Window Problem
- Agenta: Top Techniques to Manage Context Length in LLMs
