// ChatInput.tsx — 对话输入框组件，支持斜杠命令菜单、键盘快捷键、输入历史（ArrowUp）
// 斜杠命令：/new（新建会话）、/clear（清空当前会话）、/models（切换模型）
// 快捷键：Cmd/Ctrl+Shift+O 新建会话、Cmd/Ctrl+L 清空会话
// 上箭头：输入框为空时填入上一条用户消息（方便重新编辑发送）
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

/** 斜杠命令定义 */
interface SlashCommand {
  /** 命令名称（不含 /） */
  name: string;
  /** 命令描述 */
  description: string;
  /** 命令图标（SVG path） */
  icon: string;
  /** 执行回调 */
  action: () => void;
}

/** ChatInput 组件 Props */
interface ChatInputProps {
  /** 发送消息回调 */
  onSend: (message: string) => void;
  /** 停止当前生成 */
  onCancel?: () => void;
  /** 是否禁用输入（流式生成中） */
  disabled?: boolean;
  /** 是否正在流式生成 */
  isStreaming?: boolean;
  /** 是否正在停止 */
  isCancelling?: boolean;
  /** 新建会话回调（斜杠命令 /new + 快捷键 Cmd+Shift+O） */
  onNewConversation?: () => void;
  /** 清空当前会话回调（斜杠命令 /clear + 快捷键 Cmd+L） */
  onClearConversation?: () => void;
  /** 打开模型选择回调（斜杠命令 /models） */
  onToggleModels?: () => void;
  /** 历史用户消息列表（用于 ArrowUp 填充上一条消息） */
  userMessages?: string[];
}

/**
 * SlashCommandMenu — 斜杠命令弹出面板
 * 输入 / 时显示，支持键盘上下选择和 Enter 确认
 */
function SlashCommandMenu({
  commands,
  filter,
  selectedIndex,
  onSelect,
}: {
  commands: SlashCommand[];
  filter: string;
  selectedIndex: number;
  onSelect: (cmd: SlashCommand) => void;
}) {
  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(filter.toLowerCase()),
  );

  if (filteredCommands.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 mx-4 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="px-3 py-1.5 text-xs text-gray-400 border-b border-gray-100">
        斜杠命令
      </div>
      {filteredCommands.map((cmd, idx) => (
        <button
          key={cmd.name}
          onClick={() => onSelect(cmd)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
            idx === selectedIndex
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg
            className="w-4 h-4 flex-shrink-0 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={cmd.icon} />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">/{cmd.name}</div>
            <div className="text-xs text-gray-400 truncate">{cmd.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function ChatInput({
  onSend,
  onCancel,
  disabled = false,
  isStreaming = false,
  isCancelling = false,
  onNewConversation,
  onClearConversation,
  onToggleModels,
  userMessages = [],
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandMenuIndex, setCommandMenuIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);
  const recentCompositionEndAtRef = useRef(0);

  // --- 斜杠命令定义 ---
  const slashCommands: SlashCommand[] = useMemo(
    () => [
      {
        name: 'new',
        description: '新建会话',
        icon: 'M12 4v16m8-8H4',
        action: () => onNewConversation?.(),
      },
      {
        name: 'clear',
        description: '清空当前会话',
        icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        action: () => onClearConversation?.(),
      },
      {
        name: 'models',
        description: '切换模型',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        action: () => onToggleModels?.(),
      },
    ],
    [onNewConversation, onClearConversation, onToggleModels],
  );

  /** 从 value 中提取斜杠命令过滤字符串（去掉开头的 /） */
  const slashFilter = useMemo(() => {
    if (!showCommandMenu) return '';
    // value 以 / 开头时，过滤文本为 / 后面的内容
    if (value.startsWith('/')) {
      return value.slice(1).trim();
    }
    return '';
  }, [showCommandMenu, value]);

  /** 过滤后的斜杠命令列表 */
  const filteredCommands = useMemo(
    () =>
      slashCommands.filter((cmd) =>
        cmd.name.toLowerCase().includes(slashFilter.toLowerCase()),
      ),
    [slashCommands, slashFilter],
  );

  // --- 提交消息 ---
  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    setShowCommandMenu(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSend]);

  // --- 执行斜杠命令 ---
  const executeSlashCommand = useCallback(
    (cmd: SlashCommand) => {
      cmd.action();
      setValue('');
      setShowCommandMenu(false);
      setCommandMenuIndex(0);
      textareaRef.current?.focus();
    },
    [],
  );

  const shouldIgnoreEnterForIme = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== 'Enter') return false;
      const nativeEvent = e.nativeEvent as KeyboardEvent & {
        isComposing?: boolean;
        keyCode?: number;
      };
      return (
        nativeEvent.isComposing === true ||
        isComposingRef.current ||
        nativeEvent.keyCode === 229 ||
        Date.now() - recentCompositionEndAtRef.current < 120
      );
    },
    [],
  );

  // --- 键盘事件处理 ---
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (shouldIgnoreEnterForIme(e)) {
        return;
      }

      // --- 斜杠命令菜单导航 ---
      if (showCommandMenu && filteredCommands.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCommandMenuIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0,
          );
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCommandMenuIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1,
          );
          return;
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          executeSlashCommand(filteredCommands[commandMenuIndex]);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowCommandMenu(false);
          setCommandMenuIndex(0);
          return;
        }
        if (e.key === 'Tab') {
          e.preventDefault();
          // Tab 自动补全命令名
          const cmd = filteredCommands[commandMenuIndex];
          if (cmd) {
            setValue('/' + cmd.name + ' ');
          }
          return;
        }
      }

      // --- Enter 发送（非命令菜单时） ---
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
        return;
      }

      // --- ArrowUp：输入框为空时填入上一条用户消息 ---
      if (
        e.key === 'ArrowUp' &&
        !showCommandMenu &&
        value === '' &&
        userMessages.length > 0
      ) {
        e.preventDefault();
        const lastUserMsg = userMessages[userMessages.length - 1];
        if (lastUserMsg) {
          setValue(lastUserMsg);
          // 下一帧将光标移到末尾 & 调整高度
          requestAnimationFrame(() => {
            const el = textareaRef.current;
            if (el) {
              el.selectionStart = el.value.length;
              el.selectionEnd = el.value.length;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 200) + 'px';
            }
          });
        }
        return;
      }

      // --- Escape：关闭命令菜单 / 清空输入 ---
      if (e.key === 'Escape') {
        if (showCommandMenu) {
          setShowCommandMenu(false);
          setCommandMenuIndex(0);
        } else if (value) {
          setValue('');
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        }
        return;
      }
    },
    [
      showCommandMenu,
      filteredCommands,
      commandMenuIndex,
      shouldIgnoreEnterForIme,
      value,
      userMessages,
      handleSubmit,
      executeSlashCommand,
    ],
  );

  // --- 输入变化处理 ---
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 检测斜杠命令：第一个字符为 / 且只有一行
    if (newValue.startsWith('/') && !newValue.includes('\n')) {
      setShowCommandMenu(true);
      setCommandMenuIndex(0);
    } else {
      setShowCommandMenu(false);
      setCommandMenuIndex(0);
    }

    // Auto-resize textarea（最大 200px，平滑过渡）
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, []);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
    recentCompositionEndAtRef.current = Date.now();
  }, []);

  const canSend = value.trim().length > 0 && !disabled;

  // --- 全局键盘快捷键 ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+Shift+O：新建会话
      if (isMod && e.shiftKey && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        onNewConversation?.();
        return;
      }

      // Cmd/Ctrl+L：清空会话
      if (isMod && !e.shiftKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        onClearConversation?.();
        return;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onNewConversation, onClearConversation]);

  return (
    <div className="relative border-t border-gray-200 bg-white px-4 py-3">
      {/* 斜杠命令菜单 */}
      {showCommandMenu && (
        <SlashCommandMenu
          commands={slashCommands}
          filter={slashFilter}
          selectedIndex={commandMenuIndex}
          onSelect={executeSlashCommand}
        />
      )}

      <div className="rounded-[22px] border border-gray-200 bg-white px-4 py-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="输入消息... 输入 / 查看命令"
            disabled={disabled}
            rows={1}
            className="block w-full resize-none bg-transparent py-1 pr-12 text-[14px] leading-5 text-gray-800 placeholder:text-[13px] placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 transition-[height] duration-150 ease-in-out"
            style={{ minHeight: '72px', maxHeight: '200px' }}
          />
          <button
            type="button"
            onClick={isStreaming ? onCancel : handleSubmit}
            disabled={isStreaming ? isCancelling : !canSend}
            title={isStreaming ? (isCancelling ? '停止中' : '停止生成') : '发送'}
            aria-label={isStreaming ? (isCancelling ? '停止中' : '停止生成') : '发送'}
            className={`absolute bottom-1 right-0 flex h-[22px] w-[22px] items-center justify-center rounded-full border shadow-sm transition-all ${
              isStreaming
                ? isCancelling
                  ? 'cursor-wait border-gray-200 bg-gray-200 text-gray-500'
                  : 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                : canSend
                  ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
                  : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            }`}
          >
            {isStreaming ? (
              <svg className="h-[12px] w-[12px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" />
              </svg>
            ) : (
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.3} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18V6m0 0l-4.5 4.5M12 6l4.5 4.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
