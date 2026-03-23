// AgentProgressBar.tsx — Agent/Skill 执行进度条组件
// 职责：在消息区顶部显示 sticky 进度条，展示步骤 N/M + 当前描述 + 已耗时 + 取消按钮
// 适用于 Agent 多步执行和 Skill 执行场景，执行完成后自动消失
import React, { useState, useEffect, useRef } from 'react';

/** Agent 进度信息（来自 VSCode 侧 agent_progress 消息） */
export interface AgentProgressInfo {
  /** 执行状态 */
  status: 'start' | 'step' | 'complete' | 'cancelled' | 'error';
  /** 当前步骤序号（从 1 开始） */
  currentStep: number;
  /** 预估总步骤数 */
  totalSteps: number;
  /** 当前步骤描述 */
  description: string;
  /** 执行开始时间戳（Date.now()） */
  startedAt: number;
  /** 执行模式 */
  mode: 'agent' | 'skill';
  /** Skill 名称（仅 skill 模式） */
  skillName?: string;
}

interface AgentProgressBarProps {
  /** 进度信息（null 时不渲染） */
  progress: AgentProgressInfo | null;
  /** 取消按钮回调 */
  onCancel: () => void;
}

/** 格式化耗时：将毫秒转为 mm:ss 或 ss 格式 */
function formatElapsed(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs.toString().padStart(2, '0')}s`;
}

export default function AgentProgressBar({ progress, onCancel }: AgentProgressBarProps) {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 计时器：每秒更新已耗时
  useEffect(() => {
    if (!progress || progress.status === 'complete' || progress.status === 'cancelled' || progress.status === 'error') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // 初始化并启动计时器
    setElapsed(Date.now() - progress.startedAt);
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - progress.startedAt);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [progress?.status, progress?.startedAt]);

  // 不渲染：无进度 或 已完成/取消/错误
  if (!progress) return null;
  if (progress.status === 'complete' || progress.status === 'cancelled' || progress.status === 'error') {
    return null;
  }

  const pct = progress.totalSteps > 0
    ? Math.min(100, Math.round((progress.currentStep / progress.totalSteps) * 100))
    : 0;

  const modeLabel = progress.mode === 'skill'
    ? (progress.skillName || 'Skill')
    : 'Agent';

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-blue-100 shadow-sm px-4 py-2 flex items-center gap-3 animate-slideDown">
      {/* 脉冲点 */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
      </span>

      {/* 信息区 */}
      <div className="flex-1 min-w-0">
        {/* 第一行：模式标签 + 步骤计数 + 耗时 */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-blue-600">{modeLabel}</span>
          <span className="text-gray-500">
            步骤 {progress.currentStep}/{progress.totalSteps}
          </span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-400 tabular-nums">{formatElapsed(elapsed)}</span>
        </div>

        {/* 第二行：描述 */}
        {progress.description && (
          <div className="text-[11px] text-gray-500 truncate mt-0.5" title={progress.description}>
            {progress.description}
          </div>
        )}

        {/* 进度条 */}
        <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 取消按钮 */}
      <button
        onClick={onCancel}
        className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="取消执行"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
