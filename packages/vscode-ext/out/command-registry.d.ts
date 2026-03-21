import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpClient } from './mcp-client';
import { ReportGenerator } from './report-generator';
import { UserDataManager } from './user-data-manager';
/**
 * CommandRegistry 封装所有 VSCode 命令的注册逻辑。
 * 由 extension.ts activate() 创建，返回的 Disposable 数组注入 context.subscriptions。
 */
export declare class CommandRegistry {
    private readonly lmService;
    private readonly mcpClient;
    private readonly reportGenerator;
    private readonly outputChannel;
    private readonly userDataManager;
    constructor(lmService: LmService, mcpClient: McpClient, reportGenerator: ReportGenerator, outputChannel: vscode.OutputChannel, userDataManager: UserDataManager);
    /**
     * 注册所有命令，返回 Disposable 数组供 context.subscriptions 使用。
     */
    registerAll(): vscode.Disposable[];
    /**
     * 注册命令：生成深度报告
     */
    private registerGenerateReport;
    /**
     * 注册命令：连接 DevTools MCP
     */
    private registerConnectDevtools;
    /**
     * 注册命令：发送消息到语言模型
     */
    private registerAsk;
    /**
     * 注册命令：在系统文件管理器中打开用户数据目录
     */
    private registerOpenUserDataDir;
    /**
     * 注册命令：在 VSCode 中打开用户数据目录
     */
    private registerRevealUserDataDir;
}
//# sourceMappingURL=command-registry.d.ts.map