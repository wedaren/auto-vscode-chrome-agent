// report-generator.ts — 深度报告生成模块，负责多页面探索和 Markdown 报告输出
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpClient, McpToolResult } from './mcp-client';
import { WsServer, BridgeMessage } from './ws-server';

/** 单个页面探索结果 */
export interface PageExploration {
  url: string;
  title: string;
  content: string;
  timestamp: number;
}

/** 报告生成配置 */
export interface ReportConfig {
  /** 用户的研究主题/问题 */
  topic: string;
  /** 起始 URL（当前页面） */
  startUrl?: string;
  /** 最大探索页面数 */
  maxPages: number;
  /** 当前页面上下文（选中文本等） */
  pageContext?: string;
  /** 会话 ID */
  sessionId: string;
}

/** 报告生成状态 */
export type ReportStatus = 'idle' | 'exploring' | 'analyzing' | 'generating' | 'done' | 'error';

/**
 * ReportGenerator 实现深度报告生成流程：
 *
 * 1. 接收用户主题和当前页面上下文
 * 2. 通过 MCP (chrome-devtools-mcp) 自主探索多个页面
 * 3. 收集各页面关键信息
 * 4. 使用 vscode.lm 生成结构化 Markdown 报告
 * 5. 通过 WebSocket 将报告发送到 Chrome side panel
 *
 * 遵循 program.md 的规则：最多同时 3 个 tab，完成后自动关闭。
 */
export class ReportGenerator {
  private lmService: LmService;
  private mcpClient: McpClient;
  private wsServer: WsServer;
  private outputChannel: vscode.OutputChannel;
  private _status: ReportStatus = 'idle';
  private explorations: PageExploration[] = [];
  private cancellationSource: vscode.CancellationTokenSource | null = null;

  constructor(
    lmService: LmService,
    mcpClient: McpClient,
    wsServer: WsServer,
    outputChannel: vscode.OutputChannel,
  ) {
    this.lmService = lmService;
    this.mcpClient = mcpClient;
    this.wsServer = wsServer;
    this.outputChannel = outputChannel;
  }

  /** 当前报告生成状态 */
  get status(): ReportStatus {
    return this._status;
  }

  /**
   * 触发深度报告生成（主入口）
   * @param config 报告配置
   * @returns 生成的 Markdown 报告
   */
  async generate(config: ReportConfig): Promise<string> {
    if (this._status !== 'idle') {
      throw new Error('报告正在生成中，请等待完成');
    }

    this.cancellationSource = new vscode.CancellationTokenSource();
    this.explorations = [];

    try {
      // Phase 1: 探索多个页面
      this._status = 'exploring';
      this.notifyProgress(config.sessionId, '正在探索相关页面...');
      await this.explorePages(config);

      // Phase 2: 分析收集到的信息
      this._status = 'analyzing';
      this.notifyProgress(config.sessionId, `已探索 ${this.explorations.length} 个页面，正在分析...`);
      const analysis = await this.analyzeExplorations(config.topic);

      // Phase 3: 生成 Markdown 报告
      this._status = 'generating';
      this.notifyProgress(config.sessionId, '正在生成报告...');
      const report = await this.generateMarkdownReport(config.topic, analysis);

      // 完成：发送报告到 Chrome side panel
      this._status = 'done';
      this.sendReport(config.sessionId, report);
      this.outputChannel.appendLine(`[ReportGenerator] 报告生成完成，长度: ${report.length}`);

      return report;
    } catch (err) {
      this._status = 'error';
      const message = err instanceof Error ? err.message : String(err);
      this.outputChannel.appendLine(`[ReportGenerator] 报告生成失败: ${message}`);
      this.notifyProgress(config.sessionId, `报告生成失败: ${message}`);
      throw err;
    } finally {
      this._status = 'idle';
      this.cancellationSource?.dispose();
      this.cancellationSource = null;
    }
  }

  /**
   * 取消正在进行的报告生成
   */
  cancel(): void {
    if (this.cancellationSource) {
      this.cancellationSource.cancel();
      this._status = 'idle';
      this.outputChannel.appendLine('[ReportGenerator] 报告生成已取消');
    }
  }

  /**
   * 多页面探索：使用 LM 决定要访问哪些页面，然后通过 MCP 导航并提取内容
   */
  private async explorePages(config: ReportConfig): Promise<void> {
    const { topic, startUrl, maxPages, pageContext } = config;

    // Step 1: 如果有起始页面上下文，先记录
    if (startUrl && pageContext) {
      this.explorations.push({
        url: startUrl,
        title: '当前页面',
        content: pageContext,
        timestamp: Date.now(),
      });
    }

    // Step 2: 让 LM 规划要探索的 URL 列表
    const planPrompt = this.buildExplorationPlanPrompt(topic, startUrl, pageContext);
    const planResponse = await this.lmService.sendMessage(
      planPrompt,
      'You are a research planning agent. Output ONLY a JSON array of objects with "url" and "reason" fields. No markdown, no explanation.',
      this.cancellationSource?.token,
    );

    const urlsToExplore = this.parseUrlPlan(planResponse, maxPages);
    this.outputChannel.appendLine(
      `[ReportGenerator] 计划探索 ${urlsToExplore.length} 个页面`,
    );

    // Step 3: 逐页探索（遵循最多 3 个 tab 的限制）
    for (const item of urlsToExplore) {
      if (this.cancellationSource?.token.isCancellationRequested) {
        break;
      }

      try {
        const exploration = await this.exploreSinglePage(item.url);
        if (exploration) {
          this.explorations.push(exploration);
          this.outputChannel.appendLine(
            `[ReportGenerator] 已探索: ${item.url} (${exploration.content.length} chars)`,
          );
        }
      } catch (err) {
        this.outputChannel.appendLine(
          `[ReportGenerator] 页面探索失败: ${item.url} - ${err instanceof Error ? err.message : String(err)}`,
        );
        // 继续探索其他页面
      }
    }
  }

  /**
   * 探索单个页面：导航 → 提取内容
   */
  private async exploreSinglePage(url: string): Promise<PageExploration | null> {
    if (!this.mcpClient.connected) {
      this.outputChannel.appendLine('[ReportGenerator] MCP 未连接，尝试连接...');
      await this.mcpClient.connect();
    }

    // 导航到目标页面
    await this.mcpClient.callTool('navigate', { url });

    // 等待页面加载
    await this.delay(2000);

    // 提取页面内容
    const contentResult = await this.mcpClient.callTool('evaluate', {
      expression: 'JSON.stringify({ title: document.title, url: location.href, text: document.body.innerText.substring(0, 5000) })',
    });

    const pageData = this.extractPageData(contentResult);
    if (!pageData) {
      return null;
    }

    return {
      url: pageData.url || url,
      title: pageData.title || url,
      content: pageData.text || '',
      timestamp: Date.now(),
    };
  }

  /**
   * 分析所有探索结果，提取关键发现
   */
  private async analyzeExplorations(topic: string): Promise<string> {
    const explorationSummary = this.explorations
      .map((e, i) => `--- Page ${i + 1}: ${e.title} (${e.url}) ---\n${e.content.substring(0, 3000)}`)
      .join('\n\n');

    const analysisPrompt = `You are a research analyst. Analyze the following web page contents related to the topic: "${topic}"

${explorationSummary}

Provide a structured analysis with:
1. Key findings from each page
2. Common themes and patterns
3. Contradictions or gaps
4. Notable data points and quotes

Output your analysis in plain text, organized by theme.`;

    return this.lmService.sendMessage(
      analysisPrompt,
      'You are a thorough research analyst. Be comprehensive but concise.',
      this.cancellationSource?.token,
    );
  }

  /**
   * 基于分析结果生成最终 Markdown 报告
   */
  private async generateMarkdownReport(topic: string, analysis: string): Promise<string> {
    const reportPrompt = `Based on the following research analysis, generate a comprehensive deep-dive report in Markdown format.

Topic: "${topic}"
Pages explored: ${this.explorations.length}
Sources: ${this.explorations.map((e) => `- ${e.title}: ${e.url}`).join('\n')}

Analysis:
${analysis}

Requirements:
- Title with the topic
- Executive summary (2-3 sentences)
- Detailed findings organized by theme with headers (##, ###)
- Key data points highlighted
- Source references with URLs
- Conclusion with actionable insights
- Generated timestamp

Output ONLY the Markdown report, no preamble.`;

    return this.lmService.sendMessage(
      reportPrompt,
      'You are a professional report writer. Generate well-structured Markdown reports.',
      this.cancellationSource?.token,
    );
  }

  /**
   * 构建探索规划提示词
   */
  private buildExplorationPlanPrompt(
    topic: string,
    startUrl?: string,
    pageContext?: string,
  ): string {
    let prompt = `I need to research the topic: "${topic}"\n`;
    if (startUrl) {
      prompt += `Starting from: ${startUrl}\n`;
    }
    if (pageContext) {
      prompt += `Current page context: ${pageContext.substring(0, 1000)}\n`;
    }
    prompt += `\nSuggest up to 5 URLs to explore for this research. Include search engine queries if needed (use https://www.google.com/search?q=... format).\nReturn a JSON array of objects: [{"url": "...", "reason": "..."}]`;
    return prompt;
  }

  /**
   * 解析 LM 返回的 URL 规划
   */
  private parseUrlPlan(
    response: string,
    maxPages: number,
  ): { url: string; reason: string }[] {
    try {
      // 提取 JSON 数组（可能被包裹在 markdown 代码块中）
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        this.outputChannel.appendLine('[ReportGenerator] 无法解析 URL 规划 JSON');
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]) as { url: string; reason: string }[];
      return parsed.slice(0, maxPages);
    } catch {
      this.outputChannel.appendLine('[ReportGenerator] URL 规划 JSON 解析失败');
      return [];
    }
  }

  /**
   * 从 MCP 工具结果中提取页面数据
   */
  private extractPageData(
    result: McpToolResult,
  ): { title: string; url: string; text: string } | null {
    try {
      if (!result.content || result.content.length === 0) {
        return null;
      }

      const firstContent = result.content[0] as { text?: string };
      if (!firstContent.text) {
        return null;
      }

      return JSON.parse(firstContent.text) as { title: string; url: string; text: string };
    } catch {
      return null;
    }
  }

  /**
   * 通过 WebSocket 通知 Chrome 侧进度
   */
  private notifyProgress(sessionId: string, message: string): void {
    this.wsServer.broadcast({
      type: 'report_progress',
      payload: { status: this._status, message },
      sessionId,
    });
  }

  /**
   * 通过 WebSocket 发送最终报告到 Chrome side panel
   */
  private sendReport(sessionId: string, markdown: string): void {
    this.wsServer.broadcast({
      type: 'report_result',
      payload: { markdown, pageCount: this.explorations.length },
      sessionId,
    });
  }

  /**
   * 工具函数：延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
