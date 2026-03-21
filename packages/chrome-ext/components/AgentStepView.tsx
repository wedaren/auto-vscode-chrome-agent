// AgentStepView.tsx — Agent 步骤展示组件，渲染 ReAct 循环的 think/act/observe 步骤
// 职责：接收 steps 数组，按类型分色展示（think=灰色斜体🧠, act=蓝色⚡+工具徽章, observe=绿色📋可折叠）
// 支持整体折叠/展开（默认展开最近3步）和 isRunning 加载动画
import React, { useState, useMemo } from 'react';

/** Agent 单步执行记录（与 VSCode 侧 AgentStep 类型对齐） */
export interface AgentStep {
  /** 当前步序号（从 1 开始） */
  step: number;
  /** 步骤类型：think=推理, act=工具调用, observe=观察结果 */
  type: 'think' | 'act' | 'observe';
  /** 步骤内容文本 */
  content: string;
  /** act 步骤的工具名称 */
  toolName?: string;
  /** act 步骤的工具参数 */
  toolArgs?: Record<string, unknown>;
}

/** AgentStepView 组件 Props */
export interface AgentStepViewProps {
  /** Agent 执行步骤列表 */
  steps: AgentStep[];
  /** 是否正在执行中（控制最后一步的加载动画） */
  isRunning?: boolean;
}

/** observe 内容超过此长度默认折叠 */
const OBSERVE_COLLAPSE_THRESHOLD = 200;

/** 默认展开的最近步数 */
const DEFAULT_VISIBLE_STEPS = 3;

/**
 * 单个 observe 步骤的折叠内容组件
 */
function ObserveContent({ content }: { content: string }) {
  const shouldCollapse = content.length > OBSERVE_COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(!shouldCollapse);

  if (!shouldCollapse) {
    return <span className="whitespace-pre-wrap break-words">{content}</span>;
  }

  return (
    <span>
      <span className="whitespace-pre-wrap break-words">
        {expanded ? content : `${content.substring(0, OBSERVE_COLLAPSE_THRESHOLD)}…`}
      </span>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="ml-1 text-xs text-green-600 hover:text-green-800 underline cursor-pointer"
      >
        {expanded ? '收起' : '展开全部'}
      </button>
    </span>
  );
}

/**
 * 加载动画指示器（脉冲圆点）
 */
function StepLoadingIndicator() {
  return (
    <span className="inline-flex items-center ml-2">
      <span className="agent-step-pulse" />
    </span>
  );
}

/**
 * 单个步骤渲染
 */
function StepItem({ step, isLast, isRunning }: { step: AgentStep; isLast: boolean; isRunning: boolean }) {
  const showLoading = isLast && isRunning;

  switch (step.type) {
    case 'think':
      return (
        <div className="flex items-start gap-2 py-1.5">
          <span className="flex-shrink-0 text-sm" title="思考">🧠</span>
          <div className="text-gray-500 italic text-xs leading-relaxed">
            {step.content}
            {showLoading && <StepLoadingIndicator />}
          </div>
        </div>
      );

    case 'act':
      return (
        <div className="flex items-start gap-2 py-1.5">
          <span className="flex-shrink-0 text-sm" title="执行">⚡</span>
          <div className="text-blue-600 text-xs leading-relaxed">
            <span>{step.content}</span>
            {step.toolName && (
              <span className="inline-block ml-1.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                {step.toolName}
              </span>
            )}
            {step.toolArgs && Object.keys(step.toolArgs).length > 0 && (
              <span className="ml-1 text-blue-400 text-[10px]">
                ({Object.keys(step.toolArgs).join(', ')})
              </span>
            )}
            {showLoading && <StepLoadingIndicator />}
          </div>
        </div>
      );

    case 'observe':
      return (
        <div className="flex items-start gap-2 py-1.5">
          <span className="flex-shrink-0 text-sm" title="观察">📋</span>
          <div className="text-green-700 text-xs leading-relaxed">
            <ObserveContent content={step.content} />
            {showLoading && <StepLoadingIndicator />}
          </div>
        </div>
      );

    default:
      return null;
  }
}

/**
 * AgentStepView — Agent 步骤展示组件
 *
 * 展示 ReAct 循环中 Agent 的思考、工具调用和观察过程。
 * - 整体可折叠/展开，默认展开最近 3 步
 * - think 步骤：灰色斜体带 🧠 图标
 * - act 步骤：蓝色带 ⚡ 图标和工具名称徽章
 * - observe 步骤：绿色带 📋 图标，超过 200 字默认折叠
 * - isRunning 时最后一步显示脉冲加载动画
 */
export default function AgentStepView({ steps, isRunning = false }: AgentStepViewProps) {
  // 当步骤数超过默认展开数时，可折叠旧步骤
  const hasHiddenSteps = steps.length > DEFAULT_VISIBLE_STEPS;
  const [showAll, setShowAll] = useState(false);

  /** 实际可见的步骤列表 */
  const visibleSteps = useMemo(() => {
    if (!hasHiddenSteps || showAll) return steps;
    return steps.slice(-DEFAULT_VISIBLE_STEPS);
  }, [steps, hasHiddenSteps, showAll]);

  const hiddenCount = steps.length - visibleSteps.length;

  if (steps.length === 0) return null;

  return (
    <div className="agent-step-view rounded-md border border-gray-200 bg-gray-50 px-3 py-2 mb-2">
      {/* 折叠/展开旧步骤 */}
      {hasHiddenSteps && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full text-left text-[11px] text-gray-400 hover:text-gray-600 py-1 cursor-pointer transition-colors"
        >
          {showAll
            ? `▲ 收起旧步骤`
            : `▼ 展开 ${hiddenCount} 个更早的步骤…`}
        </button>
      )}

      {/* 步骤列表 */}
      <div className="divide-y divide-gray-100">
        {visibleSteps.map((s, idx) => (
          <StepItem
            key={`${s.step}-${s.type}-${idx}`}
            step={s}
            isLast={idx === visibleSteps.length - 1}
            isRunning={isRunning}
          />
        ))}
      </div>

      {/* 运行中的全局提示 */}
      {isRunning && (
        <div className="flex items-center gap-1.5 pt-1.5 text-[11px] text-gray-400">
          <span className="agent-step-spinner" />
          Agent 正在执行…
        </div>
      )}
    </div>
  );
}
