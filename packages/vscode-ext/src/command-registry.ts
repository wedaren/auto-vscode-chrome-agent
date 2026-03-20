// command-registry.ts — 命令注册模块，封装所有 vscode.commands.registerCommand 调用
// 职责：generateReport / connectDevtools / ask 命令的注册和处理逻辑
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpClient } from './mcp-client';
import { ReportGenerator } from './report-generator';

/**
 * CommandRegistry 封装所有 VSCode 命令的注册逻辑。
 * 由 extension.ts activate() 创建，返回的 Disposable 数组注入 context.subscriptions。
 */
export class CommandRegistry {
  private readonly lmService: LmService;
  private readonly mcpClient: McpClient;
  private readonly reportGenerator: ReportGenerator;
  private readonly outputChannel: vscode.OutputChannel;

  constructor(
    lmService: LmService,
    mcpClient: McpClient,
    reportGenerator: ReportGenerator,
    outputChannel: vscode.OutputChannel,
  ) {
    this.lmService = lmService;
    this.mcpClient = mcpClient;
    this.reportGenerator = reportGenerator;
    this.outputChannel = outputChannel;
  }

  /**
   * 注册所有命令，返回 Disposable 数组供 context.subscriptions 使用。
   */
  registerAll(): vscode.Disposable[] {
    return [
      this.registerGenerateReport(),
      this.registerConnectDevtools(),
      this.registerAsk(),
    ];
  }

  /**
   * 注册命令：生成深度报告
   */
  private registerGenerateReport(): vscode.Disposable {
    return vscode.commands.registerCommand(
      'browser-agent.generateReport',
      async () => {
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
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          void vscode.window.showErrorMessage(`Browser Agent: 报告生成失败 - ${message}`);
        }
      },
    );
  }

  /**
   * 注册命令：连接 DevTools MCP
   */
  private registerConnectDevtools(): vscode.Disposable {
    return vscode.commands.registerCommand(
      'browser-agent.connectDevtools',
      async () => {
        try {
          await this.mcpClient.connect();
          const tools = await this.mcpClient.listTools();
          this.outputChannel.appendLine(
            `[BrowserAgent] DevTools MCP 已连接，可用工具: ${tools.length} 个`,
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          void vscode.window.showErrorMessage(`Browser Agent: DevTools MCP 连接失败 - ${message}`);
        }
      },
    );
  }

  /**
   * 注册命令：发送消息到语言模型
   */
  private registerAsk(): vscode.Disposable {
    return vscode.commands.registerCommand(
      'browser-agent.ask',
      async () => {
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
          const response = await this.lmService.sendMessage(
            input,
            'You are a helpful browser agent assistant. Answer concisely.',
          );
          this.outputChannel.appendLine(`[BrowserAgent] AI 回复:\n${response}`);
          void vscode.window.showInformationMessage(`AI: ${response.substring(0, 200)}`);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          this.outputChannel.appendLine(`[BrowserAgent] 错误: ${message}`);
          void vscode.window.showErrorMessage(`Browser Agent: ${message}`);
        }
      },
    );
  }
}
