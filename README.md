# WebNotes - GitHub 在线记事本

一个基于 GitHub 和 Cloudflare Workers 的在线记事本应用，可以在任意设备的 Web 端随时记录和同步笔记。

## ✨ 功能特性

- 🔐 **GitHub OAuth 认证** - 使用 GitHub 账号登录，安全可靠
- 📝 **富文本编辑** - 支持格式化文本、插入链接和图片
- 💾 **自动保存** - 编辑后 30 秒自动保存到 GitHub
- 📎 **文件上传** - 支持上传图片和其他文件
- 🌐 **跨设备同步** - 数据存储在 GitHub，可在任意设备访问
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 🚀 快速开始

> 📖 **部署指南**:
> - **命令行部署**: 查看 [WORKER_DEPLOY.md](./WORKER_DEPLOY.md) 使用 Wrangler CLI 部署
> - **Web UI 部署**: 查看 [CLOUDFLARE_UI_GUIDE.md](./CLOUDFLARE_UI_GUIDE.md) 通过网页界面部署（推荐新手）

### 前置要求

1. **GitHub 账号** - 用于 OAuth 认证和数据存储
2. **Cloudflare 账号** - 用于部署 Worker（[免费注册](https://www.cloudflare.com)）
3. **Node.js** - 需要 Node.js 16+ 版本（推荐 18+）

### 1. 创建 GitHub OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写信息：
   - **Application name**: WebNotes
   - **Homepage URL**: `https://your-domain.com` (或本地开发用 `http://localhost:8787`)
   - **Authorization callback URL**: `https://your-worker.workers.dev/auth/callback`
4. 记录下 **Client ID** 和 **Client Secret**

### 2. 创建 GitHub 仓库

创建一个新的 GitHub 仓库用于存储笔记数据（例如：`webNotes`）

### 3. 设置 Cloudflare Worker

#### 3.1 安装 Wrangler CLI

```bash
npm install -g wrangler
```

#### 3.2 登录 Cloudflare

```bash
wrangler login
```

#### 3.3 创建 KV 命名空间

```bash
# 创建生产环境 KV
wrangler kv:namespace create "SESSIONS"

# 创建预览环境 KV
wrangler kv:namespace create "SESSIONS" --preview
```

将返回的 KV 命名空间 ID 更新到 `wrangler.toml` 文件中。

#### 3.4 配置环境变量

在 Cloudflare Dashboard 中设置以下环境变量：

- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret
- `GITHUB_REPO` - 存储笔记的仓库名（可选，默认: webNotes）
- `GITHUB_USERNAME` - GitHub 用户名（可选，会从 OAuth 获取）

或者使用 Wrangler CLI：

```bash
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

### 4. 部署 Worker

```bash
npm install
wrangler deploy
```

部署完成后，记录下 Worker 的 URL（例如：`https://webnotes-worker.workers.dev`）

### 5. 更新前端配置

在 `api.js` 和 `auth.js` 中，将 `apiBase` 更新为你的 Worker URL：

```javascript
this.apiBase = 'https://your-worker.workers.dev';
```

### 6. 部署前端

> 📖 **详细前端部署指南**: 查看 [FRONTEND_DEPLOY.md](./FRONTEND_DEPLOY.md) 获取完整的前端部署步骤

你可以将前端文件部署到：

- **Cloudflare Pages** - 推荐，与 Worker 集成方便
- **GitHub Pages** - 免费静态托管
- **Vercel/Netlify** - 其他静态托管服务

**快速部署步骤**:

1. **更新 Worker URL**: 在 `api.js` 和 `auth.js` 中，将 `apiBase` 更新为你的 Worker URL
2. **选择部署方式**: 参考 [FRONTEND_DEPLOY.md](./FRONTEND_DEPLOY.md) 选择适合的部署方式
3. **上传文件**: 将前端文件（index.html, style.css, *.js）上传到托管服务
4. **测试**: 访问部署后的网站，测试登录和保存功能

## 📁 项目结构

```
webNotes/
├── index.html          # 主页面
├── style.css           # 样式文件
├── auth.js             # 认证管理
├── api.js              # API 调用
├── editor.js           # 编辑器管理
├── src/
│   └── index.js        # Cloudflare Worker 后端
├── wrangler.toml       # Worker 配置
├── package.json        # 项目依赖
└── README.md          # 项目文档
```

## 🛠️ 本地开发

### 启动 Worker 开发服务器

```bash
npm install
wrangler dev
```

Worker 将在 `http://localhost:8787` 运行。

### 启动前端开发服务器

使用任意静态文件服务器，例如：

```bash
# 使用 Python
python3 -m http.server 8000

# 或使用 Node.js http-server
npx http-server -p 8000
```

访问 `http://localhost:8000` 即可使用。

**注意**: 确保前端代码中的 `apiBase` 指向本地 Worker 地址。

## 📝 使用说明

1. **登录**: 点击 "使用 GitHub 登录" 按钮，授权应用访问你的 GitHub 账号
2. **编辑**: 在编辑器中输入内容，支持格式化文本、插入链接和图片
3. **保存**: 
   - 手动点击 "保存" 按钮
   - 或使用快捷键 `Ctrl+S` (Windows) / `Cmd+S` (Mac)
   - 或等待 30 秒自动保存
4. **上传文件**: 点击工具栏的 📎 按钮或直接拖拽文件到编辑器

## 🔒 数据存储

所有笔记数据存储在 GitHub 仓库中：

- **文档路径**: `docs/index.json` (默认)
- **上传文件**: `uploads/` 目录
- **数据格式**: JSON 格式，包含内容和更新时间

## 🐛 故障排除

### OAuth 认证失败

- 检查 GitHub OAuth App 的回调 URL 是否正确
- 确认 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET` 已正确设置

### 保存失败

- 确认 GitHub 仓库已创建且 Worker 有访问权限
- 检查浏览器控制台的错误信息
- 确认 KV 命名空间已正确配置

### 文件上传失败

- 确认 GitHub 仓库有足够的存储空间
- 检查文件大小是否超过 GitHub 的限制（100MB）

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
