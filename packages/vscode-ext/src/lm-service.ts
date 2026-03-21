// lm-service.ts — 封装 vscode.lm API，提供语言模型调用能力
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
export class LmService {
  private outputChannel: vscode.OutputChannel;
  private selectedModelInstance: vscode.LanguageModelChat | undefined;

  /** 模型选择变更事件 */
  private readonly _onDidChangeModel = new vscode.EventEmitter<void>();
  readonly onDidChangeModel = this._onDidChangeModel.event;

  constructor(outputChannel: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
  }

  /** 获取当前已选择的模型信息（未选则返回 undefined） */
  get currentModel(): ModelInfo | undefined {
    if (!this.selectedModelInstance) {
      return undefined;
    }
    const m = this.selectedModelInstance;
    return {
      id: m.id,
      name: m.name,
      vendor: m.vendor,
      family: m.family,
      maxInputTokens: m.maxInputTokens,
    };
  }

  /** 释放事件发射器 */
  dispose(): void {
    this._onDidChangeModel.dispose();
  }

  /**
   * 列出所有可用的语言模型信息
   * 调用 vscode.lm.selectChatModels({}) 获取全量模型列表
   * @returns 可用模型信息数组
   */
  async listModels(): Promise<ModelInfo[]> {
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
  async selectModelById(id: string): Promise<boolean> {
    const models = await vscode.lm.selectChatModels({});
    const target = models.find((m) => m.id === id);
    if (target) {
      this.selectedModelInstance = target;
      this.outputChannel.appendLine(`[LmService] 已手动选择模型: ${target.name} (id: ${target.id})`);
      this._onDidChangeModel.fire();
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
  async selectModel(): Promise<vscode.LanguageModelChat | undefined> {
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
  async sendMessage(
    userMessage: string,
    systemPrompt?: string,
    token?: vscode.CancellationToken,
  ): Promise<string> {
    const model = await this.selectModel();
    if (!model) {
      throw new Error('无可用语言模型，请确认已安装 GitHub Copilot Chat 扩展并有有效订阅');
    }

    const messages: vscode.LanguageModelChatMessage[] = [];

    if (systemPrompt) {
      messages.push(vscode.LanguageModelChatMessage.User(systemPrompt));
    }
    messages.push(vscode.LanguageModelChatMessage.User(userMessage));

    let localCts: vscode.CancellationTokenSource | undefined;
    const cancellationToken = token ?? (localCts = new vscode.CancellationTokenSource()).token;

    try {
      const response = await model.sendRequest(messages, {}, cancellationToken);

      let fullText = '';
      for await (const fragment of response.text) {
        fullText += fragment;
      }

      this.outputChannel.appendLine(`[LmService] 响应完成，长度: ${fullText.length}`);
      return fullText;
    } catch (err) {
      if (err instanceof vscode.LanguageModelError) {
        this.outputChannel.appendLine(`[LmService] 模型错误: ${err.message} (code: ${err.code})`);
        throw new Error(`语言模型调用失败: ${err.message}`);
      }
      throw err;
    } finally {
      localCts?.dispose();
    }
  }

  /**
   * 发送消息并以流式方式回调每个片段
   * @param userMessage 用户输入的文本
   * @param onFragment 每次收到片段时的回调
   * @param systemPrompt 可选的系统提示
   * @param token 取消令牌
   */
  async sendMessageStreaming(
    userMessage: string,
    onFragment: (fragment: string) => void,
    systemPrompt?: string,
    token?: vscode.CancellationToken,
  ): Promise<string> {
    const model = await this.selectModel();
    if (!model) {
      throw new Error('无可用语言模型');
    }

    const messages: vscode.LanguageModelChatMessage[] = [];
    if (systemPrompt) {
      messages.push(vscode.LanguageModelChatMessage.User(systemPrompt));
    }
    messages.push(vscode.LanguageModelChatMessage.User(userMessage));

    let localCts: vscode.CancellationTokenSource | undefined;
    const cancellationToken = token ?? (localCts = new vscode.CancellationTokenSource()).token;
    try {
      const response = await model.sendRequest(messages, {}, cancellationToken);

      let fullText = '';
      for await (const fragment of response.text) {
        fullText += fragment;
        onFragment(fragment);
      }

      this.outputChannel.appendLine(`[LmService] 流式响应完成，长度: ${fullText.length}`);
      return fullText;
    } finally {
      localCts?.dispose();
    }
  }
}
