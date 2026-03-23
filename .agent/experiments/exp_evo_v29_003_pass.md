## 任务
evo_v29_003: 会话搜索与置顶 — ConversationList 搜索框 + Pin 能力 + useChatStorage 持久化

## 假设
在 useChatStorage 中扩展 ConversationMeta 添加 pinned 字段 + togglePin 方法；ConversationList 顶部添加搜索框 + 每个会话项添加置顶图标；排序逻辑统一为 pinned 优先 + updatedAt 降序。

## 执行内容摘要
- useChatStorage.ts: ConversationMeta 新增 `pinned?: boolean` 字段；saveConversation 保留已有 pinned 状态；排序改为 pinned 优先 + updatedAt 降序；新增 `togglePin(id)` 方法读写 chrome.storage.local
- ConversationList.tsx: 新增 `searchQuery` 状态 + 搜索框组件（带清除按钮）；`filteredConversations` useMemo 实时过滤 + 排序；ConversationItem 新增 pin 图标（amber 色，已 pin 时实心）；空状态区分"无会话"和"搜索无结果"；底部统计显示过滤信息
- useChat.ts: 解构 storageTogglePin，封装 togglePin 方法更新 conversations 状态；UseChatReturn 接口新增 togglePin 字段
- App.tsx: 从 useChat 解构 togglePin，传递 `onTogglePin={togglePin}` 给 ConversationList

## 验收命令输出
pinned found in useChatStorage.ts (13 references); searchQuery found in ConversationList.tsx (7 references); PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
