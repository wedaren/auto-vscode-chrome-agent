## 任务
evo_v24_002: LmService 模型过滤 + 默认模型配置感知：listModels 过滤 hiddenModelIds，selectModel 优先使用 defaultModelId

## 假设
在 lm-service.ts 中读取 VSCode 配置 browserAgent.models.hiddenModelIds / defaultModelId / maxVisibleModels，实现模型过滤和默认模型选择逻辑。

## 执行内容摘要
- 新增 `ModelPreferences` 接口导出 `{ defaultModelId, maxVisibleModels }`
- 新增 `getModelPreferences()` 方法从 VSCode workspace config 读取偏好
- `listModels()` 增加 hiddenModelIds 过滤逻辑，打印过滤统计日志
- `selectModel()` 优先级调整为：手动选择 > defaultModelId 配置 > gpt-4o > copilot > 任意模型

## 验收命令输出
PASS

## 结果
pass
