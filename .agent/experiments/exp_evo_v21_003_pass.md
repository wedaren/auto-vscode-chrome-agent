## 任务
evo_v21_003: SkillRunner 插值增强：支持 {{$prev.key}} 路径表达式从结构化 JSON 中提取字段

## 假设
扩展 interpolateValue 的正则表达式以捕获路径后缀（如 `.key`、`.arr[].field`），新增 resolvePath 方法将 JSON resultText 按路径解析并提取字段值，同时保持原有三种占位符语法完全向后兼容。

## 执行内容摘要
- 更新 `skill-runner.ts` 中 `interpolateValue` 方法的正则，从 `/\{\{(\$prev|\$step_\d+|\w+)\}\}/g` 扩展为支持点路径和数组映射语法
- 新增 `resolvePath(jsonText, path, placeholder)` 私有方法：解析 JSON → 按 `.` 拆分路径段 → 逐段访问属性 → 遇 `[]` 进行数组映射 → 返回字符串
- 新增 `extractNestedField(obj, path)` 辅助方法：用于数组映射内部的嵌套字段提取
- `$prev` 系列：无路径后缀时返回完整 resultText（向后兼容），有路径时调用 resolvePath
- `$step_N` 系列：同理，支持 `{{$step_0.key}}`
- 非 JSON resultText 场景：解析失败时 fallback 返回原始文本并输出警告日志
- 更新 `skill-registry.ts` 中 SkillStep.argsTemplate 的 JSDoc 文档
- 更新 SkillRunner 类顶部 JSDoc 和文件头注释

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
