import * as vscode from 'vscode';
/**
 * 模型信息结构，用于向 Chrome 侧暴露可用模型列表
 */
export interface ModelInfo {
    id: string;
    name: string;
    vendor: string;
    family: string;
    maxInputTokens: number;
}
/**
 * LmService 负责与 vscode.lm API 交互，
 * 选择模型、发送请求、处理流式响应。
 */
export declare class LmService {
    private outputChannel;
    private selectedModelInstance;
    constructor(outputChannel: vscode.OutputChannel);
    /**
     * 列出所有可用的语言模型信息
     * 调用 vscode.lm.selectChatModels({}) 获取全量模型列表
     * @returns 可用模型信息数组
     */
    listModels(): Promise<ModelInfo[]>;
    /**
     * 根据模型 id 选择并缓存模型实例
     * 后续 sendMessage / sendMessageStreaming 将优先使用此模型
     * @param id 模型唯一标识
     * @returns 是否选择成功
     */
    selectModelById(id: string): Promise<boolean>;
    /**
     * 选择可用的语言模型（优先 gpt-4o）
     * 如果已通过 selectModelById 指定模型，则直接返回缓存
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
     * @param systemPrompt 可选的系统提示
     * @param token 取消令牌
     */
    sendMessageStreaming(userMessage: string, onFragment: (fragment: string) => void, systemPrompt?: string, token?: vscode.CancellationToken): Promise<string>;
}
//# sourceMappingURL=lm-service.d.ts.map