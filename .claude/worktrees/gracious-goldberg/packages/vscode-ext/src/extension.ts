// extension.ts — VSCode 插件入口，负责激活和销毁生命周期
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';
import { ReportGenerator } from './report-generator';
import { FeedbackCollector } from './feedback-collector';

let lmService: LmService | undefined;
let wsServer: WsServer | undefined;
let mcpClient: McpClient | undefined;
let reportGenerator: ReportGenerator | undefined;
let feedbackCollector: FeedbackCollector | undefined;

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

  // 初始化 MCP Client（chrome-devtools-mcp）
  mcpClient = new McpClient(outputChannel);

  // 初始化反馈收集器（进化循环的数据源）
  feedbackCollector = new FeedbackCollector(outputChannel);

  // 初始化报告生成器
  reportGenerator = new ReportGenerator(lmService, mcpClient, wsServer, outputChannel);

  // 注册 WebSocket 消息处理：接入反馈收集 + LM 服务
  wsServer.onMessage(async (ws, msg) => {
    if (msg.type === 'chat') {
      const payload = msg.payload as { text?: string; pageContext?: string };
      const text = payload?.text ?? '';
      const pageContext = payload?.pageContext ?? '';

      // 记录用户反馈（进化循环的数据源）
      feedbackCollector?.recordChat(text, pageContext);

      // 调用 LM 服务生成回复
      try {
        const systemPrompt = pageContext
          ? `You are a helpful browser agent. The user is viewing: ${pageContext}. Answer concisely.`
          : 'You are a helpful browser agent assistant. Answer concisely.';
        const response = await lmService!.sendMessage(text, systemPrompt);
        wsServer!.send(ws, {
          type: 'chat_response',
          payload: { text: response },
          sessionId: msg.sessionId,
        });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        feedbackCollector?.recordError(errMsg, text);
        wsServer!.send(ws, {
          type: 'chat_response',
          payload: { text: `[错误] ${errMsg}`, error: true },
          sessionId: msg.sessionId,
        });
      }
    }
  });

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
  feedbackCollector = undefined;
}
