import * as vscode from 'vscode';
/**
 * LmService 负责与 vscode.lm API 交互，
 * 选择模型、发送请求、处理流式响应。
 */
export declare class LmService {
    private outputChannel;
    constructor(outputChannel: vscode.OutputChannel);
    /**
     * 选择可用的语言模型（优先 gpt-4o）
     * 需要用户已安装 GitHub Copilot Chat 并有订阅
     */
    selectModel(): Promise<vscode.LanguageModelChat | undefined>;
    /**
     * 发送用户消息到语言模型，返回完整响应文本
     * @param userMessage 用户输入的文本
     * @param systemPrompt 可选的系统提示
     * @param token 取消令牌
     */
    sendMessage(userMessage: string, systemPrompt?: string, token?: vscode.CancellationToken): Promise<string>;
    /**
     * 发送消息并以流式方式回调每个片段
     * @param userMessage 用户输入的文本
     * @param onFragment 每次收到片段时的回调
     * @param token 取消令牌
     */
    sendMessageStreaming(userMessage: string, onFragment: (fragment: string) => void, token?: vscode.CancellationToken): Promise<string>;
}
//# sourceMappingURL=lm-service.d.ts.map