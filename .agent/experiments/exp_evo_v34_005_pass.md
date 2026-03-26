## 任务
evo_v34_005: 全链路验收 — 双端编译 + 三模式切换端到端验证

## 假设
本次尝试：验证前序任务（evo_v34_003/004）已正确实现三模式系统，双端编译无错误，所有组件按预期集成。

## 执行内容摘要
- 纯验证任务，无代码修改
- 分别运行 Chrome 侧和 VSCode 侧 `tsc --noEmit`
- 审查 `imt-overlay.ts` 的 CSS 定义和 `_applyDisplayMode()` 方法
- 审查 `TranslateControl.tsx` 确认无 `toggleAll` 直接调用
- 审查 `action-executor.ts` 的 `setDisplayMode` case

## 验收命令输出
```
PASS
```

## 验收项逐条确认
1. ✅ Chrome 侧 tsc --noEmit 通过（无错误输出）
2. ✅ VSCode 侧 tsc --noEmit 通过（无错误输出）
3. ✅ ImmersiveOverlay 包含三种模式 CSS：
   - `.imt-overlay-hidden .imt-overlay-item { visibility: hidden }` → original 模式
   - `.imt-overlay-translated .imt-overlay-item { background: #fff; ... }` → translated 模式
   - 默认无额外类名 → bilingual 模式
   - `_applyDisplayMode()` 互斥切换 hidden/translated 类名
   - `_positionEntry()` 根据 `translated` 模式定位 rect.top，其余定位 rect.bottom
4. ✅ TranslateControl 无 toggleAll 直接调用（grep 结果为空），模式切换全部走 `executeInjectBilingual('setDisplayMode', mode)`
5. ✅ action-executor setDisplayMode case（行907-929）：
   - 从 action.displayMode 获取目标模式，默认 bilingual
   - 验证合法值 ['bilingual', 'original', 'translated']
   - 调用 `immersiveOverlay.setDisplayMode(targetMode)`
   - 返回 `immersiveOverlay.getDisplayMode()` 确认

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
