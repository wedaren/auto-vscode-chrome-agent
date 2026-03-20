#!/bin/bash
# tick.sh — Browser Agent 持续进化调度器
# 灵感：Karpathy autoresearch — 永不停止，持续发现问题、研究、改进
#
# 两个阶段：
#   1. build  — 跑完 tasks.json 里的初始任务（MVP）
#   2. evolve — MVP 完成后进入持续进化循环：
#              反思 → 发现改进点 → 主动研究 → 拆任务 → 编码 → 验收 → 反思...

set -eo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_DIR="$PROJECT_DIR/.agent"
STATE="$AGENT_DIR/state.json"
TASKS="$AGENT_DIR/tasks.json"
INBOX="$AGENT_DIR/inbox/needs-you.md"
DONE_FILE="$AGENT_DIR/inbox/done.md"
CLAUDE_DIR="$PROJECT_DIR/.claude"
FEEDBACK_LOG="$AGENT_DIR/feedback.jsonl"
EVOLVE_LOG="$AGENT_DIR/evolution_log.md"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')]${NC} $1"; }
err()  { echo -e "${RED}[$(date '+%H:%M:%S')]${NC} $1"; }
info() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
evo()  { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"; }

get_state() {
  python3 -c "
import json, sys
try:
    d = json.load(open('$STATE'))
    print(d.get('$1', ''))
except: print('')
" 2>/dev/null || echo ""
}

update_state() {
  # 用法: update_state '{"key": "value", ...}'
  local updates="$1"
  python3 -c "
import json
with open('$STATE') as f: d = json.load(f)
d.update($updates)
with open('$STATE', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true
}

next_pending_task() {
  python3 - <<PY
import json
with open('$TASKS') as f:
    data = json.load(f)
tasks = data['tasks']
done_ids = {t['id'] for t in tasks if t['status'] == 'done'}
changed = False
for t in tasks:
    if t['status'] == 'blocked':
        if all(d in done_ids for d in t.get('depends_on', [])):
            t['status'] = 'pending'
            changed = True
if changed:
    with open('$TASKS', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
for t in tasks:
    if t['status'] == 'pending':
        print(t['id'])
        break
PY
}

task_field() {
  local tid="$1"
  local field="$2"
  python3 -c "
import json
tasks = json.load(open('$TASKS'))['tasks']
for t in tasks:
    if t['id'] == '$tid':
        print(t.get('$field', ''))
        break
" 2>/dev/null || echo ""
}

run_acceptance() {
  local tid="$1"
  local cmd
  cmd=$(task_field "$tid" "acceptance_cmd")
  if [ -z "$cmd" ]; then
    echo "PASS"
    return 0
  fi
  cd "$PROJECT_DIR"
  local result
  result=$(bash -c "$cmd" 2>&1) || true
  echo "$result"
  echo "$result" | grep -q "^PASS" && return 0 || return 1
}

mark_done() {
  local tid="$1"
  python3 -c "
import json
with open('$TASKS') as f: d = json.load(f)
for t in d['tasks']:
    if t['id'] == '$tid':
        t['status'] = 'done'
with open('$TASKS', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true
}

notify() {
  command -v osascript &>/dev/null && \
    osascript -e "display notification \"$1\" with title \"Browser Agent\"" 2>/dev/null || true
  warn "━━━ $1 ━━━"
}

# ════════════════════════════════════
# Agent 调用函数
# ════════════════════════════════════

run_pm_agent() {
  log "🧠 PM Agent 启动..."
  cd "$PROJECT_DIR"
  claude -p --dangerously-skip-permissions \
    --system-prompt "$(cat "$CLAUDE_DIR/pm-agent.md")" \
    "执行 task_000：技术调研。完成后更新 tasks.json（task_000 status=done）和 state.json（pm_done=true）。" \
    || true
}

run_coder_agent() {
  local tid="$1"
  local retry="$2"
  log "⚙️  Coder Agent（$tid，第 $((retry+1)) 次）..."
  local prev=""
  local fail_file="$AGENT_DIR/experiments/exp_${tid}_fail_${retry}.md"
  if [ "$retry" -gt 0 ] && [ -f "$fail_file" ]; then
    prev="上次失败记录：$(head -20 "$fail_file")"
  fi
  local title
  title=$(task_field "$tid" "title")
  cd "$PROJECT_DIR"
  claude -p --dangerously-skip-permissions \
    --system-prompt "$(cat "$CLAUDE_DIR/coder-agent.md")" \
    "执行 ${tid}。任务：${title}。${prev}
完成后把结果写入 .agent/state.json 的 last_result 字段（'pass' 或 'fail'）。" \
    || true
}

run_validator_agent() {
  local tid="$1"
  log "🔍 Validator Agent（$tid）..."
  local cmd
  cmd=$(task_field "$tid" "acceptance_cmd")
  cd "$PROJECT_DIR"
  claude -p --dangerously-skip-permissions \
    --system-prompt "$(cat "$CLAUDE_DIR/validator-agent.md")" \
    "验收 ${tid}。验收命令：${cmd}
最后一行必须输出 'VALIDATION_RESULT: PASS' 或 'VALIDATION_RESULT: FAIL: 原因'。
更新 .agent/state.json 的 last_validation 字段。" \
    || true
}

run_research_agent() {
  local topic="$1"
  local context="$2"
  evo "🔬 Research Agent（主动研究）: $topic"
  cd "$PROJECT_DIR"
  claude -p --dangerously-skip-permissions \
    --system-prompt "$(cat "$CLAUDE_DIR/research-agent.md")" \
    "主动研究任务：$topic
背景：$context
请搜索最新技术方案和行业最佳实践，写入 knowledge/ 目录。
最后一行输出 RESEARCH_RESULT: <文件路径> | <一句话结论>" \
    || true
}

run_evolution_agent() {
  local evo_round="$1"
  evo "🧬 Evolution Agent（第 ${evo_round} 轮进化）..."
  cd "$PROJECT_DIR"

  # 收集上下文：已完成任务数、知识库数量、反馈数量、上次进化结果
  local task_stats feedback_count knowledge_count last_evo_result
  task_stats=$(python3 -c "
import json
tasks = json.load(open('$TASKS'))['tasks']
done = sum(1 for t in tasks if t['status'] == 'done')
total = len(tasks)
print(f'{done}/{total} tasks done')
" 2>/dev/null || echo "unknown")

  knowledge_count=$(find "$AGENT_DIR/knowledge/" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  feedback_count=0
  if [ -f "$FEEDBACK_LOG" ]; then
    feedback_count=$(wc -l < "$FEEDBACK_LOG" | tr -d ' ')
  fi

  last_evo_result=""
  if [ -f "$EVOLVE_LOG" ]; then
    last_evo_result=$(tail -20 "$EVOLVE_LOG")
  fi

  claude -p --dangerously-skip-permissions \
    --system-prompt "$(cat "$CLAUDE_DIR/evolution-agent.md")" \
    "进化轮次：$evo_round
系统状态：$task_stats，知识库 ${knowledge_count} 份，用户反馈 ${feedback_count} 条
上次进化结果：${last_evo_result:-无（首次进化）}

请执行进化流程：
1. 审查当前代码质量和功能完整性
2. 分析 .agent/feedback.jsonl 中的用户反馈（如有）
3. 对照 program.md 停止条件，找出差距
4. 扫描行业最佳实践的差距（参考 Karpathy autoresearch 理念）
5. 生成 1-3 个改进任务追加到 tasks.json
6. 最后一行输出 EVOLUTION_RESULT: <新任务ID列表> | <改进主题>" \
    || true
}

run_reflection_agent() {
  evo "🪞 Reflection（自我反思）..."
  cd "$PROJECT_DIR"

  # 统计最近实验的通过/失败率
  local pass_count fail_count
  pass_count=$(find "$AGENT_DIR/experiments/" -name "*_pass.md" 2>/dev/null | wc -l | tr -d ' ')
  fail_count=$(find "$AGENT_DIR/experiments/" -name "*_fail_*.md" 2>/dev/null | wc -l | tr -d ' ')

  claude -p --dangerously-skip-permissions \
    --system-prompt "你是 Browser Agent 的自我反思模块。
你的职责是审视系统当前状态，发现隐藏问题和改进机会。
不写业务代码，只输出分析结论。

## 反思维度
1. 代码健康度：编译警告、未使用代码、类型安全
2. 架构合理性：模块耦合度、消息流效率、错误处理完整性
3. 用户体验：Side Panel 交互流畅度、响应速度、错误提示
4. 能力边界：当前 agent 能做什么、不能做什么、最值得扩展什么
5. 知识空白：knowledge/ 里缺少哪些技术方案

## 输出格式
把反思结果写入 .agent/reflection.md，格式：
### 健康度
- ...
### 改进机会（按价值排序）
1. [高] ...
2. [中] ...
3. [低] ...
### 推荐下一步
...

最后一行输出：REFLECTION_DONE: <最高优先改进点一句话描述>" \
    "进行第 ${1} 轮自我反思。
实验统计：${pass_count} pass / ${fail_count} fail
请读取代码、知识库、实验记录，输出结构化反思结论。" \
    || true
}

check_env() {
  if ! command -v claude &>/dev/null; then
    err "未找到 claude，请先安装：npm install -g @anthropic-ai/claude-code"
    exit 1
  fi
  if ! command -v python3 &>/dev/null; then
    err "需要 python3"
    exit 1
  fi
  if [ ! -d "$PROJECT_DIR/.git" ]; then
    log "初始化 git..."
    cd "$PROJECT_DIR"
    git init -q
    git add . 2>/dev/null || true
    git commit -q -m "init: browser-agent scaffold" 2>/dev/null || true
  fi
  # 确保反馈日志存在
  touch "$FEEDBACK_LOG" 2>/dev/null || true
}

# ════════════════════════════════════
# Build 阶段：跑完初始任务
# ════════════════════════════════════
run_build_phase() {
  local loop="$1"

  current_task=$(next_pending_task)
  if [ -z "$current_task" ]; then
    return 1  # 无待处理任务，进入 evolve
  fi

  ttype=$(task_field "$current_task" "type")
  retry=$(get_state "retry_count")
  if [ -z "$retry" ] || [ "$retry" = "None" ]; then
    retry=0
  fi

  info "── Build Loop $loop | $current_task ($ttype) | retry=$retry ──"

  # 超重试上限
  if [ "$retry" -ge 3 ]; then
    warn "$current_task 连续失败 3 次，调用 Research Agent..."
    run_research_agent "$current_task 失败分析" "任务 $current_task 连续失败 $retry 次，需要研究根本原因"
    # 重置重试计数，让 coder 带着新知识重试
    update_state '{"retry_count": 0}'
    return 0
  fi

  case "$ttype" in
    pm_research)
      run_pm_agent
      if run_acceptance "$current_task"; then
        log "✅ PM research 通过"
        mark_done "$current_task"
        update_state '{"retry_count": 0, "phase": "coding", "pm_done": true}'
      else
        warn "❌ PM research 验收失败，重试"
        update_state "{\"retry_count\": $((retry + 1))}"
      fi
      ;;

    coding)
      run_coder_agent "$current_task" "$retry"
      if run_acceptance "$current_task"; then
        log "✅ 命令验收通过，Validator 复核..."
        val_out=$(run_validator_agent "$current_task" 2>&1) || true
        if echo "$val_out" | grep -q "VALIDATION_RESULT: PASS"; then
          log "✅ $current_task 全部通过，git commit"
          cd "$PROJECT_DIR"
          git add -A 2>/dev/null || true
          local title
          title=$(task_field "$current_task" "title")
          git commit -m "feat($current_task): $title" 2>/dev/null || true
          mark_done "$current_task"
          update_state '{"retry_count": 0}'
        else
          warn "❌ Validator 拒绝，revert"
          cd "$PROJECT_DIR" && git checkout -- . 2>/dev/null || true
          local n=$((retry + 1))
          printf "## %s 第%s次失败\n\n%s\n" "$current_task" "$n" "$val_out" \
            > "$AGENT_DIR/experiments/exp_${current_task}_fail_${n}.md"
          update_state "{\"retry_count\": $n}"
        fi
      else
        warn "❌ 命令验收失败，revert"
        cd "$PROJECT_DIR" && git checkout -- . 2>/dev/null || true
        update_state "{\"retry_count\": $((retry + 1))}"
      fi
      ;;

    validate)
      run_validator_agent "$current_task" || true
      if run_acceptance "$current_task"; then
        log "🎉 最终验收通过"
        mark_done "$current_task"
      else
        warn "❌ 最终验收失败"
        update_state "{\"retry_count\": $((retry + 1))}"
      fi
      ;;

    *)
      warn "未知任务类型：$ttype，跳过"
      mark_done "$current_task"
      ;;
  esac

  return 0
}

# ════════════════════════════════════
# Evolve 阶段：持续进化循环
# Karpathy Autoresearch 理念：
#   反思 → 发现 → 研究 → 实施 → 验证 → 反思...
# ════════════════════════════════════
run_evolve_phase() {
  local evo_round="$1"

  evo "════ Evolve Round $evo_round ════"

  # Step 1: 反思 — 审视当前系统，发现问题
  evo "[1/4] 自我反思..."
  run_reflection_agent "$evo_round"

  # 检查用户介入
  if [ -f "$INBOX" ] && [ -s "$INBOX" ]; then
    return 1
  fi

  # Step 2: 进化 — 基于反思结果生成新任务
  evo "[2/4] 生成进化任务..."
  local evo_out
  evo_out=$(run_evolution_agent "$evo_round" 2>&1) || true

  # 记录进化日志
  printf "\n---\n## Round %s | %s\n\n%s\n" \
    "$evo_round" "$(date '+%Y-%m-%d %H:%M')" \
    "$(echo "$evo_out" | grep 'EVOLUTION_RESULT' | tail -1)" \
    >> "$EVOLVE_LOG"

  # Step 3: 执行新任务（如果 evolution agent 生成了）
  local new_task
  new_task=$(next_pending_task)
  if [ -n "$new_task" ]; then
    local new_type
    new_type=$(task_field "$new_task" "type")

    if [ "$new_type" = "research" ]; then
      # 主动研究任务
      evo "[3/4] 主动研究: $new_task"
      local research_topic
      research_topic=$(task_field "$new_task" "title")
      run_research_agent "$research_topic" "进化轮次 $evo_round 生成的研究任务"
      if run_acceptance "$new_task"; then
        mark_done "$new_task"
        log "✅ 研究任务完成: $new_task"
      fi
    else
      # 编码任务，走正常 build 流程
      evo "[3/4] 编码改进: $new_task"
      run_coder_agent "$new_task" 0
      if run_acceptance "$new_task"; then
        val_out=$(run_validator_agent "$new_task" 2>&1) || true
        if echo "$val_out" | grep -q "VALIDATION_RESULT: PASS"; then
          cd "$PROJECT_DIR"
          git add -A 2>/dev/null || true
          local title
          title=$(task_field "$new_task" "title")
          git commit -m "evo($new_task): $title" 2>/dev/null || true
          mark_done "$new_task"
          log "✅ 进化任务完成: $new_task"
        else
          warn "❌ 进化任务验收失败，revert"
          cd "$PROJECT_DIR" && git checkout -- . 2>/dev/null || true
        fi
      else
        warn "❌ 进化任务命令验收失败，revert"
        cd "$PROJECT_DIR" && git checkout -- . 2>/dev/null || true
      fi
    fi
  else
    evo "[3/4] 无新任务生成，跳过编码"
  fi

  # Step 4: 更新状态
  evo "[4/4] 更新进化状态"
  update_state "{\"evolution_round\": $evo_round, \"phase\": \"evolve\"}"

  return 0
}

# ════════════════════════════════════
# 主循环
# ════════════════════════════════════
main() {
  check_env
  log "🚀 Browser Agent 持续进化调度器"
  log "模式：build → evolve（永不停止）"
  log "停止：Ctrl+C"
  echo ""

  local loop=0
  local evo_round=0
  local phase="build"

  # 恢复之前的阶段
  local saved_phase
  saved_phase=$(get_state "phase")
  if [ "$saved_phase" = "evolve" ]; then
    phase="evolve"
    evo_round=$(get_state "evolution_round")
    if [ -z "$evo_round" ] || [ "$evo_round" = "None" ]; then
      evo_round=0
    fi
    evo "恢复进化阶段，从第 $evo_round 轮继续"
  fi

  while true; do
    loop=$((loop + 1))

    # 更新 state
    python3 -c "
import json, datetime
with open('$STATE') as f: d = json.load(f)
d['loop_count'] = $loop
d['last_tick'] = datetime.datetime.utcnow().isoformat() + 'Z'
with open('$STATE', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true

    # 检查用户介入
    if [ -f "$INBOX" ] && [ -s "$INBOX" ]; then
      notify "⚠️ 需要你介入"
      warn "查看：cat .agent/inbox/needs-you.md"
      warn "处理完后：rm .agent/inbox/needs-you.md && bash tick.sh"
      exit 0
    fi

    if [ "$phase" = "build" ]; then
      # ── Build 阶段 ──
      if ! run_build_phase "$loop"; then
        # 所有初始任务完成，切换到 evolve
        log "🎉 Build 阶段完成，进入持续进化模式"
        notify "Build 完成，进入 Evolve 模式"
        phase="evolve"
        update_state '{"phase": "evolve", "evolution_round": 0}'

        # 不再写 done_file 退出，而是继续
        sleep 2
        continue
      fi
    else
      # ── Evolve 阶段 ──
      evo_round=$((evo_round + 1))

      if ! run_evolve_phase "$evo_round"; then
        # 需要用户介入
        notify "⚠️ 进化过程需要你介入"
        exit 0
      fi

      # 进化间隔：每轮之间休息更久，避免无意义空转
      evo "第 $evo_round 轮进化完成，等待 10 秒后继续..."
      sleep 10
    fi

    sleep 2
  done
}

trap 'echo ""; warn "调度器已停止（Ctrl+C）"; exit 0' INT
main
