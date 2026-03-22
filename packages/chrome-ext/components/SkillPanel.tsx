// SkillPanel.tsx — Skill 面板组件
// 职责：展示可用 Skill 卡片列表、一键触发执行、参数输入弹窗、执行进度实时显示
// 通过 WebSocket skill_list / skill_execute / skill_progress / skill_complete 协议与 VSCode 通信
import React, { useState, useEffect, useCallback, useRef } from 'react';
import TranslateControl, { isImmersiveTranslateSkill } from './TranslateControl';

// ────────────────────────────────────────────────────────────────
// 类型定义（与 VSCode 侧 skill-registry.ts 保持一致）
// ────────────────────────────────────────────────────────────────

interface SkillParameterProperty {
  type: string;
  description: string;
  enum?: string[];
  default?: unknown;
}

interface SkillParametersSchema {
  type: 'object';
  properties: Record<string, SkillParameterProperty>;
  required: string[];
}

interface SkillInfo {
  name: string;
  displayName: string;
  description: string;
  category: 'preset' | 'custom';
  enabled: boolean;
  parameters: SkillParametersSchema;
  steps: { toolName: string; description: string; optional?: boolean }[];
}

/** 单步进度信息 */
interface StepProgress {
  stepIndex: number;
  totalSteps: number;
  status: 'running' | 'success' | 'failed' | 'skipped';
  result?: string;
  description: string;
}

/** Skill 执行状态 */
interface SkillExecution {
  skillName: string;
  displayName: string;
  isRunning: boolean;
  steps: StepProgress[];
  totalSteps: number;
  success?: boolean;
  summary?: string;
}

// ────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────

interface SkillPanelProps {
  /** 发送 WebSocket 消息 */
  sendMessage: (type: string, payload: unknown) => boolean;
  /** 注册 WebSocket 消息监听器 */
  onMessage: (handler: (msg: { type: string; payload: unknown }) => void) => () => void;
  /** 是否已连接 */
  isConnected: boolean;
}

// ────────────────────────────────────────────────────────────────
// 组件
// ────────────────────────────────────────────────────────────────

export default function SkillPanel({ sendMessage, onMessage, isConnected }: SkillPanelProps) {
  // Skill 列表
  const [skills, setSkills] = useState<SkillInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // 参数输入弹窗
  const [paramModalSkill, setParamModalSkill] = useState<SkillInfo | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  // 执行状态
  const [execution, setExecution] = useState<SkillExecution | null>(null);

  // 沉浸式翻译完成信号（传给 TranslateControl 组件同步状态）
  const [translateCompletion, setTranslateCompletion] = useState<{ success: boolean; timestamp: number } | null>(null);

  // ── 请求去重：使用 ref 追踪 sendMessage 引用和请求状态 ──
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;
  const requestedRef = useRef(false);

  // ── 请求 Skill 列表（引用稳定，不依赖 sendMessage） ──
  const requestSkillList = useCallback(() => {
    if (!isConnected) return;
    setLoading(true);
    sendMessageRef.current('skill_list', {});
  }, [isConnected]);

  // 连接后自动请求 Skill 列表（仅一次，断开后重置）
  useEffect(() => {
    if (isConnected && !requestedRef.current) {
      requestedRef.current = true;
      requestSkillList();
    }
    if (!isConnected) {
      requestedRef.current = false;
    }
  }, [isConnected, requestSkillList]);

  // ── 监听 Skill 相关消息 ──
  useEffect(() => {
    const unsub = onMessage((msg) => {
      switch (msg.type) {
        case 'skill_list_result': {
          const payload = msg.payload as { skills: SkillInfo[] };
          setSkills(payload.skills ?? []);
          setLoading(false);
          break;
        }
        case 'skill_progress': {
          const progress = msg.payload as StepProgress & { skillName: string; displayName?: string };
          setExecution((prev) => {
            if (!prev || prev.skillName !== progress.skillName) {
              // 首个进度消息，创建执行状态
              return {
                skillName: progress.skillName,
                displayName: progress.displayName ?? progress.skillName,
                isRunning: true,
                steps: [progress],
                totalSteps: progress.totalSteps,
              };
            }
            // 更新现有步骤或追加新步骤
            const existingIdx = prev.steps.findIndex((s) => s.stepIndex === progress.stepIndex);
            const newSteps = [...prev.steps];
            if (existingIdx >= 0) {
              newSteps[existingIdx] = progress;
            } else {
              newSteps.push(progress);
            }
            return { ...prev, steps: newSteps };
          });
          break;
        }
        case 'skill_complete': {
          const result = msg.payload as {
            skillName: string;
            success: boolean;
            summary: string;
          };
          setExecution((prev) => {
            if (!prev || prev.skillName !== result.skillName) return prev;
            return {
              ...prev,
              isRunning: false,
              success: result.success,
              summary: result.summary,
            };
          });
          // 通知 TranslateControl 执行结果
          if (isImmersiveTranslateSkill(result.skillName)) {
            setTranslateCompletion({ success: result.success, timestamp: Date.now() });
          }
          break;
        }
      }
    });
    return unsub;
  }, [onMessage]);

  // ── 触发执行 ──
  const handleRunSkill = useCallback((skill: SkillInfo) => {
    // 检查是否需要参数输入
    const paramKeys = Object.keys(skill.parameters.properties);
    const hasRequiredParams = skill.parameters.required.length > 0;
    const hasAnyParams = paramKeys.length > 0;

    if (hasRequiredParams || hasAnyParams) {
      // 打开参数输入弹窗，预填默认值
      const defaults: Record<string, string> = {};
      for (const [key, prop] of Object.entries(skill.parameters.properties)) {
        if (prop.default !== undefined) {
          defaults[key] = String(prop.default);
        }
      }
      setParamValues(defaults);
      setParamModalSkill(skill);
    } else {
      // 无参数，直接执行
      executeSkill(skill.name, {});
    }
  }, []);

  const executeSkill = useCallback((skillName: string, params: Record<string, string>) => {
    // 重置执行状态
    const skill = skills.find((s) => s.name === skillName);
    setExecution({
      skillName,
      displayName: skill?.displayName ?? skillName,
      isRunning: true,
      steps: [],
      totalSteps: skill?.steps.length ?? 0,
    });
    setParamModalSkill(null);
    sendMessageRef.current('skill_execute', { skillName, params });
  }, [skills]);

  const handleParamSubmit = useCallback(() => {
    if (!paramModalSkill) return;
    // 校验必填参数
    const missing = paramModalSkill.parameters.required.filter(
      (p) => !paramValues[p] || paramValues[p].trim() === '',
    );
    if (missing.length > 0) {
      return; // 保持弹窗，让用户填写
    }
    executeSkill(paramModalSkill.name, paramValues);
  }, [paramModalSkill, paramValues, executeSkill]);

  const handleDismissExecution = useCallback(() => {
    setExecution(null);
  }, []);

  // ── TranslateControl 执行入口 ──
  const handleTranslateExecute = useCallback((params: Record<string, string>) => {
    executeSkill('immersive_translate', params);
  }, [executeSkill]);

  // ── 分类展示 ──
  const enabledSkills = skills.filter((s) => s.enabled);
  const presetSkills = enabledSkills.filter((s) => s.category === 'preset');
  const customSkills = enabledSkills.filter((s) => s.category === 'custom');
  // 将沉浸式翻译 skill 单独提取
  const translateSkill = enabledSkills.find((s) => isImmersiveTranslateSkill(s.name));
  const presetSkillsFiltered = presetSkills.filter((s) => !isImmersiveTranslateSkill(s.name));

  // ────────────────────────────────────────────────────────────────
  // 渲染
  // ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* 执行进度覆盖层 */}
      {execution && (
        <ExecutionOverlay
          execution={execution}
          onDismiss={handleDismissExecution}
        />
      )}

      {/* 参数输入弹窗 */}
      {paramModalSkill && (
        <ParamModal
          skill={paramModalSkill}
          values={paramValues}
          onChange={setParamValues}
          onSubmit={handleParamSubmit}
          onCancel={() => setParamModalSkill(null)}
        />
      )}

      {/* Skill 列表 */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {!isConnected ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            未连接到 VSCode
          </div>
        ) : loading ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-2" />
            <p>加载 Skill 列表...</p>
          </div>
        ) : enabledSkills.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            暂无可用 Skill
          </div>
        ) : (
          <>
            {/* 沉浸式翻译快捷入口（置顶） */}
            {translateSkill && (
              <div>
                <h3 className="text-xs font-medium text-blue-500 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  沉浸式翻译
                </h3>
                <TranslateControl
                  skill={translateSkill}
                  onExecute={handleTranslateExecute}
                  disabled={execution?.isRunning === true}
                  isConnected={isConnected}
                  lastCompletion={translateCompletion}
                />
              </div>
            )}

            {/* 预设 Skill */}
            {presetSkillsFiltered.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-1">
                  预设 Skill ({presetSkillsFiltered.length})
                </h3>
                <div className="space-y-2">
                  {presetSkillsFiltered.map((skill) => (
                    <SkillCard
                      key={skill.name}
                      skill={skill}
                      onRun={() => handleRunSkill(skill)}
                      disabled={execution?.isRunning === true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 自定义 Skill */}
            {customSkills.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-1">
                  自定义 Skill ({customSkills.length})
                </h3>
                <div className="space-y-2">
                  {customSkills.map((skill) => (
                    <SkillCard
                      key={skill.name}
                      skill={skill}
                      onRun={() => handleRunSkill(skill)}
                      disabled={execution?.isRunning === true}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部刷新按钮 */}
      <div className="px-3 py-2 border-t border-gray-100">
        <button
          onClick={requestSkillList}
          disabled={!isConnected || loading}
          className="w-full px-3 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          刷新 Skill 列表
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：Skill 卡片
// ────────────────────────────────────────────────────────────────

function SkillCard({
  skill,
  onRun,
  disabled,
}: {
  skill: SkillInfo;
  onRun: () => void;
  disabled: boolean;
}) {
  const categoryColor =
    skill.category === 'preset'
      ? 'bg-blue-50 text-blue-600'
      : 'bg-green-50 text-green-600';

  const categoryLabel = skill.category === 'preset' ? '预设' : '自定义';

  return (
    <div className="group border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-800 truncate">
              {skill.displayName}
            </h4>
            <span
              className={`flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded ${categoryColor}`}
            >
              {categoryLabel}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2">{skill.description}</p>
          {/* 步骤数标识 */}
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-gray-400">
            <span>{skill.steps.length} 个步骤</span>
            {Object.keys(skill.parameters.properties).length > 0 && (
              <span>
                {skill.parameters.required.length > 0
                  ? `${skill.parameters.required.length} 个必填参数`
                  : '可选参数'}
              </span>
            )}
          </div>
        </div>

        {/* 运行按钮 */}
        <button
          onClick={onRun}
          disabled={disabled}
          className="flex-shrink-0 p-2 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title={`运行 ${skill.displayName}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：参数输入弹窗
// ────────────────────────────────────────────────────────────────

function ParamModal({
  skill,
  values,
  onChange,
  onSubmit,
  onCancel,
}: {
  skill: SkillInfo;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const paramEntries = Object.entries(skill.parameters.properties);
  const missingRequired = skill.parameters.required.filter(
    (p) => !values[p] || values[p].trim() === '',
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && missingRequired.length === 0) {
      e.preventDefault();
      onSubmit();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onCancel}>
      <div
        className="bg-white rounded-xl shadow-xl w-[90%] max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* 弹窗标题 */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            运行「{skill.displayName}」
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{skill.description}</p>
        </div>

        {/* 参数输入字段 */}
        <div className="px-4 py-2 space-y-3 max-h-[50vh] overflow-y-auto">
          {paramEntries.map(([key, prop]) => {
            const isRequired = skill.parameters.required.includes(key);

            return (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {prop.description || key}
                  {isRequired && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {prop.enum ? (
                  // 枚举类型用下拉选择
                  <select
                    value={values[key] ?? ''}
                    onChange={(e) =>
                      onChange({ ...values, [key]: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  >
                    <option value="">请选择...</option>
                    {prop.enum.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  // 普通文本输入
                  <input
                    type="text"
                    value={values[key] ?? ''}
                    onChange={(e) =>
                      onChange({ ...values, [key]: e.target.value })
                    }
                    placeholder={
                      prop.default !== undefined
                        ? `默认: ${String(prop.default)}`
                        : `输入 ${key}`
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 placeholder:text-gray-300"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 按钮 */}
        <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={onSubmit}
            disabled={missingRequired.length > 0}
            className="flex-1 px-3 py-1.5 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            执行
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：执行进度覆盖层
// ────────────────────────────────────────────────────────────────

function ExecutionOverlay({
  execution,
  onDismiss,
}: {
  execution: SkillExecution;
  onDismiss: () => void;
}) {
  const { displayName, isRunning, steps, totalSteps, success, summary } = execution;

  // 根据 stepIndex 生成全部步骤占位（已有进度的用实际数据，未到的显示为 pending）
  const allSteps: (StepProgress | null)[] = [];
  for (let i = 0; i < totalSteps; i++) {
    const existing = steps.find((s) => s.stepIndex === i);
    allSteps.push(existing ?? null);
  }

  return (
    <div className="absolute inset-0 z-40 bg-white/95 flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : success ? (
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="text-sm font-medium text-gray-800">{displayName}</span>
        </div>
        {!isRunning && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="关闭"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 进度条 */}
      <div className="px-4 pt-3">
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              success === false ? 'bg-red-400' : 'bg-blue-500'
            }`}
            style={{
              width: `${totalSteps > 0 ? (steps.length / totalSteps) * 100 : 0}%`,
            }}
          />
        </div>
        <div className="text-[10px] text-gray-400 mt-1 text-right">
          {steps.length} / {totalSteps} 步
        </div>
      </div>

      {/* 步骤列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
        {allSteps.map((step, idx) => (
          <StepItem key={idx} step={step} index={idx} />
        ))}
      </div>

      {/* 结果摘要 */}
      {!isRunning && summary && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div
            className={`text-xs rounded-lg p-2 ${
              success
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            <p className="font-medium mb-1">{success ? '执行完成' : '执行失败'}</p>
            <p className="whitespace-pre-wrap line-clamp-6">{summary}</p>
          </div>
        </div>
      )}

      {/* 底部关闭按钮 */}
      {!isRunning && (
        <div className="px-4 py-2 border-t border-gray-100">
          <button
            onClick={onDismiss}
            className="w-full px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            返回 Skill 列表
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 子组件：单步进度项
// ────────────────────────────────────────────────────────────────

function StepItem({
  step,
  index,
}: {
  step: StepProgress | null;
  index: number;
}) {
  if (!step) {
    // pending 状态
    return (
      <div className="flex items-start gap-2 py-1.5 opacity-40">
        <div className="w-5 h-5 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center mt-0.5">
          <span className="text-[10px] text-gray-400">{index + 1}</span>
        </div>
        <span className="text-xs text-gray-400">等待执行...</span>
      </div>
    );
  }

  const { status, description, result } = step;

  const iconMap: Record<string, React.ReactNode> = {
    running: (
      <div className="w-5 h-5 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
        <div className="w-2.5 h-2.5 border-[1.5px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
    success: (
      <div className="w-5 h-5 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    failed: (
      <div className="w-5 h-5 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
        <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    skipped: (
      <div className="w-5 h-5 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
        <svg className="w-3 h-3 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </div>
    ),
  };

  const textColorMap: Record<string, string> = {
    running: 'text-blue-700',
    success: 'text-gray-700',
    failed: 'text-red-700',
    skipped: 'text-yellow-700',
  };

  return (
    <div className={`flex items-start gap-2 py-1.5 ${status === 'running' ? 'bg-blue-50/50 -mx-2 px-2 rounded-lg' : ''}`}>
      {iconMap[status]}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium ${textColorMap[status]}`}>
          {description}
        </p>
        {result && status !== 'running' && (
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">{result}</p>
        )}
      </div>
    </div>
  );
}
