## 任务
evo_v21_001: 修复 immersive_translate 及所有预设 Skill 的 argsTemplate 参数名不匹配问题

## 假设
immersive_translate 步骤 2 的 argsTemplate 使用了错误的参数名 `paragraphs`，而 llm_translate 工具期望的是 `texts`。审计全部 20 个预设 Skill 的 argsTemplate，确保参数名与目标工具一致。

## 执行内容摘要
- 审计了全部 20 个预设 Skill 的 argsTemplate：
  - 对照 browser-tools.ts 中 17 个 browser_* 工具的 inputSchema 参数名
  - 对照 llm-tools.ts 中 llm_translate 的参数名（texts, targetLanguage, sourceLanguage）
  - 对照 chrome-devtools-mcp 的 12 个工具参数名
- 发现唯一不匹配：immersive_translate 步骤 2 `paragraphs` → 应为 `texts`
- 修改 skill-registry.ts 第 169 行：`paragraphs: '{{$prev}}'` → `texts: '{{$prev}}'`

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

验收明细：
- acceptance_cmd：PASS（60/60）— `texts: '{{$prev}}'` 存在，`paragraphs.*$prev` 已不存在，`npm run compile` 零错误
- TypeScript 编译：零错误（20/20）— `tsc -p ./tsconfig.json` 无输出
- program.md 约束：全部满足（20/20）— 改动仅涉及 skill-registry.ts 参数名修正，不引入外部依赖，不涉及模型调用路径变更
