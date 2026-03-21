## 任务
evo_v19_002: SkillRunner LLM 工具路由：新增 llm_translate 批量翻译工具

## 假设
在 SkillRunner 的 callTool 路由中新增 llm_* 前缀判断，路由到新建的 llm-tools.ts 模块；
llm_translate 工具通过 LmService.sendMessage 调用 vscode.lm API，使用精构 prompt 让 LLM 返回 JSON 数组格式的批量翻译结果；
支持分批翻译（每批 ≤ 20 段）、多种响应格式解析降级、上游 {{$prev}} 结果自动解析。

## 执行内容摘要
- 创建了 `packages/vscode-ext/src/llm-tools.ts`：
  - LLM 工具注册表（isLlmTool / callLlmTool / listLlmTools）
  - llm_translate 实现：参数解析（兼容 JSON 字符串/数组/paragraphs 格式）、分批翻译、prompt 构造、响应解析（JSON 直解/markdown 代码块/括号提取/行拆分降级）
  - LlmTranslateArgs / LlmTranslateResult 类型定义
- 修改了 `packages/vscode-ext/src/skill-runner.ts`：
  - 新增 LmService 和 llm-tools 导入
  - constructor 新增可选 lmService 参数
  - callTool 路由新增 llm_* 前缀判断（browser_ → BrowserToolProvider, llm_ → LlmTools, 其余 → McpClient）
  - executeStep / callTool 透传 CancellationToken 给 LLM 工具
- 修改了 `packages/vscode-ext/src/extension.ts`：
  - SkillRunner 构造时传入 lmService 实例

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
