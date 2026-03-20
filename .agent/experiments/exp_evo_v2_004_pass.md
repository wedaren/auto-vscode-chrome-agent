## 任务
evo_v2_004: Chrome 重构：抽取 usePageContext Hook + createMessage 工具函数，App.tsx 精简为纯 UI

## 假设
从 App.tsx 中提取页面上下文逻辑（状态、获取、监听）为 usePageContext Hook；
提取消息创建模式为 createMessage 工厂函数供 useChat 使用；
App.tsx 缩减到 <150 行纯 UI 层。

## 执行内容摘要
- 创建 hooks/usePageContext.ts（69 行）：封装 pageContext 状态、fetchPageContext、browser.runtime.onMessage 监听器、CONTEXT_MESSAGE_TYPES 常量
- 创建 utils/message-factory.ts（30 行）：createMessage(role, content) 工厂函数 + Message 类型定义
- 更新 hooks/useChat.ts：从 message-factory 导入 createMessage，替换 5 处重复的消息对象构建代码
- 精简 App.tsx：移除 PageContext 接口、pageContext 状态、fetchPageContext、onMessage 监听 effect，改用 usePageContext() Hook。最终 139 行（原 213 行，减少 35%）

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- useChat.ts 和 message-factory.ts 均导出 Message 类型，WXT 构建产生 duplicated imports 警告。建议 useChat.ts 改为 re-export message-factory.ts 的 Message，消除冗余。
