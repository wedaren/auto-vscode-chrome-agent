import * as vscode from 'vscode';
export interface FeedbackEntry {
    ts: string;
    type: 'complaint' | 'request' | 'praise' | 'interaction' | 'error' | 'abandon';
    content: string;
    context: string;
}
/**
 * FeedbackCollector 负责从用户交互中提取隐式和显式反馈信号，
 * 写入 .agent/feedback.jsonl 供 Evolution Agent 分析。
 *
 * 信号类型：
 * - interaction: 用户发送的每条消息（统计使用模式）
 * - error: 系统返回错误（说明某个能力有缺陷）
 * - abandon: 用户长时间未回复或关闭面板（可能体验不好）
 * - complaint: 用户明确表达不满（关键词检测）
 * - request: 用户请求新功能（关键词检测）
 * - praise: 用户表达满意（关键词检测）
 */
export declare class FeedbackCollector {
    private feedbackPath;
    private outputChannel;
    private sessionMessages;
    private lastMessageTime;
    constructor(outputChannel: vscode.OutputChannel, agentDir?: string);
    /**
     * 记录用户发送的聊天消息，自动分类反馈类型
     */
    recordChat(text: string, pageContext?: string): void;
    /**
     * 记录系统错误（对用户可见的）
     */
    recordError(error: string, context?: string): void;
    /**
     * 记录用户放弃交互（超时无操作）
     */
    recordAbandon(lastMessage: string): void;
    /**
     * 基于关键词简单分类消息的反馈类型
     */
    private classifyMessage;
    /**
     * 写入一条反馈记录到 JSONL 文件
     */
    private write;
}
//# sourceMappingURL=feedback-collector.d.ts.map