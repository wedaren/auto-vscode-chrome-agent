import * as vscode from 'vscode';
/** Agent 循环树节点 */
export declare class AgentTreeItem extends vscode.TreeItem {
    constructor(label: string);
}
/** Agent 循环 TreeDataProvider（占位） */
export declare class AgentTreeDataProvider implements vscode.TreeDataProvider<AgentTreeItem> {
    private readonly _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | AgentTreeItem | undefined>;
    refresh(): void;
    getTreeItem(element: AgentTreeItem): vscode.TreeItem;
    getChildren(_element?: AgentTreeItem): AgentTreeItem[];
    dispose(): void;
}
//# sourceMappingURL=agent-tree.d.ts.map