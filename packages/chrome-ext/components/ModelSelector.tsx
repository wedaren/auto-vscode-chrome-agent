// ModelSelector.tsx — 模型选择下拉组件，展示可用语言模型列表并支持选择切换
import React from 'react';

/** 模型信息结构，与 VSCode 侧 ModelInfo 保持一致 */
export interface ModelInfo {
  id: string;
  name: string;
  vendor: string;
  family: string;
  maxInputTokens: number;
}

interface ModelSelectorProps {
  /** 可用模型列表 */
  models: ModelInfo[];
  /** 当前选中的模型 id */
  selectedModelId?: string;
  /** 选择模型时的回调 */
  onSelect: (modelId: string) => void;
  /** 是否禁用（如未连接时） */
  disabled?: boolean;
  /** 是否正在加载模型列表 */
  loading?: boolean;
}

export default function ModelSelector({
  models,
  selectedModelId,
  onSelect,
  disabled = false,
  loading = false,
}: ModelSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      onSelect(value);
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 border-b border-gray-100">
      <label
        htmlFor="model-selector"
        className="text-xs text-gray-500 whitespace-nowrap"
      >
        模型:
      </label>
      <select
        id="model-selector"
        value={selectedModelId ?? ''}
        onChange={handleChange}
        disabled={disabled || loading || models.length === 0}
        className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed truncate"
      >
        {loading ? (
          <option value="">加载中...</option>
        ) : models.length === 0 ? (
          <option value="">无可用模型</option>
        ) : (
          <>
            <option value="" disabled>
              选择模型
            </option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.vendor}/{model.family})
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}
