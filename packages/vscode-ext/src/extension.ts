// extension.ts — VSCode 插件入口，负责激活和销毁生命周期
import * as vscode from 'vscode';
import { LmService } from './lm-service';

let lmService: LmService | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel('Browser Agent');
  outputChannel.appendLine('[BrowserAgent] 插件激活中...');

  // 初始化 LM 服务
  lmService = new LmService(outputChannel);

  // 注册命令：发送消息到语言模型
  const askCommand = vscode.commands.registerCommand(
    'browser-agent.ask',
    async () => {
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
        const response = await lmService!.sendMessage(
          input,
          'You are a helpful browser agent assistant. Answer concisely.',
        );
        outputChannel.appendLine(`[BrowserAgent] AI 回复:\n${response}`);
        void vscode.window.showInformationMessage(`AI: ${response.substring(0, 200)}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        outputChannel.appendLine(`[BrowserAgent] 错误: ${message}`);
        void vscode.window.showErrorMessage(`Browser Agent: ${message}`);
      }
    },
  );

  context.subscriptions.push(outputChannel, askCommand);

  vscode.window.showInformationMessage('Browser Agent 已激活');
  outputChannel.appendLine('[BrowserAgent] 插件激活完成');
}

export function deactivate(): void {
  lmService = undefined;
}
