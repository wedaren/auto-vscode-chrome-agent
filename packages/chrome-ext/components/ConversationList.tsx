// ConversationList.tsx — 会话列表侧栏组件：展示所有会话，支持新建/切换/删除
// 用于多会话管理，左侧抽屉式布局，由 App.tsx 控制显示/隐藏
import React, { useState, useRef, useCallback } from 'react';
import type { ConversationMeta } from '../hooks/useChatStorage';

/** ConversationList 组件 Props */
interface ConversationListProps {
  /** 会话元数据列表（按 updatedAt 降序） */
  conversations: ConversationMeta[];
  /** 当前活跃会话 ID */
  activeConversationId: string;
  /** 新建会话回调 */
  onNewConversation: () => void;
  /** 切换会话回调 */
  onSelectConversation: (id: string) => void;
  /** 删除会话回调 */
  onDeleteConversation: (id: string) => void;
  /** 关闭侧栏回调 */
  onClose: () => void;
}

/**
 * 格式化相对时间：将时间戳转为"刚刚/N分钟前/N小时前/N天前"
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return new Date(timestamp).toLocaleDateString('zh-CN');
}

/**
 * 单个会话列表项（支持左滑删除 / 按钮删除）
 */
function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
}: {
  conversation: ConversationMeta;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);
  const touchStartXRef = useRef(0);
  const touchDeltaRef = useRef(0);

  // 触摸滑动检测（移动端左滑删除）
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaRef.current = touchStartXRef.current - e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    // 左滑超过 60px 显示删除按钮
    if (touchDeltaRef.current > 60) {
      setShowDelete(true);
    } else if (touchDeltaRef.current < -30) {
      setShowDelete(false);
    }
  }, []);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  return (
    <div
      className="relative group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-150 ${
          isActive
            ? 'bg-blue-50 border border-blue-200'
            : 'hover:bg-gray-50 border border-transparent'
        }`}
      >
        {/* 会话标题 */}
        <div className={`text-sm truncate ${isActive ? 'text-blue-700 font-medium' : 'text-gray-800'}`}>
          {conversation.title || '新对话'}
        </div>
        {/* 底部信息：时间 + 消息数 */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{formatRelativeTime(conversation.updatedAt)}</span>
          <span className="text-xs text-gray-400">{conversation.messageCount} 条消息</span>
        </div>
      </button>

      {/* 删除按钮：hover 或左滑显示 */}
      <button
        onClick={handleDeleteClick}
        className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 ${
          showDelete ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        title="删除会话"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

/**
 * 会话列表侧栏组件
 *
 * 展示所有历史会话的标题、时间、消息数预览；
 * 支持新建/切换/删除会话；当前活跃会话高亮；
 * 空列表时显示引导文案。
 */
export default function ConversationList({
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onClose,
}: ConversationListProps) {
  const handleNew = useCallback(() => {
    onNewConversation();
    onClose();
  }, [onNewConversation, onClose]);

  const handleSelect = useCallback((id: string) => {
    onSelectConversation(id);
    onClose();
  }, [onSelectConversation, onClose]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 侧栏 Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">会话列表</h2>
        <div className="flex items-center gap-1">
          {/* 新建会话按钮 */}
          <button
            onClick={handleNew}
            className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="新建会话"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          {/* 关闭侧栏按钮 */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="关闭"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 会话列表 */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {conversations.length === 0 ? (
          /* 空列表引导文案 */
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm text-gray-400 mb-1">还没有会话</p>
            <p className="text-xs text-gray-300">点击上方 + 按钮开始你的第一次对话</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => handleSelect(conv.id)}
              onDelete={() => onDeleteConversation(conv.id)}
            />
          ))
        )}
      </div>

      {/* 底部统计 */}
      {conversations.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 text-center">
          共 {conversations.length} 个会话
        </div>
      )}
    </div>
  );
}
