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
exports.McpClient = void 0;
// mcp-client.ts — chrome-devtools-mcp 集成，通过 stdio 子进程启动 MCP Server 并提供工具调用接口
// 支持 VSCode settings 可配置启动参数 + 完整工具 Schema（含 inputSchema）存储
const vscode = __importStar(require("vscode"));
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
/**
 * 从 VSCode settings 读取 browserAgent.mcp.* 配置，构建 npx 启动参数列表。
 *
 * 支持的配置项：
 * - browserAgent.mcp.browserUrl: 连接已运行的 Chrome 实例
 * - browserAgent.mcp.autoConnect: 自动连接本地 Chrome
 * - browserAgent.mcp.headless: 无头模式
 * - browserAgent.mcp.slim: 精简模式
 * - browserAgent.mcp.noUsageStatistics: 关闭使用统计
 * - browserAgent.mcp.extraArgs: 额外命令行参数
 */
function buildMcpArgs() {
    const cfg = vscode.workspace.getConfiguration('browserAgent.mcp');
    const args = ['-y', 'chrome-devtools-mcp@latest'];
    const browserUrl = cfg.get('browserUrl', '');
    if (browserUrl) {
        args.push('--browserUrl', browserUrl);
    }
    if (cfg.get('autoConnect', false)) {
        args.push('--autoConnect');
    }
    if (cfg.get('headless', false)) {
        args.push('--headless');
    }
    if (cfg.get('slim', false)) {
        args.push('--slim');
    }
    if (cfg.get('noUsageStatistics', true)) {
        args.push('--no-usage-statistics');
    }
    const extraArgs = cfg.get('extraArgs', []);
    if (extraArgs.length > 0) {
        args.push(...extraArgs);
    }
    return args;
}
/**
 * McpClient 封装与 chrome-devtools-mcp 的 MCP 协议通信。
 *
 * 通过 stdio transport 启动 `npx chrome-devtools-mcp@latest` 子进程，
 * 使用 @modelcontextprotocol/sdk 进行工具发现和调用。
 * 启动参数通过 VSCode settings (browserAgent.mcp.*) 动态构建。
 *
 * 生命周期：在 activate() 时可选启动，deactivate() 时自动关闭子进程。
 */
class McpClient {
    client = null;
    transport = null;
    outputChannel;
    _connected = false;
    _discoveredTools = [];
    /** 状态变更事件，当连接状态或工具列表变化时触发 */
    _onDidChangeState = new vscode.EventEmitter();
    onDidChangeState = this._onDidChangeState.event;
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
    }
    /** 当前是否已连接 */
    get connected() {
        return this._connected;
    }
    /** 已发现的 MCP 工具列表（缓存），包含完整 inputSchema */
    get discoveredTools() {
        return this._discoveredTools;
    }
    /**
     * 启动 chrome-devtools-mcp 子进程并建立 MCP 连接。
     * 启动参数从 VSCode settings (browserAgent.mcp.*) 动态读取。
     */
    async connect() {
        if (this._connected) {
            this.outputChannel.appendLine('[McpClient] 已连接，跳过重复连接');
            return;
        }
        this.outputChannel.appendLine('[McpClient] 正在启动 chrome-devtools-mcp...');
        try {
            // 从 VSCode settings 动态构建启动参数
            const mcpArgs = buildMcpArgs();
            this.outputChannel.appendLine(`[McpClient] 启动参数: npx ${mcpArgs.join(' ')}`);
            // 创建 stdio transport，启动 npx chrome-devtools-mcp@latest 子进程
            this.transport = new stdio_js_1.StdioClientTransport({
                command: 'npx',
                args: mcpArgs,
            });
            // 创建 MCP Client 实例
            this.client = new index_js_1.Client({
                name: 'browser-agent-vscode',
                version: '0.1.0',
            });
            // 连接到 MCP Server
            await this.client.connect(this.transport);
            this._connected = true;
            this._onDidChangeState.fire();
            // 连接成功后自动发现工具并缓存（含完整 inputSchema）
            try {
                const tools = await this.listTools();
                this._discoveredTools = tools;
                this._onDidChangeState.fire();
            }
            catch {
                // 工具发现失败不影响连接状态
                this.outputChannel.appendLine('[McpClient] 自动工具发现失败，可稍后手动调用 listTools()');
            }
            this.outputChannel.appendLine('[McpClient] chrome-devtools-mcp 已连接');
            vscode.window.showInformationMessage('Browser Agent: DevTools MCP 已就绪');
        }
        catch (err) {
            this._connected = false;
            this._onDidChangeState.fire();
            const message = err instanceof Error ? err.message : String(err);
            this.outputChannel.appendLine(`[McpClient] 连接失败: ${message}`);
            throw err;
        }
    }
    /**
     * 列出 MCP Server 提供的所有可用工具（含完整 inputSchema）
     */
    async listTools() {
        if (!this.client || !this._connected) {
            throw new Error('McpClient 未连接，请先调用 connect()');
        }
        const result = await this.client.listTools();
        const tools = result.tools.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
        }));
        this.outputChannel.appendLine(`[McpClient] 可用工具 (${tools.length}): ${tools.map((t) => t.name).join(', ')}`);
        // 更新缓存
        this._discoveredTools = tools;
        return tools;
    }
    /**
     * 调用 MCP Server 上的指定工具
     * @param toolName 工具名称（如 navigate_page, take_screenshot 等）
     * @param args 工具参数
     */
    async callTool(toolName, args = {}) {
        if (!this.client || !this._connected) {
            throw new Error('McpClient 未连接，请先调用 connect()');
        }
        this.outputChannel.appendLine(`[McpClient] 调用工具: ${toolName}, 参数: ${JSON.stringify(args)}`);
        const result = await this.client.callTool({ name: toolName, arguments: args });
        this.outputChannel.appendLine(`[McpClient] 工具 ${toolName} 返回: ${JSON.stringify(result).substring(0, 500)}`);
        return result;
    }
    /**
     * 关闭 MCP 连接并终止子进程
     */
    async dispose() {
        if (this.client) {
            try {
                await this.client.close();
                this.outputChannel.appendLine('[McpClient] MCP 客户端已关闭');
            }
            catch (err) {
                this.outputChannel.appendLine(`[McpClient] 关闭时出错: ${err instanceof Error ? err.message : String(err)}`);
            }
            this.client = null;
        }
        if (this.transport) {
            try {
                await this.transport.close();
                this.outputChannel.appendLine('[McpClient] Transport 已关闭');
            }
            catch {
                // 子进程可能已经退出，忽略错误
            }
            this.transport = null;
        }
        this._connected = false;
        this._discoveredTools = [];
        this._onDidChangeState.fire();
        this._onDidChangeState.dispose();
    }
}
exports.McpClient = McpClient;
//# sourceMappingURL=mcp-client.js.map