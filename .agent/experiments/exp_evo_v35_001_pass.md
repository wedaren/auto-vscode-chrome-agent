## 任务
evo_v35_001: DeepResearchEngine 核心引擎 — 迭代式研究循环 + 研究计划 + 引用追踪

## 假设
将 report-generator.ts 重构为 deep-research-engine.ts，实现 Gemini 风格的迭代式深度调研引擎：
- 6 阶段研究循环：plan → search → read → reason → gap-detect → re-plan
- 结构化研究计划数据模型（子问题 + 搜索策略）
- CitationTracker 引用追踪器（URL + 标题 + 原文摘录）
- 使用 BrowserToolProvider (browser_*) 替代 McpClient

## 执行内容摘要
- 创建 `packages/vscode-ext/src/deep-research-engine.ts`（~550 行）
  - 数据模型：Citation, Finding, SearchStrategy, SubQuestion, ResearchPlan, DeepResearchConfig, DeepResearchResult
  - CitationTracker 类：引用去重（URL 索引）、自增编号、参考文献 Markdown 生成
  - DeepResearchEngine 类：6 阶段迭代循环
    - createResearchPlan(): LM 生成子问题和搜索策略
    - executeSearchStrategies(): browser_navigate + browser_get_links 搜索发现 URL
    - readPages(): browser_navigate + browser_get_text + browser_get_page_info 阅读页面
    - reasonAboutFindings(): LM 分析发现并绑定引用到子问题
    - detectGaps(): LM 评估子问题回答质量，标记 gap
    - replan(): 为差距生成新搜索策略
    - generateStructuredReport(): LM 生成带引用标注的 Markdown 报告
  - WebSocket 通知：deep_research_progress / deep_research_plan / deep_research_report
  - 安全措施：CancellationToken、JSON 容错解析、页面数/迭代数上限
- 修改 `packages/vscode-ext/src/extension.ts`
  - ReportGenerator → DeepResearchEngine
  - 构造函数改为注入 BrowserToolProvider（替代 McpClient）
- 修改 `packages/vscode-ext/src/command-registry.ts`
  - ReportGenerator → DeepResearchEngine
  - generateReport 命令调用 deepResearchEngine.generate()

## 验收命令输出
```
PASS
```

## 结果
pass
