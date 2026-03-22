// skill-runner.ts — Skill 执行引擎
// 职责：按 Skill 定义的有序步骤列表逐步执行工具调用，
//       支持 {{param}} 变量插值、{{$prev}} 上一步结果引用、
//       {{$step_N}} 指定步骤结果引用、进度回调、取消中断、可选步骤跳过。
//       增强路径表达式：{{$prev.key}} 提取 JSON 字段，{{$prev.arr[].field}} 数组映射。
//       工具路由：browser_* → BrowserToolProvider，llm_* → LLM 工具（本地），其余 → McpClient。
//       evo_v28_002: 支持 SkillStep.repeat 智能重复组，根据页面尺寸动态迭代 + 滚动到底自动终止。
//       是 Skill 系统从「数据定义」到「实际执行」的桥梁。
import * as vscode from 'vscode';
import { Skill, SkillStep } from './skill-registry';
import { BrowserToolProvider } from './browser-tools';
import { McpClient, McpToolResult } from './mcp-client';
import { LmService } from './lm-service';
import { isLlmTool, callLlmTool } from './llm-tools';

// ────────────────────────────────────────────────────────────────
// 类型定义
// ────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────
// SkillRunner 类
// ────────────────────────────────────────────────────────────────

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
export class SkillRunner {
  private readonly browserToolProvider: BrowserToolProvider;
  private readonly mcpClient: McpClient;
  private readonly outputChannel: vscode.OutputChannel;
  private readonly lmService: LmService;

  constructor(
    browserToolProvider: BrowserToolProvider,
    mcpClient: McpClient,
    outputChannel: vscode.OutputChannel,
    lmService?: LmService,
  ) {
    this.browserToolProvider = browserToolProvider;
    this.mcpClient = mcpClient;
    this.outputChannel = outputChannel;
    this.lmService = lmService!;
  }

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
  async navigateToTargetUrl(
    targetUrl: string,
    targetTabId?: number,
  ): Promise<boolean> {
    if (!targetUrl) {
      return false;
    }

    this.outputChannel.appendLine(
      `[SkillRunner] 场景预导航: browser_navigate → ${targetUrl}`,
    );

    try {
      // Step 1: 导航到目标 URL
      const navResult = await this.callTool(
        'browser_navigate',
        { url: targetUrl },
        undefined,
        targetTabId,
      );

      if (navResult.isError) {
        const errText = this.formatToolResult(navResult);
        this.outputChannel.appendLine(
          `[SkillRunner] 场景预导航失败(browser_navigate): ${errText}`,
        );
        return false;
      }

      this.outputChannel.appendLine(
        '[SkillRunner] 场景预导航: browser_navigate 成功，等待页面加载...',
      );

      // Step 2: 等待页面 body 加载（最长 8 秒）
      const waitResult = await this.callTool(
        'browser_wait',
        { selector: 'body', timeout: 8000 },
        undefined,
        targetTabId,
      );

      if (waitResult.isError) {
        const errText = this.formatToolResult(waitResult);
        this.outputChannel.appendLine(
          `[SkillRunner] 场景预导航: browser_wait 超时/失败（降级继续）: ${errText}`,
        );
        // 等待超时不阻塞，仍然返回 true（导航已发出，页面可能在加载中）
        return true;
      }

      this.outputChannel.appendLine(
        `[SkillRunner] 场景预导航完成: 已到达 ${targetUrl}`,
      );
      return true;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.outputChannel.appendLine(
        `[SkillRunner] 场景预导航异常（降级继续）: ${errMsg}`,
      );
      return false;
    }
  }

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
  async execute(
    skill: Skill,
    params: Record<string, string>,
    onProgress?: (progress: SkillProgress) => void,
    token?: vscode.CancellationToken,
    targetTabId?: number,
  ): Promise<SkillRunResult> {
    this.outputChannel.appendLine(
      `[SkillRunner] 开始执行 Skill: ${skill.name}, 参数: ${JSON.stringify(params)}${targetTabId !== undefined ? `, targetTabId: ${targetTabId}` : ''}`,
    );

    // 1. 校验 Skill 是否启用
    if (!skill.enabled) {
      const msg = `Skill "${skill.displayName}" 已禁用，无法执行`;
      this.outputChannel.appendLine(`[SkillRunner] ${msg}`);
      return { success: false, stepResults: [], summary: msg };
    }

    // 2. 校验必填参数完整性
    const missingParams = skill.parameters.required.filter(
      (p) => params[p] === undefined || params[p] === '',
    );
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
    const stepResults: SkillStepResult[] = [];
    const definedSteps = skill.steps.length;
    let aborted = false;

    for (let i = 0; i < definedSteps; i++) {
      // 检查取消
      if (token?.isCancellationRequested) {
        this.outputChannel.appendLine('[SkillRunner] 收到取消信号，中断执行');
        return {
          success: false,
          stepResults,
          summary: `Skill 被取消（已完成 ${stepResults.length} 步）`,
        };
      }

      const step = skill.steps[i];

      // ── evo_v28_002: 智能重复组处理 ──
      if (step.repeat) {
        const repeatResult = await this.executeRepeatGroup(
          skill, i, resolvedParams, stepResults, onProgress, token, targetTabId,
        );
        if (repeatResult.aborted) {
          aborted = true;
          break;
        }
        // 跳过重复组中的后续步骤定义（for 循环会 +1）
        i += step.repeat.groupSize - 1;
        continue;
      }

      // ── 普通步骤执行（原有逻辑） ──
      const isOptional = step.optional === true;
      const currentIndex = stepResults.length;

      // 报告进度：running（含工具名称预告）
      onProgress?.({
        stepIndex: currentIndex,
        totalSteps: definedSteps,
        status: 'running',
        description: step.description,
        toolName: step.toolName,
      });

      // 执行步骤（传入已完成的 stepResults 供 {{$prev}} / {{$step_N}} 插值）
      const stepStartTime = Date.now();
      const stepResult = await this.executeStep(step, currentIndex, resolvedParams, stepResults, token, targetTabId);
      const stepDurationMs = Date.now() - stepStartTime;
      stepResults.push(stepResult);

      if (stepResult.success) {
        // 报告进度：success（含 debug 增强信息）
        onProgress?.({
          stepIndex: currentIndex,
          totalSteps: definedSteps,
          status: 'success',
          result: stepResult.resultText,
          description: step.description,
          toolName: stepResult.toolName,
          resolvedArgs: stepResult.resolvedArgs,
          durationMs: stepDurationMs,
        });

        this.outputChannel.appendLine(
          `[SkillRunner] 步骤 ${currentIndex + 1} 成功: ${step.description}`,
        );

        // ── evo_v23_004: 检测 injectBilingual injected=0 并输出诊断警告 ──
        this.detectInjectZeroDiagnostic(stepResult);
      } else {
        // ── 失败诊断增强：打印插值后实际 args + 上一步 resultText 摘要 ──
        this.logStepFailureDiagnostics(currentIndex, definedSteps, step, stepResult, stepResults);

        if (isOptional) {
          // 可选步骤失败 → 跳过（含 debug 增强信息）
          onProgress?.({
            stepIndex: currentIndex,
            totalSteps: definedSteps,
            status: 'skipped',
            result: stepResult.error,
            description: step.description,
            toolName: stepResult.toolName,
            resolvedArgs: stepResult.resolvedArgs,
            durationMs: stepDurationMs,
          });

          this.outputChannel.appendLine(
            `[SkillRunner] 步骤 ${currentIndex + 1} 失败（可选，跳过）: ${stepResult.error}`,
          );
        } else {
          // 必需步骤失败 → 终止（含 debug 增强信息）
          onProgress?.({
            stepIndex: currentIndex,
            totalSteps: definedSteps,
            status: 'failed',
            result: stepResult.error,
            description: step.description,
            toolName: stepResult.toolName,
            resolvedArgs: stepResult.resolvedArgs,
            durationMs: stepDurationMs,
          });

          this.outputChannel.appendLine(
            `[SkillRunner] 步骤 ${currentIndex + 1} 失败（终止）: ${stepResult.error}`,
          );

          return {
            success: false,
            stepResults,
            summary: this.buildSummary(skill, stepResults, false),
          };
        }
      }
    }

    // 全部步骤执行完毕
    const allDone = !aborted;
    const summary = this.buildSummary(skill, stepResults, allDone);
    this.outputChannel.appendLine(
      `[SkillRunner] Skill "${skill.name}" 执行完成: ${stepResults.length} 步${aborted ? '（含重复组中断）' : ''}`,
    );

    return { success: allDone, stepResults, summary };
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
   * @param token 取消令牌（传递给 llm_* 工具）
   * @param targetTabId Chrome 侧锁定的目标 Tab ID（透传给浏览器工具调用）
   */
  private async executeStep(
    step: SkillStep,
    stepIndex: number,
    params: Record<string, string>,
    previousResults: SkillStepResult[],
    token?: vscode.CancellationToken,
    targetTabId?: number,
  ): Promise<SkillStepResult> {
    const resolvedArgs = this.interpolateArgs(step.argsTemplate, params, previousResults);

    try {
      const result = await this.callTool(step.toolName, resolvedArgs, token, targetTabId);
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
    } catch (err) {
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
  private interpolateArgs(
    template: Record<string, unknown>,
    params: Record<string, string>,
    previousResults: SkillStepResult[] = [],
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(template)) {
      result[key] = this.interpolateValue(value, params, previousResults);
    }

    return result;
  }

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
  private interpolateValue(
    value: unknown,
    params: Record<string, string>,
    previousResults: SkillStepResult[] = [],
  ): unknown {
    if (typeof value === 'string') {
      // 匹配 {{$prev}}, {{$prev.path}}, {{$step_N}}, {{$step_N.path}}, {{paramName}}
      // 路径支持 dot 访问（.key）和数组映射（.arr[].field）
      return value.replace(
        /\{\{(\$prev(?:\.[\w]+(?:\[\])?)*|\$step_\d+(?:\.[\w]+(?:\[\])?)*|\w+)\}\}/g,
        (_match, placeholder: string) => {
          // ── $prev 系列 ──
          if (placeholder.startsWith('$prev')) {
            if (previousResults.length === 0) {
              this.outputChannel.appendLine(
                '[SkillRunner] 警告: {{$prev}} 无可用的上一步结果（当前是第一步）',
              );
              return '';
            }
            const resultText = previousResults[previousResults.length - 1].resultText;
            const pathPart = placeholder.substring('$prev'.length); // '' 或 '.key.sub'
            if (!pathPart) {
              return resultText; // {{$prev}} — 向后兼容
            }
            return this.resolvePath(resultText, pathPart.substring(1), placeholder);
          }

          // ── $step_N 系列 ──
          const stepMatch = placeholder.match(/^\$step_(\d+)(\..*)?$/);
          if (stepMatch) {
            const stepIdx = parseInt(stepMatch[1], 10);
            if (stepIdx >= previousResults.length) {
              this.outputChannel.appendLine(
                `[SkillRunner] 警告: {{${placeholder}}} 引用的步骤尚未执行（已完成 ${previousResults.length} 步）`,
              );
              return '';
            }
            const resultText = previousResults[stepIdx].resultText;
            const pathPart = stepMatch[2]; // undefined 或 '.key.sub'
            if (!pathPart) {
              return resultText; // {{$step_N}} — 向后兼容
            }
            return this.resolvePath(resultText, pathPart.substring(1), placeholder);
          }

          // ── {{paramName}} → 用户参数 ──
          return params[placeholder] ?? '';
        },
      );
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.interpolateValue(item, params, previousResults));
    }

    if (value !== null && typeof value === 'object') {
      return this.interpolateArgs(
        value as Record<string, unknown>,
        params,
        previousResults,
      );
    }

    // 数字、布尔等原始类型直接返回
    return value;
  }

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
  private resolvePath(jsonText: string, path: string, fullPlaceholder: string): string {
    // 1. 尝试将 resultText 解析为 JSON
    let obj: unknown;
    try {
      obj = JSON.parse(jsonText);
    } catch {
      this.outputChannel.appendLine(
        `[SkillRunner] 警告: {{${fullPlaceholder}}} 路径表达式需要 JSON，但上一步结果不是有效 JSON，回退返回原始文本`,
      );
      return jsonText;
    }

    // 2. 按 '.' 拆分路径段，逐段解析
    const segments = path.split('.');
    let current: unknown = obj;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];

      if (current === null || current === undefined) {
        this.outputChannel.appendLine(
          `[SkillRunner] 警告: {{${fullPlaceholder}}} 路径解析在 "${seg}" 处遇到 null/undefined`,
        );
        return '';
      }

      // 处理数组映射语法：segName[]
      if (seg.endsWith('[]')) {
        const arrayKey = seg.slice(0, -2);
        const arr = (current as Record<string, unknown>)[arrayKey];
        if (!Array.isArray(arr)) {
          this.outputChannel.appendLine(
            `[SkillRunner] 警告: {{${fullPlaceholder}}} 路径 "${arrayKey}" 不是数组`,
          );
          return '';
        }
        // 剩余路径段用于映射数组中每个元素
        const remainingPath = segments.slice(i + 1).join('.');
        if (!remainingPath) {
          // 没有后续路径，直接返回整个数组
          current = arr;
        } else {
          // 从每个数组元素中提取 remainingPath 指定的字段
          current = arr.map((item) => this.extractNestedField(item, remainingPath));
        }
        // 数组映射消耗了所有剩余段，直接跳出
        break;
      }

      // 普通属性访问
      if (typeof current === 'object' && current !== null) {
        current = (current as Record<string, unknown>)[seg];
      } else {
        this.outputChannel.appendLine(
          `[SkillRunner] 警告: {{${fullPlaceholder}}} 路径 "${seg}" 无法从非对象值中提取`,
        );
        return '';
      }
    }

    // 3. 将结果转为字符串
    if (current === undefined || current === null) {
      return '';
    }
    if (typeof current === 'string') {
      return current;
    }
    return JSON.stringify(current);
  }

  /**
   * 从嵌套对象中按点分隔路径提取字段（用于数组映射内部）
   *
   * @param obj 单个数组元素
   * @param path 点分隔路径，如 "text" 或 "meta.title"
   */
  private extractNestedField(obj: unknown, path: string): unknown {
    let current = obj;
    for (const seg of path.split('.')) {
      if (current === null || current === undefined) {
        return undefined;
      }
      if (typeof current === 'object') {
        current = (current as Record<string, unknown>)[seg];
      } else {
        return undefined;
      }
    }
    return current;
  }

  /**
   * 路由工具调用：
   * - browser_* 前缀 → BrowserToolProvider（浏览器操作），附带 targetTabId 锁定目标 tab
   * - llm_* 前缀     → LLM 工具（本地 vscode.lm API）
   * - 其余           → McpClient
   */
  private async callTool(
    toolName: string,
    args: Record<string, unknown>,
    token?: vscode.CancellationToken,
    targetTabId?: number,
  ): Promise<McpToolResult> {
    // 1. llm_* 前缀 → LLM 工具（本地，通过 LmService 调用语言模型）
    if (isLlmTool(toolName)) {
      this.outputChannel.appendLine(
        `[SkillRunner] 调用工具: ${toolName} (via LlmTools), 参数: ${JSON.stringify(args)}`,
      );
      if (!this.lmService) {
        return {
          content: [{ type: 'text', text: `LLM 工具 ${toolName} 不可用: LmService 未初始化` }],
          isError: true,
        };
      }
      return callLlmTool(toolName, args, this.lmService, this.outputChannel, token);
    }

    // 2. browser_* 前缀 → BrowserToolProvider
    const useBrowserChannel =
      toolName.startsWith('browser_') &&
      this.browserToolProvider.connected;

    const source = useBrowserChannel ? 'BrowserToolProvider' : 'McpClient';
    this.outputChannel.appendLine(
      `[SkillRunner] 调用工具: ${toolName} (via ${source}), 参数: ${JSON.stringify(args)}`,
    );

    if (useBrowserChannel) {
      return this.browserToolProvider.callTool(toolName, args, targetTabId);
    }

    // 3. 其余 → McpClient
    return this.mcpClient.callTool(toolName, args);
  }

  // ────────────────────────────────────────────────────────────────
  // evo_v28_002: 智能重复组执行
  // ────────────────────────────────────────────────────────────────

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
  private async executeRepeatGroup(
    skill: Skill,
    startIndex: number,
    params: Record<string, string>,
    existingResults: SkillStepResult[],
    onProgress?: (progress: SkillProgress) => void,
    token?: vscode.CancellationToken,
    targetTabId?: number,
  ): Promise<{ aborted: boolean } & { [Symbol.iterator]?: never }> {
    const step = skill.steps[startIndex];
    const repeat = step.repeat!;
    const groupSteps = skill.steps.slice(startIndex, startIndex + repeat.groupSize);

    // 1. 动态计算最大迭代次数
    let maxIter = repeat.maxIterations;
    if (repeat.maxIterationsExpr) {
      const resolved = this.interpolateValue(
        repeat.maxIterationsExpr, params, existingResults,
      );
      const parsed = parseInt(String(resolved), 10);
      if (!isNaN(parsed) && parsed > 0) {
        // 首屏已在重复组前截取，所以总屏数减 1
        maxIter = Math.min(Math.max(parsed - 1, 0), repeat.maxIterations);
      }
    }

    this.outputChannel.appendLine(
      `[SkillRunner] 进入重复组: ${repeat.groupSize} 步 × 最多 ${maxIter} 次迭代`,
    );

    // 2. 循环执行
    for (let iter = 0; iter < maxIter; iter++) {
      if (token?.isCancellationRequested) {
        this.outputChannel.appendLine('[SkillRunner] 重复组: 收到取消信号');
        break;
      }

      // 2a. 智能终止检查：调用 browser_get_page_info 判断是否已到页面底部
      if (repeat.terminateCheck) {
        const shouldStop = await this.checkTerminateCondition(
          repeat.terminateCheck, params, existingResults, token, targetTabId,
        );
        if (shouldStop) {
          this.outputChannel.appendLine(
            `[SkillRunner] 智能滚动终止: 已到达页面底部（第 ${iter + 1}/${maxIter} 次迭代前检测）`,
          );
          break;
        }
      }

      // 2b. 执行组内每个步骤
      for (let g = 0; g < groupSteps.length; g++) {
        if (token?.isCancellationRequested) { break; }

        const groupStep = groupSteps[g];
        const currentIndex = existingResults.length;

        // 报告进度
        onProgress?.({
          stepIndex: currentIndex,
          totalSteps: existingResults.length + (maxIter - iter) * repeat.groupSize,
          status: 'running',
          description: `${groupStep.description} (${iter + 1}/${maxIter})`,
          toolName: groupStep.toolName,
        });

        const stepStartTime = Date.now();
        const stepResult = await this.executeStep(
          groupStep, currentIndex, params, existingResults, token, targetTabId,
        );
        const stepDurationMs = Date.now() - stepStartTime;
        existingResults.push(stepResult);

        if (stepResult.success) {
          onProgress?.({
            stepIndex: currentIndex,
            totalSteps: existingResults.length + (maxIter - iter - 1) * repeat.groupSize,
            status: 'success',
            result: stepResult.resultText,
            description: `${groupStep.description} (${iter + 1}/${maxIter})`,
            toolName: stepResult.toolName,
            resolvedArgs: stepResult.resolvedArgs,
            durationMs: stepDurationMs,
          });

          this.outputChannel.appendLine(
            `[SkillRunner] 重复组 步骤 ${g + 1}/${repeat.groupSize} 迭代 ${iter + 1}/${maxIter} 成功: ${groupStep.description}`,
          );
        } else if (groupStep.optional) {
          onProgress?.({
            stepIndex: currentIndex,
            totalSteps: existingResults.length + (maxIter - iter - 1) * repeat.groupSize,
            status: 'skipped',
            result: stepResult.error,
            description: groupStep.description,
            toolName: stepResult.toolName,
            resolvedArgs: stepResult.resolvedArgs,
            durationMs: stepDurationMs,
          });

          this.outputChannel.appendLine(
            `[SkillRunner] 重复组 步骤失败（可选，跳过）: ${stepResult.error}`,
          );
        } else {
          // 必需步骤失败 → 终止整个重复组
          onProgress?.({
            stepIndex: currentIndex,
            totalSteps: existingResults.length,
            status: 'failed',
            result: stepResult.error,
            description: groupStep.description,
            toolName: stepResult.toolName,
            resolvedArgs: stepResult.resolvedArgs,
            durationMs: stepDurationMs,
          });

          this.outputChannel.appendLine(
            `[SkillRunner] 重复组 步骤失败（终止）: ${stepResult.error}`,
          );
          return { aborted: true };
        }
      }
    }

    this.outputChannel.appendLine(
      `[SkillRunner] 重复组执行完毕`,
    );
    return { aborted: false };
  }

  /**
   * 智能终止条件检查 — 调用指定工具并根据返回值判断是否应停止重复
   *
   * 当 condition 为 'atBottom' 时，检查 scrollTop + clientHeight >= scrollHeight - 50，
   * 即滚动位置已到达（或接近）页面底部时返回 true。
   */
  private async checkTerminateCondition(
    check: { toolName: string; argsTemplate: Record<string, unknown>; condition: 'atBottom' },
    params: Record<string, string>,
    allResults: SkillStepResult[],
    token?: vscode.CancellationToken,
    targetTabId?: number,
  ): Promise<boolean> {
    try {
      const args = this.interpolateArgs(check.argsTemplate, params, allResults);
      const result = await this.callTool(check.toolName, args, token, targetTabId);
      if (result.isError) { return false; }

      const text = this.formatToolResult(result);
      const info = JSON.parse(text);

      if (check.condition === 'atBottom') {
        const scrollTop = Number(info.scrollTop ?? 0);
        const clientHeight = Number(info.clientHeight ?? 0);
        const scrollHeight = Number(info.scrollHeight ?? Infinity);
        const atBottom = scrollTop + clientHeight >= scrollHeight - 50;

        this.outputChannel.appendLine(
          `[SkillRunner] 终止检查: scrollTop=${scrollTop}, clientHeight=${clientHeight}, scrollHeight=${scrollHeight}, atBottom=${atBottom}`,
        );
        return atBottom;
      }

      return false;
    } catch {
      // 检查失败时不终止，继续迭代
      return false;
    }
  }

  /**
   * 格式化工具结果为可读文本
   */
  private formatToolResult(result: McpToolResult): string {
    if (!result.content || result.content.length === 0) {
      return '(工具未返回内容)';
    }

    return result.content
      .map((item) => {
        const typedItem = item as { type?: string; text?: string };
        if (typedItem.type === 'text' && typedItem.text) {
          return typedItem.text;
        }
        return JSON.stringify(item);
      })
      .join('\n');
  }

  /**
   * evo_v23_004: 检测 injectBilingual 步骤返回 injected=0 的诊断信息并输出警告
   *
   * 当步骤结果中包含 injected: 0 且带有 diagnostic 字段时，
   * 在 outputChannel 输出结构化的可能原因和建议操作。
   */
  private detectInjectZeroDiagnostic(stepResult: SkillStepResult): void {
    if (!stepResult.resultText) { return; }

    try {
      const parsed = JSON.parse(stepResult.resultText);
      // 检测 injected === 0（直接或嵌套在 data 中）
      const data = parsed?.data ?? parsed;
      if (typeof data !== 'object' || data === null) { return; }
      if (data.injected !== 0) { return; }

      const label = '[SkillRunner] ⚠️ injectBilingual 诊断';
      this.outputChannel.appendLine(
        `${label}: injected=0, skipped=${data.skipped ?? '?'}, total=${data.total ?? '?'}`,
      );

      if (data.diagnostic) {
        const diag = data.diagnostic as { possibleCauses?: string[]; suggestedActions?: string[] };
        if (diag.possibleCauses?.length) {
          this.outputChannel.appendLine(`${label} 可能原因:`);
          for (const cause of diag.possibleCauses) {
            this.outputChannel.appendLine(`${label}   - ${cause}`);
          }
        }
        if (diag.suggestedActions?.length) {
          this.outputChannel.appendLine(`${label} 建议操作:`);
          for (const action of diag.suggestedActions) {
            this.outputChannel.appendLine(`${label}   - ${action}`);
          }
        }
      }
    } catch {
      // resultText 不是 JSON，忽略
    }
  }

  /**
   * 步骤失败诊断：输出插值后的实际参数和上一步 resultText 摘要，辅助排查问题
   *
   * @param stepIndex 当前步骤序号
   * @param totalSteps 总步骤数
   * @param step 当前步骤定义
   * @param stepResult 当前步骤执行结果
   * @param previousResults 之前已完成步骤的结果列表
   */
  private logStepFailureDiagnostics(
    stepIndex: number,
    totalSteps: number,
    step: SkillStep,
    stepResult: SkillStepResult,
    previousResults: SkillStepResult[],
  ): void {
    const label = `[SkillRunner] 🔍 步骤 ${stepIndex + 1}/${totalSteps} 失败诊断`;

    this.outputChannel.appendLine(`${label} ── 工具: ${step.toolName}`);

    // 1. 打印插值后的实际参数（toolArgs），截断前 300 字符
    const interpolatedArgs = JSON.stringify(stepResult.resolvedArgs);
    const truncatedArgs =
      interpolatedArgs.length > 300
        ? interpolatedArgs.substring(0, 300) + '…(truncated)'
        : interpolatedArgs;
    this.outputChannel.appendLine(`${label} ── 实际参数(interpolated args): ${truncatedArgs}`);

    // 2. 打印上一步 resultText 摘要（如果有）
    if (previousResults.length > 0) {
      const prevResult = previousResults[previousResults.length - 1];
      const prevSummary = prevResult.resultText
        ? prevResult.resultText.length > 300
          ? prevResult.resultText.substring(0, 300) + '…(truncated)'
          : prevResult.resultText
        : '(空)';
      this.outputChannel.appendLine(
        `${label} ── 上一步(${prevResult.toolName}) resultText 摘要: ${prevSummary}`,
      );
    } else {
      this.outputChannel.appendLine(`${label} ── 无上一步结果（当前是第一步）`);
    }

    // 3. 打印错误信息
    if (stepResult.error) {
      this.outputChannel.appendLine(`${label} ── 错误: ${stepResult.error}`);
    }
  }

  /**
   * 构建执行结果汇总文本
   */
  private buildSummary(
    skill: Skill,
    stepResults: SkillStepResult[],
    allDone: boolean,
  ): string {
    const parts: string[] = [];
    parts.push(`Skill: ${skill.displayName} (${skill.name})`);
    parts.push(`状态: ${allDone ? '全部完成' : '提前终止'}`);
    parts.push('');

    for (const sr of stepResults) {
      const statusIcon = sr.success ? '✅' : sr.optional ? '⏭' : '❌';
      parts.push(`${statusIcon} 步骤 ${sr.stepIndex + 1}: ${sr.description}`);
      if (sr.success && sr.resultText) {
        // 截断过长的结果
        const truncated =
          sr.resultText.length > 200
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
