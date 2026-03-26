// deep-research-engine.ts — 深度调研引擎，实现迭代式研究循环 + 研究计划 + 引用追踪
// 职责：接收用户主题 → 制定研究计划（子问题 + 搜索策略）→ 迭代式搜索/阅读/推理/差距检测
//       → 每个信息点绑定来源 URL + 页面标题 + 原文摘录 → 生成带引用的结构化 Markdown 报告
// 使用 browser_* 工具（BrowserToolProvider）进行页面导航和内容提取
import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { BrowserToolProvider } from './browser-tools';
import { WsServer, BridgeMessage } from './ws-server';

// ────────────────────────────────────────────────────────────────
// 数据模型
// ────────────────────────────────────────────────────────────────

/** 单条引用信息 */
export interface Citation {
  /** 引用编号（从 1 开始，全局自增） */
  id: number;
  /** 来源 URL */
  url: string;
  /** 页面标题 */
  title: string;
  /** 原文摘录（最多 300 字符） */
  excerpt: string;
  /** 采集时间戳 */
  timestamp: number;
}

/** 与引用绑定的单条发现 */
export interface Finding {
  /** 发现内容（简短结论或要点） */
  content: string;
  /** 绑定的引用 */
  citation: Citation;
}

/** 搜索策略条目 */
export interface SearchStrategy {
  /** 搜索查询词 */
  query: string;
  /** 为什么要搜这个 */
  rationale: string;
  /** 是否已执行 */
  executed: boolean;
}

/** 子问题状态 */
export type SubQuestionStatus = 'pending' | 'investigating' | 'answered' | 'gap';

/** 研究计划中的子问题 */
export interface SubQuestion {
  /** 子问题 ID（sq_1, sq_2, ...） */
  id: string;
  /** 子问题描述 */
  question: string;
  /** 当前状态 */
  status: SubQuestionStatus;
  /** 已收集的发现列表 */
  findings: Finding[];
}

/** 研究计划 */
export interface ResearchPlan {
  /** 研究主题 */
  topic: string;
  /** 子问题列表 */
  subQuestions: SubQuestion[];
  /** 搜索策略列表 */
  searchStrategies: SearchStrategy[];
  /** 当前迭代轮次（从 1 开始） */
  iteration: number;
  /** 最大迭代轮次 */
  maxIterations: number;
  /** 已探索页面数 */
  pagesExplored: number;
  /** 最大探索页面数 */
  maxPages: number;
}

/** 页面探索结果 */
export interface PageExploration {
  url: string;
  title: string;
  content: string;
  timestamp: number;
}

/** 深度调研配置 */
export interface DeepResearchConfig {
  /** 研究主题 */
  topic: string;
  /** 起始 URL（当前页面） */
  startUrl?: string;
  /** 当前页面上下文（选中文本等） */
  pageContext?: string;
  /** 会话 ID */
  sessionId: string;
  /** 最大迭代轮次（默认 3） */
  maxIterations?: number;
  /** 最大探索页面数（默认 15） */
  maxPages?: number;
}

/** 深度调研状态 */
export type DeepResearchStatus =
  | 'idle'
  | 'planning'
  | 'searching'
  | 'reading'
  | 'reasoning'
  | 'gap_detecting'
  | 'generating'
  | 'done'
  | 'error';

/** 深度调研结果 */
export interface DeepResearchResult {
  /** 最终 Markdown 报告 */
  report: string;
  /** 研究计划（含最终状态） */
  plan: ResearchPlan;
  /** 所有引用 */
  citations: Citation[];
  /** 总迭代次数 */
  totalIterations: number;
  /** 探索的页面数 */
  totalPages: number;
}

// ────────────────────────────────────────────────────────────────
// CitationTracker — 引用追踪器
// ────────────────────────────────────────────────────────────────

/**
 * CitationTracker 管理所有引用的全局编号和去重。
 * 同一 URL 不会重复创建引用，只返回已有编号。
 */
export class CitationTracker {
  private citations: Citation[] = [];
  private urlIndex = new Map<string, Citation>();

  /** 添加或获取已有引用，返回引用对象 */
  addOrGet(url: string, title: string, excerpt: string): Citation {
    const existing = this.urlIndex.get(url);
    if (existing) {
      // 更新摘录（后续阅读可能提取到更好的内容）
      if (excerpt.length > existing.excerpt.length) {
        existing.excerpt = excerpt.substring(0, 300);
      }
      return existing;
    }

    const citation: Citation = {
      id: this.citations.length + 1,
      url,
      title: title || url,
      excerpt: excerpt.substring(0, 300),
      timestamp: Date.now(),
    };
    this.citations.push(citation);
    this.urlIndex.set(url, citation);
    return citation;
  }

  /** 获取所有引用（按编号排序） */
  getAll(): Citation[] {
    return [...this.citations];
  }

  /** 获取引用数量 */
  get count(): number {
    return this.citations.length;
  }

  /** 生成参考文献列表 Markdown */
  toMarkdown(): string {
    if (this.citations.length === 0) {
      return '';
    }
    const lines = this.citations.map(
      (c) => `[${c.id}] [${c.title}](${c.url})  \n> ${c.excerpt}`,
    );
    return `## 参考文献\n\n${lines.join('\n\n')}`;
  }

  /** 重置 */
  reset(): void {
    this.citations = [];
    this.urlIndex.clear();
  }
}

// ────────────────────────────────────────────────────────────────
// DeepResearchEngine — 深度调研引擎
// ────────────────────────────────────────────────────────────────

/**
 * DeepResearchEngine 实现 Gemini 风格的深度调研流程：
 *
 * 迭代式研究循环（最多 3 轮，15 页上限）：
 *   1. Plan    — LM 分析主题，生成子问题列表和搜索策略
 *   2. Search  — 通过 browser_navigate 搜索引擎，browser_get_links 发现 URL
 *   3. Read    — 通过 browser_navigate + browser_get_text 提取页面内容
 *   4. Reason  — LM 分析发现，为子问题绑定带引用的结论
 *   5. Gap     — LM 检测未回答的子问题，识别信息差距
 *   6. Re-plan — 如有差距且未达上限，生成新搜索策略，进入下一轮
 *
 * 所有浏览器操作通过 BrowserToolProvider (browser_* 工具) 执行。
 */
export class DeepResearchEngine {
  private lmService: LmService;
  private browserTools: BrowserToolProvider;
  private wsServer: WsServer;
  private outputChannel: vscode.OutputChannel;
  private _status: DeepResearchStatus = 'idle';
  private cancellationSource: vscode.CancellationTokenSource | null = null;
  private citationTracker = new CitationTracker();

  constructor(
    lmService: LmService,
    browserTools: BrowserToolProvider,
    wsServer: WsServer,
    outputChannel: vscode.OutputChannel,
  ) {
    this.lmService = lmService;
    this.browserTools = browserTools;
    this.wsServer = wsServer;
    this.outputChannel = outputChannel;
  }

  /** 当前调研状态 */
  get status(): DeepResearchStatus {
    return this._status;
  }

  /**
   * 启动深度调研（主入口）
   */
  async generate(config: DeepResearchConfig): Promise<DeepResearchResult> {
    if (this._status !== 'idle') {
      throw new Error('调研正在进行中，请等待完成');
    }

    this.cancellationSource = new vscode.CancellationTokenSource();
    this.citationTracker.reset();

    const maxIterations = config.maxIterations ?? 3;
    const maxPages = config.maxPages ?? 15;

    try {
      // ── Phase 1: 制定研究计划 ──
      this._status = 'planning';
      this.notifyProgress(config.sessionId, 'planning', '正在分析主题，制定研究计划...');
      const plan = await this.createResearchPlan(config, maxIterations, maxPages);
      this.notifyPlan(config.sessionId, plan);
      this.log(`研究计划已制定：${plan.subQuestions.length} 个子问题，${plan.searchStrategies.length} 个搜索策略`);

      // ── Phase 2-5: 迭代式研究循环 ──
      while (plan.iteration <= plan.maxIterations && plan.pagesExplored < plan.maxPages) {
        this.checkCancellation();

        this.log(`=== 迭代 ${plan.iteration}/${plan.maxIterations} 开始 ===`);

        // Search: 执行搜索策略，发现新 URL
        this._status = 'searching';
        this.notifyProgress(
          config.sessionId,
          'searching',
          `迭代 ${plan.iteration}: 正在搜索相关页面...`,
        );
        const urls = await this.executeSearchStrategies(plan);

        // Read: 逐页阅读，提取内容
        this._status = 'reading';
        const explorations = await this.readPages(plan, urls, config.sessionId);
        this.log(`本轮阅读了 ${explorations.length} 个页面`);

        // Reason: 分析发现，为子问题绑定结论
        this._status = 'reasoning';
        this.notifyProgress(
          config.sessionId,
          'reasoning',
          `迭代 ${plan.iteration}: 正在分析 ${explorations.length} 个页面的内容...`,
        );
        await this.reasonAboutFindings(plan, explorations);

        // Gap-detect: 检测信息差距
        this._status = 'gap_detecting';
        this.notifyProgress(
          config.sessionId,
          'gap_detecting',
          `迭代 ${plan.iteration}: 检测信息差距...`,
        );
        const hasGaps = await this.detectGaps(plan);

        if (!hasGaps || plan.iteration >= plan.maxIterations || plan.pagesExplored >= plan.maxPages) {
          this.log(`迭代结束：hasGaps=${hasGaps}, iteration=${plan.iteration}, pagesExplored=${plan.pagesExplored}`);
          break;
        }

        // Re-plan: 为下一轮生成新搜索策略
        this.log('存在信息差距，生成新搜索策略...');
        await this.replan(plan);
        plan.iteration += 1;
      }

      // ── Phase 6: 生成结构化报告 ──
      this._status = 'generating';
      this.notifyProgress(config.sessionId, 'generating', '正在生成深度调研报告...');
      const report = await this.generateStructuredReport(plan);

      // 完成
      this._status = 'done';
      const result: DeepResearchResult = {
        report,
        plan,
        citations: this.citationTracker.getAll(),
        totalIterations: plan.iteration,
        totalPages: plan.pagesExplored,
      };

      this.sendReport(config.sessionId, result);
      this.log(`深度调研完成：${plan.pagesExplored} 页, ${this.citationTracker.count} 条引用, ${plan.iteration} 轮迭代`);

      return result;
    } catch (err) {
      this._status = 'error';
      const message = err instanceof Error ? err.message : String(err);
      this.log(`深度调研失败: ${message}`);
      this.notifyProgress(config.sessionId, 'error', `调研失败: ${message}`);
      throw err;
    } finally {
      this._status = 'idle';
      this.cancellationSource?.dispose();
      this.cancellationSource = null;
    }
  }

  /**
   * 取消正在进行的调研
   */
  cancel(): void {
    if (this.cancellationSource) {
      this.cancellationSource.cancel();
      this._status = 'idle';
      this.log('深度调研已取消');
    }
  }

  // ────────────────────────────────────────────────────────────────
  // Phase 1: 制定研究计划
  // ────────────────────────────────────────────────────────────────

  /**
   * 让 LM 分析主题，生成包含子问题和搜索策略的研究计划
   */
  private async createResearchPlan(
    config: DeepResearchConfig,
    maxIterations: number,
    maxPages: number,
  ): Promise<ResearchPlan> {
    const { topic, startUrl, pageContext } = config;

    let contextInfo = '';
    if (startUrl) {
      contextInfo += `\nCurrent page URL: ${startUrl}`;
    }
    if (pageContext) {
      contextInfo += `\nPage context (selected text / summary): ${pageContext.substring(0, 1500)}`;
    }

    const planPrompt = `You are a research planning agent. Analyze the following topic and create a detailed research plan.

Topic: "${topic}"
${contextInfo}

Create a research plan with:
1. 3-5 sub-questions that need to be answered to fully understand this topic
2. 3-5 initial search queries (Google search format) to begin the research

Output ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "subQuestions": [
    { "id": "sq_1", "question": "..." },
    { "id": "sq_2", "question": "..." }
  ],
  "searchStrategies": [
    { "query": "...", "rationale": "..." },
    { "query": "...", "rationale": "..." }
  ]
}`;

    const response = await this.lmService.sendMessage(
      planPrompt,
      'You are a meticulous research planner. Output ONLY valid JSON, no markdown code blocks, no explanation.',
      this.cancellationSource?.token,
    );

    const parsed = this.parseJSON<{
      subQuestions: { id: string; question: string }[];
      searchStrategies: { query: string; rationale: string }[];
    }>(response);

    const subQuestions: SubQuestion[] = (parsed?.subQuestions ?? []).map((sq, idx) => ({
      id: sq.id || `sq_${idx + 1}`,
      question: sq.question,
      status: 'pending' as SubQuestionStatus,
      findings: [],
    }));

    const searchStrategies: SearchStrategy[] = (parsed?.searchStrategies ?? []).map((ss) => ({
      query: ss.query,
      rationale: ss.rationale,
      executed: false,
    }));

    // 如果 LM 没有返回有效内容，提供兜底
    if (subQuestions.length === 0) {
      subQuestions.push({
        id: 'sq_1',
        question: `What is ${topic}?`,
        status: 'pending',
        findings: [],
      });
    }
    if (searchStrategies.length === 0) {
      searchStrategies.push({
        query: topic,
        rationale: 'Direct search for the topic',
        executed: false,
      });
    }

    // 如果有起始页面上下文，作为首个引用
    if (startUrl && pageContext) {
      this.citationTracker.addOrGet(startUrl, '当前页面', pageContext.substring(0, 300));
    }

    return {
      topic,
      subQuestions,
      searchStrategies,
      iteration: 1,
      maxIterations,
      pagesExplored: 0,
      maxPages,
    };
  }

  // ────────────────────────────────────────────────────────────────
  // Phase 2: 搜索 — 执行搜索策略，发现 URL
  // ────────────────────────────────────────────────────────────────

  /**
   * 执行未执行的搜索策略，收集搜索结果链接
   */
  private async executeSearchStrategies(
    plan: ResearchPlan,
  ): Promise<{ url: string; title: string }[]> {
    const discoveredUrls: { url: string; title: string }[] = [];
    const pendingStrategies = plan.searchStrategies.filter((s) => !s.executed);

    for (const strategy of pendingStrategies) {
      this.checkCancellation();

      if (plan.pagesExplored >= plan.maxPages) {
        break;
      }

      try {
        this.log(`搜索: "${strategy.query}"`);
        strategy.executed = true;

        // 使用 browser_navigate 导航到 Google 搜索
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(strategy.query)}`;
        await this.browserTools.callTool('browser_navigate', { url: searchUrl });
        await this.delay(2000); // 等待页面加载

        // 使用 browser_get_links 提取搜索结果链接
        const linksResult = await this.browserTools.callTool('browser_get_links', {
          selector: '#search a[href]',
          limit: 10,
        });

        const links = this.extractLinksFromResult(linksResult);
        // 过滤掉 Google 内部链接和无效 URL
        const validLinks = links.filter(
          (l) =>
            l.url.startsWith('http') &&
            !l.url.includes('google.com') &&
            !l.url.includes('webcache.') &&
            !l.url.includes('translate.google'),
        );

        discoveredUrls.push(...validLinks.slice(0, 5)); // 每个搜索最多取 5 个链接
        this.log(`搜索 "${strategy.query}" 发现 ${validLinks.length} 个有效链接`);
      } catch (err) {
        this.log(`搜索策略执行失败: "${strategy.query}" - ${this.errMsg(err)}`);
      }
    }

    // 去重
    const seen = new Set<string>();
    return discoveredUrls.filter((u) => {
      if (seen.has(u.url)) { return false; }
      seen.add(u.url);
      return true;
    });
  }

  // ────────────────────────────────────────────────────────────────
  // Phase 3: 阅读 — 逐页导航并提取内容
  // ────────────────────────────────────────────────────────────────

  /**
   * 逐页阅读，提取内容并记录引用
   */
  private async readPages(
    plan: ResearchPlan,
    urls: { url: string; title: string }[],
    sessionId: string,
  ): Promise<PageExploration[]> {
    const explorations: PageExploration[] = [];

    for (const { url, title } of urls) {
      this.checkCancellation();

      if (plan.pagesExplored >= plan.maxPages) {
        this.log(`已达页面上限 ${plan.maxPages}，停止阅读`);
        break;
      }

      try {
        this.notifyProgress(
          sessionId,
          'reading',
          `正在阅读 (${plan.pagesExplored + 1}/${plan.maxPages}): ${title || url}`,
        );

        // 导航到目标页面
        await this.browserTools.callTool('browser_navigate', { url });
        await this.delay(2000); // 等待页面加载

        // 提取页面信息
        const pageInfoResult = await this.browserTools.callTool('browser_get_page_info', {});
        const pageInfo = this.extractTextFromResult(pageInfoResult);

        // 提取页面正文内容
        const textResult = await this.browserTools.callTool('browser_get_text', { selector: 'body' });
        const rawText = this.extractTextFromResult(textResult);

        // 截取有效内容（避免过大）
        const pageContent = rawText.substring(0, 5000);
        const pageTitle = this.extractFieldFromJson(pageInfo, 'title') || title || url;

        if (pageContent.length > 100) {
          // 记录引用
          this.citationTracker.addOrGet(url, pageTitle, pageContent.substring(0, 300));

          explorations.push({
            url,
            title: pageTitle,
            content: pageContent,
            timestamp: Date.now(),
          });

          plan.pagesExplored += 1;
          this.log(`已阅读: ${pageTitle} (${url}), ${pageContent.length} 字符`);
        } else {
          this.log(`页面内容过少，跳过: ${url}`);
        }
      } catch (err) {
        this.log(`阅读页面失败: ${url} - ${this.errMsg(err)}`);
      }
    }

    return explorations;
  }

  // ────────────────────────────────────────────────────────────────
  // Phase 4: 推理 — 分析发现，为子问题绑定带引用的结论
  // ────────────────────────────────────────────────────────────────

  /**
   * 让 LM 分析页面内容，将发现绑定到子问题
   */
  private async reasonAboutFindings(
    plan: ResearchPlan,
    explorations: PageExploration[],
  ): Promise<void> {
    if (explorations.length === 0) {
      return;
    }

    const explorationSummary = explorations
      .map((e, i) => `--- Source [${this.citationTracker.addOrGet(e.url, e.title, e.content.substring(0, 300)).id}]: ${e.title} (${e.url}) ---\n${e.content.substring(0, 2000)}`)
      .join('\n\n');

    const subQuestionsText = plan.subQuestions
      .map((sq) => `- ${sq.id}: "${sq.question}" [status: ${sq.status}]`)
      .join('\n');

    const reasoningPrompt = `You are a research analyst. Analyze the following web page contents and extract findings relevant to each sub-question.

Topic: "${plan.topic}"

Sub-questions:
${subQuestionsText}

Source content:
${explorationSummary}

For each sub-question, extract key findings with the source citation number [N].
Output ONLY valid JSON (no markdown, no explanation):
{
  "findings": [
    {
      "subQuestionId": "sq_1",
      "content": "Key finding text with evidence [1]",
      "citationId": 1,
      "excerpt": "Direct quote from the source supporting this finding"
    }
  ]
}`;

    const response = await this.lmService.sendMessage(
      reasoningPrompt,
      'You are a thorough research analyst. Extract specific, evidence-based findings. Output ONLY valid JSON.',
      this.cancellationSource?.token,
    );

    const parsed = this.parseJSON<{
      findings: {
        subQuestionId: string;
        content: string;
        citationId: number;
        excerpt: string;
      }[];
    }>(response);

    if (parsed?.findings) {
      for (const f of parsed.findings) {
        const sq = plan.subQuestions.find((q) => q.id === f.subQuestionId);
        if (!sq) { continue; }

        // 找到对应的引用
        const allCitations = this.citationTracker.getAll();
        const citation = allCitations.find((c) => c.id === f.citationId) ?? allCitations[0];
        if (!citation) { continue; }

        sq.findings.push({
          content: f.content,
          citation,
        });
        sq.status = 'investigating';
      }
    }
  }

  // ────────────────────────────────────────────────────────────────
  // Phase 5: 差距检测 — 识别未回答的子问题
  // ────────────────────────────────────────────────────────────────

  /**
   * 让 LM 评估哪些子问题还没有充分回答
   * @returns true 如果存在显著信息差距
   */
  private async detectGaps(plan: ResearchPlan): Promise<boolean> {
    const subQuestionsWithFindings = plan.subQuestions.map((sq) => ({
      id: sq.id,
      question: sq.question,
      findingsCount: sq.findings.length,
      findings: sq.findings.map((f) => f.content).join('; '),
    }));

    const gapPrompt = `You are a research quality assessor. Evaluate if the following sub-questions have been adequately answered.

Topic: "${plan.topic}"
Current iteration: ${plan.iteration}/${plan.maxIterations}
Pages explored: ${plan.pagesExplored}/${plan.maxPages}

Sub-questions and their findings:
${JSON.stringify(subQuestionsWithFindings, null, 2)}

For each sub-question, determine if it's:
- "answered": Has sufficient evidence and findings
- "gap": Needs more research

Output ONLY valid JSON (no markdown, no explanation):
{
  "assessments": [
    { "id": "sq_1", "status": "answered" },
    { "id": "sq_2", "status": "gap", "reason": "No data found about..." }
  ],
  "hasSignificantGaps": true
}`;

    const response = await this.lmService.sendMessage(
      gapPrompt,
      'You are a critical research assessor. Be honest about gaps. Output ONLY valid JSON.',
      this.cancellationSource?.token,
    );

    const parsed = this.parseJSON<{
      assessments: { id: string; status: string; reason?: string }[];
      hasSignificantGaps: boolean;
    }>(response);

    if (parsed?.assessments) {
      for (const a of parsed.assessments) {
        const sq = plan.subQuestions.find((q) => q.id === a.id);
        if (sq) {
          sq.status = a.status === 'answered' ? 'answered' : 'gap';
        }
      }
    }

    const hasGaps = parsed?.hasSignificantGaps ?? false;
    const gapCount = plan.subQuestions.filter((sq) => sq.status === 'gap').length;
    this.log(`差距检测：${gapCount} 个子问题有差距，hasSignificantGaps=${hasGaps}`);

    return hasGaps;
  }

  // ────────────────────────────────────────────────────────────────
  // Phase 5b: 重新规划 — 为差距生成新搜索策略
  // ────────────────────────────────────────────────────────────────

  /**
   * 针对存在差距的子问题，生成新的搜索策略
   */
  private async replan(plan: ResearchPlan): Promise<void> {
    const gapQuestions = plan.subQuestions
      .filter((sq) => sq.status === 'gap')
      .map((sq) => `- ${sq.id}: "${sq.question}"`)
      .join('\n');

    const executedQueries = plan.searchStrategies
      .filter((s) => s.executed)
      .map((s) => `- "${s.query}"`)
      .join('\n');

    const replanPrompt = `You are a research planner. The following sub-questions still have information gaps after iteration ${plan.iteration}.

Topic: "${plan.topic}"

Unanswered sub-questions:
${gapQuestions}

Already searched queries:
${executedQueries}

Generate 2-3 NEW search queries (different from the ones already tried) to fill the gaps.
Output ONLY valid JSON (no markdown, no explanation):
{
  "newStrategies": [
    { "query": "...", "rationale": "..." }
  ]
}`;

    const response = await this.lmService.sendMessage(
      replanPrompt,
      'You are a creative research planner. Generate novel search strategies. Output ONLY valid JSON.',
      this.cancellationSource?.token,
    );

    const parsed = this.parseJSON<{
      newStrategies: { query: string; rationale: string }[];
    }>(response);

    if (parsed?.newStrategies) {
      for (const ns of parsed.newStrategies) {
        plan.searchStrategies.push({
          query: ns.query,
          rationale: ns.rationale,
          executed: false,
        });
      }
      this.log(`重新规划：新增 ${parsed.newStrategies.length} 个搜索策略`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // Phase 6: 生成结构化报告
  // ────────────────────────────────────────────────────────────────

  /**
   * 基于研究计划和引用生成结构化 Markdown 报告
   */
  private async generateStructuredReport(plan: ResearchPlan): Promise<string> {
    const findingsByQuestion = plan.subQuestions.map((sq) => ({
      question: sq.question,
      status: sq.status,
      findings: sq.findings.map((f) => ({
        content: f.content,
        citationId: f.citation.id,
      })),
    }));

    const citationsList = this.citationTracker.getAll().map((c) => ({
      id: c.id,
      title: c.title,
      url: c.url,
      excerpt: c.excerpt,
    }));

    const reportPrompt = `You are a professional research report writer. Generate a comprehensive, well-structured Markdown report based on the following research data.

Topic: "${plan.topic}"
Total iterations: ${plan.iteration}
Pages explored: ${plan.pagesExplored}
Citations count: ${this.citationTracker.count}

Research findings by sub-question:
${JSON.stringify(findingsByQuestion, null, 2)}

Citations list:
${JSON.stringify(citationsList, null, 2)}

Requirements:
1. Start with # title
2. ## 目录 (table of contents with links)
3. ## 摘要 (executive summary, 3-5 sentences)
4. For each theme/sub-question: ## heading with detailed analysis
   - Use inline citation marks like [1], [2] when referencing sources
   - Be specific and evidence-based
5. ## 结论 (conclusion with key takeaways)
6. ## 参考文献 (reference list in format: [N] Title - URL)

Write the report in the same language as the topic. Use professional academic tone.
Output ONLY the Markdown report.`;

    const report = await this.lmService.sendMessage(
      reportPrompt,
      'You are a professional academic report writer. Generate well-structured, evidence-based reports with proper citations.',
      this.cancellationSource?.token,
    );

    return report;
  }

  // ────────────────────────────────────────────────────────────────
  // WebSocket 通知方法
  // ────────────────────────────────────────────────────────────────

  /** 通知进度 */
  private notifyProgress(sessionId: string, phase: string, message: string): void {
    this.wsServer.broadcast({
      type: 'deep_research_progress',
      payload: {
        status: this._status,
        phase,
        message,
        citationCount: this.citationTracker.count,
      },
      sessionId,
    });
  }

  /** 推送研究计划 */
  private notifyPlan(sessionId: string, plan: ResearchPlan): void {
    this.wsServer.broadcast({
      type: 'deep_research_plan',
      payload: {
        topic: plan.topic,
        subQuestions: plan.subQuestions.map((sq) => ({
          id: sq.id,
          question: sq.question,
          status: sq.status,
        })),
        searchStrategies: plan.searchStrategies.map((s) => ({
          query: s.query,
          rationale: s.rationale,
        })),
        iteration: plan.iteration,
        maxIterations: plan.maxIterations,
        maxPages: plan.maxPages,
      },
      sessionId,
    });
  }

  /** 发送最终报告 */
  private sendReport(sessionId: string, result: DeepResearchResult): void {
    this.wsServer.broadcast({
      type: 'deep_research_report',
      payload: {
        report: result.report,
        citations: result.citations,
        totalIterations: result.totalIterations,
        totalPages: result.totalPages,
        plan: {
          subQuestions: result.plan.subQuestions.map((sq) => ({
            id: sq.id,
            question: sq.question,
            status: sq.status,
            findingsCount: sq.findings.length,
          })),
        },
      },
      sessionId,
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 工具方法
  // ────────────────────────────────────────────────────────────────

  /** 从工具结果中提取文本内容 */
  private extractTextFromResult(result: { content: unknown[]; isError?: boolean }): string {
    if (result.isError || !result.content || result.content.length === 0) {
      return '';
    }
    const first = result.content[0] as { text?: string; type?: string };
    return first?.text ?? '';
  }

  /** 从工具结果中提取链接列表 */
  private extractLinksFromResult(result: { content: unknown[]; isError?: boolean }): { url: string; title: string }[] {
    const text = this.extractTextFromResult(result);
    if (!text) { return []; }

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item: unknown) => {
            const obj = item as Record<string, unknown>;
            return typeof obj.href === 'string' || typeof obj.url === 'string';
          })
          .map((item: unknown) => {
            const obj = item as Record<string, unknown>;
            return {
              url: (obj.href ?? obj.url) as string,
              title: ((obj.text ?? obj.title) as string) || '',
            };
          });
      }
    } catch {
      // 非 JSON 格式，尝试从文本中提取 URL
    }

    return [];
  }

  /** 从 JSON 文本中提取字段值 */
  private extractFieldFromJson(jsonText: string, field: string): string {
    try {
      const parsed = JSON.parse(jsonText) as Record<string, unknown>;
      return String(parsed[field] ?? '');
    } catch {
      return '';
    }
  }

  /** 安全解析 JSON（容忍 markdown 代码块包裹） */
  private parseJSON<T>(text: string): T | null {
    try {
      // 先直接尝试解析
      return JSON.parse(text) as T;
    } catch {
      // 尝试提取 markdown 代码块中的 JSON
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1].trim()) as T;
        } catch { /* fall through */ }
      }
      // 尝试提取花括号之间的内容
      const braceMatch = text.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        try {
          return JSON.parse(braceMatch[0]) as T;
        } catch { /* fall through */ }
      }
    }
    this.log(`JSON 解析失败: ${text.substring(0, 200)}`);
    return null;
  }

  /** 检查取消令牌 */
  private checkCancellation(): void {
    if (this.cancellationSource?.token.isCancellationRequested) {
      throw new Error('调研已被用户取消');
    }
  }

  /** 日志 */
  private log(message: string): void {
    this.outputChannel.appendLine(`[DeepResearchEngine] ${message}`);
  }

  /** 错误消息提取 */
  private errMsg(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  /** 延迟 */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
