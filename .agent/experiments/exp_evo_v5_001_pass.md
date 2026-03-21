## 任务
evo_v5_001: VSCode Activity Bar 视图容器注册 + 3 个 TreeView 占位声明

## 假设
在 package.json 中声明 viewsContainers.activitybar + views，创建 3 个最小化 TreeDataProvider 占位文件，在 extension.ts 中用 createTreeView 注册，确保编译通过。

## 执行内容摘要
- 创建 resources/browser-agent.svg（Activity Bar 自定义图标）
- package.json 新增 viewsContainers.activitybar（browser-agent-panel）和 views（3 个视图 ID）
- 创建 src/connection-tree.ts — ConnectionTreeDataProvider 占位实现
- 创建 src/message-tree.ts — MessageTreeDataProvider 占位实现
- 创建 src/agent-tree.ts — AgentTreeDataProvider 占位实现
- extension.ts 中 import 3 个 provider，activate 中 createTreeView 注册，deactivate 中 dispose

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
