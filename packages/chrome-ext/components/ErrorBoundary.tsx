// ErrorBoundary.tsx — React Error Boundary 组件：捕获子组件渲染错误，防止白屏崩溃
// 显示友好的 fallback UI（错误摘要 + 重新加载按钮），恢复后保留当前会话
import React from 'react';

/** 错误日志条目 */
export interface ErrorLogEntry {
  /** 错误时间戳 */
  timestamp: number;
  /** 错误来源：render（组件渲染）/ global（window.onerror）/ promise（unhandledrejection） */
  source: 'render' | 'global' | 'promise';
  /** 错误消息 */
  message: string;
  /** 错误堆栈（可选） */
  stack?: string;
  /** 出错组件名称（仅 render 类型） */
  componentStack?: string;
}

/** ErrorBoundary Props */
interface ErrorBoundaryProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 外部错误日志回调：将错误记录到父组件的 errorLog 状态 */
  onError?: (entry: ErrorLogEntry) => void;
}

/** ErrorBoundary State */
interface ErrorBoundaryState {
  /** 是否处于错误状态 */
  hasError: boolean;
  /** 最近一次捕获的错误信息 */
  errorMessage: string;
  /** 最近一次错误堆栈 */
  errorStack: string;
  /** 恢复尝试次数（超过阈值则显示更强力的操作提示） */
  recoveryCount: number;
}

/** 最大恢复尝试次数：超过后提示刷新整个页面 */
const MAX_RECOVERY_ATTEMPTS = 3;

/**
 * React Error Boundary — 防止组件崩溃白屏
 *
 * 职责：
 * - 使用 componentDidCatch 捕获子组件树的渲染错误
 * - 显示友好的 fallback UI（错误摘要 + 恢复按钮）
 * - 点击"重新加载"重置错误状态，重新渲染子组件树
 * - 恢复后不丢失会话（状态由 hooks 管理，ErrorBoundary 仅重置自身 hasError 标志）
 * - 多次恢复失败时提示刷新整个页面
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      errorStack: '',
      recoveryCount: 0,
    };
  }

  /** 静态方法：从错误派生新状态 */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      errorMessage: error.message || '未知错误',
      errorStack: error.stack || '',
    };
  }

  /** 组件捕获到错误时调用 */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary] 组件渲染错误:', error, errorInfo);

    // 通知父组件记录错误日志
    this.props.onError?.({
      timestamp: Date.now(),
      source: 'render',
      message: error.message || '未知渲染错误',
      stack: error.stack,
      componentStack: errorInfo.componentStack || undefined,
    });
  }

  /** 尝试恢复：重置错误状态，重新渲染子组件树 */
  handleRecover = (): void => {
    this.setState((prev) => ({
      hasError: false,
      errorMessage: '',
      errorStack: '',
      recoveryCount: prev.recoveryCount + 1,
    }));
  };

  /** 强制刷新整个页面 */
  handleForceReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { errorMessage, errorStack, recoveryCount } = this.state;
    const exceedMaxRetries = recoveryCount >= MAX_RECOVERY_ATTEMPTS;

    // --- Fallback UI ---
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white px-6 py-8">
        {/* 错误图标 */}
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-50">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* 标题 */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">页面遇到问题</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          组件渲染时发生错误，但你的会话数据已安全保存。
        </p>

        {/* 错误摘要 */}
        <div className="w-full max-w-sm bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
          <p className="text-xs text-red-700 font-medium mb-1">错误信息</p>
          <p className="text-xs text-red-600 break-all">{errorMessage}</p>
          {errorStack && (
            <details className="mt-2">
              <summary className="text-xs text-red-400 cursor-pointer hover:text-red-500">
                查看详细堆栈
              </summary>
              <pre className="text-[10px] text-red-400 mt-1 overflow-auto max-h-32 whitespace-pre-wrap break-all">
                {errorStack}
              </pre>
            </details>
          )}
        </div>

        {/* 恢复操作按钮 */}
        <div className="flex flex-col items-center gap-2 w-full max-w-sm">
          {!exceedMaxRetries ? (
            <button
              onClick={this.handleRecover}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              重新加载
            </button>
          ) : (
            <>
              <p className="text-xs text-amber-600 text-center mb-1">
                多次恢复尝试未能解决问题，建议刷新整个页面。
              </p>
              <button
                onClick={this.handleRecover}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                再试一次
              </button>
              <button
                onClick={this.handleForceReload}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                刷新页面
              </button>
            </>
          )}
        </div>

        {/* 恢复计数提示 */}
        {recoveryCount > 0 && (
          <p className="mt-3 text-[10px] text-gray-400">
            已尝试恢复 {recoveryCount} 次
          </p>
        )}
      </div>
    );
  }
}

export default ErrorBoundary;
