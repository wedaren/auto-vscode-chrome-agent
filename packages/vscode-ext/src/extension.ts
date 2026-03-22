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
import { ObservabilityStore } from './observability-store';
import { ObservabilityTreeDataProvider } from './observability-tree';

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
let observabilityStore: ObservabilityStore | undefined;
let observabilityTree: ObservabilityTreeDataProvider | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel('Browser Agent');
  outputChannel.appendLine('[BrowserAgent] 插件激活中...');

  // === 全局错误兜底：进程级 uncaughtException / unhandledRejection 处理器 ===
  // 捕获所有逃逸的同步异常和未处理的 Promise rejection，防止崩溃扩展宿主进程
  const uncaughtHandler = (err: Error): void => {
    outputChannel.appendLine(
      `[BrowserAgent][CRITICAL] uncaughtException: ${err.message}\n${err.stack ?? ''}`,
    );
    vscode.window.showErrorMessage(
      `Browser Agent 遇到未捕获异常: ${err.message}`,
    );
  };
  const rejectionHandler = (reason: unknown): void => {
    const msg = reason instanceof Error ? reason.message : String(reason);
    outputChannel.appendLine(
      `[BrowserAgent][CRITICAL] unhandledRejection: ${msg}`,
    );
    vscode.window.showErrorMessage(
      `Browser Agent 遇到未处理的 Promise 异常: ${msg}`,
    );
  };
  process.on('uncaughtException', uncaughtHandler);
  process.on('unhandledRejection', rejectionHandler);

  /** 服务健康状态：wsServer 是否成功 initialized */
  let wsServerHealthy = false;

  // 初始化全局用户数据目录管理器（最先初始化，其他模块可能依赖数据目录）
  userDataManager = new UserDataManager(outputChannel);
  userDataManager.init().catch((err: unknown) => {
    outputChannel.appendLine(
      `[BrowserAgent] UserDataManager 初始化失败: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
  outputChannel.appendLine('[BrowserAgent] UserDataManager 已创建');

  observabilityStore = new ObservabilityStore(userDataManager, outputChannel);
  observabilityStore.init().catch((err: unknown) => {
    outputChannel.appendLine(
      `[BrowserAgent] ObservabilityStore 初始化失败: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
  outputChannel.appendLine('[BrowserAgent] ObservabilityStore 已创建');

  // 监听 browserAgent.userDataDir 配置变更，变更时重新初始化数据目录
  const configChangeDisposable = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('browserAgent.userDataDir')) {
      outputChannel.appendLine('[BrowserAgent] 检测到 userDataDir 配置变更，重新初始化数据目录...');
      void (async () => {
        try {
          await userDataManager?.init();
          await observabilityStore?.init();
        } catch (err: unknown) {
          outputChannel.appendLine(
            `[BrowserAgent] 配置变更后重新初始化失败: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      })();
    }
  });

  // 初始化核心服务
  lmService = new LmService(outputChannel);
  mcpClient = new McpClient(outputChannel);

  const isDev = context.extensionMode === vscode.ExtensionMode.Development;
  const defaultPort = isDev ? 7778 : 7777;
  const port = vscode.workspace
    .getConfiguration('browserAgent')
    .get<number>('port', defaultPort);
  wsServer = new WsServer(outputChannel, port);
  wsServer.setObservabilityStore(observabilityStore);

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

  // 初始化 Skill 执行引擎（注入 BrowserToolProvider + McpClient + LmService）
  skillRunner = new SkillRunner(browserToolProvider, mcpClient, outputChannel, lmService);
  outputChannel.appendLine('[BrowserAgent] SkillRunner 已初始化');

  // === 异步初始化 WebSocket 服务 + 健康检查 ===
  // wsServer.start() 失败时标记不健康并阻断 MessageHandler 注册，防止下游级联崩溃
  void (async () => {
    try {
      await wsServer!.start();
      wsServerHealthy = true;
      outputChannel.appendLine('[BrowserAgent] WebSocket 服务 initialized — healthy');
    } catch (err) {
      wsServerHealthy = false;
      const errMsg = err instanceof Error ? err.message : String(err);
      outputChannel.appendLine(
        `[BrowserAgent][CRITICAL] WebSocket 服务初始化失败，标记为不健康: ${errMsg}`,
      );
      vscode.window.showErrorMessage(
        `Browser Agent WebSocket 启动失败，消息通道不可用: ${errMsg}`,
      );
    }

    // 只有 wsServer healthy 时才注册消息处理回调，阻断不健康时的下游依赖
    if (wsServerHealthy) {
      const messageHandler = new MessageHandler(
        lmService!, wsServer!, mcpClient!, outputChannel,
        browserToolProvider!, skillRegistry, skillRunner, observabilityStore,
      );
      wsServer!.onMessage((ws, msg) => messageHandler.handle(ws, msg));
      outputChannel.appendLine('[BrowserAgent] MessageHandler 已注册（wsServer healthy）');
    } else {
      outputChannel.appendLine(
        '[BrowserAgent] MessageHandler 未注册：WebSocket 不健康，已阻断下游依赖',
      );
    }
  })();

  // 初始化报告生成器
  reportGenerator = new ReportGenerator(lmService, mcpClient, wsServer, outputChannel);

  // 注册所有命令
  const commandRegistry = new CommandRegistry(lmService, mcpClient, reportGenerator, outputChannel, userDataManager);
  const commandDisposables = commandRegistry.registerAll();

  // 注册 Activity Bar TreeView（调试视图）
  connectionTree = new ConnectionTreeDataProvider();
  connectionTree.bind(wsServer, mcpClient, lmService, browserToolProvider, userDataManager);
  messageTree = new MessageTreeDataProvider();
  agentTree = new AgentTreeDataProvider();
  observabilityTree = new ObservabilityTreeDataProvider();
  observabilityTree.bind(observabilityStore);

  const connectionTreeView = vscode.window.createTreeView('browser-agent-connection', {
    treeDataProvider: connectionTree,
  });
  const messageTreeView = vscode.window.createTreeView('browser-agent-messages', {
    treeDataProvider: messageTree,
  });
  const agentTreeView = vscode.window.createTreeView('browser-agent-agent-loop', {
    treeDataProvider: agentTree,
  });
  const observabilityTreeView = vscode.window.createTreeView('browser-agent-observability', {
    treeDataProvider: observabilityTree,
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

  const refreshObservabilityCmd = vscode.commands.registerCommand(
    'browser-agent.refreshObservability',
    async () => {
      await observabilityStore?.init();
      observabilityTree?.refresh(true);
      vscode.window.showInformationMessage('Browser Agent: observability 仓库已刷新');
    },
  );

  const revealObservabilityDirCmd = vscode.commands.registerCommand(
    'browser-agent.revealObservabilityDir',
    async (target: 'root' | 'exports' = 'root') => {
      const directory = target === 'exports'
        ? observabilityStore?.getDiagnosticExportsDirectory()
        : observabilityStore?.getObservabilityDirectory();
      if (!directory) {
        vscode.window.showWarningMessage('Browser Agent: observability 目录尚未初始化');
        return;
      }
      const uri = vscode.Uri.file(directory);
      await vscode.commands.executeCommand('revealFileInOS', uri);
    },
  );

  outputChannel.appendLine('[BrowserAgent] Activity Bar 调试视图已注册');

  // 注册 dispose（含进程级错误处理器清理，避免插件停用后干扰其他扩展）
  context.subscriptions.push(
    outputChannel,
    configChangeDisposable,
    {
      dispose: () => {
        process.removeListener('uncaughtException', uncaughtHandler);
        process.removeListener('unhandledRejection', rejectionHandler);
      },
    },
    ...commandDisposables,
    connectionTreeView,
    messageTreeView,
    agentTreeView,
    observabilityTreeView,
    skillTreeView,
    docProviderDisposable,
    clearMessageLogCmd,
    openMessageDetailCmd,
    refreshObservabilityCmd,
    revealObservabilityDirCmd,
    runSkillCmd,
    toggleSkillCmd,
    addCustomSkillCmd,
    { dispose: () => connectionTree?.dispose() },
    { dispose: () => messageTree?.dispose() },
    { dispose: () => agentTree?.dispose() },
    { dispose: () => observabilityTree?.dispose() },
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

export async function deactivate(): Promise<void> {
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
  wsServer?.dispose();
  wsServer = undefined;
  await observabilityStore?.dispose();
  observabilityStore = undefined;
  userDataManager?.dispose();
  userDataManager = undefined;
  await mcpClient?.dispose();
  mcpClient = undefined;
  lmService?.dispose();
  lmService = undefined;
}
