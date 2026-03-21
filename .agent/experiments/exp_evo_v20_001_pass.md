## 任务
evo_v20_001: McpClient 配置增强：VSCode settings 可配置 MCP 启动参数 + 完整工具 Schema 存储

## 假设
在 package.json 声明 browserAgent.mcp.* 配置项，McpClient.connect() 通过 buildMcpArgs() 函数读取 VSCode settings 动态构建启动参数；扩展 _discoveredTools 类型为含 inputSchema 的 McpToolInfo 接口；listTools() 保存完整 Schema。

## 执行内容摘要
- package.json 新增 6 个 browserAgent.mcp.* 配置项：browserUrl / autoConnect / headless / slim / noUsageStatistics / extraArgs
- 新增 McpToolInfo 接口（name + description + inputSchema）
- 新增 buildMcpArgs() 函数，从 VSCode settings 动态构建 npx 启动参数
- connect() 调用 buildMcpArgs() 替代硬编码参数
- listTools() 返回值扩展为 McpToolInfo[]，包含完整 inputSchema
- _discoveredTools 类型从 { name, description } 升级为 McpToolInfo
- 向后兼容：McpToolInfo 是旧类型的超集，现有代码无需修改

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
