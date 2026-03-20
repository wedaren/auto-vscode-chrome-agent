"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LmService = void 0;
// lm-service.ts — 封装 vscode.lm API，提供语言模型调用能力
const vscode = __importStar(require("vscode"));
/**
 * LmService 负责与 vscode.lm API 交互，
 * 选择模型、发送请求、处理流式响应。
 */
class LmService {
    outputChannel;
    selectedModelInstance;
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
    }
    /**
     * 列出所有可用的语言模型信息
     * 调用 vscode.lm.selectChatModels({}) 获取全量模型列表
     * @returns 可用模型信息数组
     */
    async listModels() {
        const models = await vscode.lm.selectChatModels({});
        this.outputChannel.appendLine(`[LmService] 发现 ${models.length} 个可用模型`);
        return models.map((m) => ({
            id: m.id,
            name: m.name,
            vendor: m.vendor,
            family: m.family,
            maxInputTokens: m.maxInputTokens,
        }));
    }
    /**
     * 根据模型 id 选择并缓存模型实例
     * 后续 sendMessage / sendMessageStreaming 将优先使用此模型
     * @param id 模型唯一标识
     * @returns 是否选择成功
     */
    async selectModelById(id) {
        const models = await vscode.lm.selectChatModels({});
        const target = models.find((m) => m.id === id);
        if (target) {
            this.selectedModelInstance = target;
            this.outputChannel.appendLine(`[LmService] 已手动选择模型: ${target.name} (id: ${target.id})`);
            return true;
        }
        this.outputChannel.appendLine(`[LmService] 未找到 id 为 "${id}" 的模型`);
        return false;
    }
    /**
     * 选择可用的语言模型（优先 gpt-4o）
     * 如果已通过 selectModelById 指定模型，则直接返回缓存
     * 需要用户已安装 GitHub Copilot Chat 并有订阅
     */
    async selectModel() {
        // 如果已通过 selectModelById 指定模型，优先使用
        if (this.selectedModelInstance) {
            this.outputChannel.appendLine(`[LmService] 使用已选模型: ${this.selectedModelInstance.name}`);
            return this.selectedModelInstance;
        }
        // 优先选择 gpt-4o 家族
        const models = await vscode.lm.selectChatModels({
            vendor: 'copilot',
            family: 'gpt-4o',
        });
        if (models.length > 0) {
            this.outputChannel.appendLine(`[LmService] 已选择模型: ${models[0].name} (maxInputTokens: ${models[0].maxInputTokens})`);
            return models[0];
        }
        // 回退：选择任意可用模型
        const fallbackModels = await vscode.lm.selectChatModels({ vendor: 'copilot' });
        if (fallbackModels.length > 0) {
            this.outputChannel.appendLine(`[LmService] 回退模型: ${fallbackModels[0].name}`);
            return fallbackModels[0];
        }
        this.outputChannel.appendLine('[LmService] 未找到可用模型，请确认已安装 GitHub Copilot');
        return undefined;
    }
    /**
     * 发送用户消息到语言模型，返回完整响应文本
     * @param userMessage 用户输入的文本
     * @param systemPrompt 可选的系统提示
     * @param token 取消令牌
     */
    async sendMessage(userMessage, systemPrompt, token) {
        const model = await this.selectModel();
        if (!model) {
            throw new Error('无可用语言模型，请确认已安装 GitHub Copilot Chat 扩展并有有效订阅');
        }
        const messages = [];
        if (systemPrompt) {
            messages.push(vscode.LanguageModelChatMessage.User(systemPrompt));
        }
        messages.push(vscode.LanguageModelChatMessage.User(userMessage));
        const cancellationToken = token ?? new vscode.CancellationTokenSource().token;
        try {
            const response = await model.sendRequest(messages, {}, cancellationToken);
            let fullText = '';
            for await (const fragment of response.text) {
                fullText += fragment;
            }
            this.outputChannel.appendLine(`[LmService] 响应完成，长度: ${fullText.length}`);
            return fullText;
        }
        catch (err) {
            if (err instanceof vscode.LanguageModelError) {
                this.outputChannel.appendLine(`[LmService] 模型错误: ${err.message} (code: ${err.code})`);
                throw new Error(`语言模型调用失败: ${err.message}`);
            }
            throw err;
        }
    }
    /**
     * 发送消息并以流式方式回调每个片段
     * @param userMessage 用户输入的文本
     * @param onFragment 每次收到片段时的回调
     * @param systemPrompt 可选的系统提示
     * @param token 取消令牌
     */
    async sendMessageStreaming(userMessage, onFragment, systemPrompt, token) {
        const model = await this.selectModel();
        if (!model) {
            throw new Error('无可用语言模型');
        }
        const messages = [];
        if (systemPrompt) {
            messages.push(vscode.LanguageModelChatMessage.User(systemPrompt));
        }
        messages.push(vscode.LanguageModelChatMessage.User(userMessage));
        const cancellationToken = token ?? new vscode.CancellationTokenSource().token;
        const response = await model.sendRequest(messages, {}, cancellationToken);
        let fullText = '';
        for await (const fragment of response.text) {
            fullText += fragment;
            onFragment(fragment);
        }
        this.outputChannel.appendLine(`[LmService] 流式响应完成，长度: ${fullText.length}`);
        return fullText;
    }
}
exports.LmService = LmService;
//# sourceMappingURL=lm-service.js.map