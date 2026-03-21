import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpClient } from './mcp-client';
import { BrowserToolProvider } from './browser-tools';
import { SkillRegistry } from './skill-registry';
import { SkillRunner } from './skill-runner';
/** Agent 单步执行记录 */
export interface AgentStep {
    /** 当前步序号（从 1 开始） */
    step: number;
    /** 步骤类型：think=推理, act=工具调用, observe=观察结果 */
    type: 'think' | 'act' | 'observe';
    /** 步骤内容文本 */
    content: string;
    /** act 步骤的工具名称 */
    toolName?: string;
    /** act 步骤的工具参数 */
    toolArgs?: Record<string, unknown>;
}
/** AgentLoop 配置项 */
export interface AgentLoopOptions {
    /** 最大步数限制，防止无限循环（默认 MAX_STEPS） */
    maxSteps?: number;
    /** 总超时毫秒数，超时自动中断并返回 fallback 答案（默认 TOTAL_TIMEOUT_MS = 5 分钟） */
    totalTimeout?: number;
    /** 系统提示词前缀（含浏览器上下文等） */
    systemPrompt?: string;
    /** 每步执行回调，用于实时推送到 Chrome UI */
    onStep?: (step: AgentStep) => void;
}
/** AgentLoop 执行结果 */
export interface AgentLoopResult {
    /** 最终答案文本 */
    finalAnswer: string;
    /** 所有执行步骤记录 */
    steps: AgentStep[];
    /** 实际执行的 LLM 调用轮数 */
    totalSteps: number;
}
/**
 * AgentLoop 实现 ReAct (Reasoning + Acting) 模式的 Agent 循环。
 *
 * 流程：
 * 1. 将用户消息 + 可用 MCP 工具描述发给 LLM
 * 2. 解析 LLM 输出：
 *    - FINAL_ANSWER → 返回最终答案，循环结束
 *    - ACTION → 通过 McpClient 调用指定工具，将结果作为 OBSERVATION 反馈给 LLM
 * 3. 重复步骤 2 直到 FINAL_ANSWER 或达到 maxSteps 上限
 *
 * 设计要点：
 * - 多工具源支持：MCP 工具 + 原生浏览器工具（browser_* 前缀），无 MCP 也能进入 Agent 模式
 * - 工具路由：browser_* 前缀工具通过 BrowserToolProvider 原生通道执行，其余通过 McpClient
 * - 每一步（think/act/observe）通过 onStep 回调实时通知外部（WebSocket → Chrome UI）
 * - 支持 CancellationToken 随时中断循环
 * - 对话历史累积在 messages 数组中，LLM 可看到完整上下文
 */
export declare class AgentLoop {
    private readonly lmService;
    private readonly mcpClient;
    private readonly browserToolProvider?;
    private readonly skillRegistry?;
    private readonly skillRunner?;
    private readonly outputChannel;
    /** 默认最大步数（LLM 调用轮数） */
    static readonly MAX_STEPS = 15;
    /** 默认总超时（5 分钟 = 300000ms），防止 Agent 无限挂起 */
    static readonly TOTAL_TIMEOUT_MS: number;
    constructor(lmService: LmService, mcpClient: McpClient, outputChannel: vscode.OutputChannel, browserToolProvider?: BrowserToolProvider, skillRegistry?: SkillRegistry, skillRunner?: SkillRunner);
    /**
     * 执行 ReAct Agent 循环
     * @param userMessage 用户输入的指令/问题
     * @param options 配置项（maxSteps, systemPrompt, onStep 回调）
     * @param token 取消令牌，用于随时中断循环
     * @returns 最终答案 + 完整步骤记录
     */
    run(userMessage: string, options?: AgentLoopOptions, token?: vscode.CancellationToken): Promise<AgentLoopResult>;
    /**
     * 调用 LLM 并收集完整文本输出。
     * 当外部未提供 CancellationToken 时，创建临时 CTS 并在完成后自动 dispose，避免孤立资源泄漏。
     */
    private callLlm;
    /**
     * 获取所有可用工具描述列表（MCP + 原生浏览器工具），格式化为 LLM 可理解的文本。
     *
     * 合并策略：
     * - browser_* 前缀工具优先来自 BrowserToolProvider（原生通道，更快更可靠）
     * - 若 MCP 也提供同名 browser_* 工具，原生版本优先，MCP 版本跳过
     * - 非 browser_* 的 MCP 工具正常列出，且渲染完整参数签名（inputSchema）
     */
    private getToolDescriptions;
    /**
     * 将 MCP 工具的 inputSchema（JSON Schema）渲染为 LLM 可读的函数签名。
     *
     * 输出格式示例：
     *   - navigate_page(url: string [必填] — 要导航到的 URL, waitUntil?: string — 等待条件) — 导航到指定 URL
     *
     * 如果 inputSchema 不存在或无 properties，则退化为简洁格式：
     *   - navigate_page: 导航到指定 URL
     */
    private formatMcpToolSignature;
    /**
     * 构建 Agent 系统提示词，包含 ReAct 格式指令、可用工具列表、
     * 工具组合 few-shot 范例、多步骤编排建议、错误恢复指导
     */
    private buildAgentSystemPrompt;
    /**
     * 解析 LLM 输出，识别 THOUGHT / ACTION / FINAL_ANSWER 结构
     */
    private parseLlmOutput;
    /**
     * 执行工具调用并格式化结果。
     *
     * 路由策略：
     * - run_skill → SkillRunner.execute（Skill 执行引擎）
     * - browser_* 前缀 且 BrowserToolProvider 可用 → BrowserToolProvider.callTool（原生通道）
     * - 其他 → McpClient.callTool
     */
    private executeTool;
    /**
     * 执行 run_skill 工具：解析 LLM 传入的 skill_name + params，调用 SkillRunner
     */
    private executeRunSkill;
    /**
     * 格式化 MCP 工具调用结果为可读文本
     */
    private formatToolResult;
    /**
     * 创建 AgentStep 实例的工厂方法
     */
    private createStep;
    /**
     * 计算单条消息的文本字符总数。
     * vscode.LanguageModelChatMessage.content 是 LanguageModelContentPart[] 数组，
     * 文本部分（LanguageModelTextPart）有 .value 属性。
     */
    private getMessageTextLength;
    /**
     * 计算消息数组的总文本字符数。
     */
    private calcMessagesChars;
    /**
     * 消息窗口管理：当 messages 总字符数超过 MAX_MESSAGES_CHARS 时，
     * 移除最早的非系统消息轮次（保留 system prompt + 用户初始消息 + 最近 N 轮对话）。
     *
     * 策略：
     * - messages[0] 是 system prompt（Agent 系统提示），始终保留
     * - messages[1] 是用户原始消息，始终保留
     * - 从 messages[2] 开始移除最早的消息，直到总字符数降到预算内
     * - 每次移除一条消息，直到降到预算内
     */
    private trimMessages;
    /**
     * 总结已执行的步骤（达到 maxSteps 上限时用于生成 fallback 答案）
     */
    private summarizeSteps;
}
//# sourceMappingURL=agent-loop.d.ts.map