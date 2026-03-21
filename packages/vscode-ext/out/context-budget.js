"use strict";
/**
 * context-budget.ts — 上下文预算常量与截断工具
 *
 * 职责：
 *   1. 定义全局上下文预算常量（字符数级别），各模块统一引用
 *   2. 提供 token 估算函数 estimateTokens()
 *   3. 提供智能截断函数 smartTruncate()，保留头尾并插入截断占位符
 *
 * 设计依据：knowledge/evolution_context_explosion.md
 *   - 分层防御策略：源头限制 → 入口过滤 → 运行时预算 → 溢出兜底
 *   - 混合文本保守估算 ~3 chars/token
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_MESSAGES_CHARS = exports.MAX_OBSERVATION_CHARS = exports.MAX_SYSTEM_PROMPT_CONTEXT_CHARS = exports.MAX_TITLE_CHARS = exports.MAX_URL_CHARS = exports.MAX_SELECTED_TEXT_CHARS = void 0;
exports.estimateTokens = estimateTokens;
exports.smartTruncate = smartTruncate;
// ─── Chrome 侧采集限制 ────────────────────────────────────
/** 选中文本最大字符数 (~2K-4K tokens) */
exports.MAX_SELECTED_TEXT_CHARS = 8000;
/** URL 最大字符数 */
exports.MAX_URL_CHARS = 2000;
/** 页面标题最大字符数 */
exports.MAX_TITLE_CHARS = 500;
// ─── VSCode 侧 system prompt 预算 ─────────────────────────
/** System Prompt 中浏览器上下文部分的最大字符数 (~3K-6K tokens) */
exports.MAX_SYSTEM_PROMPT_CONTEXT_CHARS = 12000;
// ─── AgentLoop 限制 ───────────────────────────────────────
/** 单次工具观察结果最大字符数 */
exports.MAX_OBSERVATION_CHARS = 6000;
/** 消息历史总字符预算 (~26K tokens，为回复留空间) */
exports.MAX_MESSAGES_CHARS = 80000;
// ─── Token 估算 ──────────────────────────────────────────
/**
 * 保守估算文本 token 数。
 *
 * 混合文本（中英混排）按 ~3 chars/token 估算，
 * 纯英文 ~4, 纯中文 ~2，取 3 作为安全中间值。
 */
function estimateTokens(text) {
    if (!text) {
        return 0;
    }
    return Math.ceil(text.length / 3);
}
const DEFAULT_HEAD_RATIO = 0.6;
const DEFAULT_PLACEHOLDER_TEMPLATE = '...[已截断 {n} 字符]...';
/**
 * 智能截断文本，保留头部和尾部，中间插入截断占位符。
 *
 * 如果 text 长度 <= maxChars，原样返回。
 * 否则按 headRatio 比例分割头/尾保留区，中间用占位符连接。
 *
 * @param text      待截断文本
 * @param maxChars  最大允许字符数（含占位符）
 * @param options   可选配置
 * @returns         截断后的文本（长度 <= maxChars）
 */
function smartTruncate(text, maxChars, options) {
    if (!text || text.length <= maxChars) {
        return text ?? '';
    }
    const headRatio = options?.headRatio ?? DEFAULT_HEAD_RATIO;
    const template = options?.placeholderTemplate ?? DEFAULT_PLACEHOLDER_TEMPLATE;
    const truncatedCount = text.length - maxChars;
    // 生成实际占位符
    const placeholder = template.replace('{n}', String(truncatedCount));
    // 留给头尾的可用字符数 = maxChars - 占位符长度
    const availableChars = maxChars - placeholder.length;
    if (availableChars <= 0) {
        // maxChars 极小时，直接返回裁剪后的头部
        return text.slice(0, maxChars);
    }
    const headChars = Math.floor(availableChars * headRatio);
    const tailChars = availableChars - headChars;
    const head = text.slice(0, headChars);
    const tail = tailChars > 0 ? text.slice(-tailChars) : '';
    return head + placeholder + tail;
}
//# sourceMappingURL=context-budget.js.map