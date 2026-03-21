import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import { LmService } from './lm-service';
import { WsServer, BridgeMessage } from './ws-server';
import { McpClient } from './mcp-client';
import { BrowserToolProvider } from './browser-tools';
import { SkillRegistry } from './skill-registry';
import { SkillRunner } from './skill-runner';
/**
 * MessageHandler 封装所有 WebSocket 消息的处理逻辑。
 * 由 extension.ts 创建并注册到 WsServer.onMessage()。
 *
 * 当 McpClient 或 BrowserToolProvider 可用时，handleChat 使用 AgentLoop.run() 进行 ReAct 循环，
 * 每步通过 agent_step 消息实时推送，循环结束发送 agent_complete。
 * 只要 Chrome 有 WebSocket 连接就有原生浏览器工具可用，无需 MCP 也能进入 Agent 模式。
 * 当两者都不可用时，保持原有 LM 流式对话行为。
 */
export declare class MessageHandler {
    private readonly lmService;
    private readonly wsServer;
    private readonly mcpClient;
    private readonly browserToolProvider;
    private readonly skillRegistry?;
    private readonly skillRunner?;
    private readonly outputChannel;
    /** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
    private readonly activeChatTokens;
    constructor(lmService: LmService, wsServer: WsServer, mcpClient: McpClient, outputChannel: vscode.OutputChannel, browserToolProvider: BrowserToolProvider, skillRegistry?: SkillRegistry, skillRunner?: SkillRunner);
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
     * 处理 chat：根据工具可用性选择路径
     * - McpClient 已连接 或 BrowserToolProvider 有已连接客户端 → AgentLoop 模式（agent_step / agent_complete）
     * - 两者都不可用 → 原有 LM 流式对话模式（chat_response_chunk / chat_response_end）
     */
    private handleChat;
    /**
     * Agent 模式：McpClient 或 BrowserToolProvider 可用时使用 AgentLoop.run() 进行 ReAct 循环
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