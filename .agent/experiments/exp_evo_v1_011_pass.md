## 任务
evo_v1_011: 修复 models_list 和 select_model 消息格式不匹配（P0 致命 bug）

## 假设
VSCode extension.ts 中 list_models 返回的 payload 是裸数组，但 Chrome App.tsx 期望 { models: [...] } 对象包裹；select_model 中 Chrome 发送 { modelId } 但 VSCode 解构 { id }。修复方案：统一 VSCode 侧的消息格式匹配 Chrome 侧期望。

## 执行内容摘要
- 修改 extension.ts list_models handler: `payload: models` → `payload: { models }`
- 修改 extension.ts select_model handler: `{ id }` → `{ modelId }`
- 修改 select_model 成功响应: `{ success, id }` → `{ success, modelId }`
- 修改 select_model 错误响应: `{ success: false, id: '' }` → `{ success: false, modelId: '' }`
- 修改日志输出使用 modelId 变量名

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

验收详情：
- acceptance_cmd：PASS（`{ models }` 格式确认、`modelId` 字段确认、VSCode 编译零错误、Chrome 构建零错误）
- TypeScript 严格模式：`tsc --noEmit` 零错误
- program.md 约束：模型调用仅通过 vscode.lm API ✓ | Chrome 插件不内置模型 ✓ | 无需外部 API key 的依赖 ✓
- 代码质量：extension.ts 和 App.tsx 均有顶部注释，消息格式双端一致（VSCode 返回 `payload: { models }`，Chrome 解析 `payload.models`；Chrome 发送 `{ modelId }`，VSCode 解构 `{ modelId }`）
