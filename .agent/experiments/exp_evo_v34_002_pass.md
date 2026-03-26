## 任务
evo_v34_002: action-executor.ts — executeInjectBilingual 扩展 setDisplayMode 操作

## 假设
在 executeInjectBilingual 的 switch 中新增 setDisplayMode case，读取 action.displayMode 参数调用 immersiveOverlay.setDisplayMode()，并在 BrowserAction 接口添加 displayMode 可选字段。

## 执行内容摘要
- 从 imt-overlay.ts 导入 DisplayMode 类型
- BrowserAction 接口新增 `displayMode?: DisplayMode` 可选字段
- injectMode 类型扩展 `'setDisplayMode'` 选项
- executeInjectBilingual switch 新增 `setDisplayMode` case：
  - 读取 `action.displayMode`（默认 bilingual）
  - 验证 displayMode 值合法性
  - 调用 `immersiveOverlay.setDisplayMode(targetMode)`
  - 返回 `{ mode: 'setDisplayMode', currentMode }` 到调用方

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
