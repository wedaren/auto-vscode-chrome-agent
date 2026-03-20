// App.tsx — Side Panel 主组件，使用 useWebSocket + useChat 自定义 Hooks 管理状态，本文件仅负责 UI 渲染和 Hook 组合
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatInput from '../../components/ChatInput';
import ModelSelector, { type ModelInfo } from '../../components/ModelSelector';
import MessageBubble from '../../components/MessageBubble';
import TypingIndicator from '../../components/TypingIndicator';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useChat } from '../../hooks/useChat';
import type { BridgeMessage } from '../../src/ws-client';

/** 页面上下文数据 */
interface PageContext {
  url: string;
  title: string;
  selectedText: string;
}

/** WebSocket 服务端地址（VSCode 插件侧） */
const WS_URL = 'ws://localhost:7777';

export default function App() {
  // --- Hooks ---
  const { isConnected, connectionState, sendMessage, onMessage } = useWebSocket(WS_URL);
  const { messages, isStreaming, handleSendMessage: chatSend, handleCancel, handleChatMessage, resetStreamingState } = useChat({ sendMessage });

  // --- 页面上下文状态（evo_v2_004 将抽为 usePageContext） ---
  const [pageContext, setPageContext] = useState<PageContext>({ url: '', title: '', selectedText: '' });

  // --- 模型选择状态 ---
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);
  const [modelsLoading, setModelsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** 请求当前页面的上下文信息 */
  const fetchPageContext = useCallback(async () => {
    try {
      const response = await browser.runtime.sendMessage({ type: 'GET_PAGE_CONTEXT' });
      if (response?.payload) {
        setPageContext(response.payload as PageContext);
      }
    } catch {
      console.log('[App] 无法获取页面上下文');
    }
  }, []);

  // 注册 WebSocket 消息处理
  useEffect(() => {
    const unsub = onMessage((msg: BridgeMessage) => {
      // 聊天相关消息委托给 useChat
      handleChatMessage(msg);

      // 其余消息在此处理
      switch (msg.type) {
        case 'pong':
          console.log('[App] 收到 pong，连接确认');
          break;
        case 'models_list': {
          const modelsList = (msg.payload as { models: ModelInfo[] })?.models ?? [];
          setModels(modelsList);
          setModelsLoading(false);
          if (modelsList.length > 0) {
            setSelectedModelId((prev) => prev ?? modelsList[0].id);
          }
          console.log('[App] 收到模型列表:', modelsList.length, '个模型');
          break;
        }
      }
    });
    return unsub;
  }, [onMessage, handleChatMessage]);

  // 连接状态变化：连接时请求模型列表，断连时恢复流式状态
  useEffect(() => {
    if (connectionState === 'connected') {
      setModelsLoading(true);
      sendMessage('list_models', null);
    }
    if (connectionState === 'disconnected') {
      resetStreamingState();
    }
  }, [connectionState, sendMessage, resetStreamingState]);

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
    fetchPageContext();
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [fetchPageContext]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** 用户选择模型 */
  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModelId(modelId);
    sendMessage('select_model', { modelId });
    console.log('[App] 已选择模型:', modelId);
  }, [sendMessage]);

  /** 发送消息（附加页面上下文） */
  const handleSendMessage = useCallback((content: string) => {
    chatSend(content, pageContext);
  }, [chatSend, pageContext]);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  // --- UI 渲染 ---
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
          const showIndicator = !lastMsg || lastMsg.role !== 'assistant' || lastMsg.content === '';
          return showIndicator ? <TypingIndicator /> : null;
        })()}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick action buttons / Stop button */}
      <div className="flex gap-2 px-4 py-2 border-t border-gray-100">
        {isStreaming ? (
          <button
            onClick={handleCancel}
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
