import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import { LmService } from './lm-service';
import { WsServer, BridgeMessage } from './ws-server';
import { McpClient } from './mcp-client';
import { BrowserToolProvider } from './browser-tools';
import { SkillRegistry } from './skill-registry';
import { SkillRunner } from './skill-runner';
import { LlmRequestCollector } from './llm-request-collector';
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
    /** LLM 请求细节采集器，记录每次 chat/agent 请求的完整链路数据 */
    private readonly llmCollector;
    /** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
    private readonly activeChatTokens;
    /** 已注册 close 监听的 WebSocket 集合，避免重复注册 */
    private readonly wsCloseRegistered;
    constructor(lmService: LmService, wsServer: WsServer, mcpClient: McpClient, outputChannel: vscode.OutputChannel, browserToolProvider: BrowserToolProvider, skillRegistry?: SkillRegistry, skillRunner?: SkillRunner);
    /**
     * 注册 WebSocket close 事件监听器（每个 ws 只注册一次），
     * 断开时自动 cancel + dispose 对应 CTS 并从 Map 中删除，防止内存泄漏。
     */
    private ensureWsCloseHandler;
    /**
     * 若同一 WebSocket 上已有活跃的 CTS（如快速重发 chat），先取消并释放旧的。
     */
    private disposeExistingCts;
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
     * 处理 skill_list：返回所有可用 Skill 列表（供 Chrome Skill 面板展示）
     */
    private handleSkillList;
    /**
     * 处理 skill_execute：执行指定 Skill，通过 skill_progress 实时推送进度，
     * 完成后发送 skill_complete
     */
    private handleSkillExecute;
    /**
     * 获取 LLM 请求采集器实例（供外部读取请求细节）
     */
    getLlmCollector(): LlmRequestCollector;
    /**
     * 根据浏览器上下文动态构建 system prompt
     */
    private buildSystemPrompt;
}
//# sourceMappingURL=message-handler.d.ts.map