import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import {
  sanitizeForLogging,
  type ObservabilityEvent,
  type ObservabilityIngestPayload,
  type ObservabilitySpan,
  type WarehouseRetentionPolicy,
  type WarehouseStats,
  type WarehouseStorageStats,
  type WarehouseTraceRecord,
} from './observability';
import { UserDataManager } from './user-data-manager';

// observability-store.ts — VS Code 侧权威 observability 仓库
// 职责：接收 Chrome/VS Code 两端的结构化事件与 span，落盘为 JSONL，
//       提供 trace 构建、统计聚合、保留策略、诊断包导出和仓库视图数据源。

const OBSERVABILITY_DIR = 'observability';
const EVENTS_FILE = 'events.jsonl';
const SPANS_FILE = 'spans.jsonl';
const EXPORTS_DIR = 'exports';
const EVENT_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
const SPAN_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
const EXPORT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_PERSISTED_EVENTS = 50000;
const MAX_PERSISTED_SPANS = 20000;
const MAX_DIAGNOSTIC_PACKAGES = 30;
const PERSIST_FLUSH_DELAY_MS = 400;
const STORE_CHANGE_DEBOUNCE_MS = 250;
const CONFIG_KEYS = [
  'port',
  'userDataDir',
  'mcp.browserUrl',
  'mcp.autoConnect',
  'mcp.headless',
  'mcp.slim',
  'mcp.noUsageStatistics',
  'mcp.extraArgs',
  'models.defaultModelId',
  'models.hiddenModelIds',
  'models.maxVisibleModels',
] as const;

type JsonPrimitive = string | number | boolean | null;

interface DirectoryUsage {
  bytes: number;
  packageCount: number;
}

interface RetentionResult {
  eventsRemoved: number;
  spansRemoved: number;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export class ObservabilityStore {
  private readonly outputChannel: vscode.OutputChannel;
  private readonly userDataManager: UserDataManager;
  private readonly events = new Map<string, ObservabilityEvent>();
  private readonly spans = new Map<string, ObservabilitySpan>();
  private readonly _onDidChangeStore = new vscode.EventEmitter<void>();
  readonly onDidChangeStore = this._onDidChangeStore.event;

  private writeChain: Promise<void> = Promise.resolve();
  private readonly pendingEventWrites = new Map<string, ObservabilityEvent>();
  private readonly pendingSpanWrites = new Map<string, ObservabilitySpan>();
  private initialized = false;
  private lastCompactionAt?: number;
  private activeBaseDir?: string;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private storeChangeTimer: ReturnType<typeof setTimeout> | null = null;
  private tracesCache: WarehouseTraceRecord[] | null = null;
  private storageStats: WarehouseStorageStats = {
    persistedEventCount: 0,
    persistedSpanCount: 0,
    eventsFileBytes: 0,
    spansFileBytes: 0,
    exportsBytes: 0,
    diagnosticPackageCount: 0,
    totalBytes: 0,
  };

  constructor(userDataManager: UserDataManager, outputChannel: vscode.OutputChannel) {
    this.userDataManager = userDataManager;
    this.outputChannel = outputChannel;
  }

  async init(): Promise<void> {
    await this.enqueueWrite(async () => {
      this.cancelFlushTimer();
      const nextBaseDir = this.getBaseDir();
      if (this.initialized && this.activeBaseDir === nextBaseDir) {
        await this.flushPendingWritesUnlocked('pre-init');
      } else {
        this.pendingEventWrites.clear();
        this.pendingSpanWrites.clear();
      }
      await this.initUnlocked();
    });
  }

  async flush(): Promise<void> {
    this.cancelFlushTimer();
    await this.enqueueWrite(() => this.flushPendingWritesUnlocked('manual'));
  }

  async dispose(): Promise<void> {
    this.cancelFlushTimer();
    this.cancelStoreChangeTimer();
    await this.enqueueWrite(() => this.flushPendingWritesUnlocked('dispose'));
    this._onDidChangeStore.dispose();
  }

  /**
   * 仓库初始化的真实实现。
   * 通过 writeChain 串行执行，避免 refresh/userDataDir 切换时与并发 ingest 互相覆盖。
   */
  private async initUnlocked(): Promise<void> {
    const baseDir = this.getBaseDir();
    await fs.promises.mkdir(baseDir, { recursive: true });
    await fs.promises.mkdir(this.getExportsDir(), { recursive: true });

    const [loadedEvents, loadedSpans] = await Promise.all([
      this.readJsonl<ObservabilityEvent>(this.getEventsPath()),
      this.readJsonl<ObservabilitySpan>(this.getSpansPath()),
    ]);

    this.events.clear();
    this.spans.clear();
    this.pendingEventWrites.clear();
    this.pendingSpanWrites.clear();
    for (const event of loadedEvents) this.events.set(event.id, event);
    for (const span of loadedSpans) this.spans.set(span.id, span);

    const hadDuplicateRows = loadedEvents.length !== this.events.size || loadedSpans.length !== this.spans.size;
    const retentionResult = this.applyRetention(Date.now());
    const prunedExports = await this.pruneDiagnosticPackages();
    if (hadDuplicateRows || retentionResult.eventsRemoved > 0 || retentionResult.spansRemoved > 0 || prunedExports) {
      await this.compactFiles('init-retention');
    } else {
      await this.refreshStorageStats();
    }

    this.initialized = true;
    this.activeBaseDir = baseDir;
    this.invalidateTracesCache();
    this.outputChannel.appendLine(
      `[ObservabilityStore] 已初始化，events=${this.events.size}, spans=${this.spans.size}, exports=${this.storageStats.diagnosticPackageCount}`,
    );
    this.fireStoreChanged(true);
  }

  async ingest(payload: ObservabilityIngestPayload): Promise<{ acceptedEventIds: string[]; acceptedSpanIds: string[] }> {
    return this.enqueueWrite(async () => {
      if (!this.initialized) {
        await this.initUnlocked();
      }

      const now = Date.now();
      const nextEvents = (payload.events ?? [])
        .filter((event) => this.isEventRetained(event, now))
        .filter((event) => !this.events.has(event.id));
      const nextSpans: ObservabilitySpan[] = [];
      let didMutate = false;

      for (const event of nextEvents) {
        this.events.set(event.id, event);
        this.pendingEventWrites.set(event.id, event);
      }
      didMutate = didMutate || nextEvents.length > 0;

      // span 允许同一 id 多次上送生命周期更新，因此这里必须做“更新式”写入而不是简单去重。
      for (const span of payload.spans ?? []) {
        if (!this.isSpanRetained(span, now)) continue;
        const existing = this.spans.get(span.id);
        if (!existing || this.shouldReplaceSpan(existing, span)) {
          this.spans.set(span.id, span);
          nextSpans.push(span);
          this.pendingSpanWrites.set(span.id, span);
        }
      }
      didMutate = didMutate || nextSpans.length > 0;

      const retentionResult = this.applyRetention(now);
      didMutate = didMutate || retentionResult.eventsRemoved > 0 || retentionResult.spansRemoved > 0;

      const needsCompaction =
        retentionResult.eventsRemoved > 0 ||
        retentionResult.spansRemoved > 0;

      if (needsCompaction) {
        await this.compactFiles('ingest');
      } else if (nextEvents.length > 0 || nextSpans.length > 0) {
        this.scheduleFlush();
      }

      if (didMutate) {
        this.invalidateTracesCache();
        this.scheduleStoreChanged();
      }

      return {
        acceptedEventIds: nextEvents.map((event) => event.id),
        acceptedSpanIds: nextSpans.map((span) => span.id),
      };
    });
  }

  getRecentTraces(limit = 50): WarehouseTraceRecord[] {
    return this.getTracesSnapshot().slice(0, limit);
  }

  getTrace(traceId: string): WarehouseTraceRecord | undefined {
    return this.getTracesSnapshot().find((trace) => trace.id === traceId);
  }

  getStats(windowMs = 60 * 60 * 1000): WarehouseStats {
    const traces = this.getTracesSnapshot();
    const now = Date.now();
    const recentEvents = [...this.events.values()].filter((event) => now - event.ts <= windowMs);
    const throughputMap = new Map<number, number>();
    const sourceMap = new Map<string, number>();
    const eventMap = new Map<string, number>();

    for (const event of recentEvents) {
      const bucketStart = Math.floor(event.ts / 60000) * 60000;
      throughputMap.set(bucketStart, (throughputMap.get(bucketStart) ?? 0) + 1);
      sourceMap.set(event.source, (sourceMap.get(event.source) ?? 0) + 1);
      eventMap.set(event.event, (eventMap.get(event.event) ?? 0) + 1);
    }

    const avgTraceDurationMs = traces.length === 0
      ? 0
      : Math.round(traces.reduce((sum, trace) => sum + Math.max(trace.endedAt - trace.startedAt, 0), 0) / traces.length);

    return {
      eventCount: recentEvents.length,
      traceCount: traces.length,
      runningTraceCount: traces.filter((trace) => trace.status === 'running').length,
      errorTraceCount: traces.filter((trace) => trace.status === 'error').length,
      avgTraceDurationMs,
      inboundCount: recentEvents.filter((event) => event.event === 'bridge.receive').length,
      outboundCount: recentEvents.filter((event) => event.event === 'bridge.send').length,
      errorCount: recentEvents.filter((event) => event.level === 'error').length,
      throughput: [...throughputMap.entries()].sort((a, b) => a[0] - b[0]).map(([bucketStart, count]) => ({ bucketStart, count })),
      topSources: [...sourceMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, count]) => ({ source, count })),
      topEvents: [...eventMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([event, count]) => ({ event, count })),
      retention: this.getRetentionPolicy(),
      storage: this.getStorageStats(),
    };
  }

  getRetentionPolicy(): WarehouseRetentionPolicy {
    return {
      eventRetentionMs: EVENT_RETENTION_MS,
      spanRetentionMs: SPAN_RETENTION_MS,
      exportRetentionMs: EXPORT_RETENTION_MS,
      maxPersistedEvents: MAX_PERSISTED_EVENTS,
      maxPersistedSpans: MAX_PERSISTED_SPANS,
      maxDiagnosticPackages: MAX_DIAGNOSTIC_PACKAGES,
      lastCompactionAt: this.lastCompactionAt,
    };
  }

  getStorageStats(): WarehouseStorageStats {
    return { ...this.storageStats };
  }

  getObservabilityDirectory(): string {
    return this.getBaseDir();
  }

  getDiagnosticExportsDirectory(): string {
    return this.getExportsDir();
  }

  exportTrace(traceId: string): { fileName: string; content: string } | null {
    const trace = this.getTrace(traceId);
    if (!trace) return null;
    const lines = [
      ...trace.events.map((event) => JSON.stringify({ type: 'event', payload: event })),
      ...trace.spans.map((span) => JSON.stringify({ type: 'span', payload: span })),
    ];
    return {
      fileName: `trace-${traceId}.jsonl`,
      content: lines.join('\n') + '\n',
    };
  }

  async createDiagnosticPackage(traceId: string): Promise<{ directory: string; files: string[] } | null> {
    const trace = this.getTrace(traceId);
    if (!trace) return null;

    const exportDir = this.userDataManager.getPath(
      OBSERVABILITY_DIR,
      EXPORTS_DIR,
      `diag-${traceId}-${Date.now()}`,
    );
    await fs.promises.mkdir(exportDir, { recursive: true });

    const summaryPath = path.join(exportDir, 'summary.json');
    const tracePath = path.join(exportDir, 'trace.jsonl');
    const environmentPath = path.join(exportDir, 'environment.json');
    const configPath = path.join(exportDir, 'config.json');
    const warehousePath = path.join(exportDir, 'warehouse.json');
    const manifestPath = path.join(exportDir, 'manifest.json');

    const exportPayload = this.exportTrace(traceId);
    const summary = {
      traceId: trace.id,
      startedAt: trace.startedAt,
      endedAt: trace.endedAt,
      status: trace.status,
      requestIds: trace.requestIds,
      sources: trace.sources,
      eventCount: trace.events.length,
      spanCount: trace.spans.length,
      errorCount: trace.errorCount,
      exportedAt: new Date().toISOString(),
    };

    await fs.promises.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
    await fs.promises.writeFile(tracePath, exportPayload?.content ?? '', 'utf8');
    await fs.promises.writeFile(environmentPath, JSON.stringify(this.buildEnvironmentSnapshot(), null, 2), 'utf8');
    await fs.promises.writeFile(configPath, JSON.stringify(this.buildConfigurationSnapshot(), null, 2), 'utf8');
    await fs.promises.writeFile(warehousePath, JSON.stringify({
      stats: this.getStats(),
      retention: this.getRetentionPolicy(),
      storage: this.getStorageStats(),
    }, null, 2), 'utf8');
    await fs.promises.writeFile(manifestPath, JSON.stringify({
      summaryFile: 'summary.json',
      traceFile: 'trace.jsonl',
      environmentFile: 'environment.json',
      configFile: 'config.json',
      warehouseFile: 'warehouse.json',
      generatedAt: new Date().toISOString(),
    }, null, 2), 'utf8');

    await this.pruneDiagnosticPackages();
    await this.refreshStorageStats();
    this.fireStoreChanged(true);

    return {
      directory: exportDir,
      files: [summaryPath, tracePath, environmentPath, configPath, warehousePath, manifestPath],
    };
  }

  private buildTraces(): WarehouseTraceRecord[] {
    const traceMap = new Map<string, WarehouseTraceRecord>();

    const ensureTrace = (traceId: string): WarehouseTraceRecord => {
      const existing = traceMap.get(traceId);
      if (existing) return existing;
      const created: WarehouseTraceRecord = {
        id: traceId,
        startedAt: Number.MAX_SAFE_INTEGER,
        endedAt: 0,
        status: 'running',
        summary: traceId,
        requestIds: [],
        sources: [],
        events: [],
        spans: [],
        errorCount: 0,
      };
      traceMap.set(traceId, created);
      return created;
    };

    for (const event of this.events.values()) {
      const trace = ensureTrace(event.traceId ?? `untracked-${event.id}`);
      trace.events.push(event);
      trace.startedAt = Math.min(trace.startedAt, event.ts);
      trace.endedAt = Math.max(trace.endedAt, event.ts);
      if (event.requestId && !trace.requestIds.includes(event.requestId)) trace.requestIds.push(event.requestId);
      if (!trace.sources.includes(event.source)) trace.sources.push(event.source);
      if (event.level === 'error') {
        trace.errorCount += 1;
        trace.status = 'error';
      }
      if (trace.summary === trace.id) trace.summary = event.summary;
    }

    for (const span of this.spans.values()) {
      const trace = ensureTrace(span.traceId ?? `timeline-${span.id}`);
      trace.spans.push(span);
      trace.startedAt = Math.min(trace.startedAt, span.startTime);
      trace.endedAt = Math.max(trace.endedAt, span.endTime || Date.now());
      if (span.requestId && !trace.requestIds.includes(span.requestId)) trace.requestIds.push(span.requestId);
      if (span.status === 'error') trace.status = 'error';
    }

    return [...traceMap.values()]
      .map((trace) => {
        const status: WarehouseTraceRecord['status'] = trace.status === 'error'
          ? 'error'
          : trace.spans.some((span) => span.status === 'running')
            ? 'running'
            : 'done';
        return {
          ...trace,
          startedAt: trace.startedAt === Number.MAX_SAFE_INTEGER ? Date.now() : trace.startedAt,
          status,
          events: [...trace.events].sort((a, b) => a.ts - b.ts),
          spans: [...trace.spans].sort((a, b) => a.startTime - b.startTime),
        };
      })
      .sort((a, b) => b.startedAt - a.startedAt);
  }

  private getTracesSnapshot(): WarehouseTraceRecord[] {
    if (!this.tracesCache) {
      this.tracesCache = this.buildTraces();
    }
    return this.tracesCache;
  }

  /**
   * 应用 age/count 双重保留策略。
   * 先裁掉过期数据，再保证总量不超过仓库上限。
   */
  private applyRetention(now: number): RetentionResult {
    let eventsRemoved = 0;
    let spansRemoved = 0;

    for (const event of [...this.events.values()].sort((a, b) => a.ts - b.ts)) {
      if (!this.isEventRetained(event, now)) {
        this.events.delete(event.id);
        eventsRemoved += 1;
      }
    }
    for (const span of [...this.spans.values()].sort((a, b) => a.startTime - b.startTime)) {
      if (!this.isSpanRetained(span, now)) {
        this.spans.delete(span.id);
        spansRemoved += 1;
      }
    }

    if (this.events.size > MAX_PERSISTED_EVENTS) {
      const overflow = this.events.size - MAX_PERSISTED_EVENTS;
      for (const event of [...this.events.values()].sort((a, b) => a.ts - b.ts).slice(0, overflow)) {
        this.events.delete(event.id);
        eventsRemoved += 1;
      }
    }
    if (this.spans.size > MAX_PERSISTED_SPANS) {
      const overflow = this.spans.size - MAX_PERSISTED_SPANS;
      for (const span of [...this.spans.values()].sort((a, b) => a.startTime - b.startTime).slice(0, overflow)) {
        this.spans.delete(span.id);
        spansRemoved += 1;
      }
    }

    return { eventsRemoved, spansRemoved };
  }

  private isEventRetained(event: ObservabilityEvent, now: number): boolean {
    return now - event.ts <= EVENT_RETENTION_MS;
  }

  private isSpanRetained(span: ObservabilitySpan, now: number): boolean {
    const anchor = span.endTime || span.startTime;
    return now - anchor <= SPAN_RETENTION_MS;
  }

  /** 判断新收到的 span 是否比仓库里的旧版本更新。 */
  private shouldReplaceSpan(existing: ObservabilitySpan, incoming: ObservabilitySpan): boolean {
    const existingAnchor = Math.max(existing.startTime, existing.endTime || 0);
    const incomingAnchor = Math.max(incoming.startTime, incoming.endTime || 0);
    if (incomingAnchor !== existingAnchor) {
      return incomingAnchor > existingAnchor;
    }

    const existingStatus = this.spanStatusRank(existing.status);
    const incomingStatus = this.spanStatusRank(incoming.status);
    if (incomingStatus !== existingStatus) {
      return incomingStatus > existingStatus;
    }

    return (
      existing.detail !== incoming.detail ||
      existing.requestId !== incoming.requestId ||
      existing.traceId !== incoming.traceId
    );
  }

  private spanStatusRank(status: ObservabilitySpan['status']): number {
    switch (status) {
      case 'running':
        return 0;
      case 'done':
        return 1;
      case 'error':
        return 2;
      default:
        return 0;
    }
  }

  /** 当保留策略发生裁剪时重写 JSONL，确保磁盘状态与内存仓库重新对齐。 */
  private async compactFiles(reason: string): Promise<void> {
    const sortedEvents = [...this.events.values()].sort((a, b) => a.ts - b.ts);
    const sortedSpans = [...this.spans.values()].sort((a, b) => a.startTime - b.startTime);
    this.pendingEventWrites.clear();
    this.pendingSpanWrites.clear();
    await this.writeJsonl(this.getEventsPath(), sortedEvents);
    await this.writeJsonl(this.getSpansPath(), sortedSpans);
    this.lastCompactionAt = Date.now();
    await this.refreshStorageStats();
    this.outputChannel.appendLine(
      `[ObservabilityStore] 已压缩 (${reason}) events=${sortedEvents.length}, spans=${sortedSpans.length}, packages=${this.storageStats.diagnosticPackageCount}`,
    );
  }

  private async flushPendingWritesUnlocked(reason: string): Promise<void> {
    if (this.pendingEventWrites.size === 0 && this.pendingSpanWrites.size === 0) {
      return;
    }

    const events = [...this.pendingEventWrites.values()].sort((a, b) => a.ts - b.ts);
    const spans = [...this.pendingSpanWrites.values()].sort((a, b) => a.startTime - b.startTime);
    const eventJsonl = events.length > 0 ? this.toJsonl(events) : '';
    const spanJsonl = spans.length > 0 ? this.toJsonl(spans) : '';
    const eventBytes = Buffer.byteLength(eventJsonl, 'utf8');
    const spanBytes = Buffer.byteLength(spanJsonl, 'utf8');

    if (eventJsonl) {
      await fs.promises.appendFile(this.getEventsPath(), eventJsonl, 'utf8');
    }
    if (spanJsonl) {
      await fs.promises.appendFile(this.getSpansPath(), spanJsonl, 'utf8');
    }

    this.pendingEventWrites.clear();
    this.pendingSpanWrites.clear();
    this.storageStats = {
      ...this.storageStats,
      persistedEventCount: this.events.size,
      persistedSpanCount: this.spans.size,
      eventsFileBytes: this.storageStats.eventsFileBytes + eventBytes,
      spansFileBytes: this.storageStats.spansFileBytes + spanBytes,
      totalBytes: this.storageStats.eventsFileBytes + eventBytes + this.storageStats.spansFileBytes + spanBytes + this.storageStats.exportsBytes,
    };
    if (reason !== 'timer') {
      this.outputChannel.appendLine(
        `[ObservabilityStore] 已批量落盘 (${reason}) events+=${events.length}, spans+=${spans.length}`,
      );
    }
  }

  private async refreshStorageStats(): Promise<void> {
    const [eventsFileBytes, spansFileBytes, exportUsage] = await Promise.all([
      this.getFileSize(this.getEventsPath()),
      this.getFileSize(this.getSpansPath()),
      this.getDirectoryUsage(this.getExportsDir()),
    ]);

    this.storageStats = {
      persistedEventCount: this.events.size,
      persistedSpanCount: this.spans.size,
      eventsFileBytes,
      spansFileBytes,
      exportsBytes: exportUsage.bytes,
      diagnosticPackageCount: exportUsage.packageCount,
      totalBytes: eventsFileBytes + spansFileBytes + exportUsage.bytes,
    };
  }

  private enqueueWrite<T>(work: () => Promise<T>): Promise<T> {
    let result: T;
    this.writeChain = this.writeChain
      .catch((err) => {
        this.outputChannel.appendLine(`[ObservabilityStore] 上一轮写入失败: ${String(err)}`);
      })
      .then(async () => {
        result = await work();
      });
    return this.writeChain.then(() => result);
  }

  private scheduleFlush(): void {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      void this.enqueueWrite(() => this.flushPendingWritesUnlocked('timer')).catch((err) => {
        this.outputChannel.appendLine(`[ObservabilityStore] 批量落盘失败: ${String(err)}`);
      });
    }, PERSIST_FLUSH_DELAY_MS);
  }

  private scheduleStoreChanged(): void {
    if (this.storeChangeTimer) return;
    this.storeChangeTimer = setTimeout(() => {
      this.storeChangeTimer = null;
      this.fireStoreChanged(true);
    }, STORE_CHANGE_DEBOUNCE_MS);
  }

  private fireStoreChanged(immediate = false): void {
    if (!immediate) {
      this.scheduleStoreChanged();
      return;
    }
    this.cancelStoreChangeTimer();
    this._onDidChangeStore.fire();
  }

  private cancelFlushTimer(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private cancelStoreChangeTimer(): void {
    if (this.storeChangeTimer) {
      clearTimeout(this.storeChangeTimer);
      this.storeChangeTimer = null;
    }
  }

  private invalidateTracesCache(): void {
    this.tracesCache = null;
  }

  private async pruneDiagnosticPackages(): Promise<boolean> {
    const exportDir = this.getExportsDir();
    try {
      const entries = await fs.promises.readdir(exportDir, { withFileTypes: true });
      const packages = await Promise.all(entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const fullPath = path.join(exportDir, entry.name);
          const stats = await fs.promises.stat(fullPath);
          return { fullPath, mtimeMs: stats.mtimeMs };
        }));

      const now = Date.now();
      let changed = false;
      const expired = packages.filter((pkg) => now - pkg.mtimeMs > EXPORT_RETENTION_MS);
      for (const pkg of expired) {
        await fs.promises.rm(pkg.fullPath, { recursive: true, force: true });
        changed = true;
      }

      const retained = packages
        .filter((pkg) => now - pkg.mtimeMs <= EXPORT_RETENTION_MS)
        .sort((a, b) => b.mtimeMs - a.mtimeMs);
      for (const pkg of retained.slice(MAX_DIAGNOSTIC_PACKAGES)) {
        await fs.promises.rm(pkg.fullPath, { recursive: true, force: true });
        changed = true;
      }

      return changed;
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') {
        this.outputChannel.appendLine(`[ObservabilityStore] 清理诊断包失败: ${String(err)}`);
      }
      return false;
    }
  }

  /**
   * 生成诊断包的环境快照。
   *
   * 注意：诊断包默认会被分享给他人排障，因此这里不能直接导出机器标识、
   * cwd、工作区绝对路径等敏感字段，只保留 hash + basename 级别的摘要。
   */
  private buildEnvironmentSnapshot(): Record<string, unknown> {
    return {
      generatedAt: new Date().toISOString(),
      vscodeVersion: vscode.version,
      appHost: vscode.env.appHost,
      appName: vscode.env.appName,
      language: vscode.env.language,
      remoteName: vscode.env.remoteName ?? null,
      uriScheme: vscode.env.uriScheme,
      uiKind: vscode.env.uiKind === vscode.UIKind.Web ? 'web' : 'desktop',
      machineId: this.redactStableId(vscode.env.machineId),
      sessionId: this.redactStableId(vscode.env.sessionId),
      shell: process.env.SHELL ? path.basename(process.env.SHELL) : null,
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
      cwd: this.redactPath(process.cwd()),
      workspaceFolders: (vscode.workspace.workspaceFolders ?? []).map((folder) => ({
        name: folder.name,
        path: this.redactPath(folder.uri.fsPath),
      })),
      userDataDir: this.redactPath(this.userDataManager.getRootDir()),
      observabilityDir: this.redactPath(this.getBaseDir()),
      exportsDir: this.redactPath(this.getExportsDir()),
      retention: this.getRetentionPolicy(),
      storage: this.getStorageStats(),
    };
  }

  /**
   * 生成 browserAgent 配置快照。
   *
   * 与环境快照相同，配置中的目录/路径类字段会走诊断脱敏逻辑，
   * 避免把 userDataDir、可执行文件路径等原样打进诊断包。
   */
  private buildConfigurationSnapshot(): Record<string, unknown> {
    const config = vscode.workspace.getConfiguration('browserAgent');
    const effective: Record<string, unknown> = {};
    const inspected: Record<string, Record<string, JsonPrimitive | unknown>> = {};

    for (const key of CONFIG_KEYS) {
      effective[key] = this.sanitizeDiagnosticValue(config.get(key), key);
      const detail = config.inspect(key);
      inspected[key] = this.sanitizeDiagnosticValue({
        defaultValue: detail?.defaultValue,
        globalValue: detail?.globalValue,
        workspaceValue: detail?.workspaceValue,
        workspaceFolderValue: detail?.workspaceFolderValue,
      }, key) as Record<string, JsonPrimitive | unknown>;
    }

    return {
      generatedAt: new Date().toISOString(),
      section: 'browserAgent',
      effective,
      inspected,
    };
  }

  private async readJsonl<T>(filePath: string): Promise<T[]> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const values: T[] = [];
      for (const [lineNumber, line] of content.split('\n').entries()) {
        if (!line.trim()) continue;
        try {
          values.push(JSON.parse(line) as T);
        } catch (err) {
          this.outputChannel.appendLine(
            `[ObservabilityStore] JSONL 解析失败: ${filePath}:${lineNumber + 1} — ${String(err)}`,
          );
        }
      }
      return values;
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') {
        this.outputChannel.appendLine(`[ObservabilityStore] 读取失败: ${filePath} — ${String(err)}`);
      }
      return [];
    }
  }

  private async writeJsonl<T>(filePath: string, values: T[]): Promise<void> {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, values.length > 0 ? this.toJsonl(values) : '', 'utf8');
  }

  private toJsonl<T>(values: T[]): string {
    return values.map((value) => JSON.stringify(value)).join('\n') + '\n';
  }

  private async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.promises.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  private async getDirectoryUsage(dirPath: string): Promise<DirectoryUsage> {
    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      let bytes = 0;
      let packageCount = 0;

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          packageCount += 1;
          const nested = await this.getDirectoryUsage(fullPath);
          bytes += nested.bytes;
          continue;
        }
        const stats = await fs.promises.stat(fullPath);
        bytes += stats.size;
      }

      return { bytes, packageCount };
    } catch {
      return { bytes: 0, packageCount: 0 };
    }
  }

  private getBaseDir(): string {
    return this.userDataManager.getPath(OBSERVABILITY_DIR);
  }

  private getEventsPath(): string {
    return this.userDataManager.getPath(OBSERVABILITY_DIR, EVENTS_FILE);
  }

  private getSpansPath(): string {
    return this.userDataManager.getPath(OBSERVABILITY_DIR, SPANS_FILE);
  }

  private getExportsDir(): string {
    return this.userDataManager.getPath(OBSERVABILITY_DIR, EXPORTS_DIR);
  }

  /**
   * 诊断包专用脱敏入口。
   *
   * 与运行时日志不同，诊断包会长期落盘且容易被外部分享，因此这里额外处理
   * 路径类字符串，把绝对路径降级为摘要结构。
   */
  private sanitizeDiagnosticValue(value: unknown, keyHint = ''): unknown {
    if (typeof value === 'string') {
      if (this.shouldRedactPathString(value, keyHint)) {
        const normalized = value.startsWith('~/') || value === '~'
          ? UserDataManager.resolveDir(value)
          : value;
        return this.redactPath(normalized);
      }
      return sanitizeForLogging(value, keyHint);
    }

    if (Array.isArray(value)) {
      return value.map((item, index) => this.sanitizeDiagnosticValue(item, `${keyHint}[${index}]`));
    }

    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, nested]) => [key, this.sanitizeDiagnosticValue(nested, key)]),
      );
    }

    return sanitizeForLogging(value, keyHint);
  }

  /**
   * 判断字符串是否应视为路径并做路径脱敏。
   * 规则覆盖显式的 *Dir / *Path 配置键，以及常见的绝对/相对路径前缀。
   */
  private shouldRedactPathString(value: string, keyHint = ''): boolean {
    const normalizedKey = keyHint.toLowerCase();
    if (normalizedKey.includes('dir') || normalizedKey.includes('path')) {
      return true;
    }
    return (
      value.startsWith('/') ||
      value.startsWith('~/') ||
      value.startsWith('./') ||
      value.startsWith('../') ||
      /^[A-Za-z]:\\/.test(value)
    );
  }

  /** 将稳定标识转成 hash 摘要，避免诊断包暴露原始 machineId/sessionId。 */
  private redactStableId(value: string | null | undefined): { kind: 'redacted-id'; hash: string; length: number } | null {
    if (!value) return null;
    return {
      kind: 'redacted-id',
      hash: this.hashValue(value),
      length: value.length,
    };
  }

  /** 路径脱敏：保留 basename / 深度 / hash，移除完整绝对路径。 */
  private redactPath(value: string): { kind: 'redacted-path'; baseName: string; depth: number; hash: string } {
    const normalized = path.resolve(value);
    return {
      kind: 'redacted-path',
      baseName: path.basename(normalized) || normalized,
      depth: normalized.split(path.sep).filter(Boolean).length,
      hash: this.hashValue(normalized),
    };
  }

  /** 统一 hash helper，保证环境快照和配置快照的脱敏输出稳定可比对。 */
  private hashValue(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex').slice(0, 16);
  }
}
