import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpClient } from './mcp-client';
import { ReportGenerator } from './report-generator';
/**
 * CommandRegistry 封装所有 VSCode 命令的注册逻辑。
 * 由 extension.ts activate() 创建，返回的 Disposable 数组注入 context.subscriptions。
 */
export declare class CommandRegistry {
    private readonly lmService;
    private readonly mcpClient;
    private readonly reportGenerator;
    private readonly outputChannel;
    constructor(lmService: LmService, mcpClient: McpClient, reportGenerator: ReportGenerator, outputChannel: vscode.OutputChannel);
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
}
//# sourceMappingURL=command-registry.d.ts.map