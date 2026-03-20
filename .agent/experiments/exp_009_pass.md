# exp_009 — MVP 全量验收

## 任务
task_009: MVP 全量验收

## 验收命令
```bash
cd packages/vscode-ext && npm run compile 2>&1 | grep -c 'error' | xargs -I{} test {} -eq 0 && cd ../chrome-ext && npm run build 2>&1 | grep -i 'error' | wc -l | xargs -I{} test {} -eq 0 && echo PASS || echo 'FAIL: 最终构建失败'
```

## 结果
PASS

## 详情
- VSCode 插件 `npm run compile` (tsc) 无错误
- Chrome 插件 `npm run build` (wxt build) 无错误，总产物 197.54 kB
- vscode.lm API 在 lm-service.ts 和 report-generator.ts 中使用 ✅
- WebSocket 端口 7777 配置正确 ✅
- Chrome 插件有 WebSocket 客户端 (ws-client.ts) ✅
- 无外部 API key 依赖 ✅
- Chrome 插件不内置模型 ✅

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
