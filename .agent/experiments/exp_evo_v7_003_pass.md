## 任务
evo_v7_003: VSCode 插件功能使用文档：调试视图、连接 MCP、Agent 模式、浏览器工具说明

## 假设
基于 VSCode 插件源码（8个核心文件）的完整分析，创建一份结构清晰、内容全面的用户指南，覆盖所有功能模块。

## 执行内容摘要
- 创建了 docs/vscode-extension-guide.md
- 涵盖内容：
  - 安装与激活方式（F5 调试启动、开发模式编译）
  - WebSocket 服务器说明（默认端口 7777、browserAgent.port 配置项）
  - Activity Bar 调试视图：
    - 连接状态 TreeView（WebSocket/MCP/原生工具/模型 4 个节点详解）
    - 消息检查器 TreeView（200 条环形缓冲、点击查看完整 JSON）
    - Agent 循环可视化 TreeView（运行记录 + ReAct 步骤历史）
  - 连接 DevTools MCP（命令说明、连接过程、注意事项）
  - Agent 模式（触发条件：MCP 连接或 Chrome 已连接；ReAct 循环流程；最大 15 步限制；工具优先级）
  - 原生浏览器工具列表（10 个工具完整参数说明）
  - MCP DevTools 工具说明
  - 常用命令列表（4 个命令含使用示例）
  - 配置项说明
  - 常见问题（4 个 FAQ）

## 验收命令输出
PASS

## 结果
pass
