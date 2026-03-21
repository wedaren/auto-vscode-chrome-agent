"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillTreeDataProvider = exports.SkillTreeItem = void 0;
exports.runSkillCommand = runSkillCommand;
exports.toggleSkillCommand = toggleSkillCommand;
exports.addCustomSkillCommand = addCustomSkillCommand;
// skill-tree.ts — Skill 管理 TreeView 的 TreeDataProvider 实现
// 职责：在 Activity Bar 的 Browser Agent 面板中展示所有 Skill（按 preset/custom 分组），
//       支持 inline 按钮运行、启用/禁用切换、添加自定义 Skill。
//       订阅 SkillRegistry.onDidChange 实现自动刷新。
const vscode = __importStar(require("vscode"));
/** Skill TreeView 的树节点 */
class SkillTreeItem extends vscode.TreeItem {
    nodeType;
    skill;
    constructor(label, collapsibleState = vscode.TreeItemCollapsibleState.None, nodeType = 'skill', 
    /** 关联的 Skill 对象（仅 nodeType=skill 时有值） */
    skill) {
        super(label, collapsibleState);
        this.nodeType = nodeType;
        this.skill = skill;
    }
}
exports.SkillTreeItem = SkillTreeItem;
// ────────────────────────────────────────────────────────────────
// TreeDataProvider
// ────────────────────────────────────────────────────────────────
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
class SkillTreeDataProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    disposables = [];
    registry;
    constructor() {
        // 默认构造；通过 bind() 注入 SkillRegistry
    }
    /**
     * 绑定 SkillRegistry 并订阅变更事件
     */
    bind(registry) {
        this.registry = registry;
        this.disposables.push(registry.onDidChange(() => this.refresh()));
        this.refresh();
    }
    /**
     * 手动触发 TreeView 刷新
     */
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    // ────────────────────────────────────────────────────────────
    // TreeDataProvider 接口实现
    // ────────────────────────────────────────────────────────────
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!this.registry) {
            return [this.createPlaceholderItem('SkillRegistry 未初始化')];
        }
        // 根节点：返回两个分组
        if (!element) {
            return this.getRootItems();
        }
        // 分组节点：返回该分组下的 Skill 列表
        if (element.nodeType === 'category') {
            if (element.contextValue === 'skill-category-preset') {
                return this.getSkillItems(this.registry.getAllPreset());
            }
            if (element.contextValue === 'skill-category-custom') {
                return this.getSkillItems(this.registry.getAllCustom());
            }
        }
        return [];
    }
    // ────────────────────────────────────────────────────────────
    // 私有：构建节点
    // ────────────────────────────────────────────────────────────
    /**
     * 构建根节点：预设分组 + 自定义分组
     */
    getRootItems() {
        const presets = this.registry.getAllPreset();
        const customs = this.registry.getAllCustom();
        const presetNode = new SkillTreeItem(`预设 Skill (${presets.length})`, vscode.TreeItemCollapsibleState.Expanded, 'category');
        presetNode.contextValue = 'skill-category-preset';
        presetNode.iconPath = new vscode.ThemeIcon('package');
        presetNode.tooltip = `${presets.length} 个内置预设 Skill`;
        const customNode = new SkillTreeItem(`自定义 Skill (${customs.length})`, customs.length > 0
            ? vscode.TreeItemCollapsibleState.Expanded
            : vscode.TreeItemCollapsibleState.Collapsed, 'category');
        customNode.contextValue = 'skill-category-custom';
        customNode.iconPath = new vscode.ThemeIcon('edit');
        customNode.tooltip = `${customs.length} 个用户自定义 Skill`;
        return [presetNode, customNode];
    }
    /**
     * 构建 Skill 列表节点
     */
    getSkillItems(skills) {
        if (skills.length === 0) {
            return [this.createPlaceholderItem('暂无 Skill')];
        }
        return skills.map((skill) => this.createSkillItem(skill));
    }
    /**
     * 为单个 Skill 创建 TreeItem
     */
    createSkillItem(skill) {
        const item = new SkillTreeItem(skill.displayName, vscode.TreeItemCollapsibleState.None, 'skill', skill);
        // 图标：▶ 可用（绿色播放） / ⏸ 禁用（灰色暂停）
        item.iconPath = skill.enabled
            ? new vscode.ThemeIcon('play-circle', new vscode.ThemeColor('charts.green'))
            : new vscode.ThemeIcon('debug-pause', new vscode.ThemeColor('disabledForeground'));
        // 描述（显示在 displayName 右侧的灰色文字）
        item.description = skill.enabled ? '' : '已禁用';
        // Tooltip：完整描述 + 步骤数
        const stepsInfo = skill.steps.map((s, i) => `  ${i + 1}. ${s.description} (${s.toolName})`).join('\n');
        item.tooltip = new vscode.MarkdownString(`**${skill.displayName}** (${skill.name})\n\n` +
            `${skill.description}\n\n` +
            `**分类：** ${skill.category === 'preset' ? '预设' : '自定义'}\n` +
            `**状态：** ${skill.enabled ? '✅ 启用' : '⏸ 禁用'}\n` +
            `**步骤 (${skill.steps.length})：**\n${stepsInfo}`);
        // 上下文值用于 menus when 条件
        if (skill.category === 'preset') {
            item.contextValue = skill.enabled ? 'skill-preset-enabled' : 'skill-preset-disabled';
        }
        else {
            item.contextValue = skill.enabled ? 'skill-custom-enabled' : 'skill-custom-disabled';
        }
        return item;
    }
    /**
     * 创建占位提示节点
     */
    createPlaceholderItem(message) {
        const item = new SkillTreeItem(message, vscode.TreeItemCollapsibleState.None, 'skill');
        item.iconPath = new vscode.ThemeIcon('info');
        return item;
    }
    /**
     * 释放资源
     */
    dispose() {
        this.disposables.forEach((d) => d.dispose());
        this._onDidChangeTreeData.dispose();
    }
}
exports.SkillTreeDataProvider = SkillTreeDataProvider;
// ────────────────────────────────────────────────────────────────
// 命令处理函数（在 extension.ts 中注册）
// ────────────────────────────────────────────────────────────────
/**
 * 运行指定 Skill：弹出参数输入框（QuickPick / InputBox），收集参数后触发运行
 *
 * 注：当前版本仅收集参数并输出到 OutputChannel，
 *     实际执行逻辑将由 evo_v8_003 的 SkillRunner 实现。
 */
async function runSkillCommand(item, registry, outputChannel) {
    if (!registry) {
        vscode.window.showWarningMessage('SkillRegistry 未初始化');
        return;
    }
    // 如果从 TreeView inline 按钮触发，item 已有 skill
    // 如果从命令面板触发，需要让用户选择
    let skill;
    if (item?.skill) {
        skill = item.skill;
    }
    else {
        // 弹出 QuickPick 让用户选择要运行的 Skill
        const enabledSkills = registry.getAll().filter((s) => s.enabled);
        if (enabledSkills.length === 0) {
            vscode.window.showWarningMessage('没有可用的 Skill（所有 Skill 均已禁用）');
            return;
        }
        const picked = await vscode.window.showQuickPick(enabledSkills.map((s) => ({
            label: s.displayName,
            description: s.name,
            detail: s.description,
            skill: s,
        })), {
            placeHolder: '选择要运行的 Skill',
            title: 'Browser Agent: 运行 Skill',
        });
        if (!picked) {
            return; // 用户取消
        }
        skill = picked.skill;
    }
    if (!skill) {
        return;
    }
    // 检查 Skill 是否启用
    if (!skill.enabled) {
        vscode.window.showWarningMessage(`Skill "${skill.displayName}" 已禁用，请先启用`);
        return;
    }
    // 收集必填参数
    const paramValues = {};
    const requiredParams = skill.parameters.required;
    const allParams = Object.entries(skill.parameters.properties);
    for (const [paramName, paramDef] of allParams) {
        const isRequired = requiredParams.includes(paramName);
        // 如果有 enum 选项，用 QuickPick
        if (paramDef.enum && paramDef.enum.length > 0) {
            const picked = await vscode.window.showQuickPick(paramDef.enum, {
                placeHolder: `${paramDef.description}${isRequired ? ' (必填)' : ' (可选)'}`,
                title: `参数: ${paramName}`,
            });
            if (picked) {
                paramValues[paramName] = picked;
            }
            else if (isRequired) {
                vscode.window.showWarningMessage(`必填参数 "${paramName}" 未提供，取消运行`);
                return;
            }
        }
        else {
            // 用 InputBox
            const defaultVal = paramDef.default !== undefined ? String(paramDef.default) : '';
            const value = await vscode.window.showInputBox({
                prompt: paramDef.description,
                title: `参数: ${paramName}${isRequired ? ' (必填)' : ''}`,
                value: defaultVal,
                placeHolder: isRequired ? '必填' : '可选（留空跳过）',
            });
            if (value !== undefined && value !== '') {
                paramValues[paramName] = value;
            }
            else if (isRequired) {
                // 用户按 Escape 或输入空字符串但是必填
                if (value === undefined) {
                    return; // 用户取消
                }
                vscode.window.showWarningMessage(`必填参数 "${paramName}" 不能为空，取消运行`);
                return;
            }
        }
    }
    // 输出日志（实际执行将由 SkillRunner 处理，当前仅日志占位）
    outputChannel.appendLine(`[SkillTree] 运行 Skill: ${skill.name} 参数: ${JSON.stringify(paramValues)}`);
    outputChannel.show(true);
    vscode.window.showInformationMessage(`Skill "${skill.displayName}" 已提交运行（参数: ${JSON.stringify(paramValues)}）`);
}
/**
 * 切换 Skill 的启用/禁用状态
 */
async function toggleSkillCommand(item, registry) {
    if (!registry || !item?.skill) {
        vscode.window.showWarningMessage('请从 Skill 视图中选择一个 Skill');
        return;
    }
    const result = await registry.toggleEnabled(item.skill.name);
    if (result !== undefined) {
        vscode.window.showInformationMessage(`Skill "${item.skill.displayName}" 已${result ? '启用' : '禁用'}`);
    }
}
/**
 * 添加自定义 Skill：打开一个 JSON 编辑器，让用户填写 Skill 定义
 */
async function addCustomSkillCommand(registry, outputChannel) {
    if (!registry) {
        vscode.window.showWarningMessage('SkillRegistry 未初始化');
        return;
    }
    // 创建一个带模板的 untitled JSON 文件
    const template = {
        name: 'my_custom_skill',
        displayName: '我的自定义 Skill',
        description: '描述这个 Skill 的功能',
        category: 'custom',
        enabled: true,
        parameters: {
            type: 'object',
            properties: {
                exampleParam: {
                    type: 'string',
                    description: '示例参数',
                },
            },
            required: [],
        },
        steps: [
            {
                toolName: 'browser_navigate',
                argsTemplate: { url: '{{exampleParam}}' },
                description: '示例步骤：导航到参数指定的 URL',
            },
        ],
    };
    const templateJson = JSON.stringify(template, null, 2);
    // 打开 untitled 文档让用户编辑
    const doc = await vscode.workspace.openTextDocument({
        language: 'json',
        content: `// 编辑完成后，保存此文件（Ctrl+S），然后在弹出的对话框中确认添加\n// 可用的 toolName：browser_click, browser_type, browser_navigate, browser_scroll,\n//   browser_screenshot, browser_query_selector, browser_get_text, browser_get_attribute,\n//   browser_wait, browser_highlight\n// 参数模板支持 {{paramName}} 变量插值\n${templateJson}`,
    });
    await vscode.window.showTextDocument(doc);
    // 弹出引导信息
    const action = await vscode.window.showInformationMessage('请编辑 Skill JSON 定义，编辑完成后点击「添加 Skill」', '添加 Skill', '取消');
    if (action !== '添加 Skill') {
        return;
    }
    // 解析用户编辑后的 JSON
    try {
        // 去除注释行（以 // 开头的行）
        const rawText = doc.getText();
        const jsonText = rawText
            .split('\n')
            .filter((line) => !line.trimStart().startsWith('//'))
            .join('\n');
        const skillDef = JSON.parse(jsonText);
        // 基础验证
        if (!skillDef.name || typeof skillDef.name !== 'string') {
            vscode.window.showErrorMessage('Skill name 不能为空且必须是字符串');
            return;
        }
        if (!skillDef.displayName || typeof skillDef.displayName !== 'string') {
            vscode.window.showErrorMessage('Skill displayName 不能为空');
            return;
        }
        if (!Array.isArray(skillDef.steps) || skillDef.steps.length === 0) {
            vscode.window.showErrorMessage('Skill 至少需要一个步骤（steps）');
            return;
        }
        // 强制 category 为 custom
        skillDef.category = 'custom';
        const success = await registry.addSkill(skillDef);
        if (success) {
            vscode.window.showInformationMessage(`自定义 Skill "${skillDef.displayName}" 添加成功`);
            outputChannel.appendLine(`[SkillTree] 添加自定义 Skill: ${skillDef.name}`);
        }
        else {
            vscode.window.showErrorMessage(`Skill "${skillDef.name}" 已存在，添加失败`);
        }
    }
    catch (err) {
        vscode.window.showErrorMessage(`JSON 解析失败: ${err instanceof Error ? err.message : String(err)}`);
    }
}
//# sourceMappingURL=skill-tree.js.map