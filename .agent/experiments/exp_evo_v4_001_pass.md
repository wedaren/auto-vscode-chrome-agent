## 任务
evo_v4_001: Chrome 侧聊天记录持久化：chrome.storage.local 存储会话数据

## 假设
创建 useChatStorage Hook 封装 chrome.storage.local CRUD 操作，采用索引+详情分离存储策略；在 useChat 中集成：挂载时加载最近会话，消息变更时防抖自动持久化。

## 执行内容摘要
- 新建 `hooks/useChatStorage.ts`：
  - 定义 `Conversation` 数据模型（id/title/messages[]/createdAt/updatedAt）
  - 定义 `ConversationMeta` 轻量索引项
  - 实现 `saveConversation`：写入完整数据 + 维护索引，自动生成标题（首条用户消息前20字）
  - 实现 `loadConversation`：按 ID 加载完整会话
  - 实现 `listConversations`：返回索引列表（按 updatedAt 降序）
  - 实现 `deleteConversation`：删除数据 + 更新索引
  - 所有操作 try/catch 防错
- 修改 `hooks/useChat.ts`：
  - 导入并调用 `useChatStorage()`
  - 挂载时 `useEffect` 异步加载最近会话，恢复 conversationId + messages
  - messages 变更时 `useEffect` 防抖 500ms 自动调用 `saveConversation`
  - `isStorageInitializedRef` 防止初始加载触发冗余保存
  - 新增 `conversationId` 返回值（为 evo_v4_002 多会话管理预留）
- 修改 `wxt.config.ts`：添加 `storage` 权限

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- WARN: WXT 构建警告 Duplicated imports 'Message'（useChat.ts re-export 与 message-factory.ts 冲突，非阻塞，不影响运行，-5分）
- acceptance_cmd: PASS（60/60）
- TypeScript 构建无 error（18/20，扣 2 分因 WXT 重复导入警告）
- program.md 约束全部符合：无外部 API key 依赖、Chrome 插件不内置模型、仅使用 chrome.storage.local（20/20）
