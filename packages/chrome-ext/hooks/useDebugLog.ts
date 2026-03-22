// useDebugLog.ts — Chrome 侧本地调试事件流容器
// 职责：把 bridge 收发、连接状态、执行事件和错误统一收敛成结构化日志，
//       同时维护本地 timeline，供 DebugPanel 和离线补发队列复用。

import { useState, useRef, useCallback, useMemo } from 'react';
import type { BridgeMessage, BridgeMeta, ObservabilityEvent, ObservabilitySource } from '../src/observability';
import { buildObservedEvent, sanitizeForLogging, summarizePayload } from '../src/observability';

export type DebugLogType = 'message_in' | 'message_out' | 'connection' | 'execution' | 'error';

export interface DebugLogEntry extends ObservabilityEvent {
  type: DebugLogType;
  label: string;
  detail: unknown;
  timestamp: number;
  duration?: number;
}

export interface TimelineEntry {
  id: string;
  startTime: number;
  endTime: number;
  label: string;
  status: 'running' | 'done' | 'error';
  detail?: string;
  traceId?: string;
  requestId?: string;
}

export interface DebugToggles {
  enabled: boolean;
  autoScroll: boolean;
  showHeartbeat: boolean;
  showPong: boolean;
}

export interface UseDebugLogReturn {
  logs: DebugLogEntry[];
  timeline: TimelineEntry[];
  toggles: DebugToggles;
  logBridge: (direction: 'send' | 'receive', msg: BridgeMessage) => void;
  logConnection: (state: string, detail?: unknown, meta?: Partial<BridgeMeta>) => void;
  logExecution: (
    label: string,
    detail?: unknown,
    options?: { duration?: number; meta?: Partial<BridgeMeta>; source?: ObservabilitySource | string },
  ) => void;
  logError: (label: string, detail?: unknown, meta?: Partial<BridgeMeta>) => void;
  startTimeline: (label: string, options?: { detail?: string; meta?: Partial<BridgeMeta> }) => string;
  endTimeline: (id: string, status?: 'done' | 'error', detail?: string) => void;
  endTimelineByRequestId: (requestId: string, status?: 'done' | 'error', detail?: string) => void;
  clearLogs: () => void;
  clearTimeline: () => void;
  setToggles: (updater: Partial<DebugToggles> | ((prev: DebugToggles) => DebugToggles)) => void;
  exportLogs: () => string;
  stats: { total: number; inbound: number; outbound: number; connection: number; execution: number; error: number };
}

const MAX_LOG_ENTRIES = 800;
const MAX_TIMELINE_ENTRIES = 200;
const HEARTBEAT_TYPES = new Set(['heartbeat_ping', 'heartbeat_pong']);
const PONG_TYPES = new Set(['pong']);

let idCounter = 0;
function nextId(): string {
  return `dbg_${Date.now()}_${++idCounter}`;
}

function toLogEntry(input: {
  type: DebugLogType;
  label: string;
  detail: unknown;
  level: 'debug' | 'info' | 'warn' | 'error';
  source: ObservabilitySource | string;
  event: string;
  durationMs?: number;
  meta?: Partial<BridgeMeta>;
  redaction?: 'none' | 'masked' | 'omitted';
}): DebugLogEntry {
  const event = buildObservedEvent({
    level: input.level,
    source: input.source,
    event: input.event,
    summary: input.label,
    data: input.detail,
    meta: input.meta,
    durationMs: input.durationMs,
    redaction: input.redaction,
  });

  return {
    ...event,
    type: input.type,
    label: input.label,
    detail: input.detail,
    timestamp: event.ts,
    duration: input.durationMs,
  };
}

export function useDebugLog(): UseDebugLogReturn {
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [toggles, setTogglesState] = useState<DebugToggles>({
    enabled: true,
    autoScroll: true,
    showHeartbeat: false,
    showPong: false,
  });

  const togglesRef = useRef(toggles);
  togglesRef.current = toggles;

  const requestTimelineRef = useRef<Map<string, string>>(new Map());

  /** 追加结构化日志，维持固定大小的 ring buffer。 */
  const addLog = useCallback((entry: DebugLogEntry) => {
    setLogs((prev) => {
      const next = [...prev, entry];
      return next.length > MAX_LOG_ENTRIES ? next.slice(next.length - MAX_LOG_ENTRIES) : next;
    });
  }, []);

  const logBridge = useCallback((direction: 'send' | 'receive', msg: BridgeMessage) => {
    if (!togglesRef.current.enabled) return;
    if (!togglesRef.current.showHeartbeat && HEARTBEAT_TYPES.has(msg.type)) return;
    if (!togglesRef.current.showPong && PONG_TYPES.has(msg.type)) return;

    const sanitizedPayload = sanitizeForLogging(msg.payload);
    addLog(toLogEntry({
      type: direction === 'receive' ? 'message_in' : 'message_out',
      label: `${msg.type} · ${summarizePayload(sanitizedPayload)}`,
      detail: { payload: sanitizedPayload, meta: msg.meta },
      level: 'debug',
      source: msg.meta?.source ?? (direction === 'receive' ? 'vscode-ws' : 'chrome-ws'),
      event: direction === 'receive' ? 'bridge.receive' : 'bridge.send',
      meta: msg.meta,
      redaction: 'masked',
    }));
  }, [addLog]);

  /** 记录连接状态变迁，供 DebugPanel 仪表盘和离线诊断复用。 */
  const logConnection = useCallback((state: string, detail?: unknown, meta?: Partial<BridgeMeta>) => {
    if (!togglesRef.current.enabled) return;
    addLog(toLogEntry({
      type: 'connection',
      label: state,
      detail: sanitizeForLogging(detail),
      level: state === 'failed' ? 'error' : 'info',
      source: 'chrome-ws',
      event: 'connection.state',
      meta,
      redaction: 'masked',
    }));
  }, [addLog]);

  /** 记录执行类事件，如 Agent 步骤、Skill 进度、工具完成等。 */
  const logExecution = useCallback((
    label: string,
    detail?: unknown,
    options?: { duration?: number; meta?: Partial<BridgeMeta>; source?: ObservabilitySource | string },
  ) => {
    if (!togglesRef.current.enabled) return;
    addLog(toLogEntry({
      type: 'execution',
      label,
      detail: sanitizeForLogging(detail),
      level: 'info',
      source: options?.source ?? 'chrome-ui',
      event: 'execution.event',
      durationMs: options?.duration,
      meta: options?.meta,
      redaction: 'masked',
    }));
  }, [addLog]);

  /** 统一错误入口，保证 UI 异常和链路异常都能落到同一事件流。 */
  const logError = useCallback((label: string, detail?: unknown, meta?: Partial<BridgeMeta>) => {
    if (!togglesRef.current.enabled) return;
    addLog(toLogEntry({
      type: 'error',
      label,
      detail: sanitizeForLogging(detail),
      level: 'error',
      source: 'chrome-ui',
      event: 'error.event',
      meta,
      redaction: 'masked',
    }));
  }, [addLog]);

  /** 启动一个本地 timeline span，并按 requestId 建索引以便后续闭环。 */
  const startTimeline = useCallback((label: string, options?: { detail?: string; meta?: Partial<BridgeMeta> }): string => {
    const id = nextId();
    setTimeline((prev) => {
      const next = [...prev, {
        id,
        startTime: Date.now(),
        endTime: 0,
        label,
        status: 'running' as const,
        detail: options?.detail,
        traceId: options?.meta?.traceId,
        requestId: options?.meta?.requestId,
      }];
      return next.length > MAX_TIMELINE_ENTRIES ? next.slice(next.length - MAX_TIMELINE_ENTRIES) : next;
    });
    if (options?.meta?.requestId) {
      requestTimelineRef.current.set(options.meta.requestId, id);
    }
    return id;
  }, []);

  /** 结束指定 timeline span，同时清理 requestId -> spanId 映射。 */
  const endTimeline = useCallback((id: string, status: 'done' | 'error' = 'done', detail?: string) => {
    setTimeline((prev) =>
      prev.map((entry) => (
        entry.id === id
          ? { ...entry, endTime: Date.now(), status, detail: detail ?? entry.detail }
          : entry
      )),
    );
    for (const [requestId, timelineId] of requestTimelineRef.current.entries()) {
      if (timelineId === id) requestTimelineRef.current.delete(requestId);
    }
  }, []);

  /** 按 requestId 闭环 timeline，用于 tool_execute -> tool_result 的自然匹配。 */
  const endTimelineByRequestId = useCallback((requestId: string, status: 'done' | 'error' = 'done', detail?: string) => {
    const id = requestTimelineRef.current.get(requestId);
    if (!id) return;
    endTimeline(id, status, detail);
  }, [endTimeline]);

  const clearLogs = useCallback(() => setLogs([]), []);

  const clearTimeline = useCallback(() => {
    requestTimelineRef.current.clear();
    setTimeline([]);
  }, []);

  const setToggles = useCallback((updater: Partial<DebugToggles> | ((prev: DebugToggles) => DebugToggles)) => {
    setTogglesState((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  const exportLogs = useCallback(() => JSON.stringify({
    logs,
    timeline,
    exportedAt: new Date().toISOString(),
  }, null, 2), [logs, timeline]);

  const stats = useMemo(() => ({
    total: logs.length,
    inbound: logs.filter((log) => log.type === 'message_in').length,
    outbound: logs.filter((log) => log.type === 'message_out').length,
    connection: logs.filter((log) => log.type === 'connection').length,
    execution: logs.filter((log) => log.type === 'execution').length,
    error: logs.filter((log) => log.type === 'error').length,
  }), [logs]);

  return useMemo(() => ({
    logs,
    timeline,
    toggles,
    logBridge,
    logConnection,
    logExecution,
    logError,
    startTimeline,
    endTimeline,
    endTimelineByRequestId,
    clearLogs,
    clearTimeline,
    setToggles,
    exportLogs,
    stats,
  }), [
    logs,
    timeline,
    toggles,
    logBridge,
    logConnection,
    logExecution,
    logError,
    startTimeline,
    endTimeline,
    endTimelineByRequestId,
    clearLogs,
    clearTimeline,
    setToggles,
    exportLogs,
    stats,
  ]);
}
