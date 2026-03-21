# Browser Agent 愿景研究

## 调研日期
2026-03-21

## 现状分析

当前系统已实现：
- Chrome Side Panel 对话界面（流式响应、Markdown 渲染、模型选择）
- VSCode 作为 Agent 大脑（vscode.lm API）
- 页面上下文感知（URL、标题、选中文本）
- MCP 集成（chrome-devtools-mcp，30+ 浏览器自动化工具）
- 深度报告生成（多页面探索 + 分析 + Markdown 报告）

## 核心差距：从"聊天机器人"到"真正的 Agent"

当前系统本质上是一个**带页面上下文的聊天机器人**。用户问问题，LM 回答。
真正的 Agent 应该能**主动行动**——浏览页面、点击按钮、填表单、提取数据、跨标签页协作。

### 关键缺失能力（按优先级排序）

#### P0: Agentic Tool Use（Agent 工具调用循环）
- 当前 MCP 已接入但**未连接到聊天流程**
- ReportGenerator 有简单的 agent 循环，但仅限于报告场景
- 需要：LM 在对话中决定何时使用工具，执行后观察结果，循环迭代
- 这是最基础的能力，其他一切都依赖它

#### P1: Multi-turn Conversation Memory
- 当前每条消息独立处理，无对话历史
- LM 看不到之前的对话，无法追问或迭代
- 需要：维护对话上下文窗口，支持多轮对话

#### P1: Persistent Knowledge
- 会话结束后所有信息丢失
- 需要：保存对话、书签、笔记、数据提取结果

#### P2: Workflow Automation
- 用户需要手动触发每个操作
- 需要：定义可重复的工作流，如"每天检查竞品价格"

#### P2: Cross-tab Orchestration
- 当前只感知单个活动标签页
- 需要：同时在多个标签页执行任务

#### P3: Proactive Intelligence
- Agent 被动等待用户指令
- 需要：基于页面内容主动提建议（如"这个页面有安全风险"）

## 选择最基础功能：Agentic Tool Use（Agent Loop）

### 为什么是它？
1. **基础性**：所有高级功能（自动化、多标签、主动智能）都需要 Agent 能执行工具
2. **可复用性**：ReAct 循环是通用 Agent 架构，适用于所有场景
3. **已有基础**：MCP 已集成，ReportGenerator 有参考模式
4. **用户价值最大**：立刻让用户从"问答"升级为"操作"

### 技术方案：ReAct 模式

```
用户: "帮我找到这个页面上所有的外部链接"

Agent 思考: 需要获取页面 DOM，提取所有 <a> 标签
Agent 行动: [mcp.evaluate] document.querySelectorAll('a[href^="http"]')
Agent 观察: 找到 23 个外部链接
Agent 思考: 需要过滤并去重
Agent 行动: [分析结果]
Agent 回复: "页面上共有 23 个外部链接，去重后 18 个，主要指向..."
```

### 实现关键点

1. **AgentLoop 类**：封装 think→act→observe 循环
   - 最大步数限制（防止无限循环）
   - 每步通过 WebSocket 实时推送状态
   - 支持 CancellationToken 中断

2. **Tool Registry**：统一管理可用工具
   - MCP 工具（浏览器操作）
   - 内置工具（搜索、计算等）
   - 工具描述供 LM 选择

3. **WebSocket 协议扩展**：
   - `agent_step`: Agent 执行了一个步骤（思考/行动/观察）
   - `agent_complete`: Agent 循环结束

4. **Chrome UI 扩展**：
   - AgentStepView 组件：展示 Agent 的思考和行动过程
   - 折叠/展开步骤详情
   - 实时进度展示

## 与现有代码的关系

- `AgentLoop` 可参考 `ReportGenerator` 的模式，但更通用
- `MessageHandler` 需要增加路由：判断是否需要工具调用
- `McpClient` 已有 `callTool()` 方法，可直接复用
- Chrome 侧 `useChat` 需要处理新消息类型
- `MessageBubble` 需要支持 Agent 步骤的特殊渲染
