import * as vscode from 'vscode';
/** MCP 工具调用结果 */
export interface McpToolResult {
    content: unknown[];
    isError?: boolean;
}
/** MCP 工具完整信息（含 inputSchema） */
export interface McpToolInfo {
    name: string;
    description?: string;
    inputSchema?: Record<string, unknown>;
}
/**
 * McpClient 封装与 chrome-devtools-mcp 的 MCP 协议通信。
 *
 * 通过 stdio transport 启动 `npx chrome-devtools-mcp@latest` 子进程，
 * 使用 @modelcontextprotocol/sdk 进行工具发现和调用。
 * 启动参数通过 VSCode settings (browserAgent.mcp.*) 动态构建。
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
    /** 已发现的 MCP 工具列表（缓存），包含完整 inputSchema */
    get discoveredTools(): ReadonlyArray<McpToolInfo>;
    /**
     * 启动 chrome-devtools-mcp 子进程并建立 MCP 连接。
     * 启动参数从 VSCode settings (browserAgent.mcp.*) 动态读取。
     */
    connect(): Promise<void>;
    /**
     * 列出 MCP Server 提供的所有可用工具（含完整 inputSchema）
     */
    listTools(): Promise<McpToolInfo[]>;
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