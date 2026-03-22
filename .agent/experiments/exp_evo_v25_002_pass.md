## 任务
evo_v25_002: Chrome 侧 ImagePreview 组件：base64 缩略图渲染 + 点击 Lightbox 全屏查看

## 假设
创建独立的 ImagePreview.tsx 组件，接收 src prop（data URL 或普通 URL），
使用 React useState 控制 Lightbox 开关，useEffect 监听 ESC 键关闭。
缩略图使用 inline style 实现 max-width 100%、圆角、阴影；
Lightbox 使用 fixed 定位 overlay，点击背景或 ESC 关闭。

## 执行内容摘要
- 创建了 `packages/chrome-ext/components/ImagePreview.tsx`
  - ImagePreviewProps 接口：src (必选), alt (可选)
  - 缩略图：max-width 100%、border-radius 8px、box-shadow、cursor pointer、loading lazy
  - Lightbox overlay：fixed 全屏、rgba(0,0,0,0.85) 背景、z-index 9999
  - 关闭机制：点击 overlay 背景关闭 + ESC 键关闭 + 右上角关闭按钮
  - 图片点击 stopPropagation 防止误关闭
  - 使用 className `image-preview-thumbnail` 和 `image-lightbox-overlay` 便于后续 CSS 覆盖

## 验收命令输出
```
✔ Finished in 2.196 s
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无。acceptance_cmd 通过（文件存在、包含 Lightbox/overlay 关键字、构建成功）；ImagePreview.tsx 无 TypeScript 错误；仅依赖 react，无外部依赖；符合 program.md 全部约束；文件顶部注释完整。
