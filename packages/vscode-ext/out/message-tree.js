"use strict";
// message-tree.ts — 消息检查器 TreeView：实时 WebSocket 消息流日志 + 点击查看完整 JSON
// 职责：捕获 WsServer 发送/接收的所有 BridgeMessage，以 TreeView 形式展示，
// 支持环形缓冲（最近 200 条）、方向箭头、时间戳、截断 payload，
// 点击节点在编辑器中打开完整 JSON（虚拟文档），提供清空日志命令。
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageTreeDataProvider = exports.MessageTreeItem = exports.MessageDocumentProvider = exports.MESSAGE_SCHEME = exports.onDidCaptureMessage = void 0;
exports.captureMessage = captureMessage;
exports.clearMessageLog = clearMessageLog;
exports.getCapturedMessages = getCapturedMessages;
exports.getCapturedMessageById = getCapturedMessageById;
const vscode = __importStar(require("vscode"));
// ---------------------------------------------------------------------------
// 环形缓冲区
// ---------------------------------------------------------------------------
const MAX_BUFFER_SIZE = 200;
class RingBuffer {
    capacity;
    buffer = [];
    head = 0;
    count = 0;
    constructor(capacity) {
        this.capacity = capacity;
        this.buffer = new Array(capacity);
    }
    push(item) {
        const idx = (this.head + this.count) % this.capacity;
        this.buffer[idx] = item;
        if (this.count < this.capacity) {
            this.count++;
        }
        else {
            // 缓冲区已满，覆盖最旧的元素，head 前移
            this.head = (this.head + 1) % this.capacity;
        }
    }
    /** 返回所有元素，按插入顺序（最旧在前） */
    toArray() {
        const result = [];
        for (let i = 0; i < this.count; i++) {
            result.push(this.buffer[(this.head + i) % this.capacity]);
        }
        return result;
    }
    /** 返回所有元素，按反向顺序（最新在前） */
    toReversedArray() {
        const result = [];
        for (let i = this.count - 1; i >= 0; i--) {
            result.push(this.buffer[(this.head + i) % this.capacity]);
        }
        return result;
    }
    clear() {
        this.buffer = new Array(this.capacity);
        this.head = 0;
        this.count = 0;
    }
    get size() {
        return this.count;
    }
}
// ---------------------------------------------------------------------------
// 消息采集器（供 WsServer 钩子调用）
// ---------------------------------------------------------------------------
let _nextId = 1;
/** 全局消息缓冲，由 MessageTreeDataProvider 和 WsServer 共用 */
const messageBuffer = new RingBuffer(MAX_BUFFER_SIZE);
/** 消息捕获事件（TreeView 监听此事件刷新） */
const _onDidCaptureMessage = new vscode.EventEmitter();
exports.onDidCaptureMessage = _onDidCaptureMessage.event;
/**
 * 记录一条消息（供 ws-server.ts 的 send/broadcast/onMessage 钩子调用）
 */
function captureMessage(direction, message) {
    const captured = {
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
function clearMessageLog() {
    messageBuffer.clear();
}
/**
 * 获取所有已捕获消息（最新在前）
 */
function getCapturedMessages() {
    return messageBuffer.toReversedArray();
}
/**
 * 根据 ID 获取单条消息
 */
function getCapturedMessageById(id) {
    return messageBuffer.toArray().find(m => m.id === id);
}
// ---------------------------------------------------------------------------
// 虚拟文档 ContentProvider（点击消息 → 编辑器打开完整 JSON）
// ---------------------------------------------------------------------------
exports.MESSAGE_SCHEME = 'browser-agent-message';
class MessageDocumentProvider {
    provideTextDocumentContent(uri) {
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
exports.MessageDocumentProvider = MessageDocumentProvider;
// ---------------------------------------------------------------------------
// TreeView 节点
// ---------------------------------------------------------------------------
class MessageTreeItem extends vscode.TreeItem {
    captured;
    constructor(label, captured) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.captured = captured;
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
exports.MessageTreeItem = MessageTreeItem;
// ---------------------------------------------------------------------------
// TreeDataProvider
// ---------------------------------------------------------------------------
class MessageTreeDataProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    disposables = [];
    /** 刷新节流计时器，防止高频消息导致 TreeView 疯狂刷新 */
    _refreshTimer;
    /** 节流间隔（ms）：批量聚合 captureMessage 事件，200ms 内最多刷新一次 */
    static REFRESH_DEBOUNCE_MS = 200;
    constructor() {
        // 每次捕获新消息时通过 debounce 批量刷新 TreeView，
        // 避免高频消息（如 list_models 循环）导致每条消息都触发重绘拖慢 VSCode
        this.disposables.push((0, exports.onDidCaptureMessage)(() => {
            this.batchRefresh();
        }));
    }
    /**
     * 节流刷新：200ms 内多次 captureMessage 事件只触发一次 TreeView 刷新。
     * 使用 debounce 策略：每次调用重置计时器，最终在最后一次调用后 200ms 执行。
     */
    batchRefresh() {
        if (this._refreshTimer !== undefined) {
            clearTimeout(this._refreshTimer);
        }
        this._refreshTimer = setTimeout(() => {
            this._refreshTimer = undefined;
            this._onDidChangeTreeData.fire();
        }, MessageTreeDataProvider.REFRESH_DEBOUNCE_MS);
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    /**
     * 清空消息日志并刷新
     */
    clearMessageLog() {
        clearMessageLog();
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(_element) {
        const messages = getCapturedMessages();
        if (messages.length === 0) {
            const empty = new MessageTreeItem('暂无消息记录');
            empty.iconPath = new vscode.ThemeIcon('info');
            return [empty];
        }
        return messages.map(m => this.buildItem(m));
    }
    buildItem(captured) {
        const arrow = captured.direction === 'send' ? '↑' : '↓';
        const time = this.formatTime(captured.timestamp);
        const payloadPreview = this.truncatePayload(captured.message.payload, 60);
        const label = `${arrow} ${captured.message.type}  [${time}]  ${payloadPreview}`;
        const item = new MessageTreeItem(label, captured);
        // 图标：发送用箭头上、接收用箭头下
        item.iconPath = new vscode.ThemeIcon(captured.direction === 'send' ? 'arrow-up' : 'arrow-down');
        // 详细 tooltip
        item.tooltip = new vscode.MarkdownString(`**${captured.direction === 'send' ? '发送' : '接收'}** \`${captured.message.type}\`\n\n` +
            `**时间:** ${captured.timestamp.toLocaleString()}\n\n` +
            `**Session:** ${captured.message.sessionId}\n\n` +
            `**Payload 预览:**\n\`\`\`json\n${JSON.stringify(captured.message.payload, null, 2).substring(0, 500)}\n\`\`\`\n\n` +
            `*点击查看完整 JSON*`);
        item.tooltip.isTrusted = true;
        // 上下文值，方便后续右键菜单区分
        item.contextValue = `message-${captured.direction}`;
        return item;
    }
    formatTime(date) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        const ms = String(date.getMilliseconds()).padStart(3, '0');
        return `${h}:${m}:${s}.${ms}`;
    }
    truncatePayload(payload, maxLen) {
        if (payload === null || payload === undefined) {
            return '(empty)';
        }
        let str;
        if (typeof payload === 'string') {
            str = payload;
        }
        else {
            try {
                str = JSON.stringify(payload);
            }
            catch {
                str = String(payload);
            }
        }
        if (str.length > maxLen) {
            return str.substring(0, maxLen) + '…';
        }
        return str;
    }
    dispose() {
        // 清理节流计时器
        if (this._refreshTimer !== undefined) {
            clearTimeout(this._refreshTimer);
            this._refreshTimer = undefined;
        }
        for (const d of this.disposables) {
            d.dispose();
        }
        this.disposables = [];
        this._onDidChangeTreeData.dispose();
    }
}
exports.MessageTreeDataProvider = MessageTreeDataProvider;
//# sourceMappingURL=message-tree.js.map