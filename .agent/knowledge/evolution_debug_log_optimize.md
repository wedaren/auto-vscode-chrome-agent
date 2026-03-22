# Evolution Research: 结合 debug-log 优化体验

## 问题来源
用户提供 debug-log：`~/Downloads/debug-log-2026-03-22T01-04-28-123Z.json`

## Debug Log 分析结果

### 日志概览
- 总日志条目：12 条
- 场景：执行 `immersive_translate` 沉浸式翻译 Skill
- 结果：步骤 2（llm_translate）失败，Skill 提前终止

### 问题 1：argsTemplate 参数名不匹配（Critical）

**位置**：`skill-registry.ts` 第 168-170 行

```typescript
// immersive_translate 步骤 2
toolName: 'llm_translate',
argsTemplate: {
  paragraphs: '{{$prev}}',   // ← 错误！传递了 "paragraphs" 参数名
  targetLanguage: '{{targetLanguage}}',
}
```

**期望**：`llm_translate` 工具期望的参数名是 `texts`（`llm-tools.ts` 第 125 行）

```typescript
const rawTexts = args.texts;  // 只读取 args.texts
```

**结果**：`args.texts` 为 `undefined` → 进入错误分支 → 返回 "缺少 texts 参数或格式不正确"

### 问题 2：llm_translate 参数解析不够健壮（High）

`llm-tools.ts` 第 126-151 行的参数解析逻辑：
- 只检查 `args.texts`，不兼容 `args.paragraphs` 等其他参数名
- 虽然有 `parsed.paragraphs` 的 JSON 解析兼容（第 133 行），但前提是 `rawTexts` 不为空
- 没有 fallback 机制从 args 的其他 key 中寻找文本数组

### 问题 3：{{$prev}} 传递原始 JSON 字符串（High）

`browser_extract_paragraphs` 返回的结果：
```json
{
  "totalExtracted": 200,
  "scope": "(auto-detected)",
  "paragraphs": [
    { "id": "imt-0", "tag": "h1", "text": "Chrome DevTools MCP" },
    ...
  ]
}
```

`{{$prev}}` 将这整个 JSON 字符串传递给下一步。如果 argsTemplate 中能支持路径表达式（如 `{{$prev.paragraphs}}`），就能精准提取需要的字段。

### 问题 4：skill_list_result 重复发送（Medium）

Debug log 中出现两次 `skill_list_result`（log 0 和 log 1），内容完全相同。

原因分析：`SkillPanel.tsx` 第 94-98 行：
```tsx
useEffect(() => {
  if (isConnected) { requestSkillList(); }
}, [isConnected, requestSkillList]);
```
`requestSkillList` 的 useCallback 依赖 `[isConnected, sendMessage]`，当 `sendMessage` 引用变化时会重建 `requestSkillList`，导致 useEffect 重新执行。

## 优化方案

1. **修复 argsTemplate 参数名**：将 `paragraphs` 改为 `texts`，同时审计所有预设 Skill 的参数传递
2. **增强 llm_translate 参数适配**：支持从 args 的多个 key 中提取文本（texts / paragraphs / input）
3. **SkillRunner 路径表达式**：`{{$prev.key}}` / `{{$prev[].key}}` 语法
4. **修复 SkillPanel 重复请求**：使用 ref 追踪请求状态
5. **全量集成验收**
