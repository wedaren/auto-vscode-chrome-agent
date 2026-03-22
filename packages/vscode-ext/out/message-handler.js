"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
// message-handler.ts — WebSocket 消息路由类，封装所有消息处理逻辑
// 职责：list_models / select_model / chat / cancel_chat 消息路由、
//       浏览器上下文→system prompt 构建、CancellationToken 生命周期管理、
//       McpClient 或 BrowserToolProvider 可用时自动切换为 AgentLoop（agent_step/agent_complete 推送）
const vscode = __importStar(require("vscode"));
const agent_loop_1 = require("./agent-loop");
const agent_tree_1 = require("./agent-tree");
const llm_request_collector_1 = require("./llm-request-collector");
const context_budget_1 = require("./context-budget");
/**
 * MessageHandler 封装所有 WebSocket 消息的处理逻辑。
 * 由 extension.ts 创建并注册到 WsServer.onMessage()。
 *
 * 当 McpClient 或 BrowserToolProvider 可用时，handleChat 使用 AgentLoop.run() 进行 ReAct 循环，
 * 每步通过 agent_step 消息实时推送，循环结束发送 agent_complete。
 * 只要 Chrome 有 WebSocket 连接就有原生浏览器工具可用，无需 MCP 也能进入 Agent 模式。
 * 当两者都不可用时，保持原有 LM 流式对话行为。
 */
class MessageHandler {
    lmService;
    wsServer;
    mcpClient;
    browserToolProvider;
    skillRegistry;
    skillRunner;
    outputChannel;
    /** LLM 请求细节采集器，记录每次 chat/agent 请求的完整链路数据 */
    llmCollector = new llm_request_collector_1.LlmRequestCollector();
    /** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
    activeChatTokens = new Map();
    /** 已注册 close 监听的 WebSocket 集合，避免重复注册 */
    wsCloseRegistered = new WeakSet();
    /** disposed 标志：dispose 后拒绝新增 activeChatTokens 条目 */
    _disposed = false;
    /** list_models 节流：最小间隔 5 秒，防止高频请求压垮 vscode.lm API */
    static LIST_MODELS_THROTTLE_MS = 5000;
    /** 上次成功处理 list_models 的时间戳（Date.now()） */
    _lastListModelsTime = 0;
    /** list_models 缓存结果，节流期间直接返回 */
    _cachedModelsList = null;
    constructor(lmService, wsServer, mcpClient, outputChannel, browserToolProvider, skillRegistry, skillRunner) {
        this.lmService = lmService;
        this.wsServer = wsServer;
        this.mcpClient = mcpClient;
        this.outputChannel = outputChannel;
        this.browserToolProvider = browserToolProvider;
        this.skillRegistry = skillRegistry;
        this.skillRunner = skillRunner;
    }
    /**
     * 注册 WebSocket close 事件监听器（每个 ws 只注册一次），
     * 断开时自动 cancel + dispose 对应 CTS 并从 Map 中删除，防止内存泄漏。
     */
    ensureWsCloseHandler(ws) {
        if (this.wsCloseRegistered.has(ws)) {
            return;
        }
        this.wsCloseRegistered.add(ws);
        ws.on('close', () => {
            const cts = this.activeChatTokens.get(ws);
            if (cts) {
                this.outputChannel.appendLine('[BrowserAgent] WebSocket 断开，自动取消并清理 CancellationTokenSource');
                cts.cancel();
                cts.dispose();
                this.activeChatTokens.delete(ws);
            }
        });
    }
    /**
     * 若同一 WebSocket 上已有活跃的 CTS（如快速重发 chat），先取消并释放旧的。
     */
    disposeExistingCts(ws) {
        const oldCts = this.activeChatTokens.get(ws);
        if (oldCts) {
            this.outputChannel.appendLine('[BrowserAgent] 同一 WebSocket 重发 chat，取消并清理旧 CancellationTokenSource');
            oldCts.cancel();
            oldCts.dispose();
            this.activeChatTokens.delete(ws);
        }
    }
    /**
     * 消息路由入口，根据 msg.type 分发到对应处理方法。
     * 应注册到 wsServer.onMessage()。
     */
    handle(ws, msg) {
        // disposal guard：dispose 后拒绝处理新消息
        if (this._disposed) {
            this.outputChannel.appendLine(`[BrowserAgent] MessageHandler 已 disposed，忽略消息 type=${msg.type}`);
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
            default:
                this.outputChannel.appendLine(`[BrowserAgent] 未处理的消息类型: ${msg.type}`);
                break;
        }
    }
    /**
     * 处理 list_models：返回可用模型列表（带节流防护）
     * 5 秒内的重复请求直接返回缓存结果，避免高频调用 vscode.lm API 导致 Extension Host 卡死。
     */
    handleListModels(ws, msg) {
        const now = Date.now();
        const elapsed = now - this._lastListModelsTime;
        // 节流：5 秒内重复请求直接返回缓存
        if (elapsed < MessageHandler.LIST_MODELS_THROTTLE_MS && this._cachedModelsList !== null) {
            this.outputChannel.appendLine(`[BrowserAgent] list_models 节流：距上次 ${elapsed}ms < ${MessageHandler.LIST_MODELS_THROTTLE_MS}ms，返回缓存 (${this._cachedModelsList.length} 个模型)`);
            const prefs = this.lmService.getModelPreferences();
            this.wsServer.send(ws, {
                type: 'models_list',
                payload: {
                    models: this._cachedModelsList,
                    defaultModelId: prefs.defaultModelId || undefined,
                    maxVisibleModels: prefs.maxVisibleModels,
                },
                sessionId: msg.sessionId,
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
                });
                this.outputChannel.appendLine(`[BrowserAgent] 已返回 ${models.length} 个模型信息`);
            }
            catch (err) {
                this.outputChannel.appendLine(`[BrowserAgent] list_models 失败: ${err instanceof Error ? err.message : String(err)}`);
            }
        })();
    }
    /**
     * 处理 select_model：选择指定模型
     */
    handleSelectModel(ws, msg) {
        void (async () => {
            try {
                const { modelId } = msg.payload;
                const success = await this.lmService.selectModelById(modelId);
                this.wsServer.send(ws, {
                    type: 'model_selected',
                    payload: { success, modelId },
                    sessionId: msg.sessionId,
                });
                this.outputChannel.appendLine(`[BrowserAgent] select_model modelId=${modelId} 结果: ${success ? '成功' : '未找到'}`);
            }
            catch (err) {
                this.outputChannel.appendLine(`[BrowserAgent] select_model 失败: ${err instanceof Error ? err.message : String(err)}`);
                this.wsServer.send(ws, {
                    type: 'model_selected',
                    payload: { success: false, modelId: '' },
                    sessionId: msg.sessionId,
                });
            }
        })();
    }
    /**
     * 处理 chat：根据工具可用性选择路径
     * - McpClient 已连接 或 BrowserToolProvider 有已连接客户端 → AgentLoop 模式（agent_step / agent_complete）
     * - 两者都不可用 → 原有 LM 流式对话模式（chat_response_chunk / chat_response_end）
     */
    handleChat(ws, msg) {
        const chatPayload = msg.payload;
        const text = chatPayload?.text ?? '';
        const context = chatPayload?.context;
        const systemPrompt = this.buildSystemPrompt(context);
        this.outputChannel.appendLine(`[BrowserAgent] chat 收到消息，context: url=${context?.url ?? '无'}, title=${context?.title ?? '无'}, selectedText=${context?.selectedText ? `${context.selectedText.length}字` : '无'}`);
        // 只要 MCP 或原生浏览器工具任一可用，就进入 Agent 模式
        const hasToolSource = this.mcpClient.connected || this.browserToolProvider.connected;
        if (hasToolSource) {
            this.handleChatAgentMode(ws, msg, text, systemPrompt);
        }
        else {
            this.handleChatStreamMode(ws, msg, text, systemPrompt);
        }
    }
    /**
     * Agent 模式：McpClient 或 BrowserToolProvider 可用时使用 AgentLoop.run() 进行 ReAct 循环
     * 每步通过 agent_step 实时推送，循环结束发送 agent_complete
     */
    handleChatAgentMode(ws, msg, text, systemPrompt) {
        const mcpOk = this.mcpClient.connected;
        const browserOk = this.browserToolProvider.connected;
        this.outputChannel.appendLine(`[BrowserAgent] 进入 AgentLoop 模式 (MCP=${mcpOk ? '已连接' : '未连接'}, BrowserTools=${browserOk ? '已连接' : '未连接'})`);
        void (async () => {
            // WebSocket 断开时自动清理 CTS，防止泄漏
            this.ensureWsCloseHandler(ws);
            // 同一 ws 快速重发 chat 时先 dispose 旧 CTS
            this.disposeExistingCts(ws);
            const cts = new vscode.CancellationTokenSource();
            this.activeChatTokens.set(ws, cts);
            // 注册到 Agent 循环 TreeView（实时可视化）
            const runId = (0, agent_tree_1.startAgentRun)(text);
            // 采集 LLM 请求细节
            const modelInfo = this.lmService.currentModel;
            const collectId = this.llmCollector.startRequest('agent', modelInfo?.name ?? modelInfo?.id ?? 'unknown', systemPrompt);
            this.llmCollector.addMessage(collectId, 'user', text);
            try {
                const agentLoop = new agent_loop_1.AgentLoop(this.lmService, this.mcpClient, this.outputChannel, this.browserToolProvider, this.skillRegistry, this.skillRunner);
                const result = await agentLoop.run(text, {
                    systemPrompt,
                    onStep: (step) => {
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
                        });
                        // 同步追加到 Agent 循环 TreeView（→ VSCode 调试面板）
                        (0, agent_tree_1.addAgentStep)(runId, step);
                        // 采集 Agent 步骤
                        this.llmCollector.addAgentStep(collectId, {
                            step: step.step,
                            type: step.type,
                            content: step.content,
                            toolName: step.toolName,
                            toolArgs: step.toolArgs,
                        });
                    },
                }, cts.token);
                // AgentLoop 完成，标记运行结束
                (0, agent_tree_1.completeAgentRun)(runId, 'completed');
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
                });
                this.outputChannel.appendLine(`[BrowserAgent] AgentLoop 完成: ${result.totalSteps} 步, 答案长度 ${result.finalAnswer.length}`);
            }
            catch (err) {
                const isCancelled = cts.token.isCancellationRequested;
                if (isCancelled) {
                    // 被取消时标记为 cancelled
                    (0, agent_tree_1.completeAgentRun)(runId, 'cancelled');
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
                    });
                    this.outputChannel.appendLine('[BrowserAgent] AgentLoop 被用户取消');
                }
                else {
                    // 错误时标记为 error
                    const errMsg = err instanceof Error ? err.message : String(err);
                    (0, agent_tree_1.completeAgentRun)(runId, 'error', errMsg);
                    this.llmCollector.endRequest(collectId, '', errMsg);
                    this.wsServer.send(ws, {
                        type: 'agent_complete',
                        payload: {
                            finalAnswer: `错误: ${errMsg}`,
                            steps: [],
                            totalSteps: 0,
                        },
                        sessionId: msg.sessionId,
                    });
                    this.outputChannel.appendLine(`[BrowserAgent] AgentLoop 错误: ${errMsg}`);
                }
            }
            finally {
                this.activeChatTokens.delete(ws);
                cts.dispose();
            }
        })();
    }
    /**
     * 流式模式：McpClient 未连接时保持原有 LM 直接流式对话
     */
    handleChatStreamMode(ws, msg, text, systemPrompt) {
        this.outputChannel.appendLine('[BrowserAgent] McpClient 未连接，使用流式 LM 对话模式');
        void (async () => {
            // WebSocket 断开时自动清理 CTS，防止泄漏
            this.ensureWsCloseHandler(ws);
            // 同一 ws 快速重发 chat 时先 dispose 旧 CTS
            this.disposeExistingCts(ws);
            const cts = new vscode.CancellationTokenSource();
            this.activeChatTokens.set(ws, cts);
            // 采集 LLM 请求细节
            const modelInfo = this.lmService.currentModel;
            const collectId = this.llmCollector.startRequest('stream', modelInfo?.name ?? modelInfo?.id ?? 'unknown', systemPrompt);
            this.llmCollector.addMessage(collectId, 'user', text);
            try {
                const fullText = await this.lmService.sendMessageStreaming(text, (fragment) => {
                    this.wsServer.send(ws, {
                        type: 'chat_response_chunk',
                        payload: { text: fragment, done: false },
                        sessionId: msg.sessionId,
                    });
                }, systemPrompt, cts.token);
                // 结束采集：记录最终响应
                this.llmCollector.addMessage(collectId, 'assistant', fullText);
                this.llmCollector.endRequest(collectId, fullText);
                const llmDetail = this.llmCollector.getDetail(collectId);
                this.wsServer.send(ws, {
                    type: 'chat_response_end',
                    payload: { fullText, llmDetail },
                    sessionId: msg.sessionId,
                });
            }
            catch (err) {
                const isCancelled = cts.token.isCancellationRequested;
                const errMsg = isCancelled ? '' : (err instanceof Error ? err.message : String(err));
                // 结束采集：记录错误
                this.llmCollector.endRequest(collectId, '', isCancelled ? undefined : errMsg, isCancelled);
                this.wsServer.send(ws, {
                    type: 'chat_response_end',
                    payload: {
                        fullText: isCancelled
                            ? ''
                            : `错误: ${errMsg}`,
                        cancelled: isCancelled,
                    },
                    sessionId: msg.sessionId,
                });
                if (!isCancelled) {
                    this.outputChannel.appendLine(`[BrowserAgent] chat 流式响应错误: ${errMsg}`);
                }
            }
            finally {
                this.activeChatTokens.delete(ws);
                cts.dispose();
            }
        })();
    }
    /**
     * 处理 cancel_chat：中断当前流式生成
     */
    handleCancelChat(ws) {
        const cts = this.activeChatTokens.get(ws);
        if (cts) {
            cts.cancel();
            this.outputChannel.appendLine('[BrowserAgent] 收到 cancel_chat，已中断流式生成');
        }
        else {
            this.outputChannel.appendLine('[BrowserAgent] 收到 cancel_chat，但无活跃的流式请求');
        }
    }
    /**
     * 处理 skill_list：返回所有可用 Skill 列表 + 预设演示场景（供 Chrome Skill 面板展示）
     */
    handleSkillList(ws, msg) {
        if (!this.skillRegistry) {
            this.wsServer.send(ws, {
                type: 'skill_list_result',
                payload: { skills: [], scenarios: [] },
                sessionId: msg.sessionId,
            });
            this.outputChannel.appendLine('[BrowserAgent] skill_list 请求但 SkillRegistry 未初始化');
            return;
        }
        const skills = this.skillRegistry.getAll();
        const scenarios = this.skillRegistry.getScenarios();
        this.wsServer.send(ws, {
            type: 'skill_list_result',
            payload: { skills, scenarios },
            sessionId: msg.sessionId,
        });
        this.outputChannel.appendLine(`[BrowserAgent] 已返回 ${skills.length} 个 Skill, ${scenarios.length} 个预设场景`);
    }
    /**
     * 处理 skill_execute：执行指定 Skill，通过 skill_progress 实时推送进度，
     * 完成后发送 skill_complete
     */
    handleSkillExecute(ws, msg) {
        const payload = msg.payload;
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
            });
            this.outputChannel.appendLine('[BrowserAgent] skill_execute 请求但 SkillRegistry/SkillRunner 未初始化');
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
            });
            this.outputChannel.appendLine(`[BrowserAgent] skill_execute 未找到 Skill: ${skillName}`);
            return;
        }
        this.outputChannel.appendLine(`[BrowserAgent] 开始执行 Skill: ${skillName}, 参数: ${JSON.stringify(params)}${targetTabId !== undefined ? `, targetTabId: ${targetTabId}` : ''}${targetUrl ? `, targetUrl: ${targetUrl}` : ''}`);
        // 异步执行，通过 skill_progress 实时推送进度
        void (async () => {
            try {
                // 预设场景：如果 targetUrl 不为空，先自动导航到目标页面
                if (targetUrl && this.skillRunner) {
                    this.outputChannel.appendLine(`[BrowserAgent] 场景执行：自动导航到 targetUrl=${targetUrl}`);
                    const navOk = await this.skillRunner.navigateToTargetUrl(targetUrl, targetTabId);
                    if (navOk) {
                        this.outputChannel.appendLine(`[BrowserAgent] 自动导航成功: ${targetUrl}`);
                    }
                    else {
                        this.outputChannel.appendLine(`[BrowserAgent] 自动导航失败，降级为直接执行 Skill 步骤: ${targetUrl}`);
                    }
                }
                const result = await this.skillRunner.execute(skill, params, (progress) => {
                    // 每步进度推送 skill_progress 消息 → Chrome UI
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
                        },
                        sessionId: msg.sessionId,
                    });
                }, undefined, // token
                targetTabId);
                // 执行完成，发送 skill_complete
                this.wsServer.send(ws, {
                    type: 'skill_complete',
                    payload: {
                        skillName,
                        success: result.success,
                        summary: result.summary,
                    },
                    sessionId: msg.sessionId,
                });
                this.outputChannel.appendLine(`[BrowserAgent] Skill "${skillName}" 执行${result.success ? '成功' : '失败'}: ${result.stepResults.length} 步`);
            }
            catch (err) {
                const errMsg = err instanceof Error ? err.message : String(err);
                this.wsServer.send(ws, {
                    type: 'skill_complete',
                    payload: {
                        skillName,
                        success: false,
                        summary: `执行异常: ${errMsg}`,
                    },
                    sessionId: msg.sessionId,
                });
                this.outputChannel.appendLine(`[BrowserAgent] Skill "${skillName}" 执行异常: ${errMsg}`);
            }
        })();
    }
    /**
     * 获取 LLM 请求采集器实例（供外部读取请求细节）
     */
    getLlmCollector() {
        return this.llmCollector;
    }
    /**
     * 释放 MessageHandler：
     * - 取消并 dispose 所有 activeChatTokens
     * - dispose llmCollector
     * - 设置 _disposed 标志，后续 handle() 调用直接跳过
     */
    dispose() {
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
    buildSystemPrompt(context) {
        const basePrompt = 'You are a helpful browser agent assistant. Answer concisely.';
        if (!context) {
            return basePrompt;
        }
        // ── 1. 字段级截断 ──────────────────────────────────────
        const url = context.url ? (0, context_budget_1.smartTruncate)(context.url, context_budget_1.MAX_URL_CHARS) : '';
        const title = context.title ? (0, context_budget_1.smartTruncate)(context.title, context_budget_1.MAX_TITLE_CHARS) : '';
        const selectedText = context.selectedText
            ? (0, context_budget_1.smartTruncate)(context.selectedText, context_budget_1.MAX_SELECTED_TEXT_CHARS)
            : '';
        // ── 2. 拼接上下文片段 ──────────────────────────────────
        const contextParts = [];
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
        if (contextSection.length > context_budget_1.MAX_SYSTEM_PROMPT_CONTEXT_CHARS) {
            contextSection = (0, context_budget_1.smartTruncate)(contextSection, context_budget_1.MAX_SYSTEM_PROMPT_CONTEXT_CHARS);
        }
        const systemPrompt = basePrompt + '\n\n当前浏览器上下文:\n' + contextSection;
        // ── 4. 日志：上下文字符数 + token 估算 ─────────────────
        const contextChars = contextSection.length;
        const contextTokensEstimate = (0, context_budget_1.estimateTokens)(contextSection);
        const totalChars = systemPrompt.length;
        const totalTokensEstimate = (0, context_budget_1.estimateTokens)(systemPrompt);
        this.outputChannel.appendLine(`[BrowserAgent][ContextBudget] system prompt 上下文: ${contextChars} 字符 (~${contextTokensEstimate} tokens), ` +
            `总 prompt: ${totalChars} 字符 (~${totalTokensEstimate} tokens), ` +
            `预算上限: ${context_budget_1.MAX_SYSTEM_PROMPT_CONTEXT_CHARS} 字符`);
        return systemPrompt;
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=message-handler.js.map