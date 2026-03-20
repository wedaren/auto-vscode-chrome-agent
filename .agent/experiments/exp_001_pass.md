## 任务
task_001: 初始化 monorepo 项目结构

## 假设
创建 pnpm workspaces monorepo，根目录 package.json + pnpm-workspace.yaml，两个子包各自有 package.json 和 TypeScript 配置。

## 执行内容摘要
- 创建根 `package.json`（private, pnpm scripts）
- 创建 `pnpm-workspace.yaml`（packages/*）
- 创建 `tsconfig.base.json`（共享 TS 严格模式配置）
- 创建 `packages/vscode-ext/package.json`（ws, @types/vscode 等依赖）
- 创建 `packages/vscode-ext/tsconfig.json`（继承 base）
- 创建 `packages/vscode-ext/src/extension.ts`（最小 activate/deactivate）
- 创建 `packages/chrome-ext/package.json`（wxt, react, tailwind 等依赖）
- 创建 `packages/chrome-ext/tsconfig.json`（JSX + Bundler 模式）
- 创建 `packages/chrome-ext/wxt.config.ts`（Side Panel 配置）
- 运行 `pnpm install` 成功，441 packages installed

## 验收命令输出
```
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
