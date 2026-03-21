import * as vscode from 'vscode';
/** MCP 工具调用结果 */
export interface McpToolResult {
    content: unknown[];
    isError?: boolean;
}
/**
 * McpClient 封装与 chrome-devtools-mcp 的 MCP 协议通信。
 *
 * 通过 stdio transport 启动 `npx chrome-devtools-mcp@latest` 子进程，
 * 使用 @modelcontextprotocol/sdk 进行工具发现和调用。
 *
 * 生命周期：在 activate() 时可选启动，deactivate() 时自动关闭子进程。
 */
export declare class McpClient {
    private client;
    private transport;
    private outputChannel;
    private _connected;
    private _discoveredTools;
    /** 状态变更事件，当连接状态或工具列表变化时触发 */
    private readonly _onDidChangeState;
    readonly onDidChangeState: vscode.Event<void>;
    constructor(outputChannel: vscode.OutputChannel);
    /** 当前是否已连接 */
    get connected(): boolean;
    /** 已发现的 MCP 工具列表（缓存） */
    get discoveredTools(): ReadonlyArray<{
        name: string;
        description?: string;
    }>;
    /**
     * 启动 chrome-devtools-mcp 子进程并建立 MCP 连接
     */
    connect(): Promise<void>;
    /**
     * 列出 MCP Server 提供的所有可用工具
     */
    listTools(): Promise<{
        name: string;
        description?: string;
    }[]>;
    /**
     * 调用 MCP Server 上的指定工具
     * @param toolName 工具名称（如 navigate_page, take_screenshot 等）
     * @param args 工具参数
     */
    callTool(toolName: string, args?: Record<string, unknown>): Promise<McpToolResult>;
    /**
     * 关闭 MCP 连接并终止子进程
     */
    dispose(): Promise<void>;
}
//# sourceMappingURL=mcp-client.d.ts.map