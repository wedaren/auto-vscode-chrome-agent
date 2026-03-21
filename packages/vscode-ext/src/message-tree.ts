// message-tree.ts — 消息检查器 TreeView：实时 WebSocket 消息流日志 + 点击查看完整 JSON
// 职责：捕获 WsServer 发送/接收的所有 BridgeMessage，以 TreeView 形式展示，
// 支持环形缓冲（最近 200 条）、方向箭头、时间戳、截断 payload，
// 点击节点在编辑器中打开完整 JSON（虚拟文档），提供清空日志命令。

import * as vscode from 'vscode';
import type { BridgeMessage } from './ws-server';

// ---------------------------------------------------------------------------
// 数据模型
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 环形缓冲区
// ---------------------------------------------------------------------------

const MAX_BUFFER_SIZE = 200;

class RingBuffer<T> {
  private buffer: T[] = [];
  private head = 0;
  private count = 0;

  constructor(private readonly capacity: number) {
    this.buffer = new Array(capacity);
  }

  push(item: T): void {
    const idx = (this.head + this.count) % this.capacity;
    this.buffer[idx] = item;
    if (this.count < this.capacity) {
      this.count++;
    } else {
      // 缓冲区已满，覆盖最旧的元素，head 前移
      this.head = (this.head + 1) % this.capacity;
    }
  }

  /** 返回所有元素，按插入顺序（最旧在前） */
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      result.push(this.buffer[(this.head + i) % this.capacity]);
    }
    return result;
  }

  /** 返回所有元素，按反向顺序（最新在前） */
  toReversedArray(): T[] {
    const result: T[] = [];
    for (let i = this.count - 1; i >= 0; i--) {
      result.push(this.buffer[(this.head + i) % this.capacity]);
    }
    return result;
  }

  clear(): void {
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this.count = 0;
  }

  get size(): number {
    return this.count;
  }
}

// ---------------------------------------------------------------------------
// 消息采集器（供 WsServer 钩子调用）
// ---------------------------------------------------------------------------

let _nextId = 1;

/** 全局消息缓冲，由 MessageTreeDataProvider 和 WsServer 共用 */
const messageBuffer = new RingBuffer<CapturedMessage>(MAX_BUFFER_SIZE);

/** 消息捕获事件（TreeView 监听此事件刷新） */
const _onDidCaptureMessage = new vscode.EventEmitter<CapturedMessage>();
export const onDidCaptureMessage = _onDidCaptureMessage.event;

/**
 * 记录一条消息（供 ws-server.ts 的 send/broadcast/onMessage 钩子调用）
 */
export function captureMessage(direction: MessageDirection, message: BridgeMessage): void {
  const captured: CapturedMessage = {
    id: _nextId++,
    direction,
    message,
    timestamp: new Date(),
  };
  messageBuffer.push(captured);
  _onDidCaptureMessage.fire(captured);
}

/**
 * 清空消息日志
 */
export function clearMessageLog(): void {
  messageBuffer.clear();
}

/**
 * 获取所有已捕获消息（最新在前）
 */
export function getCapturedMessages(): CapturedMessage[] {
  return messageBuffer.toReversedArray();
}

/**
 * 根据 ID 获取单条消息
 */
export function getCapturedMessageById(id: number): CapturedMessage | undefined {
  return messageBuffer.toArray().find(m => m.id === id);
}

// ---------------------------------------------------------------------------
// 虚拟文档 ContentProvider（点击消息 → 编辑器打开完整 JSON）
// ---------------------------------------------------------------------------

export const MESSAGE_SCHEME = 'browser-agent-message';

export class MessageDocumentProvider implements vscode.TextDocumentContentProvider {
  provideTextDocumentContent(uri: vscode.Uri): string {
    const id = parseInt(uri.path, 10);
    const captured = getCapturedMessageById(id);
    if (!captured) {
      return '// 消息未找到（可能已被环形缓冲淘汰）';
    }
    const dirLabel = captured.direction === 'send' ? '↑ 发送 (VSCode → Chrome)' : '↓ 接收 (Chrome → VSCode)';
    const header = {
      _meta: {
        direction: dirLabel,
        capturedAt: captured.timestamp.toISOString(),
        messageId: captured.id,
      },
      ...captured.message,
    };
    return JSON.stringify(header, null, 2);
  }
}

// ---------------------------------------------------------------------------
// TreeView 节点
// ---------------------------------------------------------------------------

export class MessageTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    public readonly captured?: CapturedMessage,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    if (captured) {
      // 点击后在编辑器中打开完整 JSON
      this.command = {
        title: '查看完整消息',
        command: 'browser-agent.openMessageDetail',
        arguments: [captured.id],
      };
    }
  }
}

// ---------------------------------------------------------------------------
// TreeDataProvider
// ---------------------------------------------------------------------------

export class MessageTreeDataProvider implements vscode.TreeDataProvider<MessageTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<MessageTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private disposables: vscode.Disposable[] = [];

  constructor() {
    // 每次捕获新消息时自动刷新 TreeView
    this.disposables.push(
      onDidCaptureMessage(() => {
        this._onDidChangeTreeData.fire();
      }),
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * 清空消息日志并刷新
   */
  clearMessageLog(): void {
    clearMessageLog();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: MessageTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(_element?: MessageTreeItem): MessageTreeItem[] {
    const messages = getCapturedMessages();

    if (messages.length === 0) {
      const empty = new MessageTreeItem('暂无消息记录');
      empty.iconPath = new vscode.ThemeIcon('info');
      return [empty];
    }

    return messages.map(m => this.buildItem(m));
  }

  private buildItem(captured: CapturedMessage): MessageTreeItem {
    const arrow = captured.direction === 'send' ? '↑' : '↓';
    const time = this.formatTime(captured.timestamp);
    const payloadPreview = this.truncatePayload(captured.message.payload, 60);
    const label = `${arrow} ${captured.message.type}  [${time}]  ${payloadPreview}`;

    const item = new MessageTreeItem(label, captured);

    // 图标：发送用箭头上、接收用箭头下
    item.iconPath = new vscode.ThemeIcon(
      captured.direction === 'send' ? 'arrow-up' : 'arrow-down',
    );

    // 详细 tooltip
    item.tooltip = new vscode.MarkdownString(
      `**${captured.direction === 'send' ? '发送' : '接收'}** \`${captured.message.type}\`\n\n` +
      `**时间:** ${captured.timestamp.toLocaleString()}\n\n` +
      `**Session:** ${captured.message.sessionId}\n\n` +
      `**Payload 预览:**\n\`\`\`json\n${JSON.stringify(captured.message.payload, null, 2).substring(0, 500)}\n\`\`\`\n\n` +
      `*点击查看完整 JSON*`,
    );
    (item.tooltip as vscode.MarkdownString).isTrusted = true;

    // 上下文值，方便后续右键菜单区分
    item.contextValue = `message-${captured.direction}`;

    return item;
  }

  private formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
  }

  private truncatePayload(payload: unknown, maxLen: number): string {
    if (payload === null || payload === undefined) {
      return '(empty)';
    }
    let str: string;
    if (typeof payload === 'string') {
      str = payload;
    } else {
      try {
        str = JSON.stringify(payload);
      } catch {
        str = String(payload);
      }
    }
    if (str.length > maxLen) {
      return str.substring(0, maxLen) + '…';
    }
    return str;
  }

  dispose(): void {
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
    this._onDidChangeTreeData.dispose();
  }
}
