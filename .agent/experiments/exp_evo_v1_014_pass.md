## 任务
evo_v1_014: Chrome 对话修复全量验收：消息格式 + 上下文感知 + 状态管理，双端构建通过

## 验收范围
本任务为 evo_v1_011 ~ evo_v1_013 三轮修复的全量验收，覆盖：
1. models_list 返回 { models } 对象包裹格式 + select_model 接收 modelId
2. chat 处理器提取 context（url/title/selectedText）并拼入 system prompt
3. isStreaming 发送失败恢复 + chat_response_end 兼容空字符串 + 断连状态清理

## 验收命令输出
PASS

## 详细检查结果

### acceptance_cmd（60/60）
- VSCode `npm run compile`：零 error
- Chrome `npm run build`：零 error（仅 chunk size warning）
- extension.ts 包含 `modelId` 和 `context` 关键字：✅

### TypeScript 严格模式（20/20）
- tsconfig.base.json `"strict": true`
- 双端编译零 error、零 warning

### program.md 约束（20/20）
- 模型调用仅通过 vscode.lm API（lm-service.ts + report-generator.ts）：✅
- Chrome 插件不内置模型：✅
- 无外部 API key 依赖（grep apiKey/openai/anthropic 零命中）：✅
- 新增文件均有顶部注释：✅

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
