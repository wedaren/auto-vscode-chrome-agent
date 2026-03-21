## 任务
evo_v7_002: Chrome 插件功能使用文档：Side Panel 对话、模型选择、多会话管理、斜杠命令、快捷键

## 假设
基于 Chrome 插件实际代码（ChatInput.tsx、ConversationList.tsx、ModelSelector.tsx、App.tsx 等），编写完整的用户使用指南，覆盖所有功能模块。

## 执行内容摘要
- 创建 docs/chrome-extension-guide.md（322 行）
- 覆盖 10 个章节：Side Panel 打开方式、对话基础（发送/欢迎页/消息展示/操作）、模型选择（使用方法/可用模型/快速切换）、多会话管理（侧边栏/创建/切换/删除/持久化）、斜杠命令（/new /clear /models 及使用方式）、快捷键（全局/输入框/命令菜单三类）、页面上下文感知、Agent 模式与工具调用、连接状态说明、常见问题
- 所有功能描述均基于实际代码实现，非臆测

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
