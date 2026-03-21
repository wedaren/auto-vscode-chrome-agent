// mcp-client.ts — chrome-devtools-mcp 集成，通过 stdio 子进程启动 MCP Server 并提供工具调用接口
// 支持 VSCode settings 可配置启动参数 + 完整工具 Schema（含 inputSchema）存储
import * as vscode from 'vscode';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/** MCP 工具调用结果 */
export interface McpToolResult {
  content: unknown[];
  isError?: boolean;
}

/** MCP 工具完整信息（含 inputSchema） */
export interface McpToolInfo {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

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
function buildMcpArgs(): string[] {
  const cfg = vscode.workspace.getConfiguration('browserAgent.mcp');

  const args: string[] = ['-y', 'chrome-devtools-mcp@latest'];

  const browserUrl = cfg.get<string>('browserUrl', '');
  if (browserUrl) {
    args.push('--browserUrl', browserUrl);
  }

  if (cfg.get<boolean>('autoConnect', false)) {
    args.push('--autoConnect');
  }

  if (cfg.get<boolean>('headless', false)) {
    args.push('--headless');
  }

  if (cfg.get<boolean>('slim', false)) {
    args.push('--slim');
  }

  if (cfg.get<boolean>('noUsageStatistics', true)) {
    args.push('--no-usage-statistics');
  }

  const extraArgs = cfg.get<string[]>('extraArgs', []);
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
export class McpClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private outputChannel: vscode.OutputChannel;
  private _connected = false;
  private _discoveredTools: McpToolInfo[] = [];

  /** 状态变更事件，当连接状态或工具列表变化时触发 */
  private readonly _onDidChangeState = new vscode.EventEmitter<void>();
  readonly onDidChangeState = this._onDidChangeState.event;

  constructor(outputChannel: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
  }

  /** 当前是否已连接 */
  get connected(): boolean {
    return this._connected;
  }

  /** 已发现的 MCP 工具列表（缓存），包含完整 inputSchema */
  get discoveredTools(): ReadonlyArray<McpToolInfo> {
    return this._discoveredTools;
  }

  /**
   * 启动 chrome-devtools-mcp 子进程并建立 MCP 连接。
   * 启动参数从 VSCode settings (browserAgent.mcp.*) 动态读取。
   */
  async connect(): Promise<void> {
    if (this._connected) {
      this.outputChannel.appendLine('[McpClient] 已连接，跳过重复连接');
      return;
    }

    this.outputChannel.appendLine('[McpClient] 正在启动 chrome-devtools-mcp...');

    try {
      // 从 VSCode settings 动态构建启动参数
      const mcpArgs = buildMcpArgs();
      this.outputChannel.appendLine(
        `[McpClient] 启动参数: npx ${mcpArgs.join(' ')}`,
      );

      // 创建 stdio transport，启动 npx chrome-devtools-mcp@latest 子进程
      this.transport = new StdioClientTransport({
        command: 'npx',
        args: mcpArgs,
      });

      // 创建 MCP Client 实例
      this.client = new Client({
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
      } catch {
        // 工具发现失败不影响连接状态
        this.outputChannel.appendLine('[McpClient] 自动工具发现失败，可稍后手动调用 listTools()');
      }

      this.outputChannel.appendLine('[McpClient] chrome-devtools-mcp 已连接');
      vscode.window.showInformationMessage('Browser Agent: DevTools MCP 已就绪');
    } catch (err) {
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
  async listTools(): Promise<McpToolInfo[]> {
    if (!this.client || !this._connected) {
      throw new Error('McpClient 未连接，请先调用 connect()');
    }

    const result = await this.client.listTools();
    const tools: McpToolInfo[] = result.tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema as Record<string, unknown> | undefined,
    }));

    this.outputChannel.appendLine(
      `[McpClient] 可用工具 (${tools.length}): ${tools.map((t) => t.name).join(', ')}`,
    );

    // 更新缓存
    this._discoveredTools = tools;

    return tools;
  }

  /**
   * 调用 MCP Server 上的指定工具
   * @param toolName 工具名称（如 navigate_page, take_screenshot 等）
   * @param args 工具参数
   */
  async callTool(toolName: string, args: Record<string, unknown> = {}): Promise<McpToolResult> {
    if (!this.client || !this._connected) {
      throw new Error('McpClient 未连接，请先调用 connect()');
    }

    this.outputChannel.appendLine(
      `[McpClient] 调用工具: ${toolName}, 参数: ${JSON.stringify(args)}`,
    );

    const result = await this.client.callTool({ name: toolName, arguments: args });

    this.outputChannel.appendLine(
      `[McpClient] 工具 ${toolName} 返回: ${JSON.stringify(result).substring(0, 500)}`,
    );

    return result as McpToolResult;
  }

  /**
   * 关闭 MCP 连接并终止子进程
   */
  async dispose(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        this.outputChannel.appendLine('[McpClient] MCP 客户端已关闭');
      } catch (err) {
        this.outputChannel.appendLine(
          `[McpClient] 关闭时出错: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      this.client = null;
    }

    if (this.transport) {
      try {
        await this.transport.close();
        this.outputChannel.appendLine('[McpClient] Transport 已关闭');
      } catch {
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
