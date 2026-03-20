## 任务
task_004: Chrome 插件骨架（WXT）+ side panel UI

## 假设
使用 WXT 框架文件约定式路由创建 Chrome 插件骨架，entrypoints/sidepanel/ 作为 Side Panel 入口，React + Tailwind 构建对话 UI，包含消息列表、快捷按钮和输入框组件。

## 执行内容摘要
- 创建 `entrypoints/sidepanel/index.html` — Side Panel HTML 入口
- 创建 `entrypoints/sidepanel/main.tsx` — React 挂载点
- 创建 `entrypoints/sidepanel/App.tsx` — 主组件（消息列表 + 快捷按钮 + 输入框）
- 创建 `components/ChatInput.tsx` — 对话输入框组件（Enter 发送 + 自动高度）
- 创建 `entrypoints/background.ts` — Service Worker 消息中枢
- 创建 `entrypoints/content.ts` — Content Script 占位
- 创建 `assets/style.css` — Tailwind CSS 入口
- 创建 `tailwind.config.ts` + `postcss.config.cjs`
- 修复 `@wxt-dev/module-react` 版本兼容性（pin 1.1.5，避免 vite 8 依赖冲突）
- 更新 `wxt.config.ts` 添加 `action: {}` 以支持 side panel

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
