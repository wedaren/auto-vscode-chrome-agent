// extension.ts — VSCode 插件入口，负责激活和销毁生命周期
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';

let lmService: LmService | undefined;
let wsServer: WsServer | undefined;
let mcpClient: McpClient | undefined;

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
    { dispose: () => wsServer?.dispose() },
    { dispose: () => { void mcpClient?.dispose(); } },
  );

  vscode.window.showInformationMessage('Browser Agent 已激活');
  outputChannel.appendLine('[BrowserAgent] 插件激活完成');
}

export function deactivate(): void {
  void mcpClient?.dispose();
  mcpClient = undefined;
  wsServer?.dispose();
  wsServer = undefined;
  lmService = undefined;
}
