// observability-tree.ts — Activity Bar 中的 Observability 仓库视图
// 职责：展示 VS Code 权威仓库的总览、存储占用、保留策略、诊断包目录和最近 trace，
//       让用户无需打开 Chrome DebugPanel 也能在扩展侧查看仓库健康度。

import * as vscode from 'vscode';
import { type WarehouseTraceRecord } from './observability';
import { ObservabilityStore } from './observability-store';

type ObservabilityNodeType = 'overview' | 'storage' | 'retention' | 'exports' | 'recent' | 'trace' | 'detail';
const TREE_REFRESH_DEBOUNCE_MS = 250;

export class ObservabilityTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly nodeType: ObservabilityNodeType,
    public readonly traceId?: string,
  ) {
    super(label, collapsibleState);
  }
}

export class ObservabilityTreeDataProvider implements vscode.TreeDataProvider<ObservabilityTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<ObservabilityTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private readonly disposables: vscode.Disposable[] = [];
  private store?: ObservabilityStore;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  bind(store: ObservabilityStore): void {
    this.store = store;
    this.disposables.push(
      store.onDidChangeStore(() => this.refresh()),
    );
    this.refresh(true);
  }

  refresh(immediate = false): void {
    if (!immediate) {
      if (this.refreshTimer) return;
      this.refreshTimer = setTimeout(() => {
        this.refreshTimer = null;
        this.refresh(true);
      }, TREE_REFRESH_DEBOUNCE_MS);
      return;
    }
    this.cancelRefreshTimer();
    this._onDidChangeTreeData.fire();
  }

  dispose(): void {
    this.cancelRefreshTimer();
    while (this.disposables.length > 0) {
      this.disposables.pop()?.dispose();
    }
    this._onDidChangeTreeData.dispose();
  }

  getTreeItem(element: ObservabilityTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ObservabilityTreeItem): ObservabilityTreeItem[] {
    if (!element) {
      return this.getRootItems();
    }

    switch (element.nodeType) {
      case 'overview':
        return this.getOverviewChildren();
      case 'storage':
        return this.getStorageChildren();
      case 'retention':
        return this.getRetentionChildren();
      case 'exports':
        return this.getExportChildren();
      case 'recent':
        return this.getRecentTraceItems();
      case 'trace':
        return this.getTraceChildren(element.traceId);
      default:
        return [];
    }
  }

  /** 根层按“总览/存储/保留/导出/最近 trace”五个入口组织仓库信息。 */
  private getRootItems(): ObservabilityTreeItem[] {
    if (!this.store) {
      return [this.buildEmptyItem('Observability 仓库未初始化')];
    }

    const stats = this.store.getStats();
    const storage = this.store.getStorageStats();

    const overview = new ObservabilityTreeItem(
      `总览 — ${stats.traceCount} traces / ${storage.persistedEventCount} events`,
      vscode.TreeItemCollapsibleState.Expanded,
      'overview',
    );
    overview.iconPath = new vscode.ThemeIcon('pulse');

    const storageItem = new ObservabilityTreeItem(
      `存储 — ${formatBytes(storage.totalBytes)}`,
      vscode.TreeItemCollapsibleState.Collapsed,
      'storage',
    );
    storageItem.iconPath = new vscode.ThemeIcon('database');

    const retention = new ObservabilityTreeItem(
      '保留策略',
      vscode.TreeItemCollapsibleState.Collapsed,
      'retention',
    );
    retention.iconPath = new vscode.ThemeIcon('history');

    const exportsItem = new ObservabilityTreeItem(
      `诊断包 — ${storage.diagnosticPackageCount} 个`,
      vscode.TreeItemCollapsibleState.Collapsed,
      'exports',
    );
    exportsItem.iconPath = new vscode.ThemeIcon('package');

    const recent = new ObservabilityTreeItem(
      `最近 Trace — ${Math.min(this.store.getRecentTraces(8).length, 8)} 条`,
      vscode.TreeItemCollapsibleState.Expanded,
      'recent',
    );
    recent.iconPath = new vscode.ThemeIcon('list-flat');

    return [overview, storageItem, retention, exportsItem, recent];
  }

  private getOverviewChildren(): ObservabilityTreeItem[] {
    if (!this.store) return [];
    const stats = this.store.getStats();
    const items = [
      this.detailItem(`最近 1h 事件: ${stats.eventCount}`, 'graph'),
      this.detailItem(`运行中 Trace: ${stats.runningTraceCount}`, stats.runningTraceCount > 0 ? 'sync~spin' : 'check'),
      this.detailItem(`错误 Trace: ${stats.errorTraceCount}`, stats.errorTraceCount > 0 ? 'error' : 'pass'),
      this.detailItem(`平均耗时: ${formatDuration(stats.avgTraceDurationMs)}`, 'watch'),
      this.detailItem(`入站/出站: ${stats.inboundCount} / ${stats.outboundCount}`, 'arrow-swap'),
    ];
    return items;
  }

  /** 存储节点展示 JSONL 仓库与导出目录的占用情况，并提供目录跳转。 */
  private getStorageChildren(): ObservabilityTreeItem[] {
    if (!this.store) return [];
    const storage = this.store.getStorageStats();
    const observabilityDir = this.store.getObservabilityDirectory();
    const exportsDir = this.store.getDiagnosticExportsDirectory();

    const rootItem = this.detailItem(`仓库目录: ${observabilityDir}`, 'folder');
    rootItem.command = {
      command: 'browser-agent.revealObservabilityDir',
      title: 'Reveal Observability Dir',
      arguments: ['root'],
    };
    rootItem.tooltip = observabilityDir;

    const exportsItem = this.detailItem(`导出目录: ${exportsDir}`, 'folder-library');
    exportsItem.command = {
      command: 'browser-agent.revealObservabilityDir',
      title: 'Reveal Observability Exports Dir',
      arguments: ['exports'],
    };
    exportsItem.tooltip = exportsDir;

    return [
      this.detailItem(`Events: ${storage.persistedEventCount} (${formatBytes(storage.eventsFileBytes)})`, 'file'),
      this.detailItem(`Spans: ${storage.persistedSpanCount} (${formatBytes(storage.spansFileBytes)})`, 'file-code'),
      this.detailItem(`诊断包体积: ${formatBytes(storage.exportsBytes)}`, 'archive'),
      this.detailItem(`总占用: ${formatBytes(storage.totalBytes)}`, 'server-process'),
      rootItem,
      exportsItem,
    ];
  }

  /** 保留策略节点直接映射仓库当前生效的 retention 配置。 */
  private getRetentionChildren(): ObservabilityTreeItem[] {
    if (!this.store) return [];
    const retention = this.store.getRetentionPolicy();
    return [
      this.detailItem(`事件保留: ${formatDuration(retention.eventRetentionMs)}`, 'history'),
      this.detailItem(`Span 保留: ${formatDuration(retention.spanRetentionMs)}`, 'history'),
      this.detailItem(`诊断包保留: ${formatDuration(retention.exportRetentionMs)}`, 'archive'),
      this.detailItem(`最大事件数: ${retention.maxPersistedEvents}`, 'symbol-number'),
      this.detailItem(`最大 Span 数: ${retention.maxPersistedSpans}`, 'symbol-number'),
      this.detailItem(`最大诊断包数: ${retention.maxDiagnosticPackages}`, 'package'),
      this.detailItem(
        `最近压缩: ${retention.lastCompactionAt ? formatTimestamp(retention.lastCompactionAt) : '尚未发生'}`,
        'clock',
      ),
    ];
  }

  /** 诊断包节点聚焦导出目录的数量、体积和快速打开入口。 */
  private getExportChildren(): ObservabilityTreeItem[] {
    if (!this.store) return [];
    const storage = this.store.getStorageStats();
    const exportDir = this.store.getDiagnosticExportsDirectory();
    const openItem = this.detailItem(`打开导出目录: ${exportDir}`, 'folder-opened');
    openItem.command = {
      command: 'browser-agent.revealObservabilityDir',
      title: 'Reveal Observability Exports Dir',
      arguments: ['exports'],
    };
    openItem.tooltip = exportDir;

    return [
      this.detailItem(`诊断包数量: ${storage.diagnosticPackageCount}`, 'package'),
      this.detailItem(`目录占用: ${formatBytes(storage.exportsBytes)}`, 'archive'),
      openItem,
    ];
  }

  /** 最近 trace 节点为仓库 trace 的快速入口，方便直接下钻单条链路。 */
  private getRecentTraceItems(): ObservabilityTreeItem[] {
    if (!this.store) return [];
    const traces = this.store.getRecentTraces(8);
    if (traces.length === 0) {
      return [this.buildEmptyItem('仓库暂无 Trace')];
    }

    return traces.map((trace) => {
      const item = new ObservabilityTreeItem(
        `${trace.status === 'error' ? '$(error)' : trace.status === 'running' ? '$(sync~spin)' : '$(check)'} ${trace.summary}`,
        vscode.TreeItemCollapsibleState.Collapsed,
        'trace',
        trace.id,
      );
      item.description = `${trace.events.length}e / ${trace.spans.length}s`;
      item.tooltip = new vscode.MarkdownString(
        `**${trace.id}**\n\n` +
        `状态: ${trace.status}\n\n` +
        `开始: ${new Date(trace.startedAt).toLocaleString()}\n\n` +
        `结束: ${new Date(trace.endedAt).toLocaleString()}\n\n` +
        `请求: ${trace.requestIds.join(', ') || '无'}\n\n` +
        `来源: ${trace.sources.join(', ') || '无'}`,
      );
      item.iconPath = new vscode.ThemeIcon(trace.status === 'error' ? 'error' : trace.status === 'running' ? 'sync' : 'pass');
      return item;
    });
  }

  private getTraceChildren(traceId: string | undefined): ObservabilityTreeItem[] {
    if (!this.store || !traceId) return [];
    const trace = this.store.getTrace(traceId);
    if (!trace) return [this.buildEmptyItem('Trace 不存在')];

    return [
      this.detailItem(`Trace ID: ${trace.id}`, 'key'),
      this.detailItem(`状态: ${trace.status}`, trace.status === 'error' ? 'error' : trace.status === 'running' ? 'sync' : 'pass'),
      this.detailItem(`时间窗: ${formatTimestamp(trace.startedAt)} -> ${formatTimestamp(trace.endedAt)}`, 'clock'),
      this.detailItem(`事件/Span: ${trace.events.length} / ${trace.spans.length}`, 'symbol-event'),
      this.detailItem(`错误数: ${trace.errorCount}`, trace.errorCount > 0 ? 'error' : 'pass'),
      this.detailItem(`请求 IDs: ${trace.requestIds.join(', ') || '无'}`, 'tag'),
      this.detailItem(`来源: ${trace.sources.join(', ') || '无'}`, 'server-environment'),
    ];
  }

  private detailItem(label: string, icon: string): ObservabilityTreeItem {
    const item = new ObservabilityTreeItem(label, vscode.TreeItemCollapsibleState.None, 'detail');
    item.iconPath = new vscode.ThemeIcon(icon);
    item.tooltip = label;
    return item;
  }

  private buildEmptyItem(label: string): ObservabilityTreeItem {
    const item = new ObservabilityTreeItem(label, vscode.TreeItemCollapsibleState.None, 'detail');
    item.iconPath = new vscode.ThemeIcon('info');
    return item;
  }

  private cancelRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 60 * 60_000) return `${(ms / 60_000).toFixed(1)}m`;
  if (ms < 24 * 60 * 60_000) return `${(ms / (60 * 60_000)).toFixed(1)}h`;
  return `${(ms / (24 * 60 * 60_000)).toFixed(1)}d`;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}
