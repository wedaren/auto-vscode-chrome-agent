// agent-loop.ts — ReAct 风格的 Agent 循环，实现 think→act→observe 闭环
// 职责：接收用户指令，通过 LLM 推理和多工具源（MCP + BrowserTools + Skill）执行的迭代循环，产出最终答案
// 支持：MCP 工具（chrome-devtools-mcp）、原生浏览器工具（browser_* 前缀）、run_skill 工具（Skill 执行引擎）
// 参考：ReportGenerator 的 MCP/LM 调用模式，但更通用——适用于任意对话场景
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpClient, McpToolResult } from './mcp-client';
import { BrowserToolProvider } from './browser-tools';
import { SkillRegistry } from './skill-registry';
import { SkillRunner } from './skill-runner';
import {
  smartTruncate,
  estimateTokens,
  MAX_OBSERVATION_CHARS,
  MAX_MESSAGES_CHARS,
} from './context-budget';

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

/** LLM 输出解析结果（内部类型） */
interface ParsedLlmOutput {
  type: 'ACTION' | 'FINAL_ANSWER' | 'UNKNOWN';
  thought?: string;
  answer: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
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
export class AgentLoop {
  private readonly lmService: LmService;
  private readonly mcpClient: McpClient;
  private readonly browserToolProvider?: BrowserToolProvider;
  private readonly skillRegistry?: SkillRegistry;
  private readonly skillRunner?: SkillRunner;
  private readonly outputChannel: vscode.OutputChannel;

  /** 默认最大步数（LLM 调用轮数） */
  static readonly MAX_STEPS = 15;

  /** 默认总超时（5 分钟 = 300000ms），防止 Agent 无限挂起 */
  static readonly TOTAL_TIMEOUT_MS = 5 * 60 * 1000;

  constructor(
    lmService: LmService,
    mcpClient: McpClient,
    outputChannel: vscode.OutputChannel,
    browserToolProvider?: BrowserToolProvider,
    skillRegistry?: SkillRegistry,
    skillRunner?: SkillRunner,
  ) {
    this.lmService = lmService;
    this.mcpClient = mcpClient;
    this.outputChannel = outputChannel;
    this.browserToolProvider = browserToolProvider;
    this.skillRegistry = skillRegistry;
    this.skillRunner = skillRunner;
  }

  /**
   * 执行 ReAct Agent 循环
   * @param userMessage 用户输入的指令/问题
   * @param options 配置项（maxSteps, systemPrompt, onStep 回调）
   * @param token 取消令牌，用于随时中断循环
   * @returns 最终答案 + 完整步骤记录
   */
  async run(
    userMessage: string,
    options: AgentLoopOptions = {},
    token?: vscode.CancellationToken,
  ): Promise<AgentLoopResult> {
    const maxSteps = options.maxSteps ?? AgentLoop.MAX_STEPS;
    const totalTimeout = options.totalTimeout ?? AgentLoop.TOTAL_TIMEOUT_MS;
    const onStep = options.onStep;
    const steps: AgentStep[] = [];
    let roundCount = 0;
    let timedOut = false;

    this.outputChannel.appendLine(
      `[AgentLoop] 开始执行，maxSteps=${maxSteps}, totalTimeout=${totalTimeout}ms, 用户消息: ${userMessage.substring(0, 100)}`,
    );

    // ── 总超时保护：超时后通过 CancellationTokenSource 中断循环 ──
    const timeoutCts = new vscode.CancellationTokenSource();
    const timeoutTimer = setTimeout(() => {
      timedOut = true;
      timeoutCts.cancel();
      this.outputChannel.appendLine(
        `[AgentLoop] 总超时 (${totalTimeout}ms) 已触发，中断循环`,
      );
    }, totalTimeout);

    // 合并外部 token 和超时 token：任一取消即中断
    // 如果外部 token 取消，也需要清理 timeoutCts
    const externalCancelListener = token?.onCancellationRequested(() => {
      timeoutCts.cancel();
    });
    const effectiveToken = timeoutCts.token;

    try {
      // 获取可用 MCP 工具描述
      const toolsDescription = await this.getToolDescriptions();

      // 构建 Agent 系统提示（含 ReAct 格式指令 + 工具列表）
      const agentSystemPrompt = this.buildAgentSystemPrompt(
        toolsDescription,
        options.systemPrompt,
      );

      // 累积对话消息（LLM 可看到完整上下文）
      const messages: vscode.LanguageModelChatMessage[] = [
        vscode.LanguageModelChatMessage.User(agentSystemPrompt),
        vscode.LanguageModelChatMessage.User(userMessage),
      ];

      // 获取语言模型实例
      const model = await this.lmService.selectModel();
      if (!model) {
        throw new Error('无可用语言模型，请确认已安装 GitHub Copilot Chat 扩展并有有效订阅');
      }

      // ── ReAct 主循环 ──
      while (roundCount < maxSteps) {
        // 检查取消（包含超时触发的取消）
        if (effectiveToken.isCancellationRequested) {
          if (timedOut) {
            this.outputChannel.appendLine('[AgentLoop] 总超时中断循环');
          } else {
            this.outputChannel.appendLine('[AgentLoop] 收到取消信号，中断循环');
          }
          break;
        }

        roundCount++;
        this.outputChannel.appendLine(`[AgentLoop] ── Round ${roundCount}/${maxSteps} ──`);

        // 调用 LLM
        const llmOutput = await this.callLlm(model, messages, effectiveToken);
        this.outputChannel.appendLine(
          `[AgentLoop] LLM 输出 (${llmOutput.length} chars):\n${llmOutput.substring(0, 500)}`,
        );

        // 将 assistant 回复加入对话历史
        messages.push(vscode.LanguageModelChatMessage.Assistant(llmOutput));

        // 解析 LLM 输出
        const parsed = this.parseLlmOutput(llmOutput);

        // ── FINAL_ANSWER：结束循环 ──
        if (parsed.type === 'FINAL_ANSWER') {
          // 记录最后一次 think
          if (parsed.thought) {
            const thinkStep = this.createStep(roundCount, 'think', parsed.thought);
            steps.push(thinkStep);
            onStep?.(thinkStep);
          }

          this.outputChannel.appendLine(
            `[AgentLoop] 完成，共 ${roundCount} 轮，最终答案长度: ${parsed.answer.length}`,
          );

          return { finalAnswer: parsed.answer, steps, totalSteps: roundCount };
        }

        // ── ACTION：执行工具调用 ──
        if (parsed.type === 'ACTION') {
          // Think 步骤
          if (parsed.thought) {
            const thinkStep = this.createStep(roundCount, 'think', parsed.thought);
            steps.push(thinkStep);
            onStep?.(thinkStep);
          }

          // Act 步骤
          const actStep = this.createStep(
            roundCount,
            'act',
            `调用工具 ${parsed.toolName}`,
            parsed.toolName,
            parsed.toolArgs,
          );
          steps.push(actStep);
          onStep?.(actStep);

          // 执行 MCP 工具调用
          const rawObservation = await this.executeTool(
            parsed.toolName!,
            parsed.toolArgs ?? {},
          );

          // 截断观察结果，防止单次工具返回过大文本撑爆上下文
          const observation = smartTruncate(rawObservation, MAX_OBSERVATION_CHARS);
          if (observation.length < rawObservation.length) {
            this.outputChannel.appendLine(
              `[AgentLoop] 观察结果已截断: ${rawObservation.length} → ${observation.length} chars (上限 ${MAX_OBSERVATION_CHARS})`,
            );
          }

          // Observe 步骤
          const observeStep = this.createStep(roundCount, 'observe', observation);
          steps.push(observeStep);
          onStep?.(observeStep);

          // 将观察结果反馈给 LLM
          messages.push(
            vscode.LanguageModelChatMessage.User(`OBSERVATION:\n${observation}`),
          );

          // 消息窗口管理：防止累积对话超出 token 预算
          this.trimMessages(messages);

          continue;
        }

        // ── UNKNOWN：LLM 未遵循格式，记录 think 并提示重试 ──
        const thinkStep = this.createStep(roundCount, 'think', llmOutput);
        steps.push(thinkStep);
        onStep?.(thinkStep);

        messages.push(
          vscode.LanguageModelChatMessage.User(
            'Please respond using the required format: either ACTION with ACTION_INPUT, or FINAL_ANSWER.',
          ),
        );
      }

      // ── 达到 maxSteps 或超时，强制结束 ──
      const reason = timedOut
        ? `总超时 ${totalTimeout}ms`
        : `最大步数 ${maxSteps}`;
      this.outputChannel.appendLine(
        `[AgentLoop] 因 ${reason} 强制结束`,
      );

      const fallbackAnswer = timedOut
        ? `(Agent 执行超时 ${Math.round(totalTimeout / 1000)} 秒后自动中断)\n\n` +
          this.summarizeSteps(steps)
        : `(Agent 达到最大步数 ${maxSteps} 限制后自动结束)\n\n` +
          this.summarizeSteps(steps);

      return { finalAnswer: fallbackAnswer, steps, totalSteps: roundCount };
    } finally {
      clearTimeout(timeoutTimer);
      externalCancelListener?.dispose();
      timeoutCts.dispose();
    }
  }

  // ────────────────────────────────────────────────────────────────
  // 私有方法
  // ────────────────────────────────────────────────────────────────

  /**
   * 调用 LLM 并收集完整文本输出。
   * 当外部未提供 CancellationToken 时，创建临时 CTS 并在完成后自动 dispose，避免孤立资源泄漏。
   */
  private async callLlm(
    model: vscode.LanguageModelChat,
    messages: vscode.LanguageModelChatMessage[],
    token?: vscode.CancellationToken,
  ): Promise<string> {
    let localCts: vscode.CancellationTokenSource | undefined;
    const cancellationToken = token ?? (localCts = new vscode.CancellationTokenSource()).token;
    try {
      const response = await model.sendRequest(messages, {}, cancellationToken);

      let fullText = '';
      for await (const fragment of response.text) {
        fullText += fragment;
      }
      return fullText;
    } finally {
      localCts?.dispose();
    }
  }

  /**
   * 获取所有可用工具描述列表（MCP + 原生浏览器工具），格式化为 LLM 可理解的文本。
   *
   * 合并策略：
   * - browser_* 前缀工具优先来自 BrowserToolProvider（原生通道，更快更可靠）
   * - 若 MCP 也提供同名 browser_* 工具，原生版本优先，MCP 版本跳过
   * - 非 browser_* 的 MCP 工具正常列出
   */
  private async getToolDescriptions(): Promise<string> {
    const allTools: { name: string; description: string; source: string }[] = [];

    // 收集已登记的 browser_* 工具名（用于去重）
    const browserToolNames = new Set<string>();

    // 1. 原生浏览器工具（BrowserToolProvider）
    if (this.browserToolProvider?.connected) {
      try {
        const browserTools = await this.browserToolProvider.listTools();
        for (const t of browserTools) {
          browserToolNames.add(t.name);
          allTools.push({
            name: t.name,
            description: t.description ?? '无描述',
            source: 'browser',
          });
        }
        this.outputChannel.appendLine(
          `[AgentLoop] 加载 ${browserTools.length} 个原生浏览器工具`,
        );
      } catch (err) {
        this.outputChannel.appendLine(
          `[AgentLoop] 获取浏览器工具列表失败: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    // 2. MCP 工具（跳过已被原生浏览器工具覆盖的 browser_* 同名工具）
    if (this.mcpClient.connected) {
      try {
        const mcpTools = await this.mcpClient.listTools();
        for (const t of mcpTools) {
          if (browserToolNames.has(t.name)) {
            this.outputChannel.appendLine(
              `[AgentLoop] MCP 工具 ${t.name} 被原生浏览器工具覆盖，跳过`,
            );
            continue;
          }
          allTools.push({
            name: t.name,
            description: t.description ?? '无描述',
            source: 'mcp',
          });
        }
        this.outputChannel.appendLine(
          `[AgentLoop] 加载 ${mcpTools.length} 个 MCP 工具（去重后）`,
        );
      } catch (err) {
        this.outputChannel.appendLine(
          `[AgentLoop] 获取 MCP 工具列表失败: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    // 3. run_skill 工具（当 SkillRegistry + SkillRunner 可用时注册）
    if (this.skillRegistry && this.skillRunner) {
      const enabledSkills = this.skillRegistry.getAll().filter((s) => s.enabled);
      if (enabledSkills.length > 0) {
        const skillList = enabledSkills
          .map((s) => {
            const paramDesc = Object.entries(s.parameters.properties)
              .map(([k, v]) => `${k}: ${v.description}${s.parameters.required.includes(k) ? ' (必填)' : ''}`)
              .join(', ');
            return `  - ${s.name}: ${s.description}${paramDesc ? ` [参数: ${paramDesc}]` : ''}`;
          })
          .join('\n');
        allTools.push({
          name: 'run_skill',
          description: `执行预定义 Skill（多步骤浏览器操作序列）。参数: {"skill_name": "技能名称", "params": {"参数名": "值"}}。可用 Skill:\n${skillList}`,
          source: 'skill',
        });
        this.outputChannel.appendLine(
          `[AgentLoop] 注册 run_skill 工具，${enabledSkills.length} 个可用 Skill`,
        );
      }
    }

    if (allTools.length === 0) {
      this.outputChannel.appendLine('[AgentLoop] 无可用工具');
      return '(无可用工具)';
    }

    this.outputChannel.appendLine(
      `[AgentLoop] 共加载 ${allTools.length} 个工具（browser: ${browserToolNames.size}, mcp: ${allTools.length - browserToolNames.size}）`,
    );

    return allTools
      .map((t) => `- ${t.name}: ${t.description}`)
      .join('\n');
  }

  /**
   * 构建 Agent 系统提示词，包含 ReAct 格式指令和可用工具列表
   */
  private buildAgentSystemPrompt(
    toolsDescription: string,
    extraContext?: string,
  ): string {
    let prompt = `You are a browser agent that can use tools to help the user. You follow the ReAct (Reasoning + Acting) pattern.

## Available Tools
${toolsDescription}

## Response Format

You MUST respond in one of these two formats:

### Format 1: When you need to use a tool
THOUGHT: <your reasoning about what to do next>
ACTION: <tool_name>
ACTION_INPUT: <JSON object with tool arguments>

### Format 2: When you have the final answer
THOUGHT: <your final reasoning>
FINAL_ANSWER: <your complete answer to the user>

## Rules
- Always start with THOUGHT to explain your reasoning
- Use exactly one ACTION per response, then wait for the OBSERVATION
- After receiving an OBSERVATION, decide if you need another ACTION or can give FINAL_ANSWER
- If no tools are available or needed, go directly to FINAL_ANSWER
- Keep FINAL_ANSWER comprehensive and helpful
- ACTION_INPUT must be valid JSON`;

    if (extraContext) {
      prompt += `\n\n## Additional Context\n${extraContext}`;
    }

    return prompt;
  }

  /**
   * 解析 LLM 输出，识别 THOUGHT / ACTION / FINAL_ANSWER 结构
   */
  private parseLlmOutput(output: string): ParsedLlmOutput {
    // 提取 THOUGHT
    const thoughtMatch = output.match(
      /THOUGHT:\s*([\s\S]*?)(?=(?:ACTION:|FINAL_ANSWER:)|$)/i,
    );
    const thought = thoughtMatch?.[1]?.trim() || undefined;

    // 检查 FINAL_ANSWER
    const finalMatch = output.match(/FINAL_ANSWER:\s*([\s\S]*)/i);
    if (finalMatch) {
      return {
        type: 'FINAL_ANSWER',
        thought,
        answer: finalMatch[1].trim(),
      };
    }

    // 检查 ACTION + ACTION_INPUT
    const actionMatch = output.match(/ACTION:\s*(\S+)/i);
    if (actionMatch) {
      const toolName = actionMatch[1].trim();

      let toolArgs: Record<string, unknown> = {};
      const inputMatch = output.match(
        /ACTION_INPUT:\s*([\s\S]*?)(?=(?:THOUGHT:|ACTION:|FINAL_ANSWER:)|$)/i,
      );
      if (inputMatch) {
        try {
          let jsonStr = inputMatch[1].trim();
          // 处理可能被 markdown 代码块包裹的 JSON
          jsonStr = jsonStr
            .replace(/^```(?:json)?\s*\n?/, '')
            .replace(/\n?\s*```$/, '');
          toolArgs = JSON.parse(jsonStr) as Record<string, unknown>;
        } catch {
          this.outputChannel.appendLine(
            `[AgentLoop] ACTION_INPUT JSON 解析失败，原文: ${inputMatch[1].substring(0, 200)}`,
          );
        }
      }

      return {
        type: 'ACTION',
        thought,
        answer: '',
        toolName,
        toolArgs,
      };
    }

    // 未识别的格式
    return { type: 'UNKNOWN', thought, answer: output };
  }

  /**
   * 执行工具调用并格式化结果。
   *
   * 路由策略：
   * - run_skill → SkillRunner.execute（Skill 执行引擎）
   * - browser_* 前缀 且 BrowserToolProvider 可用 → BrowserToolProvider.callTool（原生通道）
   * - 其他 → McpClient.callTool
   */
  private async executeTool(
    toolName: string,
    toolArgs: Record<string, unknown>,
  ): Promise<string> {
    // run_skill 路由到 SkillRunner
    if (toolName === 'run_skill') {
      return this.executeRunSkill(toolArgs);
    }

    const useBrowserChannel =
      toolName.startsWith('browser_') &&
      this.browserToolProvider?.connected === true;

    const source = useBrowserChannel ? 'BrowserToolProvider' : 'McpClient';
    this.outputChannel.appendLine(
      `[AgentLoop] 执行工具: ${toolName} (via ${source}), 参数: ${JSON.stringify(toolArgs)}`,
    );

    try {
      let result: McpToolResult;
      if (useBrowserChannel) {
        result = await this.browserToolProvider!.callTool(toolName, toolArgs);
      } else {
        result = await this.mcpClient.callTool(toolName, toolArgs);
      }
      return this.formatToolResult(result);
    } catch (err) {
      const errMsg = `工具调用失败 (${toolName} via ${source}): ${err instanceof Error ? err.message : String(err)}`;
      this.outputChannel.appendLine(`[AgentLoop] ${errMsg}`);
      return errMsg;
    }
  }

  /**
   * 执行 run_skill 工具：解析 LLM 传入的 skill_name + params，调用 SkillRunner
   */
  private async executeRunSkill(
    toolArgs: Record<string, unknown>,
  ): Promise<string> {
    const skillName = toolArgs.skill_name as string | undefined;
    const params = (toolArgs.params as Record<string, string>) ?? {};

    this.outputChannel.appendLine(
      `[AgentLoop] run_skill: skill_name=${skillName}, params=${JSON.stringify(params)}`,
    );

    if (!skillName) {
      return 'run_skill 错误: 缺少 skill_name 参数';
    }

    if (!this.skillRegistry || !this.skillRunner) {
      return 'run_skill 错误: Skill 系统未初始化';
    }

    const skill = this.skillRegistry.getByName(skillName);
    if (!skill) {
      const available = this.skillRegistry
        .getAll()
        .filter((s) => s.enabled)
        .map((s) => s.name)
        .join(', ');
      return `run_skill 错误: 未找到 Skill "${skillName}"。可用 Skill: ${available}`;
    }

    try {
      const result = await this.skillRunner.execute(skill, params);
      return result.summary;
    } catch (err) {
      const errMsg = `run_skill 执行失败: ${err instanceof Error ? err.message : String(err)}`;
      this.outputChannel.appendLine(`[AgentLoop] ${errMsg}`);
      return errMsg;
    }
  }

  /**
   * 格式化 MCP 工具调用结果为可读文本
   */
  private formatToolResult(result: McpToolResult): string {
    if (result.isError) {
      return `工具返回错误: ${JSON.stringify(result.content)}`;
    }

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
   * 创建 AgentStep 实例的工厂方法
   */
  private createStep(
    step: number,
    type: AgentStep['type'],
    content: string,
    toolName?: string,
    toolArgs?: Record<string, unknown>,
  ): AgentStep {
    return { step, type, content, toolName, toolArgs };
  }

  /**
   * 计算单条消息的文本字符总数。
   * vscode.LanguageModelChatMessage.content 是 LanguageModelContentPart[] 数组，
   * 文本部分（LanguageModelTextPart）有 .value 属性。
   */
  private getMessageTextLength(message: vscode.LanguageModelChatMessage): number {
    let len = 0;
    for (const part of message.content) {
      if ('value' in part && typeof (part as { value: unknown }).value === 'string') {
        len += ((part as { value: string }).value).length;
      }
    }
    return len;
  }

  /**
   * 计算消息数组的总文本字符数。
   */
  private calcMessagesChars(messages: vscode.LanguageModelChatMessage[]): number {
    return messages.reduce((sum, m) => sum + this.getMessageTextLength(m), 0);
  }

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
  private trimMessages(messages: vscode.LanguageModelChatMessage[]): void {
    const totalChars = this.calcMessagesChars(messages);

    if (totalChars <= MAX_MESSAGES_CHARS) {
      return;
    }

    this.outputChannel.appendLine(
      `[AgentLoop] 消息窗口超出预算: ${totalChars} chars (≈${Math.ceil(totalChars / 3)} tokens) > ${MAX_MESSAGES_CHARS} chars，开始裁剪`,
    );

    // 保留前 2 条（system prompt + 用户初始消息）
    const PROTECTED_COUNT = 2;
    let removedCount = 0;

    // 从 PROTECTED_COUNT 位置开始移除最早的消息，直到总量降到预算内
    while (messages.length > PROTECTED_COUNT + 1) {
      if (this.calcMessagesChars(messages) <= MAX_MESSAGES_CHARS) {
        break;
      }

      // 移除 PROTECTED_COUNT 位置的消息（最早的非保护消息）
      messages.splice(PROTECTED_COUNT, 1);
      removedCount++;
    }

    if (removedCount > 0) {
      const afterChars = this.calcMessagesChars(messages);
      this.outputChannel.appendLine(
        `[AgentLoop] 消息窗口裁剪完成: 移除 ${removedCount} 条旧消息，${totalChars} → ${afterChars} chars，剩余 ${messages.length} 条消息`,
      );
    }
  }

  /**
   * 总结已执行的步骤（达到 maxSteps 上限时用于生成 fallback 答案）
   */
  private summarizeSteps(steps: AgentStep[]): string {
    const thinkSteps = steps.filter((s) => s.type === 'think');
    const observeSteps = steps.filter((s) => s.type === 'observe');

    if (thinkSteps.length === 0 && observeSteps.length === 0) {
      return '执行了多个步骤但未能得出最终结论。';
    }

    const parts: string[] = [];

    // 最后一次思考
    if (thinkSteps.length > 0) {
      const lastThink = thinkSteps[thinkSteps.length - 1];
      parts.push(`最后的推理: ${lastThink.content}`);
    }

    // 收集到的观察
    if (observeSteps.length > 0) {
      parts.push(
        `已收集 ${observeSteps.length} 条工具观察结果。`,
      );
    }

    return parts.join('\n\n');
  }
}
