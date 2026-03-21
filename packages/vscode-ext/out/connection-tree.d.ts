import * as vscode from 'vscode';
/** 连接状态树节点 */
export declare class ConnectionTreeItem extends vscode.TreeItem {
    constructor(label: string);
}
/** 连接状态 TreeDataProvider（占位） */
export declare class ConnectionTreeDataProvider implements vscode.TreeDataProvider<ConnectionTreeItem> {
    private readonly _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | ConnectionTreeItem | undefined>;
    refresh(): void;
    getTreeItem(element: ConnectionTreeItem): vscode.TreeItem;
    getChildren(_element?: ConnectionTreeItem): ConnectionTreeItem[];
    dispose(): void;
}
//# sourceMappingURL=connection-tree.d.ts.map