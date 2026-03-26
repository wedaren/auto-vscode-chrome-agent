## 任务
evo_v34_004: VSCode browser-tools.ts — browser_inject_bilingual Schema 扩展 displayMode

## 假设
在 browser-tools.ts 中扩展 browser_inject_bilingual 工具的 Schema 定义，添加 setDisplayMode 模式和 displayMode 参数，使 LLM 能通过工具调用切换三种显示模式。同时更新 TOOL_MAPPINGS 的 argMapping 确保 displayMode 字段正确传递到 Chrome 侧。

## 执行内容摘要
- TOOL_MAPPINGS 中 browser_inject_bilingual 的 argMapping 添加 `displayMode: 'displayMode'` 映射
- BROWSER_TOOLS Schema 中 browser_inject_bilingual 的 description 更新，说明 setDisplayMode 模式
- mode 属性 enum 扩展为 `['inject', 'toggle', 'clear', 'setDisplayMode']`
- mode 属性 description 更新，说明 setDisplayMode 用途
- 新增 displayMode 属性：type string, enum `['bilingual', 'original', 'translated']`, default 'bilingual'
- displayMode 的 description 详细说明三种模式的效果

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
