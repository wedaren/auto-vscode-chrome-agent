# CI/CD 发布流程

## 概览

本项目包含两条发布流水线：

| 流水线 | 文件 | 目标市场 |
|--------|------|---------|
| VSCode 插件 | `.github/workflows/release-vscode.yml` | VS Code Marketplace |
| Chrome 插件 | `.github/workflows/release-chrome.yml` | Chrome Web Store |

两条流水线均在推送 `v*` 格式的 tag 时自动触发，也支持在 GitHub Actions 页面手动触发。

---

## 一次性配置步骤

### 1. VSCode Marketplace — 获取 VSCE_PAT

1. 访问 [Azure DevOps](https://dev.azure.com) 并登录（使用与 Marketplace 相同的 Microsoft 账号）
2. 右上角头像 → **Personal access tokens** → **New Token**
3. 配置：
   - **Organization**：选 `All accessible organizations`
   - **Scopes**：勾选 `Marketplace` → `Manage`
4. 复制生成的 token
5. 在 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** 中添加：
   - `VSCE_PAT` = 上面的 token
6. 确保 `packages/vscode-ext/package.json` 中有正确的 `publisher` 字段：
   ```json
   "publisher": "your-publisher-id"
   ```

### 2. Chrome Web Store — 获取 OAuth 凭证

**第一步：Chrome Web Store API 项目**

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目（或使用已有项目）
3. 启用 **Chrome Web Store API**
4. 创建 **OAuth 2.0 客户端 ID**（类型选 `Desktop`）
5. 记录 `Client ID` 和 `Client Secret`

**第二步：获取 Refresh Token（一次性操作，本地执行）**

```bash
# 安装 WXT CLI
pnpm add -g wxt

# 初始化凭证（会打开浏览器让你授权）
cd packages/chrome-ext
pnpm wxt submit init
```

按提示完成授权，获得 Refresh Token。

**第三步：在 GitHub 添加 Secrets**

在仓库 **Settings** → **Secrets and variables** → **Actions** 中添加：

| Secret 名称 | 值 |
|-------------|-----|
| `CHROME_EXTENSION_ID` | Chrome Web Store 中的扩展 ID |
| `CHROME_CLIENT_ID` | OAuth Client ID |
| `CHROME_CLIENT_SECRET` | OAuth Client Secret |
| `CHROME_REFRESH_TOKEN` | 上面获取的 Refresh Token |

---

## 发布操作

### 自动发布（推荐）

```bash
# 更新版本号（同时改两个 package.json）
# packages/vscode-ext/package.json → "version"
# packages/chrome-ext/package.json → "version"

# 打 tag 并推送，自动触发两条流水线
git tag v1.0.0
git push origin v1.0.0
```

### 手动触发

在 GitHub → **Actions** → 选择对应 workflow → **Run workflow**

VSCode 发布支持额外选项：`发布为预发布版本`

---

## 注意事项

- **版本号要一致**：Marketplace 不允许发布已存在的版本号，需在 `package.json` 中先升版本再打 tag
- **Chrome 扩展审核**：提交后有人工审核，通常 1-3 个工作日
- **首次发布**：需要先在各平台手动创建扩展条目，CI/CD 只负责后续更新发布
