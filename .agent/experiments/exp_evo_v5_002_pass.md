## 任务
evo_v5_002: 连接状态 TreeView：WebSocket 服务器状态 + MCP 连接状态 + 当前模型信息实时展示

## 假设
在已有的占位 connection-tree.ts 基础上实现完整的 TreeDataProvider，需要：
1. 各服务（WsServer / McpClient / LmService）暴露状态变更事件
2. ConnectionTreeDataProvider 通过 bind() 接收服务引用并订阅事件
3. 3 个顶级节点各自展开为详细子节点

## 执行内容摘要
- **connection-tree.ts**：完全重写，实现 3 个顶级节点（WebSocket Server / MCP 连接 / 当前模型）+ 各自子节点（端口、监听状态、客户端数 / 连接状态、工具列表 / 名称、vendor、family、maxInputTokens）；bind() 方法注入服务并订阅事件
- **ws-server.ts**：新增 `onDidChangeState` 事件发射器、`listening` / `clientCount` / `port` getter；在 listening / connection / close / dispose 时触发事件
- **mcp-client.ts**：新增 `onDidChangeState` 事件发射器、`discoveredTools` getter；connect() 成功后自动发现并缓存工具列表；disconnect/dispose 时清空并触发事件
- **lm-service.ts**：新增 `onDidChangeModel` 事件发射器、`currentModel` getter、`dispose()` 方法；selectModelById() 时触发事件
- **extension.ts**：创建 ConnectionTreeDataProvider 后调用 bind() 注入服务；deactivate() 中调用 lmService.dispose()

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
