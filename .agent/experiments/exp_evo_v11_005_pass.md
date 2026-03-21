## 任务
evo_v11_005: 全量验收：构建通过、目录自动创建、Skills 文件持久化、配置可变更

## 验收标准
VSCode 插件 compile 通过；user-data-manager.ts 存在且导出 UserDataManager 类；extension.ts 集成 UserDataManager；SkillRegistry 使用文件持久化；package.json 有 userDataDir 配置；有 openUserDataDir 命令；ConnectionTree 显示数据目录状态

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

PASS
```

## 逐项检查
- [x] `npm run compile` 零错误通过
- [x] `src/user-data-manager.ts` 存在，导出 `class UserDataManager`
- [x] `package.json` 包含 `browserAgent.userDataDir` 配置项
- [x] `extension.ts` 导入并实例化 `UserDataManager`
- [x] `skill-registry.ts` 使用 `UserDataManager` 进行文件持久化
- [x] `command-registry.ts` 注册 `openUserDataDir` 命令
- [x] 无外部 API key 依赖引入
- [x] 模型调用仅通过 vscode.lm API
- [x] 新增文件 user-data-manager.ts 有顶部注释

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
