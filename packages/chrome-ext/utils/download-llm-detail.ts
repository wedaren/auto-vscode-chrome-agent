// download-llm-detail.ts — LLM 请求细节 JSON 下载工具函数
// 将 LlmDetail 数据格式化为可读 JSON 并触发浏览器文件下载（含 timestamp 文件名）

/**
 * 生成带时间戳的下载文件名
 *
 * 格式：llm-detail_YYYY-MM-DD_HH-mm-ss.json
 * 使用本地时间，文件名安全字符（连字符替代冒号）
 */
function buildFilename(detail: Record<string, unknown>): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const model = typeof detail.model === 'string' ? `_${detail.model.replace(/[^a-zA-Z0-9._-]/g, '_')}` : '';
  return `llm-detail_${date}_${time}${model}.json`;
}

/**
 * 将 LlmDetail 数据格式化为可读 JSON 并触发浏览器文件下载
 *
 * 实现方式：
 * 1. JSON.stringify 格式化（2 空格缩进）
 * 2. 创建 Blob（application/json MIME）
 * 3. URL.createObjectURL 生成临时链接
 * 4. 自动点击隐藏 <a> 触发下载
 * 5. 清理临时 URL 和 DOM 元素
 *
 * @param detail - LlmDetail 对象（由 VSCode 侧 LlmRequestCollector 采集）
 */
export function downloadLlmDetail(detail: Record<string, unknown>): void {
  // 格式化为可读 JSON（2 空格缩进）
  const jsonStr = JSON.stringify(detail, null, 2);

  // 创建 Blob 对象
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });

  // 生成临时下载 URL
  const url = URL.createObjectURL(blob);

  // 创建隐藏的 <a> 元素触发下载
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = buildFilename(detail);
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();

  // 清理：移除 DOM 元素 + 释放 Object URL
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
