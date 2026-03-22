// tool-bridge.ts — WebSocket 工具调用桥接器
// 职责：监听 VSCode 发来的 tool_execute 消息，将工具调用转发到 background EXECUTE_ACTION，
//       将执行结果封装为 tool_result 消息发回 VSCode 侧。
//
// === 工具调用协议（tool_execute / tool_result） ===
//
// VSCode → Chrome:
//   { type: 'tool_execute', payload: { requestId, toolName, toolArgs }, sessionId }
//     requestId: string  — 唯一请求 ID，用于匹配响应
//     toolName:  string  — 工具名称（对应 BrowserAction.type，如 'click'/'type'/'scroll' 等）
//     toolArgs:  object  — 工具参数（对应 BrowserAction 的各字段，如 selector/value/url 等）
//
// Chrome → VSCode:
//   { type: 'tool_result', payload: { requestId, success, data, error }, sessionId }
//     requestId: string  — 与 tool_execute 中的 requestId 一致
//     success:   boolean — 执行是否成功
//     data:      unknown — 成功时的返回数据
//     error:     string  — 失败时的错误信息
//

import type { BridgeMessage } from '../src/ws-client';
import type { BrowserAction, ActionResult } from './action-executor';

/** tool_execute 消息的 payload 结构 */
export interface ToolExecutePayload {
  /** 唯一请求 ID，用于 VSCode 侧匹配 tool_result 响应 */
  requestId: string;
  /** 工具名称，对应 BrowserAction.type（click/type/scroll/navigate 等） */
  toolName: string;
  /** 工具参数，对应 BrowserAction 的各字段 */
  toolArgs: Record<string, unknown>;
  /** 可选的目标 Tab ID，Skill 执行期间锁定目标页，防止 tab 切换导致操作漂移 */
  targetTabId?: number;
}

/** tool_result 消息的 payload 结构 */
export interface ToolResultPayload {
  /** 与 tool_execute 中的 requestId 一致 */
  requestId: string;
  /** 执行是否成功 */
  success: boolean;
  /** 成功时的返回数据 */
  data?: unknown;
  /** 失败时的错误信息 */
  error?: string;
}

/**
 * 将 toolName + toolArgs 转换为 BrowserAction
 * toolName 直接对应 BrowserAction.type，toolArgs 展开为 BrowserAction 的字段
 *
 * 兼容映射：LLM 常见参数误用自动修正
 * - type 操作：LLM 可能传 { text: "xxx" } 而非 { value: "xxx" }，自动映射 text→value
 */
function toAction(toolName: string, toolArgs: Record<string, unknown>): { action: BrowserAction; targetTabId?: number } {
  const correctedArgs = { ...toolArgs };

  // 提取 targetTabId（如果存在于 toolArgs 中），不传递给 BrowserAction
  let targetTabId: number | undefined;
  if ('targetTabId' in correctedArgs && typeof correctedArgs.targetTabId === 'number') {
    targetTabId = correctedArgs.targetTabId;
    delete correctedArgs.targetTabId;
  }

  // 兼容映射：type 操作中 LLM 常把 value 误写为 text
  if (toolName === 'type' && correctedArgs.text && !correctedArgs.value) {
    console.warn(
      `[ToolBridge] 自动修正: type 操作的 text→value 参数映射 (text="${correctedArgs.text}")`,
    );
    correctedArgs.value = correctedArgs.text;
    delete correctedArgs.text;
  }

  const action = {
    type: toolName as BrowserAction['type'],
    ...correctedArgs,
  } as BrowserAction;

  return { action, targetTabId };
}

/**
 * 通过 chrome.runtime.sendMessage 将 BrowserAction 发送到 background script 执行
 * background 会根据 action.type 选择在 background 或 content script 中执行
 * @param action 要执行的浏览器操作
 * @param targetTabId 可选的目标 Tab ID，存在时 background 直接路由到该 tab
 */
async function executeViaBackground(action: BrowserAction, targetTabId?: number): Promise<ActionResult> {
  return new Promise<ActionResult>((resolve) => {
    try {
      // 当 targetTabId 存在时，附在 EXECUTE_ACTION payload 中供 background 路由到指定 tab
      const payload: Record<string, unknown> = { ...action };
      if (targetTabId !== undefined) {
        payload.targetTabId = targetTabId;
      }
      chrome.runtime.sendMessage(
        { type: 'EXECUTE_ACTION', payload },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({
              success: false,
              error: `chrome.runtime 通信失败: ${chrome.runtime.lastError.message}`,
            });
            return;
          }
          if (response && response.type === 'ACTION_RESULT') {
            resolve(response.payload as ActionResult);
          } else {
            resolve({
              success: false,
              error: `未收到有效的 ACTION_RESULT 响应`,
            });
          }
        },
      );
    } catch (err) {
      resolve({
        success: false,
        error: `发送 EXECUTE_ACTION 异常: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  });
}

/**
 * 处理单条 tool_execute 消息
 *
 * @param msg - 收到的 BridgeMessage（type === 'tool_execute'）
 * @param sendMessage - 发送 BridgeMessage 回 VSCode 的函数
 */
export async function handleToolExecute(
  msg: BridgeMessage,
  sendMessage: (type: string, payload: unknown) => boolean,
): Promise<void> {
  const payload = msg.payload as ToolExecutePayload;
  const { requestId, toolName, toolArgs, targetTabId: payloadTargetTabId } = payload;

  console.log(`[ToolBridge] 收到 tool_execute: requestId=${requestId}, tool=${toolName}${payloadTargetTabId !== undefined ? `, targetTabId=${payloadTargetTabId}` : ''}`);

  let result: ToolResultPayload;

  try {
    // 转换为 BrowserAction 并提取 targetTabId（优先使用 payload 级别的 targetTabId，其次从 toolArgs 中提取）
    const { action, targetTabId: argsTargetTabId } = toAction(toolName, toolArgs || {});
    const targetTabId = payloadTargetTabId ?? argsTargetTabId;
    const actionResult = await executeViaBackground(action, targetTabId);

    result = {
      requestId,
      success: actionResult.success,
      data: actionResult.data,
      error: actionResult.error,
    };
  } catch (err) {
    result = {
      requestId,
      success: false,
      error: `工具执行异常: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  console.log(`[ToolBridge] 发送 tool_result: requestId=${requestId}, success=${result.success}`);

  // 发送 tool_result 回 VSCode 侧
  sendMessage('tool_result', result);
}

/**
 * 创建 tool_execute 消息过滤器
 * 用于在 useWebSocket 的 onMessage 中注册，仅处理 tool_execute 类型消息，不阻塞聊天 UI
 *
 * @param sendMessage - useWebSocket 提供的发送函数
 * @returns 消息处理回调（可注册到 onMessage）
 */
export function createToolBridgeHandler(
  sendMessage: (type: string, payload: unknown) => boolean,
): (msg: BridgeMessage) => void {
  return (msg: BridgeMessage) => {
    if (msg.type === 'tool_execute') {
      // 异步执行，不阻塞消息处理链（不 await）
      void handleToolExecute(msg, sendMessage);
    }
  };
}
