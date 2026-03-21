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
import { SkillRunner } from './skill-runner';
import { SkillTreeDataProvider, runSkillCommand, toggleSkillCommand, addCustomSkillCommand } from './skill-tree';
import { UserDataManager } from './user-data-manager';

let lmService: LmService | undefined;
let wsServer: WsServer | undefined;
let mcpClient: McpClient | undefined;
let browserToolProvider: BrowserToolProvider | undefined;
let skillRegistry: SkillRegistry | undefined;
let skillRunner: SkillRunner | undefined;
let reportGenerator: ReportGenerator | undefined;
let connectionTree: ConnectionTreeDataProvider | undefined;
let messageTree: MessageTreeDataProvider | undefined;
let agentTree: AgentTreeDataProvider | undefined;
let skillTree: SkillTreeDataProvider | undefined;
let userDataManager: UserDataManager | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel('Browser Agent');
  outputChannel.appendLine('[BrowserAgent] 插件激活中...');

  // 初始化全局用户数据目录管理器（最先初始化，其他模块可能依赖数据目录）
  userDataManager = new UserDataManager(outputChannel);
  userDataManager.init().catch((err: unknown) => {
    outputChannel.appendLine(
      `[BrowserAgent] UserDataManager 初始化失败: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
  outputChannel.appendLine('[BrowserAgent] UserDataManager 已创建');

  // 监听 browserAgent.userDataDir 配置变更，变更时重新初始化数据目录
  const configChangeDisposable = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('browserAgent.userDataDir')) {
      outputChannel.appendLine('[BrowserAgent] 检测到 userDataDir 配置变更，重新初始化数据目录...');
      userDataManager?.init().catch((err: unknown) => {
        outputChannel.appendLine(
          `[BrowserAgent] 配置变更后重新初始化失败: ${err instanceof Error ? err.message : String(err)}`,
        );
      });
    }
  });

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

  // 初始化 Skill 注册表（加载预设 + 自定义 Skill，使用 UserDataManager 文件持久化）
  skillRegistry = new SkillRegistry(userDataManager, outputChannel);
  skillRegistry.loadSkills().catch((err: unknown) => {
    outputChannel.appendLine(
      `[BrowserAgent] SkillRegistry 加载失败: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
  outputChannel.appendLine('[BrowserAgent] SkillRegistry 已初始化');

  // 初始化 Skill 执行引擎（注入 BrowserToolProvider + McpClient）
  skillRunner = new SkillRunner(browserToolProvider, mcpClient, outputChannel);
  outputChannel.appendLine('[BrowserAgent] SkillRunner 已初始化');

  // 注册 WebSocket 消息处理器（注入 McpClient + BrowserToolProvider + Skill 系统以支持多工具源 AgentLoop 模式）
  const messageHandler = new MessageHandler(lmService, wsServer, mcpClient, outputChannel, browserToolProvider, skillRegistry, skillRunner);
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

  // 注册 Skill 管理 TreeView
  skillTree = new SkillTreeDataProvider();
  skillTree.bind(skillRegistry);
  const skillTreeView = vscode.window.createTreeView('browser-agent-skills', {
    treeDataProvider: skillTree,
  });

  // 注册 Skill 管理命令
  const runSkillCmd = vscode.commands.registerCommand(
    'browser-agent.runSkill',
    (item) => runSkillCommand(item, skillRegistry, outputChannel, skillRunner),
  );
  const toggleSkillCmd = vscode.commands.registerCommand(
    'browser-agent.toggleSkill',
    (item) => toggleSkillCommand(item, skillRegistry),
  );
  const addCustomSkillCmd = vscode.commands.registerCommand(
    'browser-agent.addCustomSkill',
    () => addCustomSkillCommand(skillRegistry, outputChannel),
  );

  outputChannel.appendLine('[BrowserAgent] Skill 管理 TreeView 已注册');

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
    configChangeDisposable,
    ...commandDisposables,
    connectionTreeView,
    messageTreeView,
    agentTreeView,
    skillTreeView,
    docProviderDisposable,
    clearMessageLogCmd,
    openMessageDetailCmd,
    runSkillCmd,
    toggleSkillCmd,
    addCustomSkillCmd,
    { dispose: () => connectionTree?.dispose() },
    { dispose: () => messageTree?.dispose() },
    { dispose: () => agentTree?.dispose() },
    { dispose: () => skillTree?.dispose() },
    { dispose: () => skillRegistry?.dispose() },
    { dispose: () => browserToolProvider?.dispose() },
    { dispose: () => userDataManager?.dispose() },
    { dispose: () => wsServer?.dispose() },
    { dispose: () => { void mcpClient?.dispose(); } },
  );

  vscode.window.showInformationMessage('Browser Agent 已激活');
  outputChannel.appendLine('[BrowserAgent] 插件激活完成');
}

export function deactivate(): void {
  reportGenerator?.cancel();
  reportGenerator = undefined;
  skillRunner = undefined;
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
  skillTree?.dispose();
  skillTree = undefined;
  userDataManager?.dispose();
  userDataManager = undefined;
  void mcpClient?.dispose();
  mcpClient = undefined;
  wsServer?.dispose();
  wsServer = undefined;
  lmService?.dispose();
  lmService = undefined;
}
