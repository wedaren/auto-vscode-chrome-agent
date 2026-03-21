// user-data-manager.ts — 全局用户数据目录管理服务
// 职责：管理 ~/.browser-agent（或用户自定义路径）下的持久化数据目录，
//       提供目录初始化、路径解析、JSON 读写等基础文件操作。
//       作为 SkillRegistry / SessionStore 等模块的底层存储层。
import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

// ────────────────────────────────────────────────────────────────
// 常量
// ────────────────────────────────────────────────────────────────

/** 配置项键名 */
const CONFIG_KEY = 'browserAgent.userDataDir';

/** 默认数据目录（~ 展开为用户 home） */
const DEFAULT_DIR = '~/.browser-agent';

/** init() 自动创建的子目录列表 */
const SUB_DIRS = ['skills', 'config', 'sessions'] as const;

// ────────────────────────────────────────────────────────────────
// UserDataManager 类
// ────────────────────────────────────────────────────────────────

/**
 * UserDataManager — 全局用户数据目录管理器
 *
 * 设计原则：
 * - 目录路径来自 VSCode 配置 `browserAgent.userDataDir`，默认 `~/.browser-agent`
 * - init() 幂等：可多次调用，已有目录不会被覆盖
 * - readJSON / writeJSON 提供类型安全的 JSON 文件读写
 * - getPath() 返回基于数据根目录的绝对路径，方便其他模块拼接子路径
 *
 * 生命周期：
 * - extension activate() 时创建实例并调用 init()
 * - 监听 browserAgent.userDataDir 配置变更，变更后重新 init()
 */
export class UserDataManager {
  /** 当前已解析的数据根目录绝对路径 */
  private rootDir: string;

  /** 输出日志通道 */
  private readonly outputChannel: vscode.OutputChannel;

  /** 目录变更事件（init 成功后触发，供外部模块监听并重新加载数据） */
  private readonly _onDidChangeRoot = new vscode.EventEmitter<string>();
  readonly onDidChangeRoot = this._onDidChangeRoot.event;

  constructor(outputChannel: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
    this.rootDir = UserDataManager.resolveDir(UserDataManager.getConfiguredDir());
  }

  // ────────────────────────────────────────────────────────────────
  // 公共方法
  // ────────────────────────────────────────────────────────────────

  /**
   * 初始化数据目录：创建根目录及所有子目录
   *
   * 幂等操作：目录已存在则跳过。
   * 配置变更后应重新调用此方法。
   */
  async init(): Promise<void> {
    // 重新读取配置（可能已变更）
    this.rootDir = UserDataManager.resolveDir(UserDataManager.getConfiguredDir());

    try {
      // 创建根目录
      await fs.promises.mkdir(this.rootDir, { recursive: true });

      // 创建子目录
      for (const sub of SUB_DIRS) {
        const subPath = path.join(this.rootDir, sub);
        await fs.promises.mkdir(subPath, { recursive: true });
      }

      this.outputChannel.appendLine(
        `[UserDataManager] 数据目录已初始化: ${this.rootDir}`,
      );
      this.outputChannel.appendLine(
        `[UserDataManager] 子目录: ${SUB_DIRS.join(', ')}`,
      );

      this._onDidChangeRoot.fire(this.rootDir);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.outputChannel.appendLine(
        `[UserDataManager] 初始化目录失败: ${message}`,
      );
      vscode.window.showErrorMessage(
        `Browser Agent: 无法创建数据目录 ${this.rootDir} — ${message}`,
      );
    }
  }

  /**
   * 获取数据目录下的绝对路径
   *
   * @param segments - 相对于数据根目录的路径片段
   * @returns 绝对路径字符串
   *
   * @example
   * manager.getPath('skills', 'custom-skills.json')
   * // => /Users/xxx/.browser-agent/skills/custom-skills.json
   */
  getPath(...segments: string[]): string {
    return path.join(this.rootDir, ...segments);
  }

  /**
   * 获取数据根目录绝对路径
   */
  getRootDir(): string {
    return this.rootDir;
  }

  /**
   * 读取 JSON 文件并解析为指定类型
   *
   * @param segments - 相对于数据根目录的路径片段
   * @returns 解析后的对象，文件不存在或解析失败返回 undefined
   *
   * @example
   * const skills = await manager.readJSON<Skill[]>('skills', 'custom-skills.json');
   */
  async readJSON<T>(...segments: string[]): Promise<T | undefined> {
    const filePath = this.getPath(...segments);
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (err: unknown) {
      // ENOENT（文件不存在）是正常情况，首次使用时文件尚未创建
      if (isNodeError(err) && err.code === 'ENOENT') {
        this.outputChannel.appendLine(
          `[UserDataManager] 文件不存在（首次使用）: ${filePath}`,
        );
        return undefined;
      }
      const message = err instanceof Error ? err.message : String(err);
      this.outputChannel.appendLine(
        `[UserDataManager] 读取 JSON 失败: ${filePath} — ${message}`,
      );
      return undefined;
    }
  }

  /**
   * 将对象序列化为 JSON 并写入文件
   *
   * 自动创建父目录（如果不存在）。
   *
   * @param data - 要写入的数据
   * @param segments - 相对于数据根目录的路径片段
   *
   * @example
   * await manager.writeJSON([skill1, skill2], 'skills', 'custom-skills.json');
   */
  async writeJSON<T>(data: T, ...segments: string[]): Promise<void> {
    const filePath = this.getPath(...segments);
    try {
      // 确保父目录存在
      const dir = path.dirname(filePath);
      await fs.promises.mkdir(dir, { recursive: true });

      const content = JSON.stringify(data, null, 2);
      await fs.promises.writeFile(filePath, content, 'utf-8');

      this.outputChannel.appendLine(
        `[UserDataManager] 已写入: ${filePath}`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.outputChannel.appendLine(
        `[UserDataManager] 写入 JSON 失败: ${filePath} — ${message}`,
      );
      throw new Error(`写入文件失败: ${filePath} — ${message}`);
    }
  }

  /**
   * 检查数据目录下某个路径是否存在
   *
   * @param segments - 相对于数据根目录的路径片段
   */
  async exists(...segments: string[]): Promise<boolean> {
    const filePath = this.getPath(...segments);
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 释放资源
   */
  dispose(): void {
    this._onDidChangeRoot.dispose();
  }

  // ────────────────────────────────────────────────────────────────
  // 静态辅助方法
  // ────────────────────────────────────────────────────────────────

  /**
   * 从 VSCode 配置中读取 userDataDir 值
   */
  static getConfiguredDir(): string {
    return vscode.workspace
      .getConfiguration('browserAgent')
      .get<string>('userDataDir', DEFAULT_DIR);
  }

  /**
   * 解析目录路径：展开 ~ 为用户 home 目录
   */
  static resolveDir(dir: string): string {
    if (dir.startsWith('~/') || dir === '~') {
      return path.join(os.homedir(), dir.slice(1));
    }
    return path.resolve(dir);
  }
}

// ────────────────────────────────────────────────────────────────
// 辅助类型守卫
// ────────────────────────────────────────────────────────────────

/** Node.js 系统错误类型守卫 */
function isNodeError(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && 'code' in err;
}
