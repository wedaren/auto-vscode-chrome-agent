// mcp-client.ts — chrome-devtools-mcp 集成，通过 stdio 子进程启动 MCP Server 并提供工具调用接口
import * as vscode from 'vscode';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/** MCP 工具调用结果 */
export interface McpToolResult {
  content: unknown[];
  isError?: boolean;
}

/**
 * McpClient 封装与 chrome-devtools-mcp 的 MCP 协议通信。
 *
 * 通过 stdio transport 启动 `npx chrome-devtools-mcp@latest` 子进程，
 * 使用 @modelcontextprotocol/sdk 进行工具发现和调用。
 *
 * 生命周期：在 activate() 时可选启动，deactivate() 时自动关闭子进程。
 */
export class McpClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private outputChannel: vscode.OutputChannel;
  private _connected = false;

  constructor(outputChannel: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
  }

  /** 当前是否已连接 */
  get connected(): boolean {
    return this._connected;
  }

  /**
   * 启动 chrome-devtools-mcp 子进程并建立 MCP 连接
   */
  async connect(): Promise<void> {
    if (this._connected) {
      this.outputChannel.appendLine('[McpClient] 已连接，跳过重复连接');
      return;
    }

    this.outputChannel.appendLine('[McpClient] 正在启动 chrome-devtools-mcp...');

    try {
      // 创建 stdio transport，启动 npx chrome-devtools-mcp@latest 子进程
      this.transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', 'chrome-devtools-mcp@latest'],
      });

      // 创建 MCP Client 实例
      this.client = new Client({
        name: 'browser-agent-vscode',
        version: '0.1.0',
      });

      // 连接到 MCP Server
      await this.client.connect(this.transport);
      this._connected = true;

      this.outputChannel.appendLine('[McpClient] chrome-devtools-mcp 已连接');
      vscode.window.showInformationMessage('Browser Agent: DevTools MCP 已就绪');
    } catch (err) {
      this._connected = false;
      const message = err instanceof Error ? err.message : String(err);
      this.outputChannel.appendLine(`[McpClient] 连接失败: ${message}`);
      throw err;
    }
  }

  /**
   * 列出 MCP Server 提供的所有可用工具
   */
  async listTools(): Promise<{ name: string; description?: string }[]> {
    if (!this.client || !this._connected) {
      throw new Error('McpClient 未连接，请先调用 connect()');
    }

    const result = await this.client.listTools();
    const tools = result.tools.map((t) => ({
      name: t.name,
      description: t.description,
    }));

    this.outputChannel.appendLine(
      `[McpClient] 可用工具 (${tools.length}): ${tools.map((t) => t.name).join(', ')}`,
    );

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
  }
}
