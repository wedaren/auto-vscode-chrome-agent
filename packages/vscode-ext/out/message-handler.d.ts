import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import { LmService } from './lm-service';
import { WsServer, BridgeMessage } from './ws-server';
import { McpClient } from './mcp-client';
/**
 * MessageHandler 封装所有 WebSocket 消息的处理逻辑。
 * 由 extension.ts 创建并注册到 WsServer.onMessage()。
 *
 * 当 McpClient 已连接时，handleChat 使用 AgentLoop.run() 进行 ReAct 循环，
 * 每步通过 agent_step 消息实时推送，循环结束发送 agent_complete。
 * 当 McpClient 未连接时，保持原有 LM 流式对话行为。
 */
export declare class MessageHandler {
    private readonly lmService;
    private readonly wsServer;
    private readonly mcpClient;
    private readonly outputChannel;
    /** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
    private readonly activeChatTokens;
    constructor(lmService: LmService, wsServer: WsServer, mcpClient: McpClient, outputChannel: vscode.OutputChannel);
    /**
     * 消息路由入口，根据 msg.type 分发到对应处理方法。
     * 应注册到 wsServer.onMessage()。
     */
    handle(ws: WebSocket, msg: BridgeMessage): void;
    /**
     * 处理 list_models：返回可用模型列表
     */
    private handleListModels;
    /**
     * 处理 select_model：选择指定模型
     */
    private handleSelectModel;
    /**
     * 处理 chat：根据 McpClient 连接状态选择路径
     * - McpClient 已连接 → AgentLoop 模式（agent_step / agent_complete）
     * - McpClient 未连接 → 原有 LM 流式对话模式（chat_response_chunk / chat_response_end）
     */
    private handleChat;
    /**
     * Agent 模式：McpClient 已连接时使用 AgentLoop.run() 进行 ReAct 循环
     * 每步通过 agent_step 实时推送，循环结束发送 agent_complete
     */
    private handleChatAgentMode;
    /**
     * 流式模式：McpClient 未连接时保持原有 LM 直接流式对话
     */
    private handleChatStreamMode;
    /**
     * 处理 cancel_chat：中断当前流式生成
     */
    private handleCancelChat;
    /**
     * 根据浏览器上下文动态构建 system prompt
     */
    private buildSystemPrompt;
}
//# sourceMappingURL=message-handler.d.ts.map