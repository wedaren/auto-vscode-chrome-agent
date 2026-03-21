## 任务
evo_v11_003: 重构 SkillRegistry 持久化：从 workspace config 迁移到 UserDataManager 文件存储

## 假设
SkillRegistry 只需改造构造函数（注入 UserDataManager）、loadSkills()（从文件读取）、saveSkills()（写入文件），并增加迁移方法从旧 workspace config 自动迁移数据。extension.ts 传入 userDataManager 即可。

## 执行内容摘要
- 修改 `skill-registry.ts`：
  - 新增 `import { UserDataManager }` 导入
  - 构造函数新增 `userDataManager: UserDataManager` 参数
  - `loadSkills()` 从同步改为 `async`，使用 `userDataManager.readJSON()` 从 `skills/custom-skills.json` 和 `skills/preset-overrides.json` 加载数据
  - `saveSkills()` 使用 `userDataManager.writeJSON()` 写入对应文件
  - 新增 `migrateFromWorkspaceConfig()` 私有方法：首次加载时检测旧 workspace config 中的 `browserAgent.skills` 和 `browserAgent.skillPresetEnabled`，自动迁移到文件存储并清除旧配置
  - 新增 `CUSTOM_SKILLS_FILE` 和 `PRESET_OVERRIDES_FILE` 常量定义文件路径
- 修改 `extension.ts`：
  - `SkillRegistry` 构造函数传入 `userDataManager`
  - `loadSkills()` 现在是异步的，使用 `.catch()` 处理错误

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
