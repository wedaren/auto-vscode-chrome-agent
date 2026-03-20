## 任务
evo_v1_003: Chrome 侧新增 ModelSelector 下拉组件

## 假设
本次尝试：创建 ModelSelector.tsx 作为 React 下拉组件，接受 models(ModelInfo[]) 和 onSelect 回调，参照 ChatInput.tsx 的代码风格和 Tailwind 样式规范。ModelInfo 结构与 VSCode 侧 lm-service.ts 中的 ModelInfo 保持一致（id/name/vendor/family/maxInputTokens）。

## 执行内容摘要
- 创建了 packages/chrome-ext/components/ModelSelector.tsx
- 导出 ModelInfo 接口（id, name, vendor, family, maxInputTokens）
- 组件 Props: models, selectedModelId, onSelect, disabled, loading
- 使用 <select> 下拉，选项展示 name (vendor/family)
- 支持 loading 状态显示"加载中..."、空列表显示"无可用模型"
- Tailwind 样式与 ChatInput 一致

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
