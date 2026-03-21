## 任务
evo_v19_003: immersive_translate 预设 Skill 定义：替换旧 translate_page，4 步沉浸式翻译流程

## 假设
将 skill-registry.ts 中的旧 translate_page skill（2 步：browser_get_text + browser_highlight）替换为新的 immersive_translate skill（4 步沉浸式翻译流程），使用 evo_v19_001 和 evo_v19_002 已实现的 browser_extract_paragraphs、llm_translate、browser_inject_bilingual 工具。

## 执行内容摘要
- 替换 PRESET_SKILLS 数组中的 translate_page 定义为 immersive_translate
- 4 步流程：browser_extract_paragraphs → llm_translate({{$prev}}, {{targetLanguage}}) → browser_inject_bilingual({{$prev}}, mode:'inject') → browser_screenshot(optional)
- 保留 targetLanguage 参数（默认中文），移除了不再需要的 selector 参数
- 移除了旧的 browser_highlight 步骤

## 验收命令输出
```
> vscode-ext@0.1.0 compile
> tsc -p ./tsconfig.json

PASS
```

## 结果
pass
