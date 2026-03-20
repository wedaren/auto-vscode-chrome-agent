# Evolution Research: Chrome 插件对话选模型

## 功能目标
用户在 Chrome side panel 中可以看到 VSCode 侧可用的 vscode.lm 模型列表，选择后对话使用该模型。

## 现状分析

### VSCode 侧 (lm-service.ts)
- `selectModel()` 硬编码优先 gpt-4o family，fallback 到任意 copilot 模型
- 没有暴露可用模型列表的方法
- `sendMessage()` / `sendMessageStreaming()` 每次调用 `selectModel()` 重新选择

### Chrome 侧 (App.tsx)
- 没有任何模型选择 UI
- 仅通过 WebSocket 发送 `chat` 类型消息
- 接收 `chat_response`、`echo`、`pong` 类型消息

### WebSocket 协议 (ws-server.ts)
- BridgeMessage: `{ type, payload, sessionId }`
- 已有消息类型: ping/pong, chat, report_progress, report_result
- 支持 externalHandler 扩展

## 技术方案

### 新增 WebSocket 消息类型
1. `list_models` (Chrome → VSCode): 请求可用模型列表
2. `models_list` (VSCode → Chrome): 返回模型列表
3. `select_model` (Chrome → VSCode): 选择模型

### 模型信息结构
```typescript
interface ModelInfo {
  id: string;        // 模型唯一标识
  name: string;      // 显示名称
  vendor: string;    // 供应商 (如 copilot)
  family: string;    // 模型族 (如 gpt-4o)
  maxInputTokens: number;
}
```

### vscode.lm API 关键点
- `vscode.lm.selectChatModels({})` 传空对象可获取所有可用模型
- 返回 `LanguageModelChat[]`，每个有 id, name, vendor, family, maxInputTokens
- 可以缓存模型实例，通过 id 查找

## 影响文件
1. `packages/vscode-ext/src/lm-service.ts` - 新增 listModels(), selectModelById()
2. `packages/vscode-ext/src/ws-server.ts` - 新增消息类型处理
3. `packages/vscode-ext/src/extension.ts` - 注册新的 WebSocket 消息处理器
4. `packages/chrome-ext/components/ModelSelector.tsx` - 新组件
5. `packages/chrome-ext/entrypoints/sidepanel/App.tsx` - 集成 ModelSelector
