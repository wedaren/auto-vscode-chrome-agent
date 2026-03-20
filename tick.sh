#!/bin/bash
# tick.sh — Browser Agent 持续闭环调度器
# 架构：PM / Coder / Validator 三个独立 session
# 用法：bash tick.sh

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_DIR="$PROJECT_DIR/.agent"
STATE="$AGENT_DIR/state.json"
TASKS="$AGENT_DIR/tasks.json"
INBOX="$AGENT_DIR/inbox/needs-you.md"
DONE_FILE="$AGENT_DIR/inbox/done.md"
CLAUDE_DIR="$PROJECT_DIR/.claude"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')]${NC} $1"; }
err()  { echo -e "${RED}[$(date '+%H:%M:%S')]${NC} $1"; }
info() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }

get_state() {
  python3 -c "import json; d=json.load(open('$STATE')); print(d.get('$1',''))" 2>/dev/null || echo ""
}
set_state() {
  python3 - <<PY
import json
with open('$STATE') as f: d=json.load(f)
d['$1']=$2
with open('$STATE','w') as f: json.dump(d,f,indent=2,ensure_ascii=False)
PY
}

next_pending_task() {
  python3 - <<PY
import json
data=json.load(open('$TASKS'))
tasks=data['tasks']
done_ids={t['id'] for t in tasks if t['status']=='done'}
changed=False
for t in tasks:
    if t['status']=='blocked':
        if all(d in done_ids for d in t.get('depends_on',[])):
            t['status']='pending'; changed=True
if changed:
    with open('$TASKS','w') as f: json.dump(data,f,indent=2,ensure_ascii=False)
for t in tasks:
    if t['status']=='pending':
        print(t['id']); break
PY
}

task_field() {
  python3 -c "
import json
for t in json.load(open('$TASKS'))['tasks']:
    if t['id']=='$1': print(t.get('$2','')); break
" 2>/dev/null || echo ""
}

run_acceptance() {
  local cmd
  cmd=$(task_field "$1" "acceptance_cmd")
  [ -z "$cmd" ] && echo "PASS" && return 0
  cd "$PROJECT_DIR"
  result=$(bash -c "$cmd" 2>&1 || true)
  echo "$result"
  echo "$result" | grep -q "^PASS" && return 0 || return 1
}

mark_done() {
  python3 - <<PY
import json
with open('$TASKS') as f: d=json.load(f)
for t in d['tasks']:
    if t['id']=='$1': t['status']='done'
with open('$TASKS','w') as f: json.dump(d,f,indent=2,ensure_ascii=False)
PY
}

notify() {
  command -v osascript &>/dev/null && \
    osascript -e "display notification \"$1\" with title \"Browser Agent\"" 2>/dev/null || true
  warn "━━━ $1 ━━━"
}

run_pm_agent() {
  log "🧠 PM Agent 启动（独立 session）..."
  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions -p \
    --system-prompt "$(cat "$CLAUDE_DIR/pm-agent.md")" \
    "执行 task_000：技术调研。完成后更新 tasks.json（task_000 status=done）和 state.json（pm_done=true）。"
}

run_coder_agent() {
  local task_id="$1" retry="$2"
  log "⚙️  Coder Agent（$task_id，第 $((retry+1)) 次）..."
  local prev=""
  local fail_file="$AGENT_DIR/experiments/exp_${task_id}_fail_${retry}.md"
  [ "$retry" -gt 0 ] && [ -f "$fail_file" ] && \
    prev="上次失败记录：$(head -20 "$fail_file")"
  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions -p \
    --system-prompt "$(cat "$CLAUDE_DIR/coder-agent.md")" \
    "执行 $task_id。任务描述：$(task_field "$task_id" "title")。$prev
完成后把结果写入 .agent/state.json 的 last_result 字段（'pass' 或 'fail'）。"
}

run_validator_agent() {
  local task_id="$1"
  log "🔍 Validator Agent（$task_id）..."
  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions -p \
    --system-prompt "$(cat "$CLAUDE_DIR/validator-agent.md")" \
    "验收 $task_id。验收命令：$(task_field "$task_id" "acceptance_cmd")
最后一行输出 'VALIDATION_RESULT: PASS' 或 'VALIDATION_RESULT: FAIL: 原因'。
更新 .agent/state.json 的 last_validation 字段。"
}

check_env() {
  command -v claude &>/dev/null || { err "未找到 claude，请先安装"; exit 1; }
  command -v python3 &>/dev/null || { err "需要 python3"; exit 1; }
  [ ! -d "$PROJECT_DIR/.git" ] && cd "$PROJECT_DIR" && git init -q && \
    git add . 2>/dev/null && git commit -q -m "init" 2>/dev/null || true
}

# ══════════════════════════════════════
# 主循环
# ══════════════════════════════════════
main() {
  check_env
  log "🚀 调度器启动 | 项目：$PROJECT_DIR"
  log "进度：cat .agent/tasks.json | python3 -m json.tool"
  echo ""

  local loop=0

  while true; do
    loop=$((loop+1))
    set_state "loop_count" "$loop"
    set_state "last_tick" "\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\""

    # 检查用户介入
    if [ -f "$INBOX" ] && [ -s "$INBOX" ]; then
      notify "⚠️ 需要你介入：cat .agent/inbox/needs-you.md"
      warn "处理完后 rm .agent/inbox/needs-you.md，再重跑 tick.sh"
      exit 0
    fi

    # 检查完成
    if [ -f "$DONE_FILE" ]; then
      notify "🎉 MVP 完成！"
      cat "$DONE_FILE"
      exit 0
    fi

    # 找下一任务
    current_task=$(next_pending_task)
    if [ -z "$current_task" ]; then
      log "✅ 所有任务完成"
      echo "完成时间：$(date)" > "$DONE_FILE"
      notify "🎉 Browser Agent MVP 完成！"
      exit 0
    fi

    type=$(task_field "$current_task" "type")
    retry=$(get_state "retry_count")
    [ -z "$retry" ] && retry=0

    info "── Loop $loop | $current_task ($type) | retry=$retry ──"

    # 超重试上限
    if [ "$retry" -ge 3 ]; then
      warn "$current_task 失败 3 次，需要你介入"
      printf "## %s 需要决策\n\n失败次数：%s\n实验记录：.agent/experiments/\n\n处理完删除本文件后重跑 tick.sh\n" \
        "$current_task" "$retry" > "$INBOX"
      notify "⚠️ $current_task 连续失败 3 次"
      exit 0
    fi

    case "$type" in
      pm_research)
        run_pm_agent
        if run_acceptance "$current_task"; then
          log "✅ PM research 完成"
          mark_done "$current_task"
          set_state "retry_count" "0"
          set_state "phase" '"coding"'
        else
          warn "❌ PM research 验收失败，重试 $((retry+1))/3"
          set_state "retry_count" "$((retry+1))"
        fi
        ;;

      coding)
        run_coder_agent "$current_task" "$retry"
        if run_acceptance "$current_task"; then
          log "✅ 命令验收通过，Validator 复核..."
          val_out=$(run_validator_agent "$current_task" 2>&1 || true)
          if echo "$val_out" | grep -q "VALIDATION_RESULT: PASS"; then
            log "✅ $current_task 验收通过，提交"
            cd "$PROJECT_DIR"
            git add -A 2>/dev/null || true
            git commit -m "feat($current_task): $(task_field "$current_task" "title")" 2>/dev/null || true
            mark_done "$current_task"
            set_state "retry_count" "0"
          else
            warn "❌ Validator 拒绝，revert"
            cd "$PROJECT_DIR" && git checkout -- . 2>/dev/null || true
            set_state "retry_count" "$((retry+1))"
            printf "## %s 第%s次失败\n\n%s\n" \
              "$current_task" "$((retry+1))" "$val_out" \
              > "$AGENT_DIR/experiments/exp_${current_task}_fail_$((retry+1)).md"
          fi
        else
          warn "❌ 命令验收失败，revert"
          cd "$PROJECT_DIR" && git checkout -- . 2>/dev/null || true
          set_state "retry_count" "$((retry+1))"
        fi
        ;;

      validate)
        val_out=$(run_validator_agent "$current_task" 2>&1 || true)
        if run_acceptance "$current_task"; then
          log "🎉 最终验收通过"
          mark_done "$current_task"
          printf "## Browser Agent MVP 完成\n\n时间：%s\nLoop：%s\n" \
            "$(date)" "$loop" > "$DONE_FILE"
        else
          warn "❌ 最终验收失败"
          set_state "retry_count" "$((retry+1))"
        fi
        ;;
    esac

    sleep 2
  done
}

trap 'echo ""; warn "调度器已停止"; exit 0' INT
main
