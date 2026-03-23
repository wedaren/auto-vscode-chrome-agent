// message-handler.ts — WebSocket 消息路由类，封装所有消息处理逻辑
// 职责：list_models / select_model / chat / cancel_chat 消息路由、
//       浏览器上下文→system prompt 构建、CancellationToken 生命周期管理、
//       McpClient 或 BrowserToolProvider 可用时自动切换为 AgentLoop（agent_step/agent_complete 推送）
import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import { LmService } from './lm-service';
import { WsServer, BridgeMessage } from './ws-server';
import { McpClient } from './mcp-client';
import { BrowserToolProvider } from './browser-tools';
import { SkillRegistry } from './skill-registry';
import { SkillRunner } from './skill-runner';
import { AgentLoop, AgentStep } from './agent-loop';
import { startAgentRun, addAgentStep, completeAgentRun } from './agent-tree';
import { LlmRequestCollector, LlmRequestDetail } from './llm-request-collector';
import { createChildMeta } from './observability';
import type { ObservabilityStore } from './observability-store';
import {
  smartTruncate,
  estimateTokens,
  MAX_SELECTED_TEXT_CHARS,
  MAX_URL_CHARS,
  MAX_TITLE_CHARS,
  MAX_SYSTEM_PROMPT_CONTEXT_CHARS,
} from './context-budget';

/**
 * MessageHandler 封装所有 WebSocket 消息的处理逻辑。
 * 由 extension.ts 创建并注册到 WsServer.onMessage()。
 *
 * 当 McpClient 或 BrowserToolProvider 可用时，handleChat 使用 AgentLoop.run() 进行 ReAct 循环，
 * 每步通过 agent_step 消息实时推送，循环结束发送 agent_complete。
 * 只要 Chrome 有 WebSocket 连接就有原生浏览器工具可用，无需 MCP 也能进入 Agent 模式。
 * 当两者都不可用时，保持原有 LM 流式对话行为。
 */
export class MessageHandler {
  private readonly lmService: LmService;
  private readonly wsServer: WsServer;
  private readonly mcpClient: McpClient;
  private readonly browserToolProvider: BrowserToolProvider;
  private readonly skillRegistry?: SkillRegistry;
  private readonly skillRunner?: SkillRunner;
  private readonly observabilityStore?: ObservabilityStore;
  private readonly outputChannel: vscode.OutputChannel;

  /** LLM 请求细节采集器，记录每次 chat/agent 请求的完整链路数据 */
  private readonly llmCollector = new LlmRequestCollector();

  /** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
  private readonly activeChatTokens = new Map<WebSocket, vscode.CancellationTokenSource>();

  /** 已注册 close 监听的 WebSocket 集合，避免重复注册 */
  private readonly wsCloseRegistered = new WeakSet<WebSocket>();

  /** disposed 标志：dispose 后拒绝新增 activeChatTokens 条目 */
  private _disposed = false;

  /** list_models 节流：最小间隔 5 秒，防止高频请求压垮 vscode.lm API */
  private static readonly LIST_MODELS_THROTTLE_MS = 5000;

  /** 上次成功处理 list_models 的时间戳（Date.now()） */
  private _lastListModelsTime = 0;

  /** list_models 缓存结果，节流期间直接返回 */
  private _cachedModelsList: Array<{ id: string; name: string }> | null = null;

  constructor(
    lmService: LmService,
    wsServer: WsServer,
    mcpClient: McpClient,
    outputChannel: vscode.OutputChannel,
    browserToolProvider: BrowserToolProvider,
    skillRegistry?: SkillRegistry,
    skillRunner?: SkillRunner,
    observabilityStore?: ObservabilityStore,
  ) {
    this.lmService = lmService;
    this.wsServer = wsServer;
    this.mcpClient = mcpClient;
    this.outputChannel = outputChannel;
    this.browserToolProvider = browserToolProvider;
    this.skillRegistry = skillRegistry;
    this.skillRunner = skillRunner;
    this.observabilityStore = observabilityStore;
  }

  private childMeta(msg: BridgeMessage, event: string, requestId?: string) {
    return createChildMeta(msg.meta, {
      source: 'vscode-agent',
      event,
      sessionId: msg.sessionId,
      requestId,
    });
  }

  /**
   * 注册 WebSocket close 事件监听器（每个 ws 只注册一次），
   * 断开时自动 cancel + dispose 对应 CTS 并从 Map 中删除，防止内存泄漏。
   */
  private ensureWsCloseHandler(ws: WebSocket): void {
    if (this.wsCloseRegistered.has(ws)) {
      return;
    }
    this.wsCloseRegistered.add(ws);

    ws.on('close', () => {
      const cts = this.activeChatTokens.get(ws);
      if (cts) {
        this.outputChannel.appendLine(
          '[BrowserAgent] WebSocket 断开，自动取消并清理 CancellationTokenSource',
        );
        cts.cancel();
        cts.dispose();
        this.activeChatTokens.delete(ws);
      }
    });
  }

  /**
   * 若同一 WebSocket 上已有活跃的 CTS（如快速重发 chat），先取消并释放旧的。
   */
  private disposeExistingCts(ws: WebSocket): void {
    const oldCts = this.activeChatTokens.get(ws);
    if (oldCts) {
      this.outputChannel.appendLine(
        '[BrowserAgent] 同一 WebSocket 重发 chat，取消并清理旧 CancellationTokenSource',
      );
      oldCts.cancel();
      oldCts.dispose();
      this.activeChatTokens.delete(ws);
    }
  }

  /**
   * 消息路由入口，根据 msg.type 分发到对应处理方法。
   * 应注册到 wsServer.onMessage()。
   */
  handle(ws: WebSocket, msg: BridgeMessage): void {
    // disposal guard：dispose 后拒绝处理新消息
    if (this._disposed) {
      this.outputChannel.appendLine(
        `[BrowserAgent] MessageHandler 已 disposed，忽略消息 type=${msg.type}`,
      );
      return;
    }

    switch (msg.type) {
      case 'list_models':
        this.handleListModels(ws, msg);
        break;
      case 'select_model':
        this.handleSelectModel(ws, msg);
        break;
      case 'chat':
        this.handleChat(ws, msg);
        break;
      case 'cancel_chat':
        this.handleCancelChat(ws);
        break;
      case 'skill_list':
        this.handleSkillList(ws, msg);
        break;
      case 'skill_execute':
        this.handleSkillExecute(ws, msg);
        break;
      case 'observability_get_stats':
        this.handleObservabilityGetStats(ws, msg);
        break;
      default:
        this.outputChannel.appendLine(
          `[BrowserAgent] 未处理的消息类型: ${msg.type}`,
        );
        break;
    }
  }

  private handleObservabilityGetStats(ws: WebSocket, msg: BridgeMessage): void {
    // 统计聚合也统一在仓库侧完成，避免 Chrome 本地数组和仓库口径不一致。
    const payload = msg.payload as { windowMs?: number } | undefined;
    const stats = this.observabilityStore?.getStats(payload?.windowMs) ?? null;
    this.wsServer.send(ws, {
      type: 'observability_stats_result',
      payload: { stats },
      sessionId: msg.sessionId,
      meta: this.childMeta(msg, 'observability.stats.result'),
    });
  }

  /**
   * 处理 list_models：返回可用模型列表（带节流防护）
   * 5 秒内的重复请求直接返回缓存结果，避免高频调用 vscode.lm API 导致 Extension Host 卡死。
   */
  private handleListModels(ws: WebSocket, msg: BridgeMessage): void {
    const now = Date.now();
    const elapsed = now - this._lastListModelsTime;

    // 节流：5 秒内重复请求直接返回缓存
    if (elapsed < MessageHandler.LIST_MODELS_THROTTLE_MS && this._cachedModelsList !== null) {
      this.outputChannel.appendLine(
        `[BrowserAgent] list_models 节流：距上次 ${elapsed}ms < ${MessageHandler.LIST_MODELS_THROTTLE_MS}ms，返回缓存 (${this._cachedModelsList.length} 个模型)`,
      );
      const prefs = this.lmService.getModelPreferences();
      this.wsServer.send(ws, {
        type: 'models_list',
        payload: {
          models: this._cachedModelsList,
          defaultModelId: prefs.defaultModelId || undefined,
          maxVisibleModels: prefs.maxVisibleModels,
        },
        sessionId: msg.sessionId,
        meta: this.childMeta(msg, 'models.list.result'),
      });
      return;
    }

    void (async () => {
      try {
        const models = await this.lmService.listModels();
        // 更新缓存和时间戳
        this._cachedModelsList = models;
        this._lastListModelsTime = Date.now();

        const prefs = this.lmService.getModelPreferences();
        this.wsServer.send(ws, {
          type: 'models_list',
          payload: {
            models,
            defaultModelId: prefs.defaultModelId || undefined,
            maxVisibleModels: prefs.maxVisibleModels,
          },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, 'models.list.result'),
        });
        this.outputChannel.appendLine(
          `[BrowserAgent] 已返回 ${models.length} 个模型信息`,
        );
      } catch (err) {
        this.outputChannel.appendLine(
          `[BrowserAgent] list_models 失败: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    })();
  }

  /**
   * 处理 select_model：选择指定模型
   */
  private handleSelectModel(ws: WebSocket, msg: BridgeMessage): void {
    void (async () => {
      try {
        const { modelId } = msg.payload as { modelId: string };
        const success = await this.lmService.selectModelById(modelId);
        this.wsServer.send(ws, {
          type: 'model_selected',
          payload: { success, modelId },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, 'models.select.result', modelId),
        });
        this.outputChannel.appendLine(
          `[BrowserAgent] select_model modelId=${modelId} 结果: ${success ? '成功' : '未找到'}`,
        );
      } catch (err) {
        this.outputChannel.appendLine(
          `[BrowserAgent] select_model 失败: ${err instanceof Error ? err.message : String(err)}`,
        );
        this.wsServer.send(ws, {
          type: 'model_selected',
          payload: { success: false, modelId: '' },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, 'models.select.result'),
        });
      }
    })();
  }

  /**
   * 处理 chat：根据工具可用性选择路径
   * - McpClient 已连接 或 BrowserToolProvider 有已连接客户端 → AgentLoop 模式（agent_step / agent_complete）
   * - 两者都不可用 → 原有 LM 流式对话模式（chat_response_chunk / chat_response_end）
   */
  private handleChat(ws: WebSocket, msg: BridgeMessage): void {
    const chatPayload = msg.payload as {
      text?: string;
      context?: { url?: string; title?: string; selectedText?: string };
    };
    const text = chatPayload?.text ?? '';
    const context = chatPayload?.context;

    const systemPrompt = this.buildSystemPrompt(context);

    this.outputChannel.appendLine(
      `[BrowserAgent] chat 收到消息，context: url=${context?.url ?? '无'}, title=${context?.title ?? '无'}, selectedText=${context?.selectedText ? `${context.selectedText.length}字` : '无'}`,
    );

    // 只要 MCP 或原生浏览器工具任一可用，就进入 Agent 模式。
    // 这样 observability trace 能覆盖 tool/agent 整条链路，而不退化成纯聊天流。
    const hasToolSource = this.mcpClient.connected || this.browserToolProvider.connected;

    if (hasToolSource) {
      this.handleChatAgentMode(ws, msg, text, systemPrompt);
    } else {
      this.handleChatStreamMode(ws, msg, text, systemPrompt);
    }
  }

  /**
   * Agent 模式：McpClient 或 BrowserToolProvider 可用时使用 AgentLoop.run() 进行 ReAct 循环
   * 每步通过 agent_step 实时推送，循环结束发送 agent_complete
   */
  private handleChatAgentMode(
    ws: WebSocket,
    msg: BridgeMessage,
    text: string,
    systemPrompt: string,
  ): void {
    const mcpOk = this.mcpClient.connected;
    const browserOk = this.browserToolProvider.connected;
    this.outputChannel.appendLine(
      `[BrowserAgent] 进入 AgentLoop 模式 (MCP=${mcpOk ? '已连接' : '未连接'}, BrowserTools=${browserOk ? '已连接' : '未连接'})`,
    );

    void (async () => {
      // WebSocket 断开时自动清理 CTS，防止泄漏
      this.ensureWsCloseHandler(ws);
      // 同一 ws 快速重发 chat 时先 dispose 旧 CTS
      this.disposeExistingCts(ws);

      const cts = new vscode.CancellationTokenSource();
      this.activeChatTokens.set(ws, cts);

      // 注册到 Agent 循环 TreeView（实时可视化）
      const runId = startAgentRun(text);

      // 采集 LLM 请求细节
      const modelInfo = this.lmService.currentModel;
      const collectId = this.llmCollector.startRequest(
        'agent',
        modelInfo?.name ?? modelInfo?.id ?? 'unknown',
        systemPrompt,
      );
      this.llmCollector.addMessage(collectId, 'user', text);

      try {
        const agentLoop = new AgentLoop(
          this.lmService,
          this.mcpClient,
          this.outputChannel,
          this.browserToolProvider,
          this.skillRegistry,
          this.skillRunner,
        );

        const result = await agentLoop.run(
          text,
          {
            systemPrompt,
            onStep: (step: AgentStep) => {
              // agent_step 既是前端实时 UI 更新，也是 trace 中的关键执行事件。
              // 每个 AgentStep 实时推送 agent_step 消息（→ Chrome UI）
              // observe 步骤可能含 imageData（截图 base64 URL），传给前端渲染图片
              this.wsServer.send(ws, {
                type: 'agent_step',
                payload: {
                  step: step.step,
                  type: step.type,
                  content: step.content,
                  toolName: step.toolName,
                  toolArgs: step.toolArgs,
                  ...(step.imageData ? { imageData: step.imageData } : {}),
                },
                sessionId: msg.sessionId,
                meta: this.childMeta(msg, 'agent.step'),
              });

              // 同步追加到 Agent 循环 TreeView（→ VSCode 调试面板）
              addAgentStep(runId, step);

              // 采集 Agent 步骤
              this.llmCollector.addAgentStep(collectId, {
                step: step.step,
                type: step.type,
                content: step.content,
                toolName: step.toolName,
                toolArgs: step.toolArgs,
              });
            },
          },
          cts.token,
        );

        // AgentLoop 完成，标记运行结束
        completeAgentRun(runId, 'completed');

        // 结束采集：记录最终响应
        this.llmCollector.addMessage(collectId, 'assistant', result.finalAnswer);
        this.llmCollector.endRequest(collectId, result.finalAnswer);
        const llmDetail = this.llmCollector.getDetail(collectId);

        // 发送 agent_complete 消息（附加 llmDetail）
        this.wsServer.send(ws, {
          type: 'agent_complete',
          payload: {
            finalAnswer: result.finalAnswer,
            steps: result.steps,
            totalSteps: result.totalSteps,
            llmDetail,
          },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, 'agent.complete'),
        });

        this.outputChannel.appendLine(
          `[BrowserAgent] AgentLoop 完成: ${result.totalSteps} 步, 答案长度 ${result.finalAnswer.length}`,
        );

        // 异步生成智能跟进建议（不阻塞主响应）
        const chatPayloadForSuggestions = msg.payload as {
          text?: string;
          context?: { url?: string; title?: string };
        };
        this.generateFollowUpSuggestions(
          ws,
          msg,
          text,
          result.finalAnswer,
          chatPayloadForSuggestions?.context,
        );
      } catch (err) {
        const isCancelled = cts.token.isCancellationRequested;
        if (isCancelled) {
          // 被取消时标记为 cancelled
          completeAgentRun(runId, 'cancelled');
          this.llmCollector.endRequest(collectId, '', undefined, true);

          this.wsServer.send(ws, {
            type: 'agent_complete',
            payload: {
              finalAnswer: '',
              steps: [],
              totalSteps: 0,
              cancelled: true,
            },
            sessionId: msg.sessionId,
            meta: this.childMeta(msg, 'agent.cancelled'),
          });
          this.outputChannel.appendLine(
            '[BrowserAgent] AgentLoop 被用户取消',
          );
        } else {
          // 错误时标记为 error
          const errMsg = err instanceof Error ? err.message : String(err);
          completeAgentRun(runId, 'error', errMsg);
          this.llmCollector.endRequest(collectId, '', errMsg);

          this.wsServer.send(ws, {
            type: 'agent_complete',
            payload: {
              finalAnswer: `错误: ${errMsg}`,
              steps: [],
              totalSteps: 0,
            },
            sessionId: msg.sessionId,
            meta: this.childMeta(msg, 'agent.error'),
          });
          this.outputChannel.appendLine(
            `[BrowserAgent] AgentLoop 错误: ${errMsg}`,
          );
        }
      } finally {
        this.activeChatTokens.delete(ws);
        cts.dispose();
      }
    })();
  }

  /**
   * 流式模式：McpClient 未连接时保持原有 LM 直接流式对话
   */
  private handleChatStreamMode(
    ws: WebSocket,
    msg: BridgeMessage,
    text: string,
    systemPrompt: string,
  ): void {
    this.outputChannel.appendLine(
      '[BrowserAgent] McpClient 未连接，使用流式 LM 对话模式',
    );

    void (async () => {
      // WebSocket 断开时自动清理 CTS，防止泄漏
      this.ensureWsCloseHandler(ws);
      // 同一 ws 快速重发 chat 时先 dispose 旧 CTS
      this.disposeExistingCts(ws);

      const cts = new vscode.CancellationTokenSource();
      this.activeChatTokens.set(ws, cts);

      // 采集 LLM 请求细节
      const modelInfo = this.lmService.currentModel;
      const collectId = this.llmCollector.startRequest(
        'stream',
        modelInfo?.name ?? modelInfo?.id ?? 'unknown',
        systemPrompt,
      );
      this.llmCollector.addMessage(collectId, 'user', text);

      try {
        const fullText = await this.lmService.sendMessageStreaming(
          text,
          (fragment: string) => {
            // 流式模式下每个 chunk 都沿原始 trace 返回，便于看 first-token/尾延迟。
            this.wsServer.send(ws, {
              type: 'chat_response_chunk',
              payload: { text: fragment, done: false },
              sessionId: msg.sessionId,
              meta: this.childMeta(msg, 'chat.stream.chunk'),
            });
          },
          systemPrompt,
          cts.token,
        );

        // 结束采集：记录最终响应
        this.llmCollector.addMessage(collectId, 'assistant', fullText);
        this.llmCollector.endRequest(collectId, fullText);
        const llmDetail = this.llmCollector.getDetail(collectId);

        this.wsServer.send(ws, {
          type: 'chat_response_end',
          payload: { fullText, llmDetail },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, 'chat.stream.end'),
        });

        // 异步生成智能跟进建议（不阻塞主响应）
        const chatPayloadForSuggestions = msg.payload as {
          text?: string;
          context?: { url?: string; title?: string };
        };
        this.generateFollowUpSuggestions(
          ws,
          msg,
          text,
          fullText,
          chatPayloadForSuggestions?.context,
        );
      } catch (err) {
        const isCancelled = cts.token.isCancellationRequested;
        const errMsg = isCancelled ? '' : (err instanceof Error ? err.message : String(err));

        // 结束采集：记录错误
        this.llmCollector.endRequest(
          collectId,
          '',
          isCancelled ? undefined : errMsg,
          isCancelled,
        );

        this.wsServer.send(ws, {
          type: 'chat_response_end',
          payload: {
            fullText: isCancelled
              ? ''
              : `错误: ${errMsg}`,
            cancelled: isCancelled,
          },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, isCancelled ? 'chat.stream.cancelled' : 'chat.stream.error'),
        });
        if (!isCancelled) {
          this.outputChannel.appendLine(
            `[BrowserAgent] chat 流式响应错误: ${errMsg}`,
          );
        }
      } finally {
        this.activeChatTokens.delete(ws);
        cts.dispose();
      }
    })();
  }

  /**
   * 处理 cancel_chat：中断当前流式生成
   */
  private handleCancelChat(ws: WebSocket): void {
    const cts = this.activeChatTokens.get(ws);
    if (cts) {
      cts.cancel();
      this.outputChannel.appendLine('[BrowserAgent] 收到 cancel_chat，已中断流式生成');
    } else {
      this.outputChannel.appendLine('[BrowserAgent] 收到 cancel_chat，但无活跃的流式请求');
    }
  }

  /**
   * 处理 skill_list：返回所有可用 Skill 列表 + 预设演示场景（供 Chrome Skill 面板展示）
   */
  private handleSkillList(ws: WebSocket, msg: BridgeMessage): void {
    if (!this.skillRegistry) {
      this.wsServer.send(ws, {
        type: 'skill_list_result',
        payload: { skills: [], scenarios: [] },
        sessionId: msg.sessionId,
        meta: this.childMeta(msg, 'skill.list.result'),
      });
      this.outputChannel.appendLine(
        '[BrowserAgent] skill_list 请求但 SkillRegistry 未初始化',
      );
      return;
    }

    const skills = this.skillRegistry.getAll();
    const scenarios = this.skillRegistry.getScenarios();
    this.wsServer.send(ws, {
      type: 'skill_list_result',
      payload: { skills, scenarios },
      sessionId: msg.sessionId,
      meta: this.childMeta(msg, 'skill.list.result'),
    });
    this.outputChannel.appendLine(
      `[BrowserAgent] 已返回 ${skills.length} 个 Skill, ${scenarios.length} 个预设场景`,
    );
  }

  /**
   * 处理 skill_execute：执行指定 Skill，通过 skill_progress 实时推送进度，
   * 完成后发送 skill_complete
   */
  private handleSkillExecute(ws: WebSocket, msg: BridgeMessage): void {
    const payload = msg.payload as {
      skillName?: string;
      params?: Record<string, string>;
      targetTabId?: number;
      targetUrl?: string;
    };
    const skillName = payload?.skillName ?? '';
    const params = payload?.params ?? {};
    const targetTabId = payload?.targetTabId;
    const targetUrl = payload?.targetUrl ?? '';

    if (!this.skillRegistry || !this.skillRunner) {
      this.wsServer.send(ws, {
        type: 'skill_complete',
        payload: {
          skillName,
          success: false,
          summary: 'Skill 系统未初始化',
        },
        sessionId: msg.sessionId,
        meta: this.childMeta(msg, 'skill.complete'),
      });
      this.outputChannel.appendLine(
        '[BrowserAgent] skill_execute 请求但 SkillRegistry/SkillRunner 未初始化',
      );
      return;
    }

    const skill = this.skillRegistry.getByName(skillName);
    if (!skill) {
      this.wsServer.send(ws, {
        type: 'skill_complete',
        payload: {
          skillName,
          success: false,
          summary: `未找到 Skill: ${skillName}`,
        },
        sessionId: msg.sessionId,
        meta: this.childMeta(msg, 'skill.complete'),
      });
      this.outputChannel.appendLine(
        `[BrowserAgent] skill_execute 未找到 Skill: ${skillName}`,
      );
      return;
    }

    this.outputChannel.appendLine(
      `[BrowserAgent] 开始执行 Skill: ${skillName}, 参数: ${JSON.stringify(params)}${targetTabId !== undefined ? `, targetTabId: ${targetTabId}` : ''}${targetUrl ? `, targetUrl: ${targetUrl}` : ''}`,
    );

    // 异步执行，通过 skill_progress 实时推送进度
    void (async () => {
      try {
        // 预设场景：如果 targetUrl 不为空，先自动导航到目标页面
        if (targetUrl && this.skillRunner) {
          this.outputChannel.appendLine(
            `[BrowserAgent] 场景执行：自动导航到 targetUrl=${targetUrl}`,
          );
          const navOk = await this.skillRunner.navigateToTargetUrl(
            targetUrl,
            targetTabId,
          );
          if (navOk) {
            this.outputChannel.appendLine(
              `[BrowserAgent] 自动导航成功: ${targetUrl}`,
            );
          } else {
            this.outputChannel.appendLine(
              `[BrowserAgent] 自动导航失败，降级为直接执行 Skill 步骤: ${targetUrl}`,
            );
          }
        }

        const result = await this.skillRunner!.execute(
          skill,
          params,
          (progress) => {
            // 每步进度推送 skill_progress 消息 → Chrome UI（含 debug 增强字段）
            this.wsServer.send(ws, {
              type: 'skill_progress',
              payload: {
                skillName,
                displayName: skill.displayName,
                stepIndex: progress.stepIndex,
                totalSteps: progress.totalSteps,
                status: progress.status,
                description: progress.description,
                result: progress.result,
                // debug 增强字段（可选）
                ...(progress.toolName !== undefined ? { toolName: progress.toolName } : {}),
                ...(progress.resolvedArgs !== undefined ? { resolvedArgs: progress.resolvedArgs } : {}),
                ...(progress.durationMs !== undefined ? { durationMs: progress.durationMs } : {}),
              },
              sessionId: msg.sessionId,
              meta: this.childMeta(msg, 'skill.progress'),
            });
          },
          undefined, // token
          targetTabId,
        );

        // 执行完成，发送 skill_complete
        this.wsServer.send(ws, {
          type: 'skill_complete',
          payload: {
            skillName,
            success: result.success,
            summary: result.summary,
          },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, 'skill.complete'),
        });

        this.outputChannel.appendLine(
          `[BrowserAgent] Skill "${skillName}" 执行${result.success ? '成功' : '失败'}: ${result.stepResults.length} 步`,
        );
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        this.wsServer.send(ws, {
          type: 'skill_complete',
          payload: {
            skillName,
            success: false,
            summary: `执行异常: ${errMsg}`,
          },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, 'skill.complete'),
        });
        this.outputChannel.appendLine(
          `[BrowserAgent] Skill "${skillName}" 执行异常: ${errMsg}`,
        );
      }
    })();
  }

  /**
   * 异步生成智能跟进建议（2-3 条上下文相关的后续问题/操作建议）
   * 在 AI 回复完成后调用，不阻塞主响应，失败时静默忽略
   */
  private generateFollowUpSuggestions(
    ws: WebSocket,
    msg: BridgeMessage,
    userMessage: string,
    assistantResponse: string,
    context?: { url?: string; title?: string },
  ): void {
    // 空回复或取消场景不生成建议
    if (!assistantResponse || assistantResponse.length < 10) return;

    void (async () => {
      try {
        const contextHint = context?.url
          ? `\n用户当前页面: ${context.url}${context.title ? ` (${context.title})` : ''}`
          : '';

        const prompt = `基于以下对话，生成 2-3 个简短的跟进建议（每个不超过 20 个字）。建议应与对话上下文和页面内容相关，帮助用户继续探索或深入了解。${contextHint}

用户消息: ${userMessage.slice(0, 500)}

AI 回复摘要: ${assistantResponse.slice(0, 800)}

请直接输出 JSON 数组格式，不要任何解释。示例: ["深入分析性能瓶颈","查看相关API文档","对比其他方案"]`;

        const result = await this.lmService.sendMessage(prompt);

        // 解析 JSON 数组
        const jsonMatch = result.match(/\[[\s\S]*?\]/);
        if (!jsonMatch) {
          this.outputChannel.appendLine(
            '[BrowserAgent] 跟进建议解析失败：未找到 JSON 数组',
          );
          return;
        }

        const suggestions: string[] = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(suggestions) || suggestions.length === 0) return;

        // 截取前 3 条，过滤空串和过长建议
        const filtered = suggestions
          .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
          .map((s) => s.trim().slice(0, 50))
          .slice(0, 3);

        if (filtered.length === 0) return;

        this.wsServer.send(ws, {
          type: 'follow_up_suggestions',
          payload: { suggestions: filtered },
          sessionId: msg.sessionId,
          meta: this.childMeta(msg, 'follow_up.suggestions'),
        });

        this.outputChannel.appendLine(
          `[BrowserAgent] 已发送 ${filtered.length} 条跟进建议`,
        );
      } catch (err) {
        // 跟进建议生成失败不影响主流程，静默记录日志
        this.outputChannel.appendLine(
          `[BrowserAgent] 跟进建议生成失败 (非阻塞): ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    })();
  }

  /**
   * 获取 LLM 请求采集器实例（供外部读取请求细节）
   */
  getLlmCollector(): LlmRequestCollector {
    return this.llmCollector;
  }

  /**
   * 释放 MessageHandler：
   * - 取消并 dispose 所有 activeChatTokens
   * - dispose llmCollector
   * - 设置 _disposed 标志，后续 handle() 调用直接跳过
   */
  dispose(): void {
    this._disposed = true;

    // 清理所有活跃的 CancellationTokenSource
    for (const [, cts] of this.activeChatTokens) {
      cts.cancel();
      cts.dispose();
    }
    this.activeChatTokens.clear();

    // 释放采集器
    this.llmCollector.dispose();

    this.outputChannel.appendLine('[BrowserAgent] MessageHandler disposed');
  }

  /**
   * 根据浏览器上下文动态构建 system prompt（带上下文预算控制）
   *
   * 分层截断策略：
   *   1. 每个字段独立截断（url → MAX_URL_CHARS, title → MAX_TITLE_CHARS, selectedText → MAX_SELECTED_TEXT_CHARS）
   *   2. 拼接后的上下文部分总量不超过 MAX_SYSTEM_PROMPT_CONTEXT_CHARS
   *   3. 日志输出上下文字符数 + token 估算值
   */
  private buildSystemPrompt(
    context?: { url?: string; title?: string; selectedText?: string },
  ): string {
    const basePrompt = 'You are a helpful browser agent assistant. Answer concisely.';

    if (!context) {
      return basePrompt;
    }

    // ── 1. 字段级截断 ──────────────────────────────────────
    const url = context.url ? smartTruncate(context.url, MAX_URL_CHARS) : '';
    const title = context.title ? smartTruncate(context.title, MAX_TITLE_CHARS) : '';
    const selectedText = context.selectedText
      ? smartTruncate(context.selectedText, MAX_SELECTED_TEXT_CHARS)
      : '';

    // ── 2. 拼接上下文片段 ──────────────────────────────────
    const contextParts: string[] = [];
    if (url) {
      contextParts.push(`用户正在浏览 ${url}${title ? ` (${title})` : ''}`);
    }
    if (selectedText) {
      contextParts.push(`用户选中了以下文本:\n"""\n${selectedText}\n"""`);
    }

    if (contextParts.length === 0) {
      return basePrompt;
    }

    let contextSection = contextParts.join('\n');

    // ── 3. 总量预算控制 ────────────────────────────────────
    if (contextSection.length > MAX_SYSTEM_PROMPT_CONTEXT_CHARS) {
      contextSection = smartTruncate(contextSection, MAX_SYSTEM_PROMPT_CONTEXT_CHARS);
    }

    const systemPrompt = basePrompt + '\n\n当前浏览器上下文:\n' + contextSection;

    // ── 4. 日志：上下文字符数 + token 估算 ─────────────────
    const contextChars = contextSection.length;
    const contextTokensEstimate = estimateTokens(contextSection);
    const totalChars = systemPrompt.length;
    const totalTokensEstimate = estimateTokens(systemPrompt);

    this.outputChannel.appendLine(
      `[BrowserAgent][ContextBudget] system prompt 上下文: ${contextChars} 字符 (~${contextTokensEstimate} tokens), ` +
      `总 prompt: ${totalChars} 字符 (~${totalTokensEstimate} tokens), ` +
      `预算上限: ${MAX_SYSTEM_PROMPT_CONTEXT_CHARS} 字符`,
    );

    return systemPrompt;
  }
}
