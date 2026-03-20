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
let lmService;
let wsServer;
let mcpClient;
let reportGenerator;
function activate(context) {
    const outputChannel = vscode.window.createOutputChannel('Browser Agent');
    outputChannel.appendLine('[BrowserAgent] 插件激活中...');
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
    // 注册 WebSocket 消息处理器
    const messageHandler = new message_handler_1.MessageHandler(lmService, wsServer, outputChannel);
    wsServer.onMessage((ws, msg) => messageHandler.handle(ws, msg));
    // 初始化报告生成器
    reportGenerator = new report_generator_1.ReportGenerator(lmService, mcpClient, wsServer, outputChannel);
    // 注册所有命令
    const commandRegistry = new command_registry_1.CommandRegistry(lmService, mcpClient, reportGenerator, outputChannel);
    const commandDisposables = commandRegistry.registerAll();
    // 注册 dispose
    context.subscriptions.push(outputChannel, ...commandDisposables, { dispose: () => wsServer?.dispose() }, { dispose: () => { void mcpClient?.dispose(); } });
    vscode.window.showInformationMessage('Browser Agent 已激活');
    outputChannel.appendLine('[BrowserAgent] 插件激活完成');
}
function deactivate() {
    reportGenerator?.cancel();
    reportGenerator = undefined;
    void mcpClient?.dispose();
    mcpClient = undefined;
    wsServer?.dispose();
    wsServer = undefined;
    lmService = undefined;
}
//# sourceMappingURL=extension.js.map