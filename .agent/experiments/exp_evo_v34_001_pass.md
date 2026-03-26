## 任务
evo_v34_001: ImmersiveOverlay DisplayMode 引擎 — 三种显示模式定位与样式切换

## 假设
在现有 ImmersiveOverlay 类上扩展 DisplayMode 类型系统和模式切换引擎，通过 CSS 类名 + 定位策略双重切换实现三种显示效果。

## 执行内容摘要
- 新增 `DisplayMode` 导出类型（`bilingual` | `original` | `translated`）
- 新增 `_displayMode` 私有字段，默认 `bilingual`
- 新增 `setDisplayMode(mode)` 公开方法：设置模式 → 应用 CSS 类名 → 重算位置
- 新增 `getDisplayMode()` getter
- 新增 `_applyDisplayMode()` 内部方法：互斥切换 `imt-overlay-hidden` / `imt-overlay-translated` 类名
- 修改 `_positionEntry()`：translated 模式定位到 `rect.top` + `minHeight` 覆盖原文高度；bilingual/original 模式定位到 `rect.bottom`
- OVERLAY_CSS 新增 `.imt-overlay-translated .imt-overlay-item` 样式：白底 `#fff` + 深色文字 `#222` + 1em 字号
- 更新类文档注释

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：100/100
问题：
- 无
