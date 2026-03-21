// WelcomeScreen.tsx — 空会话引导页：欢迎文案 + 预设 prompt 建议按钮（点击直接发送）
import React from 'react';

/** 预设 prompt 建议 */
const PROMPT_SUGGESTIONS = [
  {
    icon: '🔍',
    label: '探索此页面',
    prompt: '分析当前页面的主要内容，给出关键信息摘要',
  },
  {
    icon: '📝',
    label: '生成报告',
    prompt: '根据当前页面内容，生成一份结构化的分析报告',
  },
  {
    icon: '💡',
    label: '优化建议',
    prompt: '分析当前页面的用户体验和内容结构，给出改进建议',
  },
  {
    icon: '🌐',
    label: '翻译此页',
    prompt: '将当前页面的主要内容翻译成中文，保持原文结构',
  },
] as const;

export interface WelcomeScreenProps {
  /** 点击预设 prompt 时触发，直接发送对应文本 */
  onSendPrompt: (prompt: string) => void;
}

export default function WelcomeScreen({ onSendPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 select-none">
      {/* Logo / 图标区 */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-lg">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      </div>

      {/* 欢迎标题 */}
      <h2 className="text-lg font-semibold text-gray-800 mb-1.5">
        欢迎使用 Browser Agent
      </h2>

      {/* 说明文字 */}
      <p className="text-sm text-gray-500 text-center mb-6 max-w-[240px] leading-relaxed">
        我可以帮你分析网页内容、生成报告、翻译页面，或者回答你的任何问题。
      </p>

      {/* 预设 Prompt 建议按钮 */}
      <div className="w-full max-w-[280px] space-y-2">
        <p className="text-xs text-gray-400 mb-2">试试这些：</p>
        {PROMPT_SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            onClick={() => onSendPrompt(item.prompt)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-left transition-all duration-150 group"
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {item.label}
              </span>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
