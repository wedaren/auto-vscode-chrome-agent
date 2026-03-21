## 任务
evo_v10_004: Chrome UI 下载按钮：MessageBubble assistant 消息底部添加下载图标按钮，有 llmDetail 时激活，点击调用 downloadLlmDetail 触发 JSON 下载

## 假设
在 MessageBubble 组件中新增 llmDetail prop，assistant 消息底部工具栏添加下载按钮（仅 llmDetail 有值时渲染），点击时调用 downloadLlmDetail 触发 JSON 文件下载。App.tsx 将 msg.llmDetail 透传给 MessageBubble。

## 执行内容摘要
- MessageBubble.tsx: 导入 downloadLlmDetail，新增 llmDetail prop，解构到组件参数
- assistant 消息底部：将时间戳和下载按钮合并为 flex 工具栏，llmDetail 存在时显示下载图标+文字按钮
- 下载按钮使用 SVG 下载图标，hover 时变蓝色高亮，点击调用 downloadLlmDetail(llmDetail)
- App.tsx: MessageBubble 调用处新增 llmDetail={msg.llmDetail} 透传

## 验收命令输出
```
components/MessageBubble.tsx:import { downloadLlmDetail } from '../utils/download-llm-detail';
components/MessageBubble.tsx:  llmDetail?: Record<string, unknown>;
components/MessageBubble.tsx:  llmDetail,
components/MessageBubble.tsx:        {/* 下载 LLM 请求细节按钮（仅有 llmDetail 时显示） */}
components/MessageBubble.tsx:        {llmDetail && (
components/MessageBubble.tsx:            onClick={() => downloadLlmDetail(llmDetail)}
entrypoints/sidepanel/App.tsx:                    llmDetail={msg.llmDetail}
PASS
```
WXT build: ✔ Built extension in 1.785 s

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

验收维度明细：
- acceptance_cmd 通过 (60/60)：grep 在 MessageBubble.tsx 匹配到 downloadLlmDetail import、llmDetail prop 定义、解构、条件渲染、onClick 调用；App.tsx 匹配到 llmDetail={msg.llmDetail} 透传。输出 PASS。
- 代码无 TypeScript 错误 (20/20)：llmDetail prop 类型 Record<string, unknown> 与 downloadLlmDetail 函数签名一致；条件渲染 {llmDetail && ...} 确保类型安全；所有文件有顶部注释。
- 符合 program.md 约束 (20/20)：downloadLlmDetail 仅使用浏览器原生 API（Blob、URL.createObjectURL、anchor click）；Chrome 插件未内置模型；无外部 API key 依赖。
