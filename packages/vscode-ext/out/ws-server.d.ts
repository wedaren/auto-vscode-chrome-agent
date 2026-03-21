import { WebSocket } from 'ws';
import * as vscode from 'vscode';
/** Chrome ↔ VSCode 桥接消息协议 */
export interface BridgeMessage {
    type: string;
    payload: unknown;
    sessionId: string;
}
/** tool_result 消息的 payload 结构 */
export interface ToolResultPayload {
    requestId: string;
    success: boolean;
    data?: unknown;
    error?: string;
}
/**
 * WsServer 封装 WebSocket 服务端逻辑。
 * 在 VSCode 插件 activate() 中创建，deactivate() 时自动关闭。
 */
export declare class WsServer {
    private wss;
    /** 当前唯一活跃客户端（单客户端模式：新连接到达时踢掉旧连接） */
    private activeClient;
    private outputChannel;
    private _port;
    private _listening;
    /**
     * 待响应的请求 Map：requestId → PendingRequest
     * 用于 sendAndWait() 发送 tool_execute 后，通过 requestId 匹配 tool_result 响应
     */
    private readonly pendingRequests;
    /** disposed 标志：dispose 后 pendingRequests 拒绝新增 */
    private _disposed;
    /** 心跳检测定时器（30s 间隔 ping activeClient，pong 超时自动断开死连接） */
    private heartbeatInterval;
    /** 心跳间隔毫秒数 */
    private static readonly HEARTBEAT_INTERVAL_MS;
    /** 单客户端存活标记（收到 pong 时标记为 true） */
    private isClientAlive;
    /** 当前活跃客户端的 sessionId（从第一条消息中获取） */
    private activeSessionId;
    /** 状态变更事件，当 listening / clientCount 变化时触发 */
    private readonly _onDidChangeState;
    readonly onDidChangeState: vscode.Event<void>;
    constructor(outputChannel: vscode.OutputChannel, port?: number);
    /** 当前监听端口 */
    get port(): number;
    /** 是否正在监听 */
    get listening(): boolean;
    /** 已连接客户端数（单客户端模式：0 或 1） */
    get clientCount(): number;
    /** 获取当前活跃客户端（单客户端模式：直接返回 activeClient） */
    get firstClient(): WebSocket | null;
    /**
     * 启动 WebSocket 服务端
     * @returns Promise 在服务端开始监听后 resolve
     */
    start(): Promise<void>;
    /** 消息处理回调，供外部注册自定义处理逻辑 */
    private externalHandler;
    /**
     * 注册外部消息处理器（用于 extension.ts 中接入 LmService 等）
     */
    onMessage(handler: (ws: WebSocket, msg: BridgeMessage) => void): void;
    /**
     * 处理收到的桥接消息
     */
    private handleMessage;
    /**
     * 向指定客户端发送消息
     */
    send(ws: WebSocket, msg: BridgeMessage): void;
    /**
     * 向活跃客户端发送消息（单客户端模式下等同于 send(activeClient, msg)）
     */
    broadcast(msg: BridgeMessage): void;
    /**
     * 发送消息并等待 Chrome 侧的 tool_result 响应（请求-响应匹配）
     *
     * 工作原理：
     * 1. 如果 payload 中没有 requestId，自动生成一个 UUID
     * 2. 创建一个 Promise，存入 pendingRequests Map（以 requestId 为 key）
     * 3. 发送消息到 Chrome 侧
     * 4. Chrome 侧处理后返回 tool_result（含相同的 requestId）
     * 5. handleMessage 中 tool_result 分支匹配 requestId 并 resolve Promise
     * 6. 如果超时未收到响应，自动 reject
     *
     * @param ws - 目标 WebSocket 客户端连接
     * @param msg - 要发送的 BridgeMessage（通常 type='tool_execute'）
     * @param timeoutMs - 超时毫秒数，默认 30000（30 秒）
     * @returns Promise<ToolResultPayload> — Chrome 侧返回的工具执行结果
     * @throws Error — 超时或发送失败时
     */
    sendAndWait(ws: WebSocket, msg: BridgeMessage, timeoutMs?: number): Promise<ToolResultPayload>;
    /**
     * 启动心跳检测定时器（单客户端模式）。
     * 每 30 秒检测 activeClient：
     * - 如果上次 ping 后未收到 pong（isClientAlive=false），说明是死连接 → terminate
     * - 否则标记 isClientAlive=false 并发送 ping，等待下次检测周期收到 pong
     */
    private startHeartbeat;
    /**
     * 停止心跳检测定时器
     */
    private stopHeartbeat;
    /**
     * 关闭服务端和所有连接
     */
    dispose(): void;
}
//# sourceMappingURL=ws-server.d.ts.map