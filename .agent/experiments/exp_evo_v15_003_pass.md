## 任务
evo_v15_003: 工具参数自动修正：tool-bridge.ts toAction 增加 type 操作 text→value 兼容映射 + browser-tools.ts 优化 browser_type 描述防止 LLM 混淆

## 假设
LLM 调用 browser_type 工具时常将 value 参数误写为 text，导致 type 操作无法正确输入文本。通过两层防护解决：
1. Chrome 侧 tool-bridge.ts 的 toAction() 自动检测并修正 text→value
2. VSCode 侧 browser-tools.ts 的工具描述中明确强调使用 value 而非 text

## 执行内容摘要
- 修改 `packages/chrome-ext/utils/tool-bridge.ts` toAction() 函数：当 toolName==='type' 且有 text 无 value 时自动映射 text→value 并打印警告日志
- 修改 `packages/vscode-ext/src/browser-tools.ts` browser_type 工具定义：description 增加 "IMPORTANT: Use the `value` parameter (NOT `text`)"，value 参数描述增加 "do NOT use a "text" parameter instead"

## 验收命令输出
```
    description: 'Type text into an input or textarea element. Clears the existing value first, then sets the new value and fires input/change events. IMPORTANT: Use the `value` parameter (NOT `text`) to specify the string to type.',
        value: { type: 'string', description: 'The text to type into the element. This is the value parameter — do NOT use a "text" parameter instead.' },
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

### 验收详情
| 项目 | 分值 | 得分 | 说明 |
|---|---|---|---|
| acceptance_cmd 通过 | 60 | 60 | grep 匹配 text→value 映射逻辑 ✅；chrome-ext build ✅；vscode-ext grep 匹配 NOT text / value parameter ✅；vscode-ext compile ✅；输出 PASS |
| 代码无 TypeScript 错误 | 20 | 20 | chrome-ext `npm run build` 零错误 ✅；vscode-ext `npm run compile` 零错误 ✅ |
| 符合 program.md 约束 | 20 | 20 | 无外部 API key 依赖 ✅；Chrome 插件不内置模型 ✅；模型调用仅通过 vscode.lm API ✅；文件有顶部注释 ✅ |
