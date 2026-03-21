# Research: 内置 Chrome DevTools MCP 深度集成

## 功能来源
program.md 功能进化区：
> 内置 MCP https://github.com/ChromeDevTools/chrome-devtools-mcp；不考虑时间，使用最优解，提供用户使用 agent 的体验；结合 mcp 的工具再内置 skill

## 现状分析

### 已有的 MCP 集成
- `mcp-client.ts` 中 `McpClient` 类已通过 stdio transport 连接 `npx -y chrome-devtools-mcp@latest`
- 但启动参数**完全硬编码**，无法配置 `--browserUrl`、`--autoConnect` 等关键选项
- `listTools()` 只返回 `{ name, description }` —— **丢失了 inputSchema**
- AgentLoop 中 LLM 只能看到工具名和描述，不知道参数格式

### chrome-devtools-mcp 工具清单（v0.20.3, 29 个工具，6 大类）

#### Input Automation (9)
| 工具名 | 描述 |
|--------|------|
| click | 点击页面元素 |
| drag | 拖拽元素 |
| fill | 填写表单字段 |
| fill_form | 批量填写多个表单字段 |
| handle_dialog | 处理浏览器对话框 |
| hover | 鼠标悬停 |
| press_key | 模拟键盘输入 |
| type_text | 逐字符输入文本 |
| upload_file | 上传文件 |

#### Navigation (6)
| 工具名 | 描述 |
|--------|------|
| close_page | 关闭标签页 |
| list_pages | 列出打开的页面 |
| navigate_page | 导航到 URL |
| new_page | 打开新标签页 |
| select_page | 切换标签页 |
| wait_for | 等待条件满足 |

#### Emulation (2)
| 工具名 | 描述 |
|--------|------|
| emulate | 模拟设备特性 |
| resize_page | 调整视口大小 |

#### Performance (4)
| 工具名 | 描述 |
|--------|------|
| performance_analyze_insight | 分析 trace 数据 |
| performance_start_trace | 开始录制性能 |
| performance_stop_trace | 停止录制性能 |
| take_memory_snapshot | 捕获堆快照 |

#### Network (2)
| 工具名 | 描述 |
|--------|------|
| get_network_request | 获取请求详情 |
| list_network_requests | 列出所有网络请求 |

#### Debugging (6)
| 工具名 | 描述 |
|--------|------|
| evaluate_script | 执行 JavaScript |
| get_console_message | 获取控制台消息 |
| lighthouse_audit | Lighthouse 审计 |
| list_console_messages | 列出控制台消息 |
| take_screenshot | 截图 |
| take_snapshot | DOM 快照 |

### 关键启动选项
- `--browserUrl http://127.0.0.1:9222` — 连接已运行的 Chrome
- `--autoConnect` — 自动连接本地 Chrome（Chrome 144+）
- `--headless` — 无头模式
- `--slim` — 精简模式（仅 3 个工具）
- `--no-usage-statistics` — 关闭统计
- `--viewport 1280x720` — 初始视口
- `--executablePath` — 自定义 Chrome 路径

## 核心差距

| 维度 | 当前 | 目标 |
|------|------|------|
| 启动配置 | 硬编码无参数 | VSCode settings 可配置所有关键参数 |
| 工具 Schema | 只有 name+description | 完整 inputSchema (参数类型/必填/描述) |
| 子进程管理 | 崩溃即断开 | 自动重启 + 健康检查 |
| LLM 工具感知 | 只看到工具名 | 看到完整函数签名和参数说明 |
| 预设 Skill | 0 个用 MCP 工具 | 5+ 个 DevTools 专属 Skill |

## 拆解方案

1. **McpClient 配置增强** — VSCode settings + 启动参数传递 + 完整 Schema 存储
2. **McpClient 健壮性** — 子进程崩溃重启 + 健康检查 + 状态事件
3. **AgentLoop Schema 增强** — 完整参数 Schema 注入系统提示词
4. **DevTools MCP 预设 Skill** — 5 个高价值 Skill（性能/网络/审计/多页面/快照）
5. **全量验收**
