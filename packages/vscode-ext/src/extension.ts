// extension.ts — VSCode 插件入口，负责激活和销毁生命周期
import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import { LmService } from './lm-service';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';
import { ReportGenerator } from './report-generator';

let lmService: LmService | undefined;
let wsServer: WsServer | undefined;
let mcpClient: McpClient | undefined;
let reportGenerator: ReportGenerator | undefined;

/** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
const activeChatTokens = new Map<WebSocket, vscode.CancellationTokenSource>();

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel('Browser Agent');
  outputChannel.appendLine('[BrowserAgent] 插件激活中...');

  // 初始化 LM 服务
  lmService = new LmService(outputChannel);

  // 初始化 WebSocket 服务端
  const port = vscode.workspace
    .getConfiguration('browserAgent')
    .get<number>('port', 7777);

  wsServer = new WsServer(outputChannel, port);
  wsServer.start().catch((err: unknown) => {
    outputChannel.appendLine(
      `[BrowserAgent] WebSocket 启动失败: ${err instanceof Error ? err.message : String(err)}`,
    );
  });

  // 注册 WebSocket 消息处理器：list_models / select_model / chat
  wsServer.onMessage((ws, msg) => {
    switch (msg.type) {
      case 'list_models':
        // Chrome 侧请求可用模型列表
        void (async () => {
          try {
            const models = await lmService!.listModels();
            wsServer!.send(ws, {
              type: 'models_list',
              payload: { models },
              sessionId: msg.sessionId,
            });
            outputChannel.appendLine(
              `[BrowserAgent] 已返回 ${models.length} 个模型信息`,
            );
          } catch (err) {
            outputChannel.appendLine(
              `[BrowserAgent] list_models 失败: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        })();
        break;

      case 'select_model':
        // Chrome 侧请求选择指定模型
        void (async () => {
          try {
            const { modelId } = msg.payload as { modelId: string };
            const success = await lmService!.selectModelById(modelId);
            wsServer!.send(ws, {
              type: 'model_selected',
              payload: { success, modelId },
              sessionId: msg.sessionId,
            });
            outputChannel.appendLine(
              `[BrowserAgent] select_model modelId=${modelId} 结果: ${success ? '成功' : '未找到'}`,
            );
          } catch (err) {
            outputChannel.appendLine(
              `[BrowserAgent] select_model 失败: ${err instanceof Error ? err.message : String(err)}`,
            );
            wsServer!.send(ws, {
              type: 'model_selected',
              payload: { success: false, modelId: '' },
              sessionId: msg.sessionId,
            });
          }
        })();
        break;

      case 'chat': {
        // Chrome 侧的用户聊天消息，使用流式响应处理
        const chatPayload = msg.payload as {
          text?: string;
          context?: { url?: string; title?: string; selectedText?: string };
        };
        const text = chatPayload?.text ?? '';
        const context = chatPayload?.context;

        // 根据浏览器上下文动态构建 system prompt
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

        outputChannel.appendLine(
          `[BrowserAgent] chat 收到消息，context: url=${context?.url ?? '无'}, title=${context?.title ?? '无'}, selectedText=${context?.selectedText ? `${context.selectedText.length}字` : '无'}`,
        );

        void (async () => {
          // 创建 CancellationTokenSource 用于支持 cancel_chat 中断
          const cts = new vscode.CancellationTokenSource();
          activeChatTokens.set(ws, cts);

          try {
            const fullText = await lmService!.sendMessageStreaming(
              text,
              (fragment: string) => {
                // 每个 fragment 发送 chat_response_chunk
                wsServer!.send(ws, {
                  type: 'chat_response_chunk',
                  payload: { text: fragment, done: false },
                  sessionId: msg.sessionId,
                });
              },
              systemPrompt,
              cts.token,
            );

            // 流式完成，发送 chat_response_end
            wsServer!.send(ws, {
              type: 'chat_response_end',
              payload: { fullText },
              sessionId: msg.sessionId,
            });
          } catch (err) {
            // 被取消时也发送 chat_response_end 标记结束
            const isCancelled = cts.token.isCancellationRequested;
            wsServer!.send(ws, {
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
              outputChannel.appendLine(
                `[BrowserAgent] chat 流式响应错误: ${err instanceof Error ? err.message : String(err)}`,
              );
            }
          } finally {
            activeChatTokens.delete(ws);
            cts.dispose();
          }
        })();
        break;
      }

      case 'cancel_chat': {
        // Chrome 侧请求中断当前流式生成
        const cts = activeChatTokens.get(ws);
        if (cts) {
          cts.cancel();
          outputChannel.appendLine('[BrowserAgent] 收到 cancel_chat，已中断流式生成');
        } else {
          outputChannel.appendLine('[BrowserAgent] 收到 cancel_chat，但无活跃的流式请求');
        }
        break;
      }

      default:
        outputChannel.appendLine(
          `[BrowserAgent] 未处理的消息类型: ${msg.type}`,
        );
        break;
    }
  });

  // 初始化 MCP Client（chrome-devtools-mcp）
  mcpClient = new McpClient(outputChannel);

  // 初始化报告生成器
  reportGenerator = new ReportGenerator(lmService, mcpClient, wsServer, outputChannel);

  // 注册命令：生成深度报告
  const generateReportCommand = vscode.commands.registerCommand(
    'browser-agent.generateReport',
    async () => {
      const topic = await vscode.window.showInputBox({
        prompt: '输入研究主题',
        placeHolder: '例如：React 19 新特性分析',
      });

      if (!topic) {
        return;
      }

      outputChannel.appendLine(`[BrowserAgent] 开始生成报告: ${topic}`);
      outputChannel.show(true);

      try {
        const report = await reportGenerator!.generate({
          topic,
          maxPages: 3,
          sessionId: `report-${Date.now()}`,
        });
        outputChannel.appendLine(`[BrowserAgent] 报告生成完成:\n${report}`);
        void vscode.window.showInformationMessage('Browser Agent: 深度报告已生成');
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        void vscode.window.showErrorMessage(`Browser Agent: 报告生成失败 - ${message}`);
      }
    },
  );

  // 注册命令：连接 DevTools MCP
  const connectMcpCommand = vscode.commands.registerCommand(
    'browser-agent.connectDevtools',
    async () => {
      try {
        await mcpClient!.connect();
        const tools = await mcpClient!.listTools();
        outputChannel.appendLine(
          `[BrowserAgent] DevTools MCP 已连接，可用工具: ${tools.length} 个`,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        void vscode.window.showErrorMessage(`Browser Agent: DevTools MCP 连接失败 - ${message}`);
      }
    },
  );

  // 注册命令：发送消息到语言模型
  const askCommand = vscode.commands.registerCommand(
    'browser-agent.ask',
    async () => {
      const input = await vscode.window.showInputBox({
        prompt: '输入你的问题',
        placeHolder: '例如：帮我分析这个页面的内容',
      });

      if (!input) {
        return;
      }

      outputChannel.appendLine(`[BrowserAgent] 用户输入: ${input}`);
      outputChannel.show(true);

      try {
        const response = await lmService!.sendMessage(
          input,
          'You are a helpful browser agent assistant. Answer concisely.',
        );
        outputChannel.appendLine(`[BrowserAgent] AI 回复:\n${response}`);
        void vscode.window.showInformationMessage(`AI: ${response.substring(0, 200)}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        outputChannel.appendLine(`[BrowserAgent] 错误: ${message}`);
        void vscode.window.showErrorMessage(`Browser Agent: ${message}`);
      }
    },
  );

  // 注册 dispose
  context.subscriptions.push(
    outputChannel,
    askCommand,
    connectMcpCommand,
    generateReportCommand,
    { dispose: () => wsServer?.dispose() },
    { dispose: () => { void mcpClient?.dispose(); } },
  );

  vscode.window.showInformationMessage('Browser Agent 已激活');
  outputChannel.appendLine('[BrowserAgent] 插件激活完成');
}

export function deactivate(): void {
  reportGenerator?.cancel();
  reportGenerator = undefined;
  void mcpClient?.dispose();
  mcpClient = undefined;
  wsServer?.dispose();
  wsServer = undefined;
  lmService = undefined;
}
