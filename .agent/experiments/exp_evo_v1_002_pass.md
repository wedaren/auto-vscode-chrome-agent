## 任务
evo_v1_002: WebSocket 新增 list_models / select_model 消息处理

## 假设
在 extension.ts 中利用 wsServer.onMessage() 注册外部消息处理器，处理 list_models 和 select_model 消息类型。ws-server.ts 的 handleMessage 方法中 default 分支已有外部处理器委托逻辑，无需修改 ws-server.ts。

## 执行内容摘要
- 在 extension.ts 中 wsServer.start() 之后注册 onMessage 处理器
- list_models 处理：调用 lmService.listModels()，返回 models_list 消息
- select_model 处理：从 payload 提取 id，调用 lmService.selectModelById(id)，返回 model_selected 消息
- chat 处理：委托 lmService.sendMessage()，返回 chat_response 消息
- 所有异步操作用 void (async () => {})() 模式，避免阻塞消息循环
- 统一错误处理和日志输出

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- （无）

验收明细：
- acceptance_cmd：PASS（grep list_models / select_model / models_list 均命中，tsc 编译零错误）+60
- TypeScript 编译：零错误输出，严格模式通过 +20
- program.md 约束：模型调用仅通过 vscode.lm API；无外部 API key 依赖；Chrome 插件不内置模型；文件有顶部注释 +20
