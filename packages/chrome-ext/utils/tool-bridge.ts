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
 */
function toAction(toolName: string, toolArgs: Record<string, unknown>): BrowserAction {
  return {
    type: toolName as BrowserAction['type'],
    ...toolArgs,
  } as BrowserAction;
}

/**
 * 通过 chrome.runtime.sendMessage 将 BrowserAction 发送到 background script 执行
 * background 会根据 action.type 选择在 background 或 content script 中执行
 */
async function executeViaBackground(action: BrowserAction): Promise<ActionResult> {
  return new Promise<ActionResult>((resolve) => {
    try {
      chrome.runtime.sendMessage(
        { type: 'EXECUTE_ACTION', payload: action },
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
  const { requestId, toolName, toolArgs } = payload;

  console.log(`[ToolBridge] 收到 tool_execute: requestId=${requestId}, tool=${toolName}`);

  let result: ToolResultPayload;

  try {
    // 转换为 BrowserAction 并通过 background 执行
    const action = toAction(toolName, toolArgs || {});
    const actionResult = await executeViaBackground(action);

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
