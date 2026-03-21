import * as vscode from 'vscode';
import { UserDataManager } from './user-data-manager';
/** JSON Schema 属性定义（与 browser-tools.ts 中 JsonSchemaProperty 一致） */
export interface SkillParameterProperty {
    type: string;
    description: string;
    enum?: string[];
    default?: unknown;
}
/** Skill 输入参数的 JSON Schema */
export interface SkillParametersSchema {
    type: 'object';
    properties: Record<string, SkillParameterProperty>;
    required: string[];
}
/**
 * SkillStep — 单个执行步骤
 *
 * 每个 Skill 由有序的 SkillStep 列表组成，
 * 每步映射到一个 browser_* 工具调用。
 */
export interface SkillStep {
    /** 要调用的工具名称（browser_navigate / browser_click / browser_get_text 等） */
    toolName: string;
    /** 参数模板，支持三种变量插值语法，运行时替换为实际值：
     *  - {{param}}    — 用户提供的参数值
     *  - {{$prev}}    — 上一步的执行结果文本
     *  - {{$step_N}}  — 第 N 步（从 0 开始）的执行结果文本
     */
    argsTemplate: Record<string, unknown>;
    /** 步骤描述（人类可读） */
    description: string;
    /** 是否可选步骤（失败时可跳过而非终止整个 Skill） */
    optional?: boolean;
}
/**
 * Skill — MCP Tool Schema 风格的技能定义
 *
 * 设计原则：
 * - name 作为唯一标识，全局不可重复
 * - parameters 遵循 JSON Schema，与 MCP inputSchema 风格一致
 * - steps 是有序步骤列表，SkillRunner 按顺序执行
 * - category 区分内置预设（preset）和用户自定义（custom）
 */
export interface Skill {
    /** 唯一标识（snake_case，如 navigate_to_url） */
    name: string;
    /** 展示名称（用于 UI） */
    displayName: string;
    /** 技能描述（供 LLM 理解用途 + 用户 tooltip） */
    description: string;
    /** 分类：preset = 内置预设，custom = 用户自定义 */
    category: 'preset' | 'custom';
    /** 是否启用 */
    enabled: boolean;
    /** 输入参数 JSON Schema（如 url / selector 等变量） */
    parameters: SkillParametersSchema;
    /** 有序步骤列表，SkillRunner 按顺序执行 */
    steps: SkillStep[];
}
/**
 * SkillRegistry 管理所有 Skill（预设 + 自定义）的注册、查询、持久化。
 *
 * 数据来源：
 * - 内置预设：PRESET_SKILLS 硬编码（category=preset），始终存在
 * - 用户自定义：从 ~/.browser-agent/skills/custom-skills.json 加载
 * - 预设开关覆盖：从 ~/.browser-agent/skills/preset-overrides.json 加载
 *
 * 合并策略：
 * - loadSkills() 将预设 + 自定义合并到内存 Map
 * - saveSkills() 将 custom Skill 写入 custom-skills.json，预设开关写入 preset-overrides.json
 * - 首次加载时自动迁移旧 workspace config 数据到文件存储
 *
 * 事件：
 * - onDidChange 在任何增删改操作后触发，供 TreeView / Chrome 面板刷新
 */
export declare class SkillRegistry {
    /** 所有 Skill 的内存存储（name → Skill） */
    private readonly skills;
    /** 输出日志通道 */
    private readonly outputChannel;
    /** 用户数据目录管理器（持久化存储层） */
    private readonly userDataManager;
    /** Skill 变更事件 */
    private readonly _onDidChange;
    readonly onDidChange: vscode.Event<void>;
    /** 预设 Skill 的 enabled 状态覆盖（从文件加载） */
    private presetEnabledOverrides;
    constructor(userDataManager: UserDataManager, outputChannel: vscode.OutputChannel);
    /**
     * 加载所有 Skill：内置预设 + 文件存储中的自定义 Skill
     *
     * 调用时机：插件激活时（extension.ts activate）
     * 首次加载时自动检测旧 workspace config 数据并迁移到文件存储。
     */
    loadSkills(): Promise<void>;
    /**
     * 持久化自定义 Skill 和预设 Skill 的 enabled 状态到文件存储
     *
     * - custom-skills.json: 所有 category=custom 的 Skill
     * - preset-overrides.json: 预设 Skill 与默认值不同的 enabled 状态
     */
    saveSkills(): Promise<void>;
    /**
     * 获取所有 Skill 列表
     */
    getAll(): Skill[];
    /**
     * 获取所有自定义 Skill
     */
    getAllCustom(): Skill[];
    /**
     * 获取所有预设 Skill
     */
    getAllPreset(): Skill[];
    /**
     * 按名称查找 Skill
     */
    getByName(name: string): Skill | undefined;
    /**
     * 添加自定义 Skill
     *
     * @returns true 添加成功，false 名称已存在
     */
    addSkill(skill: Skill): Promise<boolean>;
    /**
     * 移除自定义 Skill（预设 Skill 不可移除）
     *
     * @returns true 移除成功，false 不存在或为预设
     */
    removeSkill(name: string): Promise<boolean>;
    /**
     * 切换 Skill 的启用/禁用状态
     *
     * @returns 切换后的 enabled 值，若 Skill 不存在返回 undefined
     */
    toggleEnabled(name: string): Promise<boolean | undefined>;
    /**
     * 释放资源
     */
    dispose(): void;
    /**
     * 检查名称是否属于内置预设 Skill
     */
    private isPresetName;
    /**
     * 从旧 workspace config 迁移数据到 UserDataManager 文件存储
     *
     * 迁移条件：custom-skills.json 文件不存在（说明从未使用过文件存储）
     * 且 workspace config 中存在 browserAgent.skills 或 browserAgent.skillPresetEnabled 数据。
     *
     * 迁移完成后清除旧 workspace config 数据，确保只迁移一次。
     */
    private migrateFromWorkspaceConfig;
}
//# sourceMappingURL=skill-registry.d.ts.map