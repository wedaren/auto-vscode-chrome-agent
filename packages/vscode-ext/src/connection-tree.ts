// connection-tree.ts — 连接状态 TreeView 的 TreeDataProvider 占位实现
// 后续 evo_v5_002 将填充 WebSocket / MCP / 模型 状态展示逻辑
import * as vscode from 'vscode';

/** 连接状态树节点 */
export class ConnectionTreeItem extends vscode.TreeItem {
  constructor(label: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
  }
}

/** 连接状态 TreeDataProvider（占位） */
export class ConnectionTreeDataProvider implements vscode.TreeDataProvider<ConnectionTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<ConnectionTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ConnectionTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(_element?: ConnectionTreeItem): ConnectionTreeItem[] {
    // 占位：后续实现
    return [new ConnectionTreeItem('WebSocket: 待实现'), new ConnectionTreeItem('MCP: 待实现'), new ConnectionTreeItem('模型: 待实现')];
  }

  dispose(): void {
    this._onDidChangeTreeData.dispose();
  }
}
