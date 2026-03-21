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
exports.CommandRegistry = void 0;
// command-registry.ts — 命令注册模块，封装所有 vscode.commands.registerCommand 调用
// 职责：generateReport / connectDevtools / ask / openUserDataDir / revealUserDataDir 命令的注册和处理逻辑
const vscode = __importStar(require("vscode"));
/**
 * CommandRegistry 封装所有 VSCode 命令的注册逻辑。
 * 由 extension.ts activate() 创建，返回的 Disposable 数组注入 context.subscriptions。
 */
class CommandRegistry {
    lmService;
    mcpClient;
    reportGenerator;
    outputChannel;
    userDataManager;
    constructor(lmService, mcpClient, reportGenerator, outputChannel, userDataManager) {
        this.lmService = lmService;
        this.mcpClient = mcpClient;
        this.reportGenerator = reportGenerator;
        this.outputChannel = outputChannel;
        this.userDataManager = userDataManager;
    }
    /**
     * 注册所有命令，返回 Disposable 数组供 context.subscriptions 使用。
     */
    registerAll() {
        return [
            this.registerGenerateReport(),
            this.registerConnectDevtools(),
            this.registerAsk(),
            this.registerOpenUserDataDir(),
            this.registerRevealUserDataDir(),
        ];
    }
    /**
     * 注册命令：生成深度报告
     */
    registerGenerateReport() {
        return vscode.commands.registerCommand('browser-agent.generateReport', async () => {
            const topic = await vscode.window.showInputBox({
                prompt: '输入研究主题',
                placeHolder: '例如：React 19 新特性分析',
            });
            if (!topic) {
                return;
            }
            this.outputChannel.appendLine(`[BrowserAgent] 开始生成报告: ${topic}`);
            this.outputChannel.show(true);
            try {
                const report = await this.reportGenerator.generate({
                    topic,
                    maxPages: 3,
                    sessionId: `report-${Date.now()}`,
                });
                this.outputChannel.appendLine(`[BrowserAgent] 报告生成完成:\n${report}`);
                void vscode.window.showInformationMessage('Browser Agent: 深度报告已生成');
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                void vscode.window.showErrorMessage(`Browser Agent: 报告生成失败 - ${message}`);
            }
        });
    }
    /**
     * 注册命令：连接 DevTools MCP
     */
    registerConnectDevtools() {
        return vscode.commands.registerCommand('browser-agent.connectDevtools', async () => {
            try {
                await this.mcpClient.connect();
                const tools = await this.mcpClient.listTools();
                this.outputChannel.appendLine(`[BrowserAgent] DevTools MCP 已连接，可用工具: ${tools.length} 个`);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                void vscode.window.showErrorMessage(`Browser Agent: DevTools MCP 连接失败 - ${message}`);
            }
        });
    }
    /**
     * 注册命令：发送消息到语言模型
     */
    registerAsk() {
        return vscode.commands.registerCommand('browser-agent.ask', async () => {
            const input = await vscode.window.showInputBox({
                prompt: '输入你的问题',
                placeHolder: '例如：帮我分析这个页面的内容',
            });
            if (!input) {
                return;
            }
            this.outputChannel.appendLine(`[BrowserAgent] 用户输入: ${input}`);
            this.outputChannel.show(true);
            try {
                const response = await this.lmService.sendMessage(input, 'You are a helpful browser agent assistant. Answer concisely.');
                this.outputChannel.appendLine(`[BrowserAgent] AI 回复:\n${response}`);
                void vscode.window.showInformationMessage(`AI: ${response.substring(0, 200)}`);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                this.outputChannel.appendLine(`[BrowserAgent] 错误: ${message}`);
                void vscode.window.showErrorMessage(`Browser Agent: ${message}`);
            }
        });
    }
    /**
     * 注册命令：在系统文件管理器中打开用户数据目录
     */
    registerOpenUserDataDir() {
        return vscode.commands.registerCommand('browser-agent.openUserDataDir', async () => {
            const rootDir = this.userDataManager.getRootDir();
            this.outputChannel.appendLine(`[BrowserAgent] 在文件管理器中打开用户数据目录: ${rootDir}`);
            const uri = vscode.Uri.file(rootDir);
            await vscode.env.openExternal(uri);
        });
    }
    /**
     * 注册命令：在 VSCode 中打开用户数据目录
     */
    registerRevealUserDataDir() {
        return vscode.commands.registerCommand('browser-agent.revealUserDataDir', async () => {
            const rootDir = this.userDataManager.getRootDir();
            this.outputChannel.appendLine(`[BrowserAgent] 在 VSCode 中打开用户数据目录: ${rootDir}`);
            const uri = vscode.Uri.file(rootDir);
            await vscode.commands.executeCommand('revealFileInOS', uri);
        });
    }
}
exports.CommandRegistry = CommandRegistry;
//# sourceMappingURL=command-registry.js.map