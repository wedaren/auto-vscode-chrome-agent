# Browser Agent

## 项目说明
Chrome 插件 + VSCode 插件的 agent 系统，实现浏览器上下文感知和深度报告生成。

## 启动
```bash
bash tick.sh
```

## 目录结构
```
.claude/
  pm-agent.md      # PM Agent prompt
  coder-agent.md   # Coder Agent prompt
  validator-agent.md # Validator Agent prompt
.agent/
  program.md       # 需求基准（只读）
  tasks.json       # 任务队列
  state.json       # 系统状态
  decisions.md     # PM 决策日志
  knowledge/       # research 结果
  experiments/     # 迭代记录
  inbox/           # 需要用户介入时写这里
packages/
  vscode-ext/      # VSCode 插件
  chrome-ext/      # Chrome 插件（WXT）
```

## 你只需要关注
- `.agent/decisions.md` — PM 做了哪些决策
- `.agent/inbox/needs-you.md` — 需要你介入时出现
