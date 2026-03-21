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
/** 选中文本最大字符数 (~2K-4K tokens) */
export declare const MAX_SELECTED_TEXT_CHARS = 8000;
/** URL 最大字符数 */
export declare const MAX_URL_CHARS = 2000;
/** 页面标题最大字符数 */
export declare const MAX_TITLE_CHARS = 500;
/** System Prompt 中浏览器上下文部分的最大字符数 (~3K-6K tokens) */
export declare const MAX_SYSTEM_PROMPT_CONTEXT_CHARS = 12000;
/** 单次工具观察结果最大字符数 */
export declare const MAX_OBSERVATION_CHARS = 6000;
/** 消息历史总字符预算 (~26K tokens，为回复留空间) */
export declare const MAX_MESSAGES_CHARS = 80000;
/**
 * 保守估算文本 token 数。
 *
 * 混合文本（中英混排）按 ~3 chars/token 估算，
 * 纯英文 ~4, 纯中文 ~2，取 3 作为安全中间值。
 */
export declare function estimateTokens(text: string): number;
export interface SmartTruncateOptions {
    /** 头部保留比例，默认 0.6（即 60% 给头部、40% 给尾部） */
    headRatio?: number;
    /** 截断占位符模板，{n} 会被替换为截断字符数。默认 '...[已截断 {n} 字符]...' */
    placeholderTemplate?: string;
}
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
export declare function smartTruncate(text: string, maxChars: number, options?: SmartTruncateOptions): string;
//# sourceMappingURL=context-budget.d.ts.map