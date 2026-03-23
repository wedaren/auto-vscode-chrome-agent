## 任务
evo_v30_001: llm_translate_progressive 工具 — 翻译一批注入一批的渐进式翻译核心

## 假设
在 llm-tools.ts 中新增 handleLlmTranslateProgressive，通过 LlmToolContext 注入 BrowserToolProvider 和 WsServer 能力，实现翻译一批注入一批的渐进式流程。

## 执行内容摘要
- **llm-tools.ts**：
  - 新增 `LlmToolContext` 接口（callBrowserTool + sendTranslateProgress 回调）
  - 新增 `TranslateProgressPayload` 类型
  - 新增 `FIRST_BATCH_SIZE = 5` 和 `PROGRESSIVE_BATCH_SIZE = 15` 常量
  - 新增 `handleLlmTranslateProgressive` 函数，实现渐进式翻译核心逻辑
  - 新增 `resolveParagraphsWithIds` / `extractParagraphsWithIds` 段落解析辅助函数
  - 注册到 `LLM_TOOL_REGISTRY` 和 `listLlmTools`
  - 扩展 `callLlmTool` 签名接受 `context?: LlmToolContext`
- **skill-runner.ts**：
  - 导入 `LlmToolContext`
  - SkillRunner 类新增 `currentLlmToolContext` 字段
  - `execute()` 新增可选 `llmToolContext` 参数
  - `callTool()` 路由到 LLM 工具时构造 context，包含 callBrowserTool 和 sendTranslateProgress
- **message-handler.ts**：
  - 导入 `LlmToolContext`
  - `handleSkillExecute` 中构造 `LlmToolContext`，通过 `wsServer.send` 推送 `translate_progress` 消息

## 验收命令输出
```
out/extension.js  566.6kb
⚡ Done in 76ms
PASS
```

## 结果
pass
