## 任务
evo_v28_001: 新增 CSP 安全的 browser_get_page_info 工具 — content script 直接读取 DOM 属性，不依赖 eval

## 假设
在 action-executor.ts 新增 getPageInfo action，直接通过 document.documentElement 的 DOM 属性读取页面尺寸和滚动位置信息，完全不使用 eval/new Function，从而在 CSP 严格页面上也能正常工作。在 browser-tools.ts 注册 browser_get_page_info 工具并映射到 getPageInfo action。

## 执行内容摘要
- action-executor.ts: 在 ActionType 联合类型中新增 `'getPageInfo'`
- action-executor.ts: 新增 `executeGetPageInfo()` 函数，直接读取 DOM 属性：
  - `document.documentElement.scrollHeight/scrollWidth/clientHeight/clientWidth`
  - `window.scrollY/scrollX`（含 pageYOffset/pageXOffset 兼容）
  - `document.title`、`window.location.href`、`document.readyState`
  - 计算 `totalScreens = ceil(scrollHeight / clientHeight)`
- action-executor.ts: 在 executeAction switch 中新增 `case 'getPageInfo'`
- browser-tools.ts: 在 TOOL_MAPPINGS 中新增 `browser_get_page_info → getPageInfo`
- browser-tools.ts: 在 BROWSER_TOOLS 数组中新增工具定义（无参数，描述返回字段）

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
