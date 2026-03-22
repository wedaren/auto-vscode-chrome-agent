## 任务
evo_v24_004: Chrome ModelSelector 默认 5 个下拉限制 + 服务端默认模型自动选中 + 展开更多

## 假设
ModelSelector 组件增加 maxVisibleModels prop 控制可见数量，默认 5 个；超出时在下拉末尾显示「更多模型…」选项，选中后展开全部。App.tsx 解析 models_list payload 中的 defaultModelId 字段优先选中服务端指定的默认模型。

## 执行内容摘要
- 重写 `packages/chrome-ext/components/ModelSelector.tsx`：
  - 新增 `maxVisibleModels` prop（默认 5）
  - 内部 `expanded` 状态控制展开/折叠
  - `visibleModels` useMemo 计算当前可见列表（确保已选中的模型始终可见）
  - 超出限制时显示 `__expand__` 虚拟选项「更多模型… (共 N 个)」
- 修改 `packages/chrome-ext/entrypoints/sidepanel/App.tsx`：
  - 新增 `maxVisibleModels` 状态，从 models_list payload 中读取
  - models_list handler 解析 `defaultModelId`：优先使用服务端默认 → 保持已选 → fallback 第一个
  - ModelSelector 组件传递 `maxVisibleModels` prop

## 验收命令输出
```
PASS
```

## 结果
pass
