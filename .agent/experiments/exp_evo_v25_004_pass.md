## 任务
evo_v25_004: MessageBubble Markdown 图片渲染 + 图片 CSS 样式体系（缩略图 + Lightbox overlay）

## 假设
在 marked 实例中添加 image() 自定义渲染器输出带 CSS class 的 <img> 标签；通过事件委托实现点击图片打开 Lightbox；CSS 完整覆盖缩略图样式和 Lightbox overlay 样式。

## 执行内容摘要
- `MessageBubble.tsx` createMarkedInstance() 添加 `image()` 渲染器，将 `![alt](href "title")` 渲染为 `<img src="..." alt="..." class="markdown-inline-image" loading="lazy" />`
- `MessageBubble.tsx` 组件添加 `lightboxSrc` 状态，通过 useEffect 事件委托监听 `.markdown-inline-image` 点击，打开 Lightbox
- `MessageBubble.tsx` 添加 ESC 键关闭 Lightbox 的 useEffect
- `MessageBubble.tsx` assistant 消息 JSX 末尾添加 Lightbox overlay 渲染（`.image-lightbox-overlay` + `.image-lightbox-close` + `.image-lightbox-img`）
- `style.css` 添加 `.message-bubble-markdown img` 样式（max-width:100%, border-radius:8px, box-shadow, cursor:pointer, hover 放大效果）
- `style.css` 添加 `.image-lightbox-overlay` 全屏覆盖样式（fixed, rgba 背景, z-index:9999, fade-in 动画）
- `style.css` 添加 `.image-lightbox-img` 和 `.image-lightbox-close` 样式

## 验收命令输出
```
✔ Finished in 2.262 s
PASS
```

## 结果
pass
