// llm-request-collector.ts — LLM 请求细节采集模块
// 职责：在 lm-service / agent-loop / message-handler 链路中采集
//       model / systemPrompt / messages / timing / response 完整数据，
//       供后续通过 WebSocket 推送到 Chrome 侧下载为 JSON 调试文件

/**
 * 单条对话消息记录（序列化友好，不依赖 vscode 类型）
 */
export interface LlmMessageRecord {
  /** 角色：user / assistant */
  role: 'user' | 'assistant';
  /** 消息文本内容 */
  text: string;
}

/**
 * Agent 模式下的单步执行记录
 */
export interface LlmAgentStepRecord {
  step: number;
  type: 'think' | 'act' | 'observe';
  content: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
}

/**
 * 请求耗时信息
 */
export interface LlmTimingInfo {
  /** 请求开始时间 ISO 字符串 */
  startTime: string;
  /** 请求结束时间 ISO 字符串（未结束时为空） */
  endTime: string;
  /** 总耗时毫秒（未结束时为 0） */
  durationMs: number;
}

/**
 * LLM 请求完整细节数据结构
 * 包含一次 chat 或 agent 请求的全部调试信息
 */
export interface LlmRequestDetail {
  /** 唯一请求 ID */
  id: string;
  /** 请求模式：stream = 普通流式对话, agent = AgentLoop 模式 */
  mode: 'stream' | 'agent';
  /** 使用的模型标识 */
  model: string;
  /** 系统提示词 */
  systemPrompt: string;
  /** 发送给 LLM 的完整消息列表 */
  messages: LlmMessageRecord[];
  /** 耗时信息 */
  timing: LlmTimingInfo;
  /** LLM 最终响应文本 */
  response: string;
  /** Agent 模式下的执行步骤记录（stream 模式为空数组） */
  agentSteps: LlmAgentStepRecord[];
  /** 错误信息（无错误时为空字符串） */
  error: string;
  /** 是否已被取消 */
  cancelled: boolean;
}

/**
 * LlmRequestCollector 负责采集每次 LLM 调用的完整链路数据。
 *
 * 使用流程：
 * 1. startRequest() — 开始采集，返回唯一 id
 * 2. addMessage() / addAgentStep() — 追加中间数据
 * 3. endRequest() — 结束采集，记录响应和耗时
 * 4. getDetail(id) — 获取完整细节对象
 *
 * 线程安全：通过 Map 隔离不同请求，每个请求独立采集。
 * 内存控制：环形缓冲淘汰策略，保留最近 MAX_ENTRIES 条记录，自动淘汰最旧的。
 * Disposal guard：dispose 后拒绝新增请求。
 */
export class LlmRequestCollector {
  /** 环形缓冲最大条目数（超出自动淘汰最旧记录） */
  static readonly MAX_ENTRIES = 50;

  /** 是否已被释放 */
  private _disposed = false;

  /** 所有采集中 / 已完成的请求 */
  private readonly details = new Map<string, LlmRequestDetail>();

  /** 按插入顺序维护的 ID 列表（用于淘汰） */
  private readonly idOrder: string[] = [];

  /** 自增计数器用于生成唯一 ID */
  private counter = 0;

  /**
   * 开始采集一次新的 LLM 请求
   * @param mode 请求模式
   * @param model 模型标识
   * @param systemPrompt 系统提示词
   * @returns 唯一请求 ID
   */
  startRequest(
    mode: 'stream' | 'agent',
    model: string,
    systemPrompt: string,
  ): string {
    if (this._disposed) {
      // disposal guard：已释放后不接受新请求，返回空 ID
      return '';
    }

    this.counter++;
    const id = `llm_${Date.now()}_${this.counter}`;

    const detail: LlmRequestDetail = {
      id,
      mode,
      model,
      systemPrompt,
      messages: [],
      timing: {
        startTime: new Date().toISOString(),
        endTime: '',
        durationMs: 0,
      },
      response: '',
      agentSteps: [],
      error: '',
      cancelled: false,
    };

    this.details.set(id, detail);
    this.idOrder.push(id);

    // 淘汰最旧记录
    this.evict();

    return id;
  }

  /**
   * 追加一条消息记录
   * @param id 请求 ID
   * @param role 角色
   * @param text 消息文本
   */
  addMessage(id: string, role: 'user' | 'assistant', text: string): void {
    const detail = this.details.get(id);
    if (detail) {
      detail.messages.push({ role, text });
    }
  }

  /**
   * 追加 Agent 步骤记录（仅 agent 模式使用）
   * @param id 请求 ID
   * @param step 步骤记录
   */
  addAgentStep(id: string, step: LlmAgentStepRecord): void {
    const detail = this.details.get(id);
    if (detail) {
      detail.agentSteps.push(step);
    }
  }

  /**
   * 结束采集，记录响应文本和耗时
   * @param id 请求 ID
   * @param response LLM 最终响应文本
   * @param error 错误信息（可选）
   * @param cancelled 是否被取消（可选）
   */
  endRequest(
    id: string,
    response: string,
    error?: string,
    cancelled?: boolean,
  ): void {
    const detail = this.details.get(id);
    if (detail) {
      detail.response = response;
      detail.error = error ?? '';
      detail.cancelled = cancelled ?? false;

      const endTime = new Date();
      detail.timing.endTime = endTime.toISOString();
      detail.timing.durationMs =
        endTime.getTime() - new Date(detail.timing.startTime).getTime();
    }
  }

  /**
   * 获取指定请求的完整细节
   * @param id 请求 ID
   * @returns 细节对象或 undefined
   */
  getDetail(id: string): LlmRequestDetail | undefined {
    return this.details.get(id);
  }

  /**
   * 获取最近一条请求细节
   */
  getLatest(): LlmRequestDetail | undefined {
    if (this.idOrder.length === 0) {
      return undefined;
    }
    const latestId = this.idOrder[this.idOrder.length - 1];
    return this.details.get(latestId);
  }

  /**
   * 获取所有已完成的请求 ID（按时间倒序）
   */
  getAllIds(): string[] {
    return [...this.idOrder].reverse();
  }

  /**
   * 清空所有采集数据
   */
  clear(): void {
    this.details.clear();
    this.idOrder.length = 0;
  }

  /**
   * 释放采集器，拒绝后续新增请求
   */
  dispose(): void {
    this._disposed = true;
    this.clear();
  }

  /**
   * 是否已被释放
   */
  get disposed(): boolean {
    return this._disposed;
  }

  /**
   * 环形缓冲淘汰：超出 MAX_ENTRIES 时删除最旧记录
   */
  private evict(): void {
    while (this.idOrder.length > LlmRequestCollector.MAX_ENTRIES) {
      const oldId = this.idOrder.shift();
      if (oldId) {
        this.details.delete(oldId);
      }
    }
  }
}
