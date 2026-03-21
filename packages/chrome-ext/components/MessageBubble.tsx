// MessageBubble.tsx — 消息气泡组件，assistant 消息支持 Markdown 渲染 + 代码语法高亮 + 代码块复制按钮
// Hover 时显示操作栏：复制整条消息、重新生成（仅 assistant）；底部显示相对时间戳
// Agent 模式消息在正文上方渲染 AgentStepView 展示 ReAct 步骤
import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import AgentStepView, { type AgentStep } from './AgentStepView';
import type { MessageStatus } from '../utils/message-factory';
import { downloadLlmDetail } from '../utils/download-llm-detail';

export interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  /** 消息创建时间戳（Date.now()） */
  timestamp?: number;
  /** 消息发送状态（user 消息使用） */
  status?: MessageStatus;
  /** Agent ReAct 循环步骤（仅 agent 模式消息） */
  steps?: AgentStep[];
  /** 是否为 Agent 模式消息 */
  isAgentMode?: boolean;
  /** Agent 是否仍在执行中（控制步骤加载动画） */
  isRunning?: boolean;
  /** 重新生成回调（仅 assistant 消息可用，点击后重发上一条 user 消息） */
  onRegenerate?: () => void;
  /** 重试发送回调（仅 failed 状态的 user 消息可用） */
  onRetry?: () => void;
  /** LLM 请求完整细节数据（assistant 消息可选，有值时激活下载按钮） */
  llmDetail?: Record<string, unknown>;
}

/** 创建配置了 highlight.js 的 marked 实例 */
function createMarkedInstance(): Marked {
  const marked = new Marked({
    gfm: true,
    breaks: true,
  });

  marked.use({
    renderer: {
      code({ text, lang }: { text: string; lang?: string }) {
        const language = lang && hljs.getLanguage(lang) ? lang : undefined;
        const highlighted = language
          ? hljs.highlight(text, { language }).value
          : hljs.highlightAuto(text).value;

        // 每个代码块包裹在相对定位容器中，右上角放置复制按钮
        return `<div class="code-block-wrapper">
  <button class="code-copy-btn" data-code="${escapeAttr(text)}" title="复制代码">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <span class="code-copy-label">复制</span>
  </button>
  <pre><code class="hljs${language ? ` language-${language}` : ''}">${highlighted}</code></pre>
</div>`;
      },
    },
  });

  return marked;
}

/** 转义 HTML 属性值中的特殊字符 */
function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '&#10;');
}

/**
 * 格式化相对时间戳：刚刚 / N分钟前 / N小时前 / N天前
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 0) return '刚刚';

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;

  // 超过 30 天显示具体日期
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/** 全局单例 marked 实例 */
const markedInstance = createMarkedInstance();

export default function MessageBubble({
  role,
  content,
  timestamp,
  status,
  steps,
  isAgentMode,
  isRunning,
  onRegenerate,
  onRetry,
  llmDetail,
}: MessageBubbleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  /** 将 Markdown 转为 HTML（仅 assistant 消息） */
  const renderedHtml = useMemo(() => {
    if (role !== 'assistant') return '';
    return markedInstance.parse(content) as string;
  }, [role, content]);

  /** 复制整条消息文本到剪贴板 */
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    } catch {
      console.warn('[MessageBubble] 复制消息失败');
    }
  }, [content]);

  /** 相对时间戳（每分钟刷新） */
  const [relativeTime, setRelativeTime] = useState(() =>
    timestamp ? formatRelativeTime(timestamp) : '',
  );

  useEffect(() => {
    if (!timestamp) return;
    setRelativeTime(formatRelativeTime(timestamp));
    const timer = setInterval(() => {
      setRelativeTime(formatRelativeTime(timestamp));
    }, 60_000);
    return () => clearInterval(timer);
  }, [timestamp]);

  // 为代码块复制按钮绑定点击事件
  useEffect(() => {
    if (role !== 'assistant' || !containerRef.current) return;

    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('.code-copy-btn');

    const handleClick = async (e: Event) => {
      const btn = (e.currentTarget as HTMLButtonElement);
      const code = btn.getAttribute('data-code') ?? '';
      // 还原转义
      const decoded = code
        .replace(/&#10;/g, '\n')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&');

      try {
        await navigator.clipboard.writeText(decoded);
        const label = btn.querySelector('.code-copy-label');
        if (label) {
          label.textContent = '已复制';
          setTimeout(() => { label.textContent = '复制'; }, 1500);
        }
      } catch {
        console.warn('[MessageBubble] 复制失败');
      }
    };

    buttons.forEach((btn) => btn.addEventListener('click', handleClick));
    return () => {
      buttons.forEach((btn) => btn.removeEventListener('click', handleClick));
    };
  }, [role, renderedHtml]);

  // User 消息：纯文本样式 + hover 操作栏 + 发送状态 + 重试按钮
  if (role === 'user') {
    const isFailed = status === 'failed';
    const isSending = status === 'sending';

    return (
      <div
        className="group relative max-w-[85%] ml-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover 操作栏 — user 消息仅复制 */}
        <div
          className={`msg-action-bar absolute -top-8 right-0 flex items-center gap-1 px-1 py-0.5 rounded-md bg-white border border-gray-200 shadow-sm transition-opacity duration-150 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-1.5 py-1 rounded text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="复制消息"
          >
            {copyFeedback ? (
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
            isFailed
              ? 'bg-red-400 text-white'
              : isSending
                ? 'bg-blue-400 text-white/80'
                : 'bg-blue-500 text-white'
          }`}
        >
          {content}
        </div>

        {/* 状态栏：时间戳 + 发送状态 + 重试按钮 */}
        <div className="flex items-center justify-end gap-1.5 mt-0.5">
          {/* 发送状态指示 */}
          {isSending && (
            <span className="text-[10px] text-gray-400 select-none">发送中...</span>
          )}
          {isFailed && (
            <span className="text-[10px] text-red-500 select-none">发送失败</span>
          )}

          {/* 重试按钮（仅 failed 状态显示） */}
          {isFailed && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="重试发送"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重试
            </button>
          )}

          {/* 时间戳 */}
          {relativeTime && (
            <span className="text-[10px] text-gray-400 select-none">
              {relativeTime}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Agent 模式消息：先渲染步骤，再渲染最终回答
  const hasSteps = steps && steps.length > 0;

  // Assistant 消息：Agent 步骤 + Markdown 渲染 + hover 操作栏
  return (
    <div
      className="group relative max-w-[85%] mr-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover 操作栏 — assistant 消息：复制 + 重新生成 */}
      {content && (
        <div
          className={`msg-action-bar absolute -top-8 left-0 flex items-center gap-1 px-1 py-0.5 rounded-md bg-white border border-gray-200 shadow-sm transition-opacity duration-150 z-10 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-1.5 py-1 rounded text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="复制消息"
          >
            {copyFeedback ? (
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>

          {/* 重新生成按钮（仅 assistant 消息） */}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 px-1.5 py-1 rounded text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="重新生成"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Agent 步骤展示（渲染在正文上方） */}
      {hasSteps && (
        <AgentStepView steps={steps} isRunning={isRunning} />
      )}

      {/* Markdown 正文（agent_complete 后才有 content） */}
      {content && (
        <div
          ref={containerRef}
          className="rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-800 message-bubble-markdown"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      )}

      {/* 底部工具栏：时间戳 + 下载按钮 */}
      <div className="flex items-center gap-2 mt-0.5">
        {/* 时间戳 */}
        {relativeTime && (
          <span className="text-[10px] text-gray-400 select-none">
            {relativeTime}
          </span>
        )}

        {/* 下载 LLM 请求细节按钮（仅有 llmDetail 时显示） */}
        {llmDetail && (
          <button
            onClick={() => downloadLlmDetail(llmDetail)}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="下载 LLM 请求细节 (JSON)"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>LLM Detail</span>
          </button>
        )}
      </div>
    </div>
  );
}
