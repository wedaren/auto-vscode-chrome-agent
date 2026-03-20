## 任务
evo_v1_001: LmService 新增 listModels() 和 selectModelById() 方法

## 假设
本次尝试：在 lm-service.ts 中新增 ModelInfo 接口、listModels() 方法和 selectModelById() 方法，并让 selectModel() 优先使用已缓存的手动选择模型。

## 执行内容摘要
- 新增 `ModelInfo` 导出接口，包含 id/name/vendor/family/maxInputTokens 字段
- 新增 `selectedModelInstance` 私有字段，用于缓存用户手动选择的模型
- 新增 `listModels()` 方法：调用 `vscode.lm.selectChatModels({})` 获取全量模型，映射为 `ModelInfo[]`
- 新增 `selectModelById(id)` 方法：根据 id 在全量模型中查找并缓存，返回 boolean
- 修改 `selectModel()` 方法：增加前置检查，如果已通过 selectModelById 设置模型则直接返回缓存

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
