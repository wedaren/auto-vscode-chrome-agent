## 任务
evo_v17_002: Chrome 侧上下文采集预截断：content.ts selectedText 限制 + usePageContext 防护

## 假设
在 Chrome 侧两层防御截断：
1. content.ts 源头截断 — selectedText 在 GET_PAGE_CONTEXT 和 selectionchange 事件中采集时直接 substring(0, 8000)
2. usePageContext hook 二次防护 — sanitizeContext() 对 url/title/selectedText 三个字段做截断兜底

## 执行内容摘要
- content.ts: 新增 MAX_SELECTED_TEXT_CHARS=8000 常量，GET_PAGE_CONTEXT handler 和 selectionchange listener 中对 selectedText 做 substring 截断，超长时打印日志
- usePageContext.ts: 新增 MAX_URL_CHARS=2000、MAX_TITLE_CHARS=500、MAX_SELECTED_TEXT_CHARS=8000 常量，新增 sanitizeContext() 函数，在 fetchPageContext 和 handleMessage 两个 setPageContext 入口处应用

## 验收命令输出
```
└─ .output/chrome-mv3/assets/sidepanel-COA8wRtC.css  30.67 kB
Σ Total size: 1.32 MB
✔ Finished in 2.072 s
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
