"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLlmTool = isLlmTool;
exports.listLlmTools = listLlmTools;
exports.callLlmTool = callLlmTool;
// ────────────────────────────────────────────────────────────────
// 工具注册表
// ────────────────────────────────────────────────────────────────
/** 已注册的 LLM 工具名称 → 处理函数映射 */
const LLM_TOOL_REGISTRY = {
    llm_translate: handleLlmTranslate,
};
/**
 * 检查工具名称是否为已注册的 LLM 工具
 */
function isLlmTool(toolName) {
    return toolName in LLM_TOOL_REGISTRY;
}
/**
 * 列出所有可用的 LLM 工具
 */
function listLlmTools() {
    return [
        {
            name: 'llm_translate',
            description: '批量翻译文本段落。接收文本数组和目标语言，通过 vscode.lm API 调用语言模型翻译，返回与输入一一对应的翻译结果数组。',
        },
    ];
}
/**
 * 调用指定的 LLM 工具
 *
 * @param toolName llm_* 前缀的工具名称
 * @param args 工具参数
 * @param lmService LmService 实例
 * @param outputChannel 日志输出通道
 * @param token 取消令牌
 * @returns McpToolResult 标准工具结果
 */
async function callLlmTool(toolName, args, lmService, outputChannel, token) {
    const handler = LLM_TOOL_REGISTRY[toolName];
    if (!handler) {
        return {
            content: [{ type: 'text', text: `未知的 LLM 工具: ${toolName}` }],
            isError: true,
        };
    }
    return handler(args, lmService, outputChannel, token);
}
// ────────────────────────────────────────────────────────────────
// llm_translate 实现
// ────────────────────────────────────────────────────────────────
/** 单批最大段落数，避免 prompt 过长超出模型上下文 */
const TRANSLATE_BATCH_SIZE = 20;
/**
 * llm_translate 工具处理函数
 *
 * 将输入文本数组分批发送给 LLM 翻译，每批 ≤ TRANSLATE_BATCH_SIZE 段。
 * 翻译 prompt 要求 LLM 严格以 JSON 数组形式返回，保持段落顺序不变。
 *
 * 输入参数（从 args 解析）：
 * - texts: string[] — 待翻译段落
 * - targetLanguage: string — 目标语言
 * - sourceLanguage?: string — 源语言（可选）
 *
 * 输出：McpToolResult，content[0].text 为 JSON 序列化的 LlmTranslateResult
 */
async function handleLlmTranslate(args, lmService, outputChannel, token) {
    // ── 参数解析 ──
    let texts;
    const rawTexts = args.texts;
    if (typeof rawTexts === 'string') {
        // 兼容：上一步结果可能是 JSON 字符串
        try {
            const parsed = JSON.parse(rawTexts);
            if (Array.isArray(parsed)) {
                // 直接是数组
                texts = parsed.map(String);
            }
            else if (parsed && Array.isArray(parsed.paragraphs)) {
                // browser_extract_paragraphs 返回 { paragraphs: [...] } 格式
                texts = parsed.paragraphs.map((p) => (typeof p === 'string' ? p : p.text ?? JSON.stringify(p)));
            }
            else {
                texts = [rawTexts];
            }
        }
        catch {
            texts = [rawTexts];
        }
    }
    else if (Array.isArray(rawTexts)) {
        texts = rawTexts.map(String);
    }
    else {
        return {
            content: [{ type: 'text', text: 'llm_translate: 缺少 texts 参数或格式不正确（需要字符串数组）' }],
            isError: true,
        };
    }
    const targetLanguage = String(args.targetLanguage || args.target_language || 'zh-CN');
    const sourceLanguage = args.sourceLanguage || args.source_language;
    if (texts.length === 0) {
        return {
            content: [{ type: 'text', text: JSON.stringify({ translations: [], targetLanguage, count: 0 }) }],
            isError: false,
        };
    }
    outputChannel.appendLine(`[llm_translate] 开始翻译 ${texts.length} 段文本 → ${targetLanguage}`);
    // ── 分批翻译 ──
    const allTranslations = [];
    for (let batchStart = 0; batchStart < texts.length; batchStart += TRANSLATE_BATCH_SIZE) {
        if (token?.isCancellationRequested) {
            return {
                content: [{ type: 'text', text: 'llm_translate: 翻译被取消' }],
                isError: true,
            };
        }
        const batch = texts.slice(batchStart, batchStart + TRANSLATE_BATCH_SIZE);
        const batchIndex = Math.floor(batchStart / TRANSLATE_BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(texts.length / TRANSLATE_BATCH_SIZE);
        outputChannel.appendLine(`[llm_translate] 翻译批次 ${batchIndex}/${totalBatches}（${batch.length} 段）`);
        const batchResult = await translateBatch(batch, targetLanguage, sourceLanguage ? String(sourceLanguage) : undefined, lmService, outputChannel, token);
        allTranslations.push(...batchResult);
    }
    // ── 构建结果 ──
    const result = {
        translations: allTranslations,
        targetLanguage,
        count: allTranslations.length,
    };
    outputChannel.appendLine(`[llm_translate] 翻译完成: ${result.count} 段`);
    return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
        isError: false,
    };
}
/**
 * 翻译单批文本
 *
 * 通过精心构造的 prompt 要求 LLM：
 * 1. 严格输出 JSON 数组
 * 2. 数组长度与输入一致
 * 3. 保持段落原有顺序
 * 4. 仅翻译，不解释、不添加内容
 */
async function translateBatch(texts, targetLanguage, sourceLanguage, lmService, outputChannel, token) {
    const sourcePart = sourceLanguage ? ` from ${sourceLanguage}` : '';
    const systemPrompt = [
        `You are a professional translator. Translate the following text paragraphs${sourcePart} to ${targetLanguage}.`,
        '',
        'Rules:',
        '1. Return ONLY a JSON array of translated strings, no explanation.',
        '2. The array length MUST equal the input array length.',
        '3. Keep the same order as the input.',
        '4. Preserve any HTML tags in the text.',
        '5. If a paragraph is empty or whitespace-only, return it as-is.',
        '6. Do NOT wrap the JSON in markdown code blocks.',
    ].join('\n');
    const userMessage = JSON.stringify(texts);
    try {
        const response = await lmService.sendMessage(userMessage, systemPrompt, token);
        // 尝试从响应中解析 JSON 数组
        const translations = parseTranslationResponse(response, texts.length, outputChannel);
        return translations;
    }
    catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        outputChannel.appendLine(`[llm_translate] 批次翻译失败: ${errMsg}`);
        // 降级：返回原文
        return texts;
    }
}
/**
 * 解析 LLM 翻译响应
 *
 * 支持多种响应格式：
 * - 纯 JSON 数组: ["翻译1", "翻译2"]
 * - Markdown 包裹: ```json\n["翻译1"]\n```
 * - 降级：按行拆分
 */
function parseTranslationResponse(response, expectedCount, outputChannel) {
    const trimmed = response.trim();
    // 1. 尝试直接 JSON 解析
    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length === expectedCount) {
            return parsed.map(String);
        }
        if (Array.isArray(parsed)) {
            outputChannel.appendLine(`[llm_translate] 警告: 翻译结果数量 (${parsed.length}) 与输入 (${expectedCount}) 不匹配`);
            // 尽可能使用，不足的用原文补
            return parsed.map(String);
        }
    }
    catch {
        // 继续尝试其他格式
    }
    // 2. 尝试提取 markdown code block 中的 JSON
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
        try {
            const parsed = JSON.parse(codeBlockMatch[1].trim());
            if (Array.isArray(parsed)) {
                return parsed.map(String);
            }
        }
        catch {
            // 继续
        }
    }
    // 3. 尝试找到第一个 [ 和最后一个 ] 之间的内容
    const bracketStart = trimmed.indexOf('[');
    const bracketEnd = trimmed.lastIndexOf(']');
    if (bracketStart !== -1 && bracketEnd > bracketStart) {
        try {
            const parsed = JSON.parse(trimmed.substring(bracketStart, bracketEnd + 1));
            if (Array.isArray(parsed)) {
                return parsed.map(String);
            }
        }
        catch {
            // 继续
        }
    }
    // 4. 降级：按行拆分
    outputChannel.appendLine('[llm_translate] 警告: 无法解析 JSON 数组，按行拆分降级');
    const lines = trimmed.split('\n').filter((l) => l.trim().length > 0);
    return lines;
}
//# sourceMappingURL=llm-tools.js.map