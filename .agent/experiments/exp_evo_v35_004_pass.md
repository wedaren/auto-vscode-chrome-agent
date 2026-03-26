## 任务
evo_v35_004: 结构化报告模板 + 引用渲染 + 一键导出（.md / .html）

## 假设
在 ReportRenderer 组件中新增导出按钮，创建 report-export.ts 工具模块提供 .md 和 .html 两种格式导出。报告模板结构（目录/摘要/分主题/结论/参考文献）由 VSCode 侧 LLM prompt 保证，Chrome 侧负责渲染和导出。

## 执行内容摘要
- 创建 `packages/chrome-ext/utils/report-export.ts`
  - `exportReportAsMarkdown()` — 保留 LLM 结构化报告 + 自动补参考文献 + 元数据尾注 → .md 下载
  - `exportReportAsHtml()` — simpleMarkdownToHtml 转换 + 内嵌 CSS + [N] 引用锚点跳转 + 参考文献 HTML → 自包含 .html 下载
  - `triggerDownload()` — Blob → createObjectURL → 隐藏 <a> 点击下载 → 清理
- 修改 `packages/chrome-ext/components/ResearchPanel.tsx`
  - 导入 exportReportAsMarkdown / exportReportAsHtml
  - ReportRenderer 新增导出按钮行（.md / .html）
  - handleExportMd / handleExportHtml 回调
- 修改 `packages/chrome-ext/assets/style.css`
  - 新增 `.report-export-btn` 按钮样式（indigo 配色，hover/active 状态）

## 验收命令输出
```
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无阻断性问题
- acceptance_cmd PASS（grep 匹配 exportReport + npm run build 零错误）
- vscode-ext compile 零 TS 错误
- report-export.ts 仅依赖本地类型，无外部 API key
- citation-link 点击跳转 + 2s 黄色高亮已实现
- .md / .html 双格式导出按钮已就位
- 符合 program.md 全部约束
