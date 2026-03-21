## 任务
evo_v9_004: Chrome Side Panel 新增 Debug 调试面板：实时消息日志 + 连接仪表盘 + 执行时间线 + 开关控制

## 假设
本次尝试：在 Side Panel 新增 Debug Tab，通过 useDebugLog Hook 捕获所有 WebSocket 收发消息、连接状态变迁、执行事件，并在 DebugPanel 组件中提供四个子视图展示和控制。

## 执行内容摘要
- 创建 `hooks/useDebugLog.ts`：Debug 日志管理 Hook，支持入站/出站/连接/执行/错误五种日志类型，执行时间线跟踪，开关控制（启用/禁用、自动滚动、心跳过滤），导出 JSON，统计信息
- 创建 `components/DebugPanel.tsx`：Debug 面板 UI 组件，内含四个 sub-tab：
  - 消息日志（MessageLog）：带类型过滤标签栏 + 可展开详情 + 自动滚动
  - 连接仪表盘（ConnectionDashboard）：状态卡片 + 指标面板（延迟/重连/消息速率/最后活跃）+ 最近连接事件
  - 执行时间线（ExecutionTimeline）：垂直时间轴可视化 Agent 步骤/工具调用/Skill 执行
  - 设置面板（ToggleControls）：四个开关 + 统计信息 + 导出/清空操作按钮
- 修改 `entrypoints/sidepanel/App.tsx`：
  - Tab 类型扩展为 `'chat' | 'skills' | 'debug'`
  - 集成 useDebugLog Hook
  - 在 onMessage 中记录所有入站消息到 debugLog
  - 在连接状态变化时记录连接事件
  - 在 sendMessage 时记录出站消息
  - 将 ErrorBoundary 错误同步到 debugLog
  - 新增 Debug Tab 按钮（含错误计数徽章）
  - 新增 DebugPanel 渲染区域

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
