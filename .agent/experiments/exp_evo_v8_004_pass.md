## 任务
evo_v8_004: Chrome Side Panel Skill 面板 + WebSocket 协议扩展：展示可用 Skill、一键触发、执行进度

## 假设
在 Chrome Side Panel 新增 SkillPanel 组件和顶部 Tab 切换（Chat/Skills），扩展 WebSocket 协议新增 5 个消息类型（skill_list / skill_list_result / skill_execute / skill_progress / skill_complete），VSCode 侧 message-handler.ts 新增对应处理逻辑。

## 执行内容摘要
- 新建 `packages/chrome-ext/components/SkillPanel.tsx`：
  - SkillCard 卡片列表：displayName + description + category 标签 + 运行按钮
  - ParamModal 参数输入弹窗：根据 skill.parameters 动态生成输入字段（支持 enum 下拉选择、默认值预填、必填校验）
  - ExecutionOverlay 执行进度覆盖层：进度条 + 步骤列表（当前步骤高亮蓝色、已完成打勾绿色、失败标红、跳过标黄、等待灰色）
  - StepItem 单步进度项：pending / running / success / failed / skipped 五种状态
  - 按 preset / custom 分类展示 Skill 列表
  - 连接后自动请求 skill_list，支持手动刷新

- 修改 `packages/chrome-ext/entrypoints/sidepanel/App.tsx`：
  - 导入 SkillPanel 组件
  - 新增 activeTab 状态（'chat' | 'skills'）
  - Header 下方添加 Tab 切换栏（Chat / Skills 两个按钮，带图标）
  - Chat 视图内容条件渲染（activeTab === 'chat'）
  - Skills 视图直接渲染 SkillPanel 组件（activeTab === 'skills'）

- 修改 `packages/chrome-ext/src/ws-client.ts`：
  - 补充 Skill 类消息类型文档注释（skill_list / skill_list_result / skill_execute / skill_progress / skill_complete）

- 修改 `packages/chrome-ext/hooks/useWebSocket.ts`：
  - 补充注释说明 skill 相关消息通过 onMessage 分发到 SkillPanel 处理

- 修改 `packages/vscode-ext/src/message-handler.ts`：
  - handle() 路由新增 skill_list / skill_execute 分支
  - handleSkillList()：从 SkillRegistry.getAll() 获取所有 Skill 并返回 skill_list_result
  - handleSkillExecute()：校验 Skill 存在性，调用 SkillRunner.execute() 并通过 onProgress 回调实时推送 skill_progress，执行完成后发送 skill_complete

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- chrome-ext build 存在 Duplicated imports 警告（Message from useChat.ts / message-factory.ts，ConversationMeta from useChat.ts / useChatStorage.ts），不影响构建但建议后续清理重复导出
- 其余全部通过：acceptance_cmd PASS、双端编译零错误、所有新文件有顶部注释、模型调用仅通过 vscode.lm API、Chrome 插件不内置模型、无外部 API key 依赖
