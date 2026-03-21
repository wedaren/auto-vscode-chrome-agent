"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserToolProvider = void 0;
// browser-tools.ts — 原生浏览器工具提供者
// 职责：定义浏览器操作工具注册表（browser_click / browser_type / browser_navigate 等），
//       通过 WebSocket tool_execute 协议将工具调用转发到 Chrome 侧执行。
//       接口与 McpClient 对齐（listTools / callTool），可在 AgentLoop 中互换使用。
const vscode = __importStar(require("vscode"));
// ────────────────────────────────────────────────────────────────
// 工具注册表（静态定义）
// ────────────────────────────────────────────────────────────────
/** browser_ 前缀工具名 → Chrome ActionType 映射 */
const TOOL_MAPPINGS = {
    browser_click: { actionType: 'click' },
    browser_type: { actionType: 'type' },
    browser_navigate: { actionType: 'navigate' },
    browser_scroll: { actionType: 'scroll', argMapping: { mode: 'scrollMode', pixels: 'scrollPixels' } },
    browser_screenshot: { actionType: 'screenshot' },
    browser_query_selector: { actionType: 'querySelector' },
    browser_get_text: { actionType: 'getTextContent' },
    browser_get_attribute: { actionType: 'getAttribute' },
    browser_wait: { actionType: 'waitForElement' },
    browser_highlight: { actionType: 'highlight', argMapping: { color: 'highlightColor', duration: 'highlightDuration' } },
    browser_query_selector_all: { actionType: 'querySelectorAll', argMapping: { limit: 'maxCount' } },
    browser_get_value: { actionType: 'getValue' },
    browser_evaluate: { actionType: 'evaluate', argMapping: { code: 'expression' } },
    browser_select_option: { actionType: 'selectOption', argMapping: { value: 'optionValue', text: 'optionText' } },
    browser_get_links: { actionType: 'getLinks', argMapping: { limit: 'maxCount' } },
    // ── evo_v19_001: 沉浸式翻译工具 ──
    browser_extract_paragraphs: { actionType: 'extractParagraphs', argMapping: { scope: 'scopeSelector', limit: 'maxCount' } },
    browser_inject_bilingual: { actionType: 'injectBilingual', argMapping: { mode: 'injectMode' } },
};
/** 完整的工具定义列表 */
const BROWSER_TOOLS = [
    {
        name: 'browser_click',
        description: 'Click an element on the page. Supports CSS selector targeting with optional text content filtering.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to locate the target element' },
                text: { type: 'string', description: 'Optional text content filter — if multiple elements match the selector, pick the one containing this text' },
            },
            required: ['selector'],
        },
    },
    {
        name: 'browser_type',
        description: 'Type text into an input or textarea element. Clears the existing value first, then sets the new value and fires input/change events. IMPORTANT: Use the `value` parameter (NOT `text`) to specify the string to type.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to locate the input/textarea element' },
                value: { type: 'string', description: 'The text to type into the element. This is the value parameter — do NOT use a "text" parameter instead.' },
            },
            required: ['selector', 'value'],
        },
    },
    {
        name: 'browser_navigate',
        description: 'Navigate the current page to a new URL.',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string', description: 'The target URL to navigate to' },
            },
            required: ['url'],
        },
    },
    {
        name: 'browser_scroll',
        description: 'Scroll the page. Supports four modes: to-top, to-bottom, by-pixels (default), or to-element.',
        inputSchema: {
            type: 'object',
            properties: {
                mode: {
                    type: 'string',
                    description: 'Scroll mode',
                    enum: ['to-top', 'to-bottom', 'by-pixels', 'to-element'],
                    default: 'by-pixels',
                },
                pixels: {
                    type: 'number',
                    description: 'Pixels to scroll (positive = down, negative = up). Only used in by-pixels mode. Default: 300',
                },
                selector: {
                    type: 'string',
                    description: 'CSS selector of the element to scroll into view. Only used in to-element mode.',
                },
            },
            required: [],
        },
    },
    {
        name: 'browser_screenshot',
        description: 'Take a screenshot of the visible area of the current tab. Returns a base64-encoded image.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'browser_query_selector',
        description: 'Query a DOM element by CSS selector and return its key attributes (tagName, id, className, textContent, href, src, value, type, placeholder).',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to locate the element' },
            },
            required: ['selector'],
        },
    },
    {
        name: 'browser_get_text',
        description: 'Get the trimmed text content of an element identified by CSS selector.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to locate the element' },
            },
            required: ['selector'],
        },
    },
    {
        name: 'browser_get_attribute',
        description: 'Get a specific HTML attribute value of an element.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to locate the element' },
                attributeName: { type: 'string', description: 'The name of the attribute to retrieve' },
            },
            required: ['selector', 'attributeName'],
        },
    },
    {
        name: 'browser_wait',
        description: 'Wait for an element to appear in the DOM (uses MutationObserver). Resolves immediately if the element already exists.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector of the element to wait for' },
                timeout: { type: 'number', description: 'Maximum wait time in milliseconds (default: 5000)' },
            },
            required: ['selector'],
        },
    },
    {
        name: 'browser_highlight',
        description: 'Temporarily highlight an element with a colored outline and background. Useful for visually indicating elements to the user.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to locate the element' },
                color: { type: 'string', description: 'Highlight color (default: rgba(255, 165, 0, 0.4))' },
                duration: { type: 'number', description: 'How long the highlight lasts in milliseconds (default: 2000)' },
            },
            required: ['selector'],
        },
    },
    // ── 以下为 evo_v18_001 新增的 5 个工具 ──
    {
        name: 'browser_query_selector_all',
        description: 'Query all DOM elements matching a CSS selector and return an array of their key attributes (tagName, id, className, textContent, href, src, value). Returns at most `limit` elements (default 50).',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to match elements' },
                limit: { type: 'number', description: 'Maximum number of elements to return (default: 50)' },
            },
            required: ['selector'],
        },
    },
    {
        name: 'browser_get_value',
        description: 'Get the current value of an input, textarea, or select element.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to locate the input/textarea/select element' },
            },
            required: ['selector'],
        },
    },
    {
        name: 'browser_evaluate',
        description: 'Execute arbitrary JavaScript code in the page context and return the result. The code is evaluated via `new Function(code)()`. Use for reading computed styles, calling page APIs, or any logic not covered by other tools. Return value is JSON-serialized.',
        inputSchema: {
            type: 'object',
            properties: {
                code: { type: 'string', description: 'JavaScript code to evaluate. The last expression is returned as the result.' },
            },
            required: ['code'],
        },
    },
    {
        name: 'browser_select_option',
        description: 'Select an option in a <select> dropdown element. Specify the target option by its value attribute or visible text. Fires change event after selection.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to locate the <select> element' },
                value: { type: 'string', description: 'The value attribute of the option to select' },
                text: { type: 'string', description: 'The visible text of the option to select (used when value is not provided)' },
            },
            required: ['selector'],
        },
    },
    {
        name: 'browser_get_links',
        description: 'Extract all hyperlinks (<a> elements with href) from the current page. Returns an array of { href, text } objects. Useful for discovering navigation targets, building sitemaps, or finding specific links.',
        inputSchema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'Optional CSS scope selector to limit link extraction (default: whole page, i.e. "a[href]")' },
                limit: { type: 'number', description: 'Maximum number of links to return (default: 100)' },
            },
            required: [],
        },
    },
    // ── evo_v19_001: 沉浸式翻译浏览器工具 ──
    {
        name: 'browser_extract_paragraphs',
        description: 'Intelligently extract content paragraphs from the current page for translation. Detects the main content area (article > main > .content > body) and returns an array of paragraph objects with id, tag, and text. Skips nav, footer, script, style, and ad elements. Each paragraph gets a stable data-imt-id attribute for later injection.',
        inputSchema: {
            type: 'object',
            properties: {
                scope: { type: 'string', description: 'Optional CSS selector to limit extraction scope (default: auto-detect main content area)' },
                limit: { type: 'number', description: 'Maximum number of paragraphs to extract (default: 200)' },
            },
            required: [],
        },
    },
    {
        name: 'browser_inject_bilingual',
        description: 'Inject translated text below original paragraphs as bilingual display, or toggle/clear existing translations. Each translated paragraph is styled with .imt-translation class (light blue left border, subtle background). Modes: "inject" inserts translations, "toggle" shows/hides existing translations, "clear" removes all injected translations.',
        inputSchema: {
            type: 'object',
            properties: {
                mode: {
                    type: 'string',
                    description: 'Operation mode: "inject" to insert translations, "toggle" to show/hide, "clear" to remove all',
                    enum: ['inject', 'toggle', 'clear'],
                    default: 'inject',
                },
                translations: {
                    type: 'string',
                    description: 'JSON-encoded array of { id: string, translated: string } objects. Required for "inject" mode. The id must match the data-imt-id from browser_extract_paragraphs output.',
                },
            },
            required: ['mode'],
        },
    },
];
// ────────────────────────────────────────────────────────────────
// BrowserToolProvider 类
// ────────────────────────────────────────────────────────────────
/**
 * BrowserToolProvider 提供原生浏览器操作工具集，通过 WebSocket 与 Chrome 插件通信执行。
 *
 * 设计对齐 McpClient 接口，使 AgentLoop 可以无缝切换工具来源：
 * - listTools() → 返回工具定义列表（名称 + 描述）
 * - callTool(name, args) → 执行工具并返回 McpToolResult 格式结果
 *
 * 工具调用流程：
 * 1. callTool('browser_click', { selector: '#btn' })
 * 2. 映射 browser_click → Chrome ActionType 'click'
 * 3. 通过 WsServer.sendAndWait 发送 tool_execute 消息
 * 4. Chrome 侧 ToolBridge 收到 → 通过 background → content script 执行
 * 5. Chrome 返回 tool_result → WsServer 匹配 requestId → resolve Promise
 * 6. 转换 ToolResultPayload → McpToolResult 格式返回
 */
class BrowserToolProvider {
    wsServer;
    outputChannel;
    /** 工具执行超时时间（毫秒） */
    toolTimeoutMs;
    /** 状态变更事件（与 McpClient 接口对齐） */
    _onDidChangeState = new vscode.EventEmitter();
    onDidChangeState = this._onDidChangeState.event;
    constructor(wsServer, outputChannel, toolTimeoutMs = 30000) {
        this.wsServer = wsServer;
        this.outputChannel = outputChannel;
        this.toolTimeoutMs = toolTimeoutMs;
    }
    /**
     * 是否可用（WebSocket 有已连接的 Chrome 客户端）
     * 对齐 McpClient.connected 接口
     */
    get connected() {
        return this.wsServer.listening && this.wsServer.clientCount > 0;
    }
    /**
     * 已注册的工具名称和描述列表（对齐 McpClient.discoveredTools）
     */
    get discoveredTools() {
        return BROWSER_TOOLS.map((t) => ({ name: t.name, description: t.description }));
    }
    /**
     * 返回完整的工具定义列表（含 inputSchema）
     */
    listToolDefs() {
        return [...BROWSER_TOOLS];
    }
    /**
     * 返回工具列表（对齐 McpClient.listTools 接口）
     */
    async listTools() {
        return BROWSER_TOOLS.map((t) => ({
            name: t.name,
            description: t.description,
        }));
    }
    /**
     * 执行浏览器工具调用
     *
     * 将 browser_ 前缀的工具名映射到 Chrome 侧 ActionType，
     * 通过 WebSocket tool_execute 协议发送到 Chrome 执行，
     * 返回 McpToolResult 格式（与 McpClient.callTool 对齐）。
     *
     * @param toolName 工具名称（如 browser_click）
     * @param args 工具参数（如 { selector: '#btn' }）
     * @returns McpToolResult 格式的结果
     */
    async callTool(toolName, args = {}) {
        const mapping = TOOL_MAPPINGS[toolName];
        if (!mapping) {
            this.outputChannel.appendLine(`[BrowserToolProvider] 未知工具: ${toolName}`);
            return {
                content: [{ type: 'text', text: `未知的浏览器工具: ${toolName}` }],
                isError: true,
            };
        }
        // 获取 WebSocket 客户端
        const ws = this.wsServer.firstClient;
        if (!ws) {
            this.outputChannel.appendLine('[BrowserToolProvider] 无可用的 Chrome 客户端连接');
            return {
                content: [{ type: 'text', text: '无可用的 Chrome 客户端连接，请确认 Chrome 插件已打开并连接' }],
                isError: true,
            };
        }
        // 映射参数名（browser tool args → BrowserAction fields）
        const mappedArgs = this.mapArgs(args, mapping.argMapping);
        this.outputChannel.appendLine(`[BrowserToolProvider] 调用工具: ${toolName} → ${mapping.actionType}, 参数: ${JSON.stringify(mappedArgs)}`);
        try {
            // 通过 WebSocket sendAndWait 发送 tool_execute 并等待 tool_result
            const result = await this.wsServer.sendAndWait(ws, {
                type: 'tool_execute',
                payload: {
                    toolName: mapping.actionType,
                    toolArgs: mappedArgs,
                },
                sessionId: 'browser-tools',
            }, this.toolTimeoutMs);
            this.outputChannel.appendLine(`[BrowserToolProvider] 工具 ${toolName} 结果: success=${result.success}`);
            // 转换 ToolResultPayload → McpToolResult
            return this.toMcpToolResult(result);
        }
        catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            this.outputChannel.appendLine(`[BrowserToolProvider] 工具 ${toolName} 执行异常: ${errMsg}`);
            return {
                content: [{ type: 'text', text: `工具执行失败: ${errMsg}` }],
                isError: true,
            };
        }
    }
    /**
     * 释放资源
     */
    dispose() {
        this._onDidChangeState.dispose();
    }
    // ────────────────────────────────────────────────────────────────
    // 私有方法
    // ────────────────────────────────────────────────────────────────
    /**
     * 映射参数名（从 browser tool 参数名 → BrowserAction 字段名）
     */
    mapArgs(args, argMapping) {
        if (!argMapping) {
            return { ...args };
        }
        const mapped = {};
        for (const [key, value] of Object.entries(args)) {
            const mappedKey = argMapping[key] || key;
            mapped[mappedKey] = value;
        }
        return mapped;
    }
    /**
     * 将 ToolResultPayload 转换为 McpToolResult 格式
     * 使 AgentLoop 可以统一处理 MCP 工具和浏览器工具的返回值
     */
    toMcpToolResult(result) {
        if (result.success) {
            const text = result.data !== undefined
                ? (typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2))
                : '操作成功';
            return {
                content: [{ type: 'text', text }],
                isError: false,
            };
        }
        else {
            return {
                content: [{ type: 'text', text: result.error || '未知错误' }],
                isError: true,
            };
        }
    }
}
exports.BrowserToolProvider = BrowserToolProvider;
//# sourceMappingURL=browser-tools.js.map