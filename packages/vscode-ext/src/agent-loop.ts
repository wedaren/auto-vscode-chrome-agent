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
  /** observe 步骤的图片数据（data:image/... base64 URL），用于 Chrome UI 渲染图片而非纯文本 */
  imageData?: string;
}

/** formatToolResult 返回值：文本摘要 + 可选图片数据 */
interface ToolResultFormatted {
  text: string;
  imageData?: string;
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
          const toolResult = await this.executeTool(
            parsed.toolName!,
            parsed.toolArgs ?? {},
          );

          // 截断观察结果，防止单次工具返回过大文本撑爆上下文
          const observation = smartTruncate(toolResult.text, MAX_OBSERVATION_CHARS);
          if (observation.length < toolResult.text.length) {
            this.outputChannel.appendLine(
              `[AgentLoop] 观察结果已截断: ${toolResult.text.length} → ${observation.length} chars (上限 ${MAX_OBSERVATION_CHARS})`,
            );
          }

          // Observe 步骤（图片数据通过 imageData 传递给前端，不进入 LLM 上下文）
          const observeStep = this.createStep(roundCount, 'observe', observation, undefined, undefined, toolResult.imageData);
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
   * - 非 browser_* 的 MCP 工具正常列出，且渲染完整参数签名（inputSchema）
   */
  private async getToolDescriptions(): Promise<string> {
    const lines: string[] = [];

    // 收集已登记的 browser_* 工具名（用于去重）
    const browserToolNames = new Set<string>();
    let browserCount = 0;
    let mcpCount = 0;

    // 1. 原生浏览器工具（BrowserToolProvider）—— 保持现有简洁格式
    if (this.browserToolProvider?.connected) {
      try {
        const browserTools = await this.browserToolProvider.listTools();
        for (const t of browserTools) {
          browserToolNames.add(t.name);
          lines.push(`- ${t.name}: ${t.description ?? '无描述'}`);
          browserCount++;
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
    //    渲染完整 inputSchema 参数签名，让 LLM 知晓参数名、类型、是否必填、描述
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
          lines.push(this.formatMcpToolSignature(t.name, t.description, t.inputSchema));
          mcpCount++;
        }
        this.outputChannel.appendLine(
          `[AgentLoop] 加载 ${mcpTools.length} 个 MCP 工具（去重后保留 ${mcpCount} 个）`,
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
        lines.push(
          `- run_skill: 执行预定义 Skill（多步骤浏览器操作序列）。参数: {"skill_name": "技能名称", "params": {"参数名": "值"}}。可用 Skill:\n${skillList}`,
        );
        this.outputChannel.appendLine(
          `[AgentLoop] 注册 run_skill 工具，${enabledSkills.length} 个可用 Skill`,
        );
      }
    }

    if (lines.length === 0) {
      this.outputChannel.appendLine('[AgentLoop] 无可用工具');
      return '(无可用工具)';
    }

    this.outputChannel.appendLine(
      `[AgentLoop] 共加载 ${lines.length} 个工具（browser: ${browserCount}, mcp: ${mcpCount}）`,
    );

    return lines.join('\n');
  }

  /**
   * 将 MCP 工具的 inputSchema（JSON Schema）渲染为 LLM 可读的函数签名。
   *
   * 输出格式示例：
   *   - navigate_page(url: string [必填] — 要导航到的 URL, waitUntil?: string — 等待条件) — 导航到指定 URL
   *
   * 如果 inputSchema 不存在或无 properties，则退化为简洁格式：
   *   - navigate_page: 导航到指定 URL
   */
  private formatMcpToolSignature(
    name: string,
    description?: string,
    inputSchema?: Record<string, unknown>,
  ): string {
    const desc = description ?? '无描述';

    // 无 schema 或无 properties —— 退化为简洁格式
    if (!inputSchema) {
      return `- ${name}: ${desc}`;
    }

    const properties = inputSchema.properties as
      | Record<string, Record<string, unknown>>
      | undefined;

    if (!properties || Object.keys(properties).length === 0) {
      return `- ${name}(): ${desc}`;
    }

    // 必填参数集合
    const requiredSet = new Set<string>(
      Array.isArray(inputSchema.required)
        ? (inputSchema.required as string[])
        : [],
    );

    // 渲染每个参数：name: type [必填] — description
    const paramParts: string[] = [];
    for (const [paramName, paramSchema] of Object.entries(properties)) {
      const paramType = (paramSchema.type as string) ?? 'any';
      const isRequired = requiredSet.has(paramName);
      const paramDesc = paramSchema.description as string | undefined;

      let part = isRequired
        ? `${paramName}: ${paramType} [必填]`
        : `${paramName}?: ${paramType}`;

      if (paramDesc) {
        part += ` — ${paramDesc}`;
      }

      paramParts.push(part);
    }

    return `- ${name}(${paramParts.join(', ')}) — ${desc}`;
  }

  /**
   * 构建 Agent 系统提示词，包含 ReAct 格式指令、可用工具列表、
   * 工具组合 few-shot 范例、多步骤编排建议、错误恢复指导
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
- ACTION_INPUT must be valid JSON

## Language Consistency (CRITICAL)
- Always respond in the same language as the user's input message
- This applies to ALL sections: THOUGHT, FINAL_ANSWER, and any explanatory text
- If the user writes in Chinese, ALL your output (including THOUGHT reasoning) MUST be in Chinese
- If the user writes in English, respond entirely in English
- If the user writes in any other language, match that language consistently
- Tool names (ACTION) and JSON keys (ACTION_INPUT) remain in English — only natural language text follows this rule
- When in doubt, detect the language of the most recent user message and use that language throughout your entire response

## Tool Combination Examples (Few-Shot)

Below are concrete examples showing how to combine browser_ tools and run_skill for multi-step tasks. Study these patterns before acting.

### Example 1: Extract data from a page, then navigate and compare

User: "Compare the price of this product with the one at https://competitor.com/same-product"

Step 1 —
THOUGHT: First I need to get the price from the current page. I'll query the price element.
ACTION: browser_get_text
ACTION_INPUT: {"selector": ".product-price"}

OBSERVATION: $29.99

Step 2 —
THOUGHT: Got the current price ($29.99). Now I need to navigate to the competitor page.
ACTION: browser_navigate
ACTION_INPUT: {"url": "https://competitor.com/same-product"}

OBSERVATION: Navigated to https://competitor.com/same-product

Step 3 —
THOUGHT: I'm on the competitor page. Let me extract their price for comparison.
ACTION: browser_get_text
ACTION_INPUT: {"selector": ".product-price, .price, [data-price]"}

OBSERVATION: $34.50

Step 4 —
THOUGHT: I have both prices. Current page: $29.99, Competitor: $34.50. I can now provide a comparison.
FINAL_ANSWER: The product is **$29.99** on the original page and **$34.50** on the competitor site — that's a $4.51 (13%) difference. The original page has the better price.

### Example 2: Fill a form using page context and run a Skill

User: "Search for 'TypeScript best practices' on this page and summarize the results"

Step 1 —
THOUGHT: I'll use the search_in_page skill to find matching content on the current page.
ACTION: run_skill
ACTION_INPUT: {"skill_name": "search_in_page", "params": {"keyword": "TypeScript best practices"}}

OBSERVATION: Found 5 matches: [match details...]

Step 2 —
THOUGHT: The skill found matches but I need more context around them. Let me grab the full text of the relevant section.
ACTION: browser_get_text
ACTION_INPUT: {"selector": "article, .content, main"}

OBSERVATION: [full article text...]

Step 3 —
THOUGHT: I have the full context with the search results. I can now summarize the TypeScript best practices mentioned on this page.
FINAL_ANSWER: Here are the TypeScript best practices discussed on this page: ...

### Example 3: Multi-step form interaction

User: "Fill the registration form with my info and submit it"

Step 1 —
THOUGHT: First I need to understand the form structure by querying all input fields.
ACTION: browser_query_selector_all
ACTION_INPUT: {"selector": "form input, form select, form textarea", "limit": 20}

OBSERVATION: [{tag: "input", id: "name", type: "text"}, {tag: "input", id: "email", type: "email"}, {tag: "select", id: "country"}, ...]

Step 2 —
THOUGHT: I see the form has name, email, and country fields. Let me use the fill_and_submit skill which handles multi-field forms efficiently.
ACTION: run_skill
ACTION_INPUT: {"skill_name": "fill_and_submit", "params": {"formSelector": "form#register", "fields": {"name": "John Doe", "email": "john@example.com"}, "submitSelector": "button[type=submit]"}}

OBSERVATION: Form submitted successfully.

Step 3 —
THOUGHT: The form was submitted. Let me verify we landed on a success page.
ACTION: browser_get_text
ACTION_INPUT: {"selector": "body"}

OBSERVATION: Thank you for registering! ...

Step 4 —
THOUGHT: Registration succeeded. I can confirm the result.
FINAL_ANSWER: Registration form has been filled and submitted successfully. The confirmation page says: "Thank you for registering!"

## Multi-Step Task Orchestration Guide

When the user requests a complex task, decompose it into stages:

1. **Reconnaissance** — Start by understanding the current page:
   - Use browser_get_text or browser_query_selector_all to inspect structure
   - Use browser_get_links to discover navigation targets
   - Use browser_screenshot to visually confirm state

2. **Action Execution** — Perform the core operations:
   - Prefer run_skill for well-defined workflows (form filling, data extraction, page navigation + summarization)
   - Use individual browser_ tools for fine-grained control when skills don't cover the scenario
   - Chain browser_navigate → browser_wait → browser_get_text for cross-page workflows

3. **Verification** — Always confirm results:
   - After browser_click or browser_type, verify the page state changed as expected
   - After browser_navigate, use browser_wait if the page loads dynamically
   - After run_skill, validate the output makes sense before presenting to user

4. **Synthesis** — Combine observations into a coherent FINAL_ANSWER:
   - Summarize data you collected across steps
   - Provide actionable insights, not raw dumps

### Skill vs. Individual Tools Decision

- Use **run_skill** when a preset matches the task (navigate_to_url, extract_page_data, translate_page, organize_tabs, fill_and_submit, etc.) — Skills handle retries and multi-step flows internally
- Use **individual browser_ tools** when you need custom logic, conditional branching, or the task doesn't match any existing Skill
- You can **mix both**: run a Skill for the bulk workflow, then use browser_ tools for fine-tuning

## Error Recovery Guide

If a tool call fails or returns unexpected results:

1. **Selector not found** — Try a broader CSS selector or use browser_query_selector_all to discover available elements. Fallback chain: specific ID → class → tag + text content
2. **Navigation timeout** — Retry browser_navigate, then use browser_wait with a longer timeout. If the URL is wrong, use browser_get_links to discover valid URLs from the current page
3. **Skill execution failure** — Fall back to individual browser_ tools to accomplish the same goal step-by-step. Inspect the error message to understand which step failed
4. **Empty or truncated text** — The element may be hidden or dynamically loaded. Try browser_wait first, then browser_evaluate to check element visibility
5. **Stale page state** — After navigation or AJAX operations, always re-query the DOM rather than relying on earlier observations
6. **General principle** — Never give up after a single failure. Try an alternative approach (different selector, different tool, different strategy) before reporting failure to the user`;

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
  ): Promise<ToolResultFormatted> {
    // run_skill 路由到 SkillRunner
    if (toolName === 'run_skill') {
      return { text: await this.executeRunSkill(toolArgs) };
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
      return { text: errMsg };
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
   * 格式化 MCP 工具调用结果为可读文本 + 可选图片数据。
   *
   * image 类型内容返回文本摘要（"[截图已获取]"），避免 base64 原文撑爆 LLM 上下文；
   * 同时将完整 data URL 通过 imageData 字段传递给前端渲染。
   */
  private formatToolResult(result: McpToolResult): ToolResultFormatted {
    if (result.isError) {
      return { text: `工具返回错误: ${JSON.stringify(result.content)}` };
    }

    if (!result.content || result.content.length === 0) {
      return { text: '(工具未返回内容)' };
    }

    let imageData: string | undefined;
    const textParts = result.content.map((item) => {
      const typedItem = item as { type?: string; text?: string; data?: string; mimeType?: string };
      if (typedItem.type === 'image' && typedItem.data) {
        // 还原完整 data URL 供前端渲染
        const mime = typedItem.mimeType || 'image/png';
        imageData = `data:${mime};base64,${typedItem.data}`;
        return `[截图已获取]`;
      }
      if (typedItem.type === 'text' && typedItem.text) {
        return typedItem.text;
      }
      return JSON.stringify(item);
    });

    return { text: textParts.join('\n'), imageData };
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
    imageData?: string,
  ): AgentStep {
    const s: AgentStep = { step, type, content, toolName, toolArgs };
    if (imageData) {
      s.imageData = imageData;
    }
    return s;
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
