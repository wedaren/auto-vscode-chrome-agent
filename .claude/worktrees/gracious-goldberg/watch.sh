#!/bin/bash

# watch.sh — 可选：监听 .agent/ 变化自动重触发
# 需要安装 fswatch（macOS: brew install fswatch）

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

if command -v fswatch &> /dev/null; then
  echo "👀 监听 .agent/ 目录变化..."
  fswatch -o "$PROJECT_DIR/.agent/" | while read; do
    echo "[$(date '+%H:%M:%S')] 检测到变化，检查状态..."
    # 检查是否有 needs-you.md
    if [ -f "$PROJECT_DIR/.agent/inbox/needs-you.md" ]; then
      echo "⚠️  需要你的输入，请查看 .agent/inbox/needs-you.md"
    fi
    # 检查是否完成
    if [ -f "$PROJECT_DIR/.agent/inbox/done.md" ]; then
      echo "🎉 项目完成！"
      cat "$PROJECT_DIR/.agent/inbox/done.md"
    fi
  done
else
  echo "提示：安装 fswatch 可以实时监听进度"
  echo "  macOS: brew install fswatch"
  echo "  然后运行 bash watch.sh"
fi
