// App.tsx — Side Panel 主组件，包含对话界面、WebSocket 通信和快捷按钮
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatInput from '../../components/ChatInput';
import { WsClient, type BridgeMessage, type ConnectionState } from '../../src/ws-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/** WebSocket 服务端地址（VSCode 插件侧） */
const WS_URL = 'ws://localhost:7777';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsClientRef = useRef<WsClient | null>(null);

  // 初始化 WebSocket 客户端
  useEffect(() => {
    const client = new WsClient({ url: WS_URL });
    wsClientRef.current = client;

    // 监听连接状态
    const unsubState = client.onStateChange((state: ConnectionState) => {
      setIsConnected(state === 'connected');
    });

    // 监听服务端消息
    const unsubMsg = client.onMessage((msg: BridgeMessage) => {
      switch (msg.type) {
        case 'pong':
          console.log('[App] 收到 pong，连接确认');
          break;
        case 'chat_response': {
          const assistantMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: String(msg.payload ?? ''),
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // 通过 WebSocket 发送到 VSCode 侧
    const client = wsClientRef.current;
    if (client) {
      client.sendMessage('chat', { text: content });
    }
  }, []);

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

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            输入消息开始对话
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              msg.role === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-100 text-gray-800'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick action buttons */}
      <div className="flex gap-2 px-4 py-2 border-t border-gray-100">
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
        <button
          onClick={() => handleQuickAction('停止')}
          className="px-3 py-1.5 text-xs rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
        >
          停止
        </button>
      </div>

      {/* Chat input */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
