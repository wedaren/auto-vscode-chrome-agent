## 任务
evo_v34_003: TranslateControl.tsx — 三模式分段控制器 UI 替换 toggle 按钮

## 假设
将原有的 toggle（显示/隐藏）+ clear 两个按钮替换为三段式分段控制器（原文 / 双语 / 译文），
每个段通过 executeInjectBilingual('setDisplayMode', mode) 调用 content script 的 ImmersiveOverlay.setDisplayMode()，
默认活跃模式为 bilingual，清除翻译后控制器隐藏并重置模式。

## 执行内容摘要
- 修改 `executeInjectBilingual` 函数签名，新增 `setDisplayMode` 模式和可选 `displayMode` 参数
- 新增 `DisplayMode` 类型（`bilingual | original | translated`）和 `DISPLAY_MODE_SEGMENTS` 配置
- 新增 `DisplayModeSegments` 子组件：三段式分段控制器，活跃模式白底蓝字 + shadow 高亮
- 新增 `activeDisplayMode` state（默认 `bilingual`）
- 新增 `handleDisplayModeChange` 回调：调用 setDisplayMode → 更新活跃模式 + translateState
- 移除原 `handleToggle` 回调和 toggle 按钮
- 保留 clear 按钮（清除时重置 activeDisplayMode 为 bilingual）
- 底部状态文本从 "已隐藏/已翻译" 改为 "仅原文/仅译文/双语对照"

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
