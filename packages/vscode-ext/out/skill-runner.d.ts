import * as vscode from 'vscode';
import { Skill } from './skill-registry';
import { BrowserToolProvider } from './browser-tools';
import { McpClient } from './mcp-client';
/** 单步执行结果 */
export interface SkillStepResult {
    /** 步骤序号（从 0 开始） */
    stepIndex: number;
    /** 步骤描述 */
    description: string;
    /** 调用的工具名称 */
    toolName: string;
    /** 实际传入的参数（插值后） */
    resolvedArgs: Record<string, unknown>;
    /** 工具返回内容文本 */
    resultText: string;
    /** 是否成功 */
    success: boolean;
    /** 是否为可选步骤 */
    optional: boolean;
    /** 失败时的错误信息 */
    error?: string;
}
/** Skill 整体执行结果 */
export interface SkillRunResult {
    /** 是否全部（非可选）步骤成功 */
    success: boolean;
    /** 每步的执行结果 */
    stepResults: SkillStepResult[];
    /** 汇总文本（成功时为各步结果拼接，失败时包含错误信息） */
    summary: string;
}
/** 进度回调参数 */
export interface SkillProgress {
    /** 当前步骤序号（从 0 开始） */
    stepIndex: number;
    /** 总步骤数 */
    totalSteps: number;
    /** 当前状态 */
    status: 'running' | 'success' | 'failed' | 'skipped';
    /** 当前步骤结果文本 */
    result?: string;
    /** 当前步骤描述 */
    description: string;
}
/**
 * SkillRunner — Skill 执行引擎
 *
 * 按 Skill.steps 列表顺序执行每个工具调用：
 * 1. 校验 skill.enabled 和参数完整性
 * 2. 逐步遍历 steps，将 argsTemplate 中的占位符替换为实际值：
 *    - {{param}}   → 用户参数值
 *    - {{$prev}}   → 上一步的 resultText（步骤结果传递）
 *    - {{$step_N}} → 第 N 步的 resultText（跨步骤结果引用）
 * 3. 根据 toolName 前缀路由到 BrowserToolProvider（browser_*）或 McpClient
 * 4. 通过 onProgress 回调报告每步进度
 * 5. 支持 CancellationToken 中断
 * 6. 步骤失败时根据 optional 标记决定跳过或终止
 */
export declare class SkillRunner {
    private readonly browserToolProvider;
    private readonly mcpClient;
    private readonly outputChannel;
    constructor(browserToolProvider: BrowserToolProvider, mcpClient: McpClient, outputChannel: vscode.OutputChannel);
    /**
     * 执行指定 Skill
     *
     * @param skill 要执行的 Skill 定义
     * @param params 用户提供的参数值（key → value）
     * @param onProgress 每步进度回调（可选）
     * @param token 取消令牌（可选）
     * @returns SkillRunResult 执行结果
     */
    execute(skill: Skill, params: Record<string, string>, onProgress?: (progress: SkillProgress) => void, token?: vscode.CancellationToken): Promise<SkillRunResult>;
    /**
     * 执行单个 SkillStep
     *
     * @param step 当前步骤定义
     * @param stepIndex 当前步骤序号
     * @param params 用户参数
     * @param previousResults 之前已完成步骤的结果列表（供 {{$prev}} / {{$step_N}} 插值）
     */
    private executeStep;
    /**
     * 将 argsTemplate 中的占位符替换为实际值
     *
     * 支持三种占位符：
     * - {{paramName}}  — 替换为用户提供的参数值
     * - {{$prev}}      — 替换为上一步的 resultText
     * - {{$step_N}}    — 替换为第 N 步（从 0 开始）的 resultText
     *
     * 递归处理嵌套对象和数组中的字符串值
     */
    private interpolateArgs;
    /**
     * 递归插值单个值
     *
     * 占位符解析优先级：
     * 1. {{$prev}}    → previousResults 中最后一项的 resultText
     * 2. {{$step_N}}  → previousResults[N] 的 resultText（N 从 0 开始）
     * 3. {{paramName}} → params[paramName]（用户提供的参数值）
     */
    private interpolateValue;
    /**
     * 路由工具调用：browser_* 前缀 → BrowserToolProvider，其余 → McpClient
     */
    private callTool;
    /**
     * 格式化工具结果为可读文本
     */
    private formatToolResult;
    /**
     * 构建执行结果汇总文本
     */
    private buildSummary;
}
//# sourceMappingURL=skill-runner.d.ts.map