# 自动决策日志

如有异议，在对应行添加 [OVERRIDE] 标记，系统下次 tick 自动检测并重新决策。

---

[task_000][2026-03-20] 决策：确认 vscode.lm API 作为 LLM 调用方案
原因：官方 API，稳定可靠，支持 gpt-4o / claude-3.5-sonnet 等模型，流式输出。需要 Copilot 订阅是可接受的前提条件。
research 依据：knowledge/vscode-lm.md
---

[task_000][2026-03-20] 决策：WebSocket 端口使用 7777（program.md 基准），而非 tasks.json 中的 7890
原因：program.md 是需求基准文件（只读），明确写了端口 7777。tasks.json task_003 的 acceptance_cmd 检查 7890 是错误的，后续 coding 阶段需修正。
research 依据：knowledge/websocket.md
---

[task_000][2026-03-20] 决策：WebSocket Server 使用 `ws` 库在 activate() 中启动，EADDRINUSE 时提示用户修改配置
原因：`ws` 是 Node.js 生态最成熟的 WebSocket 库，VSCode 插件 host 原生支持。端口冲突采用报错 + 可配置方案，比自动递增更可预测。
research 依据：knowledge/websocket.md
---

[task_000][2026-03-20] 决策：Chrome 插件使用 WXT 框架，Side Panel 作为入口，React + Tailwind 构建 UI
原因：WXT 原生支持 MV3 Side Panel，自动生成 manifest.json，文件约定式路由。社区活跃，与 program.md 技术选型完全一致。
research 依据：knowledge/chrome-ext.md
---

[task_000][2026-03-20] 决策：Content Script 与 Side Panel 通信通过 Background Script 中转
原因：Chrome Extension 架构限制，Content Script 不能直接与 Side Panel 通信。Background Script 作为消息中枢是标准模式。
research 依据：knowledge/chrome-ext.md
---

[task_000][2026-03-20] 决策：chrome-devtools-mcp 通过 stdio 子进程方式集成到 VSCode 插件
原因：`npx chrome-devtools-mcp@latest` 启动子进程最简单，MCP 协议通过 stdin/stdout 通信。首次调用工具时自动启动浏览器实例。MVP 阶段先用子进程方式，后续可切换为连接已有 Chrome。
research 依据：knowledge/chrome-devtools-mcp.md
---

[task_000][2026-03-20] 决策：MCP Client SDK 使用 `@modelcontextprotocol/sdk`
原因：这是 MCP 协议的官方 TypeScript SDK，支持 stdio transport，与 chrome-devtools-mcp 的启动方式天然匹配。
research 依据：knowledge/chrome-devtools-mcp.md
---

[task_000][2026-03-20] 决策：Monorepo 使用 pnpm workspaces，packages/ 下两个子包
原因：与 program.md 技术选型一致。pnpm workspaces 是当前 monorepo 最佳实践，两个包可共享 TypeScript 类型定义（如 BridgeMessage）。
research 依据：program.md 技术选型表
---

[task_000][2026-03-20] 决策：消息协议格式 `{ type, payload, sessionId }`，JSON 编码
原因：program.md 明确要求此格式。简单、可扩展、调试友好。
research 依据：program.md + knowledge/websocket.md
---
