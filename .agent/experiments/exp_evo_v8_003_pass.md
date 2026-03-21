## 任务
evo_v8_003: Skill 执行引擎 SkillRunner + AgentLoop 集成 run_skill 工具

## 假设
创建 SkillRunner 类作为 Skill 执行引擎，按 Skill.steps 有序执行工具调用；
在 AgentLoop 中注册 run_skill 虚拟工具让 LLM 可直接调用 Skill；
更新 skill-tree.ts 的 runSkillCommand 接入 SkillRunner 实际执行。

## 执行内容摘要
- 新建 `packages/vscode-ext/src/skill-runner.ts`：
  - SkillRunner 类，构造函数接收 BrowserToolProvider + McpClient + OutputChannel
  - execute(skill, params, onProgress, token) 方法：校验 enabled/参数 → 逐步执行 → 进度回调 → 返回 SkillRunResult
  - {{param}} 变量插值（递归处理嵌套对象/数组）
  - CancellationToken 中断支持
  - optional 步骤失败时跳过，必需步骤失败时终止
  - 工具路由：browser_* → BrowserToolProvider，其余 → McpClient
  - 导出类型：SkillStepResult, SkillRunResult, SkillProgress

- 修改 `agent-loop.ts`：
  - 构造函数新增 skillRegistry? + skillRunner? 可选参数
  - getToolDescriptions() 中注册 run_skill 工具（列出所有启用 Skill 及参数描述）
  - executeTool() 路由 run_skill → executeRunSkill() 新方法
  - executeRunSkill() 解析 LLM 传入的 skill_name + params，调用 SkillRunner.execute

- 修改 `skill-tree.ts`：
  - runSkillCommand 新增 skillRunner 参数
  - 接入 SkillRunner.execute 实际执行
  - 使用 vscode.window.withProgress 显示进度通知
  - 支持 CancellationToken 取消

- 修改 `message-handler.ts`：
  - 构造函数新增 skillRegistry? + skillRunner? 参数
  - AgentLoop 实例化时传入 Skill 系统引用

- 修改 `extension.ts`：
  - 创建 SkillRunner 实例并注入到 MessageHandler 和 runSkillCommand
  - deactivate 时清理 skillRunner 引用

## 验收命令输出
PASS

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- tsconfig.json 未显式声明 strict: true（编译仍通过，类型安全无实际问题，扣 5 分）
- skill-runner.ts 顶部注释 ✅、class SkillRunner ✅、execute() ✅、SkillProgress ✅
- agent-loop.ts run_skill 工具注册 ✅、路由 ✅、executeRunSkill ✅
- 无外部 API key 依赖 ✅、模型调用不绕过 vscode.lm ✅
- npm run compile 零 error ✅
