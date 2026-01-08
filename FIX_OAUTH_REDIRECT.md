# 修复 GitHub OAuth 回调 URL 错误

## ❌ 错误信息

```
The redirect_uri is not associated with this application.
The application might be misconfigured or could be trying to redirect you to a website you weren't expecting.
```

这个错误表示 GitHub OAuth App 的回调 URL 配置与 Worker 代码中使用的不一致。

## ✅ 解决步骤

### 步骤 1: 确认你的 Worker URL

首先，你需要知道你的 Worker 的完整 URL。

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 点击你的 Worker 名称（例如：`webnotes`）
4. 在页面顶部，你会看到 Worker URL，格式类似：
   - `https://webnotes.your-subdomain.workers.dev`
   - 或 `https://webnotes-account.workers.dev`

**记录下这个完整的 URL**。

### 步骤 2: 检查 Worker 代码中的回调 URL

Worker 代码中的回调 URL 应该是：

```javascript
const redirectUri = `${url.origin}/auth/callback`;
```

这会自动使用 Worker 的域名，所以应该是：
- `https://your-worker.workers.dev/auth/callback`

### 步骤 3: 更新 GitHub OAuth App 配置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击你的 OAuth App（如果没有，需要先创建一个）
3. 找到 **Authorization callback URL** 字段
4. **更新为**：`https://your-worker.workers.dev/auth/callback`
   - 将 `your-worker.workers.dev` 替换为你的实际 Worker URL
   - **重要**：必须包含 `https://` 和 `/auth/callback` 路径

### 步骤 4: 保存并测试

1. 在 GitHub 页面点击 **Update application**
2. 等待几秒钟让更改生效
3. 重新尝试登录

## 📋 完整配置示例

### GitHub OAuth App 配置

在 GitHub OAuth App 设置中：

- **Application name**: `WebNotes`
- **Homepage URL**: `https://your-worker.workers.dev`（或你的前端网站 URL）
- **Authorization callback URL**: `https://your-worker.workers.dev/auth/callback` ⚠️ **必须正确**

### Worker 代码中的配置

在 `src/index.js` 中，代码会自动使用正确的 URL：

```javascript
// GitHub OAuth 登录
if (path === '/auth/login') {
  const clientId = env.GITHUB_CLIENT_ID;
  const redirectUri = `${url.origin}/auth/callback`; // 自动使用 Worker 的域名
  // ...
}
```

## 🔍 常见错误配置

### ❌ 错误 1: 缺少协议

```
your-worker.workers.dev/auth/callback  ❌ 缺少 https://
```

**正确**：
```
https://your-worker.workers.dev/auth/callback  ✅
```

### ❌ 错误 2: 缺少路径

```
https://your-worker.workers.dev  ❌ 缺少 /auth/callback
```

**正确**：
```
https://your-worker.workers.dev/auth/callback  ✅
```

### ❌ 错误 3: 使用了错误的域名

```
https://webnotes.pages.dev/auth/callback  ❌ 如果 Worker 是 webnotes.workers.dev
```

**正确**：
```
https://webnotes.workers.dev/auth/callback  ✅
```

### ❌ 错误 4: 使用了前端域名而不是 Worker 域名

如果前端和 Worker 是不同的域名，回调 URL 必须使用 **Worker 的域名**，而不是前端的域名。

## 🎯 快速检查清单

- [ ] 已确认 Worker URL（例如：`https://webnotes.workers.dev`）
- [ ] GitHub OAuth App 的回调 URL 设置为：`https://your-worker.workers.dev/auth/callback`
- [ ] 回调 URL 包含 `https://` 协议
- [ ] 回调 URL 包含 `/auth/callback` 路径
- [ ] 在 GitHub 中已保存更改
- [ ] 等待几秒钟让更改生效

## 🔄 如果前端和 Worker 使用不同域名

如果你的前端部署在 Cloudflare Pages（例如：`webnotes.pages.dev`），而 Worker 在 `webnotes.workers.dev`：

1. **GitHub OAuth App 的回调 URL** 必须使用 **Worker 的域名**：
   ```
   https://webnotes.workers.dev/auth/callback
   ```

2. **前端代码**（`auth.js`）中的 `apiBase` 应该指向 Worker：
   ```javascript
   this.apiBase = 'https://webnotes.workers.dev';
   ```

3. **OAuth 流程**：
   - 用户在前端点击登录
   - 前端重定向到 Worker：`https://webnotes.workers.dev/auth/login`
   - Worker 重定向到 GitHub
   - GitHub 回调到 Worker：`https://webnotes.workers.dev/auth/callback`
   - Worker 处理回调并设置 cookie
   - 重定向回前端（带 session 参数）

## 🐛 故障排除

### 问题 1: 更新后仍然报错

**解决方案**：
- 等待 1-2 分钟让 GitHub 的更改生效
- 清除浏览器缓存和 cookies
- 尝试使用无痕模式
- 检查是否在正确的 GitHub 账户下配置

### 问题 2: 不确定 Worker URL

**解决方案**：
1. 在 Cloudflare Dashboard 中查看 Worker
2. 访问 Worker URL（例如：`https://webnotes.workers.dev`）
3. 应该看到 "WebNotes API" 的响应
4. 这个 URL 就是你需要使用的

### 问题 3: 有多个 Worker 或环境

**解决方案**：
- 确保使用正确的 Worker URL
- 如果有生产环境和预览环境，分别为它们创建不同的 GitHub OAuth App
- 或者使用同一个 OAuth App，但确保回调 URL 配置正确

## 📝 完整配置流程

### 1. 创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 **New OAuth App**
3. 填写：
   - **Application name**: `WebNotes`
   - **Homepage URL**: `https://your-worker.workers.dev`
   - **Authorization callback URL**: `https://your-worker.workers.dev/auth/callback`
4. 点击 **Register application**
5. 记录 **Client ID** 和 **Client Secret**

### 2. 配置 Worker 环境变量

在 Cloudflare Dashboard 中设置：
- `GITHUB_CLIENT_ID` = 你的 Client ID
- `GITHUB_CLIENT_SECRET` = 你的 Client Secret

### 3. 测试

1. 访问你的前端网站
2. 点击 "使用 GitHub 登录"
3. 应该能正常跳转到 GitHub 授权页面
4. 授权后应该能成功回调

## 💡 提示

1. **回调 URL 必须精确匹配**：包括协议（https）、域名、路径，不能有多余的斜杠
2. **可以配置多个回调 URL**：GitHub 允许在一个 OAuth App 中配置多个回调 URL（用换行分隔），但通常一个就够了
3. **开发环境**：如果使用本地开发，需要为本地地址创建单独的 OAuth App 或添加本地回调 URL

## 🔗 相关资源

- [GitHub OAuth Apps](https://github.com/settings/developers)
- [GitHub OAuth 文档](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

