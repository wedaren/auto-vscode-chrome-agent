// message-factory.ts — 消息创建工厂函数，消除 useChat 中重复的消息对象构建代码
// 支持消息发送状态跟踪（sending / sent / failed），用于 UI 展示和重试机制
import type { AgentStep } from '../components/AgentStepView';

/** 聊天消息角色类型 */
export type MessageRole = 'user' | 'assistant';

/** 消息发送状态：sending=发送中 sent=已发送 failed=发送失败 */
export type MessageStatus = 'sending' | 'sent' | 'failed';

/** 聊天消息 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  /** 消息发送状态（仅 user 消息使用，assistant 消息始终为 sent） */
  status?: MessageStatus;
  /** Agent ReAct 循环步骤（仅 agent 模式消息） */
  steps?: AgentStep[];
  /** 是否为 Agent 模式消息（使用 ReAct 循环的对话） */
  isAgentMode?: boolean;
  /** LLM 请求完整细节数据（由 VSCode 侧 LlmRequestCollector 采集，通过 WebSocket 推送） */
  llmDetail?: Record<string, unknown>;
}

/**
 * 创建聊天消息对象
 *
 * 统一消息创建逻辑：自动生成 UUID、填充时间戳，避免散落在各处的重复代码。
 *
 * @param role - 消息角色（user / assistant）
 * @param content - 消息内容
 * @param options - 可选：isAgentMode、steps、status
 * @returns 完整的 Message 对象
 */
export function createMessage(
  role: MessageRole,
  content: string,
  options?: { isAgentMode?: boolean; steps?: AgentStep[]; status?: MessageStatus; llmDetail?: Record<string, unknown> },
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
    ...(options?.status !== undefined && { status: options.status }),
    ...(options?.isAgentMode !== undefined && { isAgentMode: options.isAgentMode }),
    ...(options?.steps && { steps: options.steps }),
    ...(options?.llmDetail && { llmDetail: options.llmDetail }),
  };
}
