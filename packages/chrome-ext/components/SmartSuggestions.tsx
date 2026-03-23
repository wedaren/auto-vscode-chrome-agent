// SmartSuggestions.tsx — 智能跟进建议芯片组件
// 职责：AI 回复完成后展示 2-3 个动态跟进建议芯片，点击芯片自动作为下一条消息发送
// 芯片带淡入动画，与当前对话上下文和页面相关
import React, { useState, useEffect } from 'react';

export interface SmartSuggestionsProps {
  /** 建议文本列表（2-3 条） */
  suggestions: string[];
  /** 点击建议芯片回调（将建议文本作为下一条消息发送） */
  onSuggestionClick: (suggestion: string) => void;
  /** 是否禁用（流式生成中禁用） */
  disabled?: boolean;
}

/**
 * SmartSuggestions — 智能跟进建议芯片组件
 *
 * AI 回复完成后 1-3 秒内，消息底部出现 2-3 个动态跟进建议芯片。
 * 芯片内容与当前对话上下文和页面相关。
 * 点击芯片自动作为下一条消息发送。
 */
export default function SmartSuggestions({
  suggestions,
  onSuggestionClick,
  disabled = false,
}: SmartSuggestionsProps) {
  const [visible, setVisible] = useState(false);

  // 延迟 300ms 后淡入，营造动态生成效果
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className={`smart-suggestions flex flex-wrap gap-1.5 mt-2 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {/* 建议标签图标 */}
      <div className="flex items-center mr-0.5">
        <svg
          className="w-3 h-3 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
      </div>
      {suggestions.map((suggestion, idx) => (
        <button
          key={`${idx}-${suggestion}`}
          onClick={() => !disabled && onSuggestionClick(suggestion)}
          disabled={disabled}
          className={`
            smart-suggestion-chip
            px-2.5 py-1 text-xs rounded-full
            border border-blue-200 bg-blue-50 text-blue-700
            hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800
            active:bg-blue-200
            transition-all duration-200 ease-in-out
            cursor-pointer select-none
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50
            max-w-[200px] truncate
          `}
          style={{
            animationDelay: `${idx * 150}ms`,
          }}
          title={suggestion}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
