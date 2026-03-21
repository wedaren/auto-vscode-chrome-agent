# 沉浸式翻译 Skill — 技术研究

## 参考：沉浸式翻译 Chrome 插件核心 UX

1. **双语对照**：翻译后的文本出现在原文段落**下方**，原文保留不变
2. **段落级粒度**：以段落为最小翻译单元（p, h1-h6, li, blockquote 等）
3. **智能内容检测**：自动识别页面主内容区域（article > main > .content > body），跳过导航栏、广告、脚注等
4. **非侵入式样式**：翻译段落有微妙的视觉区分（浅色背景、左侧 accent 边框、斜体或不同字体颜色）
5. **Toggle 开关**：可随时隐藏/显示翻译，不丢失已翻译内容
6. **保留原始布局**：不破坏页面排版

## 当前差距分析

现有 `translate_page` skill 只有两步：
1. `browser_get_text` 提取文本
2. `browser_highlight` 高亮区域

**缺失**：
- 无段落级提取
- 无 LLM 翻译步骤（SkillRunner 不支持 LLM 工具路由）
- 无双语注入回页面
- 无样式系统
- 无 toggle 机制

## 架构设计

### 新增浏览器工具

| 工具名 | 功能 | 位置 |
|--------|------|------|
| `browser_extract_paragraphs` | 智能提取页面段落，返回结构化数据 | action-executor.ts + browser-tools.ts |
| `browser_inject_bilingual` | 将翻译注入原文下方，支持 toggle/clear | action-executor.ts + browser-tools.ts |

### 新增 LLM 工具路由

在 `skill-runner.ts` 中新增 `llm_*` 前缀路由：
- `llm_translate`：接收文本数组 + 目标语言，调用 vscode.lm API 批量翻译

### Skill 定义

替换 `translate_page` 为 `immersive_translate`：
```
Step 1: browser_extract_paragraphs → 提取段落
Step 2: llm_translate({{$prev}}) → LLM 翻译
Step 3: browser_inject_bilingual({{$prev}}) → 注入双语
Step 4: browser_screenshot (optional) → 截图验证
```

### CSS 注入样式
```css
.imt-translation {
  margin: 4px 0 12px 0;
  padding: 6px 12px;
  border-left: 3px solid #4287f5;
  background: rgba(66, 135, 245, 0.06);
  color: #555;
  font-size: 0.95em;
  line-height: 1.6;
  border-radius: 0 4px 4px 0;
}
.imt-translation.imt-hidden { display: none; }
```
