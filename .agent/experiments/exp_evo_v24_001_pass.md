## 任务
evo_v24_001: VSCode 配置 Schema 扩展：新增 defaultModelId / hiddenModelIds / maxVisibleModels 三项模型管理配置

## 假设
在 package.json 的 contributes.configuration.properties 中新增三个 browserAgent.models.* 配置项，类型和默认值符合任务要求。

## 执行内容摘要
- 在 packages/vscode-ext/package.json 的 configuration.properties 中新增：
  - `browserAgent.models.defaultModelId` (string, default: "")：默认选中的语言模型 ID
  - `browserAgent.models.hiddenModelIds` (string[], default: [])：隐藏的模型 ID 列表
  - `browserAgent.models.maxVisibleModels` (number, default: 5, min: 1, max: 50)：下拉列表默认可见模型数

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
