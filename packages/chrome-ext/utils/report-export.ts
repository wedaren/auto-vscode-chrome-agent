// report-export.ts — 深度调研报告导出工具
// 职责：将 ResearchReport 数据导出为 .md 或 .html 格式并触发浏览器下载
//   1. exportReportAsMarkdown — 生成结构化 Markdown 文件（含目录/摘要/引用/参考文献）
//   2. exportReportAsHtml    — 生成自包含 HTML 文件（内嵌 CSS 样式、可点击引用）

import type { ResearchReport, Citation } from '../hooks/useResearch';

// ────────────────────────────────────────────────────────────────
// 工具函数
// ────────────────────────────────────────────────────────────────

/** 生成带时间戳的文件名 */
function buildFilename(prefix: string, ext: string): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  return `${prefix}_${date}_${time}.${ext}`;
}

/** 触发浏览器下载 */
function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** 从报告 Markdown 中提取标题（第一个 # 行） */
function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '深度调研报告';
}

/** 构建参考文献 Markdown 段落 */
function buildReferencesMarkdown(citations: Citation[]): string {
  if (citations.length === 0) return '';
  const lines = citations.map(
    (c) => `[${c.id}] ${c.title || c.url} — ${c.url}`,
  );
  return `\n\n## 参考文献\n\n${lines.join('\n\n')}`;
}

// ────────────────────────────────────────────────────────────────
// Markdown 导出
// ────────────────────────────────────────────────────────────────

/**
 * 将 ResearchReport 导出为 .md 文件并触发浏览器下载
 *
 * 报告结构：
 *   # 标题
 *   ## 目录
 *   ## 摘要
 *   ## 分主题论述（含 [N] 行内引用）
 *   ## 结论
 *   ## 参考文献
 */
export function exportReportAsMarkdown(report: ResearchReport): void {
  // 报告正文已由 LLM 按结构化模板生成，包含 目录/摘要/分主题/结论
  let markdown = report.report;

  // 若正文末尾没有参考文献段落，附加一个规范的参考文献列表
  if (report.citations.length > 0 && !markdown.includes('## 参考文献')) {
    markdown += buildReferencesMarkdown(report.citations);
  }

  // 附加元数据尾注
  const meta = [
    '',
    '---',
    '',
    `> 本报告由 Browser Agent 深度调研引擎自动生成`,
    `> 迭代 ${report.totalIterations} 轮 | 探索 ${report.totalPages} 个页面 | 引用 ${report.citations.length} 条来源`,
    `> 生成时间：${new Date().toLocaleString()}`,
  ].join('\n');

  markdown += meta;

  const filename = buildFilename('research-report', 'md');
  triggerDownload(markdown, filename, 'text/markdown');
}

// ────────────────────────────────────────────────────────────────
// HTML 导出
// ────────────────────────────────────────────────────────────────

/** 将 [N] 行内引用转为 HTML 锚点链接 */
function convertCitationLinksToHtml(html: string, citations: Citation[]): string {
  return html.replace(/\[(\d+)\]/g, (match, numStr) => {
    const num = parseInt(numStr, 10);
    const citation = citations.find((c) => c.id === num);
    if (!citation) return match;
    return `<a href="#ref-${num}" class="citation-link" title="${(citation.title || '').replace(/"/g, '&quot;')}">[${num}]</a>`;
  });
}

/** 内嵌 CSS 样式（自包含 HTML，无需外部文件） */
const REPORT_HTML_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.7;
    color: #1f2937;
    background: #fff;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
  h1 { font-size: 1.75rem; font-weight: 700; margin: 0 0 1rem; color: #111827; }
  h2 { font-size: 1.35rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #1e3a5f; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.25rem; }
  h3 { font-size: 1.15rem; font-weight: 600; margin: 1.2rem 0 0.4rem; color: #374151; }
  h4 { font-size: 1rem; font-weight: 600; margin: 1rem 0 0.3rem; color: #4b5563; }
  p { margin: 0.5rem 0; font-size: 0.95rem; }
  ul, ol { margin: 0.5rem 0; padding-left: 1.75rem; }
  li { margin: 0.2rem 0; font-size: 0.95rem; }
  a { color: #4f46e5; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .citation-link {
    display: inline;
    font-size: 0.75em;
    font-weight: 700;
    color: #4f46e5;
    background: #ede9fe;
    padding: 0 0.2em;
    border-radius: 3px;
    vertical-align: super;
    text-decoration: none;
    cursor: pointer;
  }
  .citation-link:hover { background: #c7d2fe; color: #3730a3; }
  blockquote {
    border-left: 3px solid #818cf8;
    margin: 0.75rem 0;
    padding: 0.5rem 1rem;
    color: #6b7280;
    background: #f5f3ff;
    border-radius: 0 6px 6px 0;
  }
  table { border-collapse: collapse; margin: 0.75rem 0; width: 100%; font-size: 0.9rem; }
  th, td { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; text-align: left; }
  th { background: #f3f4f6; font-weight: 600; }
  code { background: #f3f4f6; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.88em; font-family: 'SF Mono', 'Fira Code', Consolas, monospace; }
  pre { background: #f6f8fa; border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 0.75rem 0; font-size: 0.85rem; line-height: 1.5; }
  pre code { background: none; padding: 0; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
  .meta-footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #e5e7eb;
    font-size: 0.8rem;
    color: #9ca3af;
  }
  .references { margin-top: 1.5rem; }
  .ref-item {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    border-bottom: 1px solid #f3f4f6;
  }
  .ref-item:last-child { border-bottom: none; }
  .ref-id { color: #4f46e5; font-weight: 700; font-family: monospace; flex-shrink: 0; }
  .ref-title { font-weight: 500; }
  .ref-url { color: #6b7280; word-break: break-all; }
  .ref-excerpt { color: #9ca3af; font-size: 0.85rem; margin-top: 0.25rem; }
  @media print {
    body { max-width: none; padding: 1cm; }
    .citation-link { color: #4f46e5; background: none; }
  }
`;

/** 简易 Markdown → HTML 转换（用于导出，不依赖 marked 库保持轻量） */
function simpleMarkdownToHtml(md: string): string {
  let html = md;

  // 代码块（需在其他转换前处理）
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code class="language-${lang || ''}">${escaped.trimEnd()}</code></pre>`;
  });

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 标题
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // 粗体 & 斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 引用块
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // 水平线
  html = html.replace(/^---+$/gm, '<hr>');

  // 无序列表（基本处理）
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
    if (!match.startsWith('<ul>')) return `<ul>${match}</ul>`;
    return match;
  });
  // 合并相邻 <ul> 标签
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // 有序列表
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // 段落（非标签开头的行）
  const lines = html.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith('<h') &&
      !trimmed.startsWith('<pre') &&
      !trimmed.startsWith('<ul') &&
      !trimmed.startsWith('<ol') &&
      !trimmed.startsWith('<li') &&
      !trimmed.startsWith('<blockquote') &&
      !trimmed.startsWith('<hr') &&
      !trimmed.startsWith('</') &&
      !trimmed.startsWith('<code') &&
      !trimmed.startsWith('<table') &&
      !trimmed.startsWith('<tr') &&
      !trimmed.startsWith('<td') &&
      !trimmed.startsWith('<th')
    ) {
      result.push(`<p>${trimmed}</p>`);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/** 构建参考文献 HTML 段落 */
function buildReferencesHtml(citations: Citation[]): string {
  if (citations.length === 0) return '';
  const items = citations.map(
    (c) => `<div class="ref-item" id="ref-${c.id}">
      <span class="ref-id">[${c.id}]</span>
      <div>
        <span class="ref-title">${c.title || '无标题'}</span><br>
        <a class="ref-url" href="${c.url}" target="_blank" rel="noopener noreferrer">${c.url}</a>
        ${c.excerpt ? `<p class="ref-excerpt">${c.excerpt}</p>` : ''}
      </div>
    </div>`,
  );
  return `<div class="references"><h2>参考文献</h2>${items.join('\n')}</div>`;
}

/**
 * 将 ResearchReport 导出为自包含 .html 文件并触发浏览器下载
 *
 * 特性：
 *   - 内嵌完整 CSS，无需外部依赖
 *   - [N] 引用标注可点击跳转到参考文献
 *   - 参考文献列表含标题/URL/摘要
 *   - 打印友好（@media print）
 */
export function exportReportAsHtml(report: ResearchReport): void {
  const title = extractTitle(report.report);

  // Markdown → HTML 基础转换
  let bodyHtml = simpleMarkdownToHtml(report.report);

  // 替换 [N] 引用为可点击锚点
  if (report.citations.length > 0) {
    bodyHtml = convertCitationLinksToHtml(bodyHtml, report.citations);
  }

  // 若正文没有参考文献，追加一个 HTML 版参考文献列表
  const hasRefs = bodyHtml.includes('参考文献');
  const referencesHtml = hasRefs ? '' : buildReferencesHtml(report.citations);

  // 元数据尾注
  const metaFooter = `
    <div class="meta-footer">
      <p>本报告由 Browser Agent 深度调研引擎自动生成</p>
      <p>迭代 ${report.totalIterations} 轮 | 探索 ${report.totalPages} 个页面 | 引用 ${report.citations.length} 条来源</p>
      <p>生成时间：${new Date().toLocaleString()}</p>
    </div>`;

  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${REPORT_HTML_STYLES}</style>
</head>
<body>
  ${bodyHtml}
  ${referencesHtml}
  ${metaFooter}
</body>
</html>`;

  const filename = buildFilename('research-report', 'html');
  triggerDownload(fullHtml, filename, 'text/html');
}
