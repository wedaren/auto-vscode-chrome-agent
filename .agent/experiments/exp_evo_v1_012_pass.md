## 任务
evo_v1_012: 修复 chat 消息处理：提取 context 并拼入 LM 调用的 system prompt

## 假设
Chrome 侧已经在 chat 消息中发送 context（url/title/selectedText），但 VSCode 侧的 chat 处理器忽略了 context 字段，使用硬编码的 system prompt。需要提取 context 并动态拼入 system prompt，让 LM 感知用户当前浏览的页面上下文。

## 执行内容摘要
- 修改 extension.ts chat 处理器，从 msg.payload 提取 context 字段（url/title/selectedText）
- 动态构建 system prompt：基础 prompt 不变，有 url 时追加"用户正在浏览 {url} ({title})"，有 selectedText 时追加选中文本内容
- 将动态 systemPrompt 传入 lmService.sendMessageStreaming() 替代硬编码字符串
- 添加 context 日志输出便于调试

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无问题。acceptance_cmd 通过（grep context/url/title/selectedText 均匹配 + 编译零错误）；TypeScript strict 模式编译无报错；代码仅通过 vscode.lm API 调用模型，无外部 API key 依赖；extension.ts 顶部注释完整；context 提取和 system prompt 动态拼接逻辑正确。
