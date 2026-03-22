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
 * 模型偏好配置，从 VSCode settings 读取
 */
export interface ModelPreferences {
    defaultModelId: string;
    maxVisibleModels: number;
}
/**
 * LmService 负责与 vscode.lm API 交互，
 * 选择模型、发送请求、处理流式响应。
 * 支持通过 VSCode 配置隐藏模型、设置默认模型。
 */
export declare class LmService {
    private outputChannel;
    private selectedModelInstance;
    /** 模型选择变更事件 */
    private readonly _onDidChangeModel;
    readonly onDidChangeModel: vscode.Event<void>;
    constructor(outputChannel: vscode.OutputChannel);
    /** 获取当前已选择的模型信息（未选则返回 undefined） */
    get currentModel(): ModelInfo | undefined;
    /** 释放事件发射器 */
    dispose(): void;
    /**
     * 读取 VSCode 配置中的模型偏好设置
     * @returns 模型偏好配置 { defaultModelId, maxVisibleModels }
     */
    getModelPreferences(): ModelPreferences;
    /**
     * 列出所有可用的语言模型信息
     * 调用 vscode.lm.selectChatModels({}) 获取全量模型列表，
     * 并根据 browserAgent.models.hiddenModelIds 配置过滤掉隐藏模型
     * @returns 过滤后的可用模型信息数组
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
     * 选择可用的语言模型
     * 优先级：1) 已通过 selectModelById 指定的模型
     *         2) browserAgent.models.defaultModelId 配置的模型
     *         3) gpt-4o 家族
     *         4) 任意 copilot 模型
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