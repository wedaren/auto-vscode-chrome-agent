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
exports.activate = activate;
exports.deactivate = deactivate;
// extension.ts — VSCode 插件入口，仅负责激活/销毁生命周期编排
const vscode = __importStar(require("vscode"));
const lm_service_1 = require("./lm-service");
const ws_server_1 = require("./ws-server");
const mcp_client_1 = require("./mcp-client");
const report_generator_1 = require("./report-generator");
const message_handler_1 = require("./message-handler");
const command_registry_1 = require("./command-registry");
const connection_tree_1 = require("./connection-tree");
const message_tree_1 = require("./message-tree");
const agent_tree_1 = require("./agent-tree");
const browser_tools_1 = require("./browser-tools");
const skill_registry_1 = require("./skill-registry");
const skill_runner_1 = require("./skill-runner");
const skill_tree_1 = require("./skill-tree");
const user_data_manager_1 = require("./user-data-manager");
let lmService;
let wsServer;
let mcpClient;
let browserToolProvider;
let skillRegistry;
let skillRunner;
let reportGenerator;
let connectionTree;
let messageTree;
let agentTree;
let skillTree;
let userDataManager;
function activate(context) {
    const outputChannel = vscode.window.createOutputChannel('Browser Agent');
    outputChannel.appendLine('[BrowserAgent] 插件激活中...');
    // 初始化全局用户数据目录管理器（最先初始化，其他模块可能依赖数据目录）
    userDataManager = new user_data_manager_1.UserDataManager(outputChannel);
    userDataManager.init().catch((err) => {
        outputChannel.appendLine(`[BrowserAgent] UserDataManager 初始化失败: ${err instanceof Error ? err.message : String(err)}`);
    });
    outputChannel.appendLine('[BrowserAgent] UserDataManager 已创建');
    // 监听 browserAgent.userDataDir 配置变更，变更时重新初始化数据目录
    const configChangeDisposable = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('browserAgent.userDataDir')) {
            outputChannel.appendLine('[BrowserAgent] 检测到 userDataDir 配置变更，重新初始化数据目录...');
            userDataManager?.init().catch((err) => {
                outputChannel.appendLine(`[BrowserAgent] 配置变更后重新初始化失败: ${err instanceof Error ? err.message : String(err)}`);
            });
        }
    });
    // 初始化核心服务
    lmService = new lm_service_1.LmService(outputChannel);
    mcpClient = new mcp_client_1.McpClient(outputChannel);
    const port = vscode.workspace
        .getConfiguration('browserAgent')
        .get('port', 7777);
    wsServer = new ws_server_1.WsServer(outputChannel, port);
    wsServer.start().catch((err) => {
        outputChannel.appendLine(`[BrowserAgent] WebSocket 启动失败: ${err instanceof Error ? err.message : String(err)}`);
    });
    // 初始化浏览器工具提供者（原生浏览器操作，通过 WebSocket 与 Chrome 通信）
    browserToolProvider = new browser_tools_1.BrowserToolProvider(wsServer, outputChannel);
    // 初始化 Skill 注册表（加载预设 + 自定义 Skill）
    skillRegistry = new skill_registry_1.SkillRegistry(outputChannel);
    skillRegistry.loadSkills();
    outputChannel.appendLine('[BrowserAgent] SkillRegistry 已初始化');
    // 初始化 Skill 执行引擎（注入 BrowserToolProvider + McpClient）
    skillRunner = new skill_runner_1.SkillRunner(browserToolProvider, mcpClient, outputChannel);
    outputChannel.appendLine('[BrowserAgent] SkillRunner 已初始化');
    // 注册 WebSocket 消息处理器（注入 McpClient + BrowserToolProvider + Skill 系统以支持多工具源 AgentLoop 模式）
    const messageHandler = new message_handler_1.MessageHandler(lmService, wsServer, mcpClient, outputChannel, browserToolProvider, skillRegistry, skillRunner);
    wsServer.onMessage((ws, msg) => messageHandler.handle(ws, msg));
    // 初始化报告生成器
    reportGenerator = new report_generator_1.ReportGenerator(lmService, mcpClient, wsServer, outputChannel);
    // 注册所有命令
    const commandRegistry = new command_registry_1.CommandRegistry(lmService, mcpClient, reportGenerator, outputChannel);
    const commandDisposables = commandRegistry.registerAll();
    // 注册 Activity Bar TreeView（调试视图）
    connectionTree = new connection_tree_1.ConnectionTreeDataProvider();
    connectionTree.bind(wsServer, mcpClient, lmService, browserToolProvider);
    messageTree = new message_tree_1.MessageTreeDataProvider();
    agentTree = new agent_tree_1.AgentTreeDataProvider();
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
    skillTree = new skill_tree_1.SkillTreeDataProvider();
    skillTree.bind(skillRegistry);
    const skillTreeView = vscode.window.createTreeView('browser-agent-skills', {
        treeDataProvider: skillTree,
    });
    // 注册 Skill 管理命令
    const runSkillCmd = vscode.commands.registerCommand('browser-agent.runSkill', (item) => (0, skill_tree_1.runSkillCommand)(item, skillRegistry, outputChannel, skillRunner));
    const toggleSkillCmd = vscode.commands.registerCommand('browser-agent.toggleSkill', (item) => (0, skill_tree_1.toggleSkillCommand)(item, skillRegistry));
    const addCustomSkillCmd = vscode.commands.registerCommand('browser-agent.addCustomSkill', () => (0, skill_tree_1.addCustomSkillCommand)(skillRegistry, outputChannel));
    outputChannel.appendLine('[BrowserAgent] Skill 管理 TreeView 已注册');
    // 注册消息检查器虚拟文档 ContentProvider
    const messageDocProvider = new message_tree_1.MessageDocumentProvider();
    const docProviderDisposable = vscode.workspace.registerTextDocumentContentProvider(message_tree_1.MESSAGE_SCHEME, messageDocProvider);
    // 注册消息检查器命令
    const clearMessageLogCmd = vscode.commands.registerCommand('browser-agent.clearMessageLog', () => {
        messageTree?.clearMessageLog();
        vscode.window.showInformationMessage('Browser Agent: 消息日志已清空');
    });
    const openMessageDetailCmd = vscode.commands.registerCommand('browser-agent.openMessageDetail', async (messageId) => {
        const captured = (0, message_tree_1.getCapturedMessageById)(messageId);
        if (!captured) {
            vscode.window.showWarningMessage('消息未找到（可能已被环形缓冲淘汰）');
            return;
        }
        const uri = vscode.Uri.parse(`${message_tree_1.MESSAGE_SCHEME}:${messageId}.json?ts=${Date.now()}`);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, { preview: true });
    });
    outputChannel.appendLine('[BrowserAgent] Activity Bar 调试视图已注册');
    // 注册 dispose
    context.subscriptions.push(outputChannel, configChangeDisposable, ...commandDisposables, connectionTreeView, messageTreeView, agentTreeView, skillTreeView, docProviderDisposable, clearMessageLogCmd, openMessageDetailCmd, runSkillCmd, toggleSkillCmd, addCustomSkillCmd, { dispose: () => connectionTree?.dispose() }, { dispose: () => messageTree?.dispose() }, { dispose: () => agentTree?.dispose() }, { dispose: () => skillTree?.dispose() }, { dispose: () => skillRegistry?.dispose() }, { dispose: () => browserToolProvider?.dispose() }, { dispose: () => userDataManager?.dispose() }, { dispose: () => wsServer?.dispose() }, { dispose: () => { void mcpClient?.dispose(); } });
    vscode.window.showInformationMessage('Browser Agent 已激活');
    outputChannel.appendLine('[BrowserAgent] 插件激活完成');
}
function deactivate() {
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
//# sourceMappingURL=extension.js.map