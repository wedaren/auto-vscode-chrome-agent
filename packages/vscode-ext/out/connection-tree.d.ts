import * as vscode from 'vscode';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';
import { LmService } from './lm-service';
import { BrowserToolProvider } from './browser-tools';
import { UserDataManager } from './user-data-manager';
/** 连接状态树节点 */
export declare class ConnectionTreeItem extends vscode.TreeItem {
    readonly nodeType?: "ws" | "mcp" | "browser-tools" | "model" | "user-data" | "mcp-tool" | "browser-tool" | "detail" | undefined;
    constructor(label: string, collapsibleState?: vscode.TreeItemCollapsibleState, nodeType?: "ws" | "mcp" | "browser-tools" | "model" | "user-data" | "mcp-tool" | "browser-tool" | "detail" | undefined);
}
/** 连接状态 TreeDataProvider */
export declare class ConnectionTreeDataProvider implements vscode.TreeDataProvider<ConnectionTreeItem> {
    private readonly _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | ConnectionTreeItem | undefined>;
    private readonly disposables;
    /** disposed 标志：dispose 后所有异步回调必须跳过 refresh */
    private _disposed;
    private wsServer?;
    private mcpClient?;
    private lmService?;
    private browserToolProvider?;
    private userDataManager?;
    /** 缓存的磁盘占用字符串，避免每次 getChildren 都计算 */
    private cachedDiskUsage;
    constructor();
    /**
     * 绑定核心服务并订阅状态变更事件
     * 在 extension.ts 中创建服务后调用
     */
    bind(wsServer: WsServer, mcpClient: McpClient, lmService: LmService, browserToolProvider?: BrowserToolProvider, userDataManager?: UserDataManager): void;
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
    /** 用户数据目录子节点：路径、磁盘占用 */
    private getUserDataChildren;
    /**
     * 异步计算用户数据目录的磁盘占用并缓存结果
     */
    private updateDiskUsage;
    /**
     * 递归计算目录大小（字节数）
     */
    private calculateDirSize;
    /**
     * 将字节数格式化为人类可读的字符串
     */
    private static formatBytes;
    dispose(): void;
    /** 是否已被释放（供外部检查） */
    get isDisposed(): boolean;
}
//# sourceMappingURL=connection-tree.d.ts.map