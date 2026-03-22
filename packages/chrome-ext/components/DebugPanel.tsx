import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { DebugLogEntry, DebugLogType, TimelineEntry, DebugToggles } from '../hooks/useDebugLog';
import type { ConnectionState, ConnectionDetails } from '../src/ws-client';

// DebugPanel.tsx — Chrome Side Panel Debug 调试面板组件
// 职责：
// - 实时消息日志（MessageLog）：按时间展示所有 WebSocket 收发消息，支持过滤
// - 连接仪表盘（ConnectionDashboard）：实时展示连接状态、延迟、重连次数等指标
// - 执行时间线（ExecutionTimeline）：可视化 Agent 步骤、工具调用、Skill 执行的耗时
// - 开关控制（ToggleControls）：启用/禁用日志、自动滚动、心跳过滤等

interface DebugPanelProps {
  logs: DebugLogEntry[];
  timeline: TimelineEntry[];
  toggles: DebugToggles;
  connectionState: ConnectionState;
  connectionDetails: ConnectionDetails;
  stats: { total: number; inbound: number; outbound: number; connection: number; execution: number; error: number };
  onSetToggles: (updater: Partial<DebugToggles>) => void;
  onClearLogs: () => void;
  onClearTimeline: () => void;
  onExportLogs: () => string;
}

type DebugSubTab = 'logs' | 'dashboard' | 'timeline' | 'settings';

const LOG_TYPE_CONFIG: Record<DebugLogType, { label: string; color: string; bg: string }> = {
  message_in: { label: '← 入站', color: 'text-green-700', bg: 'bg-green-100' },
  message_out: { label: '→ 出站', color: 'text-blue-700', bg: 'bg-blue-100' },
  connection: { label: '连接', color: 'text-amber-700', bg: 'bg-amber-100' },
  execution: { label: '执行', color: 'text-violet-700', bg: 'bg-violet-100' },
  error: { label: '错误', color: 'text-red-700', bg: 'bg-red-100' },
};

const STATE_DISPLAY: Record<ConnectionState, { label: string; color: string; dot: string }> = {
  disconnected: { label: '未连接', color: 'text-gray-500', dot: 'bg-gray-400' },
  connecting: { label: '连接中', color: 'text-yellow-600', dot: 'bg-yellow-400' },
  connected: { label: '已连接', color: 'text-green-600', dot: 'bg-green-500' },
  reconnecting: { label: '重连中', color: 'text-yellow-600', dot: 'bg-orange-400' },
  failed: { label: '连接失败', color: 'text-red-600', dot: 'bg-red-500' },
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('zh-CN', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '--';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 1000) return '刚刚';
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s 前`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m 前`;
  return formatTime(ts);
}

function truncateDetail(detail: unknown, maxLen = 160): string {
  try {
    const str = JSON.stringify(detail);
    return str.length <= maxLen ? str : `${str.slice(0, maxLen)}...`;
  } catch {
    const str = String(detail);
    return str.length <= maxLen ? str : `${str.slice(0, maxLen)}...`;
  }
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-md border border-gray-100 px-3 py-2">
      <div className="text-[10px] text-gray-500 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 text-[10px] rounded-full font-medium transition-colors whitespace-nowrap ${
        active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

function MessageLog({
  logs,
  autoScroll,
  stats,
}: {
  logs: DebugLogEntry[];
  autoScroll: boolean;
  stats: DebugPanelProps['stats'];
}) {
  const [filter, setFilter] = useState<DebugLogType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredLogs = useMemo(() => {
    if (filter === 'all') return logs;
    return logs.filter((entry) => entry.type === filter);
  }, [logs, filter]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 overflow-x-auto flex-shrink-0">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label={`全部 (${stats.total})`} />
        <FilterButton active={filter === 'message_in'} onClick={() => setFilter('message_in')} label={`入站 (${stats.inbound})`} />
        <FilterButton active={filter === 'message_out'} onClick={() => setFilter('message_out')} label={`出站 (${stats.outbound})`} />
        <FilterButton active={filter === 'connection'} onClick={() => setFilter('connection')} label={`连接 (${stats.connection})`} />
        <FilterButton active={filter === 'execution'} onClick={() => setFilter('execution')} label={`执行 (${stats.execution})`} />
        <FilterButton active={filter === 'error'} onClick={() => setFilter('error')} label={`错误 (${stats.error})`} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-xs">暂无日志记录</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredLogs.map((entry) => {
              const config = LOG_TYPE_CONFIG[entry.type];
              const isExpanded = expandedId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="px-3 py-1.5 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-mono flex-shrink-0 w-[72px]">{formatTime(entry.timestamp)}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${config.bg} ${config.color} font-medium flex-shrink-0`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-700 font-mono truncate flex-1">{entry.label}</span>
                    {entry.duration !== undefined && (
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{formatDuration(entry.duration)}</span>
                    )}
                    <svg
                      className={`w-3 h-3 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  {isExpanded ? (
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-[10px] text-gray-600 font-mono overflow-x-auto max-h-40 whitespace-pre-wrap break-all">
                      {JSON.stringify(entry.detail, null, 2)}
                    </pre>
                  ) : (
                    entry.detail != null && <div className="mt-0.5 text-[10px] text-gray-400 font-mono truncate">{truncateDetail(entry.detail, 120)}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectionDashboard({
  connectionState,
  connectionDetails,
  logs,
}: {
  connectionState: ConnectionState;
  connectionDetails: ConnectionDetails;
  logs: DebugLogEntry[];
}) {
  const stateDisplay = STATE_DISPLAY[connectionState];
  const messageRate = useMemo(() => {
    const now = Date.now();
    return logs.filter((entry) => (entry.type === 'message_in' || entry.type === 'message_out') && now - entry.timestamp < 60_000).length;
  }, [logs]);
  const recentConnEvents = useMemo(() => logs.filter((entry) => entry.type === 'connection').slice(-5).reverse(), [logs]);

  return (
    <div className="p-3 space-y-4 overflow-y-auto h-full">
      <div className="rounded-lg border border-gray-200 p-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">连接状态</h3>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${stateDisplay.dot}`} />
            <span className={`text-sm font-semibold ${stateDisplay.color}`}>{stateDisplay.label}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="心跳延迟" value={connectionDetails.latency >= 0 ? `${connectionDetails.latency}ms` : '--'} />
          <MetricCard label="重连次数" value={String(connectionDetails.reconnectCount)} />
          <MetricCard label="消息速率" value={`${messageRate}/min`} />
          <MetricCard label="最后活跃" value={connectionDetails.lastActiveTime > 0 ? formatRelativeTime(connectionDetails.lastActiveTime) : '从未'} />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-3">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">服务端信息</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">地址:</span>
          <span className="font-mono text-gray-700 break-all">{connectionDetails.url}</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-3">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">最近连接事件</h3>
        {recentConnEvents.length === 0 ? (
          <div className="text-xs text-gray-400">暂无事件</div>
        ) : (
          <div className="space-y-1">
            {recentConnEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-2 text-[10px]">
                <span className="text-gray-400 font-mono w-[72px] flex-shrink-0">{formatTime(event.timestamp)}</span>
                <span className="text-gray-700">{event.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExecutionTimeline({
  timeline,
  onClear,
}: {
  timeline: TimelineEntry[];
  onClear: () => void;
}) {
  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs">暂无执行事件</span>
        <span className="text-[10px] mt-1">Agent 步骤、工具调用等将在此显示</span>
      </div>
    );
  }

  const earliest = timeline[0]?.startTime ?? Date.now();
  const latest = Math.max(
    ...timeline.map((entry) => entry.endTime || Date.now()),
    Date.now(),
  );
  const totalSpan = Math.max(latest - earliest, 1);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 flex-shrink-0">
        <span className="text-xs text-gray-500">共 {timeline.length} 个事件 · 总跨度 {formatDuration(totalSpan)}</span>
        <button onClick={onClear} className="text-[10px] text-gray-400 hover:text-red-500 transition-colors">清空</button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="relative">
          <div className="absolute left-[6px] top-0 bottom-0 w-px bg-gray-200" />
          {timeline.map((entry) => {
            const duration = entry.endTime ? entry.endTime - entry.startTime : Date.now() - entry.startTime;
            const statusColor =
              entry.status === 'running'
                ? 'bg-blue-500 animate-pulse'
                : entry.status === 'done'
                  ? 'bg-green-500'
                  : 'bg-red-500';
            const statusClass =
              entry.status === 'running'
                ? 'bg-blue-50 text-blue-600'
                : entry.status === 'done'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600';
            const statusLabel = entry.status === 'running' ? '进行中' : entry.status === 'done' ? '完成' : '错误';

            return (
              <div key={entry.id} className="relative pl-6 pb-3">
                <div className={`absolute left-0.5 top-1 w-3 h-3 rounded-full ${statusColor} border-2 border-white shadow-sm`} />
                <div className="bg-white rounded border border-gray-100 px-3 py-2 hover:border-gray-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-800">{entry.label}</span>
                    <span className="text-[10px] text-gray-400">{formatDuration(duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {formatTime(entry.startTime)}
                      {entry.endTime ? ` → ${formatTime(entry.endTime)}` : ' → ...'}
                    </span>
                    <span className={`text-[10px] px-1 rounded ${statusClass}`}>{statusLabel}</span>
                  </div>
                  {entry.detail && <div className="mt-1 text-[10px] text-gray-500 truncate">{entry.detail}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs font-medium text-gray-700">{label}</div>
        <div className="text-[10px] text-gray-400">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}

function ToggleControls({
  toggles,
  onSetToggles,
  stats,
  onClearLogs,
  onClearTimeline,
  onExport,
}: {
  toggles: DebugToggles;
  onSetToggles: (updater: Partial<DebugToggles>) => void;
  stats: DebugPanelProps['stats'];
  onClearLogs: () => void;
  onClearTimeline: () => void;
  onExport: () => void;
}) {
  return (
    <div className="p-3 space-y-4 overflow-y-auto h-full">
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">调试开关</h3>
        <div className="space-y-3">
          <ToggleRow label="启用日志采集" description="关闭后停止记录新的日志条目" checked={toggles.enabled} onChange={(value) => onSetToggles({ enabled: value })} />
          <ToggleRow label="自动滚动" description="新日志到达时自动滚动到底部" checked={toggles.autoScroll} onChange={(value) => onSetToggles({ autoScroll: value })} />
          <ToggleRow label="显示心跳消息" description="记录 heartbeat_ping/pong 消息" checked={toggles.showHeartbeat} onChange={(value) => onSetToggles({ showHeartbeat: value })} />
          <ToggleRow label="显示 Pong 消息" description="记录业务 pong 响应消息" checked={toggles.showPong} onChange={(value) => onSetToggles({ showPong: value })} />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">日志统计</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded p-2"><div className="text-lg font-bold text-gray-800">{stats.total}</div><div className="text-[10px] text-gray-500">总计</div></div>
          <div className="bg-green-50 rounded p-2"><div className="text-lg font-bold text-green-700">{stats.inbound}</div><div className="text-[10px] text-gray-500">入站</div></div>
          <div className="bg-blue-50 rounded p-2"><div className="text-lg font-bold text-blue-700">{stats.outbound}</div><div className="text-[10px] text-gray-500">出站</div></div>
          <div className="bg-amber-50 rounded p-2"><div className="text-lg font-bold text-amber-700">{stats.connection}</div><div className="text-[10px] text-gray-500">连接</div></div>
          <div className="bg-violet-50 rounded p-2"><div className="text-lg font-bold text-violet-700">{stats.execution}</div><div className="text-[10px] text-gray-500">执行</div></div>
          <div className="bg-red-50 rounded p-2"><div className="text-lg font-bold text-red-700">{stats.error}</div><div className="text-[10px] text-gray-500">错误</div></div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">操作</h3>
        <div className="space-y-2">
          <button onClick={onExport} className="w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">导出日志 (JSON)</button>
          <button onClick={onClearLogs} className="w-full px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">清空消息日志</button>
          <button onClick={onClearTimeline} className="w-full px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">清空执行时间线</button>
        </div>
      </div>
    </div>
  );
}

function SubTabButton({
  active,
  onClick,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium transition-colors border-b-2 ${
        active ? 'text-blue-600 border-blue-500 bg-white' : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span className={`px-1 py-0.5 text-[9px] rounded-full ${active ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

export default function DebugPanel({
  logs,
  timeline,
  toggles,
  connectionState,
  connectionDetails,
  stats,
  onSetToggles,
  onClearLogs,
  onClearTimeline,
  onExportLogs,
}: DebugPanelProps) {
  const [subTab, setSubTab] = useState<DebugSubTab>('logs');

  const handleExport = useCallback(() => {
    const json = onExportLogs();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-log-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [onExportLogs]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-100 bg-gray-50/50 flex-shrink-0 overflow-x-auto">
        <SubTabButton active={subTab === 'logs'} onClick={() => setSubTab('logs')} label="消息日志" badge={stats.total > 0 ? stats.total : undefined} />
        <SubTabButton active={subTab === 'dashboard'} onClick={() => setSubTab('dashboard')} label="连接仪表盘" />
        <SubTabButton active={subTab === 'timeline'} onClick={() => setSubTab('timeline')} label="时间线" badge={timeline.length > 0 ? timeline.length : undefined} />
        <SubTabButton active={subTab === 'settings'} onClick={() => setSubTab('settings')} label="设置" />
      </div>

      {!toggles.enabled && (
        <div className="px-3 py-1 bg-yellow-50 border-b border-yellow-100 text-[10px] text-yellow-700 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          日志采集已暂停
          <button onClick={() => onSetToggles({ enabled: true })} className="underline font-medium">点击启用</button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {subTab === 'logs' && <MessageLog logs={logs} autoScroll={toggles.autoScroll} stats={stats} />}
        {subTab === 'dashboard' && <ConnectionDashboard connectionState={connectionState} connectionDetails={connectionDetails} logs={logs} />}
        {subTab === 'timeline' && <ExecutionTimeline timeline={timeline} onClear={onClearTimeline} />}
        {subTab === 'settings' && (
          <ToggleControls
            toggles={toggles}
            onSetToggles={onSetToggles}
            stats={stats}
            onClearLogs={onClearLogs}
            onClearTimeline={onClearTimeline}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
}
