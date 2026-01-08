# 配置前端 URL 为 https://buyuliang.github.io/webNotes

## 📋 配置步骤

### 在 Cloudflare Dashboard 中设置

1. **访问 Cloudflare Dashboard**
   - 打开 [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - 使用你的账号登录

2. **进入 Worker 设置**
   - 点击左侧菜单的 **Workers & Pages**
   - 点击你的 Worker 名称（`webnotes`）
   - 点击 **Settings**（设置）标签

3. **添加环境变量**
   - 向下滚动找到 **Variables**（变量）部分
   - 在 **Environment Variables** 中，点击 **Add variable**
   - 填写：
     - **Variable name**: `FRONTEND_URL`
     - **Value**: `https://buyuliang.github.io/webNotes`
   - 点击 **Save**

4. **重新部署 Worker**
   - 点击 **Deployments** 标签
   - 点击 **Redeploy** 按钮
   - 等待部署完成

## ✅ 验证配置

配置完成后：

1. **访问前端网站**：https://buyuliang.github.io/webNotes
2. **点击 "使用 GitHub 登录"**
3. **完成 GitHub 授权**
4. **验证重定向**：登录后应该重定向回 `https://buyuliang.github.io/webNotes`，而不是 Worker URL

## 📝 配置截图说明

### 在 Variables 部分：

```
Variables
├── Environment Variables
│   └── [Add variable]
│       ├── Variable name: FRONTEND_URL
│       └── Value: https://buyuliang.github.io/webNotes
└── Encrypted Variables (Secrets)
    ├── GITHUB_CLIENT_ID
    └── GITHUB_CLIENT_SECRET
```

## ⚠️ 重要提示

1. **URL 格式**：
   - ✅ 正确：`https://buyuliang.github.io/webNotes`
   - ❌ 错误：`https://buyuliang.github.io/webNotes/`（不要尾部斜杠）

2. **区分大小写**：
   - GitHub Pages URL 区分大小写
   - 确保 `webNotes` 的大小写正确

3. **重新部署**：
   - 设置环境变量后，必须重新部署 Worker 才能生效

## 🐛 如果仍然重定向到博客

如果登录后仍然重定向到博客（`https://buyuliang.github.io`）：

1. **检查环境变量**：
   - 确认 `FRONTEND_URL` 已正确设置
   - 确认值是 `https://buyuliang.github.io/webNotes`（包含 `/webNotes`）

2. **清除浏览器缓存**：
   - 清除 cookies 和缓存
   - 或使用无痕模式测试

3. **查看日志**：
   - 在 Worker 的 **Logs** 标签中查看重定向 URL
   - 确认使用的是正确的 `FRONTEND_URL`

## 🔄 使用 Wrangler CLI（可选）

如果你使用命令行，也可以这样设置：

```bash
# 设置前端 URL
wrangler secret put FRONTEND_URL
# 然后输入: https://buyuliang.github.io/webNotes
```

## ✅ 完成后的效果

配置完成后，登录流程应该是：

1. 用户访问：`https://buyuliang.github.io/webNotes`
2. 点击 "使用 GitHub 登录"
3. 跳转到 GitHub 授权页面
4. 授权后，GitHub 回调到 Worker：`https://webnotes.1259233520.workers.dev/auth/callback`
5. Worker 处理回调，设置 session cookie
6. **重定向到**：`https://buyuliang.github.io/webNotes?session=...`
7. 前端检测到 session 参数，完成登录

## 📋 检查清单

- [ ] `FRONTEND_URL` 环境变量已设置为 `https://buyuliang.github.io/webNotes`
- [ ] Worker 已重新部署
- [ ] 测试登录流程，确认重定向到正确的 URL
- [ ] 清除浏览器缓存后再次测试

