## 任务
evo_v13_002: VSCode 侧 handleListModels 节流防护：最小间隔 5 秒，防止高频 list_models 请求压垮 vscode.lm API

## 假设
在 MessageHandler 类中为 handleListModels 添加节流机制：
1. 用 `_lastListModelsTime` 记录上次成功处理时间戳
2. 用 `_cachedModelsList` 缓存上次返回的模型列表
3. 5 秒内重复请求直接返回缓存，不调用 `vscode.lm.selectChatModels()`
4. 在 outputChannel 记录节流日志

## 执行内容摘要
- 在 MessageHandler 类中添加 `LIST_MODELS_THROTTLE_MS = 5000` 静态常量
- 添加 `_lastListModelsTime: number = 0` 实例字段
- 添加 `_cachedModelsList: Array<{ id: string; name: string }> | null = null` 实例字段
- 改写 `handleListModels` 方法：
  - 进入时计算距上次调用的时间间隔
  - 如果 < 5000ms 且缓存非空，直接 `wsServer.send` 缓存并返回，写节流日志
  - 否则正常调用 `lmService.listModels()`，成功后更新缓存和时间戳

## 验收命令输出
```
6
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
