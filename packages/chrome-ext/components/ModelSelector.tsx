// ModelSelector.tsx — 模型选择下拉组件，展示可用语言模型列表并支持选择切换
// 支持 maxVisibleModels 限制：默认只显示前 N 个模型，超出时显示「更多模型…」可展开查看全部
import React, { useState, useMemo } from 'react';

/** 模型信息结构，与 VSCode 侧 ModelInfo 保持一致 */
export interface ModelInfo {
  id: string;
  name: string;
  vendor: string;
  family: string;
  maxInputTokens: number;
}

/** 默认最大可见模型数量 */
const DEFAULT_MAX_VISIBLE = 5;

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
  /** 下拉列表默认显示的最大模型数量，超出时收起并显示「更多模型…」；默认 5 */
  maxVisibleModels?: number;
}

export default function ModelSelector({
  models,
  selectedModelId,
  onSelect,
  disabled = false,
  loading = false,
  maxVisibleModels,
}: ModelSelectorProps) {
  /** 是否展开显示全部模型 */
  const [expanded, setExpanded] = useState(false);

  const limit = maxVisibleModels ?? DEFAULT_MAX_VISIBLE;
  const hasMore = models.length > limit;

  /** 当前应该展示的模型列表 */
  const visibleModels = useMemo(() => {
    if (expanded || !hasMore) return models;

    // 如果当前选中的模型不在前 N 个中，确保它也出现在列表里
    const topModels = models.slice(0, limit);
    if (selectedModelId && !topModels.some((m) => m.id === selectedModelId)) {
      const selected = models.find((m) => m.id === selectedModelId);
      if (selected) {
        return [...topModels, selected];
      }
    }
    return topModels;
  }, [models, limit, hasMore, expanded, selectedModelId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__expand__') {
      setExpanded(true);
      return;
    }
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
            {visibleModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.vendor}/{model.family})
              </option>
            ))}
            {hasMore && !expanded && (
              <option value="__expand__">
                更多模型… (共 {models.length} 个)
              </option>
            )}
          </>
        )}
      </select>
    </div>
  );
}
