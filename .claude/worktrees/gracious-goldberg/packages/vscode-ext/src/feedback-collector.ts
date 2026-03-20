// feedback-collector.ts — 用户反馈收集器，将交互信号写入 .agent/feedback.jsonl
// 进化循环的核心数据源：用户行为 → 反馈日志 → Evolution Agent → 改进任务
import * as fs from 'fs';
import * as path from 'path';
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
export class FeedbackCollector {
  private feedbackPath: string;
  private outputChannel: vscode.OutputChannel;
  private sessionMessages: number = 0;
  private lastMessageTime: number = 0;

  constructor(outputChannel: vscode.OutputChannel, agentDir?: string) {
    this.outputChannel = outputChannel;
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';
    const baseDir = agentDir ?? path.join(workspaceRoot, '.agent');
    this.feedbackPath = path.join(baseDir, 'feedback.jsonl');
  }

  /**
   * 记录用户发送的聊天消息，自动分类反馈类型
   */
  recordChat(text: string, pageContext?: string): void {
    this.sessionMessages++;
    this.lastMessageTime = Date.now();

    const feedbackType = this.classifyMessage(text);

    this.write({
      ts: new Date().toISOString(),
      type: feedbackType,
      content: text,
      context: pageContext ?? '',
    });
  }

  /**
   * 记录系统错误（对用户可见的）
   */
  recordError(error: string, context?: string): void {
    this.write({
      ts: new Date().toISOString(),
      type: 'error',
      content: error,
      context: context ?? '',
    });
  }

  /**
   * 记录用户放弃交互（超时无操作）
   */
  recordAbandon(lastMessage: string): void {
    this.write({
      ts: new Date().toISOString(),
      type: 'abandon',
      content: `用户在 "${lastMessage.substring(0, 50)}" 后放弃交互`,
      context: `session_messages: ${this.sessionMessages}`,
    });
  }

  /**
   * 基于关键词简单分类消息的反馈类型
   */
  private classifyMessage(text: string): FeedbackEntry['type'] {
    const lower = text.toLowerCase();

    // 显式负面反馈
    const complaintKeywords = [
      '不好用', '太慢', '有bug', '出错', '不对', '搞不定', '废话',
      'broken', 'slow', 'wrong', 'bug', 'error', 'useless', 'bad',
    ];
    if (complaintKeywords.some(k => lower.includes(k))) {
      return 'complaint';
    }

    // 功能请求
    const requestKeywords = [
      '能不能', '可以增加', '希望', '建议', '要是能', '支持',
      'can you', 'could you', 'add', 'support', 'feature', 'wish',
    ];
    if (requestKeywords.some(k => lower.includes(k))) {
      return 'request';
    }

    // 正面反馈
    const praiseKeywords = [
      '好用', '不错', '厉害', '谢谢', '完美', '赞',
      'great', 'good', 'thanks', 'perfect', 'awesome', 'nice',
    ];
    if (praiseKeywords.some(k => lower.includes(k))) {
      return 'praise';
    }

    return 'interaction';
  }

  /**
   * 写入一条反馈记录到 JSONL 文件
   */
  private write(entry: FeedbackEntry): void {
    try {
      const dir = path.dirname(this.feedbackPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.appendFileSync(this.feedbackPath, JSON.stringify(entry) + '\n');
      this.outputChannel.appendLine(
        `[Feedback] ${entry.type}: ${entry.content.substring(0, 80)}`,
      );
    } catch (err) {
      this.outputChannel.appendLine(
        `[Feedback] 写入失败: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
