import * as vscode from 'vscode';
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
export declare class UserDataManager {
    /** 当前已解析的数据根目录绝对路径 */
    private rootDir;
    /** 输出日志通道 */
    private readonly outputChannel;
    /** 目录变更事件（init 成功后触发，供外部模块监听并重新加载数据） */
    private readonly _onDidChangeRoot;
    readonly onDidChangeRoot: vscode.Event<string>;
    constructor(outputChannel: vscode.OutputChannel);
    /**
     * 初始化数据目录：创建根目录及所有子目录
     *
     * 幂等操作：目录已存在则跳过。
     * 配置变更后应重新调用此方法。
     */
    init(): Promise<void>;
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
    getPath(...segments: string[]): string;
    /**
     * 获取数据根目录绝对路径
     */
    getRootDir(): string;
    /**
     * 读取 JSON 文件并解析为指定类型
     *
     * @param segments - 相对于数据根目录的路径片段
     * @returns 解析后的对象，文件不存在或解析失败返回 undefined
     *
     * @example
     * const skills = await manager.readJSON<Skill[]>('skills', 'custom-skills.json');
     */
    readJSON<T>(...segments: string[]): Promise<T | undefined>;
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
    writeJSON<T>(data: T, ...segments: string[]): Promise<void>;
    /**
     * 检查数据目录下某个路径是否存在
     *
     * @param segments - 相对于数据根目录的路径片段
     */
    exists(...segments: string[]): Promise<boolean>;
    /**
     * 释放资源
     */
    dispose(): void;
    /**
     * 从 VSCode 配置中读取 userDataDir 值
     */
    static getConfiguredDir(): string;
    /**
     * 解析目录路径：展开 ~ 为用户 home 目录
     */
    static resolveDir(dir: string): string;
}
//# sourceMappingURL=user-data-manager.d.ts.map