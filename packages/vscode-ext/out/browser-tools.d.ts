import * as vscode from 'vscode';
import { WsServer } from './ws-server';
import { McpToolResult } from './mcp-client';
/** JSON Schema 属性定义 */
interface JsonSchemaProperty {
    type: string;
    description: string;
    enum?: string[];
    default?: unknown;
}
/** 浏览器工具定义（类似 MCP Tool 的结构） */
export interface BrowserToolDef {
    /** 工具名称（browser_ 前缀，如 browser_click） */
    name: string;
    /** 工具描述（供 LLM 理解用途） */
    description: string;
    /** 输入参数的 JSON Schema */
    inputSchema: {
        type: 'object';
        properties: Record<string, JsonSchemaProperty>;
        required: string[];
    };
}
/**
 * BrowserToolProvider 提供原生浏览器操作工具集，通过 WebSocket 与 Chrome 插件通信执行。
 *
 * 设计对齐 McpClient 接口，使 AgentLoop 可以无缝切换工具来源：
 * - listTools() → 返回工具定义列表（名称 + 描述）
 * - callTool(name, args) → 执行工具并返回 McpToolResult 格式结果
 *
 * 工具调用流程：
 * 1. callTool('browser_click', { selector: '#btn' })
 * 2. 映射 browser_click → Chrome ActionType 'click'
 * 3. 通过 WsServer.sendAndWait 发送 tool_execute 消息
 * 4. Chrome 侧 ToolBridge 收到 → 通过 background → content script 执行
 * 5. Chrome 返回 tool_result → WsServer 匹配 requestId → resolve Promise
 * 6. 转换 ToolResultPayload → McpToolResult 格式返回
 */
export declare class BrowserToolProvider {
    private readonly wsServer;
    private readonly outputChannel;
    /** 工具执行超时时间（毫秒） */
    private readonly toolTimeoutMs;
    /** 状态变更事件（与 McpClient 接口对齐） */
    private readonly _onDidChangeState;
    readonly onDidChangeState: vscode.Event<void>;
    constructor(wsServer: WsServer, outputChannel: vscode.OutputChannel, toolTimeoutMs?: number);
    /**
     * 是否可用（WebSocket 有已连接的 Chrome 客户端）
     * 对齐 McpClient.connected 接口
     */
    get connected(): boolean;
    /**
     * 已注册的工具名称和描述列表（对齐 McpClient.discoveredTools）
     */
    get discoveredTools(): ReadonlyArray<{
        name: string;
        description?: string;
    }>;
    /**
     * 返回完整的工具定义列表（含 inputSchema）
     */
    listToolDefs(): BrowserToolDef[];
    /**
     * 返回工具列表（对齐 McpClient.listTools 接口）
     */
    listTools(): Promise<{
        name: string;
        description?: string;
    }[]>;
    /**
     * 执行浏览器工具调用
     *
     * 将 browser_ 前缀的工具名映射到 Chrome 侧 ActionType，
     * 通过 WebSocket tool_execute 协议发送到 Chrome 执行，
     * 返回 McpToolResult 格式（与 McpClient.callTool 对齐）。
     *
     * @param toolName 工具名称（如 browser_click）
     * @param args 工具参数（如 { selector: '#btn' }）
     * @returns McpToolResult 格式的结果
     */
    callTool(toolName: string, args?: Record<string, unknown>): Promise<McpToolResult>;
    /**
     * 释放资源
     */
    dispose(): void;
    /**
     * 映射参数名（从 browser tool 参数名 → BrowserAction 字段名）
     */
    private mapArgs;
    /**
     * 将 ToolResultPayload 转换为 McpToolResult 格式
     * 使 AgentLoop 可以统一处理 MCP 工具和浏览器工具的返回值
     */
    private toMcpToolResult;
}
export {};
//# sourceMappingURL=browser-tools.d.ts.map