## 任务
evo_v19_001: 沉浸式翻译浏览器工具：browser_extract_paragraphs + browser_inject_bilingual

## 假设
按照现有 browser tool 模式（TOOL_MAPPINGS + BrowserToolDef + ActionType + executor 函数），新增两个工具即可满足沉浸式翻译需求。

## 执行内容摘要
- `packages/vscode-ext/src/browser-tools.ts`:
  - TOOL_MAPPINGS 新增 browser_extract_paragraphs（→extractParagraphs）和 browser_inject_bilingual（→injectBilingual）
  - BROWSER_TOOLS 新增两个完整工具定义（含 inputSchema）
- `packages/chrome-ext/utils/action-executor.ts`:
  - ActionType 新增 `extractParagraphs` | `injectBilingual`
  - BrowserAction 新增 scopeSelector / injectMode / translations 字段
  - 实现 detectMainContent()：自动检测 article > main > .content > body
  - 实现 executeExtractParagraphs()：遍历 DOM 提取段落级标签，设置 data-imt-id
  - 实现 executeInjectBilingual()：inject（创建 .imt-translation div）/ toggle（显示隐藏）/ clear（清除所有）
  - .imt-translation CSS 样式注入（蓝色左边框 + 浅蓝背景）

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
