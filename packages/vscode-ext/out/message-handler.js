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
    outputChannel;
    /** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
    activeChatTokens = new Map();
    constructor(lmService, wsServer, mcpClient, outputChannel, browserToolProvider) {
        this.lmService = lmService;
        this.wsServer = wsServer;
        this.mcpClient = mcpClient;
        this.outputChannel = outputChannel;
        this.browserToolProvider = browserToolProvider;
    }
    /**
     * 消息路由入口，根据 msg.type 分发到对应处理方法。
     * 应注册到 wsServer.onMessage()。
     */
    handle(ws, msg) {
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
            default:
                this.outputChannel.appendLine(`[BrowserAgent] 未处理的消息类型: ${msg.type}`);
                break;
        }
    }
    /**
     * 处理 list_models：返回可用模型列表
     */
    handleListModels(ws, msg) {
        void (async () => {
            try {
                const models = await this.lmService.listModels();
                this.wsServer.send(ws, {
                    type: 'models_list',
                    payload: { models },
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
            const cts = new vscode.CancellationTokenSource();
            this.activeChatTokens.set(ws, cts);
            // 注册到 Agent 循环 TreeView（实时可视化）
            const runId = (0, agent_tree_1.startAgentRun)(text);
            try {
                const agentLoop = new agent_loop_1.AgentLoop(this.lmService, this.mcpClient, this.outputChannel, this.browserToolProvider);
                const result = await agentLoop.run(text, {
                    systemPrompt,
                    onStep: (step) => {
                        // 每个 AgentStep 实时推送 agent_step 消息（→ Chrome UI）
                        this.wsServer.send(ws, {
                            type: 'agent_step',
                            payload: {
                                step: step.step,
                                type: step.type,
                                content: step.content,
                                toolName: step.toolName,
                                toolArgs: step.toolArgs,
                            },
                            sessionId: msg.sessionId,
                        });
                        // 同步追加到 Agent 循环 TreeView（→ VSCode 调试面板）
                        (0, agent_tree_1.addAgentStep)(runId, step);
                    },
                }, cts.token);
                // AgentLoop 完成，标记运行结束
                (0, agent_tree_1.completeAgentRun)(runId, 'completed');
                // 发送 agent_complete 消息
                this.wsServer.send(ws, {
                    type: 'agent_complete',
                    payload: {
                        finalAnswer: result.finalAnswer,
                        steps: result.steps,
                        totalSteps: result.totalSteps,
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
            const cts = new vscode.CancellationTokenSource();
            this.activeChatTokens.set(ws, cts);
            try {
                const fullText = await this.lmService.sendMessageStreaming(text, (fragment) => {
                    this.wsServer.send(ws, {
                        type: 'chat_response_chunk',
                        payload: { text: fragment, done: false },
                        sessionId: msg.sessionId,
                    });
                }, systemPrompt, cts.token);
                this.wsServer.send(ws, {
                    type: 'chat_response_end',
                    payload: { fullText },
                    sessionId: msg.sessionId,
                });
            }
            catch (err) {
                const isCancelled = cts.token.isCancellationRequested;
                this.wsServer.send(ws, {
                    type: 'chat_response_end',
                    payload: {
                        fullText: isCancelled
                            ? ''
                            : `错误: ${err instanceof Error ? err.message : String(err)}`,
                        cancelled: isCancelled,
                    },
                    sessionId: msg.sessionId,
                });
                if (!isCancelled) {
                    this.outputChannel.appendLine(`[BrowserAgent] chat 流式响应错误: ${err instanceof Error ? err.message : String(err)}`);
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
     * 根据浏览器上下文动态构建 system prompt
     */
    buildSystemPrompt(context) {
        let systemPrompt = 'You are a helpful browser agent assistant. Answer concisely.';
        if (context) {
            const contextParts = [];
            if (context.url) {
                contextParts.push(`用户正在浏览 ${context.url}${context.title ? ` (${context.title})` : ''}`);
            }
            if (context.selectedText) {
                contextParts.push(`用户选中了以下文本:\n"""\n${context.selectedText}\n"""`);
            }
            if (contextParts.length > 0) {
                systemPrompt += '\n\n当前浏览器上下文:\n' + contextParts.join('\n');
            }
        }
        return systemPrompt;
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=message-handler.js.map