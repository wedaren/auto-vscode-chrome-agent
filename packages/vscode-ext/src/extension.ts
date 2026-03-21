// extension.ts — VSCode 插件入口，仅负责激活/销毁生命周期编排
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';
import { ReportGenerator } from './report-generator';
import { MessageHandler } from './message-handler';
import { CommandRegistry } from './command-registry';

let lmService: LmService | undefined;
let wsServer: WsServer | undefined;
let mcpClient: McpClient | undefined;
let reportGenerator: ReportGenerator | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel('Browser Agent');
  outputChannel.appendLine('[BrowserAgent] 插件激活中...');

  // 初始化核心服务
  lmService = new LmService(outputChannel);
  mcpClient = new McpClient(outputChannel);

  const port = vscode.workspace
    .getConfiguration('browserAgent')
    .get<number>('port', 7777);
  wsServer = new WsServer(outputChannel, port);
  wsServer.start().catch((err: unknown) => {
    outputChannel.appendLine(
      `[BrowserAgent] WebSocket 启动失败: ${err instanceof Error ? err.message : String(err)}`,
    );
  });

  // 注册 WebSocket 消息处理器（注入 McpClient 以支持 AgentLoop 模式）
  const messageHandler = new MessageHandler(lmService, wsServer, mcpClient, outputChannel);
  wsServer.onMessage((ws, msg) => messageHandler.handle(ws, msg));

  // 初始化报告生成器
  reportGenerator = new ReportGenerator(lmService, mcpClient, wsServer, outputChannel);

  // 注册所有命令
  const commandRegistry = new CommandRegistry(lmService, mcpClient, reportGenerator, outputChannel);
  const commandDisposables = commandRegistry.registerAll();

  // 注册 dispose
  context.subscriptions.push(
    outputChannel,
    ...commandDisposables,
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
