## 任务
evo_v18_003: 新增 10 个高价值内置预设 Skill

## 假设
在 skill-registry.ts 的 PRESET_SKILLS 数组末尾追加 10 个新 Skill 定义，
每个 Skill 充分利用现有的 15 个 browser_* 工具和 {{$prev}}/{{$step_N}} 步骤结果传递语法，
覆盖阅读、链接采集、表格数据、搜索、滚动阅读、打开总结、表单提交、页面信息、多步提取、批量截图等高频场景。

## 执行内容摘要
- 修改 packages/vscode-ext/src/skill-registry.ts
- PRESET_SKILLS 从 5 个增加到 15 个
- 新增的 10 个 Skill：
  1. read_article — 智能提取文章正文（标题+元信息+正文+截图）
  2. capture_all_links — 采集页面全部链接（支持限定区域和数量）
  3. capture_table_data — 提取表格结构化数据（表头+行数据）
  4. search_in_page — 页面内文本搜索（匹配+上下文+滚动定位+截图）
  5. auto_scroll_read — 自动滚动阅读长页面（分屏截图+进度追踪）
  6. open_and_summarize — 导航到 URL 并提取内容供总结（navigate+wait+extract）
  7. fill_and_submit — 识别表单字段并填写提交（扫描结构+高亮+截图）
  8. page_info — 一键获取页面综合信息（URL/Meta/性能/元素统计）
  9. multi_step_extract — 分步骤提取多区域数据（大纲+全文+链接+图片）
  10. batch_screenshot — 从顶到底分段截图（滚动+逐屏捕获）
- 所有 Skill 均使用 browser_evaluate / browser_get_text / browser_screenshot 等已有工具
- 充分利用 {{$prev}} 和 {{$step_N}} 步骤间结果传递

## 验收命令输出
Preset count: 15
PASS

## 结果
pass
