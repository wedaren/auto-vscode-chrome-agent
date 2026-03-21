## 任务
evo_v10_002: WebSocket 协议扩展 + Chrome 侧数据接收：chat_response_end / agent_complete payload 附加 llmDetail 字段，Chrome useChat hook 接收并关联到对应 assistant 消息

## 假设
本次尝试：VSCode 侧 message-handler.ts 已在 evo_v10_001 中完成 llmDetail 发送，本任务只需在 Chrome 侧完成接收：
1. Message 接口添加 llmDetail 可选字段
2. useChat hook 在 chat_response_end 和 agent_complete 处理中提取 llmDetail 并存入对应 assistant 消息

## 执行内容摘要
- message-factory.ts: Message 接口新增 `llmDetail?: Record<string, unknown>` 字段
- message-factory.ts: createMessage 函数 options 参数支持 llmDetail 透传
- useChat.ts chat_response_end: 从 payload 提取 llmDetail，通过 Partial<Message> update 关联到目标消息
- useChat.ts agent_complete: 从 payload 提取 llmDetail，同时兼容 finalAnswer 和 content 字段名
- useChat.ts agent_complete 异常恢复分支: 创建新消息时也传递 llmDetail

## 验收命令输出
```
src/message-handler.ts: llmDetail (5 matches)
utils/message-factory.ts: llmDetail (3 matches)
hooks/useChat.ts: llmDetail (11 matches)
PASS
```

VSCode 插件 `npm run compile` 通过（0 errors）
Chrome 插件 `npx tsc --noEmit` 通过（0 errors）

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
