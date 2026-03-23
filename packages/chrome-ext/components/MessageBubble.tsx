// MessageBubble.tsx — 消息气泡组件，assistant 消息支持 Markdown 渲染 + 代码语法高亮 + 代码块复制按钮
// 长代码块 (>15行) 默认折叠显示前 5 行 + 展开按钮；长回复 (>500字) 顶部显示 Markdown 标题导航
// Hover 时显示操作栏：复制整条消息、重新生成（仅 assistant）；底部显示相对时间戳
// Agent 模式消息在正文上方渲染 AgentStepView 展示 ReAct 步骤
import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import AgentStepView, { type AgentStep } from './AgentStepView';
import SmartSuggestions from './SmartSuggestions';
import type { MessageStatus } from '../utils/message-factory';
import { downloadLlmDetail } from '../utils/download-llm-detail';

/** 代码块折叠阈值：超过此行数的代码块默认折叠 */
const CODE_COLLAPSE_THRESHOLD = 15;
/** 代码块折叠后显示的行数 */
const CODE_COLLAPSE_VISIBLE_LINES = 5;
/** 长回复标题导航阈值：超过此字数显示标题导航 */
const HEADING_NAV_THRESHOLD = 500;

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
  /** 智能跟进建议（AI 回复后由 LLM 异步生成，2-3 条上下文相关建议） */
  suggestions?: string[];
  /** 点击跟进建议芯片回调（将建议文本作为下一条消息发送） */
  onSuggestionClick?: (suggestion: string) => void;
}

/** 创建配置了 highlight.js 的 marked 实例 */
function createMarkedInstance(): Marked {
  const marked = new Marked({
    gfm: true,
    breaks: true,
  });

  marked.use({
    renderer: {
      heading({ text, depth }: { text: string; depth: number }) {
        const id = `heading-${text.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '-').toLowerCase()}`;
        return `<h${depth} id="${escapeAttr(id)}">${text}</h${depth}>`;
      },
      image({ href, title, text }: { href: string; title?: string | null; text: string }) {
        const altAttr = text ? ` alt="${escapeAttr(text)}"` : ' alt="图片"';
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
        return `<img src="${escapeAttr(href)}" ${altAttr}${titleAttr} loading="lazy" class="markdown-inline-image" />`;
      },
      code({ text, lang }: { text: string; lang?: string }) {
        const language = lang && hljs.getLanguage(lang) ? lang : undefined;
        const highlighted = language
          ? hljs.highlight(text, { language }).value
          : hljs.highlightAuto(text).value;

        const lineCount = text.split('\n').length;
        const isCollapsible = lineCount > CODE_COLLAPSE_THRESHOLD;
        const collapsibleClass = isCollapsible ? ' code-collapsible code-collapsed' : '';
        const langLabel = language || 'code';

        // 每个代码块包裹在相对定位容器中，右上角放置复制按钮
        // 超过 CODE_COLLAPSE_THRESHOLD 行的代码块默认折叠
        return `<div class="code-block-wrapper${collapsibleClass}" data-lines="${lineCount}">
  <div class="code-block-header">
    <span class="code-block-lang">${escapeAttr(langLabel)}</span>
    <button class="code-copy-btn" data-code="${escapeAttr(text)}" title="复制代码">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span class="code-copy-label">复制</span>
    </button>
  </div>
  <pre><code class="hljs${language ? ` language-${language}` : ''}">${highlighted}</code></pre>
  ${isCollapsible ? `<button class="code-collapse-toggle" data-action="expand">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
    <span>展开全部 (${lineCount} 行)</span>
  </button>` : ''}
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

/** 从 Markdown 文本中提取标题列表 */
interface HeadingItem {
  depth: number;
  text: string;
  id: string;
}

function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  // 匹配 # 开头的标题行（排除代码块内的 #）
  const lines = markdown.split('\n');
  let inCodeBlock = false;
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      const text = match[2].trim();
      const id = `heading-${text.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '-').toLowerCase()}`;
      headings.push({ depth, text, id });
    }
  }
  return headings;
}

/** 标题导航组件 — 长回复顶部显示 Markdown 标题快捷跳转 */
function HeadingNav({ headings, containerRef }: { headings: HeadingItem[]; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToHeading = useCallback((id: string) => {
    if (!containerRef.current) return;
    const el = containerRef.current.querySelector(`#${CSS.escape(id)}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [containerRef]);

  if (headings.length === 0) return null;

  return (
    <div className="heading-nav">
      <button
        className="heading-nav-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <span>目录导航 ({headings.length})</span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isExpanded && (
        <ul className="heading-nav-list">
          {headings.map((h, i) => (
            <li
              key={`${h.id}-${i}`}
              className="heading-nav-item"
              style={{ paddingLeft: `${(h.depth - 1) * 12}px` }}
            >
              <button onClick={() => scrollToHeading(h.id)}>
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
  suggestions,
  onSuggestionClick,
}: MessageBubbleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  /** Lightbox 状态：当前全屏查看的图片 src，null 表示关闭 */
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  /** 将 Markdown 转为 HTML（仅 assistant 消息） */
  const renderedHtml = useMemo(() => {
    if (role !== 'assistant') return '';
    return markedInstance.parse(content) as string;
  }, [role, content]);

  /** 提取标题列表用于长回复导航（仅 >500 字的 assistant 消息） */
  const headings = useMemo(() => {
    if (role !== 'assistant' || content.length <= HEADING_NAV_THRESHOLD) return [];
    return extractHeadings(content);
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

  // Markdown 内联图片点击 → 打开 Lightbox（事件委托）
  useEffect(() => {
    if (role !== 'assistant' || !containerRef.current) return;

    const handleImgClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.classList.contains('markdown-inline-image')) {
        const src = (target as HTMLImageElement).src;
        if (src) setLightboxSrc(src);
      }
    };

    const container = containerRef.current;
    container.addEventListener('click', handleImgClick);
    return () => container.removeEventListener('click', handleImgClick);
  }, [role, renderedHtml]);

  // ESC 键关闭 Lightbox
  useEffect(() => {
    if (!lightboxSrc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxSrc]);

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

  // 为可折叠代码块绑定展开/收起事件
  useEffect(() => {
    if (role !== 'assistant' || !containerRef.current) return;

    const toggleBtns = containerRef.current.querySelectorAll<HTMLButtonElement>('.code-collapse-toggle');

    const handleToggle = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const wrapper = btn.closest('.code-block-wrapper');
      if (!wrapper) return;

      const isCollapsed = wrapper.classList.contains('code-collapsed');
      const lineCount = wrapper.getAttribute('data-lines') || '0';

      if (isCollapsed) {
        wrapper.classList.remove('code-collapsed');
        const label = btn.querySelector('span');
        if (label) label.textContent = '收起代码';
        btn.setAttribute('data-action', 'collapse');
        const svg = btn.querySelector('svg');
        if (svg) svg.style.transform = 'rotate(180deg)';
      } else {
        wrapper.classList.add('code-collapsed');
        const label = btn.querySelector('span');
        if (label) label.textContent = `展开全部 (${lineCount} 行)`;
        btn.setAttribute('data-action', 'expand');
        const svg = btn.querySelector('svg');
        if (svg) svg.style.transform = 'rotate(0deg)';
      }
    };

    toggleBtns.forEach((btn) => btn.addEventListener('click', handleToggle));
    return () => {
      toggleBtns.forEach((btn) => btn.removeEventListener('click', handleToggle));
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

      {/* 长回复标题导航（>500 字 + 有标题时显示） */}
      {content && headings.length > 0 && (
        <HeadingNav headings={headings} containerRef={containerRef} />
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

      {/* 智能跟进建议芯片（AI 回复完成后异步出现） */}
      {suggestions && suggestions.length > 0 && onSuggestionClick && (
        <SmartSuggestions
          suggestions={suggestions}
          onSuggestionClick={onSuggestionClick}
          disabled={isRunning}
        />
      )}

      {/* Lightbox overlay — Markdown 内联图片全屏预览 */}
      {lightboxSrc && (
        <div
          className="image-lightbox-overlay"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="image-lightbox-close"
            onClick={() => setLightboxSrc(null)}
            title="关闭 (ESC)"
          >
            ✕
          </button>
          <img
            src={lightboxSrc}
            alt="全屏预览"
            onClick={(e) => e.stopPropagation()}
            className="image-lightbox-img"
          />
        </div>
      )}
    </div>
  );
}
