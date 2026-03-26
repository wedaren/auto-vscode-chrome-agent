## 任务
evo_v31_003: 定时端口竞选机制 — follower 窗口周期性尝试获取 leader 角色

## 假设
在 extension.ts 中添加模块级 promotionTimer 变量，follower 模式下启动 10 秒间隔 setInterval 调用 wsServer.tryPromote()；成功时停止定时器并完整初始化 MessageHandler 及所有下游依赖；失败时静默继续；deactivate 时清理定时器。

## 执行内容摘要
- extension.ts 新增 `promotionTimer` 模块级变量和 `PROMOTION_INTERVAL_MS = 10_000` 常量
- follower 分支中启动 setInterval，回调内 async 调用 tryPromote()
- tryPromote 返回 true 时：clearInterval 停止定时器、设置 wsServerHealthy = true、创建 MessageHandler 并通过 wsServer.onMessage 注册
- tryPromote 返回 false 时：静默 continue（无日志噪音）
- try/catch 包裹竞选逻辑，异常时仅 appendLine 记录不中断定时器
- deactivate() 函数顶部添加 promotionTimer 清理逻辑

## 验收命令输出
```
⚡ Done in 42ms
PASS
```

grep 命中 22 行 (≥3)；npm run compile 成功

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
