// ChatInput.tsx — 对话输入框组件，支持斜杠命令菜单、Skill 快捷触发、Prompt 模板、键盘导航
// 斜杠命令：/new（新建会话）、/clear（清空当前会话）、/models（切换模型）
// 扩展命令：/skill（Skill 快捷触发 + 名称自动补全）、/template（Prompt 模板选择）
// 深度调研：/research（切换到调研面板）、/research <主题>（直接启动深度调研）
// 菜单支持分类显示和模糊搜索过滤
// 快捷键：Cmd/Ctrl+Shift+O 新建会话、Cmd/Ctrl+L 清空会话
// 上箭头：输入框为空时填入上一条用户消息（方便重新编辑发送）
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

// ────────────────────────────────────────────────────────────────
// 类型定义
// ────────────────────────────────────────────────────────────────

/** 斜杠命令定义（含分类） */
interface SlashCommand {
  /** 命令名称（不含 /） */
  name: string;
  /** 命令描述 */
  description: string;
  /** 命令图标（SVG path） */
  icon: string;
  /** 命令分类（用于菜单分组显示） */
  category: string;
  /** 执行回调 */
  action: () => void;
}

/** Skill 列表项（与 SkillPanel 共享结构） */
export interface SkillItem {
  name: string;
  displayName: string;
  description: string;
  category: 'preset' | 'custom';
}

/** Prompt 模板定义 */
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
}

/** 斜杠菜单模式：命令列表 / Skill 自动补全 / 模板选择 */
type SlashMenuMode = 'commands' | 'skills' | 'templates';

// ────────────────────────────────────────────────────────────────
// 内置 Prompt 模板
// ────────────────────────────────────────────────────────────────

const BUILTIN_TEMPLATES: PromptTemplate[] = [
  {
    id: 'summarize',
    name: '总结页面',
    description: '总结当前页面的主要内容和关键要点',
    category: '分析',
    prompt: '请总结当前页面的主要内容，包括关键要点和核心信息。',
  },
  {
    id: 'extract_info',
    name: '提取信息',
    description: '提取页面中的关键数据和结构化信息',
    category: '分析',
    prompt: '请提取当前页面中的关键数据、联系方式、日期等重要信息，以结构化格式列出。',
  },
  {
    id: 'compare',
    name: '对比分析',
    description: '对比分析页面中的多项信息',
    category: '分析',
    prompt: '请分析当前页面中的对比信息，列出各项的优缺点和差异。',
  },
  {
    id: 'translate_selection',
    name: '翻译选中',
    description: '将选中文本翻译为中文',
    category: '翻译',
    prompt: '请将选中的内容翻译为中文，保持原文格式和语义。',
  },
  {
    id: 'translate_to_en',
    name: '翻译为英文',
    description: '将选中文本翻译为英文',
    category: '翻译',
    prompt: '请将选中的内容翻译为英文，保持原文格式和语义。',
  },
  {
    id: 'explain',
    name: '解释内容',
    description: '用简单语言解释页面内容',
    category: '辅助',
    prompt: '请用简单易懂的语言解释当前页面的内容，适合非专业人士理解。',
  },
  {
    id: 'code_review',
    name: '代码审查',
    description: '审查页面中的代码片段',
    category: '开发',
    prompt: '请审查当前页面中的代码片段，指出潜在问题、安全隐患和改进建议。',
  },
  {
    id: 'generate_test',
    name: '生成测试',
    description: '为页面中的代码生成测试用例',
    category: '开发',
    prompt: '请为当前页面中的代码生成完整的单元测试用例，覆盖主要逻辑分支。',
  },
];

// ────────────────────────────────────────────────────────────────
// 模糊搜索工具函数
// ────────────────────────────────────────────────────────────────

/** 模糊匹配：支持 contains 和字符顺序匹配 */
function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  // 优先 contains
  if (lower.includes(q)) return true;
  // 退化到字符顺序匹配
  let qi = 0;
  for (let ti = 0; ti < lower.length && qi < q.length; ti++) {
    if (lower[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

// ────────────────────────────────────────────────────────────────
// ChatInput Props
// ────────────────────────────────────────────────────────────────

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
  /** 可用 Skill 列表（由 App 传入，/skill 命令使用） */
  skills?: SkillItem[];
  /** 触发 Skill 执行回调 */
  onExecuteSkill?: (skillName: string) => void;
  /** 切换到 Skills Tab 回调 */
  onSwitchToSkills?: () => void;
  /** 深度调研：切换到 Research Tab 并可选自动启动（/research 斜杠命令） */
  onStartResearch?: (topic?: string) => void;
}

// ────────────────────────────────────────────────────────────────
// SlashMenu 组件 — 统一渲染 commands / skills / templates 三种模式
// 支持分类分组、模糊搜索、键盘高亮
// ────────────────────────────────────────────────────────────────

/** 菜单容器：绝对定位在输入框上方 */
const MENU_CONTAINER_CLS =
  'absolute bottom-full left-0 right-0 mb-1 mx-4 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 max-h-[320px] overflow-y-auto';

/** 分类标题栏 */
const CATEGORY_HEADER_CLS =
  'px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/80 border-b border-gray-100 sticky top-0';

function SlashMenu({
  mode,
  filteredCommands,
  filteredSkills,
  filteredTemplates,
  selectedIndex,
  onSelectCommand,
  onSelectSkill,
  onSelectTemplate,
}: {
  mode: SlashMenuMode;
  filteredCommands: SlashCommand[];
  filteredSkills: SkillItem[];
  filteredTemplates: PromptTemplate[];
  selectedIndex: number;
  onSelectCommand: (cmd: SlashCommand) => void;
  onSelectSkill: (skill: SkillItem) => void;
  onSelectTemplate: (tpl: PromptTemplate) => void;
}) {
  // ── Commands 模式：按 category 分组 ──
  if (mode === 'commands') {
    if (filteredCommands.length === 0) return null;

    // 按 category 分组，保持原数组顺序
    const groups: { category: string; startIdx: number; items: SlashCommand[] }[] = [];
    let currentCat = '';
    for (let i = 0; i < filteredCommands.length; i++) {
      const cmd = filteredCommands[i];
      if (cmd.category !== currentCat) {
        currentCat = cmd.category;
        groups.push({ category: currentCat, startIdx: i, items: [] });
      }
      groups[groups.length - 1].items.push(cmd);
    }

    return (
      <div className={MENU_CONTAINER_CLS}>
        {groups.map((g) => (
          <div key={g.category}>
            <div className={CATEGORY_HEADER_CLS}>{g.category}</div>
            {g.items.map((cmd, localIdx) => {
              const idx = g.startIdx + localIdx;
              return (
                <button
                  key={cmd.name}
                  onClick={() => onSelectCommand(cmd)}
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
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // ── Skills 模式：按 preset / custom 分组 ──
  if (mode === 'skills') {
    if (filteredSkills.length === 0) {
      return (
        <div className={MENU_CONTAINER_CLS}>
          <div className="p-3 text-xs text-gray-400 text-center">
            未找到匹配的 Skill
          </div>
        </div>
      );
    }

    const presets = filteredSkills.filter((s) => s.category === 'preset');
    const customs = filteredSkills.filter((s) => s.category === 'custom');

    // globalIdx: preset 在前，custom 在后
    let globalIdx = 0;

    return (
      <div className={MENU_CONTAINER_CLS}>
        <div className={`${CATEGORY_HEADER_CLS} flex items-center gap-1.5`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          选择 Skill 执行
        </div>
        {presets.length > 0 && (
          <>
            <div className="px-3 py-1 text-[10px] text-gray-400 bg-gray-50/50">预设 Skill</div>
            {presets.map((skill) => {
              const idx = globalIdx++;
              return (
                <button
                  key={skill.name}
                  onClick={() => onSelectSkill(skill)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    idx === selectedIndex
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">
                    S
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{skill.displayName}</div>
                    <div className="text-xs text-gray-400 truncate">{skill.description}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 flex-shrink-0">
                    预设
                  </span>
                </button>
              );
            })}
          </>
        )}
        {customs.length > 0 && (
          <>
            <div className="px-3 py-1 text-[10px] text-gray-400 bg-gray-50/50">自定义 Skill</div>
            {customs.map((skill) => {
              const idx = globalIdx++;
              return (
                <button
                  key={skill.name}
                  onClick={() => onSelectSkill(skill)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    idx === selectedIndex
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">
                    C
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{skill.displayName}</div>
                    <div className="text-xs text-gray-400 truncate">{skill.description}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-600 flex-shrink-0">
                    自定义
                  </span>
                </button>
              );
            })}
          </>
        )}
      </div>
    );
  }

  // ── Templates 模式：按 category 分组 ──
  if (mode === 'templates') {
    if (filteredTemplates.length === 0) {
      return (
        <div className={MENU_CONTAINER_CLS}>
          <div className="p-3 text-xs text-gray-400 text-center">
            未找到匹配的模板
          </div>
        </div>
      );
    }

    // 按 category 分组
    const groups: { category: string; startIdx: number; items: PromptTemplate[] }[] = [];
    let currentCat = '';
    for (let i = 0; i < filteredTemplates.length; i++) {
      const t = filteredTemplates[i];
      if (t.category !== currentCat) {
        currentCat = t.category;
        groups.push({ category: currentCat, startIdx: i, items: [] });
      }
      groups[groups.length - 1].items.push(t);
    }

    return (
      <div className={MENU_CONTAINER_CLS}>
        <div className={`${CATEGORY_HEADER_CLS} flex items-center gap-1.5`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          选择 Prompt 模板
        </div>
        {groups.map((g) => (
          <div key={g.category}>
            <div className="px-3 py-1 text-[10px] text-gray-400 bg-gray-50/50">{g.category}</div>
            {g.items.map((tpl, localIdx) => {
              const idx = g.startIdx + localIdx;
              return (
                <button
                  key={tpl.id}
                  onClick={() => onSelectTemplate(tpl)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    idx === selectedIndex
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold">
                    T
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{tpl.name}</div>
                    <div className="text-xs text-gray-400 truncate">{tpl.description}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 flex-shrink-0">
                    {tpl.category}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// ────────────────────────────────────────────────────────────────
// ChatInput 主组件
// ────────────────────────────────────────────────────────────────

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
  skills = [],
  onExecuteSkill,
  onSwitchToSkills,
  onStartResearch,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandMenuIndex, setCommandMenuIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);
  const recentCompositionEndAtRef = useRef(0);

  // ── 斜杠命令定义（按分类排列） ──
  const slashCommands: SlashCommand[] = useMemo(
    () => [
      // 会话管理
      {
        name: 'new',
        description: '新建会话',
        icon: 'M12 4v16m8-8H4',
        category: '会话',
        action: () => onNewConversation?.(),
      },
      {
        name: 'clear',
        description: '清空当前会话',
        icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        category: '会话',
        action: () => onClearConversation?.(),
      },
      // 工具
      {
        name: 'models',
        description: '切换模型',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        category: '工具',
        action: () => onToggleModels?.(),
      },
      {
        name: 'skill',
        description: 'Skill 快捷触发（输入名称自动补全）',
        icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
        category: '工具',
        action: () => {}, // 由 executeSlashCommand 特殊处理
      },
      {
        name: 'research',
        description: '深度调研（/research <主题> 直接启动）',
        icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
        category: '工具',
        action: () => onStartResearch?.(), // 无参数时仅切换到 Research Tab
      },
      // 模板
      {
        name: 'template',
        description: 'Prompt 模板（快速填入预设 prompt）',
        icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
        category: '模板',
        action: () => {}, // 由 executeSlashCommand 特殊处理
      },
    ],
    [onNewConversation, onClearConversation, onToggleModels, onStartResearch],
  );

  // ── 菜单模式：根据 value 自动切换 ──
  const menuMode: SlashMenuMode = useMemo(() => {
    if (!showCommandMenu) return 'commands';
    // /skill + 空格 → 进入 Skill 自动补全子菜单
    if (/^\/skill\s/i.test(value)) return 'skills';
    // /template + 空格 → 进入模板选择子菜单
    if (/^\/template\s/i.test(value)) return 'templates';
    return 'commands';
  }, [showCommandMenu, value]);

  // ── 菜单过滤文本 ──
  const menuFilter = useMemo(() => {
    if (!showCommandMenu) return '';
    if (menuMode === 'skills') return value.replace(/^\/skill\s*/i, '').trim();
    if (menuMode === 'templates') return value.replace(/^\/template\s*/i, '').trim();
    return value.startsWith('/') ? value.slice(1).trim() : '';
  }, [showCommandMenu, value, menuMode]);

  // ── 过滤后的列表（commands / skills / templates 各自独立计算） ──
  const filteredCommands = useMemo(() => {
    if (!showCommandMenu || menuMode !== 'commands') return [];
    return slashCommands.filter(
      (cmd) => fuzzyMatch(cmd.name, menuFilter) || fuzzyMatch(cmd.description, menuFilter),
    );
  }, [showCommandMenu, menuMode, slashCommands, menuFilter]);

  const filteredSkills = useMemo(() => {
    if (!showCommandMenu || menuMode !== 'skills') return [];
    const src = skills ?? [];
    if (!menuFilter) return src;
    return src.filter(
      (s) =>
        fuzzyMatch(s.name, menuFilter) ||
        fuzzyMatch(s.displayName, menuFilter) ||
        fuzzyMatch(s.description, menuFilter),
    );
  }, [showCommandMenu, menuMode, skills, menuFilter]);

  const filteredTemplates = useMemo(() => {
    if (!showCommandMenu || menuMode !== 'templates') return [];
    if (!menuFilter) return BUILTIN_TEMPLATES;
    return BUILTIN_TEMPLATES.filter(
      (t) =>
        fuzzyMatch(t.name, menuFilter) ||
        fuzzyMatch(t.description, menuFilter) ||
        fuzzyMatch(t.category, menuFilter),
    );
  }, [showCommandMenu, menuMode, menuFilter]);

  /** 当前菜单可见条目总数（用于键盘导航边界） */
  const totalMenuItems = useMemo(() => {
    switch (menuMode) {
      case 'skills':
        return filteredSkills.length;
      case 'templates':
        return filteredTemplates.length;
      default:
        return filteredCommands.length;
    }
  }, [menuMode, filteredSkills, filteredTemplates, filteredCommands]);

  // ── 提交消息 ──
  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    // 拦截 /research <topic> 命令：直接启动深度调研
    const researchMatch = trimmed.match(/^\/research\s+(.+)$/i);
    if (researchMatch) {
      const topic = researchMatch[1].trim();
      if (topic) {
        onStartResearch?.(topic);
        setValue('');
        setShowCommandMenu(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        return;
      }
    }

    // 拦截 /research（无参数）：切换到 Research Tab
    if (/^\/research$/i.test(trimmed)) {
      onStartResearch?.();
      setValue('');
      setShowCommandMenu(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      return;
    }

    onSend(trimmed);
    setValue('');
    setShowCommandMenu(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSend, onStartResearch]);

  // ── 执行斜杠命令 ──
  const executeSlashCommand = useCallback(
    (cmd: SlashCommand) => {
      // /skill 和 /template 切换到子菜单，不直接执行
      if (cmd.name === 'skill') {
        setValue('/skill ');
        setCommandMenuIndex(0);
        textareaRef.current?.focus();
        return;
      }
      if (cmd.name === 'template') {
        setValue('/template ');
        setCommandMenuIndex(0);
        textareaRef.current?.focus();
        return;
      }
      // 常规命令：执行并关闭菜单
      cmd.action();
      setValue('');
      setShowCommandMenu(false);
      setCommandMenuIndex(0);
      textareaRef.current?.focus();
    },
    [],
  );

  // ── 选择 Skill：触发执行 ──
  const handleSelectSkill = useCallback(
    (skill: SkillItem) => {
      onExecuteSkill?.(skill.name);
      setValue('');
      setShowCommandMenu(false);
      setCommandMenuIndex(0);
      textareaRef.current?.focus();
    },
    [onExecuteSkill],
  );

  // ── 选择模板：填入输入框 ──
  const handleSelectTemplate = useCallback((tpl: PromptTemplate) => {
    setValue(tpl.prompt);
    setShowCommandMenu(false);
    setCommandMenuIndex(0);
    textareaRef.current?.focus();
    // 下一帧调整 textarea 高度
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 200) + 'px';
      }
    });
  }, []);

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

  // ── 键盘事件处理 ──
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (shouldIgnoreEnterForIme(e)) return;

      // ── 菜单打开 + 有可选项时的导航 ──
      if (showCommandMenu && totalMenuItems > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCommandMenuIndex((prev) => (prev < totalMenuItems - 1 ? prev + 1 : 0));
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCommandMenuIndex((prev) => (prev > 0 ? prev - 1 : totalMenuItems - 1));
          return;
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          // 根据菜单模式执行不同操作
          if (menuMode === 'commands') {
            executeSlashCommand(filteredCommands[commandMenuIndex]);
          } else if (menuMode === 'skills') {
            handleSelectSkill(filteredSkills[commandMenuIndex]);
          } else if (menuMode === 'templates') {
            handleSelectTemplate(filteredTemplates[commandMenuIndex]);
          }
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
          // Tab 自动补全当前高亮项
          if (menuMode === 'commands') {
            const cmd = filteredCommands[commandMenuIndex];
            if (cmd) {
              setValue('/' + cmd.name + ' ');
              setCommandMenuIndex(0);
            }
          } else if (menuMode === 'skills') {
            const skill = filteredSkills[commandMenuIndex];
            if (skill) {
              setValue('/skill ' + skill.name);
              setCommandMenuIndex(0);
            }
          } else if (menuMode === 'templates') {
            const tpl = filteredTemplates[commandMenuIndex];
            if (tpl) {
              setValue('/template ' + tpl.name);
              setCommandMenuIndex(0);
            }
          }
          return;
        }
      }

      // ── Enter 发送（非命令菜单时） ──
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
        return;
      }

      // ── ArrowUp：输入框为空时填入上一条用户消息 ──
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

      // ── Escape：关闭命令菜单 / 清空输入 ──
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
      totalMenuItems,
      menuMode,
      filteredCommands,
      filteredSkills,
      filteredTemplates,
      commandMenuIndex,
      shouldIgnoreEnterForIme,
      value,
      userMessages,
      handleSubmit,
      executeSlashCommand,
      handleSelectSkill,
      handleSelectTemplate,
    ],
  );

  // ── 输入变化处理 ──
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

  // ── 全局键盘快捷键 ──
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
      {/* 斜杠命令菜单（commands / skills / templates 统一渲染） */}
      {showCommandMenu && (
        <SlashMenu
          mode={menuMode}
          filteredCommands={filteredCommands}
          filteredSkills={filteredSkills}
          filteredTemplates={filteredTemplates}
          selectedIndex={commandMenuIndex}
          onSelectCommand={executeSlashCommand}
          onSelectSkill={handleSelectSkill}
          onSelectTemplate={handleSelectTemplate}
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
