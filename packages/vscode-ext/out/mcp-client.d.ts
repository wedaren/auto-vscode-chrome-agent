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
/** McpClient 连接状态 */
export type McpConnectionState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
/**
 * McpClient 封装与 chrome-devtools-mcp 的 MCP 协议通信。
 *
 * 通过 stdio transport 启动 `npx chrome-devtools-mcp@latest` 子进程，
 * 使用 @modelcontextprotocol/sdk 进行工具发现和调用。
 * 启动参数通过 VSCode settings (browserAgent.mcp.*) 动态构建。
 *
 * 健壮性保障：
 * - restartOnCrash：transport close 事件 → 指数退避自动重连（最多 MAX_RESTART_ATTEMPTS 次）
 * - healthCheck：每 HEALTH_CHECK_INTERVAL_MS 调用 listTools() 验证子进程存活
 * - dispose()：清理所有定时器、监听器和子进程资源
 *
 * 生命周期：在 activate() 时可选启动，deactivate() 时自动关闭子进程。
 */
export declare class McpClient {
    private client;
    private transport;
    private outputChannel;
    private _connectionState;
    private _discoveredTools;
    /** 当前连续重启尝试次数 */
    private retryCount;
    /** 重连定时器句柄 */
    private reconnectTimer;
    /** 是否正在 dispose（避免 dispose 期间触发重连） */
    private _disposing;
    /** 是否由用户主动调用 disconnect（避免主动断开触发自动重连） */
    private _manualDisconnect;
    /** 健康检查定时器句柄 */
    private healthCheckTimer;
    /** 状态变更事件，当连接状态或工具列表变化时触发 */
    private readonly _onDidChangeState;
    readonly onDidChangeState: vscode.Event<void>;
    constructor(outputChannel: vscode.OutputChannel);
    /** 当前是否已连接 */
    get connected(): boolean;
    /** 当前连接状态 */
    get connectionState(): McpConnectionState;
    /** 已发现的 MCP 工具列表（缓存），包含完整 inputSchema */
    get discoveredTools(): ReadonlyArray<McpToolInfo>;
    /**
     * 启动 chrome-devtools-mcp 子进程并建立 MCP 连接。
     * 启动参数从 VSCode settings (browserAgent.mcp.*) 动态读取。
     */
    connect(): Promise<void>;
    /**
     * 主动断开连接（不触发自动重连）
     */
    disconnect(): Promise<void>;
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
     * 关闭 MCP 连接并终止子进程，清理所有定时器和监听器
     */
    dispose(): Promise<void>;
    /**
     * 执行实际的连接流程（connect 和 reconnect 共用）
     */
    private doConnect;
    /**
     * 设置 transport 层的 close/error 监听，用于检测子进程崩溃
     */
    private setupTransportListeners;
    /**
     * Transport 关闭回调：子进程退出或连接断开
     */
    private handleTransportClose;
    /**
     * Transport 错误回调：记录但不直接触发重连（等待 onclose）
     */
    private handleTransportError;
    /**
     * 安排一次指数退避重连
     */
    private scheduleReconnect;
    /**
     * 取消待执行的重连定时器
     */
    private cancelReconnectTimer;
    /**
     * 启动周期性健康检查（每 HEALTH_CHECK_INTERVAL_MS 调用 listTools() 验证子进程存活）
     */
    private startHealthCheck;
    /**
     * 停止健康检查定时器
     */
    private stopHealthCheck;
    /**
     * 执行一次健康检查
     */
    private performHealthCheck;
    /**
     * 清理当前 MCP 连接和子进程资源
     */
    private cleanupConnection;
    /**
     * 更新连接状态并触发事件
     */
    private setConnectionState;
    /**
     * 统一日志输出
     */
    private log;
}
//# sourceMappingURL=mcp-client.d.ts.map