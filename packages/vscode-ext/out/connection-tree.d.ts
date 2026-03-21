import * as vscode from 'vscode';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';
import { LmService } from './lm-service';
import { BrowserToolProvider } from './browser-tools';
/** 连接状态树节点 */
export declare class ConnectionTreeItem extends vscode.TreeItem {
    readonly nodeType?: "ws" | "mcp" | "browser-tools" | "model" | "mcp-tool" | "browser-tool" | "detail" | undefined;
    constructor(label: string, collapsibleState?: vscode.TreeItemCollapsibleState, nodeType?: "ws" | "mcp" | "browser-tools" | "model" | "mcp-tool" | "browser-tool" | "detail" | undefined);
}
/** 连接状态 TreeDataProvider */
export declare class ConnectionTreeDataProvider implements vscode.TreeDataProvider<ConnectionTreeItem> {
    private readonly _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | ConnectionTreeItem | undefined>;
    private readonly disposables;
    private wsServer?;
    private mcpClient?;
    private lmService?;
    private browserToolProvider?;
    constructor();
    /**
     * 绑定核心服务并订阅状态变更事件
     * 在 extension.ts 中创建服务后调用
     */
    bind(wsServer: WsServer, mcpClient: McpClient, lmService: LmService, browserToolProvider?: BrowserToolProvider): void;
    refresh(): void;
    getTreeItem(element: ConnectionTreeItem): vscode.TreeItem;
    getChildren(element?: ConnectionTreeItem): ConnectionTreeItem[];
    /** 构建 3 个顶级节点 */
    private getRootItems;
    /** WebSocket Server 子节点：端口、监听状态、客户端数 */
    private getWsChildren;
    /** MCP 连接子节点：状态 + 已发现工具列表 */
    private getMcpChildren;
    /** 原生浏览器工具子节点：连接状态 + 可用工具列表 */
    private getBrowserToolsChildren;
    /** 当前模型子节点：名称、vendor、family、maxInputTokens */
    private getModelChildren;
    dispose(): void;
}
//# sourceMappingURL=connection-tree.d.ts.map