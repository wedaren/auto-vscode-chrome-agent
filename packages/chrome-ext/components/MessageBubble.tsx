// MessageBubble.tsx — 消息气泡组件，assistant 消息支持 Markdown 渲染 + 代码语法高亮 + 代码块复制按钮
import React, { useEffect, useRef, useMemo } from 'react';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

export interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
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

/** 全局单例 marked 实例 */
const markedInstance = createMarkedInstance();

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /** 将 Markdown 转为 HTML（仅 assistant 消息） */
  const renderedHtml = useMemo(() => {
    if (role !== 'assistant') return '';
    return markedInstance.parse(content) as string;
  }, [role, content]);

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

  // User 消息：纯文本样式
  if (role === 'user') {
    return (
      <div className="max-w-[85%] ml-auto rounded-lg px-3 py-2 text-sm bg-blue-500 text-white whitespace-pre-wrap break-words">
        {content}
      </div>
    );
  }

  // Assistant 消息：Markdown 渲染
  return (
    <div
      ref={containerRef}
      className="max-w-[85%] mr-auto rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-800 message-bubble-markdown"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
