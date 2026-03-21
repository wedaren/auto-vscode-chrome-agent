import * as vscode from 'vscode';
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
    /** 参数模板，支持 {{param}} 变量插值，运行时替换为实际参数值 */
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
 * - 用户自定义：从 workspace configuration `browserAgent.skills` 加载
 *
 * 合并策略：
 * - loadSkills() 将预设 + 自定义合并到内存 Map
 * - saveSkills() 只持久化 category=custom 的 Skill 到 workspace config
 * - 预设 Skill 的 enabled 状态变更也会通过 saveSkills() 持久化
 *
 * 事件：
 * - onDidChange 在任何增删改操作后触发，供 TreeView / Chrome 面板刷新
 */
export declare class SkillRegistry {
    /** 所有 Skill 的内存存储（name → Skill） */
    private readonly skills;
    /** 输出日志通道 */
    private readonly outputChannel;
    /** Skill 变更事件 */
    private readonly _onDidChange;
    readonly onDidChange: vscode.Event<void>;
    /** 预设 Skill 的 enabled 状态覆盖（从 workspace config 加载） */
    private presetEnabledOverrides;
    constructor(outputChannel: vscode.OutputChannel);
    /**
     * 加载所有 Skill：内置预设 + workspace config 中的自定义 Skill
     *
     * 调用时机：插件激活时（extension.ts activate）
     */
    loadSkills(): void;
    /**
     * 持久化自定义 Skill 和预设 Skill 的 enabled 状态到 workspace config
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
}
//# sourceMappingURL=skill-registry.d.ts.map