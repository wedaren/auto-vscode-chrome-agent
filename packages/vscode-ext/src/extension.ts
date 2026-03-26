// extension.ts — VSCode 插件入口，仅负责激活/销毁生命周期编排
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';
import { DeepResearchEngine } from './deep-research-engine';
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
let deepResearchEngine: DeepResearchEngine | undefined;
let connectionTree: ConnectionTreeDataProvider | undefined;
let messageTree: MessageTreeDataProvider | undefined;
let agentTree: AgentTreeDataProvider | undefined;
let skillTree: SkillTreeDataProvider | undefined;
let userDataManager: UserDataManager | undefined;
let observabilityStore: ObservabilityStore | undefined;
let observabilityTree: ObservabilityTreeDataProvider | undefined;

/** StatusBar item 展示 WsServer 角色（Leader / Follower） */
let roleStatusBarItem: vscode.StatusBarItem | undefined;

/** 竞选定时器：follower 模式下每 10 秒尝试提升为 leader */
let promotionTimer: ReturnType<typeof setInterval> | undefined;
/** 竞选间隔（毫秒） */
const PROMOTION_INTERVAL_MS = 10_000;

/** 更新 StatusBar 角色显示 */
function updateRoleStatusBar(role: string): void {
  if (!roleStatusBarItem) { return; }
  if (role === 'leader') {
    roleStatusBarItem.text = '$(broadcast) BA: Leader';
    roleStatusBarItem.tooltip = 'Browser Agent: Leader 模式 — 拥有 WebSocket 端口监听权';
    roleStatusBarItem.backgroundColor = undefined;
  } else if (role === 'follower') {
    roleStatusBarItem.text = '$(eye) BA: Follower';
    roleStatusBarItem.tooltip = 'Browser Agent: Follower 模式 — 端口被其他窗口占用，定时竞选中';
    roleStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else {
    roleStatusBarItem.text = '$(circle-slash) BA: idle';
    roleStatusBarItem.tooltip = 'Browser Agent: WebSocket 未启动';
    roleStatusBarItem.backgroundColor = undefined;
  }
}

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

  // 创建 StatusBar item 展示 WsServer 角色（Leader / Follower / idle）
  roleStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  roleStatusBarItem.name = 'Browser Agent Role';
  updateRoleStatusBar(wsServer.role);
  roleStatusBarItem.show();

  // 订阅角色变更事件，同步刷新 StatusBar
  const roleChangeDisposable = wsServer.onDidChangeRole((newRole) => {
    updateRoleStatusBar(newRole);
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

  // 初始化 Skill 执行引擎（注入 BrowserToolProvider + McpClient + LmService）
  skillRunner = new SkillRunner(browserToolProvider, mcpClient, outputChannel, lmService);
  outputChannel.appendLine('[BrowserAgent] SkillRunner 已初始化');

  // === 异步初始化 WebSocket 服务 + 健康检查 ===
  // wsServer.start() 成功后根据 role 决定是否注册 MessageHandler：
  //   leader + listening → healthy, 注册 MessageHandler
  //   follower           → not healthy but not error, 跳过 MessageHandler
  void (async () => {
    try {
      await wsServer!.start();

      // wsServerHealthy 与 role 联动：仅 leader+listening 才标记 healthy
      if (wsServer!.role === 'leader') {
        wsServerHealthy = true;
        outputChannel.appendLine('[BrowserAgent] WebSocket 服务 initialized — healthy (role=leader)');
      } else if (wsServer!.role === 'follower') {
        // follower 模式：端口被其他窗口占用，不是错误，不弹 showErrorMessage
        wsServerHealthy = false;
        outputChannel.appendLine('[BrowserAgent] WebSocket follower 模式 — 被动等待，不注册 MessageHandler');
      }
    } catch (err) {
      wsServerHealthy = false;
      const errMsg = err instanceof Error ? err.message : String(err);
      outputChannel.appendLine(
        `[BrowserAgent][CRITICAL] WebSocket 服务初始化失败，标记为不健康: ${errMsg}`,
      );
      // 不弹 showErrorMessage，仅记录日志；follower 模式已在 ws-server.ts 中优雅处理
    }

    // 根据 role 决定是否注册 MessageHandler：leader 注册、follower 跳过
    if (wsServerHealthy && wsServer!.role === 'leader') {
      const messageHandler = new MessageHandler(
        lmService!, wsServer!, mcpClient!, outputChannel,
        browserToolProvider!, skillRegistry, skillRunner, observabilityStore,
      );
      wsServer!.onMessage((ws, msg) => messageHandler.handle(ws, msg));
      outputChannel.appendLine('[BrowserAgent] MessageHandler 已注册（role=leader, wsServer healthy）');
    } else if (wsServer!.role === 'follower') {
      outputChannel.appendLine(
        '[BrowserAgent] MessageHandler 未注册：follower 模式跳过，启动定时竞选',
      );

      // 启动定时竞选：每 10 秒尝试获取 leader 角色
      promotionTimer = setInterval(() => {
        void (async () => {
          try {
            const promoted = await wsServer!.tryPromote();
            if (promoted) {
              // 竞选成功：停止定时器
              if (promotionTimer) {
                clearInterval(promotionTimer);
                promotionTimer = undefined;
              }

              wsServerHealthy = true;
              outputChannel.appendLine(
                '[BrowserAgent] 竞选成功：follower → leader，初始化 MessageHandler 及下游依赖',
              );

              // 完整初始化 MessageHandler 及下游依赖（lmService/mcpClient/browserToolProvider/skillRunner）
              const messageHandler = new MessageHandler(
                lmService!, wsServer!, mcpClient!, outputChannel,
                browserToolProvider!, skillRegistry, skillRunner, observabilityStore,
              );
              wsServer!.onMessage((ws, msg) => messageHandler.handle(ws, msg));
              outputChannel.appendLine(
                '[BrowserAgent] MessageHandler 已注册（竞选提升为 leader）',
              );
            }
            // tryPromote 返回 false 时静默继续，等待下一轮竞选
          } catch (err) {
            // 竞选异常时静默记录日志，不中断定时器
            outputChannel.appendLine(
              `[BrowserAgent] 竞选尝试异常: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        })();
      }, PROMOTION_INTERVAL_MS);
      outputChannel.appendLine(
        `[BrowserAgent] 定时竞选已启动（间隔 ${PROMOTION_INTERVAL_MS}ms）`,
      );
    } else {
      outputChannel.appendLine(
        '[BrowserAgent] MessageHandler 未注册：WebSocket 不健康，已阻断下游依赖',
      );
    }
  })();

  // 初始化深度调研引擎（使用 BrowserToolProvider 替代 MCP 直接调用）
  deepResearchEngine = new DeepResearchEngine(lmService, browserToolProvider, wsServer, outputChannel);

  // 注册所有命令
  const commandRegistry = new CommandRegistry(lmService, mcpClient, deepResearchEngine, outputChannel, userDataManager);
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
    roleChangeDisposable,
    { dispose: () => { roleStatusBarItem?.dispose(); roleStatusBarItem = undefined; } },
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
  // 清理竞选定时器（follower 模式下可能存在）
  if (promotionTimer) {
    clearInterval(promotionTimer);
    promotionTimer = undefined;
  }

  roleStatusBarItem?.dispose();
  roleStatusBarItem = undefined;

  deepResearchEngine?.cancel();
  deepResearchEngine = undefined;
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
