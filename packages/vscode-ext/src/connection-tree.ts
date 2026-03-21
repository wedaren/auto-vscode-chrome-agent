// connection-tree.ts — 连接状态 TreeView 的 TreeDataProvider 实现
// 展示 3 个顶级节点：WebSocket Server / MCP 连接 / 当前模型
// 订阅各服务的状态变更事件实现自动刷新
import * as vscode from 'vscode';
import { WsServer } from './ws-server';
import { McpClient } from './mcp-client';
import { LmService } from './lm-service';

/** 连接状态树节点 */
export class ConnectionTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
    public readonly nodeType?: 'ws' | 'mcp' | 'model' | 'mcp-tool' | 'detail',
  ) {
    super(label, collapsibleState);
  }
}

/** 连接状态 TreeDataProvider */
export class ConnectionTreeDataProvider implements vscode.TreeDataProvider<ConnectionTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<ConnectionTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private readonly disposables: vscode.Disposable[] = [];

  private wsServer?: WsServer;
  private mcpClient?: McpClient;
  private lmService?: LmService;

  constructor() {
    // 默认构造；通过 bind() 注入服务实例
  }

  /**
   * 绑定核心服务并订阅状态变更事件
   * 在 extension.ts 中创建服务后调用
   */
  bind(wsServer: WsServer, mcpClient: McpClient, lmService: LmService): void {
    this.wsServer = wsServer;
    this.mcpClient = mcpClient;
    this.lmService = lmService;

    // 订阅 WsServer 状态变更
    this.disposables.push(
      wsServer.onDidChangeState(() => this.refresh()),
    );

    // 订阅 McpClient 状态变更
    this.disposables.push(
      mcpClient.onDidChangeState(() => this.refresh()),
    );

    // 订阅 LmService 模型变更
    this.disposables.push(
      lmService.onDidChangeModel(() => this.refresh()),
    );

    // 首次刷新
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ConnectionTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ConnectionTreeItem): ConnectionTreeItem[] {
    // 顶级节点
    if (!element) {
      return this.getRootItems();
    }

    // 子节点
    switch (element.nodeType) {
      case 'ws':
        return this.getWsChildren();
      case 'mcp':
        return this.getMcpChildren();
      case 'model':
        return this.getModelChildren();
      default:
        return [];
    }
  }

  /** 构建 3 个顶级节点 */
  private getRootItems(): ConnectionTreeItem[] {
    const items: ConnectionTreeItem[] = [];

    // 1. WebSocket Server 节点
    const wsListening = this.wsServer?.listening ?? false;
    const wsStatus = wsListening ? '$(check) 监听中' : '$(circle-slash) 未启动';
    const wsItem = new ConnectionTreeItem(
      `WebSocket Server — ${wsStatus}`,
      vscode.TreeItemCollapsibleState.Expanded,
      'ws',
    );
    wsItem.iconPath = new vscode.ThemeIcon(wsListening ? 'broadcast' : 'debug-disconnect');
    wsItem.tooltip = wsListening
      ? `WebSocket 服务端运行中 (端口 ${this.wsServer?.port ?? '?'})`
      : 'WebSocket 服务端未启动';
    items.push(wsItem);

    // 2. MCP 连接节点
    const mcpConnected = this.mcpClient?.connected ?? false;
    const mcpStatus = mcpConnected ? '$(check) 已连接' : '$(circle-slash) 未连接';
    const mcpItem = new ConnectionTreeItem(
      `MCP 连接 — ${mcpStatus}`,
      vscode.TreeItemCollapsibleState.Expanded,
      'mcp',
    );
    mcpItem.iconPath = new vscode.ThemeIcon(mcpConnected ? 'plug' : 'debug-disconnect');
    mcpItem.tooltip = mcpConnected
      ? `chrome-devtools-mcp 已连接，发现 ${this.mcpClient?.discoveredTools.length ?? 0} 个工具`
      : 'chrome-devtools-mcp 未连接';
    items.push(mcpItem);

    // 3. 当前模型节点
    const modelInfo = this.lmService?.currentModel;
    const modelStatus = modelInfo ? `$(check) ${modelInfo.name}` : '$(circle-slash) 未选择';
    const modelItem = new ConnectionTreeItem(
      `当前模型 — ${modelStatus}`,
      vscode.TreeItemCollapsibleState.Expanded,
      'model',
    );
    modelItem.iconPath = new vscode.ThemeIcon(modelInfo ? 'hubot' : 'question');
    modelItem.tooltip = modelInfo
      ? `${modelInfo.name} (${modelInfo.vendor}/${modelInfo.family})`
      : '尚未选择语言模型';
    items.push(modelItem);

    return items;
  }

  /** WebSocket Server 子节点：端口、监听状态、客户端数 */
  private getWsChildren(): ConnectionTreeItem[] {
    const port = this.wsServer?.port ?? 7777;
    const listening = this.wsServer?.listening ?? false;
    const clientCount = this.wsServer?.clientCount ?? 0;

    const portItem = new ConnectionTreeItem(`端口: ${port}`, vscode.TreeItemCollapsibleState.None, 'detail');
    portItem.iconPath = new vscode.ThemeIcon('globe');

    const statusItem = new ConnectionTreeItem(
      `状态: ${listening ? '监听中' : '未启动'}`,
      vscode.TreeItemCollapsibleState.None,
      'detail',
    );
    statusItem.iconPath = new vscode.ThemeIcon(listening ? 'pass' : 'circle-slash');

    const clientItem = new ConnectionTreeItem(
      `已连接客户端: ${clientCount}`,
      vscode.TreeItemCollapsibleState.None,
      'detail',
    );
    clientItem.iconPath = new vscode.ThemeIcon('person');

    return [portItem, statusItem, clientItem];
  }

  /** MCP 连接子节点：状态 + 已发现工具列表 */
  private getMcpChildren(): ConnectionTreeItem[] {
    const connected = this.mcpClient?.connected ?? false;
    const tools = this.mcpClient?.discoveredTools ?? [];

    const statusItem = new ConnectionTreeItem(
      `状态: ${connected ? '已连接' : '未连接'}`,
      vscode.TreeItemCollapsibleState.None,
      'detail',
    );
    statusItem.iconPath = new vscode.ThemeIcon(connected ? 'pass' : 'circle-slash');

    const items: ConnectionTreeItem[] = [statusItem];

    if (connected && tools.length > 0) {
      for (const tool of tools) {
        const toolItem = new ConnectionTreeItem(
          `🔧 ${tool.name}`,
          vscode.TreeItemCollapsibleState.None,
          'mcp-tool',
        );
        toolItem.iconPath = new vscode.ThemeIcon('wrench');
        toolItem.tooltip = tool.description ?? tool.name;
        items.push(toolItem);
      }
    } else if (connected) {
      const noToolItem = new ConnectionTreeItem('工具发现中...', vscode.TreeItemCollapsibleState.None, 'detail');
      noToolItem.iconPath = new vscode.ThemeIcon('loading~spin');
      items.push(noToolItem);
    }

    return items;
  }

  /** 当前模型子节点：名称、vendor、family、maxInputTokens */
  private getModelChildren(): ConnectionTreeItem[] {
    const modelInfo = this.lmService?.currentModel;

    if (!modelInfo) {
      const noModel = new ConnectionTreeItem(
        '尚未选择模型（通过 Chrome 对话或命令选择）',
        vscode.TreeItemCollapsibleState.None,
        'detail',
      );
      noModel.iconPath = new vscode.ThemeIcon('info');
      return [noModel];
    }

    const nameItem = new ConnectionTreeItem(`名称: ${modelInfo.name}`, vscode.TreeItemCollapsibleState.None, 'detail');
    nameItem.iconPath = new vscode.ThemeIcon('tag');

    const vendorItem = new ConnectionTreeItem(`Vendor: ${modelInfo.vendor}`, vscode.TreeItemCollapsibleState.None, 'detail');
    vendorItem.iconPath = new vscode.ThemeIcon('organization');

    const familyItem = new ConnectionTreeItem(`Family: ${modelInfo.family}`, vscode.TreeItemCollapsibleState.None, 'detail');
    familyItem.iconPath = new vscode.ThemeIcon('symbol-class');

    const tokensItem = new ConnectionTreeItem(
      `Max Input Tokens: ${modelInfo.maxInputTokens.toLocaleString()}`,
      vscode.TreeItemCollapsibleState.None,
      'detail',
    );
    tokensItem.iconPath = new vscode.ThemeIcon('symbol-number');

    return [nameItem, vendorItem, familyItem, tokensItem];
  }

  dispose(): void {
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables.length = 0;
    this._onDidChangeTreeData.dispose();
  }
}
