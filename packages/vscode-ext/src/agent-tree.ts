// agent-tree.ts — Agent 循环可视化 TreeView：ReAct 步骤实时展示 + 历史执行记录浏览
// 职责：维护最近 20 次 Agent 运行记录，每次运行下展示 think/act/observe 步骤，
// 运行中的循环实时追加步骤并自动刷新 TreeView。
// 采用与 message-tree.ts 相同的全局函数模式，供 message-handler.ts 调用。

import * as vscode from 'vscode';
import type { AgentStep } from './agent-loop';

// ---------------------------------------------------------------------------
// 数据模型
// ---------------------------------------------------------------------------

/** Agent 运行状态 */
export type AgentRunStatus = 'running' | 'completed' | 'cancelled' | 'error';

/** 单次 Agent 运行记录 */
export interface AgentRunRecord {
  /** 唯一标识（自增） */
  id: number;
  /** 开始时间 */
  startTime: Date;
  /** 结束时间（运行结束后设置） */
  endTime?: Date;
  /** 运行状态 */
  status: AgentRunStatus;
  /** 用户消息（截断保存） */
  userMessage: string;
  /** 该次运行的所有步骤 */
  steps: AgentStep[];
  /** 错误消息（status=error 时） */
  errorMessage?: string;
}

// ---------------------------------------------------------------------------
// 全局运行记录管理（最多保留 20 次）
// ---------------------------------------------------------------------------

const MAX_RUNS = 20;

let _nextRunId = 1;
const _runs: AgentRunRecord[] = [];

/** 运行记录变更事件（TreeView 监听此事件刷新） */
const _onDidChangeRuns = new vscode.EventEmitter<void>();
export const onDidChangeRuns = _onDidChangeRuns.event;

/**
 * 开始一次新的 Agent 运行（供 message-handler.ts 调用）
 * @returns 运行 ID
 */
export function startAgentRun(userMessage: string): number {
  const runId = _nextRunId++;
  const record: AgentRunRecord = {
    id: runId,
    startTime: new Date(),
    status: 'running',
    userMessage: userMessage.length > 100 ? userMessage.substring(0, 100) + '…' : userMessage,
    steps: [],
  };

  // 插入到最前面（最新在前）
  _runs.unshift(record);

  // 超过上限，移除最旧的
  while (_runs.length > MAX_RUNS) {
    _runs.pop();
  }

  _onDidChangeRuns.fire();
  return runId;
}

/**
 * 向指定运行追加一个步骤（供 message-handler.ts 的 onStep 回调调用）
 */
export function addAgentStep(runId: number, step: AgentStep): void {
  const record = _runs.find(r => r.id === runId);
  if (!record) { return; }
  record.steps.push(step);
  _onDidChangeRuns.fire();
}

/**
 * 标记运行结束（供 message-handler.ts 调用）
 */
export function completeAgentRun(
  runId: number,
  status: 'completed' | 'cancelled' | 'error',
  errorMessage?: string,
): void {
  const record = _runs.find(r => r.id === runId);
  if (!record) { return; }
  record.status = status;
  record.endTime = new Date();
  if (errorMessage) {
    record.errorMessage = errorMessage;
  }
  _onDidChangeRuns.fire();
}

/**
 * 获取所有运行记录（最新在前）
 */
export function getAgentRuns(): AgentRunRecord[] {
  return [..._runs];
}

// ---------------------------------------------------------------------------
// TreeView 节点
// ---------------------------------------------------------------------------

/** 节点类型：run = 运行记录（顶级），step = 步骤（子级） */
export type AgentNodeType = 'run' | 'step';

/** Agent 循环树节点 */
export class AgentTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly nodeType?: AgentNodeType,
    public readonly runId?: number,
    public readonly stepIndex?: number,
  ) {
    super(label, collapsibleState);
  }
}

// ---------------------------------------------------------------------------
// TreeDataProvider
// ---------------------------------------------------------------------------

/** Agent 循环 TreeDataProvider：2 级树 = 运行记录 → 步骤列表 */
export class AgentTreeDataProvider implements vscode.TreeDataProvider<AgentTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<AgentTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private disposables: vscode.Disposable[] = [];

  constructor() {
    // 监听全局运行记录变更事件，自动刷新 TreeView
    this.disposables.push(
      onDidChangeRuns(() => {
        this._onDidChangeTreeData.fire();
      }),
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: AgentTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: AgentTreeItem): AgentTreeItem[] {
    // 无父节点 → 返回顶级运行记录列表
    if (!element) {
      return this.getRootItems();
    }

    // 有父节点且为 run 类型 → 返回该运行的步骤列表
    if (element.nodeType === 'run' && element.runId !== undefined) {
      return this.getStepItems(element.runId);
    }

    return [];
  }

  // ---------------------------------------------------------------------------
  // 私有：构建顶级节点（运行记录）
  // ---------------------------------------------------------------------------

  private getRootItems(): AgentTreeItem[] {
    const runs = getAgentRuns();

    if (runs.length === 0) {
      const empty = new AgentTreeItem(
        '暂无 Agent 运行记录',
        vscode.TreeItemCollapsibleState.None,
      );
      empty.iconPath = new vscode.ThemeIcon('info');
      return [empty];
    }

    return runs.map(run => this.buildRunItem(run));
  }

  private buildRunItem(run: AgentRunRecord): AgentTreeItem {
    const timeStr = this.formatTime(run.startTime);
    const statusIcon = this.getStatusIcon(run.status);
    const statusLabel = this.getStatusLabel(run.status);
    const stepCount = run.steps.length;

    const label = `${statusIcon} [${timeStr}] ${statusLabel}  (${stepCount} 步)`;
    const item = new AgentTreeItem(
      label,
      vscode.TreeItemCollapsibleState.Collapsed,
      'run',
      run.id,
    );

    // 运行中的自动展开
    if (run.status === 'running') {
      item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    }

    // 图标
    item.iconPath = new vscode.ThemeIcon(this.getThemeIconId(run.status));

    // tooltip
    const durationStr = run.endTime
      ? `${((run.endTime.getTime() - run.startTime.getTime()) / 1000).toFixed(1)}s`
      : '进行中…';
    const tooltip = new vscode.MarkdownString(
      `**Agent 运行 #${run.id}**\n\n` +
      `**状态:** ${statusLabel}\n\n` +
      `**开始:** ${run.startTime.toLocaleString()}\n\n` +
      `**耗时:** ${durationStr}\n\n` +
      `**步骤数:** ${stepCount}\n\n` +
      `**用户消息:** ${run.userMessage}\n\n` +
      (run.errorMessage ? `**错误:** ${run.errorMessage}\n\n` : ''),
    );
    tooltip.isTrusted = true;
    item.tooltip = tooltip;

    // 描述（显示用户消息摘要）
    item.description = run.userMessage.length > 40
      ? run.userMessage.substring(0, 40) + '…'
      : run.userMessage;

    item.contextValue = `agent-run-${run.status}`;

    return item;
  }

  // ---------------------------------------------------------------------------
  // 私有：构建子节点（步骤列表）
  // ---------------------------------------------------------------------------

  private getStepItems(runId: number): AgentTreeItem[] {
    const run = _runs.find(r => r.id === runId);
    if (!run || run.steps.length === 0) {
      const empty = new AgentTreeItem(
        '暂无步骤',
        vscode.TreeItemCollapsibleState.None,
      );
      empty.iconPath = new vscode.ThemeIcon('dash');
      return [empty];
    }

    return run.steps.map((step, index) => this.buildStepItem(step, index));
  }

  private buildStepItem(step: AgentStep, index: number): AgentTreeItem {
    const typeEmoji = this.getStepTypeEmoji(step.type);
    const typeLabel = this.getStepTypeLabel(step.type);
    const contentPreview = this.truncateContent(step.content, 60);

    // 构建 label：序号 + emoji + 类型 + 工具名（如有）+ 内容预览
    let label = `${typeEmoji} #${step.step} ${typeLabel}`;
    if (step.toolName) {
      label += ` [${step.toolName}]`;
    }
    label += `  ${contentPreview}`;

    const item = new AgentTreeItem(
      label,
      vscode.TreeItemCollapsibleState.None,
      'step',
      undefined,
      index,
    );

    // 图标
    item.iconPath = new vscode.ThemeIcon(this.getStepThemeIcon(step.type));

    // tooltip 显示完整内容
    const tooltipContent =
      `**步骤 #${step.step} — ${typeLabel}**\n\n` +
      (step.toolName ? `**工具:** \`${step.toolName}\`\n\n` : '') +
      (step.toolArgs ? `**参数:**\n\`\`\`json\n${JSON.stringify(step.toolArgs, null, 2).substring(0, 500)}\n\`\`\`\n\n` : '') +
      `**内容:**\n\`\`\`\n${step.content.substring(0, 1000)}\n\`\`\``;
    const tooltip = new vscode.MarkdownString(tooltipContent);
    tooltip.isTrusted = true;
    item.tooltip = tooltip;

    item.contextValue = `agent-step-${step.type}`;

    return item;
  }

  // ---------------------------------------------------------------------------
  // 辅助方法
  // ---------------------------------------------------------------------------

  private getStepTypeEmoji(type: AgentStep['type']): string {
    switch (type) {
      case 'think': return '🧠';
      case 'act': return '⚡';
      case 'observe': return '📋';
    }
  }

  private getStepTypeLabel(type: AgentStep['type']): string {
    switch (type) {
      case 'think': return 'Think';
      case 'act': return 'Act';
      case 'observe': return 'Observe';
    }
  }

  private getStepThemeIcon(type: AgentStep['type']): string {
    switch (type) {
      case 'think': return 'lightbulb';
      case 'act': return 'zap';
      case 'observe': return 'eye';
    }
  }

  private getStatusIcon(status: AgentRunStatus): string {
    switch (status) {
      case 'running': return '🔄';
      case 'completed': return '✅';
      case 'cancelled': return '⏹️';
      case 'error': return '❌';
    }
  }

  private getStatusLabel(status: AgentRunStatus): string {
    switch (status) {
      case 'running': return 'Running';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'error': return 'Error';
    }
  }

  private getThemeIconId(status: AgentRunStatus): string {
    switch (status) {
      case 'running': return 'sync~spin';
      case 'completed': return 'pass';
      case 'cancelled': return 'debug-stop';
      case 'error': return 'error';
    }
  }

  private formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private truncateContent(content: string, maxLen: number): string {
    // 移除换行，取第一行
    const firstLine = content.split('\n')[0] ?? '';
    if (firstLine.length > maxLen) {
      return firstLine.substring(0, maxLen) + '…';
    }
    return firstLine;
  }

  dispose(): void {
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
    this._onDidChangeTreeData.dispose();
  }
}
