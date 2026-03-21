// message-handler.ts — WebSocket 消息路由类，封装所有消息处理逻辑
// 职责：list_models / select_model / chat / cancel_chat 消息路由、
//       浏览器上下文→system prompt 构建、CancellationToken 生命周期管理、
//       McpClient 已连接时自动切换为 AgentLoop（agent_step/agent_complete 推送）
import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import { LmService } from './lm-service';
import { WsServer, BridgeMessage } from './ws-server';
import { McpClient } from './mcp-client';
import { AgentLoop, AgentStep } from './agent-loop';

/**
 * MessageHandler 封装所有 WebSocket 消息的处理逻辑。
 * 由 extension.ts 创建并注册到 WsServer.onMessage()。
 *
 * 当 McpClient 已连接时，handleChat 使用 AgentLoop.run() 进行 ReAct 循环，
 * 每步通过 agent_step 消息实时推送，循环结束发送 agent_complete。
 * 当 McpClient 未连接时，保持原有 LM 流式对话行为。
 */
export class MessageHandler {
  private readonly lmService: LmService;
  private readonly wsServer: WsServer;
  private readonly mcpClient: McpClient;
  private readonly outputChannel: vscode.OutputChannel;

  /** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
  private readonly activeChatTokens = new Map<WebSocket, vscode.CancellationTokenSource>();

  constructor(
    lmService: LmService,
    wsServer: WsServer,
    mcpClient: McpClient,
    outputChannel: vscode.OutputChannel,
  ) {
    this.lmService = lmService;
    this.wsServer = wsServer;
    this.mcpClient = mcpClient;
    this.outputChannel = outputChannel;
  }

  /**
   * 消息路由入口，根据 msg.type 分发到对应处理方法。
   * 应注册到 wsServer.onMessage()。
   */
  handle(ws: WebSocket, msg: BridgeMessage): void {
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
        this.outputChannel.appendLine(
          `[BrowserAgent] 未处理的消息类型: ${msg.type}`,
        );
        break;
    }
  }

  /**
   * 处理 list_models：返回可用模型列表
   */
  private handleListModels(ws: WebSocket, msg: BridgeMessage): void {
    void (async () => {
      try {
        const models = await this.lmService.listModels();
        this.wsServer.send(ws, {
          type: 'models_list',
          payload: { models },
          sessionId: msg.sessionId,
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
        });
      }
    })();
  }

  /**
   * 处理 chat：根据 McpClient 连接状态选择路径
   * - McpClient 已连接 → AgentLoop 模式（agent_step / agent_complete）
   * - McpClient 未连接 → 原有 LM 流式对话模式（chat_response_chunk / chat_response_end）
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

    if (this.mcpClient.connected) {
      this.handleChatAgentMode(ws, msg, text, systemPrompt);
    } else {
      this.handleChatStreamMode(ws, msg, text, systemPrompt);
    }
  }

  /**
   * Agent 模式：McpClient 已连接时使用 AgentLoop.run() 进行 ReAct 循环
   * 每步通过 agent_step 实时推送，循环结束发送 agent_complete
   */
  private handleChatAgentMode(
    ws: WebSocket,
    msg: BridgeMessage,
    text: string,
    systemPrompt: string,
  ): void {
    this.outputChannel.appendLine(
      '[BrowserAgent] McpClient 已连接，使用 AgentLoop 模式',
    );

    void (async () => {
      const cts = new vscode.CancellationTokenSource();
      this.activeChatTokens.set(ws, cts);

      try {
        const agentLoop = new AgentLoop(
          this.lmService,
          this.mcpClient,
          this.outputChannel,
        );

        const result = await agentLoop.run(
          text,
          {
            systemPrompt,
            onStep: (step: AgentStep) => {
              // 每个 AgentStep 实时推送 agent_step 消息
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
            },
          },
          cts.token,
        );

        // AgentLoop 完成，发送 agent_complete 消息
        this.wsServer.send(ws, {
          type: 'agent_complete',
          payload: {
            finalAnswer: result.finalAnswer,
            steps: result.steps,
            totalSteps: result.totalSteps,
          },
          sessionId: msg.sessionId,
        });

        this.outputChannel.appendLine(
          `[BrowserAgent] AgentLoop 完成: ${result.totalSteps} 步, 答案长度 ${result.finalAnswer.length}`,
        );
      } catch (err) {
        const isCancelled = cts.token.isCancellationRequested;
        if (isCancelled) {
          // 被取消时发送 agent_complete 标记结束（无最终答案）
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
          this.outputChannel.appendLine(
            '[BrowserAgent] AgentLoop 被用户取消',
          );
        } else {
          // 错误时发送 agent_complete 包含错误信息
          const errMsg = err instanceof Error ? err.message : String(err);
          this.wsServer.send(ws, {
            type: 'agent_complete',
            payload: {
              finalAnswer: `错误: ${errMsg}`,
              steps: [],
              totalSteps: 0,
            },
            sessionId: msg.sessionId,
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
      const cts = new vscode.CancellationTokenSource();
      this.activeChatTokens.set(ws, cts);

      try {
        const fullText = await this.lmService.sendMessageStreaming(
          text,
          (fragment: string) => {
            this.wsServer.send(ws, {
              type: 'chat_response_chunk',
              payload: { text: fragment, done: false },
              sessionId: msg.sessionId,
            });
          },
          systemPrompt,
          cts.token,
        );

        this.wsServer.send(ws, {
          type: 'chat_response_end',
          payload: { fullText },
          sessionId: msg.sessionId,
        });
      } catch (err) {
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
          this.outputChannel.appendLine(
            `[BrowserAgent] chat 流式响应错误: ${err instanceof Error ? err.message : String(err)}`,
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
   * 根据浏览器上下文动态构建 system prompt
   */
  private buildSystemPrompt(
    context?: { url?: string; title?: string; selectedText?: string },
  ): string {
    let systemPrompt = 'You are a helpful browser agent assistant. Answer concisely.';
    if (context) {
      const contextParts: string[] = [];
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
