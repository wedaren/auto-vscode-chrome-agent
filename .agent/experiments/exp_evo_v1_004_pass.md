## 任务
evo_v1_004: App.tsx 集成 ModelSelector，WebSocket 联动模型选择

## 假设
本次尝试：在 App.tsx 中集成 ModelSelector 组件，通过 WebSocket 消息协议 (list_models/models_list/select_model) 实现与 VSCode 侧的模型选择联动。连接时自动请求模型列表，用户选择时发送选择消息。

## 执行内容摘要
- 在 App.tsx 顶部导入 ModelSelector 组件和 ModelInfo 类型
- 新增 3 个 state: models (ModelInfo[]), selectedModelId (string|undefined), modelsLoading (boolean)
- WebSocket onStateChange 回调中，connected 时自动发送 list_models 请求并设 loading
- onMessage 回调中新增 models_list case，解析 payload.models 更新列表，默认选中第一个
- 新增 handleModelSelect 回调，更新 selectedModelId 并发送 select_model 消息
- JSX 中在 header 和 page context bar 之间渲染 ModelSelector 组件

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- tsconfig include 未显式覆盖 components/ 目录（WXT 构建不受影响，属小瑕疵，-5分）
- acceptance_cmd 全部通过：ModelSelector 导入 ✅、list_models ✅、select_model ✅、npm run build 零错误 ✅
- 符合 program.md 约束：Chrome 侧不内置模型、无外部 API key 依赖、模型调用通过 WebSocket 委托 VSCode 侧 vscode.lm
