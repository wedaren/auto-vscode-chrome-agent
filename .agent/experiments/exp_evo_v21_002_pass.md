## 任务
evo_v21_002: 增强 llm_translate 参数解析健壮性：多参数名兼容 + 结构化结果自动提取

## 假设
将 handleLlmTranslate 的参数解析逻辑拆分为三个独立函数（resolveTextsFromArgs / extractTextsFromValue / extractTextsFromParsed），实现多参数名 fallback 链（texts → paragraphs → input）和结构化 JSON 自动提取（支持 6 种输入格式）。

## 执行内容摘要
- 新增 `TEXT_ARG_ALIASES` 常量定义参数名优先级
- 新增 `resolveTextsFromArgs()` 函数：显式按优先级检查 args.texts / args.paragraphs / args.input
- 新增 `extractTextsFromValue()` 函数（exported）：支持 6 种输入格式：
  - 格式 A：string[] 直接数组
  - 格式 B：JSON 字符串 → 解析为数组
  - 格式 C：JSON 字符串 → 提取 .paragraphs[].text
  - 格式 D：JSON 字符串 → 提取 .texts
  - 格式 E：非空纯字符串 → 单元素数组
  - 格式 F：对象 { paragraphs: [...] } 或 { texts: [...] } → 直接提取
- 新增 `extractTextsFromParsed()` 内部函数：处理已解析的 JSON 值
- 简化 handleLlmTranslate 的参数解析段为两行调用
- 错误信息增强：提示支持的参数名

## 验收命令输出
PASS

## 结果
pass
