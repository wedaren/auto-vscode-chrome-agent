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
// extension.ts — VSCode 插件入口，负责激活和销毁生命周期
const vscode = __importStar(require("vscode"));
const lm_service_1 = require("./lm-service");
const ws_server_1 = require("./ws-server");
const mcp_client_1 = require("./mcp-client");
const report_generator_1 = require("./report-generator");
let lmService;
let wsServer;
let mcpClient;
let reportGenerator;
function activate(context) {
    const outputChannel = vscode.window.createOutputChannel('Browser Agent');
    outputChannel.appendLine('[BrowserAgent] 插件激活中...');
    // 初始化 LM 服务
    lmService = new lm_service_1.LmService(outputChannel);
    // 初始化 WebSocket 服务端
    const port = vscode.workspace
        .getConfiguration('browserAgent')
        .get('port', 7777);
    wsServer = new ws_server_1.WsServer(outputChannel, port);
    wsServer.start().catch((err) => {
        outputChannel.appendLine(`[BrowserAgent] WebSocket 启动失败: ${err instanceof Error ? err.message : String(err)}`);
    });
    // 初始化 MCP Client（chrome-devtools-mcp）
    mcpClient = new mcp_client_1.McpClient(outputChannel);
    // 初始化报告生成器
    reportGenerator = new report_generator_1.ReportGenerator(lmService, mcpClient, wsServer, outputChannel);
    // 注册命令：生成深度报告
    const generateReportCommand = vscode.commands.registerCommand('browser-agent.generateReport', async () => {
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
            const report = await reportGenerator.generate({
                topic,
                maxPages: 3,
                sessionId: `report-${Date.now()}`,
            });
            outputChannel.appendLine(`[BrowserAgent] 报告生成完成:\n${report}`);
            void vscode.window.showInformationMessage('Browser Agent: 深度报告已生成');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            void vscode.window.showErrorMessage(`Browser Agent: 报告生成失败 - ${message}`);
        }
    });
    // 注册命令：连接 DevTools MCP
    const connectMcpCommand = vscode.commands.registerCommand('browser-agent.connectDevtools', async () => {
        try {
            await mcpClient.connect();
            const tools = await mcpClient.listTools();
            outputChannel.appendLine(`[BrowserAgent] DevTools MCP 已连接，可用工具: ${tools.length} 个`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            void vscode.window.showErrorMessage(`Browser Agent: DevTools MCP 连接失败 - ${message}`);
        }
    });
    // 注册命令：发送消息到语言模型
    const askCommand = vscode.commands.registerCommand('browser-agent.ask', async () => {
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
            const response = await lmService.sendMessage(input, 'You are a helpful browser agent assistant. Answer concisely.');
            outputChannel.appendLine(`[BrowserAgent] AI 回复:\n${response}`);
            void vscode.window.showInformationMessage(`AI: ${response.substring(0, 200)}`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            outputChannel.appendLine(`[BrowserAgent] 错误: ${message}`);
            void vscode.window.showErrorMessage(`Browser Agent: ${message}`);
        }
    });
    // 注册 dispose
    context.subscriptions.push(outputChannel, askCommand, connectMcpCommand, generateReportCommand, { dispose: () => wsServer?.dispose() }, { dispose: () => { void mcpClient?.dispose(); } });
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