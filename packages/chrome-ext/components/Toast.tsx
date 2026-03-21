// Toast.tsx — 非阻塞 Toast 通知组件：固定在右上角，支持多条堆叠 + 操作按钮 + 自动消失动画
// 四种类型：success（绿色）/ error（红色）/ warning（黄色）/ info（蓝色）
import React, { useEffect, useState } from 'react';
import type { ToastItem } from '../hooks/useToast';

/** Toast 容器 Props */
export interface ToastContainerProps {
  /** Toast 队列（来自 useToast hook） */
  toasts: ToastItem[];
  /** 手动关闭回调 */
  onDismiss: (id: string) => void;
}

/** 单条 Toast Props */
interface ToastItemProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

/** 类型对应的样式配置 */
const TOAST_STYLES: Record<ToastItem['type'], { bg: string; border: string; icon: string; iconColor: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'M5 13l4 4L19 7',
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'M6 18L18 6M6 6l12 12',
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'M12 9v2m0 4h.01M12 2L2 20h20L12 2z',
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z',
    iconColor: 'text-blue-500',
  },
};

/** 单条 Toast 渲染（带入场/退场动画） */
function ToastItemComponent({ toast, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  const style = TOAST_STYLES[toast.type];

  // 入场动画
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // 等待退场动画完成后再移除
    setTimeout(() => onDismiss(toast.id), 200);
  };

  return (
    <div
      className={`
        flex items-start gap-2 px-3 py-2.5 rounded-lg border shadow-lg max-w-[320px]
        ${style.bg} ${style.border}
        transition-all duration-200 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      {/* 类型图标 */}
      <svg
        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${style.iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={style.icon} />
      </svg>

      {/* 内容区域 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-700 break-words">{toast.message}</p>

        {/* 操作按钮（如重试） */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              handleDismiss();
            }}
            className="mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* 关闭按钮 */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
        title="关闭"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Toast 容器组件
 *
 * 固定在右上角（z-[100]），上下堆叠渲染多条 Toast。
 * 通过 useToast hook 管理 toast 队列。
 */
export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-2 right-2 z-[100] flex flex-col gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItemComponent key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
