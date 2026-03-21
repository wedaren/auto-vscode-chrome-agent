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
//# sourceMappingURL=llm-tools.d.ts.map