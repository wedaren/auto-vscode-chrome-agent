## 任务
evo_v24_003: MessageHandler 传递模型配置到 Chrome：models_list payload 扩展 defaultModelId + maxVisibleModels 字段

## 假设
在 handleListModels 的两个发送路径（节流缓存路径 + 新鲜获取路径）中，调用 lmService.getModelPreferences() 获取 defaultModelId 和 maxVisibleModels，扩展到 models_list payload 中即可。

## 执行内容摘要
- 修改 `packages/vscode-ext/src/message-handler.ts` 的 `handleListModels` 方法
- 在节流缓存路径（第一个 wsServer.send）中：调用 `this.lmService.getModelPreferences()` 获取偏好配置，将 `defaultModelId`（空字符串转 undefined）和 `maxVisibleModels` 添加到 payload
- 在新鲜获取路径（async 内的 wsServer.send）中：同样调用 `getModelPreferences()` 并扩展 payload
- `defaultModelId` 使用 `prefs.defaultModelId || undefined` 处理空字符串情况，避免 Chrome 侧收到空字符串误判

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

PASS
```

## 结果
pass
