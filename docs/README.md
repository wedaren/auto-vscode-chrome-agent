# Browser Agent

Chrome 插件 + VSCode 插件的 AI Agent 系统。用户在 Chrome Side Panel 中对话，VSCode 作为 Agent 大脑调用语言模型，实现浏览器上下文感知、智能对话和自动化浏览器操作。

---

## 架构概览

```
┌─────────────────────┐        WebSocket         ┌─────────────────────┐
│    Chrome 插件       │  ◄──── localhost:7777 ───►  │    VSCode 插件       │
│   (前端入口)         │        JSON 消息协议       │   (Agent 大脑)       │
├─────────────────────┤                           ├─────────────────────┤
│ Side Panel (React)  │                           │ vscode.lm API      │
│ - 对话界面           │                           │ - 调用语言模型       │
│ - 模型选择           │                           │ - 流式响应           │
│ - 多会话管理         │                           │                     │
│                     │                           │ Agent Loop (ReAct)  │
│ Content Script      │                           │ - 工具调用循环       │
│ - 页面上下文感知     │                           │ - 推理 + 行动       │
│ - 浏览器操作执行     │                           │                     │
│                     │                           │ MCP Client          │
│ Background Script   │                           │ - chrome-devtools   │
│ - 消息中枢          │                           │ - 浏览器工具注册     │
│ - WebSocket 管理     │                           │                     │
│                     │                           │ 调试视图             │
│                     │                           │ - 连接状态           │
│                     │                           │ - 消息日志           │
│                     │                           │ - Agent 循环可视化   │
└─────────────────────┘                           └─────────────────────┘
```

### 核心通信流程

1. 用户在 Chrome Side Panel 输入消息
2. Chrome 插件通过 WebSocket 将消息 + 页面上下文发送到 VSCode
3. VSCode 插件调用 `vscode.lm` API 请求语言模型（需 GitHub Copilot 订阅）
4. 语言模型返回响应（支持流式输出），如需操作浏览器则触发 Agent Loop
5. Agent Loop 通过 ReAct 模式自主调用浏览器工具（点击、输入、导航等）
6. 最终响应通过 WebSocket 返回 Chrome 插件显示

### 消息协议

```json
{
  "type": "chat_message | context_update | tool_call | ...",
  "payload": { ... },
  "sessionId": "uuid"
}
```

---

## 快速开始

### 前置条件

- **Node.js** >= 18.0.0
- **pnpm**（包管理器）
- **VSCode** >= 1.96.0
- **GitHub Copilot** 订阅（用于 vscode.lm API 调用语言模型）
- **Chrome** 浏览器

### 安装

```bash
# 1. 克隆仓库
git clone <repo-url>
cd auto-vscode-chrome-agent

# 2. 安装依赖
pnpm install

# 3. 构建所有包
pnpm build
```

### 启动 VSCode 插件

```bash
# 编译 VSCode 插件
pnpm --filter vscode-ext compile

# 开发模式（监听文件变化自动编译）
pnpm dev:vscode
```

然后在 VSCode 中按 `F5` 启动插件开发宿主窗口，插件会自动激活并在端口 7777 启动 WebSocket 服务。

### 启动 Chrome 插件

```bash
# 开发模式启动 Chrome 插件
pnpm dev:chrome
```

在 Chrome 中加载开发版插件：

1. 打开 `chrome://extensions/`
2. 启用「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `packages/chrome-ext/.output/chrome-mv3/` 目录
5. 在任意页面点击插件图标，打开 Side Panel 开始对话

### 一键开发

```bash
# 同时启动 VSCode 和 Chrome 插件的开发模式
bash watch.sh
```

---

## 目录结构

```
auto-vscode-chrome-agent/
├── package.json              # Monorepo 根配置
├── pnpm-workspace.yaml       # pnpm workspaces 配置
├── tsconfig.base.json        # 共享 TypeScript 配置
├── tick.sh                   # Agent 系统启动脚本
├── watch.sh                  # 双端开发监听脚本
├── evolve.sh                 # 功能进化脚本
│
├── packages/
│   ├── chrome-ext/           # Chrome 插件（WXT 框架）
│   │   ├── entrypoints/
│   │   │   ├── sidepanel/    # Side Panel 入口（React）
│   │   │   │   ├── App.tsx       # 主应用组件
│   │   │   │   └── main.tsx      # 渲染入口
│   │   │   ├── background.ts     # Background Script（消息中枢 + WebSocket）
│   │   │   └── content.ts        # Content Script（页面上下文 + 操作执行）
│   │   ├── components/       # UI 组件
│   │   │   ├── ChatInput.tsx         # 聊天输入框（快捷键 + 斜杠命令）
│   │   │   ├── MessageBubble.tsx     # 消息气泡（Markdown 渲染）
│   │   │   ├── ModelSelector.tsx     # 模型选择器
│   │   │   ├── ConversationList.tsx  # 多会话列表
│   │   │   ├── AgentStepView.tsx     # Agent 步骤展示
│   │   │   ├── TypingIndicator.tsx   # 打字指示器
│   │   │   └── WelcomeScreen.tsx     # 欢迎页
│   │   ├── hooks/            # React Hooks
│   │   │   ├── useChat.ts           # 聊天状态管理
│   │   │   ├── useChatStorage.ts    # 聊天记录持久化
│   │   │   ├── usePageContext.ts    # 页面上下文获取
│   │   │   └── useWebSocket.ts      # WebSocket 连接管理
│   │   ├── utils/            # 工具模块
│   │   │   ├── action-executor.ts   # 浏览器操作执行器
│   │   │   ├── tool-bridge.ts       # 工具调用桥接
│   │   │   └── message-factory.ts   # 消息工厂
│   │   ├── src/
│   │   │   └── ws-client.ts         # WebSocket 客户端
│   │   ├── wxt.config.ts    # WXT 框架配置
│   │   └── tailwind.config.ts # Tailwind CSS 配置
│   │
│   └── vscode-ext/           # VSCode 插件
│       └── src/
│           ├── extension.ts          # 插件入口（激活 + 注册命令）
│           ├── ws-server.ts          # WebSocket 服务端（端口 7777）
│           ├── message-handler.ts    # 消息路由与处理
│           ├── lm-service.ts         # vscode.lm API 封装
│           ├── agent-loop.ts         # ReAct Agent 循环
│           ├── browser-tools.ts      # 浏览器工具注册表
│           ├── mcp-client.ts         # MCP 协议客户端
│           ├── command-registry.ts   # 命令注册中心
│           ├── report-generator.ts   # 深度报告生成器
│           ├── connection-tree.ts    # 连接状态 TreeView
│           ├── message-tree.ts       # 消息日志 TreeView
│           └── agent-tree.ts         # Agent 循环 TreeView
│
├── .agent/                   # Agent 系统管理目录
│   ├── program.md            # 需求基准（只读）
│   ├── tasks.json            # 任务队列
│   ├── state.json            # 系统状态
│   ├── decisions.md          # 技术决策日志
│   ├── knowledge/            # Research 积累
│   ├── experiments/          # 迭代实验记录
│   └── inbox/                # 需要人工介入时写入
│
└── docs/                     # 项目文档
    └── README.md             # 本文件
```

---

## 技术栈

| 组件 | 技术 |
|------|------|
| Monorepo | pnpm workspaces |
| Chrome 插件 | WXT + React + Tailwind CSS |
| VSCode 插件 | VSCode Extension API + vscode.lm |
| 通信 | WebSocket (`ws` 库)，端口 7777 |
| 语言模型 | vscode.lm API（GPT-4o / Claude 3.5 Sonnet 等） |
| 工具协议 | MCP (Model Context Protocol) |
| MCP 客户端 | @modelcontextprotocol/sdk |
| 语言 | TypeScript 严格模式 |

---

## 核心功能

- **智能对话**：在 Chrome Side Panel 中与 AI 对话，支持 Markdown 渲染和代码高亮
- **模型选择**：动态选择 VSCode 中可用的语言模型
- **多会话管理**：创建、切换、删除多个独立对话
- **页面上下文感知**：自动获取当前页面 URL、选中文本等上下文
- **浏览器自动操作**：Agent 可自主执行点击、输入、导航等浏览器操作
- **Agent 模式 (ReAct)**：语言模型通过推理-行动循环自主使用工具
- **MCP 工具集成**：通过 chrome-devtools-mcp 获取浏览器 DevTools 能力
- **调试视图**：VSCode Activity Bar 中的连接状态、消息日志、Agent 循环可视化
- **深度报告**：基于浏览器上下文生成结构化分析报告

---

## 架构设计

- [浏览器智能层最优架构设计](/Users/wedaren/repositoryDestinationOfGithub/auto-vscode-chrome-agent/docs/browser-intelligence-architecture.md)：面向长期演进的页面语义建模、结构化 patch、验证与回滚架构

---

## License

MIT
