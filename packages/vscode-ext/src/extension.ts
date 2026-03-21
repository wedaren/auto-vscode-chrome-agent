// extension.ts — VSCode 插件入口，仅负责激活/销毁生命周期编排
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';
import { ReportGenerator } from './report-generator';
import { MessageHandler } from './message-handler';
import { CommandRegistry } from './command-registry';
import { ConnectionTreeDataProvider } from './connection-tree';
import { MessageTreeDataProvider, MessageDocumentProvider, MESSAGE_SCHEME, getCapturedMessageById } from './message-tree';
import { AgentTreeDataProvider } from './agent-tree';
import { BrowserToolProvider } from './browser-tools';
import { SkillRegistry } from './skill-registry';

let lmService: LmService | undefined;
let wsServer: WsServer | undefined;
let mcpClient: McpClient | undefined;
let browserToolProvider: BrowserToolProvider | undefined;
let skillRegistry: SkillRegistry | undefined;
let reportGenerator: ReportGenerator | undefined;
let connectionTree: ConnectionTreeDataProvider | undefined;
let messageTree: MessageTreeDataProvider | undefined;
let agentTree: AgentTreeDataProvider | undefined;

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

  // 初始化浏览器工具提供者（原生浏览器操作，通过 WebSocket 与 Chrome 通信）
  browserToolProvider = new BrowserToolProvider(wsServer, outputChannel);

  // 初始化 Skill 注册表（加载预设 + 自定义 Skill）
  skillRegistry = new SkillRegistry(outputChannel);
  skillRegistry.loadSkills();
  outputChannel.appendLine('[BrowserAgent] SkillRegistry 已初始化');

  // 注册 WebSocket 消息处理器（注入 McpClient + BrowserToolProvider 以支持多工具源 AgentLoop 模式）
  const messageHandler = new MessageHandler(lmService, wsServer, mcpClient, outputChannel, browserToolProvider);
  wsServer.onMessage((ws, msg) => messageHandler.handle(ws, msg));

  // 初始化报告生成器
  reportGenerator = new ReportGenerator(lmService, mcpClient, wsServer, outputChannel);

  // 注册所有命令
  const commandRegistry = new CommandRegistry(lmService, mcpClient, reportGenerator, outputChannel);
  const commandDisposables = commandRegistry.registerAll();

  // 注册 Activity Bar TreeView（调试视图）
  connectionTree = new ConnectionTreeDataProvider();
  connectionTree.bind(wsServer, mcpClient, lmService, browserToolProvider);
  messageTree = new MessageTreeDataProvider();
  agentTree = new AgentTreeDataProvider();

  const connectionTreeView = vscode.window.createTreeView('browser-agent-connection', {
    treeDataProvider: connectionTree,
  });
  const messageTreeView = vscode.window.createTreeView('browser-agent-messages', {
    treeDataProvider: messageTree,
  });
  const agentTreeView = vscode.window.createTreeView('browser-agent-agent-loop', {
    treeDataProvider: agentTree,
  });

  // 注册消息检查器虚拟文档 ContentProvider
  const messageDocProvider = new MessageDocumentProvider();
  const docProviderDisposable = vscode.workspace.registerTextDocumentContentProvider(
    MESSAGE_SCHEME,
    messageDocProvider,
  );

  // 注册消息检查器命令
  const clearMessageLogCmd = vscode.commands.registerCommand(
    'browser-agent.clearMessageLog',
    () => {
      messageTree?.clearMessageLog();
      vscode.window.showInformationMessage('Browser Agent: 消息日志已清空');
    },
  );

  const openMessageDetailCmd = vscode.commands.registerCommand(
    'browser-agent.openMessageDetail',
    async (messageId: number) => {
      const captured = getCapturedMessageById(messageId);
      if (!captured) {
        vscode.window.showWarningMessage('消息未找到（可能已被环形缓冲淘汰）');
        return;
      }
      const uri = vscode.Uri.parse(
        `${MESSAGE_SCHEME}:${messageId}.json?ts=${Date.now()}`,
      );
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc, { preview: true });
    },
  );

  outputChannel.appendLine('[BrowserAgent] Activity Bar 调试视图已注册');

  // 注册 dispose
  context.subscriptions.push(
    outputChannel,
    ...commandDisposables,
    connectionTreeView,
    messageTreeView,
    agentTreeView,
    docProviderDisposable,
    clearMessageLogCmd,
    openMessageDetailCmd,
    { dispose: () => connectionTree?.dispose() },
    { dispose: () => messageTree?.dispose() },
    { dispose: () => agentTree?.dispose() },
    { dispose: () => skillRegistry?.dispose() },
    { dispose: () => browserToolProvider?.dispose() },
    { dispose: () => wsServer?.dispose() },
    { dispose: () => { void mcpClient?.dispose(); } },
  );

  vscode.window.showInformationMessage('Browser Agent 已激活');
  outputChannel.appendLine('[BrowserAgent] 插件激活完成');
}

export function deactivate(): void {
  reportGenerator?.cancel();
  reportGenerator = undefined;
  skillRegistry?.dispose();
  skillRegistry = undefined;
  browserToolProvider?.dispose();
  browserToolProvider = undefined;
  connectionTree?.dispose();
  connectionTree = undefined;
  messageTree?.dispose();
  messageTree = undefined;
  agentTree?.dispose();
  agentTree = undefined;
  void mcpClient?.dispose();
  mcpClient = undefined;
  wsServer?.dispose();
  wsServer = undefined;
  lmService?.dispose();
  lmService = undefined;
}
