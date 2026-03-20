import * as vscode from 'vscode';
import { LmService } from './lm-service';
import { McpClient } from './mcp-client';
import { WsServer } from './ws-server';
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
export declare class ReportGenerator {
    private lmService;
    private mcpClient;
    private wsServer;
    private outputChannel;
    private _status;
    private explorations;
    private cancellationSource;
    constructor(lmService: LmService, mcpClient: McpClient, wsServer: WsServer, outputChannel: vscode.OutputChannel);
    /** 当前报告生成状态 */
    get status(): ReportStatus;
    /**
     * 触发深度报告生成（主入口）
     * @param config 报告配置
     * @returns 生成的 Markdown 报告
     */
    generate(config: ReportConfig): Promise<string>;
    /**
     * 取消正在进行的报告生成
     */
    cancel(): void;
    /**
     * 多页面探索：使用 LM 决定要访问哪些页面，然后通过 MCP 导航并提取内容
     */
    private explorePages;
    /**
     * 探索单个页面：导航 → 提取内容
     */
    private exploreSinglePage;
    /**
     * 分析所有探索结果，提取关键发现
     */
    private analyzeExplorations;
    /**
     * 基于分析结果生成最终 Markdown 报告
     */
    private generateMarkdownReport;
    /**
     * 构建探索规划提示词
     */
    private buildExplorationPlanPrompt;
    /**
     * 解析 LM 返回的 URL 规划
     */
    private parseUrlPlan;
    /**
     * 从 MCP 工具结果中提取页面数据
     */
    private extractPageData;
    /**
     * 通过 WebSocket 通知 Chrome 侧进度
     */
    private notifyProgress;
    /**
     * 通过 WebSocket 发送最终报告到 Chrome side panel
     */
    private sendReport;
    /**
     * 工具函数：延迟
     */
    private delay;
}
//# sourceMappingURL=report-generator.d.ts.map