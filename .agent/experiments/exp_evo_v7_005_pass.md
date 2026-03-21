# exp_evo_v7_005 — 文档全量验收

## 任务
文档全量验收：README + Chrome 指南 + VSCode 指南 + 使用案例，文档齐全且内容覆盖所有核心功能

## 验收命令输出
```
PASS
```

## 检查项

### 文件存在性
- [x] docs/ 目录存在
- [x] docs/README.md 存在
- [x] docs/chrome-extension-guide.md 存在
- [x] docs/vscode-extension-guide.md 存在
- [x] docs/use-cases.md 存在

### 内容覆盖度
- [x] README.md 包含 WebSocket 架构说明
- [x] README.md 包含快速开始、目录结构、技术栈、核心功能
- [x] chrome-extension-guide.md 包含 /new、/clear 斜杠命令
- [x] chrome-extension-guide.md 覆盖对话、模型选择、多会话、快捷键、Agent 模式、页面上下文
- [x] vscode-extension-guide.md 包含 TreeView、Activity Bar、调试视图
- [x] vscode-extension-guide.md 覆盖 MCP、Agent 模式、浏览器工具、常用命令
- [x] use-cases.md 包含 38 个 ## 标题（≥5），5 个完整使用案例，每个含操作步骤

### 构建验证
- [x] Chrome 插件 build 无 error
- [x] VSCode 插件 compile 无 error

### program.md 约束
- [x] 文档正确引用 vscode.lm API，未引入外部 API key 依赖
- [x] Chrome 插件不内置模型（文档描述一致）
- [x] 未引入 program.md 禁止的外部依赖

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
