// App.tsx — Side Panel 主组件，纯 UI 渲染层，所有逻辑由 Hook 管理
// 集成 ConversationList 侧栏实现多会话管理（左侧抽屉式布局）
// 空会话时显示 WelcomeScreen 引导页
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ChatInput from '../../components/ChatInput';
import ModelSelector, { type ModelInfo } from '../../components/ModelSelector';
import MessageBubble from '../../components/MessageBubble';
import TypingIndicator from '../../components/TypingIndicator';
import ConversationList from '../../components/ConversationList';
import WelcomeScreen from '../../components/WelcomeScreen';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useChat } from '../../hooks/useChat';
import { usePageContext } from '../../hooks/usePageContext';
import type { BridgeMessage } from '../../src/ws-client';

/** WebSocket 服务端地址（VSCode 插件侧） */
const WS_URL = 'ws://localhost:7777';

export default function App() {
  // --- Hooks ---
  const { isConnected, connectionState, sendMessage, onMessage } = useWebSocket(WS_URL);
  const {
    messages,
    isStreaming,
    conversationId,
    conversations,
    handleSendMessage: chatSend,
    handleCancel,
    handleChatMessage,
    resetStreamingState,
    createNewConversation,
    switchConversation,
    deleteConversation,
  } = useChat({ sendMessage });
  const { pageContext } = usePageContext();

  // --- 模型选择状态 ---
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);
  const [modelsLoading, setModelsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 侧栏抽屉状态 ---
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 注册 WebSocket 消息处理
  // 注意：tool_execute / tool_result 消息由 useWebSocket 内部的 tool-bridge 自动处理，
  //       不在此处处理，不阻塞聊天 UI 渲染
  useEffect(() => {
    const unsub = onMessage((msg: BridgeMessage) => {
      // tool_execute 由 useWebSocket 内的 tool-bridge 处理，tool_result 由 VSCode 侧处理
      // 这里只处理聊天相关消息
      if (msg.type === 'tool_execute' || msg.type === 'tool_result') {
        return;
      }

      handleChatMessage(msg);
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

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModelId(modelId);
    sendMessage('select_model', { modelId });
  }, [sendMessage]);

  const handleSendMessage = useCallback((content: string) => {
    chatSend(content, pageContext);
  }, [chatSend, pageContext]);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // --- 斜杠命令回调 ---
  /** 清空当前会话（/clear 命令 + Cmd+L 快捷键） */
  const handleClearConversation = useCallback(() => {
    if (isStreaming) return;
    createNewConversation();
  }, [isStreaming, createNewConversation]);

  /** 打开/聚焦模型选择器（/models 命令） */
  const handleToggleModels = useCallback(() => {
    const modelSelector = document.getElementById('model-selector');
    if (modelSelector) {
      modelSelector.focus();
      // 触发下拉展开（模拟点击）
      if (modelSelector instanceof HTMLSelectElement) {
        modelSelector.click();
      }
    }
  }, []);

  /** 提取用户消息历史（供 ChatInput ArrowUp 使用） */
  const userMessages = useMemo(
    () => messages.filter((m) => m.role === 'user').map((m) => m.content),
    [messages],
  );

  /**
   * 重新生成指定 assistant 消息：找到该消息之前最近的 user 消息并重发
   */
  const handleRegenerate = useCallback((assistantMsgIndex: number) => {
    if (isStreaming) return;
    // 向前搜索最近的 user 消息
    for (let i = assistantMsgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        handleSendMessage(messages[i].content);
        return;
      }
    }
  }, [isStreaming, messages, handleSendMessage]);

  // --- UI 渲染 ---
  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      {/* 侧栏遮罩层（点击关闭） */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* 会话列表侧栏（左侧抽屉） */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] shadow-lg transform transition-transform duration-250 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={conversationId}
          onNewConversation={createNewConversation}
          onSelectConversation={switchConversation}
          onDeleteConversation={deleteConversation}
          onClose={closeSidebar}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* 侧栏切换按钮（汉堡菜单） */}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="会话列表"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Browser Agent</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* 新建会话快捷按钮 */}
          <button
            onClick={createNewConversation}
            className="p-1 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="新建会话"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <span
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-400'}`}
            title={isConnected ? '已连接' : '未连接'}
          />
        </div>
      </header>

      {/* Model selector */}
      <ModelSelector models={models} selectedModelId={selectedModelId} onSelect={handleModelSelect} disabled={!isConnected} loading={modelsLoading} />

      {/* Page context bar */}
      {pageContext.url && (
        <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500 truncate">
          {pageContext.title || pageContext.url}
          {pageContext.selectedText && (
            <span className="ml-2 text-blue-500">(已选中 {pageContext.selectedText.length} 字)</span>
          )}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && !isStreaming ? (
          <WelcomeScreen onSendPrompt={handleSendMessage} />
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                steps={msg.steps}
                isAgentMode={msg.isAgentMode}
                isRunning={isStreaming && msg.isAgentMode && msg.id === messages[messages.length - 1]?.id}
                onRegenerate={
                  msg.role === 'assistant' && !isStreaming
                    ? () => handleRegenerate(index)
                    : undefined
                }
              />
            ))}
            {isStreaming && (() => {
              const lastMsg = messages[messages.length - 1];
              return (!lastMsg || lastMsg.role !== 'assistant' || lastMsg.content === '') ? <TypingIndicator /> : null;
            })()}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick action buttons / Stop button */}
      <div className="flex gap-2 px-4 py-2 border-t border-gray-100">
        {isStreaming ? (
          <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none" />
            </svg>
            停止生成
          </button>
        ) : (
          <>
            <button onClick={() => handleQuickAction('探索此页')} className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">探索此页</button>
            <button onClick={() => handleQuickAction('生成报告')} className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">生成报告</button>
          </>
        )}
      </div>

      {/* Chat input — 斜杠命令 + 快捷键 + 输入历史 */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isStreaming}
        onNewConversation={createNewConversation}
        onClearConversation={handleClearConversation}
        onToggleModels={handleToggleModels}
        userMessages={userMessages}
      />
    </div>
  );
}
