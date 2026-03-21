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
// 子进程健壮性：崩溃自动重启（指数退避最多 3 次） + 60s 周期健康检查 + 完整生命周期日志
const vscode = __importStar(require("vscode"));
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
/** 最大自动重启次数 */
const MAX_RESTART_ATTEMPTS = 3;
/** 重连基础延迟 ms（指数退避: baseDelay * 2^attempt） */
const RESTART_BASE_DELAY_MS = 2000;
/** 健康检查间隔 ms（60 秒） */
const HEALTH_CHECK_INTERVAL_MS = 60_000;
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
 * 健壮性保障：
 * - restartOnCrash：transport close 事件 → 指数退避自动重连（最多 MAX_RESTART_ATTEMPTS 次）
 * - healthCheck：每 HEALTH_CHECK_INTERVAL_MS 调用 listTools() 验证子进程存活
 * - dispose()：清理所有定时器、监听器和子进程资源
 *
 * 生命周期：在 activate() 时可选启动，deactivate() 时自动关闭子进程。
 */
class McpClient {
    client = null;
    transport = null;
    outputChannel;
    _connectionState = 'idle';
    _discoveredTools = [];
    // --- 自动重启相关 ---
    /** 当前连续重启尝试次数 */
    retryCount = 0;
    /** 重连定时器句柄 */
    reconnectTimer = null;
    /** 是否正在 dispose（避免 dispose 期间触发重连） */
    _disposing = false;
    /** 是否由用户主动调用 disconnect（避免主动断开触发自动重连） */
    _manualDisconnect = false;
    // --- 健康检查相关 ---
    /** 健康检查定时器句柄 */
    healthCheckTimer = null;
    /** 状态变更事件，当连接状态或工具列表变化时触发 */
    _onDidChangeState = new vscode.EventEmitter();
    onDidChangeState = this._onDidChangeState.event;
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
    }
    // ==================== 公共属性 ====================
    /** 当前是否已连接 */
    get connected() {
        return this._connectionState === 'connected';
    }
    /** 当前连接状态 */
    get connectionState() {
        return this._connectionState;
    }
    /** 已发现的 MCP 工具列表（缓存），包含完整 inputSchema */
    get discoveredTools() {
        return this._discoveredTools;
    }
    // ==================== 生命周期管理 ====================
    /**
     * 启动 chrome-devtools-mcp 子进程并建立 MCP 连接。
     * 启动参数从 VSCode settings (browserAgent.mcp.*) 动态读取。
     */
    async connect() {
        if (this._connectionState === 'connected') {
            this.log('已连接，跳过重复连接');
            return;
        }
        this._manualDisconnect = false;
        await this.doConnect();
    }
    /**
     * 主动断开连接（不触发自动重连）
     */
    async disconnect() {
        this._manualDisconnect = true;
        this.stopHealthCheck();
        this.cancelReconnectTimer();
        await this.cleanupConnection();
        this.setConnectionState('disconnected');
        this.log('已主动断开连接');
    }
    /**
     * 列出 MCP Server 提供的所有可用工具（含完整 inputSchema）
     */
    async listTools() {
        if (!this.client || this._connectionState !== 'connected') {
            throw new Error('McpClient 未连接，请先调用 connect()');
        }
        const result = await this.client.listTools();
        const tools = result.tools.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
        }));
        this.log(`可用工具 (${tools.length}): ${tools.map((t) => t.name).join(', ')}`);
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
        if (!this.client || this._connectionState !== 'connected') {
            throw new Error('McpClient 未连接，请先调用 connect()');
        }
        this.log(`调用工具: ${toolName}, 参数: ${JSON.stringify(args)}`);
        const result = await this.client.callTool({ name: toolName, arguments: args });
        this.log(`工具 ${toolName} 返回: ${JSON.stringify(result).substring(0, 500)}`);
        return result;
    }
    /**
     * 关闭 MCP 连接并终止子进程，清理所有定时器和监听器
     */
    async dispose() {
        this._disposing = true;
        this.log('开始 dispose：清理所有资源...');
        // 1. 停止健康检查
        this.stopHealthCheck();
        // 2. 取消待执行的重连定时器
        this.cancelReconnectTimer();
        // 3. 清理 MCP 连接和子进程
        await this.cleanupConnection();
        // 4. 重置状态
        this._connectionState = 'idle';
        this._discoveredTools = [];
        this.retryCount = 0;
        // 5. 释放事件发射器
        this._onDidChangeState.fire();
        this._onDidChangeState.dispose();
        this.log('dispose 完成：所有资源已释放');
    }
    // ==================== 内部：连接核心 ====================
    /**
     * 执行实际的连接流程（connect 和 reconnect 共用）
     */
    async doConnect() {
        const isReconnect = this._connectionState === 'reconnecting';
        this.setConnectionState(isReconnect ? 'reconnecting' : 'connecting');
        this.log(`正在启动 chrome-devtools-mcp...（${isReconnect ? `重连第 ${this.retryCount} 次` : '首次连接'}）`);
        try {
            // 从 VSCode settings 动态构建启动参数
            const mcpArgs = buildMcpArgs();
            this.log(`启动参数: npx ${mcpArgs.join(' ')}`);
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
            // 注册 transport close/error 回调（在 client.connect() 之前设置，SDK 会保留链）
            this.setupTransportListeners();
            // 连接到 MCP Server
            await this.client.connect(this.transport);
            this.setConnectionState('connected');
            // 重连成功时重置重试计数
            this.retryCount = 0;
            // 连接成功后自动发现工具并缓存（含完整 inputSchema）
            try {
                const tools = await this.listTools();
                this._discoveredTools = tools;
                this._onDidChangeState.fire();
            }
            catch {
                // 工具发现失败不影响连接状态
                this.log('自动工具发现失败，可稍后手动调用 listTools()');
            }
            // 启动周期性健康检查
            this.startHealthCheck();
            this.log('chrome-devtools-mcp 已连接');
            vscode.window.showInformationMessage(isReconnect
                ? 'Browser Agent: DevTools MCP 已重新连接'
                : 'Browser Agent: DevTools MCP 已就绪');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.log(`连接失败: ${message}`);
            // 清理本次失败的连接资源
            await this.cleanupConnection();
            // 如果不是 dispose 期间且非手动断开，尝试自动重连
            if (!this._disposing && !this._manualDisconnect) {
                this.scheduleReconnect();
            }
            else {
                this.setConnectionState('disconnected');
                throw err;
            }
        }
    }
    // ==================== 内部：崩溃自动重启（restartOnCrash） ====================
    /**
     * 设置 transport 层的 close/error 监听，用于检测子进程崩溃
     */
    setupTransportListeners() {
        if (!this.transport) {
            return;
        }
        // 保存 transport 的原始 onclose（SDK 在 client.connect 时会进一步链式包装）
        const originalOnClose = this.transport.onclose;
        this.transport.onclose = () => {
            originalOnClose?.();
            this.handleTransportClose();
        };
        const originalOnError = this.transport.onerror;
        this.transport.onerror = (error) => {
            originalOnError?.(error);
            this.handleTransportError(error);
        };
    }
    /**
     * Transport 关闭回调：子进程退出或连接断开
     */
    handleTransportClose() {
        this.log('[LIFECYCLE] transport onclose 触发 — 子进程已退出');
        // dispose 期间或主动断开不触发重连
        if (this._disposing || this._manualDisconnect) {
            this.log('[LIFECYCLE] dispose/手动断开中，不触发自动重连');
            return;
        }
        // 只在 connected 状态下触发重连（避免连接过程中的误触发）
        if (this._connectionState === 'connected') {
            this.stopHealthCheck();
            this.client = null;
            this.transport = null;
            this.scheduleReconnect();
        }
    }
    /**
     * Transport 错误回调：记录但不直接触发重连（等待 onclose）
     */
    handleTransportError(error) {
        this.log(`[LIFECYCLE] transport onerror: ${error.message}`);
    }
    /**
     * 安排一次指数退避重连
     */
    scheduleReconnect() {
        if (this.retryCount >= MAX_RESTART_ATTEMPTS) {
            this.log(`[LIFECYCLE] 已达最大重启次数 (${MAX_RESTART_ATTEMPTS})，放弃自动重连`);
            this.setConnectionState('disconnected');
            vscode.window.showWarningMessage(`Browser Agent: DevTools MCP 子进程崩溃且重启 ${MAX_RESTART_ATTEMPTS} 次均失败，请手动重新连接`);
            return;
        }
        this.retryCount++;
        const delay = RESTART_BASE_DELAY_MS * Math.pow(2, this.retryCount - 1);
        this.log(`[LIFECYCLE] 将在 ${delay}ms 后进行第 ${this.retryCount}/${MAX_RESTART_ATTEMPTS} 次重连`);
        this.setConnectionState('reconnecting');
        this.cancelReconnectTimer();
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            void this.doConnect().catch((err) => {
                this.log(`[LIFECYCLE] 重连失败: ${err instanceof Error ? err.message : String(err)}`);
            });
        }, delay);
    }
    /**
     * 取消待执行的重连定时器
     */
    cancelReconnectTimer() {
        if (this.reconnectTimer !== null) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
            this.log('[LIFECYCLE] 已取消待执行的重连定时器');
        }
    }
    // ==================== 内部：健康检查 ====================
    /**
     * 启动周期性健康检查（每 HEALTH_CHECK_INTERVAL_MS 调用 listTools() 验证子进程存活）
     */
    startHealthCheck() {
        this.stopHealthCheck();
        this.healthCheckTimer = setInterval(() => {
            void this.performHealthCheck();
        }, HEALTH_CHECK_INTERVAL_MS);
        this.log(`[HEALTH] 健康检查已启动（间隔 ${HEALTH_CHECK_INTERVAL_MS / 1000}s）`);
    }
    /**
     * 停止健康检查定时器
     */
    stopHealthCheck() {
        if (this.healthCheckTimer !== null) {
            clearInterval(this.healthCheckTimer);
            this.healthCheckTimer = null;
            this.log('[HEALTH] 健康检查已停止');
        }
    }
    /**
     * 执行一次健康检查
     */
    async performHealthCheck() {
        if (this._connectionState !== 'connected' || !this.client) {
            return;
        }
        try {
            const tools = await this.client.listTools();
            this._discoveredTools = tools.tools.map((t) => ({
                name: t.name,
                description: t.description,
                inputSchema: t.inputSchema,
            }));
            this.log(`[HEALTH] 健康检查通过 — ${this._discoveredTools.length} 个工具可用`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.log(`[HEALTH] 健康检查失败: ${message}`);
            // 健康检查失败说明子进程可能已死，触发重连
            if (this._connectionState === 'connected' && !this._disposing && !this._manualDisconnect) {
                this.log('[HEALTH] 子进程可能已崩溃，触发自动重连');
                this.stopHealthCheck();
                await this.cleanupConnection();
                this.scheduleReconnect();
            }
        }
    }
    // ==================== 内部：工具方法 ====================
    /**
     * 清理当前 MCP 连接和子进程资源
     */
    async cleanupConnection() {
        if (this.client) {
            try {
                await this.client.close();
                this.log('MCP 客户端已关闭');
            }
            catch (err) {
                this.log(`关闭 Client 时出错: ${err instanceof Error ? err.message : String(err)}`);
            }
            this.client = null;
        }
        if (this.transport) {
            try {
                await this.transport.close();
                this.log('Transport 已关闭');
            }
            catch {
                // 子进程可能已经退出，忽略错误
            }
            this.transport = null;
        }
    }
    /**
     * 更新连接状态并触发事件
     */
    setConnectionState(state) {
        if (this._connectionState === state) {
            return;
        }
        const prev = this._connectionState;
        this._connectionState = state;
        this.log(`[LIFECYCLE] 状态变更: ${prev} → ${state}`);
        this._onDidChangeState.fire();
    }
    /**
     * 统一日志输出
     */
    log(message) {
        this.outputChannel.appendLine(`[McpClient] ${message}`);
    }
}
exports.McpClient = McpClient;
//# sourceMappingURL=mcp-client.js.map