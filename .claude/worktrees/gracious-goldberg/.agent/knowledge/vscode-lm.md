# vscode.lm API Research

## 结论
1. `vscode.lm` 是 VSCode 官方 Language Model API，通过 `selectChatModels()` + `sendRequest()` 调用 Copilot 提供的模型，**需要用户有 GitHub Copilot 订阅**。
2. 支持的模型家族：`gpt-4o`、`gpt-4o-mini`、`o1`、`o1-mini`、`claude-3.5-sonnet`，推荐 `gpt-4o`（64K token 上限）。
3. Rate limit 由 GitHub 服务端控制（按分钟/小时），无明确公开数值；VSCode 支持 auto model selection 自动降级以减少限流。

## 关键 API / 配置

```typescript
// 选择模型
const [model] = await vscode.lm.selectChatModels({
  vendor: 'copilot',
  family: 'gpt-4o'
});

// 构造消息
const messages = [
  vscode.LanguageModelChatMessage.User('你的 prompt')
];

// 发送请求（流式返回）
const response = await model.sendRequest(messages, {}, token);

// 读取流式响应
for await (const fragment of response.text) {
  console.log(fragment);
}
```

**package.json 声明**：需要在 `extensionDependencies` 加 `"github.copilot-chat"`。

**maxInputTokens**：模型对象上有 `model.maxInputTokens` 属性（gpt-4o = 64K）。

**消息类型**：支持 `User` 和 `Assistant` 两种角色。可选用 `@vscode/prompt-tsx` 做动态 prompt 构建。

## 注意事项
- **必须在用户操作中调用**：`selectChatModels` 需在用户触发的 command 中调用（首次会弹出授权对话框）。
- **不能用于自动化测试**：官方明确说明不要在集成测试中使用此 API。
- **错误处理**：需捕获 `vscode.LanguageModelError`，包含 `message`、`code`、`cause`。
- **Rate limit 处理**：被限流时返回特定错误码，需在 UI 上提示用户等待。
- **Copilot 订阅是硬性前提**：无订阅用户 `selectChatModels` 返回空数组。

## 来源
- [VSCode Language Model API 官方文档](https://code.visualstudio.com/api/extension-guides/ai/language-model)
- [VSCode AI Language Models 文档](https://code.visualstudio.com/docs/copilot/customization/language-models)
- [Roo Code - VSCode LM Provider 文档](https://docs.roocode.com/providers/vscode-lm)
- [GitHub Community 讨论 - Rate Limit Issues](https://github.com/orgs/community/discussions/150373)
