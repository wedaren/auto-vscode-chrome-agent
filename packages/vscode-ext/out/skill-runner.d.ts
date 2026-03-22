import * as vscode from 'vscode';
import { Skill } from './skill-registry';
import { BrowserToolProvider } from './browser-tools';
import { McpClient } from './mcp-client';
import { LmService } from './lm-service';
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
    /** 调用的工具名称（完成后填充） */
    toolName?: string;
    /** 插值后的实际参数（完成后填充） */
    resolvedArgs?: Record<string, unknown>;
    /** 步骤执行耗时（毫秒，完成后填充） */
    durationMs?: number;
}
/**
 * SkillRunner — Skill 执行引擎
 *
 * 按 Skill.steps 列表顺序执行每个工具调用：
 * 1. 校验 skill.enabled 和参数完整性
 * 2. 逐步遍历 steps，将 argsTemplate 中的占位符替换为实际值：
 *    - {{param}}           → 用户参数值
 *    - {{$prev}}           → 上一步的 resultText（完整文本）
 *    - {{$prev.key}}       → 上一步结果 JSON 中的 key 字段
 *    - {{$prev.arr[].f}}   → 上一步结果数组映射，提取每项的 f 字段
 *    - {{$step_N}}         → 第 N 步的 resultText（完整文本）
 *    - {{$step_N.key}}     → 第 N 步结果 JSON 中的 key 字段
 * 3. 根据 toolName 前缀路由到 BrowserToolProvider（browser_*）或 McpClient
 * 4. 通过 onProgress 回调报告每步进度
 * 5. 支持 CancellationToken 中断
 * 6. 步骤失败时根据 optional 标记决定跳过或终止
 */
export declare class SkillRunner {
    private readonly browserToolProvider;
    private readonly mcpClient;
    private readonly outputChannel;
    private readonly lmService;
    constructor(browserToolProvider: BrowserToolProvider, mcpClient: McpClient, outputChannel: vscode.OutputChannel, lmService?: LmService);
    /**
     * 预设场景自动导航：在执行 Skill 步骤前先导航到目标 URL
     *
     * 流程：
     * 1. 调用 browser_navigate 导航到 targetUrl
     * 2. 调用 browser_wait 等待页面 body 加载完成（最长 8 秒）
     * 3. 导航失败时返回 false，调用方降级为直接执行 Skill 步骤
     *
     * @param targetUrl 目标页面 URL
     * @param targetTabId Chrome 侧锁定的目标 Tab ID（可选）
     * @returns true=导航成功，false=导航失败（调用方应降级继续执行）
     */
    navigateToTargetUrl(targetUrl: string, targetTabId?: number): Promise<boolean>;
    /**
     * 执行指定 Skill
     *
     * @param skill 要执行的 Skill 定义
     * @param params 用户提供的参数值（key → value）
     * @param onProgress 每步进度回调（可选）
     * @param token 取消令牌（可选）
     * @param targetTabId Chrome 侧锁定的目标 Tab ID（可选），Skill 多步骤执行期间确保所有工具调用都路由到此 tab
     * @returns SkillRunResult 执行结果
     */
    execute(skill: Skill, params: Record<string, string>, onProgress?: (progress: SkillProgress) => void, token?: vscode.CancellationToken, targetTabId?: number): Promise<SkillRunResult>;
    /**
     * 执行单个 SkillStep
     *
     * @param step 当前步骤定义
     * @param stepIndex 当前步骤序号
     * @param params 用户参数
     * @param previousResults 之前已完成步骤的结果列表（供 {{$prev}} / {{$step_N}} 插值）
     * @param token 取消令牌（传递给 llm_* 工具）
     * @param targetTabId Chrome 侧锁定的目标 Tab ID（透传给浏览器工具调用）
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
     * 1. {{$prev}}          → previousResults 中最后一项的 resultText（完整文本）
     * 2. {{$prev.key}}      → 上一步结果 JSON 中的 key 字段
     * 3. {{$prev.arr[].f}}  → 上一步结果 JSON 中 arr 数组每项的 f 字段，组成新数组
     * 4. {{$step_N}}        → previousResults[N] 的 resultText（完整文本）
     * 5. {{$step_N.key}}    → 第 N 步结果 JSON 中的 key 字段
     * 6. {{paramName}}      → params[paramName]（用户提供的参数值）
     */
    private interpolateValue;
    /**
     * 从结构化 JSON 文本中按路径表达式提取字段值
     *
     * 路径语法：
     * - "key"              → obj.key
     * - "key.subKey"       → obj.key.subKey
     * - "arr[].field"      → obj.arr.map(e => e.field)，结果 JSON.stringify
     * - "a.b[].c"          → obj.a.b.map(e => e.c)
     *
     * 返回值始终是字符串：
     * - 原始值（string/number/boolean）→ String(value)
     * - 对象/数组 → JSON.stringify(value)
     *
     * @param jsonText 工具返回的 resultText（可能是 JSON 字符串）
     * @param path 点分隔的路径（不含前导 '.'），如 "paragraphs" 或 "data[].text"
     * @param fullPlaceholder 完整占位符名（仅用于日志）
     */
    private resolvePath;
    /**
     * 从嵌套对象中按点分隔路径提取字段（用于数组映射内部）
     *
     * @param obj 单个数组元素
     * @param path 点分隔路径，如 "text" 或 "meta.title"
     */
    private extractNestedField;
    /**
     * 路由工具调用：
     * - browser_* 前缀 → BrowserToolProvider（浏览器操作），附带 targetTabId 锁定目标 tab
     * - llm_* 前缀     → LLM 工具（本地 vscode.lm API）
     * - 其余           → McpClient
     */
    private callTool;
    /**
     * 执行重复组 — 将指定步骤组循环执行，根据页面尺寸动态计算迭代次数，
     * 配合 terminateCheck 实现滚动到底自动终止。
     *
     * @param skill 当前 Skill 定义
     * @param startIndex 重复组在 skill.steps 中的起始下标
     * @param params 用户参数
     * @param existingResults 重复组之前已完成的步骤结果
     * @param onProgress 进度回调
     * @param token 取消令牌
     * @param targetTabId 目标 Tab ID
     * @returns { aborted: boolean } 当重复组中有必需步骤失败时 aborted=true
     */
    private executeRepeatGroup;
    /**
     * 智能终止条件检查 — 调用指定工具并根据返回值判断是否应停止重复
     *
     * 当 condition 为 'atBottom' 时，检查 scrollTop + clientHeight >= scrollHeight - 50，
     * 即滚动位置已到达（或接近）页面底部时返回 true。
     */
    private checkTerminateCondition;
    /**
     * 格式化工具结果为可读文本
     */
    private formatToolResult;
    /**
     * evo_v23_004: 检测 injectBilingual 步骤返回 injected=0 的诊断信息并输出警告
     *
     * 当步骤结果中包含 injected: 0 且带有 diagnostic 字段时，
     * 在 outputChannel 输出结构化的可能原因和建议操作。
     */
    private detectInjectZeroDiagnostic;
    /**
     * 步骤失败诊断：输出插值后的实际参数和上一步 resultText 摘要，辅助排查问题
     *
     * @param stepIndex 当前步骤序号
     * @param totalSteps 总步骤数
     * @param step 当前步骤定义
     * @param stepResult 当前步骤执行结果
     * @param previousResults 之前已完成步骤的结果列表
     */
    private logStepFailureDiagnostics;
    /**
     * 构建执行结果汇总文本
     */
    private buildSummary;
}
//# sourceMappingURL=skill-runner.d.ts.map