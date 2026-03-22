// observability.ts — VS Code 侧结构化观测模型
// 职责：与 Chrome 侧共享 bridge meta / event / span / warehouse 统计类型，
//       同时提供服务端日志格式化、trace/span 元数据补齐与 payload 脱敏 helper。

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type ObservabilitySource =
  | 'vscode-ws'
  | 'vscode-agent'
  | 'vscode-llm'
  | 'vscode-mcp'
  | 'vscode-extension'
  | 'chrome-ui'
  | 'chrome-ws'
  | 'chrome-tool'
  | 'chrome-content'
  | 'chrome-background';

export interface BridgeMeta {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  source: ObservabilitySource | string;
  event: string;
  sentAt: number;
  sessionId?: string;
  requestId?: string;
  conversationId?: string;
}

export interface BridgeMessage<T = unknown> {
  type: string;
  payload: T;
  sessionId: string;
  meta?: BridgeMeta;
}

export interface ObservabilityEvent {
  id: string;
  ts: number;
  level: LogLevel;
  source: ObservabilitySource | string;
  event: string;
  summary: string;
  data?: unknown;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  sessionId?: string;
  requestId?: string;
  conversationId?: string;
  durationMs?: number;
  redaction: 'none' | 'masked' | 'omitted';
}

export interface ObservabilitySpan {
  id: string;
  traceId?: string;
  requestId?: string;
  label: string;
  detail?: string;
  startTime: number;
  endTime: number;
  status: 'running' | 'done' | 'error';
}

export interface ObservabilityIngestPayload {
  batchId?: string;
  events?: ObservabilityEvent[];
  spans?: ObservabilitySpan[];
}

export interface WarehouseTraceRecord {
  id: string;
  startedAt: number;
  endedAt: number;
  status: 'running' | 'done' | 'error';
  summary: string;
  requestIds: string[];
  sources: string[];
  events: ObservabilityEvent[];
  spans: ObservabilitySpan[];
  errorCount: number;
}

export interface WarehouseStats {
  eventCount: number;
  traceCount: number;
  runningTraceCount: number;
  errorTraceCount: number;
  avgTraceDurationMs: number;
  inboundCount: number;
  outboundCount: number;
  errorCount: number;
  throughput: Array<{ bucketStart: number; count: number }>;
  topSources: Array<{ source: string; count: number }>;
  topEvents: Array<{ event: string; count: number }>;
  retention?: WarehouseRetentionPolicy;
  storage?: WarehouseStorageStats;
}

export interface WarehouseRetentionPolicy {
  eventRetentionMs: number;
  spanRetentionMs: number;
  exportRetentionMs: number;
  maxPersistedEvents: number;
  maxPersistedSpans: number;
  maxDiagnosticPackages: number;
  lastCompactionAt?: number;
}

export interface WarehouseStorageStats {
  persistedEventCount: number;
  persistedSpanCount: number;
  eventsFileBytes: number;
  spansFileBytes: number;
  exportsBytes: number;
  diagnosticPackageCount: number;
  totalBytes: number;
}

const SENSITIVE_KEY_PARTS = [
  'authorization',
  'cookie',
  'token',
  'secret',
  'password',
  'api_key',
  'apikey',
  'key',
  'selectedtext',
  'imagedata',
  'screenshot',
];

const LARGE_STRING_LIMIT = 240;
const LARGE_ARRAY_LIMIT = 20;

/** 生成稳定前缀的唯一 ID，供 trace/span/event/request 使用。 */
export function createId(prefix: string): string {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${id}`;
}

export function createRootMeta(input: {
  sessionId?: string;
  source: ObservabilitySource | string;
  event: string;
  requestId?: string;
  conversationId?: string;
}): BridgeMeta {
  return {
    traceId: createId('trace'),
    spanId: createId('span'),
    source: input.source,
    event: input.event,
    sentAt: Date.now(),
    sessionId: input.sessionId,
    requestId: input.requestId,
    conversationId: input.conversationId,
  };
}

/** 基于父 meta 派生子 span，使响应消息自动挂回原始 trace。 */
export function createChildMeta(
  parent: Partial<BridgeMeta> | undefined,
  input: {
    sessionId?: string;
    source: ObservabilitySource | string;
    event: string;
    requestId?: string;
    conversationId?: string;
  },
): BridgeMeta {
  return {
    traceId: parent?.traceId ?? createId('trace'),
    spanId: createId('span'),
    parentSpanId: parent?.spanId,
    source: input.source,
    event: input.event,
    sentAt: Date.now(),
    sessionId: input.sessionId ?? parent?.sessionId,
    requestId: input.requestId ?? parent?.requestId,
    conversationId: input.conversationId ?? parent?.conversationId,
  };
}

/** 对入站/出站消息的 meta 做兜底补齐，避免出现无 trace 的孤立事件。 */
export function normalizeMeta(
  meta: Partial<BridgeMeta> | undefined,
  fallback: {
    sessionId?: string;
    source: ObservabilitySource | string;
    event: string;
    requestId?: string;
    conversationId?: string;
  },
): BridgeMeta {
  return {
    traceId: meta?.traceId ?? createId('trace'),
    spanId: meta?.spanId ?? createId('span'),
    parentSpanId: meta?.parentSpanId,
    source: meta?.source ?? fallback.source,
    event: meta?.event ?? fallback.event,
    sentAt: meta?.sentAt ?? Date.now(),
    sessionId: meta?.sessionId ?? fallback.sessionId,
    requestId: meta?.requestId ?? fallback.requestId,
    conversationId: meta?.conversationId ?? fallback.conversationId,
  };
}

function shouldMaskKey(path: string): boolean {
  const normalized = path.toLowerCase();
  return SENSITIVE_KEY_PARTS.some((part) => normalized.includes(part));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function sanitizeForLogging(value: unknown, path = ''): unknown {
  if (value == null) return value;

  if (typeof value === 'string') {
    if (shouldMaskKey(path)) {
      return {
        kind: 'masked-string',
        length: value.length,
        preview: value.slice(0, 24),
      };
    }
    if (value.length > LARGE_STRING_LIMIT) {
      return {
        kind: 'truncated-string',
        length: value.length,
        preview: value.slice(0, LARGE_STRING_LIMIT),
      };
    }
    return value;
  }

  if (Array.isArray(value)) {
    const items = value.slice(0, LARGE_ARRAY_LIMIT).map((item, index) => sanitizeForLogging(item, `${path}[${index}]`));
    if (value.length > LARGE_ARRAY_LIMIT) {
      items.push({ kind: 'array-truncated', omitted: value.length - LARGE_ARRAY_LIMIT });
    }
    return items;
  }

  if (isPlainObject(value)) {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      const nextPath = path ? `${path}.${key}` : key;
      output[key] = shouldMaskKey(nextPath)
        ? { kind: 'masked-field', originalType: typeof nested }
        : sanitizeForLogging(nested, nextPath);
    }
    return output;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  return value;
}

/** 为输出通道、消息树和 Debug 面板生成短摘要。 */
export function summarizePayload(payload: unknown): string {
  if (payload == null) return 'null';
  if (typeof payload === 'string') {
    return payload.length > 80 ? `${payload.slice(0, 80)}...` : payload;
  }
  if (typeof payload === 'number' || typeof payload === 'boolean') {
    return String(payload);
  }
  if (Array.isArray(payload)) {
    return `Array(${payload.length})`;
  }
  if (isPlainObject(payload)) {
    const keys = Object.keys(payload);
    return keys.length > 0 ? `{${keys.slice(0, 5).join(', ')}}` : '{}';
  }
  return String(payload);
}

/** 将任意运行时动作封装成统一的结构化事件。 */
export function buildObservedEvent(input: {
  level: LogLevel;
  source: ObservabilitySource | string;
  event: string;
  summary: string;
  data?: unknown;
  meta?: Partial<BridgeMeta>;
  durationMs?: number;
  redaction?: 'none' | 'masked' | 'omitted';
}): ObservabilityEvent {
  return {
    id: createId('evt'),
    ts: Date.now(),
    level: input.level,
    source: input.source,
    event: input.event,
    summary: input.summary,
    data: input.data,
    traceId: input.meta?.traceId,
    spanId: input.meta?.spanId,
    parentSpanId: input.meta?.parentSpanId,
    sessionId: input.meta?.sessionId,
    requestId: input.meta?.requestId,
    conversationId: input.meta?.conversationId,
    durationMs: input.durationMs,
    redaction: input.redaction ?? 'none',
  };
}

/** OutputChannel 友好的单行格式，便于快速扫读 trace/request 维度。 */
export function formatEventLine(event: ObservabilityEvent): string {
  const trace = event.traceId ? ` trace=${event.traceId}` : '';
  const span = event.spanId ? ` span=${event.spanId}` : '';
  const request = event.requestId ? ` request=${event.requestId}` : '';
  const duration = event.durationMs !== undefined ? ` duration=${event.durationMs}ms` : '';
  return `[${event.source}] ${event.event}:${trace}${span}${request}${duration} ${event.summary}`;
}
