## 任务
task_006: 页面上下文感知（URL / 标题 / 选中文本）

## 假设
Content script 通过 `location.href`、`document.title`、`window.getSelection()` 采集页面上下文，
background script 中转消息，side panel 在发送聊天消息时自动附加上下文。

## 执行内容摘要
- 重写 `entrypoints/content.ts`：响应 GET_PAGE_CONTEXT 请求，监听 selectionchange 主动推送
- 重写 `entrypoints/background.ts`：中转 PAGE_CONTEXT / SELECTION_CHANGED 消息，监听 tab 切换/更新事件
- 更新 `entrypoints/sidepanel/App.tsx`：新增 pageContext state，首次加载获取上下文，监听上下文变化，发送消息时附带 context 字段，新增上下文状态栏 UI

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
