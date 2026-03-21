// App.tsx — Side Panel 主组件，纯 UI 渲染层，所有逻辑由 Hook 管理
// 集成 ConversationList 侧栏实现多会话管理（左侧抽屉式布局）
// 顶部 Tab 切换 Chat / Skills 两个视图
// 空会话时显示 WelcomeScreen 引导页
// 集成 ErrorBoundary 组件 + 全局错误拦截层（window.onerror / unhandledrejection）
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ChatInput from '../../components/ChatInput';
import ModelSelector, { type ModelInfo } from '../../components/ModelSelector';
import MessageBubble from '../../components/MessageBubble';
import TypingIndicator from '../../components/TypingIndicator';
import ConversationList from '../../components/ConversationList';
import WelcomeScreen from '../../components/WelcomeScreen';
import SkillPanel from '../../components/SkillPanel';
import ToastContainer from '../../components/Toast';
import ErrorBoundary, { type ErrorLogEntry } from '../../components/ErrorBoundary';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useChat } from '../../hooks/useChat';
import { usePageContext } from '../../hooks/usePageContext';
import { useToast } from '../../hooks/useToast';
import type { BridgeMessage } from '../../src/ws-client';

/** 顶部 Tab 类型 */
type ActiveTab = 'chat' | 'skills';

/** WebSocket 服务端地址（VSCode 插件侧） */
const WS_URL = 'ws://localhost:7777';

/** 错误日志最大条目数 */
const MAX_ERROR_LOG_SIZE = 50;

/**
 * AppRoot — 顶层包装组件，提供 ErrorBoundary + 全局错误拦截
 * 拦截 window.onerror 和 unhandledrejection 异步错误并记录到 errorLog 状态
 * ErrorBoundary 捕获组件渲染错误，崩溃时显示 fallback UI
 * 恢复后保留当前会话 ID 和已持久化的消息
 */
export default function AppRoot() {
  const [errorLog, setErrorLog] = useState<ErrorLogEntry[]>([]);

  /** 添加错误日志条目（限制最大条目数） */
  const addErrorLog = useCallback((entry: ErrorLogEntry) => {
    setErrorLog((prev) => {
      const next = [entry, ...prev];
      return next.length > MAX_ERROR_LOG_SIZE ? next.slice(0, MAX_ERROR_LOG_SIZE) : next;
    });
    console.warn('[AppRoot] 错误已记录:', entry.source, entry.message);
  }, []);

  // 全局错误拦截：window.onerror（同步错误 / 资源加载错误）
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      addErrorLog({
        timestamp: Date.now(),
        source: 'global',
        message: event.message || '未知全局错误',
        stack: event.error?.stack,
      });
    };
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [addErrorLog]);

  // 全局错误拦截：unhandledrejection（未捕获的 Promise 拒绝）
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
            ? reason
            : '未捕获的 Promise 拒绝';
      const stack = reason instanceof Error ? reason.stack : undefined;

      addErrorLog({
        timestamp: Date.now(),
        source: 'promise',
        message,
        stack,
      });
    };
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, [addErrorLog]);

  return (
    <ErrorBoundary onError={addErrorLog}>
      <AppContent errorLog={errorLog} />
    </ErrorBoundary>
  );
}

/** AppContent Props（接收 errorLog 供未来 Debug 面板使用） */
interface AppContentProps {
  errorLog: ErrorLogEntry[];
}

function AppContent({ errorLog: _errorLog }: AppContentProps) {
  // --- Hooks ---
  const { isConnected, connectionState, sendMessage, onMessage } = useWebSocket(WS_URL);
  const { toasts, showToast, dismissToast } = useToast();

  /** Toast 回调桥接：将 useChat 内部错误通过 Toast 显示 */
  const handleChatToast = useCallback(
    (options: { type: 'success' | 'error' | 'warning' | 'info'; message: string; action?: { label: string; onClick: () => void } }) => {
      showToast(options);
    },
    [showToast],
  );

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
    retryMessage,
  } = useChat({ sendMessage, onToast: handleChatToast });
  const { pageContext } = usePageContext();

  // --- 模型选择状态 ---
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);
  const [modelsLoading, setModelsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 侧栏抽屉状态 ---
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Tab 切换状态 ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

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

  // 连接状态变化：连接时请求模型列表，断连时恢复流式状态 + Toast 提示
  useEffect(() => {
    if (connectionState === 'connected') {
      setModelsLoading(true);
      sendMessage('list_models', null);
      showToast({ type: 'success', message: '已连接到 VSCode', duration: 2000 });
    }
    if (connectionState === 'disconnected') {
      resetStreamingState();
      showToast({ type: 'warning', message: '与 VSCode 断开连接，正在重连...' });
    }
  }, [connectionState, sendMessage, resetStreamingState, showToast]);

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
      {/* Toast 通知容器（固定在右上角） */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

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

      {/* Tab 切换栏：Chat / Skills */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </div>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
            activeTab === 'skills'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Skills
          </div>
        </button>
      </div>

      {/* ===== Chat 视图 ===== */}
      {activeTab === 'chat' && (
        <>
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
                    status={msg.status}
                    steps={msg.steps}
                    isAgentMode={msg.isAgentMode}
                    isRunning={isStreaming && msg.isAgentMode && msg.id === messages[messages.length - 1]?.id}
                    onRegenerate={
                      msg.role === 'assistant' && !isStreaming
                        ? () => handleRegenerate(index)
                        : undefined
                    }
                    onRetry={
                      msg.role === 'user' && msg.status === 'failed'
                        ? () => retryMessage(msg.id)
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
        </>
      )}

      {/* ===== Skills 视图 ===== */}
      {activeTab === 'skills' && (
        <SkillPanel
          sendMessage={sendMessage}
          onMessage={onMessage}
          isConnected={isConnected}
        />
      )}
    </div>
  );
}
