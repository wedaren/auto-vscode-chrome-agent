import * as vscode from 'vscode';
import type { BridgeMessage } from './ws-server';
/** 消息方向 */
export type MessageDirection = 'send' | 'receive';
/** 捕获的消息记录 */
export interface CapturedMessage {
    /** 自增 ID（用于虚拟文档 URI） */
    id: number;
    /** 方向：send = VSCode → Chrome, receive = Chrome → VSCode */
    direction: MessageDirection;
    /** 原始 BridgeMessage */
    message: BridgeMessage;
    /** 捕获时间 */
    timestamp: Date;
}
export declare const onDidCaptureMessage: vscode.Event<CapturedMessage>;
/**
 * 记录一条消息（供 ws-server.ts 的 send/broadcast/onMessage 钩子调用）
 */
export declare function captureMessage(direction: MessageDirection, message: BridgeMessage): void;
/**
 * 清空消息日志
 */
export declare function clearMessageLog(): void;
/**
 * 获取所有已捕获消息（最新在前）
 */
export declare function getCapturedMessages(): CapturedMessage[];
/**
 * 根据 ID 获取单条消息
 */
export declare function getCapturedMessageById(id: number): CapturedMessage | undefined;
export declare const MESSAGE_SCHEME = "browser-agent-message";
export declare class MessageDocumentProvider implements vscode.TextDocumentContentProvider {
    provideTextDocumentContent(uri: vscode.Uri): string;
}
export declare class MessageTreeItem extends vscode.TreeItem {
    readonly captured?: CapturedMessage | undefined;
    constructor(label: string, captured?: CapturedMessage | undefined);
}
export declare class MessageTreeDataProvider implements vscode.TreeDataProvider<MessageTreeItem> {
    private readonly _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | MessageTreeItem | undefined>;
    private disposables;
    constructor();
    refresh(): void;
    /**
     * 清空消息日志并刷新
     */
    clearMessageLog(): void;
    getTreeItem(element: MessageTreeItem): vscode.TreeItem;
    getChildren(_element?: MessageTreeItem): MessageTreeItem[];
    private buildItem;
    private formatTime;
    private truncatePayload;
    dispose(): void;
}
//# sourceMappingURL=message-tree.d.ts.map