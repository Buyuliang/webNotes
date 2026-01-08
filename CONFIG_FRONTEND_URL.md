# 配置前端 URL（登录后重定向）

## 📋 说明

登录成功后，系统会重定向到前端网站。你可以通过以下方式配置前端 URL：

## ✅ 方法一：设置环境变量（推荐）

### 在 Cloudflare Dashboard 中设置

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** > 你的 Worker（`webnotes`）
3. 点击 **Settings** 标签
4. 向下滚动找到 **Variables**（变量）部分
5. 在 **Environment Variables** 中添加：
   - **Variable name**: `FRONTEND_URL`
   - **Value**: 你的前端网站 URL（例如：`https://webnotes.pages.dev` 或 `https://your-domain.com`）
6. 点击 **Save**

### 使用 Wrangler CLI 设置

```bash
# 设置前端 URL
wrangler secret put FRONTEND_URL
# 然后输入你的前端 URL
```

## ✅ 方法二：自动从 Referer 获取（默认）

如果不设置 `FRONTEND_URL` 环境变量，系统会：
1. 首先尝试从请求的 `Referer` header 获取前端 URL
2. 如果获取不到，则使用 Worker 的 origin

**这意味着**：如果用户从前端网站点击登录，系统会自动重定向回前端网站。

## 📝 配置示例

### 示例 1: 使用 Cloudflare Pages

如果你的前端部署在 Cloudflare Pages：
```
FRONTEND_URL = https://webnotes.pages.dev
```

### 示例 2: 使用 GitHub Pages

如果你的前端部署在 GitHub Pages：
```
FRONTEND_URL = https://your-username.github.io/webNotes
```

### 示例 3: 使用自定义域名

如果你使用自定义域名：
```
FRONTEND_URL = https://webnotes.yourdomain.com
```

## 🔧 代码逻辑

代码会按以下优先级选择重定向 URL：

1. **环境变量 `FRONTEND_URL`**（如果已设置）
2. **请求的 `Referer` header**（如果存在）
3. **Worker 的 origin**（作为后备方案）

```javascript
const frontendUrl = env.FRONTEND_URL || 
                   request.headers.get('Referer')?.split('?')[0] || 
                   url.origin;
```

## ⚠️ 重要提示

1. **URL 格式**：
   - 必须包含协议（`https://`）
   - 不要包含尾部斜杠
   - 不要包含路径（系统会自动添加 `?session=...`）

2. **正确示例**：
   ```
   ✅ https://webnotes.pages.dev
   ✅ https://your-domain.com
   ```

3. **错误示例**：
   ```
   ❌ webnotes.pages.dev（缺少协议）
   ❌ https://webnotes.pages.dev/（尾部斜杠）
   ❌ https://webnotes.pages.dev/index.html（包含路径）
   ```

## 🔄 更新配置后

1. **重新部署 Worker**：
   - 在 Dashboard 中点击 **Deployments** > **Redeploy**
   - 或通过 Git push 触发自动部署

2. **测试登录流程**：
   - 访问前端网站
   - 点击 "使用 GitHub 登录"
   - 完成授权后，应该重定向到前端网站而不是 Worker URL

## 🐛 故障排除

### 问题 1: 仍然重定向到 Worker URL

**解决方案**：
- 确认 `FRONTEND_URL` 环境变量已正确设置
- 确认环境变量值格式正确（包含 `https://`）
- 重新部署 Worker

### 问题 2: 重定向到错误的 URL

**解决方案**：
- 检查 `FRONTEND_URL` 的值是否正确
- 确认前端网站可以正常访问
- 清除浏览器缓存后重试

### 问题 3: CORS 错误

**解决方案**：
- 确认前端和 Worker 的域名配置正确
- 检查 CORS 设置

## 📋 检查清单

- [ ] `FRONTEND_URL` 环境变量已设置（可选，推荐）
- [ ] 环境变量值格式正确（包含 `https://`，无尾部斜杠）
- [ ] Worker 已重新部署
- [ ] 测试登录流程，确认重定向到前端网站

## 💡 提示

- **推荐设置环境变量**：虽然系统可以从 Referer 自动获取，但设置环境变量更可靠
- **支持多个环境**：可以为生产环境和预览环境设置不同的 `FRONTEND_URL`
- **动态获取**：如果不设置环境变量，系统会智能地从 Referer 获取，适合开发环境

