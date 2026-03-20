// App.tsx — Side Panel 主组件，包含对话界面、WebSocket 通信、页面上下文感知、模型选择、流式响应、停止生成和思考中指示器
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatInput from '../../components/ChatInput';
import ModelSelector, { type ModelInfo } from '../../components/ModelSelector';
import MessageBubble from '../../components/MessageBubble';
import TypingIndicator from '../../components/TypingIndicator';
import { WsClient, type BridgeMessage, type ConnectionState } from '../../src/ws-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/** 页面上下文数据 */
interface PageContext {
  url: string;
  title: string;
  selectedText: string;
}

/** WebSocket 服务端地址（VSCode 插件侧） */
const WS_URL = 'ws://localhost:7777';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext>({ url: '', title: '', selectedText: '' });
  const [isStreaming, setIsStreaming] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);
  const [modelsLoading, setModelsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsClientRef = useRef<WsClient | null>(null);
  /** 当前正在流式接收的 assistant 消息 ID */
  const streamingMsgIdRef = useRef<string | null>(null);

  /** 请求当前页面的上下文信息 */
  const fetchPageContext = useCallback(async () => {
    try {
      const response = await browser.runtime.sendMessage({ type: 'GET_PAGE_CONTEXT' });
      if (response?.payload) {
        setPageContext(response.payload as PageContext);
      }
    } catch {
      // content script 不可用时静默失败
      console.log('[App] 无法获取页面上下文');
    }
  }, []);

  // 初始化 WebSocket 客户端
  useEffect(() => {
    const client = new WsClient({ url: WS_URL });
    wsClientRef.current = client;

    // 监听连接状态，连接时自动请求模型列表，断连时恢复流式状态
    const unsubState = client.onStateChange((state: ConnectionState) => {
      setIsConnected(state === 'connected');
      if (state === 'connected') {
        setModelsLoading(true);
        client.sendMessage('list_models', null);
      }
      if (state === 'disconnected') {
        // WebSocket 断连时自动恢复 isStreaming 状态，防止 UI 锁死
        if (streamingMsgIdRef.current) {
          streamingMsgIdRef.current = null;
          setIsStreaming(false);
        }
      }
    });

    // 监听服务端消息
    const unsubMsg = client.onMessage((msg: BridgeMessage) => {
      switch (msg.type) {
        case 'pong':
          console.log('[App] 收到 pong，连接确认');
          break;
        case 'chat_response': {
          // 兼容旧式全量响应
          const assistantMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: String(msg.payload ?? ''),
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          break;
        }
        case 'chat_response_chunk': {
          // 流式响应：增量追加到当前 assistant message
          const chunkPayload = msg.payload as { text: string; done: boolean };
          const fragment = chunkPayload?.text ?? '';

          if (!streamingMsgIdRef.current) {
            // 首个 chunk：创建新的 assistant message
            const newId = crypto.randomUUID();
            streamingMsgIdRef.current = newId;
            setIsStreaming(true);
            const newMsg: Message = {
              id: newId,
              role: 'assistant',
              content: fragment,
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, newMsg]);
          } else {
            // 后续 chunk：追加到已有消息
            const targetId = streamingMsgIdRef.current;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === targetId ? { ...m, content: m.content + fragment } : m,
              ),
            );
          }
          break;
        }
        case 'chat_response_end': {
          // 流式结束：标记完成，清除流式状态
          const endPayload = msg.payload as { fullText?: string; cancelled?: boolean };
          const targetId = streamingMsgIdRef.current;

          if (targetId && typeof endPayload?.fullText === 'string') {
            // 用服务端的完整文本校正最终内容（防止丢片段，兼容空字符串场景）
            setMessages((prev) =>
              prev.map((m) =>
                m.id === targetId ? { ...m, content: endPayload.fullText! } : m,
              ),
            );
          }

          streamingMsgIdRef.current = null;
          setIsStreaming(false);
          console.log(
            '[App] 流式响应结束',
            endPayload?.cancelled ? '(已取消)' : '',
          );
          break;
        }
        case 'echo': {
          // 服务端回显消息
          const echoMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: String(msg.payload ?? ''),
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, echoMsg]);
          break;
        }
        case 'models_list': {
          // 收到可用模型列表
          const modelsList = (msg.payload as { models: ModelInfo[] })?.models ?? [];
          setModels(modelsList);
          setModelsLoading(false);
          // 如果尚未选择模型且列表非空，默认选中第一个
          if (modelsList.length > 0) {
            setSelectedModelId((prev) => prev ?? modelsList[0].id);
          }
          console.log('[App] 收到模型列表:', modelsList.length, '个模型');
          break;
        }
        default:
          console.log('[App] 未处理的消息类型:', msg.type);
      }
    });

    // 连接
    client.connect();

    return () => {
      unsubState();
      unsubMsg();
      client.dispose();
      wsClientRef.current = null;
    };
  }, []);

  // 监听来自 background 的上下文变化消息
  useEffect(() => {
    const handleMessage = (message: { type: string; payload?: PageContext }) => {
      if (
        message.type === 'PAGE_CONTEXT' ||
        message.type === 'SELECTION_CHANGED' ||
        message.type === 'TAB_CHANGED' ||
        message.type === 'TAB_UPDATED'
      ) {
        if (message.payload) {
          setPageContext(message.payload);
        }
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    // 首次加载获取上下文
    fetchPageContext();

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [fetchPageContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** 用户选择模型时，发送 select_model 消息到 VSCode 侧 */
  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModelId(modelId);
    const client = wsClientRef.current;
    if (client) {
      client.sendMessage('select_model', { modelId });
      console.log('[App] 已选择模型:', modelId);
    }
  }, []);

  /** 发送取消流式生成指令 */
  const handleCancelChat = useCallback(() => {
    const client = wsClientRef.current;
    if (client && isStreaming) {
      client.sendMessage('cancel_chat', null);
      console.log('[App] 已发送 cancel_chat');
    }
  }, [isStreaming]);

  const handleSendMessage = useCallback((content: string) => {
    // 流式生成中不允许发送新消息
    if (isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // 进入等待状态（TypingIndicator 立即显示）
    setIsStreaming(true);

    // 通过 WebSocket 发送到 VSCode 侧，附加页面上下文
    const client = wsClientRef.current;
    const sent = client
      ? client.sendMessage('chat', {
          text: content,
          context: {
            url: pageContext.url,
            title: pageContext.title,
            selectedText: pageContext.selectedText,
          },
        })
      : false;

    if (!sent) {
      // 发送失败：恢复 isStreaming 状态并显示错误提示
      setIsStreaming(false);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '\u26A0\uFE0F \u6D88\u606F\u53D1\u9001\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5 WebSocket \u8FDE\u63A5\u72B6\u6001\u3002',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  }, [pageContext, isStreaming]);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Browser Agent</h1>
        <span
          className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-400'}`}
          title={isConnected ? '已连接' : '未连接'}
        />
      </header>

      {/* Model selector */}
      <ModelSelector
        models={models}
        selectedModelId={selectedModelId}
        onSelect={handleModelSelect}
        disabled={!isConnected}
        loading={modelsLoading}
      />

      {/* Page context bar */}
      {pageContext.url && (
        <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500 truncate">
          {pageContext.title || pageContext.url}
          {pageContext.selectedText && (
            <span className="ml-2 text-blue-500">
              (已选中 {pageContext.selectedText.length} 字)
            </span>
          )}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            输入消息开始对话
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {/* 思考中指示器：isStreaming 且尚未收到 assistant 内容时显示 */}
        {isStreaming && (() => {
          const lastMsg = messages[messages.length - 1];
          // 显示条件：最后一条消息不是 assistant 或 assistant 消息内容为空
          const showIndicator = !lastMsg || lastMsg.role !== 'assistant' || lastMsg.content === '';
          return showIndicator ? <TypingIndicator /> : null;
        })()}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick action buttons / Stop button */}
      <div className="flex gap-2 px-4 py-2 border-t border-gray-100">
        {isStreaming ? (
          <button
            onClick={handleCancelChat}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none" />
            </svg>
            停止生成
          </button>
        ) : (
          <>
            <button
              onClick={() => handleQuickAction('探索此页')}
              className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              探索此页
            </button>
            <button
              onClick={() => handleQuickAction('生成报告')}
              className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              生成报告
            </button>
          </>
        )}
      </div>

      {/* Chat input */}
      <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
    </div>
  );
}
