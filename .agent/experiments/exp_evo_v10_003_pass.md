## 任务
evo_v10_003: Chrome 侧 JSON 下载工具函数：创建 download-llm-detail.ts，将 LlmDetail 数据格式化为可读 JSON 并触发浏览器文件下载（含 timestamp 文件名）

## 假设
创建纯工具函数，使用 Blob + URL.createObjectURL + 隐藏 anchor click 的标准浏览器下载模式，文件名包含日期时间和模型标识。

## 执行内容摘要
- 创建 packages/chrome-ext/utils/download-llm-detail.ts
- 导出 downloadLlmDetail(detail: Record<string, unknown>): void
- buildFilename 生成 llm-detail_YYYY-MM-DD_HH-mm-ss_model.json 格式文件名
- JSON.stringify(detail, null, 2) 格式化为可读 JSON
- Blob + URL.createObjectURL 触发浏览器下载，下载后清理 DOM 和 URL

## 验收命令输出
```
utils/download-llm-detail.ts: * 2. 创建 Blob（application/json MIME）
utils/download-llm-detail.ts: * 3. URL.createObjectURL 生成临时链接
utils/download-llm-detail.ts:export function downloadLlmDetail(detail: Record<string, unknown>): void {
utils/download-llm-detail.ts:  // 创建 Blob 对象
utils/download-llm-detail.ts:  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
utils/download-llm-detail.ts:  const url = URL.createObjectURL(blob);
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无重大问题
- tsconfig.json include 未显式包含 utils/，但 WXT 自动导入机制已正确处理，build 通过
