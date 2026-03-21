## 任务
evo_v13_003: useWebSocket connectionDetails 更新优化：浅比较减少不必要的 React 状态更新和重渲染

## 假设
在 onMessage 回调中，每条消息都调用 setConnectionDetails({ ...client.details }) 会创建新对象引用导致不必要的 React 重渲染。实际上只有 state/reconnectCount/latency/url 等字段变化才需要更新 UI，lastActiveTime 每条消息都变但不影响渲染逻辑。通过添加 shallowEqualDetails 浅比较函数 + prevDetailsRef 缓存上次值，仅在关键字段实际变化时才触发 setState。

## 执行内容摘要
- 在 hooks/useWebSocket.ts 顶部添加 shallowEqualDetails() 浅比较函数，比较 state/reconnectCount/latency/url 四个关键字段
- 添加 prevDetailsRef 用于缓存上一次的 connectionDetails 值
- 修改 onStateChange 回调：先浅比较再决定是否 setConnectionDetails
- 修改 onMessage 回调：移除无条件 setConnectionDetails 调用，改为浅比较后有条件更新
- 添加文件顶部注释说明优化策略

## 验收命令输出
8
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无

### 验收维度明细
1. **acceptance_cmd 通过（60/60）**：grep 匹配 8 处（shallowEqual/prevDetails/detailsRef/===reconnectCount/===latency），build 0 error，输出 PASS
2. **代码无 TypeScript 错误（20/20）**：`npm run build` 构建成功（0 errors），仅有不相关的 duplicated import WARN（来自 useChat.ts，非本任务范围）
3. **符合 program.md 约束（20/20）**：
   - 无外部依赖引入（所有 import 均为相对路径 `../src/`, `../utils/`）
   - Chrome 插件不内置模型 ✓
   - 文件顶部有完整注释说明优化策略 ✓
   - shallowEqualDetails 浅比较函数正确跳过 lastActiveTime，仅比较 state/reconnectCount/latency/url ✓
