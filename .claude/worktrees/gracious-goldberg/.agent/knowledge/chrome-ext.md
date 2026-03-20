# WXT + Chrome Extension Side Panel Research

## 结论
1. WXT 是当前最成熟的 Chrome Extension 框架，原生支持 Manifest V3 和 Side Panel，通过文件命名自动生成 manifest.json。
2. Side Panel 入口创建方式：在 `entrypoints/` 下创建 `sidepanel.html` 或 `sidepanel/index.html`，WXT 自动添加 `sidePanel` 权限。
3. Content Script 与 Side Panel 通信需通过 Background Script 中转，使用 `browser.runtime.sendMessage` / `onMessage` API。

## 关键 API / 配置

### 项目结构
```
packages/chrome-ext/
├── entrypoints/
│   ├── sidepanel/         # Side Panel UI
│   │   ├── index.html
│   │   ├── main.tsx       # React 入口
│   │   └── App.tsx
│   ├── background.ts      # Service Worker
│   └── content.ts         # Content Script（注入页面）
├── components/            # 共享组件
├── wxt.config.ts          # WXT 配置
├── tailwind.config.ts
└── package.json
```

### Side Panel 入口
```html
<!-- entrypoints/sidepanel/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Browser Agent</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.tsx"></script>
</body>
</html>
```

### Content Script 定义
```typescript
// entrypoints/content.ts
export default defineContentScript({
  matches: ['<all_urls>'],
  main(ctx) {
    const pageContext = {
      url: location.href,
      title: document.title,
      selectedText: window.getSelection()?.toString() || ''
    };
  }
});
```

### 消息传递模式
```
Content Script → browser.runtime.sendMessage() → Background Script
Background Script → browser.runtime.sendMessage() → Side Panel
Side Panel → browser.runtime.sendMessage() → Background Script
```

### wxt.config.ts
```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    action: {},  // 必须有空 action 对象以启用 side panel
    permissions: ['activeTab', 'sidePanel'],
  },
});
```

## 注意事项
- **需要空 action 对象**：manifest 中必须有 `"action": {}` 才能让 side panel 正常工作。
- **WXT 自动处理 sidePanel 权限**：创建 sidepanel entrypoint 后自动添加，但 action 需手动声明。
- **HMR 支持**：开发模式下 UI 变更支持热替换，content/background 快速重载。
- **Firefox 兼容**：Firefox 使用 `sidebar_action` API，WXT 可同一代码库跨浏览器构建，但 MVP 阶段只关注 Chrome。

## 来源
- [WXT 官方文档 - Entrypoints](https://wxt.dev/guide/essentials/entrypoints.html)
- [WXT 官方文档 - Content Scripts](https://wxt.dev/guide/essentials/content-scripts.html)
- [WXT 官方站](https://wxt.dev/)
- [Sidepanel Extension Template (WXT + Tailwind + shadcn/ui)](https://github.com/evanlong-me/sidepanel-extension-template)
- [2025 Browser Extension Frameworks 对比分析](https://redreamality.com/blog/the-2025-state-of-browser-extension-frameworks-a-comparative-analysis-of-plasmo-wxt-and-crxjs/)
