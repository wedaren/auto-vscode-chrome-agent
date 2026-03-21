// skill-tree.ts — Skill 管理 TreeView 的 TreeDataProvider 实现
// 职责：在 Activity Bar 的 Browser Agent 面板中展示所有 Skill（按 preset/custom 分组），
//       支持 inline 按钮运行、启用/禁用切换、添加自定义 Skill。
//       订阅 SkillRegistry.onDidChange 实现自动刷新。
import * as vscode from 'vscode';
import { SkillRegistry, Skill } from './skill-registry';

// ────────────────────────────────────────────────────────────────
// TreeItem 定义
// ────────────────────────────────────────────────────────────────

/** 节点类型标识 */
type SkillNodeType = 'category' | 'skill';

/** Skill TreeView 的树节点 */
export class SkillTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
    public readonly nodeType: SkillNodeType = 'skill',
    /** 关联的 Skill 对象（仅 nodeType=skill 时有值） */
    public readonly skill?: Skill,
  ) {
    super(label, collapsibleState);
  }
}

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
export class SkillTreeDataProvider implements vscode.TreeDataProvider<SkillTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<SkillTreeItem | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private readonly disposables: vscode.Disposable[] = [];
  private registry?: SkillRegistry;

  constructor() {
    // 默认构造；通过 bind() 注入 SkillRegistry
  }

  /**
   * 绑定 SkillRegistry 并订阅变更事件
   */
  bind(registry: SkillRegistry): void {
    this.registry = registry;
    this.disposables.push(
      registry.onDidChange(() => this.refresh()),
    );
    this.refresh();
  }

  /**
   * 手动触发 TreeView 刷新
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  // ────────────────────────────────────────────────────────────
  // TreeDataProvider 接口实现
  // ────────────────────────────────────────────────────────────

  getTreeItem(element: SkillTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SkillTreeItem): vscode.ProviderResult<SkillTreeItem[]> {
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
  private getRootItems(): SkillTreeItem[] {
    const presets = this.registry!.getAllPreset();
    const customs = this.registry!.getAllCustom();

    const presetNode = new SkillTreeItem(
      `预设 Skill (${presets.length})`,
      vscode.TreeItemCollapsibleState.Expanded,
      'category',
    );
    presetNode.contextValue = 'skill-category-preset';
    presetNode.iconPath = new vscode.ThemeIcon('package');
    presetNode.tooltip = `${presets.length} 个内置预设 Skill`;

    const customNode = new SkillTreeItem(
      `自定义 Skill (${customs.length})`,
      customs.length > 0
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.Collapsed,
      'category',
    );
    customNode.contextValue = 'skill-category-custom';
    customNode.iconPath = new vscode.ThemeIcon('edit');
    customNode.tooltip = `${customs.length} 个用户自定义 Skill`;

    return [presetNode, customNode];
  }

  /**
   * 构建 Skill 列表节点
   */
  private getSkillItems(skills: Skill[]): SkillTreeItem[] {
    if (skills.length === 0) {
      return [this.createPlaceholderItem('暂无 Skill')];
    }

    return skills.map((skill) => this.createSkillItem(skill));
  }

  /**
   * 为单个 Skill 创建 TreeItem
   */
  private createSkillItem(skill: Skill): SkillTreeItem {
    const item = new SkillTreeItem(
      skill.displayName,
      vscode.TreeItemCollapsibleState.None,
      'skill',
      skill,
    );

    // 图标：▶ 可用（绿色播放） / ⏸ 禁用（灰色暂停）
    item.iconPath = skill.enabled
      ? new vscode.ThemeIcon('play-circle', new vscode.ThemeColor('charts.green'))
      : new vscode.ThemeIcon('debug-pause', new vscode.ThemeColor('disabledForeground'));

    // 描述（显示在 displayName 右侧的灰色文字）
    item.description = skill.enabled ? '' : '已禁用';

    // Tooltip：完整描述 + 步骤数
    const stepsInfo = skill.steps.map((s, i) => `  ${i + 1}. ${s.description} (${s.toolName})`).join('\n');
    item.tooltip = new vscode.MarkdownString(
      `**${skill.displayName}** (${skill.name})\n\n` +
      `${skill.description}\n\n` +
      `**分类：** ${skill.category === 'preset' ? '预设' : '自定义'}\n` +
      `**状态：** ${skill.enabled ? '✅ 启用' : '⏸ 禁用'}\n` +
      `**步骤 (${skill.steps.length})：**\n${stepsInfo}`,
    );

    // 上下文值用于 menus when 条件
    if (skill.category === 'preset') {
      item.contextValue = skill.enabled ? 'skill-preset-enabled' : 'skill-preset-disabled';
    } else {
      item.contextValue = skill.enabled ? 'skill-custom-enabled' : 'skill-custom-disabled';
    }

    return item;
  }

  /**
   * 创建占位提示节点
   */
  private createPlaceholderItem(message: string): SkillTreeItem {
    const item = new SkillTreeItem(message, vscode.TreeItemCollapsibleState.None, 'skill');
    item.iconPath = new vscode.ThemeIcon('info');
    return item;
  }

  /**
   * 释放资源
   */
  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    this._onDidChangeTreeData.dispose();
  }
}

// ────────────────────────────────────────────────────────────────
// 命令处理函数（在 extension.ts 中注册）
// ────────────────────────────────────────────────────────────────

/**
 * 运行指定 Skill：弹出参数输入框（QuickPick / InputBox），收集参数后触发运行
 *
 * 注：当前版本仅收集参数并输出到 OutputChannel，
 *     实际执行逻辑将由 evo_v8_003 的 SkillRunner 实现。
 */
export async function runSkillCommand(
  item: SkillTreeItem | undefined,
  registry: SkillRegistry | undefined,
  outputChannel: vscode.OutputChannel,
): Promise<void> {
  if (!registry) {
    vscode.window.showWarningMessage('SkillRegistry 未初始化');
    return;
  }

  // 如果从 TreeView inline 按钮触发，item 已有 skill
  // 如果从命令面板触发，需要让用户选择
  let skill: Skill | undefined;

  if (item?.skill) {
    skill = item.skill;
  } else {
    // 弹出 QuickPick 让用户选择要运行的 Skill
    const enabledSkills = registry.getAll().filter((s) => s.enabled);
    if (enabledSkills.length === 0) {
      vscode.window.showWarningMessage('没有可用的 Skill（所有 Skill 均已禁用）');
      return;
    }

    const picked = await vscode.window.showQuickPick(
      enabledSkills.map((s) => ({
        label: s.displayName,
        description: s.name,
        detail: s.description,
        skill: s,
      })),
      {
        placeHolder: '选择要运行的 Skill',
        title: 'Browser Agent: 运行 Skill',
      },
    );

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
  const paramValues: Record<string, string> = {};
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
      } else if (isRequired) {
        vscode.window.showWarningMessage(`必填参数 "${paramName}" 未提供，取消运行`);
        return;
      }
    } else {
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
      } else if (isRequired) {
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
  outputChannel.appendLine(
    `[SkillTree] 运行 Skill: ${skill.name} 参数: ${JSON.stringify(paramValues)}`,
  );
  outputChannel.show(true);
  vscode.window.showInformationMessage(
    `Skill "${skill.displayName}" 已提交运行（参数: ${JSON.stringify(paramValues)}）`,
  );
}

/**
 * 切换 Skill 的启用/禁用状态
 */
export async function toggleSkillCommand(
  item: SkillTreeItem | undefined,
  registry: SkillRegistry | undefined,
): Promise<void> {
  if (!registry || !item?.skill) {
    vscode.window.showWarningMessage('请从 Skill 视图中选择一个 Skill');
    return;
  }

  const result = await registry.toggleEnabled(item.skill.name);
  if (result !== undefined) {
    vscode.window.showInformationMessage(
      `Skill "${item.skill.displayName}" 已${result ? '启用' : '禁用'}`,
    );
  }
}

/**
 * 添加自定义 Skill：打开一个 JSON 编辑器，让用户填写 Skill 定义
 */
export async function addCustomSkillCommand(
  registry: SkillRegistry | undefined,
  outputChannel: vscode.OutputChannel,
): Promise<void> {
  if (!registry) {
    vscode.window.showWarningMessage('SkillRegistry 未初始化');
    return;
  }

  // 创建一个带模板的 untitled JSON 文件
  const template: Record<string, unknown> = {
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
  const action = await vscode.window.showInformationMessage(
    '请编辑 Skill JSON 定义，编辑完成后点击「添加 Skill」',
    '添加 Skill',
    '取消',
  );

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

    const skillDef = JSON.parse(jsonText) as Skill;

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
    } else {
      vscode.window.showErrorMessage(`Skill "${skillDef.name}" 已存在，添加失败`);
    }
  } catch (err) {
    vscode.window.showErrorMessage(
      `JSON 解析失败: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
