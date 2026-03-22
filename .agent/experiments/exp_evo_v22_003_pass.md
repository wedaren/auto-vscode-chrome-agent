## 任务
evo_v22_003: 增强 injectBilingual 防御性自动解包：当 translations 为 {translations:[...]} 包装对象时自动提取

## 假设
在 executeInjectBilingual 的 JSON.parse 后、Array.isArray 检查前，增加对象解包逻辑：检测 parsed 是否为非数组对象且含 translations 属性为数组，如果是则自动提取。

## 执行内容摘要
- 修改 `packages/chrome-ext/utils/action-executor.ts` 中 executeInjectBilingual 函数
- 在 `JSON.parse` 后增加防御性自动解包逻辑：当 parsed 为 `{translations: [...]}` 包装对象时提取内部数组
- `const` → `let` 让 parsed 可重赋值
- 更新错误消息说明支持的格式
- 现在 injectBilingual 支持三种输入格式：`{id,translated}[]`、`string[]`、`{translations:[...]}` 包装对象

## 验收命令输出
```
✔ Finished in 2.084 s
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
