## 问题
evo_v9_005 稳定性体系全量验收 acceptance_cmd 输出 FAIL，但所有功能均已完整实现，双端构建无 TS 错误。
连续失败 3 次，根因完全相同——acceptance_cmd 从未被修正。

## 根本原因
acceptance_cmd 中 grep 命令引用了错误的文件路径：
```bash
grep -q 'heartbeat\|ping' utils/ws-client.ts
```
但 ws-client.ts 的实际位置是 `src/ws-client.ts`（不在 `utils/` 目录下）。

**路径混淆原因：** WXT 框架项目 `utils/` 和 `src/` 是两个不同层级的目录。
按 WXT 官方文档，`utils/` 是自动导入的工具函数目录，`src/` 是源码根目录。
本项目中 ws-client.ts 属于核心连接模块，由 evo_v9_003 放在 `src/` 下，符合约定。
`utils/` 目录仅含：action-executor.ts、message-factory.ts、tool-bridge.ts。

**grep 退出码机制：**
- 退出码 0：找到匹配
- 退出码 1：未找到匹配
- 退出码 2：文件不存在或其他错误

文件不存在时 grep 返回退出码 2，`&&` 链短路，直接跳到 `|| echo 'FAIL'`。

**失败链路：**
1. `cd packages/chrome-ext` - 成功
2. `test -f components/ErrorBoundary.tsx` - 成功
3. `test -f components/Toast.tsx` - 成功
4. `test -f hooks/useToast.ts` - 成功
5. `test -f components/DebugPanel.tsx` - 成功
6. `test -f hooks/useDebugLog.ts` - 成功
7. `grep -q 'ErrorBoundary' entrypoints/sidepanel/App.tsx` - 成功
8. `grep -q 'Toast' components/Toast.tsx` - 成功
9. `grep -q 'heartbeat\|ping' utils/ws-client.ts` - **FAIL**（退出码 2）
10. `&&` 链短路 → `|| echo 'FAIL'`

此为同类缺陷（参见 fix_evo_v4_005_grep_case_sensitivity.md）。

## 解法
将 acceptance_cmd 中文件路径从 `utils/ws-client.ts` 修正为 `src/ws-client.ts`。

```bash
# 修改前
grep -q 'heartbeat\|ping' utils/ws-client.ts
# 修改后
grep -q 'heartbeat\|ping' src/ws-client.ts
```

## 关键代码/配置
tasks.json 第 759 行，将 `utils/ws-client.ts` 替换为 `src/ws-client.ts`。

**必须执行的修复（sed 命令）：**
```bash
sed -i '' 's|utils/ws-client.ts|src/ws-client.ts|g' .agent/tasks.json
```

**修正后完整 acceptance_cmd：**
```bash
cd packages/chrome-ext && test -f components/ErrorBoundary.tsx && test -f components/Toast.tsx && test -f hooks/useToast.ts && test -f components/DebugPanel.tsx && test -f hooks/useDebugLog.ts && grep -q 'ErrorBoundary' entrypoints/sidepanel/App.tsx && grep -q 'Toast' components/Toast.tsx && grep -q 'heartbeat\|ping' src/ws-client.ts && grep -q '调试\|Debug' entrypoints/sidepanel/App.tsx && npm run build 2>&1 | grep -i 'error TS' | wc -l | xargs -I{} test {} -eq 0 && cd ../vscode-ext && npm run compile 2>&1 | grep -c 'error' | xargs -I{} test {} -eq 0 && echo PASS || echo 'FAIL: 稳定性体系全量验收失败'
```

实测验证：
```bash
$ grep -q 'heartbeat\|ping' utils/ws-client.ts  # EXIT_CODE=2 (文件不存在)
$ grep -q 'heartbeat\|ping' src/ws-client.ts     # EXIT_CODE=0 (匹配成功)
```

src/ws-client.ts 心跳实现：heartbeat_ping/pong 消息类型，15s 间隔，10s 超时。

## 来源
- 本地文件系统实测验证（EXIT_CODE=2 vs EXIT_CODE=0 已复现，第3次确认）
- [WXT Project Structure 官方文档](https://wxt.dev/guide/essentials/project-structure) — utils/ 是自动导入工具函数目录，src/ 是源码根目录
- [grep exit codes](https://linuxvox.com/blog/the-return-code-from-grep-is-not-as-expected-on-linux/) — 退出码 0/1/2 说明
- [Bash && chain short-circuit](https://quantchem.kuleuven.be/unix_manual/shell/elements/conditionals/shortcircuit.html) — 非零退出码导致 && 链短路
- [Baeldung: grep in if-else](https://www.baeldung.com/linux/grep-if-else-statement) — test -f 先验证文件存在再 grep
- [BashGuide Practices](https://mywiki.wooledge.org/BashGuide/Practices) — grep 不宜用于文件存在性判断
- 项目内先例：knowledge/fix_evo_v4_005_grep_case_sensitivity.md

## 可信度
高 — 本地实测复现 + 官方文档交叉验证

## 注意事项
- **⚠️ 已连续失败 3 次，根因相同但 tasks.json 从未被修正** — 必须由 PM/Coder 执行 sed 命令修复
- **防御性写法：** 对 grep 目标文件应先 `test -f` 再 grep，区分"文件缺失"和"内容不匹配"
- PM 编写 acceptance_cmd 前应 `find . -name ws-client.ts` 确认实际路径
- 此为 acceptance_cmd 定义缺陷，非代码实现问题，无需修改业务代码
- Validator 已三次复核全部功能通过（95/100），仅扣 5 分路径偏差
- **阻塞原因：** 前两次 research 已定位问题，但修复未被执行。建议 tick.sh 读到此结论后直接修改 tasks.json
