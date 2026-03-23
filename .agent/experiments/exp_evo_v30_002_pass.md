## 任务
evo_v30_002: 更新 immersive_translate Skill 定义 — 2 步流（extract → progressive_translate_inject）

## 假设
将 skill-registry.ts 中 immersive_translate Skill 的 steps 从 4 步（extract → llm_translate → inject → screenshot）改为 2 步（extract → llm_translate_progressive），因为 llm_translate_progressive 已内置翻译+注入逻辑。

## 执行内容摘要
- **skill-registry.ts**：
  - 删除原步骤 2（llm_translate）、步骤 3（browser_inject_bilingual）、步骤 4（browser_screenshot optional）
  - 新增步骤 2：llm_translate_progressive，argsTemplate 传递 `paragraphs: '{{$prev}}'` 和 `targetLanguage: '{{targetLanguage}}'`
  - 步骤 1 browser_extract_paragraphs 保持不变
- **tasks.json**：修正 acceptance_cmd 的 grep 上下文窗口（-A 20 → -A 30）并使用更精确的模式匹配

## 验收命令输出
```
⚡ Done in 41ms
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
