# 部署指南

## 快速部署步骤

### 1. 准备 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写：
   - **Application name**: WebNotes
   - **Homepage URL**: `https://your-worker.workers.dev` (先部署 Worker 获取地址)
   - **Authorization callback URL**: `https://your-worker.workers.dev/auth/callback`
4. 记录 **Client ID** 和 **Client Secret**

### 2. 创建 GitHub 数据仓库

创建一个新的公开或私有仓库（例如：`webNotes`）用于存储笔记。

### 3. 设置 Cloudflare Worker

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 KV 命名空间
wrangler kv:namespace create "SESSIONS"
wrangler kv:namespace create "SESSIONS" --preview
```

将返回的 KV ID 更新到 `wrangler.toml` 中。

### 4. 配置环境变量

```bash
# 设置 GitHub OAuth 密钥
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

可选的环境变量（在 Cloudflare Dashboard 中设置）：
- `GITHUB_REPO`: 仓库名（默认: webNotes）
- `GITHUB_USERNAME`: GitHub 用户名（可选）

### 5. 部署 Worker

```bash
npm install
wrangler deploy
```

记录下 Worker URL（例如：`https://webnotes-worker.workers.dev`）

### 6. 更新前端配置

编辑 `api.js` 和 `auth.js`，将 `apiBase` 更新为你的 Worker URL：

```javascript
this.apiBase = 'https://your-worker.workers.dev';
```

### 7. 部署前端

#### 选项 A: Cloudflare Pages（推荐）

1. 在 Cloudflare Dashboard 创建 Pages 项目
2. 连接 GitHub 仓库
3. 构建设置：
   - Build command: (留空)
   - Build output: `/`
4. 部署

#### 选项 B: GitHub Pages

1. 在仓库设置中启用 GitHub Pages
2. 选择主分支作为源
3. 访问 `https://username.github.io/webNotes`

#### 选项 C: 其他静态托管

将项目文件上传到任何静态托管服务（Vercel、Netlify 等）

## 本地开发

### 启动 Worker

```bash
# 创建 .dev.vars 文件（参考 .dev.vars.example）
wrangler dev
```

### 启动前端

```bash
# 使用 Python
python3 -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000
```

访问 `http://localhost:8000`

## 故障排除

### OAuth 认证失败

- 检查回调 URL 是否与 GitHub OAuth App 设置一致
- 确认环境变量已正确设置
- 查看 Worker 日志：`wrangler tail`

### 保存失败

- 确认 GitHub 仓库已创建
- 检查仓库权限（公开或私有都可以）
- 确认 OAuth App 有 `repo` scope

### CORS 错误

- 确认前端和 Worker 的域名配置正确
- 检查浏览器控制台的详细错误信息

