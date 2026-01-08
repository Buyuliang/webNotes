# Cloudflare Workers 部署详细指南

## 📋 前置条件

1. **Cloudflare 账号** - 如果没有，访问 [cloudflare.com](https://www.cloudflare.com) 免费注册
2. **Node.js** - 需要 Node.js 16+ 版本（推荐使用 Node.js 18+）
3. **GitHub 账号** - 用于 OAuth 认证和数据存储

## 🚀 部署步骤

### 步骤 1: 安装 Wrangler CLI

Wrangler 是 Cloudflare Workers 的官方命令行工具。

```bash
# 使用 npm 全局安装
npm install -g wrangler

# 或者使用 yarn
yarn global add wrangler

# 验证安装
wrangler --version
```

### 步骤 2: 登录 Cloudflare

```bash
wrangler login
```

这个命令会：
- 打开浏览器窗口
- 要求你登录 Cloudflare 账号
- 授权 Wrangler 访问你的 Cloudflare 账户

登录成功后，你会看到 "Successfully logged in" 的提示。

### 步骤 3: 创建 KV 命名空间

KV (Key-Value) 用于存储用户会话数据。

```bash
# 创建生产环境 KV 命名空间
wrangler kv:namespace create "SESSIONS"
```

执行后会返回类似以下的信息：
```
🌀  Creating namespace with title "webnotes-SESSIONS"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "SESSIONS", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

```bash
# 创建预览环境 KV 命名空间（用于本地开发）
wrangler kv:namespace create "SESSIONS" --preview
```

同样会返回预览环境的 ID：
```
🌀  Creating namespace with title "webnotes-SESSIONS-preview"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "SESSIONS", preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" }
```

### 步骤 4: 更新 wrangler.toml 配置

编辑 `wrangler.toml` 文件，将步骤 3 中获取的 KV ID 填入：

```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"        # 生产环境 ID
preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" # 预览环境 ID
```

### 步骤 5: 配置环境变量（Secrets）

#### 5.1 设置 GitHub OAuth 密钥

这些是敏感信息，使用 `wrangler secret put` 命令安全地存储：

```bash
# 设置 GitHub Client ID
wrangler secret put GITHUB_CLIENT_ID
# 然后输入你的 GitHub Client ID

# 设置 GitHub Client Secret
wrangler secret put GITHUB_CLIENT_SECRET
# 然后输入你的 GitHub Client Secret
```

**注意**: 这些密钥不会显示在配置文件中，而是加密存储在 Cloudflare 中。

#### 5.2 设置可选环境变量（可选）

如果需要自定义仓库名，可以在 Cloudflare Dashboard 中设置：

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择你的账户
3. 进入 **Workers & Pages** > **webnotes** (你的 Worker 名称)
4. 点击 **Settings** > **Variables**
5. 添加环境变量：
   - `GITHUB_REPO`: `webNotes` (或你的仓库名)
   - `GITHUB_USERNAME`: 你的 GitHub 用户名（可选）

### 步骤 6: 安装项目依赖

```bash
# 进入项目目录
cd /Users/apple/Desktop/myproject/webNotes

# 安装依赖
npm install
```

### 步骤 7: 部署 Worker

```bash
wrangler deploy
```

部署过程会显示：
- 上传文件
- 创建/更新 Worker
- 返回 Worker URL

部署成功后，你会看到类似以下的信息：
```
✨  Compiled Worker successfully
✨  Successfully published your Worker to the following routes:
  - webnotes.workers.dev
  - https://webnotes.workers.dev
```

**记录下你的 Worker URL**，例如：`https://webnotes.workers.dev`

### 步骤 8: 验证部署

#### 8.1 测试 Worker 是否运行

在浏览器中访问你的 Worker URL，应该看到 "WebNotes API" 的响应。

#### 8.2 查看 Worker 日志

```bash
# 实时查看 Worker 日志
wrangler tail

# 查看特定环境的日志
wrangler tail --env production
```

#### 8.3 在 Cloudflare Dashboard 查看

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 点击你的 Worker 名称
4. 可以查看：
   - 请求统计
   - 错误日志
   - 性能指标

## 🔧 常用命令

### 更新 Worker

修改代码后，重新部署：

```bash
wrangler deploy
```

### 删除 Worker

```bash
wrangler delete
```

### 查看 Worker 信息

```bash
wrangler whoami
```

### 查看所有 Workers

```bash
wrangler list
```

### 本地开发（测试）

```bash
# 启动本地开发服务器
wrangler dev

# 使用预览环境变量
wrangler dev --env preview
```

## ⚠️ 常见问题

### 问题 1: 登录失败

**错误**: `Error: failed to login`

**解决方案**:
- 确保已注册 Cloudflare 账号
- 尝试清除浏览器缓存后重新登录
- 使用 `wrangler logout` 后重新登录

### 问题 2: KV 命名空间创建失败

**错误**: `Error: A request to the Cloudflare API (...) failed`

**解决方案**:
- 确保已正确登录 Cloudflare
- 检查账户是否有 Workers 权限
- 免费账户可以创建多个 KV 命名空间

### 问题 3: 部署失败 - 环境变量未设置

**错误**: `Error: Environment variable GITHUB_CLIENT_ID is not set`

**解决方案**:
- 使用 `wrangler secret put GITHUB_CLIENT_ID` 设置
- 确保在正确的账户下设置

### 问题 4: Worker URL 无法访问

**解决方案**:
- 检查 Worker 是否成功部署：`wrangler list`
- 查看 Worker 日志：`wrangler tail`
- 在 Cloudflare Dashboard 中检查 Worker 状态

### 问题 5: CORS 错误

**解决方案**:
- 确保前端代码中的 `apiBase` 指向正确的 Worker URL
- 检查 Worker 代码中的 CORS 头设置

## 📊 部署后检查清单

- [ ] Worker 成功部署并返回 URL
- [ ] KV 命名空间已创建并配置
- [ ] GitHub OAuth 密钥已设置
- [ ] Worker URL 可以访问（返回 "WebNotes API"）
- [ ] 前端代码中的 `apiBase` 已更新为 Worker URL
- [ ] GitHub OAuth App 的回调 URL 已更新为 Worker URL
- [ ] 测试登录功能是否正常

## 🔗 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [GitHub OAuth Apps](https://github.com/settings/developers)

## 💡 提示

1. **免费额度**: Cloudflare Workers 免费账户提供：
   - 每天 100,000 次请求
   - 10ms CPU 时间/请求
   - 对于个人项目完全够用

2. **自定义域名**: 可以在 Cloudflare Dashboard 中为 Worker 绑定自定义域名

3. **环境管理**: 可以使用 `wrangler.toml` 中的 `[env.production]` 和 `[env.preview]` 管理不同环境

4. **版本控制**: 每次部署都会创建新版本，可以在 Dashboard 中查看和回滚

