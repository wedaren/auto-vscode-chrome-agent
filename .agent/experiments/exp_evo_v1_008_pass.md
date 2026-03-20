## 任务
evo_v1_008: MessageBubble 组件：Markdown 渲染 + 代码语法高亮 + 代码块复制按钮

## 假设
使用 marked + highlight.js 实现 assistant 消息的 Markdown 渲染和代码高亮，通过自定义 renderer 在代码块中注入复制按钮 HTML，用 useEffect 绑定点击事件实现复制功能。

## 执行内容摘要
- 安装 `marked` (v17) 和 `highlight.js` (v11) 依赖
- 新建 `components/MessageBubble.tsx`：
  - assistant 消息通过 marked 渲染 Markdown，highlight.js 语法高亮
  - 自定义 marked renderer 的 `code` 方法，注入 `.code-block-wrapper` 容器和 `.code-copy-btn` 复制按钮
  - useEffect 中为复制按钮绑定 click 事件，使用 `navigator.clipboard.writeText`
  - user 消息保持纯文本渲染
- 修改 `entrypoints/sidepanel/App.tsx`：导入 MessageBubble，替换原有内联消息渲染
- 修改 `assets/style.css`：添加完整 Markdown 样式（标题/列表/链接/行内代码/代码块/引用/表格/分割线）和复制按钮悬浮显示效果

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：98/100
问题：
- tsc --noEmit 有 WXT 框架 browser 全局变量类型错误（非本任务引入，WXT 构建通过，扣 2 分）
- 其余全部合规：顶部注释完整、marked/highlight.js 为纯客户端库无需 API key、Chrome 侧不内置模型、App.tsx 已集成 MessageBubble
