// llm-tools.ts — LLM 工具注册表
// 职责：提供 llm_* 前缀的工具实现，由 SkillRunner 通过前缀路由调用。
//       实现：llm_translate（批量翻译工具）、llm_translate_progressive（渐进式翻译+即时注入）。
//       所有 LLM 工具通过 LmService 调用 vscode.lm API。
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpToolResult } from './mcp-client';

// ────────────────────────────────────────────────────────────────
// 类型定义
// ────────────────────────────────────────────────────────────────

/** llm_translate 工具入参 */
export interface LlmTranslateArgs {
  /** 待翻译文本数组（段落级） */
  texts: string[];
  /** 目标语言（如 "zh-CN", "en", "ja"） */
  targetLanguage: string;
  /** 源语言（可选，默认自动检测） */
  sourceLanguage?: string;
}

/** 参数名别名优先级：texts > paragraphs > input（fallback 链） */
const TEXT_ARG_ALIASES = ['texts', 'paragraphs', 'input'] as const;

/** llm_translate 工具输出结构（嵌入在 resultText JSON 中） */
export interface LlmTranslateResult {
  /** 翻译后的文本数组，与 texts 一一对应 */
  translations: string[];
  /** 目标语言 */
  targetLanguage: string;
  /** 翻译的段落数量 */
  count: number;
}

// ────────────────────────────────────────────────────────────────
// evo_v30_001: LlmToolContext — 渐进式翻译所需的外部依赖
// ────────────────────────────────────────────────────────────────

/** translate_progress 消息 payload */
export interface TranslateProgressPayload {
  translated: number;
  total: number;
  batchIndex: number;
  totalBatches: number;
  status: 'translating' | 'injecting' | 'done' | 'error';
}

/**
 * LLM 工具执行上下文 — 为需要与浏览器交互的 LLM 工具（如 llm_translate_progressive）
 * 提供调用浏览器工具和发送进度通知的能力。
 *
 * 由 SkillRunner 在 callTool 路由时构造，普通 llm_translate 可忽略此参数。
 */
export interface LlmToolContext {
  /** 调用浏览器工具（如 browser_inject_bilingual），由 BrowserToolProvider.callTool 包装 */
  callBrowserTool?: (toolName: string, args: Record<string, unknown>, targetTabId?: number) => Promise<McpToolResult>;
  /** 发送 translate_progress 消息到 Chrome 侧，由 WsServer.send 包装 */
  sendTranslateProgress?: (payload: TranslateProgressPayload) => void;
  /** Chrome 侧锁定的目标 Tab ID */
  targetTabId?: number;
}

/** LLM 工具处理函数签名 */
type LlmToolHandler = (
  args: Record<string, unknown>,
  lmService: LmService,
  outputChannel: vscode.OutputChannel,
  token?: vscode.CancellationToken,
  context?: LlmToolContext,
) => Promise<McpToolResult>;

// ────────────────────────────────────────────────────────────────
// 工具注册表
// ────────────────────────────────────────────────────────────────

/** 已注册的 LLM 工具名称 → 处理函数映射 */
const LLM_TOOL_REGISTRY: Record<string, LlmToolHandler> = {
  llm_translate: handleLlmTranslate,
  llm_translate_progressive: handleLlmTranslateProgressive,
};

/**
 * 检查工具名称是否为已注册的 LLM 工具
 */
export function isLlmTool(toolName: string): boolean {
  return toolName in LLM_TOOL_REGISTRY;
}

/**
 * 列出所有可用的 LLM 工具
 */
export function listLlmTools(): { name: string; description: string }[] {
  return [
    {
      name: 'llm_translate',
      description:
        '批量翻译文本段落。接收文本数组和目标语言，通过 vscode.lm API 调用语言模型翻译，返回与输入一一对应的翻译结果数组。',
    },
    {
      name: 'llm_translate_progressive',
      description:
        '渐进式翻译+即时注入。首批 5 段、后续每批 15 段，每批翻译完立即通过 browser_inject_bilingual 注入页面，并推送 translate_progress 进度消息。',
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
 * @param context 可选的工具上下文（渐进式翻译等需要浏览器交互的工具使用）
 * @returns McpToolResult 标准工具结果
 */
export async function callLlmTool(
  toolName: string,
  args: Record<string, unknown>,
  lmService: LmService,
  outputChannel: vscode.OutputChannel,
  token?: vscode.CancellationToken,
  context?: LlmToolContext,
): Promise<McpToolResult> {
  const handler = LLM_TOOL_REGISTRY[toolName];
  if (!handler) {
    return {
      content: [{ type: 'text', text: `未知的 LLM 工具: ${toolName}` }],
      isError: true,
    };
  }
  return handler(args, lmService, outputChannel, token, context);
}

// ────────────────────────────────────────────────────────────────
// llm_translate 实现
// ────────────────────────────────────────────────────────────────

/** 单批最大段落数，避免 prompt 过长超出模型上下文 */
const TRANSLATE_BATCH_SIZE = 20;

// ────────────────────────────────────────────────────────────────
// 参数解析：多参数名兼容 + 结构化结果自动提取
// ────────────────────────────────────────────────────────────────

/**
 * 从 args 的多个 alias key 中解析出文本数组。
 *
 * 查找顺序（fallback 链）：texts → paragraphs → input
 * 对于每个候选值，支持以下格式：
 *   1. string[]（直接数组）
 *   2. JSON 字符串 → 解析后递归处理
 *   3. 结构化对象：{ paragraphs: [{text:"..."}] } / { texts: [...] } / 顶层数组
 *   4. 单个非空字符串 → 包装为单元素数组
 *
 * @returns 解析后的文本数组，解析失败返回 null
 */
export function resolveTextsFromArgs(args: Record<string, unknown>): string[] | null {
  // 按优先级显式检查每个 alias key，支持多参数名 fallback
  // 优先级 1：args.texts（标准参数名）
  const fromTexts = extractTextsFromValue(args.texts);
  if (fromTexts && fromTexts.length > 0) { return fromTexts; }

  // 优先级 2：args.paragraphs（browser_extract_paragraphs 输出兼容）
  const fromParagraphs = extractTextsFromValue(args.paragraphs);
  if (fromParagraphs && fromParagraphs.length > 0) { return fromParagraphs; }

  // 优先级 3：args.input（通用 fallback alias）
  const fromInput = extractTextsFromValue(args.input);
  if (fromInput && fromInput.length > 0) { return fromInput; }

  return null;
}

/**
 * 从单个值中提取文本数组。
 *
 * 支持 5 种输入格式：
 *   格式 A — string[]：直接返回
 *   格式 B — JSON 字符串 "[\"a\",\"b\"]"：解析为数组
 *   格式 C — JSON 字符串 "{\"paragraphs\":[{\"text\":\"...\"}]}"：提取 .paragraphs[].text
 *   格式 D — JSON 字符串 "{\"texts\":[\"a\",\"b\"]}"：提取 .texts
 *   格式 E — 非空纯字符串：包装为 [str]
 *   格式 F — 对象 { paragraphs: [...] } 或 { texts: [...] }：直接提取
 */
export function extractTextsFromValue(value: unknown): string[] | null {
  // ── 格式 A：直接数组 ──
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === 'string' ? item : (item && typeof item === 'object' && 'text' in item)
        ? String((item as { text: unknown }).text)
        : JSON.stringify(item),
    );
  }

  // ── 字符串类型：可能是 JSON 或纯文本 ──
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) { return null; }

    // 尝试 JSON 解析
    try {
      const parsed = JSON.parse(trimmed);
      return extractTextsFromParsed(parsed);
    } catch {
      // 格式 E：普通字符串 → 单元素数组
      return [value];
    }
  }

  // ── 格式 F：已经是对象（非字符串、非数组） ──
  if (value && typeof value === 'object') {
    return extractTextsFromParsed(value);
  }

  return null;
}

/**
 * 从已解析的 JSON 值中提取文本数组（内部工具函数）
 *
 * 支持：
 *   - 顶层数组 ["a","b"] 或 [{text:"a"},{text:"b"}]
 *   - { paragraphs: [{text:"a"}, ...] }
 *   - { texts: ["a","b"] }
 */
function extractTextsFromParsed(parsed: unknown): string[] | null {
  // 顶层数组
  if (Array.isArray(parsed)) {
    return parsed.map((item) =>
      typeof item === 'string' ? item : (item && typeof item === 'object' && 'text' in item)
        ? String((item as { text: unknown }).text)
        : JSON.stringify(item),
    );
  }

  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;

    // { paragraphs: [...] } — browser_extract_paragraphs 标准输出
    if (Array.isArray(obj.paragraphs)) {
      return (obj.paragraphs as Array<{ text?: string } | string>).map(
        (p) => (typeof p === 'string' ? p : (p && typeof p === 'object' && 'text' in p) ? String(p.text) : JSON.stringify(p)),
      );
    }

    // { texts: [...] }
    if (Array.isArray(obj.texts)) {
      return (obj.texts as unknown[]).map(String);
    }
  }

  return null;
}

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
async function handleLlmTranslate(
  args: Record<string, unknown>,
  lmService: LmService,
  outputChannel: vscode.OutputChannel,
  token?: vscode.CancellationToken,
): Promise<McpToolResult> {
  // ── 参数解析（多参数名兼容 + 结构化结果自动提取） ──
  const texts = resolveTextsFromArgs(args);
  if (!texts) {
    return {
      content: [{ type: 'text', text: 'llm_translate: 缺少 texts 参数或格式不正确（需要字符串数组）。支持的参数名: texts / paragraphs / input' }],
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

  outputChannel.appendLine(
    `[llm_translate] 开始翻译 ${texts.length} 段文本 → ${targetLanguage}`,
  );

  // ── 分批翻译 ──
  const allTranslations: string[] = [];

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

    outputChannel.appendLine(
      `[llm_translate] 翻译批次 ${batchIndex}/${totalBatches}（${batch.length} 段）`,
    );

    const batchResult = await translateBatch(
      batch,
      targetLanguage,
      sourceLanguage ? String(sourceLanguage) : undefined,
      lmService,
      outputChannel,
      token,
    );

    allTranslations.push(...batchResult);
  }

  // ── 构建结果 ──
  const result: LlmTranslateResult = {
    translations: allTranslations,
    targetLanguage,
    count: allTranslations.length,
  };

  outputChannel.appendLine(
    `[llm_translate] 翻译完成: ${result.count} 段`,
  );

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
async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string | undefined,
  lmService: LmService,
  outputChannel: vscode.OutputChannel,
  token?: vscode.CancellationToken,
): Promise<string[]> {
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
  } catch (err) {
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
function parseTranslationResponse(
  response: string,
  expectedCount: number,
  outputChannel: vscode.OutputChannel,
): string[] {
  const trimmed = response.trim();

  // 1. 尝试直接 JSON 解析
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed) && parsed.length === expectedCount) {
      return parsed.map(String);
    }
    if (Array.isArray(parsed)) {
      outputChannel.appendLine(
        `[llm_translate] 警告: 翻译结果数量 (${parsed.length}) 与输入 (${expectedCount}) 不匹配`,
      );
      // 尽可能使用，不足的用原文补
      return parsed.map(String);
    }
  } catch {
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
    } catch {
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
    } catch {
      // 继续
    }
  }

  // 4. 降级：按行拆分
  outputChannel.appendLine(
    '[llm_translate] 警告: 无法解析 JSON 数组，按行拆分降级',
  );
  const lines = trimmed.split('\n').filter((l) => l.trim().length > 0);
  return lines;
}

// ────────────────────────────────────────────────────────────────
// evo_v30_001: llm_translate_progressive — 渐进式翻译+即时注入
// ────────────────────────────────────────────────────────────────

/** 首批翻译段落数（快速出首屏结果） */
const FIRST_BATCH_SIZE = 5;

/** 后续每批翻译段落数 */
const PROGRESSIVE_BATCH_SIZE = 15;

/** 带 id 的段落结构（来自 browser_extract_paragraphs 输出） */
interface ParagraphWithId {
  id: string;
  text: string;
}

/** 失败批次记录（用于末尾重试） */
interface FailedBatch {
  batchIndex: number;
  paragraphs: ParagraphWithId[];
  error: string;
}

/**
 * 从 args 中解析带 id 的段落数组。
 *
 * 支持格式：
 * - { paragraphs: [{ id, text }, ...] }（browser_extract_paragraphs 标准输出）
 * - JSON 字符串形式的上述结构
 * - args.texts / args.paragraphs / args.input 中的各种嵌套
 *
 * @returns 解析后的 ParagraphWithId[] 或 null
 */
function resolveParagraphsWithIds(args: Record<string, unknown>): ParagraphWithId[] | null {
  // 尝试从常见参数名中提取
  const candidates = [args.texts, args.paragraphs, args.input, args];

  for (const raw of candidates) {
    const result = extractParagraphsWithIds(raw);
    if (result && result.length > 0) { return result; }
  }

  return null;
}

/**
 * 从单个值中提取 { id, text }[] 段落数组。
 * 递归处理 JSON 字符串、对象、数组等格式。
 */
function extractParagraphsWithIds(value: unknown): ParagraphWithId[] | null {
  if (!value) { return null; }

  // JSON 字符串 → 解析后递归
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) { return null; }
    try {
      const parsed = JSON.parse(trimmed);
      return extractParagraphsWithIds(parsed);
    } catch {
      return null;
    }
  }

  // 数组：[{ id, text }, ...]
  if (Array.isArray(value)) {
    const items = value
      .filter((item): item is { id: string; text: string } =>
        item && typeof item === 'object' && typeof item.id === 'string' && typeof item.text === 'string')
      .map(({ id, text }) => ({ id, text }));
    return items.length > 0 ? items : null;
  }

  // 对象：{ paragraphs: [...] } 或 { count, paragraphs: [...] }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (Array.isArray(obj.paragraphs)) {
      return extractParagraphsWithIds(obj.paragraphs);
    }
  }

  return null;
}

/**
 * llm_translate_progressive — 渐进式翻译核心工具
 *
 * 翻译一批注入一批：
 * 1. 首批 FIRST_BATCH_SIZE=5 段 → 快速翻译 → 立即注入 → 推送进度
 * 2. 后续每批 PROGRESSIVE_BATCH_SIZE=15 段 → 翻译 → 注入 → 推送进度
 * 3. 单批失败 → 记录并继续后续批次
 * 4. 全部处理完 → 对失败批次重试一次
 *
 * 需要 LlmToolContext 提供 callBrowserTool 和 sendTranslateProgress 回调。
 * 如果 context 缺失（如从 AgentLoop 直接调用），退化为普通 llm_translate 行为。
 */
async function handleLlmTranslateProgressive(
  args: Record<string, unknown>,
  lmService: LmService,
  outputChannel: vscode.OutputChannel,
  token?: vscode.CancellationToken,
  context?: LlmToolContext,
): Promise<McpToolResult> {
  // ── 1. 参数解析 ──
  const paragraphs = resolveParagraphsWithIds(args);
  if (!paragraphs || paragraphs.length === 0) {
    // 降级：尝试作为纯文本数组处理（兼容无 id 场景）
    const texts = resolveTextsFromArgs(args);
    if (!texts || texts.length === 0) {
      return {
        content: [{ type: 'text', text: 'llm_translate_progressive: 缺少 paragraphs 参数或格式不正确。需要 [{ id, text }] 数组。' }],
        isError: true,
      };
    }
    // 无 id → 用索引生成 fallback id
    const fallbackParagraphs = texts.map((t, i) => ({ id: `fallback-${i}`, text: t }));
    return executeProgressiveTranslation(fallbackParagraphs, args, lmService, outputChannel, token, context);
  }

  return executeProgressiveTranslation(paragraphs, args, lmService, outputChannel, token, context);
}

/**
 * 渐进式翻译执行核心
 */
async function executeProgressiveTranslation(
  paragraphs: ParagraphWithId[],
  args: Record<string, unknown>,
  lmService: LmService,
  outputChannel: vscode.OutputChannel,
  token?: vscode.CancellationToken,
  context?: LlmToolContext,
): Promise<McpToolResult> {
  const targetLanguage = String(args.targetLanguage || args.target_language || 'zh-CN');
  const sourceLanguage = args.sourceLanguage || args.source_language;
  const total = paragraphs.length;

  outputChannel.appendLine(
    `[llm_translate_progressive] 开始渐进式翻译 ${total} 段 → ${targetLanguage}（首批 ${FIRST_BATCH_SIZE}，后续每批 ${PROGRESSIVE_BATCH_SIZE}）`,
  );

  // ── 2. 切分批次：首批 5 段，后续每批 15 段 ──
  const batches: ParagraphWithId[][] = [];
  if (total > 0) {
    batches.push(paragraphs.slice(0, FIRST_BATCH_SIZE));
    for (let i = FIRST_BATCH_SIZE; i < total; i += PROGRESSIVE_BATCH_SIZE) {
      batches.push(paragraphs.slice(i, i + PROGRESSIVE_BATCH_SIZE));
    }
  }
  const totalBatches = batches.length;

  outputChannel.appendLine(
    `[llm_translate_progressive] 共 ${totalBatches} 个批次`,
  );

  // ── 3. 逐批处理 ──
  const allTranslations: string[] = [];
  const failedBatches: FailedBatch[] = [];
  let translatedCount = 0;

  for (let bi = 0; bi < totalBatches; bi++) {
    if (token?.isCancellationRequested) {
      outputChannel.appendLine('[llm_translate_progressive] 翻译被取消');
      return {
        content: [{ type: 'text', text: 'llm_translate_progressive: 翻译被取消' }],
        isError: true,
      };
    }

    const batch = batches[bi];
    const batchTexts = batch.map((p) => p.text);

    // 通知：翻译中
    context?.sendTranslateProgress?.({
      translated: translatedCount,
      total,
      batchIndex: bi + 1,
      totalBatches,
      status: 'translating',
    });

    outputChannel.appendLine(
      `[llm_translate_progressive] 批次 ${bi + 1}/${totalBatches}（${batch.length} 段）→ 翻译中`,
    );

    try {
      const batchResult = await translateBatch(
        batchTexts,
        targetLanguage,
        sourceLanguage ? String(sourceLanguage) : undefined,
        lmService,
        outputChannel,
        token,
      );

      // 翻译成功 → 立即注入
      allTranslations.push(...batchResult);
      translatedCount += batch.length;

      // 通知：注入中
      context?.sendTranslateProgress?.({
        translated: translatedCount,
        total,
        batchIndex: bi + 1,
        totalBatches,
        status: 'injecting',
      });

      // 构建注入 payload：[{ id, translated }]
      const injectPayload = batch.map((p, idx) => ({
        id: p.id,
        translated: batchResult[idx] ?? p.text,
      }));

      // 通过 BrowserToolProvider 调用 browser_inject_bilingual
      if (context?.callBrowserTool) {
        try {
          await context.callBrowserTool(
            'browser_inject_bilingual',
            {
              mode: 'inject',
              translations: JSON.stringify(injectPayload),
            },
            context.targetTabId,
          );
          outputChannel.appendLine(
            `[llm_translate_progressive] 批次 ${bi + 1} 注入完成（${batch.length} 段）`,
          );
        } catch (injectErr) {
          const errMsg = injectErr instanceof Error ? injectErr.message : String(injectErr);
          outputChannel.appendLine(
            `[llm_translate_progressive] 批次 ${bi + 1} 注入失败: ${errMsg}（翻译结果保留）`,
          );
        }
      }
    } catch (err) {
      // 批次翻译失败 → 记录并继续
      const errMsg = err instanceof Error ? err.message : String(err);
      outputChannel.appendLine(
        `[llm_translate_progressive] 批次 ${bi + 1} 翻译失败: ${errMsg}，跳过继续`,
      );
      failedBatches.push({ batchIndex: bi, paragraphs: batch, error: errMsg });
      // 用原文占位
      allTranslations.push(...batch.map((p) => p.text));
    }
  }

  // ── 4. 重试失败批次（最多重试一次） ──
  const retriedBatches: number[] = [];
  const stillFailedBatches: number[] = [];

  if (failedBatches.length > 0) {
    outputChannel.appendLine(
      `[llm_translate_progressive] RETRY: 重试 ${failedBatches.length} 个失败批次`,
    );

    for (const fb of failedBatches) {
      if (token?.isCancellationRequested) { break; }

      const retryTexts = fb.paragraphs.map((p) => p.text);
      try {
        const retryResult = await translateBatch(
          retryTexts,
          targetLanguage,
          sourceLanguage ? String(sourceLanguage) : undefined,
          lmService,
          outputChannel,
          token,
        );

        // 计算原始偏移，替换 allTranslations 中对应位置
        let offset = 0;
        for (let k = 0; k < fb.batchIndex; k++) {
          offset += batches[k].length;
        }
        for (let j = 0; j < retryResult.length; j++) {
          allTranslations[offset + j] = retryResult[j];
        }

        // 重试成功 → 注入
        const injectPayload = fb.paragraphs.map((p, idx) => ({
          id: p.id,
          translated: retryResult[idx] ?? p.text,
        }));

        if (context?.callBrowserTool) {
          try {
            await context.callBrowserTool(
              'browser_inject_bilingual',
              { mode: 'inject', translations: JSON.stringify(injectPayload) },
              context.targetTabId,
            );
          } catch {
            // 注入失败不影响结果
          }
        }

        retriedBatches.push(fb.batchIndex);
        outputChannel.appendLine(
          `[llm_translate_progressive] RETRY 批次 ${fb.batchIndex + 1} 成功`,
        );
      } catch (retryErr) {
        stillFailedBatches.push(fb.batchIndex);
        outputChannel.appendLine(
          `[llm_translate_progressive] RETRY 批次 ${fb.batchIndex + 1} 仍然失败`,
        );
      }
    }
  }

  // ── 5. 发送完成通知 ──
  context?.sendTranslateProgress?.({
    translated: total,
    total,
    batchIndex: totalBatches,
    totalBatches,
    status: 'done',
  });

  // ── 6. 构建结果 ──
  const result = {
    translations: allTranslations,
    targetLanguage,
    count: allTranslations.length,
    totalBatches,
    failedBatches: stillFailedBatches,
    retriedBatches,
  };

  outputChannel.appendLine(
    `[llm_translate_progressive] 翻译完成: ${result.count} 段，失败 ${stillFailedBatches.length} 批`,
  );

  return {
    content: [{ type: 'text', text: JSON.stringify(result) }],
    isError: false,
  };
}
