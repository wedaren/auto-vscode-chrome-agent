## 任务
evo_v21_004: 修复 Chrome SkillPanel skill_list 重复请求：useEffect 依赖稳定化 + 请求去重

## 假设
sendMessage 引用不稳定导致 requestSkillList useCallback 重建，进而触发 useEffect 重复执行。解决方案：
1. 用 useRef 追踪 sendMessage，消除 useCallback 对 sendMessage 的依赖
2. 用 requestedRef 布尔 ref 防止同一次连接多次请求

## 执行内容摘要
- 在 SkillPanel 添加 `sendMessageRef = useRef(sendMessage)` 每次渲染更新 current
- 添加 `requestedRef = useRef(false)` 追踪是否已发送 skill_list
- `requestSkillList` useCallback 改用 `sendMessageRef.current` 调用，依赖仅 `[isConnected]`
- 自动请求 useEffect 增加 `!requestedRef.current` 守卫，连接时标记 true，断开时重置 false
- `executeSkill` useCallback 也改用 `sendMessageRef.current`，依赖从 `[sendMessage, skills]` 简化为 `[skills]`

## 验收命令输出
```
grep 匹配 useRef|requestedRef → 通过
npm run build → ✔ Finished in 1.793 s
PASS
```

## 结果
pass

## Validator 复核
结果：pass
分数：95/100
问题：
- 无阻塞问题。构建存在 pre-existing duplicated imports 警告（ConversationMeta/Message），非本任务引入，不扣分。
