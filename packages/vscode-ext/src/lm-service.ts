// lm-service.ts — 封装 vscode.lm API，提供语言模型调用能力
import * as vscode from 'vscode';

/**
 * LmService 负责与 vscode.lm API 交互，
 * 选择模型、发送请求、处理流式响应。
 */
export class LmService {
  private outputChannel: vscode.OutputChannel;

  constructor(outputChannel: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
  }

  /**
   * 选择可用的语言模型（优先 gpt-4o）
   * 需要用户已安装 GitHub Copilot Chat 并有订阅
   */
  async selectModel(): Promise<vscode.LanguageModelChat | undefined> {
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

    const cancellationToken = token ?? new vscode.CancellationTokenSource().token;

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
    }
  }

  /**
   * 发送消息并以流式方式回调每个片段
   * @param userMessage 用户输入的文本
   * @param onFragment 每次收到片段时的回调
   * @param token 取消令牌
   */
  async sendMessageStreaming(
    userMessage: string,
    onFragment: (fragment: string) => void,
    token?: vscode.CancellationToken,
  ): Promise<string> {
    const model = await this.selectModel();
    if (!model) {
      throw new Error('无可用语言模型');
    }

    const messages = [
      vscode.LanguageModelChatMessage.User(userMessage),
    ];

    const cancellationToken = token ?? new vscode.CancellationTokenSource().token;
    const response = await model.sendRequest(messages, {}, cancellationToken);

    let fullText = '';
    for await (const fragment of response.text) {
      fullText += fragment;
      onFragment(fragment);
    }

    return fullText;
  }
}
