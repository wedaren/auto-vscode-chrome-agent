// useDebugLog.ts — Debug 日志管理 Hook
// 职责：
// - 捕获所有 WebSocket 消息（入站 + 出站标记）
// - 跟踪连接状态变迁事件
// - 记录执行时间线（Agent 步骤、工具调用、Skill 执行等）
// - 提供开关控制（启用/禁用日志采集、自动滚动）
// - 提供过滤、清空、导出功能

import { useState, useRef, useCallback, useMemo } from 'react';

/** Debug 日志条目类型 */
export type DebugLogType = 'message_in' | 'message_out' | 'connection' | 'execution' | 'error';

/** Debug 日志条目 */
export interface DebugLogEntry {
  /** 唯一 ID */
  id: string;
  /** 时间戳 */
  timestamp: number;
  /** 日志类型 */
  type: DebugLogType;
  /** 标签（消息 type / 状态名 / 事件名） */
  label: string;
  /** 详情数据（JSON 序列化后展示） */
  detail: unknown;
  /** 耗时（仅执行事件，ms） */
  duration?: number;
}

/** 执行时间线条目 */
export interface TimelineEntry {
  /** 唯一 ID */
  id: string;
  /** 开始时间 */
  startTime: number;
  /** 结束时间（未完成时为 0） */
  endTime: number;
  /** 事件类型标签 */
  label: string;
  /** 状态 */
  status: 'running' | 'done' | 'error';
  /** 详情 */
  detail?: string;
}

/** Debug 开关配置 */
export interface DebugToggles {
  /** 是否启用日志采集 */
  enabled: boolean;
  /** 是否自动滚动到最新日志 */
  autoScroll: boolean;
  /** 是否记录心跳消息 */
  showHeartbeat: boolean;
  /** 是否记录 pong 消息 */
  showPong: boolean;
}

/** useDebugLog 返回值 */
export interface UseDebugLogReturn {
  /** 全部日志条目 */
  logs: DebugLogEntry[];
  /** 执行时间线 */
  timeline: TimelineEntry[];
  /** 开关配置 */
  toggles: DebugToggles;
  /** 添加入站消息日志 */
  logInbound: (msgType: string, payload: unknown) => void;
  /** 添加出站消息日志 */
  logOutbound: (msgType: string, payload: unknown) => void;
  /** 添加连接状态变迁日志 */
  logConnection: (state: string, detail?: unknown) => void;
  /** 添加执行事件日志 */
  logExecution: (label: string, detail?: unknown, duration?: number) => void;
  /** 添加错误日志 */
  logError: (label: string, detail?: unknown) => void;
  /** 开始一个时间线事件（返回 id，后续通过 endTimeline 结束） */
  startTimeline: (label: string, detail?: string) => string;
  /** 结束一个时间线事件 */
  endTimeline: (id: string, status?: 'done' | 'error') => void;
  /** 清空所有日志 */
  clearLogs: () => void;
  /** 清空时间线 */
  clearTimeline: () => void;
  /** 更新开关配置 */
  setToggles: (updater: Partial<DebugToggles> | ((prev: DebugToggles) => DebugToggles)) => void;
  /** 导出日志为 JSON 字符串 */
  exportLogs: () => string;
  /** 按类型过滤的日志 */
  getFilteredLogs: (filter: DebugLogType | 'all') => DebugLogEntry[];
  /** 日志总计数 */
  stats: { total: number; inbound: number; outbound: number; connection: number; execution: number; error: number };
}

/** 日志最大条目数 */
const MAX_LOG_ENTRIES = 500;

/** 时间线最大条目数 */
const MAX_TIMELINE_ENTRIES = 100;

/** 心跳消息类型集合 */
const HEARTBEAT_TYPES = new Set(['heartbeat_ping', 'heartbeat_pong']);
const PONG_TYPES = new Set(['pong']);

let idCounter = 0;
function nextId(): string {
  return `dbg_${Date.now()}_${++idCounter}`;
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

  // useRef 存储最新 toggles 以便在回调中无闭包陈旧问题
  const togglesRef = useRef(toggles);
  togglesRef.current = toggles;

  /** 添加日志条目（内部） */
  const addLog = useCallback((entry: DebugLogEntry) => {
    setLogs((prev) => {
      const next = [...prev, entry];
      return next.length > MAX_LOG_ENTRIES ? next.slice(next.length - MAX_LOG_ENTRIES) : next;
    });
  }, []);

  /** 添加入站消息日志 */
  const logInbound = useCallback((msgType: string, payload: unknown) => {
    if (!togglesRef.current.enabled) return;
    if (!togglesRef.current.showHeartbeat && HEARTBEAT_TYPES.has(msgType)) return;
    if (!togglesRef.current.showPong && PONG_TYPES.has(msgType)) return;

    addLog({
      id: nextId(),
      timestamp: Date.now(),
      type: 'message_in',
      label: msgType,
      detail: payload,
    });
  }, [addLog]);

  /** 添加出站消息日志 */
  const logOutbound = useCallback((msgType: string, payload: unknown) => {
    if (!togglesRef.current.enabled) return;
    if (!togglesRef.current.showHeartbeat && HEARTBEAT_TYPES.has(msgType)) return;

    addLog({
      id: nextId(),
      timestamp: Date.now(),
      type: 'message_out',
      label: msgType,
      detail: payload,
    });
  }, [addLog]);

  /** 添加连接状态变迁日志 */
  const logConnection = useCallback((state: string, detail?: unknown) => {
    if (!togglesRef.current.enabled) return;

    addLog({
      id: nextId(),
      timestamp: Date.now(),
      type: 'connection',
      label: state,
      detail: detail ?? null,
    });
  }, [addLog]);

  /** 添加执行事件日志 */
  const logExecution = useCallback((label: string, detail?: unknown, duration?: number) => {
    if (!togglesRef.current.enabled) return;

    addLog({
      id: nextId(),
      timestamp: Date.now(),
      type: 'execution',
      label,
      detail: detail ?? null,
      duration,
    });
  }, [addLog]);

  /** 添加错误日志 */
  const logError = useCallback((label: string, detail?: unknown) => {
    if (!togglesRef.current.enabled) return;

    addLog({
      id: nextId(),
      timestamp: Date.now(),
      type: 'error',
      label,
      detail: detail ?? null,
    });
  }, [addLog]);

  /** 开始时间线事件 */
  const startTimeline = useCallback((label: string, detail?: string): string => {
    const id = nextId();
    setTimeline((prev) => {
      const entry: TimelineEntry = {
        id,
        startTime: Date.now(),
        endTime: 0,
        label,
        status: 'running',
        detail,
      };
      const next = [...prev, entry];
      return next.length > MAX_TIMELINE_ENTRIES ? next.slice(next.length - MAX_TIMELINE_ENTRIES) : next;
    });
    return id;
  }, []);

  /** 结束时间线事件 */
  const endTimeline = useCallback((id: string, status: 'done' | 'error' = 'done') => {
    setTimeline((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, endTime: Date.now(), status }
          : entry,
      ),
    );
  }, []);

  /** 清空日志 */
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  /** 清空时间线 */
  const clearTimeline = useCallback(() => {
    setTimeline([]);
  }, []);

  /** 更新开关配置 */
  const setToggles = useCallback((updater: Partial<DebugToggles> | ((prev: DebugToggles) => DebugToggles)) => {
    setTogglesState((prev) => {
      if (typeof updater === 'function') return updater(prev);
      return { ...prev, ...updater };
    });
  }, []);

  /** 导出日志 */
  const exportLogs = useCallback((): string => {
    return JSON.stringify({ logs, timeline, exportedAt: new Date().toISOString() }, null, 2);
  }, [logs, timeline]);

  /** 按类型过滤 */
  const getFilteredLogs = useCallback((filter: DebugLogType | 'all'): DebugLogEntry[] => {
    if (filter === 'all') return logs;
    return logs.filter((l) => l.type === filter);
  }, [logs]);

  /** 统计信息 */
  const stats = useMemo(() => ({
    total: logs.length,
    inbound: logs.filter((l) => l.type === 'message_in').length,
    outbound: logs.filter((l) => l.type === 'message_out').length,
    connection: logs.filter((l) => l.type === 'connection').length,
    execution: logs.filter((l) => l.type === 'execution').length,
    error: logs.filter((l) => l.type === 'error').length,
  }), [logs]);

  // useMemo 稳定化返回对象引用，避免每次渲染创建新对象触发消费者不必要的重渲染
  return useMemo<UseDebugLogReturn>(() => ({
    logs,
    timeline,
    toggles,
    logInbound,
    logOutbound,
    logConnection,
    logExecution,
    logError,
    startTimeline,
    endTimeline,
    clearLogs,
    clearTimeline,
    setToggles,
    exportLogs,
    getFilteredLogs,
    stats,
  }), [
    logs,
    timeline,
    toggles,
    logInbound,
    logOutbound,
    logConnection,
    logExecution,
    logError,
    startTimeline,
    endTimeline,
    clearLogs,
    clearTimeline,
    setToggles,
    exportLogs,
    getFilteredLogs,
    stats,
  ]);
}
