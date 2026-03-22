## 任务
evo_v27_002: 注入 CSS 重设计 — 无边框纯文本沉浸式风格，参考沉浸式翻译扩展

## 假设
将 IMT_CSS 从蓝色边框卡片样式改为无边框纯文本样式：移除 border-left、background、padding、border-radius，使用柔和灰色 #888 + 较小字号 0.88em，实现与沉浸式翻译扩展截图一致的效果。

## 执行内容摘要
- 修改 `packages/chrome-ext/utils/action-executor.ts` 中的 IMT_CSS 常量
- 移除: border-left: 3px solid #4287f5, background: rgba(66,135,245,0.06), padding: 6px 12px, border-radius: 0 4px 4px 0
- 新增: margin: 0, color: #888, font-size: 0.88em, line-height: 1.5, word-break: break-word
- 更新注释说明风格参考

## 验收命令输出
```
PASS
```

## 结果
pass
