// ResearchPanel.tsx — 深度调研面板组件
// 职责：提供完整的深度调研 UI，包含：
//   1. 研究主题输入（idle 阶段）
//   2. 研究计划编辑视图 — 子问题列表可增删改 + 搜索策略编辑 + 确认/取消按钮
//   3. 实时思考流面板 — 流式展示 Agent 当前动作和发现
//   4. 进度指示器 — 页面数/阶段/耗时
//   5. 报告 Markdown 渲染 — 含可点击引用标注 [N]
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { useResearch, type SubQuestion, type SearchStrategy, type ThinkingEntry, type ResearchProgress, type ResearchReport, type ResearchPhase, type Citation } from '../hooks/useResearch';
import type { BridgeMessage } from '../src/ws-client';
import type { BridgeMeta } from '../src/observability';
import { exportReportAsMarkdown, exportReportAsHtml } from '../utils/report-export';

// ────────────────────────────────────────────────────────────────
// Markdown 渲染器（带引用标注高亮）
// ────────────────────────────────────────────────────────────────

const marked = new Marked({
  gfm: true,
  breaks: true,
});

/** 将 [N] 引用标注转为可点击链接 */
function renderCitationLinks(html: string, citations: Citation[]): string {
  return html.replace(/\[(\d+)\]/g, (match, numStr) => {
    const num = parseInt(numStr, 10);
    const citation = citations.find((c) => c.id === num);
    if (!citation) return match;
    return `<a href="${citation.url}" target="_blank" rel="noopener noreferrer" class="citation-link" data-citation-id="${num}" title="${citation.title}\n${citation.excerpt}">[${num}]</a>`;
  });
}

/** 安全渲染 Markdown 并高亮代码块 */
function renderMarkdown(text: string, citations: Citation[] = []): string {
  try {
    let html = marked.parse(text) as string;

    // 高亮代码块
    html = html.replace(
      /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
      (_match, lang, code) => {
        try {
          const decoded = code
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
          const highlighted = hljs.highlight(decoded, { language: lang }).value;
          return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch {
          return `<pre><code class="language-${lang}">${code}</code></pre>`;
        }
      },
    );

    // 渲染引用链接
    if (citations.length > 0) {
      html = renderCitationLinks(html, citations);
    }

    return html;
  } catch {
    return `<p>${text}</p>`;
  }
}

// ────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────

interface ResearchPanelProps {
  sendMessage: (type: string, payload: unknown, meta?: Partial<BridgeMeta>) => boolean;
  onMessage: (handler: (msg: BridgeMessage) => void) => () => void;
  isConnected: boolean;
}

// ────────────────────────────────────────────────────────────────
// 子组件：主题输入表单
// ────────────────────────────────────────────────────────────────

interface TopicInputProps {
  onStart: (topic: string) => void;
  isConnected: boolean;
}

function TopicInput({ onStart, isConnected }: TopicInputProps) {
  const [topic, setTopic] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = topic.trim();
    if (!trimmed) return;
    onStart(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="w-full max-w-md">
        {/* 图标 + 标题 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-3">
            <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">深度调研</h2>
          <p className="text-sm text-gray-500 mt-1">输入研究主题，AI 将自动搜索、阅读并生成结构化报告</p>
        </div>

        {/* 输入区 */}
        <textarea
          ref={inputRef}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例如：2024 年大语言模型在医疗领域的应用现状与挑战"
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
          disabled={!isConnected}
        />

        {/* 启动按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!topic.trim() || !isConnected}
          className="mt-3 w-full py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isConnected ? '开始调研' : '未连接到 VSCode'}
        </button>

        {/* 提示 */}
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <span>调研过程包含 3 轮迭代搜索，最多探索 15 个页面。AI 会先生成研究计划供你审核。</span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：研究计划编辑器
// ────────────────────────────────────────────────────────────────

interface PlanEditorProps {
  plan: NonNullable<ReturnType<typeof useResearch>['plan']>;
  onConfirm: (editedPlan?: { subQuestions?: SubQuestion[]; searchStrategies?: SearchStrategy[] }) => void;
  onReject: () => void;
}

function PlanEditor({ plan, onConfirm, onReject }: PlanEditorProps) {
  const [editedQuestions, setEditedQuestions] = useState<SubQuestion[]>([...plan.subQuestions]);
  const [editedStrategies, setEditedStrategies] = useState<SearchStrategy[]>([...plan.searchStrategies]);

  // 子问题编辑
  const updateQuestion = (index: number, question: string) => {
    setEditedQuestions((prev) =>
      prev.map((sq, i) => (i === index ? { ...sq, question } : sq)),
    );
  };

  const removeQuestion = (index: number) => {
    setEditedQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    const nextId = `sq_${editedQuestions.length + 1}`;
    setEditedQuestions((prev) => [...prev, { id: nextId, question: '', status: 'pending' as const }]);
  };

  // 搜索策略编辑
  const updateStrategy = (index: number, field: 'query' | 'rationale', value: string) => {
    setEditedStrategies((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const removeStrategy = (index: number) => {
    setEditedStrategies((prev) => prev.filter((_, i) => i !== index));
  };

  const addStrategy = () => {
    setEditedStrategies((prev) => [...prev, { query: '', rationale: '' }]);
  };

  const handleConfirm = () => {
    const validQuestions = editedQuestions.filter((sq) => sq.question.trim());
    const validStrategies = editedStrategies.filter((s) => s.query.trim());
    onConfirm({ subQuestions: validQuestions, searchStrategies: validStrategies });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">研究计划</h3>
          <p className="text-xs text-gray-500">主题：{plan.topic}</p>
        </div>
      </div>

      {/* 子问题编辑 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">子问题</h4>
          <button
            onClick={addQuestion}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            添加
          </button>
        </div>
        <div className="space-y-2">
          {editedQuestions.map((sq, index) => (
            <div key={sq.id} className="flex items-start gap-2 group">
              <span className="text-xs text-gray-400 mt-2.5 w-5 text-right flex-shrink-0">{index + 1}.</span>
              <input
                type="text"
                value={sq.question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder="输入子问题..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={() => removeQuestion(index)}
                className="mt-1.5 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="删除"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 搜索策略编辑 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">搜索策略</h4>
          <button
            onClick={addStrategy}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            添加
          </button>
        </div>
        <div className="space-y-2">
          {editedStrategies.map((strategy, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-3 group relative">
              <button
                onClick={() => removeStrategy(index)}
                className="absolute top-2 right-2 p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="删除"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <input
                type="text"
                value={strategy.query}
                onChange={(e) => updateStrategy(index, 'query', e.target.value)}
                placeholder="搜索查询词..."
                className="w-full px-2 py-1.5 text-sm border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-1"
              />
              <input
                type="text"
                value={strategy.rationale}
                onChange={(e) => updateStrategy(index, 'rationale', e.target.value)}
                placeholder="搜索原因..."
                className="w-full px-2 py-1.5 text-xs text-gray-500 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 计划参数 */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>最大迭代：{plan.maxIterations} 轮</span>
        <span>最大页面：{plan.maxPages} 页</span>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleConfirm}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          确认并开始
        </button>
        <button
          onClick={onReject}
          className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：进度指示器
// ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  planning: '制定计划',
  searching: '搜索中',
  reading: '阅读页面',
  reasoning: '分析推理',
  gap_detecting: '差距检测',
  generating: '生成报告',
  done: '已完成',
  error: '出错',
};

const STATUS_ICONS: Record<string, string> = {
  planning: '📋',
  searching: '🔍',
  reading: '📖',
  reasoning: '🧠',
  gap_detecting: '🔎',
  generating: '📝',
  done: '✅',
  error: '❌',
};

interface ProgressIndicatorProps {
  progress: ResearchProgress | null;
  startedAt: number | null;
  thinkingCount: number;
}

function ProgressIndicator({ progress, startedAt, thinkingCount }: ProgressIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt) return;
    const timer = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 1000);
    return () => clearInterval(timer);
  }, [startedAt]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs.toString().padStart(2, '0')}s`;
  };

  const statusLabel = progress ? (STATUS_LABELS[progress.status] ?? progress.status) : '启动中';
  const statusIcon = progress ? (STATUS_ICONS[progress.status] ?? '⏳') : '⏳';

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50/50 border-b border-indigo-100">
      {/* 阶段指示 */}
      <span className="text-base">{statusIcon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-indigo-700">{statusLabel}</span>
          {progress?.phase && (
            <span className="text-xs text-indigo-500">{progress.phase}</span>
          )}
        </div>
        {progress?.message && (
          <p className="text-xs text-gray-500 truncate">{progress.message}</p>
        )}
      </div>
      {/* 指标 */}
      <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
        {progress?.citationCount != null && progress.citationCount > 0 && (
          <span title="引用数">📎 {progress.citationCount}</span>
        )}
        <span title="思考步骤">{thinkingCount} 步</span>
        <span title="已耗时">{formatTime(elapsed)}</span>
      </div>
      {/* 脉冲动画 */}
      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：思考流面板
// ────────────────────────────────────────────────────────────────

interface ThinkingStreamProps {
  entries: ThinkingEntry[];
}

function ThinkingStream({ entries }: ThinkingStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 新条目自动滚动到底部（entries 是倒序的，显示时翻转为正序）
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        <div className="text-center">
          <div className="animate-pulse mb-2">🔄</div>
          <span>等待 Agent 开始执行...</span>
        </div>
      </div>
    );
  }

  // 正序显示（最新在底部）
  const ordered = [...entries].reverse();

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      {ordered.map((entry) => (
        <div key={entry.id} className="flex items-start gap-2 animate-slideDown">
          {/* 状态图标 */}
          <span className="text-xs mt-0.5 flex-shrink-0">
            {STATUS_ICONS[entry.status] ?? '💭'}
          </span>
          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-700 leading-relaxed">{entry.thought}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-400">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
              {entry.citationCount > 0 && (
                <span className="text-[10px] text-indigo-500">📎 {entry.citationCount} 引用</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：报告渲染器
// ────────────────────────────────────────────────────────────────

interface ReportRendererProps {
  report: ResearchReport;
  onNewResearch: () => void;
}

function ReportRenderer({ report, onNewResearch }: ReportRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const renderedHtml = useMemo(
    () => renderMarkdown(report.report, report.citations),
    [report.report, report.citations],
  );

  /** 处理引用链接点击：滚动到引用列表对应条目 */
  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('citation-link')) {
      e.preventDefault();
      const citationId = target.getAttribute('data-citation-id');
      if (citationId) {
        const refEl = document.getElementById(`citation-ref-${citationId}`);
        if (refEl) {
          refEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          refEl.classList.add('bg-yellow-100');
          setTimeout(() => refEl.classList.remove('bg-yellow-100'), 2000);
        }
      }
    }
  }, []);

  /** 导出为 Markdown */
  const handleExportMd = useCallback(() => {
    exportReportAsMarkdown(report);
  }, [report]);

  /** 导出为 HTML */
  const handleExportHtml = useCallback(() => {
    exportReportAsHtml(report);
  }, [report]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* 报告统计概览 */}
      <div className="px-4 py-3 bg-green-50 border-b border-green-100">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">调研完成</p>
            <div className="flex items-center gap-3 text-xs text-green-600 mt-0.5">
              <span>迭代 {report.totalIterations} 轮</span>
              <span>探索 {report.totalPages} 页</span>
              <span>引用 {report.citations.length} 条</span>
            </div>
          </div>
          <button
            onClick={onNewResearch}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-md transition-colors"
          >
            新调研
          </button>
        </div>

        {/* 导出按钮行 */}
        <div className="flex items-center gap-2 mt-2.5 ml-12">
          <span className="text-xs text-gray-500 mr-1">导出报告：</span>
          <button
            onClick={handleExportMd}
            className="report-export-btn"
            title="下载 Markdown 格式报告"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            .md
          </button>
          <button
            onClick={handleExportHtml}
            className="report-export-btn"
            title="下载 HTML 格式报告（含样式，可直接在浏览器中打开）"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            .html
          </button>
        </div>
      </div>

      {/* 子问题完成情况 */}
      {report.plan.subQuestions.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">研究子问题</h4>
          <div className="space-y-1.5">
            {report.plan.subQuestions.map((sq) => (
              <div key={sq.id} className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  sq.status === 'answered' ? 'bg-green-500' :
                  sq.status === 'gap' ? 'bg-amber-500' :
                  'bg-gray-300'
                }`} />
                <span className="text-gray-700 flex-1">{sq.question}</span>
                <span className="text-gray-400">{sq.findingsCount} 发现</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 报告正文（Markdown 渲染） */}
      <div
        ref={contentRef}
        className="px-4 py-4 message-markdown research-report"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />

      {/* 参考文献列表 */}
      {report.citations.length > 0 && (
        <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">参考文献</h4>
          <div className="space-y-2">
            {report.citations.map((citation) => (
              <div
                key={citation.id}
                id={`citation-ref-${citation.id}`}
                className="flex items-start gap-2 text-xs rounded-md p-2 transition-colors"
              >
                <span className="text-indigo-600 font-mono font-bold flex-shrink-0">[{citation.id}]</span>
                <div className="flex-1 min-w-0">
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium truncate block"
                    title={citation.url}
                  >
                    {citation.title || citation.url}
                  </a>
                  {citation.excerpt && (
                    <p className="text-gray-500 mt-0.5 line-clamp-2">{citation.excerpt}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：加载中状态
// ────────────────────────────────────────────────────────────────

function StartingView() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3 animate-pulse">
          <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600">正在初始化调研引擎...</p>
        <p className="text-xs text-gray-400 mt-1">AI 正在分析主题并制定研究计划</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：错误状态
// ────────────────────────────────────────────────────────────────

interface ErrorViewProps {
  error: string;
  onRetry: () => void;
}

function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-3">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">调研出错</p>
        <p className="text-xs text-gray-500 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          重新开始
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 主组件：ResearchPanel
// ────────────────────────────────────────────────────────────────

export default function ResearchPanel({ sendMessage, onMessage, isConnected }: ResearchPanelProps) {
  const {
    phase,
    plan,
    thinkingLog,
    progress,
    report,
    error,
    startedAt,
    startResearch,
    confirmPlan,
    rejectPlan,
    reset,
  } = useResearch({ sendMessage, onMessage });

  return (
    <div className="flex flex-col h-full">
      {/* 阶段：空闲 — 主题输入 */}
      {phase === 'idle' && (
        <TopicInput onStart={(topic) => startResearch(topic)} isConnected={isConnected} />
      )}

      {/* 阶段：启动中 */}
      {phase === 'starting' && <StartingView />}

      {/* 阶段：计划审核/编辑 */}
      {phase === 'plan_review' && plan && (
        <PlanEditor plan={plan} onConfirm={confirmPlan} onReject={rejectPlan} />
      )}

      {/* 阶段：执行中 — 进度 + 思考流 */}
      {phase === 'executing' && (
        <>
          <ProgressIndicator
            progress={progress}
            startedAt={startedAt}
            thinkingCount={thinkingLog.length}
          />
          <ThinkingStream entries={thinkingLog} />
        </>
      )}

      {/* 阶段：完成 — 报告渲染 */}
      {phase === 'done' && report && (
        <ReportRenderer report={report} onNewResearch={reset} />
      )}

      {/* 阶段：错误 */}
      {phase === 'error' && (
        <ErrorView error={error ?? '未知错误'} onRetry={reset} />
      )}
    </div>
  );
}
