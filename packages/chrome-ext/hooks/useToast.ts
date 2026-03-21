// useToast.ts — Toast 通知系统 Hook：管理非阻塞提示消息的生命周期
// 支持 success / error / warning / info 四种类型，自动消失 + 手动关闭
import { useState, useCallback, useRef } from 'react';

/** Toast 类型 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** 单条 Toast 数据 */
export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  /** 自动关闭延时 ms（0 表示不自动关闭） */
  duration: number;
  /** 可选操作按钮 */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** showToast 配置选项 */
export interface ShowToastOptions {
  type?: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** Toast 队列最大长度 */
const MAX_TOAST_COUNT = 5;

/** 默认自动关闭延时 */
const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 3000,
  info: 4000,
  warning: 5000,
  error: 6000,
};

/**
 * Toast 通知系统 Hook
 *
 * 提供 showToast / dismissToast 方法，管理 toast 队列。
 * 支持带操作按钮的 toast（如"重试"按钮）。
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /** 移除指定 toast */
  const dismissToast = useCallback((id: string) => {
    // 清除自动关闭定时器
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /** 显示 toast 通知 */
  const showToast = useCallback(
    (options: ShowToastOptions) => {
      const type = options.type ?? 'info';
      const duration = options.duration ?? DEFAULT_DURATION[type];

      const toast: ToastItem = {
        id: crypto.randomUUID(),
        type,
        message: options.message,
        duration,
        action: options.action,
      };

      setToasts((prev) => {
        // 超过最大数量时移除最早的
        const next = [...prev, toast];
        if (next.length > MAX_TOAST_COUNT) {
          const removed = next.shift();
          if (removed) {
            const timer = timersRef.current.get(removed.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(removed.id);
            }
          }
        }
        return next;
      });

      // 自动关闭
      if (duration > 0) {
        const timer = setTimeout(() => {
          dismissToast(toast.id);
        }, duration);
        timersRef.current.set(toast.id, timer);
      }

      return toast.id;
    },
    [dismissToast],
  );

  return {
    toasts,
    showToast,
    dismissToast,
  };
}
