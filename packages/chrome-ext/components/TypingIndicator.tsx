// TypingIndicator.tsx — 思考中指示器组件，三点跳动动画，用于等待/流式响应开始前
import React from 'react';

export interface TypingIndicatorProps {
  /** 可选的额外 CSS 类名 */
  className?: string;
}

/**
 * 三点跳动动画指示器，在 assistant 等待响应或流式内容尚未到达时显示。
 * 视觉风格与 assistant 消息气泡一致（左对齐、灰色背景）。
 */
export default function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={`max-w-[85%] mr-auto rounded-lg px-4 py-3 bg-gray-100 flex items-center gap-1 ${className ?? ''}`}
      aria-label="正在思考"
      role="status"
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}
