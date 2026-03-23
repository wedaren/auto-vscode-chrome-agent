// TranslateControl.tsx — 沉浸式翻译 UI 控制组件
// 职责：为 immersive_translate skill 提供专属 UI：翻译图标 + 目标语言快选 + toggle/clear 操作按钮
//       + 实时翻译进度条（监听 translate_progress WebSocket 消息，显示 N/M 段落已完成）
// toggle 按钮调用 browser_inject_bilingual(mode:'toggle')，clear 按钮调用 browser_inject_bilingual(mode:'clear')
// 翻译状态持久化在组件 state 中（已翻译/未翻译/已隐藏）

import React, { useState, useCallback, useEffect, useRef } from 'react';

// ────────────────────────────────────────────────────────────────
// 类型
// ────────────────────────────────────────────────────────────────

/** 翻译状态 */
type TranslateState = 'idle' | 'running' | 'translated' | 'hidden' | 'error';

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

async function executeInjectBilingual(mode: 'toggle' | 'clear'): Promise<ActionResult> {
  return new Promise<ActionResult>((resolve) => {
    try {
      chrome.runtime.sendMessage(
        {
          type: 'EXECUTE_ACTION',
          payload: { type: 'injectBilingual', injectMode: mode },
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
    onExecute({ targetLanguage: selectedLang });
  }, [disabled, isConnected, onExecute, selectedLang]);

  // ── Toggle 翻译显示/隐藏 ──
  const handleToggle = useCallback(async () => {
    const result = await executeInjectBilingual('toggle');
    if (result.success) {
      const data = result.data as { newState?: string } | undefined;
      if (data?.newState === 'hidden') {
        setTranslateState('hidden');
      } else {
        setTranslateState('translated');
      }
    } else {
      setLastError(result.error || '切换失败');
    }
  }, []);

  // ── Clear 清除翻译 ──
  const handleClear = useCallback(async () => {
    const result = await executeInjectBilingual('clear');
    if (result.success) {
      setTranslateState('idle');
      setLastError('');
    } else {
      setLastError(result.error || '清除失败');
    }
  }, []);

  // ── 外部通知执行完成（由 SkillPanel 调用） ──
  // 通过 key prop 或 useEffect 在 SkillPanel 中同步

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

      {/* 翻译后操作按钮：toggle + clear */}
      {isTranslated && (
        <div className="px-3 pb-3 pt-0.5">
          <div className="flex gap-2">
            {/* Toggle 按钮 */}
            <button
              onClick={handleToggle}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                translateState === 'hidden'
                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
              title={translateState === 'hidden' ? '显示翻译' : '隐藏翻译'}
            >
              {translateState === 'hidden' ? (
                <>
                  {/* Eye icon - show */}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  显示翻译
                </>
              ) : (
                <>
                  {/* Eye-off icon - hide */}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  隐藏翻译
                </>
              )}
            </button>

            {/* Clear 按钮 */}
            <button
              onClick={handleClear}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
              title="清除所有翻译"
            >
              {/* Trash icon */}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清除翻译
            </button>
          </div>
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
            {translateState === 'hidden' ? '已隐藏' : '已翻译'}
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
