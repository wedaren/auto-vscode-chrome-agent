## 任务
evo_v2_002: VSCode 重构：从 extension.ts 抽取 CommandRegistry 命令注册模块

## 假设
本次尝试：创建 CommandRegistry 类封装 generateReport/connectDevtools/ask 三个命令注册，extension.ts 仅保留 activate/deactivate 编排逻辑

## 执行内容摘要
- 新建 src/command-registry.ts，包含 CommandRegistry 类，提供 registerAll() 方法返回 Disposable[]
- 三个命令注册逻辑完整迁移：registerGenerateReport / registerConnectDevtools / registerAsk
- extension.ts 从 145 行缩减到 64 行，仅保留服务初始化 + 消息处理器注册 + CommandRegistry 调用 + dispose 编排
- 编译通过，无错误

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
