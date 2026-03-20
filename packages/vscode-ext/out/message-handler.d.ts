import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import { LmService } from './lm-service';
import { WsServer, BridgeMessage } from './ws-server';
/**
 * MessageHandler 封装所有 WebSocket 消息的处理逻辑。
 * 由 extension.ts 创建并注册到 WsServer.onMessage()。
 */
export declare class MessageHandler {
    private readonly lmService;
    private readonly wsServer;
    private readonly outputChannel;
    /** 跟踪每个 WebSocket 连接上正在进行的流式请求，以便支持 cancel_chat */
    private readonly activeChatTokens;
    constructor(lmService: LmService, wsServer: WsServer, outputChannel: vscode.OutputChannel);
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
     * 处理 chat：流式响应用户消息
     * 包括浏览器上下文→system prompt 构建和 CancellationToken 管理
     */
    private handleChat;
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