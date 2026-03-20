#!/bin/bash
# tick.sh — Browser Agent 持续闭环调度器
# 修复：移除 -u（unbound variable 严格模式），加 -p 非交互标志

set -eo pipefail

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
  python3 -c "
import json, sys
try:
    d = json.load(open('$STATE'))
    print(d.get('$1', ''))
except: print('')
" 2>/dev/null || echo ""
}

set_state() {
  local key="$1"
  local val="$2"
  python3 - "$key" "$val" <<'PY'
import json, sys
key, val = sys.argv[1], sys.argv[2]
with open('$STATE'.replace("'$STATE'", sys.argv[0])) as f: pass  # dummy
PY
  python3 -c "
import json
with open('$STATE') as f: d = json.load(f)
key = '$key'
val = $val
d[key] = val
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

run_pm_agent() {
  log "🧠 PM Agent 启动..."
  cd "$PROJECT_DIR"
  # -p = 非交互模式，跑完自动退出
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
  # -p = 非交互模式
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
  # -p = 非交互模式
  claude -p --dangerously-skip-permissions \
    --system-prompt "$(cat "$CLAUDE_DIR/validator-agent.md")" \
    "验收 ${tid}。验收命令：${cmd}
最后一行必须输出 'VALIDATION_RESULT: PASS' 或 'VALIDATION_RESULT: FAIL: 原因'。
更新 .agent/state.json 的 last_validation 字段。" \
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
}

# ════════════════════════════════════
# 主循环
# ════════════════════════════════════
main() {
  check_env
  log "🚀 调度器启动 | 项目：$PROJECT_DIR"
  log "进度：cat .agent/tasks.json | python3 -m json.tool"
  log "停止：Ctrl+C"
  echo ""

  local loop=0

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

    # 检查完成
    if [ -f "$DONE_FILE" ]; then
      notify "🎉 Browser Agent MVP 完成！"
      cat "$DONE_FILE"
      exit 0
    fi

    # 找下一个任务
    current_task=$(next_pending_task)
    if [ -z "$current_task" ]; then
      log "✅ 所有任务完成"
      printf "## 完成\n时间：%s\n" "$(date)" > "$DONE_FILE"
      notify "🎉 Browser Agent MVP 完成！"
      exit 0
    fi

    ttype=$(task_field "$current_task" "type")
    retry=$(get_state "retry_count")
    if [ -z "$retry" ] || [ "$retry" = "None" ]; then
      retry=0
    fi

    info "── Loop $loop | $current_task ($ttype) | retry=$retry ──"

    # 超重试上限
    if [ "$retry" -ge 3 ]; then
      warn "$current_task 连续失败 3 次，需要你介入"
      printf "## %s 需要你的决策\n\n失败次数：%s\n实验记录：.agent/experiments/\n\n处理完后删除本文件，重跑 tick.sh\n" \
        "$current_task" "$retry" > "$INBOX"
      notify "⚠️ $current_task 失败 3 次"
      exit 0
    fi

    case "$ttype" in
      pm_research)
        run_pm_agent
        if run_acceptance "$current_task"; then
          log "✅ PM research 通过"
          mark_done "$current_task"
          python3 -c "
import json
with open('$STATE') as f: d = json.load(f)
d['retry_count'] = 0
d['phase'] = 'coding'
d['pm_done'] = True
with open('$STATE', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true
        else
          warn "❌ PM research 验收失败，重试"
          python3 -c "
import json
with open('$STATE') as f: d = json.load(f)
d['retry_count'] = d.get('retry_count', 0) + 1
with open('$STATE', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true
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
            python3 -c "
import json
with open('$STATE') as f: d = json.load(f)
d['retry_count'] = 0
with open('$STATE', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true
          else
            warn "❌ Validator 拒绝，revert"
            cd "$PROJECT_DIR" && git checkout -- . 2>/dev/null || true
            local n=$((retry + 1))
            printf "## %s 第%s次失败\n\n%s\n" "$current_task" "$n" "$val_out" \
              > "$AGENT_DIR/experiments/exp_${current_task}_fail_${n}.md"
            python3 -c "
import json
with open('$STATE') as f: d = json.load(f)
d['retry_count'] = d.get('retry_count', 0) + 1
with open('$STATE', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true
          fi
        else
          warn "❌ 命令验收失败，revert"
          cd "$PROJECT_DIR" && git checkout -- . 2>/dev/null || true
          python3 -c "
import json
with open('$STATE') as f: d = json.load(f)
d['retry_count'] = d.get('retry_count', 0) + 1
with open('$STATE', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true
        fi
        ;;

      validate)
        run_validator_agent "$current_task" || true
        if run_acceptance "$current_task"; then
          log "🎉 最终验收通过"
          mark_done "$current_task"
          printf "## Browser Agent MVP 完成\n\n时间：%s\nLoop 次数：%s\n" \
            "$(date)" "$loop" > "$DONE_FILE"
        else
          warn "❌ 最终验收失败"
          python3 -c "
import json
with open('$STATE') as f: d = json.load(f)
d['retry_count'] = d.get('retry_count', 0) + 1
with open('$STATE', 'w') as f: json.dump(d, f, indent=2, ensure_ascii=False)
" 2>/dev/null || true
        fi
        ;;

      *)
        warn "未知任务类型：$ttype，跳过"
        mark_done "$current_task"
        ;;
    esac

    sleep 2
  done
}

trap 'echo ""; warn "调度器已停止（Ctrl+C）"; exit 0' INT
main