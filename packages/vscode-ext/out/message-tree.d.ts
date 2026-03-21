import * as vscode from 'vscode';
/** 消息日志树节点 */
export declare class MessageTreeItem extends vscode.TreeItem {
    constructor(label: string);
}
/** 消息检查器 TreeDataProvider（占位） */
export declare class MessageTreeDataProvider implements vscode.TreeDataProvider<MessageTreeItem> {
    private readonly _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | MessageTreeItem | undefined>;
    refresh(): void;
    getTreeItem(element: MessageTreeItem): vscode.TreeItem;
    getChildren(_element?: MessageTreeItem): MessageTreeItem[];
    dispose(): void;
}
//# sourceMappingURL=message-tree.d.ts.map