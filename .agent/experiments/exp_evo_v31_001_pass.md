## 任务
evo_v31_001: WsServer EADDRINUSE 优雅降级 — 端口被占时进入 follower 模式而非报错弹窗

## 假设
在 ws-server.ts 的 EADDRINUSE 处理中，将 showErrorMessage + reject 改为 follower 降级 + resolve，并新增 role 状态、onDidChangeRole 事件、tryPromote() 方法。

## 执行内容摘要
- 新增 `WsServerRole` 类型（'leader' | 'follower' | 'idle'）和 `_role` 私有字段
- 新增 `_onDidChangeRole` EventEmitter 和 `onDidChangeRole` 公共事件
- 新增 `role` getter 供外部读取当前角色
- `start()` 中 'listening' 事件设置 `_role = 'leader'` 并触发 onDidChangeRole
- EADDRINUSE 处理从 `showErrorMessage` + `reject(err)` 改为 `_role = 'follower'` + `showInformationMessage` + `resolve()`
- 新增 `tryPromote()` 方法：尝试重新绑定端口，成功则切换为 leader 并触发事件
- 新增 `bindConnectionHandlers()` 私有方法提取连接处理逻辑供 tryPromote 复用
- `dispose()` 中增加 `_role = 'idle'` 重置和 `_onDidChangeRole.dispose()` 清理

## 验收命令输出
```
⚡ Done in 43ms
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
