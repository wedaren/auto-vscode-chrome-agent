// useResearch.ts — 深度调研状态管理 Hook
// 职责：管理深度调研的完整生命周期状态（空闲→计划→编辑→执行→报告），
//       处理 6 种 deep_research_* WebSocket 消息，暴露计划编辑/确认/取消等操作
import { useState, useRef, useCallback, useEffect } from 'react';
import type { BridgeMessage } from '../src/ws-client';
import type { BridgeMeta } from '../src/observability';
import { createRootMeta } from '../src/observability';

// ────────────────────────────────────────────────────────────────
// 数据模型（与 VSCode 侧 deep-research-engine.ts 保持一致）
// ────────────────────────────────────────────────────────────────

/** 子问题状态 */
export type SubQuestionStatus = 'pending' | 'investigating' | 'answered' | 'gap';

/** 研究计划中的子问题 */
export interface SubQuestion {
  id: string;
  question: string;
  status: SubQuestionStatus;
}

/** 搜索策略 */
export interface SearchStrategy {
  query: string;
  rationale: string;
}

/** 研究计划（从 deep_research_plan 消息接收） */
export interface ResearchPlan {
  topic: string;
  subQuestions: SubQuestion[];
  searchStrategies: SearchStrategy[];
  iteration: number;
  maxIterations: number;
  maxPages: number;
}

/** 思考流条目 */
export interface ThinkingEntry {
  id: string;
  thought: string;
  status: string;
  timestamp: number;
  citationCount: number;
}

/** 进度信息 */
export interface ResearchProgress {
  status: string;
  phase: string;
  message: string;
  citationCount: number;
}

/** 引用信息 */
export interface Citation {
  id: number;
  url: string;
  title: string;
  excerpt: string;
  timestamp: number;
}

/** 最终报告 */
export interface ResearchReport {
  report: string;
  citations: Citation[];
  totalIterations: number;
  totalPages: number;
  plan: {
    subQuestions: Array<{
      id: string;
      question: string;
      status: SubQuestionStatus;
      findingsCount: number;
    }>;
  };
}

/** 调研阶段（UI 状态机） */
export type ResearchPhase =
  | 'idle'        // 空闲：显示主题输入
  | 'starting'    // 已发送启动请求
  | 'plan_review' // 计划待审核/编辑
  | 'executing'   // 迭代执行中
  | 'done'        // 报告生成完成
  | 'error';      // 出错

// ────────────────────────────────────────────────────────────────
// Hook 接口
// ────────────────────────────────────────────────────────────────

export interface UseResearchOptions {
  sendMessage: (type: string, payload: unknown, meta?: Partial<BridgeMeta>) => boolean;
  onMessage: (handler: (msg: BridgeMessage) => void) => () => void;
}

export interface UseResearchReturn {
  /** 当前调研阶段 */
  phase: ResearchPhase;
  /** 研究计划（plan_review / executing / done 阶段可用） */
  plan: ResearchPlan | null;
  /** 思考流日志（时间倒序展示） */
  thinkingLog: ThinkingEntry[];
  /** 最新进度 */
  progress: ResearchProgress | null;
  /** 最终报告（done 阶段可用） */
  report: ResearchReport | null;
  /** 错误信息 */
  error: string | null;
  /** 调研开始时间（毫秒，用于计算耗时） */
  startedAt: number | null;
  /** 发起调研 */
  startResearch: (topic: string, startUrl?: string, pageContext?: string) => void;
  /** 确认/提交计划 */
  confirmPlan: (editedPlan?: { subQuestions?: SubQuestion[]; searchStrategies?: SearchStrategy[] }) => void;
  /** 拒绝/取消计划 */
  rejectPlan: () => void;
  /** 重置状态（回到 idle） */
  reset: () => void;
}

/**
 * 深度调研状态管理 Hook
 *
 * 处理的 WebSocket 消息类型：
 * - deep_research_start   → 调研已启动确认
 * - deep_research_plan    → 研究计划推送（等待用户编辑/确认）
 * - deep_research_thinking → 实时思考流
 * - deep_research_progress → 阶段进度
 * - deep_research_report  → 最终报告
 */
export function useResearch({ sendMessage, onMessage }: UseResearchOptions): UseResearchReturn {
  const [phase, setPhase] = useState<ResearchPhase>('idle');
  const [plan, setPlan] = useState<ResearchPlan | null>(null);
  const [thinkingLog, setThinkingLog] = useState<ThinkingEntry[]>([]);
  const [progress, setProgress] = useState<ResearchProgress | null>(null);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  /** 用于生成唯一 thinking entry ID */
  const thinkingCountRef = useRef(0);

  // 注册 WebSocket 消息监听
  useEffect(() => {
    const unsub = onMessage((msg: BridgeMessage) => {
      switch (msg.type) {
        case 'deep_research_start': {
          const payload = msg.payload as { topic?: string; status?: string };
          if (payload?.status === 'started') {
            setPhase('starting');
            setStartedAt(Date.now());
            setThinkingLog([]);
            setProgress(null);
            setReport(null);
            setError(null);
          }
          break;
        }

        case 'deep_research_plan': {
          const payload = msg.payload as ResearchPlan;
          if (payload) {
            setPlan({
              topic: payload.topic ?? '',
              subQuestions: (payload.subQuestions ?? []).map((sq) => ({
                id: sq.id,
                question: sq.question,
                status: sq.status ?? 'pending',
              })),
              searchStrategies: (payload.searchStrategies ?? []).map((s) => ({
                query: s.query,
                rationale: s.rationale,
              })),
              iteration: payload.iteration ?? 1,
              maxIterations: payload.maxIterations ?? 3,
              maxPages: payload.maxPages ?? 15,
            });
            setPhase('plan_review');
          }
          break;
        }

        case 'deep_research_thinking': {
          const payload = msg.payload as {
            thought?: string;
            status?: string;
            timestamp?: number;
            citationCount?: number;
          };
          if (payload?.thought) {
            thinkingCountRef.current += 1;
            const entry: ThinkingEntry = {
              id: `think_${thinkingCountRef.current}`,
              thought: payload.thought,
              status: payload.status ?? '',
              timestamp: payload.timestamp ?? Date.now(),
              citationCount: payload.citationCount ?? 0,
            };
            setThinkingLog((prev) => [entry, ...prev]);
            // 如果还在 starting 阶段，切换到 executing
            setPhase((prev) => (prev === 'starting' || prev === 'plan_review') ? 'executing' : prev);
          }
          break;
        }

        case 'deep_research_progress': {
          const payload = msg.payload as ResearchProgress;
          if (payload) {
            setProgress(payload);
            // 确保处于 executing 阶段
            setPhase((prev) => (prev === 'starting' || prev === 'plan_review') ? 'executing' : prev);
          }
          break;
        }

        case 'deep_research_report': {
          const payload = msg.payload as ResearchReport;
          if (payload) {
            setReport(payload);
            setPhase('done');
          }
          break;
        }
      }
    });

    return unsub;
  }, [onMessage]);

  /** 发起深度调研 */
  const startResearch = useCallback((topic: string, startUrl?: string, pageContext?: string) => {
    if (phase !== 'idle' && phase !== 'done' && phase !== 'error') return;

    // 重置状态
    setPhase('starting');
    setPlan(null);
    setThinkingLog([]);
    setProgress(null);
    setReport(null);
    setError(null);
    setStartedAt(Date.now());
    thinkingCountRef.current = 0;

    const sent = sendMessage('deep_research_start', {
      topic,
      startUrl,
      pageContext,
    }, createRootMeta({
      source: 'chrome-ui',
      event: 'deep_research.start',
    }));

    if (!sent) {
      setError('发送调研请求失败，请检查连接状态');
      setPhase('error');
    }
  }, [phase, sendMessage]);

  /** 确认计划（可选附带编辑后的计划） */
  const confirmPlan = useCallback((editedPlan?: { subQuestions?: SubQuestion[]; searchStrategies?: SearchStrategy[] }) => {
    const planPayload: Record<string, unknown> = { confirmed: true };

    if (editedPlan) {
      planPayload.editedPlan = {
        subQuestions: editedPlan.subQuestions?.map((sq) => ({ id: sq.id, question: sq.question })),
        searchStrategies: editedPlan.searchStrategies?.map((s) => ({ query: s.query, rationale: s.rationale })),
      };
    }

    sendMessage('deep_research_plan_confirm', planPayload, createRootMeta({
      source: 'chrome-ui',
      event: 'deep_research.plan_confirm',
    }));

    setPhase('executing');
  }, [sendMessage]);

  /** 拒绝计划 */
  const rejectPlan = useCallback(() => {
    sendMessage('deep_research_plan_confirm', { confirmed: false }, createRootMeta({
      source: 'chrome-ui',
      event: 'deep_research.plan_reject',
    }));
    setPhase('idle');
    setPlan(null);
  }, [sendMessage]);

  /** 重置到 idle 状态 */
  const reset = useCallback(() => {
    setPhase('idle');
    setPlan(null);
    setThinkingLog([]);
    setProgress(null);
    setReport(null);
    setError(null);
    setStartedAt(null);
    thinkingCountRef.current = 0;
  }, []);

  return {
    phase,
    plan,
    thinkingLog,
    progress,
    report,
    error,
    startedAt,
    startResearch,
    confirmPlan,
    rejectPlan,
    reset,
  };
}
