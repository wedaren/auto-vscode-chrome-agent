import * as vscode from 'vscode';
import type { AgentStep } from './agent-loop';
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
export declare const onDidChangeRuns: vscode.Event<void>;
/**
 * 开始一次新的 Agent 运行（供 message-handler.ts 调用）
 * @returns 运行 ID
 */
export declare function startAgentRun(userMessage: string): number;
/**
 * 向指定运行追加一个步骤（供 message-handler.ts 的 onStep 回调调用）
 */
export declare function addAgentStep(runId: number, step: AgentStep): void;
/**
 * 标记运行结束（供 message-handler.ts 调用）
 */
export declare function completeAgentRun(runId: number, status: 'completed' | 'cancelled' | 'error', errorMessage?: string): void;
/**
 * 获取所有运行记录（最新在前）
 */
export declare function getAgentRuns(): AgentRunRecord[];
/** 节点类型：run = 运行记录（顶级），step = 步骤（子级） */
export type AgentNodeType = 'run' | 'step';
/** Agent 循环树节点 */
export declare class AgentTreeItem extends vscode.TreeItem {
    readonly nodeType?: AgentNodeType | undefined;
    readonly runId?: number | undefined;
    readonly stepIndex?: number | undefined;
    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, nodeType?: AgentNodeType | undefined, runId?: number | undefined, stepIndex?: number | undefined);
}
/** Agent 循环 TreeDataProvider：2 级树 = 运行记录 → 步骤列表 */
export declare class AgentTreeDataProvider implements vscode.TreeDataProvider<AgentTreeItem> {
    private readonly _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | AgentTreeItem | undefined>;
    private disposables;
    constructor();
    refresh(): void;
    getTreeItem(element: AgentTreeItem): vscode.TreeItem;
    getChildren(element?: AgentTreeItem): AgentTreeItem[];
    private getRootItems;
    private buildRunItem;
    private getStepItems;
    private buildStepItem;
    private getStepTypeEmoji;
    private getStepTypeLabel;
    private getStepThemeIcon;
    private getStatusIcon;
    private getStatusLabel;
    private getThemeIconId;
    private formatTime;
    private truncateContent;
    dispose(): void;
}
//# sourceMappingURL=agent-tree.d.ts.map