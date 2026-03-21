## 任务
evo_v11_004: 添加用户数据目录管理命令 + ConnectionTree 状态展示

## 假设
在 CommandRegistry 中新增 openUserDataDir / revealUserDataDir 两个命令，注入 UserDataManager；
在 ConnectionTreeDataProvider 中新增第 5 个顶级节点展示 userDataDir 路径和磁盘占用。

## 执行内容摘要
- command-registry.ts: 注入 UserDataManager，新增 registerOpenUserDataDir() 和 registerRevealUserDataDir()
- connection-tree.ts: 新增 'user-data' nodeType，getRootItems 添加用户数据目录节点，getUserDataChildren 展示路径/磁盘占用/配置来源
- connection-tree.ts: 新增 updateDiskUsage / calculateDirSize / formatBytes 辅助方法
- package.json: 声明 openUserDataDir 和 revealUserDataDir 两个命令
- extension.ts: 传递 userDataManager 到 CommandRegistry 和 ConnectionTree.bind()

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
