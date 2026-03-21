## 任务
evo_v18_001: 扩展核心浏览器工具集：browser-tools.ts 新增 5 个工具 + action-executor.ts 新增 3 个 ActionType

## 假设
在现有 10 个浏览器工具基础上，新增 5 个高价值工具（querySelectorAll / getValue / evaluate / selectOption / getLinks），为后续复杂 Skill 编排提供基础能力。Chrome 侧 action-executor 对应新增 3 个执行实现（evaluate / selectOption / getLinks），其中 querySelectorAll 和 getValue 已有实现只需要加工具定义映射。

## 执行内容摘要
- **browser-tools.ts**: TOOL_MAPPINGS 新增 5 条映射（browser_query_selector_all → querySelectorAll, browser_get_value → getValue, browser_evaluate → evaluate, browser_select_option → selectOption, browser_get_links → getLinks）
- **browser-tools.ts**: BROWSER_TOOLS 数组新增 5 个完整工具定义，含 inputSchema + description
- **action-executor.ts**: ActionType 联合类型新增 `evaluate | selectOption | getLinks`
- **action-executor.ts**: BrowserAction 接口新增 `expression / optionValue / optionText / maxCount` 字段
- **action-executor.ts**: 新增 `executeEvaluate()`（通过 new Function 执行 JS）、`executeSelectOption()`（按 value/text 选择下拉项 + change 事件）、`executeGetLinks()`（提取页面 a[href] 链接数组）3 个实现函数
- **action-executor.ts**: executeAction switch 分支新增 3 个 case
- querySelectorAll 的 limit 参数通过 maxCount 传递，兼容老逻辑

## 验收命令输出
```
✔ Finished in 4.208 s
PASS
```

## 结果
pass
