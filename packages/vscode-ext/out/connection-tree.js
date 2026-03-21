"use strict";
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
exports.ConnectionTreeDataProvider = exports.ConnectionTreeItem = void 0;
// connection-tree.ts — 连接状态 TreeView 的 TreeDataProvider 占位实现
// 后续 evo_v5_002 将填充 WebSocket / MCP / 模型 状态展示逻辑
const vscode = __importStar(require("vscode"));
/** 连接状态树节点 */
class ConnectionTreeItem extends vscode.TreeItem {
    constructor(label) {
        super(label, vscode.TreeItemCollapsibleState.None);
    }
}
exports.ConnectionTreeItem = ConnectionTreeItem;
/** 连接状态 TreeDataProvider（占位） */
class ConnectionTreeDataProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(_element) {
        // 占位：后续实现
        return [new ConnectionTreeItem('WebSocket: 待实现'), new ConnectionTreeItem('MCP: 待实现'), new ConnectionTreeItem('模型: 待实现')];
    }
    dispose() {
        this._onDidChangeTreeData.dispose();
    }
}
exports.ConnectionTreeDataProvider = ConnectionTreeDataProvider;
//# sourceMappingURL=connection-tree.js.map