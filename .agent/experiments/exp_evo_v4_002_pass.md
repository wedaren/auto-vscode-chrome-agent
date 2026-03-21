## 任务
evo_v4_002: Chrome 侧多会话管理：会话列表侧栏 + 新建/切换/删除会话

## 假设
本次尝试：扩展 useChat hook 以支持多会话 CRUD 操作，新建 ConversationList 侧栏组件，在 App.tsx 中用左侧抽屉式布局集成。

## 执行内容摘要
- 扩展 hooks/useChat.ts：新增 conversations 状态、createNewConversation / switchConversation / deleteConversation / refreshConversations 四个函数；消息持久化后自动刷新会话列表
- 新建 components/ConversationList.tsx：展示所有会话元数据（标题+相对时间+消息数预览）；支持新建会话按钮、点击切换、hover/左滑显示删除按钮；活跃会话蓝色高亮；空列表显示引导文案和图标
- 重写 entrypoints/sidepanel/App.tsx：集成 ConversationList 左侧抽屉布局（fixed 定位，280px 宽，带遮罩层）；Header 添加汉堡菜单切换侧栏 + 新建会话快捷按钮

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：92/100
问题：
- WARN: WXT 构建警告 Duplicated imports 'Message' 和 'ConversationMeta'（re-export 冲突，非阻塞）
- WARN: chunk size > 500kB（sidepanel-CgLM_sCI.js 1.19MB，建议后续 code-split）
- 功能需求全部满足：会话列表展示、新建/切换/删除、抽屉式布局、活跃高亮、空列表引导
- 无 TypeScript 错误，无禁止依赖，新文件有顶部注释
