# exp_evo_v1_005 — 模型选择功能全量验收

## 任务
evo_v1_005: 模型选择功能全量验收：双端构建通过 + 消息链路完整

## 验收范围
- VSCode 侧: lm-service.ts 有 listModels() / selectModelById()，extension.ts 有 list_models / select_model / models_list 消息处理
- Chrome 侧: App.tsx 集成 ModelSelector 组件，连接时自动请求 list_models，选择模型时发送 select_model，接收 models_list 更新列表
- 双端构建: vscode-ext `npm run compile` 0 errors，chrome-ext `npm run build` 0 errors

## acceptance_cmd 输出
PASS

## 检查明细

### VSCode 侧
- [x] lm-service.ts: listModels() 返回 ModelInfo[]（id/name/vendor/family/maxInputTokens）
- [x] lm-service.ts: selectModelById(id) 可指定模型，selectModel() 优先使用已选模型
- [x] extension.ts: list_models 消息 → 调用 listModels() → 返回 models_list
- [x] extension.ts: select_model 消息 → 调用 selectModelById() → 返回 model_selected
- [x] npm run compile: 0 errors

### Chrome 侧
- [x] ModelSelector.tsx: React 下拉选择组件，接受 models/selectedModelId/onSelect
- [x] App.tsx: 连接时自动发送 list_models
- [x] App.tsx: 处理 models_list 消息，更新模型列表
- [x] App.tsx: handleModelSelect 发送 select_model 消息
- [x] npm run build: 0 errors

### 约束合规
- [x] 模型调用只通过 vscode.lm API
- [x] Chrome 插件不内置模型
- [x] 无需外部 API key 的依赖

## Validator 复核
结果：pass
分数：98/100
问题：
- chrome-ext tsconfig.json include 未覆盖 components/ 目录（WXT 构建不受影响，属小瑕疵，与 evo_v1_004 同源）
