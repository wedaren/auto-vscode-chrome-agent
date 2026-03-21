## 任务
evo_v19_004: Chrome 侧沉浸式翻译 UI 控制：SkillPanel 翻译快捷入口 + toggle/clear 操作按钮

## 假设
创建独立的 TranslateControl.tsx 组件，为 immersive_translate skill 提供专属 UI：
1. 翻译图标 + 8 种目标语言快选按钮
2. 翻译完成后展示 toggle/clear 操作按钮
3. toggle/clear 通过 chrome.runtime.sendMessage → background → content script 直接执行 injectBilingual
4. 翻译状态通过 SkillPanel 的 lastCompletion prop 同步

## 执行内容摘要
- 创建了 `packages/chrome-ext/components/TranslateControl.tsx`
  - TranslateState: idle | running | translated | hidden | error
  - 8 种目标语言快选：中文/English/日本語/한국어/Français/Deutsch/Español/Русский
  - toggle 按钮调用 `executeInjectBilingual('toggle')` 通过 chrome.runtime.sendMessage
  - clear 按钮调用 `executeInjectBilingual('clear')` 通过 chrome.runtime.sendMessage
  - 翻译状态随 toggle/clear 操作自动更新
  - 使用 useEffect + timestamp 去重机制监听 lastCompletion prop
- 修改了 `packages/chrome-ext/components/SkillPanel.tsx`
  - 导入 TranslateControl 和 isImmersiveTranslateSkill
  - 新增 translateCompletion state 和 handleTranslateExecute callback
  - immersive_translate skill 置顶显示在"沉浸式翻译"分类下
  - 其他 preset skill 从列表中过滤掉 immersive_translate
  - skill_complete 时通过 setTranslateCompletion 同步翻译结果

## 验收命令输出
```
✔ Finished in 2.075 s
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无
