"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRegistry = void 0;
// skill-registry.ts — Skill 数据模型与注册表
// 职责：定义 MCP Tool Schema 风格的 Skill / SkillStep 接口，
//       管理内置预设 Skill 和用户自定义 Skill 的注册、加载、持久化。
//       SkillRegistry 是 Skill 系统的核心数据层，供 SkillRunner / SkillTreeView / Chrome 面板消费。
//       持久化层使用 UserDataManager，数据存储在 ~/.browser-agent/skills/ 目录下。
const vscode = __importStar(require("vscode"));
// ────────────────────────────────────────────────────────────────
// 内置 15 个预设 Skill（原 5 + evo_v18_003 新增 10）
// ────────────────────────────────────────────────────────────────
const PRESET_SKILLS = [
    // 1. 导航到指定 URL
    {
        name: 'navigate_to_url',
        displayName: '导航到 URL',
        description: '导航浏览器到指定的 URL 地址',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                url: { type: 'string', description: '目标 URL 地址' },
            },
            required: ['url'],
        },
        steps: [
            {
                toolName: 'browser_navigate',
                argsTemplate: { url: '{{url}}' },
                description: '导航到目标 URL',
            },
            {
                toolName: 'browser_wait',
                argsTemplate: { selector: 'body', timeout: 5000 },
                description: '等待页面 body 加载完成',
                optional: true,
            },
        ],
    },
    // 2. 整理当前标签页（获取所有 tab 信息 + 按域名分组）
    {
        name: 'organize_tabs',
        displayName: '整理标签页',
        description: '获取当前所有标签页信息，按域名分组整理并展示',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {},
            required: [],
        },
        steps: [
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: 'title' },
                description: '获取当前页面标题',
            },
            {
                toolName: 'browser_query_selector',
                argsTemplate: { selector: 'head link[rel="canonical"]' },
                description: '获取当前页面规范链接',
                optional: true,
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取当前页面缩略图',
                optional: true,
            },
        ],
    },
    // 3. 翻译当前页面主要内容
    {
        name: 'translate_page',
        displayName: '翻译页面',
        description: '提取当前页面主要文本内容，通过 LLM 翻译后高亮展示',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                targetLanguage: {
                    type: 'string',
                    description: '目标语言（如 中文、English、日本語）',
                    default: '中文',
                },
                selector: {
                    type: 'string',
                    description: '要翻译的内容区域选择器（默认 body）',
                    default: 'body',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: '{{selector}}' },
                description: '提取目标区域的文本内容',
            },
            {
                toolName: 'browser_highlight',
                argsTemplate: {
                    selector: '{{selector}}',
                    color: 'rgba(66, 135, 245, 0.15)',
                    duration: 3000,
                },
                description: '高亮标记正在翻译的区域',
                optional: true,
            },
        ],
    },
    // 4. 提取页面结构化数据
    {
        name: 'extract_page_data',
        displayName: '提取页面数据',
        description: '提取当前页面的结构化数据：标题、链接、图片、表格等',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                dataTypes: {
                    type: 'string',
                    description: '要提取的数据类型（逗号分隔：title,links,images,tables）',
                    default: 'title,links,images,tables',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: 'title' },
                description: '提取页面标题',
            },
            {
                toolName: 'browser_query_selector',
                argsTemplate: { selector: 'h1' },
                description: '提取主标题',
                optional: true,
            },
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: 'body' },
                description: '提取页面全文内容',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取页面快照作为辅助参考',
                optional: true,
            },
        ],
    },
    // 5. 智能表单填充
    {
        name: 'smart_form_fill',
        displayName: '智能填表',
        description: '识别当前页面的表单字段，根据用户描述自动填写',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                formSelector: {
                    type: 'string',
                    description: '表单选择器（默认 form）',
                    default: 'form',
                },
                fieldValues: {
                    type: 'string',
                    description: '要填写的字段描述（如 "姓名=张三, 邮箱=test@example.com"）',
                },
            },
            required: ['fieldValues'],
        },
        steps: [
            {
                toolName: 'browser_wait',
                argsTemplate: { selector: '{{formSelector}}', timeout: 5000 },
                description: '等待表单加载',
            },
            {
                toolName: 'browser_query_selector',
                argsTemplate: { selector: '{{formSelector}}' },
                description: '识别表单结构和字段',
            },
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: '{{formSelector}}' },
                description: '获取表单中所有标签文本以辅助字段匹配',
            },
            {
                toolName: 'browser_highlight',
                argsTemplate: {
                    selector: '{{formSelector}}',
                    color: 'rgba(76, 175, 80, 0.2)',
                    duration: 2000,
                },
                description: '高亮标记表单区域',
                optional: true,
            },
        ],
    },
    // ── 以下为 evo_v18_003 新增的 10 个高价值预设 Skill ──
    // 6. 阅读文章 — 提取页面主文章内容
    {
        name: 'read_article',
        displayName: '阅读文章',
        description: '智能提取当前页面的文章正文内容（标题 + 正文 + 元信息），适用于新闻、博客、文档等页面',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                selector: {
                    type: 'string',
                    description: '文章容器选择器（默认自动检测 article / main / .content / .post）',
                    default: 'article, main, [role="main"], .content, .post, .article, .entry-content',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: 'title' },
                description: '获取页面标题',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const meta = {}; const desc = document.querySelector("meta[name=\\"description\\"]"); if(desc) meta.description = desc.getAttribute("content"); const author = document.querySelector("meta[name=\\"author\\"]"); if(author) meta.author = author.getAttribute("content"); const time = document.querySelector("time, [datetime], .date, .published"); if(time) meta.publishDate = time.textContent?.trim() || time.getAttribute("datetime"); return JSON.stringify(meta); })()',
                },
                description: '提取文章元信息（描述、作者、发布日期）',
                optional: true,
            },
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: '{{selector}}' },
                description: '提取文章正文内容',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取文章页面快照',
                optional: true,
            },
        ],
    },
    // 7. 采集全部链接
    {
        name: 'capture_all_links',
        displayName: '采集全部链接',
        description: '采集当前页面所有超链接（href + 链接文本），支持限定区域和数量，适用于导航分析、链接审计、资源发现',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                scope: {
                    type: 'string',
                    description: '限定区域的 CSS 选择器（默认全页面）',
                    default: 'body',
                },
                maxLinks: {
                    type: 'string',
                    description: '最大采集数量（默认 200）',
                    default: '200',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: 'title' },
                description: '获取页面标题作为上下文',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { return window.location.href; })()',
                },
                description: '获取当前页面 URL',
            },
            {
                toolName: 'browser_get_links',
                argsTemplate: { selector: '{{scope}} a[href]', limit: '{{maxLinks}}' },
                description: '采集指定区域内的所有链接',
            },
        ],
    },
    // 8. 采集表格数据
    {
        name: 'capture_table_data',
        displayName: '采集表格数据',
        description: '提取当前页面表格数据为结构化格式（表头 + 行数据），支持指定特定表格',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                tableSelector: {
                    type: 'string',
                    description: '目标表格的 CSS 选择器（默认页面第一个 table）',
                    default: 'table',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_wait',
                argsTemplate: { selector: '{{tableSelector}}', timeout: 5000 },
                description: '等待表格加载完成',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const t = document.querySelector("{{tableSelector}}"); if(!t) return JSON.stringify({error:"未找到表格"}); const headers = Array.from(t.querySelectorAll("thead th, thead td, tr:first-child th")).map(h => h.textContent?.trim()); const rows = Array.from(t.querySelectorAll("tbody tr, tr")).slice(headers.length > 0 ? 0 : 1).map(r => Array.from(r.querySelectorAll("td, th")).map(c => c.textContent?.trim())); return JSON.stringify({ headers, rows: rows.slice(0, 200), totalRows: rows.length }); })()',
                },
                description: '提取表格表头和行数据',
            },
            {
                toolName: 'browser_highlight',
                argsTemplate: {
                    selector: '{{tableSelector}}',
                    color: 'rgba(33, 150, 243, 0.15)',
                    duration: 2000,
                },
                description: '高亮标记采集的表格',
                optional: true,
            },
        ],
    },
    // 9. 页面内搜索
    {
        name: 'search_in_page',
        displayName: '页面内搜索',
        description: '在当前页面中搜索指定文本，返回匹配数量和上下文片段，并高亮首个匹配',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    description: '要搜索的关键词或文本片段',
                },
                maxResults: {
                    type: 'string',
                    description: '最大返回匹配数（默认 20）',
                    default: '20',
                },
            },
            required: ['keyword'],
        },
        steps: [
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const kw = "{{keyword}}"; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const matches = []; const max = parseInt("{{maxResults}}", 10) || 20; while(walker.nextNode() && matches.length < max) { const node = walker.currentNode; const idx = node.textContent?.toLowerCase().indexOf(kw.toLowerCase()); if(idx !== undefined && idx >= 0) { const text = node.textContent || ""; const start = Math.max(0, idx - 40); const end = Math.min(text.length, idx + kw.length + 40); matches.push({ context: text.substring(start, end).trim(), parentTag: node.parentElement?.tagName }); } } return JSON.stringify({ keyword: kw, totalMatches: matches.length, matches }); })()',
                },
                description: '搜索页面中匹配的文本片段',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const kw = "{{keyword}}"; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while(walker.nextNode()) { const idx = walker.currentNode.textContent?.toLowerCase().indexOf(kw.toLowerCase()); if(idx !== undefined && idx >= 0 && walker.currentNode.parentElement) { walker.currentNode.parentElement.scrollIntoView({ behavior: "smooth", block: "center" }); return "scrolled_to_first_match"; } } return "no_match_found"; })()',
                },
                description: '滚动到第一个匹配位置',
                optional: true,
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取搜索结果区域快照',
                optional: true,
            },
        ],
    },
    // 10. 自动滚动阅读
    {
        name: 'auto_scroll_read',
        displayName: '自动滚动阅读',
        description: '自动滚动页面，分段截图并提取每屏内容，适用于长页面阅读和内容采集',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                scrollCount: {
                    type: 'string',
                    description: '滚动次数（默认 5 屏）',
                    default: '5',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_scroll',
                argsTemplate: { mode: 'to-top' },
                description: '先滚动到页面顶部',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取第 1 屏内容',
            },
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: 'body' },
                description: '提取当前可见区域的文本内容',
            },
            {
                toolName: 'browser_scroll',
                argsTemplate: { mode: 'by-pixels', pixels: 800 },
                description: '向下滚动一屏',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取第 2 屏内容',
            },
            {
                toolName: 'browser_scroll',
                argsTemplate: { mode: 'by-pixels', pixels: 800 },
                description: '继续向下滚动',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取第 3 屏内容',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const sh = document.documentElement.scrollHeight; const ch = document.documentElement.clientHeight; const st = window.scrollY; return JSON.stringify({ scrollHeight: sh, clientHeight: ch, scrollTop: Math.round(st), progress: Math.round((st + ch) / sh * 100) + "%" }); })()',
                },
                description: '获取页面滚动进度信息',
            },
        ],
    },
    // 11. 打开并总结
    {
        name: 'open_and_summarize',
        displayName: '打开并总结',
        description: '导航到指定 URL，等待加载完成后提取页面内容供 LLM 总结，一键获取任意网页摘要',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: '要打开并总结的目标 URL',
                },
                contentSelector: {
                    type: 'string',
                    description: '主内容区域选择器（默认自动检测）',
                    default: 'article, main, [role="main"], .content, body',
                },
            },
            required: ['url'],
        },
        steps: [
            {
                toolName: 'browser_navigate',
                argsTemplate: { url: '{{url}}' },
                description: '导航到目标 URL',
            },
            {
                toolName: 'browser_wait',
                argsTemplate: { selector: 'body', timeout: 8000 },
                description: '等待页面加载完成',
            },
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: 'title' },
                description: '获取页面标题',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const meta = {}; const desc = document.querySelector("meta[name=\\"description\\"]"); if(desc) meta.description = desc.getAttribute("content"); const og = document.querySelector("meta[property=\\"og:description\\"]"); if(og) meta.ogDescription = og.getAttribute("content"); return JSON.stringify(meta); })()',
                },
                description: '提取页面元描述',
                optional: true,
            },
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: '{{contentSelector}}' },
                description: '提取页面主要内容文本',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取页面快照',
                optional: true,
            },
        ],
    },
    // 12. 填写并提交表单
    {
        name: 'fill_and_submit',
        displayName: '填写并提交',
        description: '识别表单字段并逐一填写，最后点击提交按钮。支持 input / textarea / select 等常见表单元素',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                formSelector: {
                    type: 'string',
                    description: '表单选择器（默认 form）',
                    default: 'form',
                },
                fieldValues: {
                    type: 'string',
                    description: '要填写的字段（JSON 格式：{"selector": "value", ...} 或 "名=值, 名=值" 格式描述）',
                },
                submitSelector: {
                    type: 'string',
                    description: '提交按钮选择器（默认自动检测 submit 按钮）',
                    default: '{{formSelector}} [type="submit"], {{formSelector}} button:not([type="button"]):not([type="reset"])',
                },
            },
            required: ['fieldValues'],
        },
        steps: [
            {
                toolName: 'browser_wait',
                argsTemplate: { selector: '{{formSelector}}', timeout: 5000 },
                description: '等待表单加载',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const form = document.querySelector("{{formSelector}}"); if(!form) return JSON.stringify({error:"未找到表单"}); const fields = Array.from(form.querySelectorAll("input, textarea, select")).map(el => ({ tag: el.tagName, type: el.getAttribute("type")||"text", name: el.getAttribute("name"), id: el.id, placeholder: el.getAttribute("placeholder"), label: el.labels?.[0]?.textContent?.trim() })).filter(f => f.type !== "hidden" && f.type !== "submit"); return JSON.stringify({ fieldCount: fields.length, fields }); })()',
                },
                description: '扫描表单结构，识别所有可填写字段',
            },
            {
                toolName: 'browser_highlight',
                argsTemplate: {
                    selector: '{{formSelector}}',
                    color: 'rgba(76, 175, 80, 0.15)',
                    duration: 2000,
                },
                description: '高亮标记表单区域',
                optional: true,
            },
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: '{{formSelector}}' },
                description: '获取表单中的标签文本以辅助 LLM 匹配字段',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取表单区域快照，便于确认填写结果',
                optional: true,
            },
        ],
    },
    // 13. 页面信息
    {
        name: 'page_info',
        displayName: '页面信息',
        description: '一键获取当前页面的综合信息：URL、标题、Meta 标签、性能指标、页面大小、加载状态等',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {},
            required: [],
        },
        steps: [
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const info = { url: window.location.href, title: document.title, readyState: document.readyState, charset: document.characterSet, doctype: document.doctype ? document.doctype.name : "none", contentType: document.contentType, referrer: document.referrer || "direct", }; const metas = {}; document.querySelectorAll("meta[name], meta[property]").forEach(m => { const key = m.getAttribute("name") || m.getAttribute("property"); if(key) metas[key] = m.getAttribute("content"); }); info.meta = metas; return JSON.stringify(info); })()',
                },
                description: '采集页面基本信息和 Meta 标签',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const perf = {}; if(window.performance) { const nav = performance.getEntriesByType("navigation")[0]; if(nav) { perf.domContentLoaded = Math.round(nav.domContentLoadedEventEnd - nav.startTime) + "ms"; perf.loadComplete = Math.round(nav.loadEventEnd - nav.startTime) + "ms"; perf.domInteractive = Math.round(nav.domInteractive - nav.startTime) + "ms"; } perf.resourceCount = performance.getEntriesByType("resource").length; } const pageSize = { scrollHeight: document.documentElement.scrollHeight, clientHeight: document.documentElement.clientHeight, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, }; const counts = { links: document.querySelectorAll("a[href]").length, images: document.querySelectorAll("img").length, scripts: document.querySelectorAll("script").length, stylesheets: document.querySelectorAll("link[rel=stylesheet]").length, forms: document.querySelectorAll("form").length, iframes: document.querySelectorAll("iframe").length, }; return JSON.stringify({ performance: perf, pageSize, elementCounts: counts }); })()',
                },
                description: '采集页面性能指标和元素统计',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取页面当前状态快照',
                optional: true,
            },
        ],
    },
    // 14. 多步骤提取
    {
        name: 'multi_step_extract',
        displayName: '多步骤提取',
        description: '分步骤提取页面中多个区域的数据：先获取大纲结构，再逐区域提取详细内容，适用于复杂页面的结构化采集',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                outlineSelector: {
                    type: 'string',
                    description: '大纲/目录选择器（默认提取所有标题）',
                    default: 'h1, h2, h3',
                },
                contentSelector: {
                    type: 'string',
                    description: '主内容区域选择器',
                    default: 'article, main, [role="main"], .content, body',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: 'title' },
                description: '获取页面标题',
            },
            {
                toolName: 'browser_query_selector_all',
                argsTemplate: { selector: '{{outlineSelector}}', limit: 30 },
                description: '提取页面大纲结构（所有标题元素）',
            },
            {
                toolName: 'browser_get_text',
                argsTemplate: { selector: '{{contentSelector}}' },
                description: '提取主内容区域全文',
            },
            {
                toolName: 'browser_get_links',
                argsTemplate: { selector: '{{contentSelector}} a[href]', limit: 50 },
                description: '提取内容区域内的关联链接',
                optional: true,
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { const imgs = Array.from(document.querySelectorAll("{{contentSelector}} img")).slice(0, 20).map(img => ({ src: img.src, alt: img.alt, width: img.naturalWidth, height: img.naturalHeight })); return JSON.stringify({ imageCount: imgs.length, images: imgs }); })()',
                },
                description: '提取内容区域内的图片信息',
                optional: true,
            },
        ],
    },
    // 15. 批量截图
    {
        name: 'batch_screenshot',
        displayName: '批量截图',
        description: '从页面顶部到底部分段截图，自动滚动并逐屏捕获，适用于长页面存档、视觉对比、全页面记录',
        category: 'preset',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                scrollPixels: {
                    type: 'string',
                    description: '每次滚动像素数（默认 800）',
                    default: '800',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_scroll',
                argsTemplate: { mode: 'to-top' },
                description: '滚动到页面顶部',
            },
            {
                toolName: 'browser_evaluate',
                argsTemplate: {
                    code: '(() => { return JSON.stringify({ url: window.location.href, title: document.title, scrollHeight: document.documentElement.scrollHeight, clientHeight: document.documentElement.clientHeight, estimatedScreens: Math.ceil(document.documentElement.scrollHeight / document.documentElement.clientHeight) }); })()',
                },
                description: '获取页面尺寸信息，估算总屏数',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取第 1 屏（顶部）',
            },
            {
                toolName: 'browser_scroll',
                argsTemplate: { mode: 'by-pixels', pixels: '{{scrollPixels}}' },
                description: '向下滚动一屏',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取第 2 屏',
            },
            {
                toolName: 'browser_scroll',
                argsTemplate: { mode: 'by-pixels', pixels: '{{scrollPixels}}' },
                description: '继续向下滚动',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取第 3 屏',
            },
            {
                toolName: 'browser_scroll',
                argsTemplate: { mode: 'by-pixels', pixels: '{{scrollPixels}}' },
                description: '继续向下滚动',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取第 4 屏',
            },
            {
                toolName: 'browser_scroll',
                argsTemplate: { mode: 'to-bottom' },
                description: '滚动到页面底部',
            },
            {
                toolName: 'browser_screenshot',
                argsTemplate: {},
                description: '截取最后一屏（底部）',
            },
        ],
    },
];
// ────────────────────────────────────────────────────────────────
// SkillRegistry 类
// ────────────────────────────────────────────────────────────────
/** 自定义 Skill 文件路径（相对于 UserDataManager 根目录） */
const CUSTOM_SKILLS_FILE = ['skills', 'custom-skills.json'];
/** 预设开关覆盖文件路径（相对于 UserDataManager 根目录） */
const PRESET_OVERRIDES_FILE = ['skills', 'preset-overrides.json'];
/**
 * SkillRegistry 管理所有 Skill（预设 + 自定义）的注册、查询、持久化。
 *
 * 数据来源：
 * - 内置预设：PRESET_SKILLS 硬编码（category=preset），始终存在
 * - 用户自定义：从 ~/.browser-agent/skills/custom-skills.json 加载
 * - 预设开关覆盖：从 ~/.browser-agent/skills/preset-overrides.json 加载
 *
 * 合并策略：
 * - loadSkills() 将预设 + 自定义合并到内存 Map
 * - saveSkills() 将 custom Skill 写入 custom-skills.json，预设开关写入 preset-overrides.json
 * - 首次加载时自动迁移旧 workspace config 数据到文件存储
 *
 * 事件：
 * - onDidChange 在任何增删改操作后触发，供 TreeView / Chrome 面板刷新
 */
class SkillRegistry {
    /** 所有 Skill 的内存存储（name → Skill） */
    skills = new Map();
    /** 输出日志通道 */
    outputChannel;
    /** 用户数据目录管理器（持久化存储层） */
    userDataManager;
    /** Skill 变更事件 */
    _onDidChange = new vscode.EventEmitter();
    onDidChange = this._onDidChange.event;
    /** 预设 Skill 的 enabled 状态覆盖（从文件加载） */
    presetEnabledOverrides = new Map();
    constructor(userDataManager, outputChannel) {
        this.userDataManager = userDataManager;
        this.outputChannel = outputChannel;
    }
    /**
     * 加载所有 Skill：内置预设 + 文件存储中的自定义 Skill
     *
     * 调用时机：插件激活时（extension.ts activate）
     * 首次加载时自动检测旧 workspace config 数据并迁移到文件存储。
     */
    async loadSkills() {
        this.skills.clear();
        // 0. 首次加载时自动迁移旧 workspace config 数据
        await this.migrateFromWorkspaceConfig();
        // 1. 从 preset-overrides.json 加载预设 Skill enabled 状态覆盖
        const presetOverrides = await this.userDataManager.readJSON(...PRESET_OVERRIDES_FILE);
        this.presetEnabledOverrides = new Map(Object.entries(presetOverrides ?? {}));
        // 2. 注册内置预设 Skill（应用 enabled 状态覆盖）
        for (const preset of PRESET_SKILLS) {
            const skill = {
                ...preset,
                enabled: this.presetEnabledOverrides.has(preset.name)
                    ? this.presetEnabledOverrides.get(preset.name)
                    : preset.enabled,
            };
            this.skills.set(skill.name, skill);
        }
        // 3. 从 custom-skills.json 加载用户自定义 Skill
        const customSkills = await this.userDataManager.readJSON(...CUSTOM_SKILLS_FILE) ?? [];
        for (const custom of customSkills) {
            // 确保自定义 Skill 不覆盖内置预设
            if (this.isPresetName(custom.name)) {
                this.outputChannel.appendLine(`[SkillRegistry] 自定义 Skill "${custom.name}" 与预设冲突，跳过`);
                continue;
            }
            // 强制设置 category 为 custom
            this.skills.set(custom.name, { ...custom, category: 'custom' });
        }
        this.outputChannel.appendLine(`[SkillRegistry] 已加载 ${this.skills.size} 个 Skill（预设 ${PRESET_SKILLS.length} + 自定义 ${customSkills.length}）`);
        this._onDidChange.fire();
    }
    /**
     * 持久化自定义 Skill 和预设 Skill 的 enabled 状态到文件存储
     *
     * - custom-skills.json: 所有 category=custom 的 Skill
     * - preset-overrides.json: 预设 Skill 与默认值不同的 enabled 状态
     */
    async saveSkills() {
        // 保存自定义 Skill 到 custom-skills.json
        const customSkills = this.getAllCustom();
        await this.userDataManager.writeJSON(customSkills, ...CUSTOM_SKILLS_FILE);
        // 保存预设 Skill 的 enabled 状态覆盖到 preset-overrides.json
        const presetOverrides = {};
        for (const preset of PRESET_SKILLS) {
            const current = this.skills.get(preset.name);
            if (current && current.enabled !== preset.enabled) {
                presetOverrides[preset.name] = current.enabled;
            }
        }
        await this.userDataManager.writeJSON(presetOverrides, ...PRESET_OVERRIDES_FILE);
        this.outputChannel.appendLine(`[SkillRegistry] 已保存 ${customSkills.length} 个自定义 Skill 到 custom-skills.json`);
    }
    /**
     * 获取所有 Skill 列表
     */
    getAll() {
        return Array.from(this.skills.values());
    }
    /**
     * 获取所有自定义 Skill
     */
    getAllCustom() {
        return this.getAll().filter((s) => s.category === 'custom');
    }
    /**
     * 获取所有预设 Skill
     */
    getAllPreset() {
        return this.getAll().filter((s) => s.category === 'preset');
    }
    /**
     * 按名称查找 Skill
     */
    getByName(name) {
        return this.skills.get(name);
    }
    /**
     * 添加自定义 Skill
     *
     * @returns true 添加成功，false 名称已存在
     */
    async addSkill(skill) {
        if (this.skills.has(skill.name)) {
            this.outputChannel.appendLine(`[SkillRegistry] Skill "${skill.name}" 已存在，添加失败`);
            return false;
        }
        // 强制设置 category 为 custom
        this.skills.set(skill.name, { ...skill, category: 'custom' });
        await this.saveSkills();
        this._onDidChange.fire();
        this.outputChannel.appendLine(`[SkillRegistry] 已添加自定义 Skill: ${skill.name}`);
        return true;
    }
    /**
     * 移除自定义 Skill（预设 Skill 不可移除）
     *
     * @returns true 移除成功，false 不存在或为预设
     */
    async removeSkill(name) {
        if (this.isPresetName(name)) {
            this.outputChannel.appendLine(`[SkillRegistry] 预设 Skill "${name}" 不可移除`);
            return false;
        }
        if (!this.skills.has(name)) {
            return false;
        }
        this.skills.delete(name);
        await this.saveSkills();
        this._onDidChange.fire();
        this.outputChannel.appendLine(`[SkillRegistry] 已移除自定义 Skill: ${name}`);
        return true;
    }
    /**
     * 切换 Skill 的启用/禁用状态
     *
     * @returns 切换后的 enabled 值，若 Skill 不存在返回 undefined
     */
    async toggleEnabled(name) {
        const skill = this.skills.get(name);
        if (!skill) {
            return undefined;
        }
        skill.enabled = !skill.enabled;
        await this.saveSkills();
        this._onDidChange.fire();
        this.outputChannel.appendLine(`[SkillRegistry] Skill "${name}" 已${skill.enabled ? '启用' : '禁用'}`);
        return skill.enabled;
    }
    /**
     * 释放资源
     */
    dispose() {
        this._onDidChange.dispose();
    }
    // ────────────────────────────────────────────────────────────────
    // 私有方法
    // ────────────────────────────────────────────────────────────────
    /**
     * 检查名称是否属于内置预设 Skill
     */
    isPresetName(name) {
        return PRESET_SKILLS.some((s) => s.name === name);
    }
    /**
     * 从旧 workspace config 迁移数据到 UserDataManager 文件存储
     *
     * 迁移条件：custom-skills.json 文件不存在（说明从未使用过文件存储）
     * 且 workspace config 中存在 browserAgent.skills 或 browserAgent.skillPresetEnabled 数据。
     *
     * 迁移完成后清除旧 workspace config 数据，确保只迁移一次。
     */
    async migrateFromWorkspaceConfig() {
        // 如果文件存储已有数据，跳过迁移
        const hasCustomSkillsFile = await this.userDataManager.exists(...CUSTOM_SKILLS_FILE);
        const hasPresetOverridesFile = await this.userDataManager.exists(...PRESET_OVERRIDES_FILE);
        if (hasCustomSkillsFile || hasPresetOverridesFile) {
            return;
        }
        const config = vscode.workspace.getConfiguration('browserAgent');
        const oldCustomSkills = config.get('skills', []);
        const oldPresetOverrides = config.get('skillPresetEnabled', {});
        const hasOldData = oldCustomSkills.length > 0 ||
            Object.keys(oldPresetOverrides).length > 0;
        if (!hasOldData) {
            return;
        }
        this.outputChannel.appendLine(`[SkillRegistry] 检测到旧 workspace config 数据，开始迁移到文件存储...`);
        try {
            // 迁移自定义 Skill
            if (oldCustomSkills.length > 0) {
                await this.userDataManager.writeJSON(oldCustomSkills, ...CUSTOM_SKILLS_FILE);
                this.outputChannel.appendLine(`[SkillRegistry] 已迁移 ${oldCustomSkills.length} 个自定义 Skill 到 custom-skills.json`);
            }
            // 迁移预设开关覆盖
            if (Object.keys(oldPresetOverrides).length > 0) {
                await this.userDataManager.writeJSON(oldPresetOverrides, ...PRESET_OVERRIDES_FILE);
                this.outputChannel.appendLine(`[SkillRegistry] 已迁移预设开关覆盖到 preset-overrides.json`);
            }
            // 清除旧 workspace config 数据
            await config.update('skills', undefined, vscode.ConfigurationTarget.Workspace);
            await config.update('skillPresetEnabled', undefined, vscode.ConfigurationTarget.Workspace);
            this.outputChannel.appendLine(`[SkillRegistry] 旧 workspace config 数据已清除，迁移完成`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.outputChannel.appendLine(`[SkillRegistry] 迁移失败（将继续使用旧数据源）: ${message}`);
        }
    }
}
exports.SkillRegistry = SkillRegistry;
//# sourceMappingURL=skill-registry.js.map