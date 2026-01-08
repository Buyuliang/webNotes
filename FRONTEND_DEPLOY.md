# 前端网页部署指南

本指南将帮助你部署 WebNotes 的前端网页到各种静态托管服务。

## 📋 部署前准备

### 1. 确保 Worker 已部署

前端需要连接到已部署的 Cloudflare Worker。如果还没部署，请先参考 [WORKER_DEPLOY.md](./WORKER_DEPLOY.md)。

### 2. 更新 Worker URL

在部署前端之前，需要更新前端代码中的 Worker URL：

**编辑 `api.js` 和 `auth.js`**，将 `apiBase` 更新为你的 Worker URL：

```javascript
// api.js 和 auth.js
constructor() {
    this.apiBase = 'https://your-worker.workers.dev'; // 替换为你的 Worker URL
}
```

### 3. 准备部署文件

确保以下前端文件已准备好：
- `index.html`
- `style.css`
- `auth.js`
- `api.js`
- `editor.js`

## 🚀 部署方式

### 方式一：Cloudflare Pages（推荐）

Cloudflare Pages 与 Workers 同属 Cloudflare 生态，集成方便，性能优秀。

#### 步骤 1: 准备 GitHub 仓库

1. 在 GitHub 创建新仓库（或使用现有仓库）
2. 将项目文件推送到仓库

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/webNotes.git
git push -u origin main
```

#### 步骤 2: 在 Cloudflare Dashboard 创建 Pages 项目

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击左侧菜单 **Workers & Pages**
3. 点击 **Create application** > **Pages** > **Connect to Git**
4. 选择你的 GitHub 账号并授权
5. 选择 `webNotes` 仓库
6. 点击 **Begin setup**

#### 步骤 3: 配置构建设置

在项目设置页面：

- **Project name**: `webnotes` (或你喜欢的名称)
- **Production branch**: `main` (或你的主分支)
- **Build command**: **留空**（纯静态文件，无需构建）
- **Build output directory**: `/` (根目录)

#### 步骤 4: 部署

1. 点击 **Save and Deploy**
2. 等待部署完成（通常几秒钟）
3. 部署成功后，你会得到一个 Pages URL，例如：
   - `https://webnotes.pages.dev`
   - 或自定义域名（如果已配置）

#### 步骤 5: 配置自定义域名（可选）

1. 在 Pages 项目页面，点击 **Custom domains**
2. 添加你的域名
3. 按照提示配置 DNS 记录

**优点**:
- ✅ 与 Cloudflare Workers 完美集成
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 免费额度充足
- ✅ 自动部署（Git push 后自动更新）

---

### 方式二：GitHub Pages

GitHub Pages 是 GitHub 提供的免费静态网站托管服务。

#### 步骤 1: 准备仓库

1. 在 GitHub 创建新仓库（例如：`webNotes`）
2. 将项目文件推送到仓库

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/webNotes.git
git push -u origin main
```

#### 步骤 2: 启用 GitHub Pages

1. 进入仓库页面
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - 选择 **Deploy from a branch**
   - **Branch**: 选择 `main`（或你的主分支）
   - **Folder**: 选择 `/ (root)`
5. 点击 **Save**

#### 步骤 3: 访问网站

部署完成后（通常几分钟），你的网站将在以下地址可用：
- `https://your-username.github.io/webNotes`

**注意**: 如果仓库名不是 `webNotes`，URL 会相应变化。

**优点**:
- ✅ 完全免费
- ✅ 与 GitHub 仓库集成
- ✅ 自动 HTTPS
- ✅ 简单易用

**缺点**:
- ⚠️ 访问速度可能不如 Cloudflare Pages
- ⚠️ 自定义域名需要配置 CNAME

---

### 方式三：Vercel

Vercel 提供优秀的静态网站托管服务，特别适合前端项目。

#### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2: 登录 Vercel

```bash
vercel login
```

#### 步骤 3: 部署

在项目根目录执行：

```bash
vercel
```

按照提示操作：
- 是否要部署到现有项目？选择 **No**（首次部署）
- 项目名称：输入 `webnotes`（或你喜欢的名称）
- 目录：直接回车（使用当前目录）

#### 步骤 4: 生产环境部署

```bash
vercel --prod
```

部署完成后，你会得到一个 URL，例如：
- `https://webnotes.vercel.app`

#### 通过 GitHub 自动部署（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **Add New Project**
4. 导入你的 GitHub 仓库
5. 配置：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: 留空
   - **Output Directory**: `./`
6. 点击 **Deploy**

**优点**:
- ✅ 全球 CDN
- ✅ 自动 HTTPS
- ✅ 自动部署（Git push 触发）
- ✅ 预览部署（每个 PR 都有预览 URL）

---

### 方式四：Netlify

Netlify 是另一个流行的静态网站托管平台。

#### 通过 Netlify Dashboard 部署

1. 访问 [netlify.com](https://www.netlify.com)
2. 使用 GitHub 账号登录
3. 点击 **Add new site** > **Import an existing project**
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **Build command**: 留空
   - **Publish directory**: `/` (根目录)
6. 点击 **Deploy site**

#### 通过 Netlify CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

**优点**:
- ✅ 免费额度充足
- ✅ 自动 HTTPS
- ✅ 表单处理功能
- ✅ 分支预览

---

### 方式五：其他静态托管服务

你还可以使用以下服务：

- **Surge.sh**: `surge ./`
- **Firebase Hosting**: 使用 Firebase CLI
- **AWS S3 + CloudFront**: 适合有 AWS 经验的用户
- **阿里云 OSS**: 国内访问速度快

## 🔧 部署后配置

### 1. 更新 GitHub OAuth App 回调 URL

部署前端后，需要更新 GitHub OAuth App 的回调 URL：

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 编辑你的 OAuth App
3. 更新 **Authorization callback URL** 为：
   - `https://your-frontend-domain.com`（如果前端和 Worker 在同一域名）
   - 或保持 Worker URL：`https://your-worker.workers.dev/auth/callback`

### 2. 测试部署

1. 访问你的前端网站
2. 点击 "使用 GitHub 登录"
3. 完成 OAuth 认证
4. 测试编辑和保存功能

### 3. 配置 CORS（如需要）

如果前端和 Worker 不在同一域名，确保 Worker 的 CORS 配置正确（代码中已包含）。

## 📝 部署检查清单

- [ ] Worker 已成功部署并运行
- [ ] 前端代码中的 `apiBase` 已更新为 Worker URL
- [ ] 所有前端文件已上传到托管服务
- [ ] 网站可以正常访问
- [ ] GitHub OAuth 登录功能正常
- [ ] 笔记编辑和保存功能正常
- [ ] 文件上传功能正常

## 🐛 常见问题

### 问题 1: 前端无法连接到 Worker

**症状**: 点击登录或保存时出现网络错误

**解决方案**:
- 检查 `api.js` 和 `auth.js` 中的 `apiBase` 是否正确
- 确认 Worker 已成功部署
- 检查浏览器控制台的错误信息
- 确认 Worker URL 可以访问

### 问题 2: CORS 错误

**症状**: 浏览器控制台显示 CORS 相关错误

**解决方案**:
- Worker 代码中已包含 CORS 头，确认已正确部署
- 检查前端和 Worker 的域名配置
- 清除浏览器缓存后重试

### 问题 3: GitHub Pages 404 错误

**症状**: 访问 GitHub Pages URL 显示 404

**解决方案**:
- 确认仓库是公开的（或使用 GitHub Pro）
- 检查 Pages 设置中的分支和目录配置
- 等待几分钟让 GitHub 完成部署
- 检查仓库中是否有 `index.html` 文件

### 问题 4: 静态资源加载失败

**症状**: CSS 或 JS 文件无法加载

**解决方案**:
- 检查文件路径是否正确（相对路径）
- 确认所有文件都已上传
- 检查浏览器控制台的 404 错误

## 💡 推荐方案

根据你的需求选择：

- **最佳性能**: Cloudflare Pages（与 Worker 同平台，延迟最低）
- **最简单**: GitHub Pages（如果代码已在 GitHub）
- **最佳体验**: Vercel（自动部署和预览功能强大）
- **功能丰富**: Netlify（额外功能多）

## 🔗 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Vercel 文档](https://vercel.com/docs)
- [Netlify 文档](https://docs.netlify.com/)

