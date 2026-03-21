// message-tree.ts — 消息检查器 TreeView 的 TreeDataProvider 占位实现
// 后续 evo_v5_003 将填充实时 WebSocket 消息流日志逻辑
import * as vscode from 'vscode';

/** 消息日志树节点 */
export class MessageTreeItem extends vscode.TreeItem {
  constructor(label: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
  }
}

/** 消息检查器 TreeDataProvider（占位） */
export class MessageTreeDataProvider implements vscode.TreeDataProvider<MessageTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<MessageTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: MessageTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(_element?: MessageTreeItem): MessageTreeItem[] {
    // 占位：后续实现
    return [new MessageTreeItem('暂无消息记录')];
  }

  dispose(): void {
    this._onDidChangeTreeData.dispose();
  }
}
