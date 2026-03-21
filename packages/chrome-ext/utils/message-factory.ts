// message-factory.ts — 消息创建工厂函数，消除 useChat 中重复的消息对象构建代码
import type { AgentStep } from '../components/AgentStepView';

/** 聊天消息角色类型 */
export type MessageRole = 'user' | 'assistant';

/** 聊天消息 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  /** Agent ReAct 循环步骤（仅 agent 模式消息） */
  steps?: AgentStep[];
  /** 是否为 Agent 模式消息（使用 ReAct 循环的对话） */
  isAgentMode?: boolean;
}

/**
 * 创建聊天消息对象
 *
 * 统一消息创建逻辑：自动生成 UUID、填充时间戳，避免散落在各处的重复代码。
 *
 * @param role - 消息角色（user / assistant）
 * @param content - 消息内容
 * @param options - 可选：isAgentMode、steps
 * @returns 完整的 Message 对象
 */
export function createMessage(
  role: MessageRole,
  content: string,
  options?: { isAgentMode?: boolean; steps?: AgentStep[] },
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
    ...(options?.isAgentMode !== undefined && { isAgentMode: options.isAgentMode }),
    ...(options?.steps && { steps: options.steps }),
  };
}
