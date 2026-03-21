// agent-tree.ts — Agent 循环可视化 TreeView 的 TreeDataProvider 占位实现
// 后续 evo_v5_004 将填充 ReAct 步骤实时展示 + 历史执行记录逻辑
import * as vscode from 'vscode';

/** Agent 循环树节点 */
export class AgentTreeItem extends vscode.TreeItem {
  constructor(label: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
  }
}

/** Agent 循环 TreeDataProvider（占位） */
export class AgentTreeDataProvider implements vscode.TreeDataProvider<AgentTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<AgentTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: AgentTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(_element?: AgentTreeItem): AgentTreeItem[] {
    // 占位：后续实现
    return [new AgentTreeItem('暂无 Agent 运行记录')];
  }

  dispose(): void {
    this._onDidChangeTreeData.dispose();
  }
}
