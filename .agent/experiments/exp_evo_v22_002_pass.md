## 任务
evo_v22_002: 增强 injectBilingual 支持 string[] 平坦数组：自动按索引与 data-imt-id 元素配对

## 假设
llm_translate 返回 string[] 平坦数组时，injectBilingual 当前因期望 {id,translated}[] 格式而失败。只需在 JSON.parse 后检测数组第一个元素类型：如果是 string，则自动按索引映射为 {id:"imt-N", translated:str}，与 extractParagraphs 设置的 data-imt-id 属性一一对应。

## 执行内容摘要
- 修改 `packages/chrome-ext/utils/action-executor.ts` 的 `executeInjectBilingual` inject 分支
- 将 `JSON.parse` 结果先存为 `parsed`，再进行 `Array.isArray` 检查
- 新增 string[] 检测逻辑：`typeof parsed[0] === 'string'` 时，map 为 `{id: "imt-${idx}", translated: text}`
- 原有 `{id, translated}[]` 格式的处理保持不变

## 验收命令输出
```
✔ Finished in 1.722 s
PASS
```

## 结果
pass
