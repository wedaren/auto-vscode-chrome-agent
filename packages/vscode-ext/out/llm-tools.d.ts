import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpToolResult } from './mcp-client';
/** llm_translate 工具入参 */
export interface LlmTranslateArgs {
    /** 待翻译文本数组（段落级） */
    texts: string[];
    /** 目标语言（如 "zh-CN", "en", "ja"） */
    targetLanguage: string;
    /** 源语言（可选，默认自动检测） */
    sourceLanguage?: string;
}
/** llm_translate 工具输出结构（嵌入在 resultText JSON 中） */
export interface LlmTranslateResult {
    /** 翻译后的文本数组，与 texts 一一对应 */
    translations: string[];
    /** 目标语言 */
    targetLanguage: string;
    /** 翻译的段落数量 */
    count: number;
}
/**
 * 检查工具名称是否为已注册的 LLM 工具
 */
export declare function isLlmTool(toolName: string): boolean;
/**
 * 列出所有可用的 LLM 工具
 */
export declare function listLlmTools(): {
    name: string;
    description: string;
}[];
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
export declare function callLlmTool(toolName: string, args: Record<string, unknown>, lmService: LmService, outputChannel: vscode.OutputChannel, token?: vscode.CancellationToken): Promise<McpToolResult>;
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
export declare function resolveTextsFromArgs(args: Record<string, unknown>): string[] | null;
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
export declare function extractTextsFromValue(value: unknown): string[] | null;
//# sourceMappingURL=llm-tools.d.ts.map