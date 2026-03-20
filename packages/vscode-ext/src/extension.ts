// extension.ts — VSCode 插件入口，负责激活和销毁生命周期
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  vscode.window.showInformationMessage('Browser Agent 已激活');
}

export function deactivate(): void {
  // cleanup
}
