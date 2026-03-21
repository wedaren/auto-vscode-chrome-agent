"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRunner = void 0;
// ────────────────────────────────────────────────────────────────
// SkillRunner 类
// ────────────────────────────────────────────────────────────────
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
class SkillRunner {
    browserToolProvider;
    mcpClient;
    outputChannel;
    constructor(browserToolProvider, mcpClient, outputChannel) {
        this.browserToolProvider = browserToolProvider;
        this.mcpClient = mcpClient;
        this.outputChannel = outputChannel;
    }
    /**
     * 执行指定 Skill
     *
     * @param skill 要执行的 Skill 定义
     * @param params 用户提供的参数值（key → value）
     * @param onProgress 每步进度回调（可选）
     * @param token 取消令牌（可选）
     * @returns SkillRunResult 执行结果
     */
    async execute(skill, params, onProgress, token) {
        this.outputChannel.appendLine(`[SkillRunner] 开始执行 Skill: ${skill.name}, 参数: ${JSON.stringify(params)}`);
        // 1. 校验 Skill 是否启用
        if (!skill.enabled) {
            const msg = `Skill "${skill.displayName}" 已禁用，无法执行`;
            this.outputChannel.appendLine(`[SkillRunner] ${msg}`);
            return { success: false, stepResults: [], summary: msg };
        }
        // 2. 校验必填参数完整性
        const missingParams = skill.parameters.required.filter((p) => params[p] === undefined || params[p] === '');
        if (missingParams.length > 0) {
            const msg = `缺少必填参数: ${missingParams.join(', ')}`;
            this.outputChannel.appendLine(`[SkillRunner] ${msg}`);
            return { success: false, stepResults: [], summary: msg };
        }
        // 3. 应用参数默认值
        const resolvedParams = { ...params };
        for (const [key, def] of Object.entries(skill.parameters.properties)) {
            if (resolvedParams[key] === undefined && def.default !== undefined) {
                resolvedParams[key] = String(def.default);
            }
        }
        // 4. 逐步执行
        const stepResults = [];
        const totalSteps = skill.steps.length;
        for (let i = 0; i < totalSteps; i++) {
            // 检查取消
            if (token?.isCancellationRequested) {
                this.outputChannel.appendLine('[SkillRunner] 收到取消信号，中断执行');
                return {
                    success: false,
                    stepResults,
                    summary: `Skill 被取消（已完成 ${i}/${totalSteps} 步）`,
                };
            }
            const step = skill.steps[i];
            const isOptional = step.optional === true;
            // 报告进度：running
            onProgress?.({
                stepIndex: i,
                totalSteps,
                status: 'running',
                description: step.description,
            });
            // 执行步骤（传入已完成的 stepResults 供 {{$prev}} / {{$step_N}} 插值）
            const stepResult = await this.executeStep(step, i, resolvedParams, stepResults);
            stepResults.push(stepResult);
            if (stepResult.success) {
                // 报告进度：success
                onProgress?.({
                    stepIndex: i,
                    totalSteps,
                    status: 'success',
                    result: stepResult.resultText,
                    description: step.description,
                });
                this.outputChannel.appendLine(`[SkillRunner] 步骤 ${i + 1}/${totalSteps} 成功: ${step.description}`);
            }
            else {
                if (isOptional) {
                    // 可选步骤失败 → 跳过
                    onProgress?.({
                        stepIndex: i,
                        totalSteps,
                        status: 'skipped',
                        result: stepResult.error,
                        description: step.description,
                    });
                    this.outputChannel.appendLine(`[SkillRunner] 步骤 ${i + 1}/${totalSteps} 失败（可选，跳过）: ${stepResult.error}`);
                }
                else {
                    // 必需步骤失败 → 终止
                    onProgress?.({
                        stepIndex: i,
                        totalSteps,
                        status: 'failed',
                        result: stepResult.error,
                        description: step.description,
                    });
                    this.outputChannel.appendLine(`[SkillRunner] 步骤 ${i + 1}/${totalSteps} 失败（终止）: ${stepResult.error}`);
                    return {
                        success: false,
                        stepResults,
                        summary: this.buildSummary(skill, stepResults, false),
                    };
                }
            }
        }
        // 全部步骤执行完毕
        const summary = this.buildSummary(skill, stepResults, true);
        this.outputChannel.appendLine(`[SkillRunner] Skill "${skill.name}" 执行完成: ${totalSteps} 步`);
        return { success: true, stepResults, summary };
    }
    // ────────────────────────────────────────────────────────────────
    // 私有方法
    // ────────────────────────────────────────────────────────────────
    /**
     * 执行单个 SkillStep
     *
     * @param step 当前步骤定义
     * @param stepIndex 当前步骤序号
     * @param params 用户参数
     * @param previousResults 之前已完成步骤的结果列表（供 {{$prev}} / {{$step_N}} 插值）
     */
    async executeStep(step, stepIndex, params, previousResults) {
        const resolvedArgs = this.interpolateArgs(step.argsTemplate, params, previousResults);
        try {
            const result = await this.callTool(step.toolName, resolvedArgs);
            const resultText = this.formatToolResult(result);
            return {
                stepIndex,
                description: step.description,
                toolName: step.toolName,
                resolvedArgs,
                resultText,
                success: !result.isError,
                optional: step.optional === true,
                error: result.isError ? resultText : undefined,
            };
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            return {
                stepIndex,
                description: step.description,
                toolName: step.toolName,
                resolvedArgs,
                resultText: '',
                success: false,
                optional: step.optional === true,
                error: errorMsg,
            };
        }
    }
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
    interpolateArgs(template, params, previousResults = []) {
        const result = {};
        for (const [key, value] of Object.entries(template)) {
            result[key] = this.interpolateValue(value, params, previousResults);
        }
        return result;
    }
    /**
     * 递归插值单个值
     *
     * 占位符解析优先级：
     * 1. {{$prev}}    → previousResults 中最后一项的 resultText
     * 2. {{$step_N}}  → previousResults[N] 的 resultText（N 从 0 开始）
     * 3. {{paramName}} → params[paramName]（用户提供的参数值）
     */
    interpolateValue(value, params, previousResults = []) {
        if (typeof value === 'string') {
            // 匹配 {{$prev}}、{{$step_N}}、{{paramName}} 三种占位符
            return value.replace(/\{\{(\$prev|\$step_\d+|\w+)\}\}/g, (_match, placeholder) => {
                // {{$prev}} → 上一步结果文本
                if (placeholder === '$prev') {
                    if (previousResults.length === 0) {
                        this.outputChannel.appendLine('[SkillRunner] 警告: {{$prev}} 无可用的上一步结果（当前是第一步）');
                        return '';
                    }
                    return previousResults[previousResults.length - 1].resultText;
                }
                // {{$step_N}} → 第 N 步结果文本
                const stepMatch = placeholder.match(/^\$step_(\d+)$/);
                if (stepMatch) {
                    const stepIdx = parseInt(stepMatch[1], 10);
                    if (stepIdx >= previousResults.length) {
                        this.outputChannel.appendLine(`[SkillRunner] 警告: {{$step_${stepIdx}}} 引用的步骤尚未执行（已完成 ${previousResults.length} 步）`);
                        return '';
                    }
                    return previousResults[stepIdx].resultText;
                }
                // {{paramName}} → 用户参数
                return params[placeholder] ?? '';
            });
        }
        if (Array.isArray(value)) {
            return value.map((item) => this.interpolateValue(item, params, previousResults));
        }
        if (value !== null && typeof value === 'object') {
            return this.interpolateArgs(value, params, previousResults);
        }
        // 数字、布尔等原始类型直接返回
        return value;
    }
    /**
     * 路由工具调用：browser_* 前缀 → BrowserToolProvider，其余 → McpClient
     */
    async callTool(toolName, args) {
        const useBrowserChannel = toolName.startsWith('browser_') &&
            this.browserToolProvider.connected;
        const source = useBrowserChannel ? 'BrowserToolProvider' : 'McpClient';
        this.outputChannel.appendLine(`[SkillRunner] 调用工具: ${toolName} (via ${source}), 参数: ${JSON.stringify(args)}`);
        if (useBrowserChannel) {
            return this.browserToolProvider.callTool(toolName, args);
        }
        return this.mcpClient.callTool(toolName, args);
    }
    /**
     * 格式化工具结果为可读文本
     */
    formatToolResult(result) {
        if (!result.content || result.content.length === 0) {
            return '(工具未返回内容)';
        }
        return result.content
            .map((item) => {
            const typedItem = item;
            if (typedItem.type === 'text' && typedItem.text) {
                return typedItem.text;
            }
            return JSON.stringify(item);
        })
            .join('\n');
    }
    /**
     * 构建执行结果汇总文本
     */
    buildSummary(skill, stepResults, allDone) {
        const parts = [];
        parts.push(`Skill: ${skill.displayName} (${skill.name})`);
        parts.push(`状态: ${allDone ? '全部完成' : '提前终止'}`);
        parts.push('');
        for (const sr of stepResults) {
            const statusIcon = sr.success ? '✅' : sr.optional ? '⏭' : '❌';
            parts.push(`${statusIcon} 步骤 ${sr.stepIndex + 1}: ${sr.description}`);
            if (sr.success && sr.resultText) {
                // 截断过长的结果
                const truncated = sr.resultText.length > 200
                    ? sr.resultText.substring(0, 200) + '...'
                    : sr.resultText;
                parts.push(`   结果: ${truncated}`);
            }
            if (!sr.success && sr.error) {
                parts.push(`   错误: ${sr.error}`);
            }
        }
        return parts.join('\n');
    }
}
exports.SkillRunner = SkillRunner;
//# sourceMappingURL=skill-runner.js.map