import * as vscode from 'vscode';
import { SkillRegistry, Skill } from './skill-registry';
/** 节点类型标识 */
type SkillNodeType = 'category' | 'skill';
/** Skill TreeView 的树节点 */
export declare class SkillTreeItem extends vscode.TreeItem {
    readonly nodeType: SkillNodeType;
    /** 关联的 Skill 对象（仅 nodeType=skill 时有值） */
    readonly skill?: Skill | undefined;
    constructor(label: string, collapsibleState?: vscode.TreeItemCollapsibleState, nodeType?: SkillNodeType, 
    /** 关联的 Skill 对象（仅 nodeType=skill 时有值） */
    skill?: Skill | undefined);
}
/**
 * SkillTreeDataProvider — 按 category 分组展示所有 Skill
 *
 * 树结构：
 *   ├─ 预设 Skill (preset)
 *   │  ├─ ▶ 导航到 URL
 *   │  ├─ ▶ 整理标签页
 *   │  └─ ...
 *   └─ 自定义 Skill (custom)
 *      └─ ...
 *
 * 每个 Skill 节点支持：
 * - inline 运行按钮（$(play) 图标）
 * - inline 启用/禁用切换按钮（$(eye) / $(eye-closed)）
 * - 右键上下文菜单
 */
export declare class SkillTreeDataProvider implements vscode.TreeDataProvider<SkillTreeItem> {
    private readonly _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | SkillTreeItem | undefined>;
    private readonly disposables;
    private registry?;
    constructor();
    /**
     * 绑定 SkillRegistry 并订阅变更事件
     */
    bind(registry: SkillRegistry): void;
    /**
     * 手动触发 TreeView 刷新
     */
    refresh(): void;
    getTreeItem(element: SkillTreeItem): vscode.TreeItem;
    getChildren(element?: SkillTreeItem): vscode.ProviderResult<SkillTreeItem[]>;
    /**
     * 构建根节点：预设分组 + 自定义分组
     */
    private getRootItems;
    /**
     * 构建 Skill 列表节点
     */
    private getSkillItems;
    /**
     * 为单个 Skill 创建 TreeItem
     */
    private createSkillItem;
    /**
     * 创建占位提示节点
     */
    private createPlaceholderItem;
    /**
     * 释放资源
     */
    dispose(): void;
}
/**
 * 运行指定 Skill：弹出参数输入框（QuickPick / InputBox），收集参数后触发运行
 *
 * 注：当前版本仅收集参数并输出到 OutputChannel，
 *     实际执行逻辑将由 evo_v8_003 的 SkillRunner 实现。
 */
export declare function runSkillCommand(item: SkillTreeItem | undefined, registry: SkillRegistry | undefined, outputChannel: vscode.OutputChannel): Promise<void>;
/**
 * 切换 Skill 的启用/禁用状态
 */
export declare function toggleSkillCommand(item: SkillTreeItem | undefined, registry: SkillRegistry | undefined): Promise<void>;
/**
 * 添加自定义 Skill：打开一个 JSON 编辑器，让用户填写 Skill 定义
 */
export declare function addCustomSkillCommand(registry: SkillRegistry | undefined, outputChannel: vscode.OutputChannel): Promise<void>;
export {};
//# sourceMappingURL=skill-tree.d.ts.map