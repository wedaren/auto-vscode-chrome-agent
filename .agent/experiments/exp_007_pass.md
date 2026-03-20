## 任务
task_007: chrome-devtools-mcp 集成

## 假设
使用 @modelcontextprotocol/sdk 的 StdioClientTransport 启动 chrome-devtools-mcp 子进程，封装为 McpClient 类，集成到 extension.ts 生命周期管理中。

## 执行内容摘要
- 安装 `@modelcontextprotocol/sdk` 依赖
- 创建 `src/mcp-client.ts`：McpClient 类，封装 connect/listTools/callTool/dispose
- 修改 `src/extension.ts`：初始化 McpClient，注册 `browser-agent.connectDevtools` 命令，deactivate 时关闭
- 修改 `package.json`：添加新命令注册和依赖

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
