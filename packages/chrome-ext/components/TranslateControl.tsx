// TranslateControl.tsx — 沉浸式翻译 UI 控制组件
// 职责：为 immersive_translate skill 提供专属 UI：翻译图标 + 目标语言快选 + 三模式分段控制器 + clear 操作
//       + 实时翻译进度条（监听 translate_progress WebSocket 消息，显示 N/M 段落已完成）
// evo_v34_003: 三模式分段控制器（原文 / 双语 / 译文）替代原 toggle 按钮
//   点击每个段触发 executeInjectBilingual('setDisplayMode', mode)
//   默认活跃模式为 bilingual；清除翻译后控制器隐藏
// 翻译状态持久化在组件 state 中（已翻译/未翻译/已隐藏）

import React, { useState, useCallback, useEffect, useRef } from 'react';

// ────────────────────────────────────────────────────────────────
// 类型
// ────────────────────────────────────────────────────────────────

/** 翻译状态 */
type TranslateState = 'idle' | 'running' | 'translated' | 'hidden' | 'error';

/** 三种显示模式（与 imt-overlay.ts DisplayMode 对齐） */
type DisplayMode = 'bilingual' | 'original' | 'translated';

/** 分段控制器配置 */
const DISPLAY_MODE_SEGMENTS: { mode: DisplayMode; label: string }[] = [
  { mode: 'original', label: '原文' },
  { mode: 'bilingual', label: '双语' },
  { mode: 'translated', label: '译文' },
];

/** evo_v30_003: translate_progress 消息 payload（与 VSCode 侧 TranslateProgressPayload 对齐） */
export interface TranslateProgressInfo {
  translated: number;
  total: number;
  batchIndex: number;
  totalBatches: number;
  status: 'translating' | 'injecting' | 'done' | 'error';
}

/** 常用目标语言选项 */
const TARGET_LANGUAGES = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' },
];

interface TranslateControlProps {
  /** Skill 信息 */
  skill: {
    name: string;
    displayName: string;
    description: string;
    parameters: {
      properties: Record<string, { type: string; description: string; enum?: string[]; default?: unknown }>;
      required: string[];
    };
    steps: { toolName: string; description: string; optional?: boolean }[];
  };
  /** 触发执行 skill（带参数） */
  onExecute: (params: Record<string, string>) => void;
  /** 是否有其他 skill 正在执行 */
  disabled: boolean;
  /** 是否连接到 VSCode */
  isConnected: boolean;
  /** SkillPanel 传入的翻译完成信号 */
  lastCompletion: { success: boolean; timestamp: number } | null;
  /** evo_v30_003: SkillPanel 传入的翻译进度（来自 translate_progress WebSocket 消息） */
  translateProgress: TranslateProgressInfo | null;
}

// ────────────────────────────────────────────────────────────────
// 辅助：通过 background script 执行浏览器操作
// ────────────────────────────────────────────────────────────────

interface ActionResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * 执行 injectBilingual 操作。
 * 支持 toggle / clear / setDisplayMode 三种模式。
 * setDisplayMode 模式需要额外传入 displayMode 参数。
 */
async function executeInjectBilingual(
  mode: 'toggle' | 'clear' | 'setDisplayMode',
  displayMode?: DisplayMode,
): Promise<ActionResult> {
  return new Promise<ActionResult>((resolve) => {
    try {
      const payload: Record<string, unknown> = { type: 'injectBilingual', injectMode: mode };
      if (mode === 'setDisplayMode' && displayMode) {
        payload.displayMode = displayMode;
      }
      chrome.runtime.sendMessage(
        {
          type: 'EXECUTE_ACTION',
          payload,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({
              success: false,
              error: `通信失败: ${chrome.runtime.lastError.message}`,
            });
            return;
          }
          if (response && response.type === 'ACTION_RESULT') {
            resolve(response.payload as ActionResult);
          } else {
            resolve({ success: false, error: '未收到有效响应' });
          }
        },
      );
    } catch (err) {
      resolve({
        success: false,
        error: `执行失败: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  });
}

// ────────────────────────────────────────────────────────────────
// evo_v34_003: 三模式分段控制器子组件
// ────────────────────────────────────────────────────────────────

function DisplayModeSegments({
  activeMode,
  onModeChange,
}: {
  activeMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
      {DISPLAY_MODE_SEGMENTS.map(({ mode, label }) => {
        const isActive = activeMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            title={
              mode === 'original'
                ? '仅显示原文'
                : mode === 'bilingual'
                  ? '双语对照显示'
                  : '仅显示译文'
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// evo_v30_003: 翻译进度条子组件
// ────────────────────────────────────────────────────────────────

function TranslateProgressBar({ progress }: { progress: TranslateProgressInfo }) {
  const { translated, total, batchIndex, totalBatches, status } = progress;
  const percentage = total > 0 ? Math.min(Math.round((translated / total) * 100), 100) : 0;
  const isDone = status === 'done';
  const isError = status === 'error';

  // 状态描述文本
  const statusText = (() => {
    if (isDone) return '翻译完成 ✓';
    if (isError) return '翻译出错';
    if (status === 'injecting') return `注入中: ${translated}/${total} 段落已完成`;
    // translating
    return `翻译中: ${translated}/${total} 段落已完成`;
  })();

  // 批次信息
  const batchText = isDone
    ? `共 ${totalBatches} 批次`
    : `批次 ${batchIndex}/${totalBatches}`;

  return (
    <div
      className={`px-3 pb-2 transition-all duration-500 ${
        isDone ? 'opacity-80' : 'opacity-100'
      }`}
    >
      <div
        className={`rounded-lg p-2.5 ${
          isDone
            ? 'bg-green-50 border border-green-200'
            : isError
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
        }`}
      >
        {/* 进度文本 */}
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`text-xs font-medium ${
              isDone
                ? 'text-green-600'
                : isError
                  ? 'text-red-600'
                  : 'text-blue-600'
            }`}
          >
            {statusText}
          </span>
          <span className="text-[10px] text-gray-400">{batchText}</span>
        </div>

        {/* 进度条 */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isDone
                ? 'bg-green-500'
                : isError
                  ? 'bg-red-400'
                  : 'bg-blue-500'
            } ${!isDone && !isError ? 'animate-pulse-subtle' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* 百分比 */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-gray-400">
            {percentage}%
          </span>
          {!isDone && !isError && (
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              处理中
            </span>
          )}
        </div>
      </div>

      {/* 用于动画的内联 style（避免依赖 Tailwind 自定义 keyframes） */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 主组件
// ────────────────────────────────────────────────────────────────

export default function TranslateControl({
  skill,
  onExecute,
  disabled,
  isConnected,
  lastCompletion,
  translateProgress,
}: TranslateControlProps) {
  const [translateState, setTranslateState] = useState<TranslateState>('idle');
  const [selectedLang, setSelectedLang] = useState<string>('zh-CN');
  const [lastError, setLastError] = useState<string>('');

  // evo_v34_003: 当前活跃显示模式，默认 bilingual
  const [activeDisplayMode, setActiveDisplayMode] = useState<DisplayMode>('bilingual');

  // 上次完成信号的时间戳，用于去重
  const lastCompletionTs = useRef<number>(0);

  // ── 监听 SkillPanel 传入的完成信号 ──
  useEffect(() => {
    if (!lastCompletion) return;
    if (lastCompletion.timestamp <= lastCompletionTs.current) return;
    lastCompletionTs.current = lastCompletion.timestamp;

    if (lastCompletion.success) {
      setTranslateState('translated');
      setLastError('');
    } else {
      setTranslateState('error');
      setLastError('翻译执行失败');
    }
  }, [lastCompletion]);

  // evo_v30_003: 当收到 translate_progress 消息时，自动将状态更新为 running
  useEffect(() => {
    if (!translateProgress) return;
    if (translateProgress.status === 'done') {
      // done 由 lastCompletion (skill_complete) 来最终切换状态
      // 这里不做切换，避免与 skill_complete 竞争
    } else if (translateProgress.status === 'error') {
      // error 保持 running 状态，等 skill_complete 最终判定
    } else {
      // translating / injecting → 确保显示 running 状态
      if (translateState !== 'running') {
        setTranslateState('running');
      }
    }
  }, [translateProgress, translateState]);

  // ── 触发翻译 ──
  const handleTranslate = useCallback(() => {
    if (disabled || !isConnected) return;
    setTranslateState('running');
    setLastError('');
    // evo_v34_003: 翻译完成后默认进入 bilingual 模式
    setActiveDisplayMode('bilingual');
    onExecute({ targetLanguage: selectedLang });
  }, [disabled, isConnected, onExecute, selectedLang]);

  // ── evo_v34_003: 切换显示模式（替代原 toggle） ──
  const handleDisplayModeChange = useCallback(async (mode: DisplayMode) => {
    const result = await executeInjectBilingual('setDisplayMode', mode);
    if (result.success) {
      setActiveDisplayMode(mode);
      // 更新 translateState 以匹配语义：
      // original 模式相当于 "隐藏翻译"，bilingual/translated 模式相当于 "已翻译"
      if (mode === 'original') {
        setTranslateState('hidden');
      } else {
        setTranslateState('translated');
      }
      setLastError('');
    } else {
      setLastError(result.error || '切换模式失败');
    }
  }, []);

  // ── Clear 清除翻译 ──
  const handleClear = useCallback(async () => {
    const result = await executeInjectBilingual('clear');
    if (result.success) {
      setTranslateState('idle');
      setLastError('');
      // evo_v34_003: 清除后重置为默认 bilingual 模式
      setActiveDisplayMode('bilingual');
    } else {
      setLastError(result.error || '清除失败');
    }
  }, []);

  const isTranslated = translateState === 'translated' || translateState === 'hidden';
  const isRunning = translateState === 'running';

  // evo_v30_003: 是否显示进度条（running 时且有进度数据）
  const showProgress = isRunning && translateProgress !== null;

  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden bg-gradient-to-r from-blue-50/80 to-indigo-50/50 hover:border-blue-300 hover:shadow-sm transition-all">
      {/* 头部：翻译图标 + 标题 */}
      <div className="flex items-center gap-2.5 px-3 pt-3 pb-1.5">
        {/* 翻译图标 */}
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
          <svg className="w-4.5 h-4.5 text-white" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8l6 6" />
            <path d="M4 14l6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="M22 22l-5-10-5 10" />
            <path d="M14 18h6" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-800">{skill.displayName}</h4>
          <p className="text-[11px] text-gray-500 leading-tight">{skill.description}</p>
        </div>
      </div>

      {/* 语言快选 + 翻译按钮 */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          {/* 目标语言选择 */}
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] text-gray-400 mb-1">目标语言</label>
            <div className="flex flex-wrap gap-1">
              {TARGET_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  disabled={isRunning}
                  className={`px-2 py-0.5 text-[11px] rounded-full border transition-all ${
                    selectedLang === lang.code
                      ? 'border-blue-400 bg-blue-500 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 翻译按钮 */}
        <button
          onClick={handleTranslate}
          disabled={disabled || !isConnected || isRunning}
          className={`w-full mt-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            isRunning
              ? 'bg-blue-100 text-blue-500 cursor-wait'
              : isTranslated
                ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              翻译中...
            </>
          ) : isTranslated ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              重新翻译
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              翻译此页面
            </>
          )}
        </button>
      </div>

      {/* evo_v30_003: 翻译进度条 — 实时显示翻译批次进度 */}
      {showProgress && translateProgress && (
        <TranslateProgressBar progress={translateProgress} />
      )}

      {/* 翻译完成提示（translateProgress 为 done 但尚未被清除时） */}
      {!isRunning && translateProgress?.status === 'done' && (
        <div className="px-3 pb-2">
          <div className="rounded-lg p-2 bg-green-50 border border-green-200 flex items-center gap-2 transition-opacity duration-500">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs font-medium text-green-600">
              翻译完成 ✓ — {translateProgress.total} 段落已完成
            </span>
          </div>
        </div>
      )}

      {/* evo_v34_003: 翻译完成后显示三模式分段控制器 + 清除按钮（替代原 toggle + clear） */}
      {isTranslated && (
        <div className="px-3 pb-3 pt-0.5 space-y-2">
          {/* 三模式分段控制器：原文 / 双语 / 译文 */}
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">显示模式</label>
            <DisplayModeSegments
              activeMode={activeDisplayMode}
              onModeChange={handleDisplayModeChange}
            />
          </div>

          {/* Clear 按钮 */}
          <button
            onClick={handleClear}
            className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
            title="清除所有翻译"
          >
            {/* Trash icon */}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清除翻译
          </button>
        </div>
      )}

      {/* 错误提示 */}
      {lastError && (
        <div className="px-3 pb-2">
          <div className="text-[11px] text-red-500 bg-red-50 rounded-md px-2 py-1">
            {lastError}
          </div>
        </div>
      )}

      {/* 步骤数信息 */}
      <div className="px-3 pb-2 flex items-center gap-3 text-[10px] text-gray-400">
        <span>{skill.steps.length} 个步骤</span>
        {isTranslated && (
          <span className="text-green-500 font-medium">
            {activeDisplayMode === 'original' ? '仅原文' : activeDisplayMode === 'translated' ? '仅译文' : '双语对照'}
          </span>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 导出辅助方法供 SkillPanel 同步翻译状态
// ────────────────────────────────────────────────────────────────

/** 检测 skill 是否为沉浸式翻译 */
export function isImmersiveTranslateSkill(skillName: string): boolean {
  return skillName === 'immersive_translate';
}
