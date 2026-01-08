# 如何查看 Worker URL

## 🔍 方法一：在 Cloudflare Dashboard 中查看（最简单）

### 步骤 1: 登录 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 使用你的账号登录

### 步骤 2: 进入 Workers & Pages

1. 在左侧菜单中，点击 **Workers & Pages**
2. 你会看到所有已创建的 Workers 列表

### 步骤 3: 查看 Worker URL

1. 在 Workers 列表中，找到你的 Worker（例如：`webnotes`）
2. **Worker URL 通常显示在以下位置**：
   - Worker 名称下方
   - Worker 卡片上
   - 点击 Worker 名称进入详情页后，在页面顶部

**URL 格式通常是**：
- `https://webnotes.your-subdomain.workers.dev`
- 或 `https://webnotes-account.workers.dev`
- 或 `https://webnotes.1259233520.workers.dev`（你的情况）

### 步骤 4: 确认完整的回调 URL

Worker 的回调 URL = Worker URL + `/auth/callback`

**示例**：
- Worker URL: `https://webnotes.1259233520.workers.dev`
- 回调 URL: `https://webnotes.1259233520.workers.dev/auth/callback`

## 🔍 方法二：在 Worker 详情页查看

1. 点击你的 Worker 名称（例如：`webnotes`）
2. 进入 Worker 详情页
3. 在页面顶部，你会看到：
   - Worker 名称
   - **Worker URL**（可点击的链接）
4. 这个 URL 就是你的 Worker 地址

## 🔍 方法三：通过浏览器直接访问

1. 尝试访问你的 Worker URL（如果你记得大概的格式）
2. 如果访问成功，会看到 "WebNotes API" 的响应
3. 浏览器地址栏中的 URL 就是你的 Worker URL

## 🔍 方法四：查看前端代码

在你的前端代码中，Worker URL 已经配置好了：

**查看 `auth.js` 文件**：
```javascript
this.apiBase = 'https://webnotes.1259233520.workers.dev';
```

这个 `apiBase` 就是你的 Worker URL。

**所以你的回调 URL 应该是**：
```
https://webnotes.1259233520.workers.dev/auth/callback
```

## 🔍 方法五：使用 Wrangler CLI

如果你有命令行访问权限：

```bash
# 列出所有 Workers
wrangler list

# 或查看特定 Worker 的信息
wrangler whoami
```

## 📍 Worker URL 在 Dashboard 中的位置

### 位置 1: Workers 列表页面

```
Workers & Pages
├── Overview
├── Workers
│   ├── webnotes                    ← Worker 名称
│   │   └── https://webnotes...     ← Worker URL（在这里）
│   └── ...
```

### 位置 2: Worker 详情页顶部

```
┌─────────────────────────────────────┐
│  webnotes                           │ ← Worker 名称
│  https://webnotes.1259233520...     │ ← Worker URL（可点击）
│  [Edit code] [Settings] [Logs]      │
└─────────────────────────────────────┘
```

### 位置 3: Worker 设置页面

1. 进入 Worker 详情页
2. 点击 **Settings** 标签
3. 在设置页面顶部或 **Triggers** 部分，会显示 Worker URL

## 🎯 快速查找步骤

1. **访问**: https://dash.cloudflare.com
2. **点击**: 左侧菜单的 **Workers & Pages**
3. **找到**: 你的 Worker 名称（`webnotes`）
4. **查看**: Worker 名称下方或旁边的 URL
5. **记录**: 完整的 URL（例如：`https://webnotes.1259233520.workers.dev`）

## 📝 根据你的代码

从你的 `auth.js` 文件中，我可以看到你的 Worker URL 是：

```
https://webnotes.1259233520.workers.dev
```

所以你的 **回调 URL** 应该是：

```
https://webnotes.1259233520.workers.dev/auth/callback
```

## ✅ 验证 Worker URL

确认你找到了正确的 Worker URL：

1. **在浏览器中访问 Worker URL**
   - 例如：`https://webnotes.1259233520.workers.dev`
   - 应该看到 "WebNotes API" 的响应

2. **测试 API 端点**
   - 访问：`https://webnotes.1259233520.workers.dev/auth/check`
   - 应该返回 JSON 响应（可能是 `{"authenticated":false}`）

3. **如果访问失败**
   - 检查 Worker 是否已部署
   - 检查 URL 是否正确
   - 查看 Worker 日志

## 🔗 相关位置

- **Worker 列表**: Dashboard > Workers & Pages > Workers
- **Worker 详情**: Dashboard > Workers & Pages > [Worker 名称]
- **Worker 设置**: Dashboard > Workers & Pages > [Worker 名称] > Settings

## 💡 提示

1. **Worker URL 格式**：
   - 通常是：`https://[worker-name].[subdomain].workers.dev`
   - 或：`https://[worker-name]-[account-id].workers.dev`

2. **自定义域名**：
   - 如果你配置了自定义域名，也可以使用自定义域名
   - 但通常使用默认的 `*.workers.dev` 域名

3. **多个环境**：
   - 生产环境：`https://webnotes.1259233520.workers.dev`
   - 预览环境：可能有不同的 URL（如果配置了）

## 🐛 如果找不到 Worker URL

### 检查清单：

- [ ] 确认已登录正确的 Cloudflare 账户
- [ ] 确认 Worker 已成功部署
- [ ] 尝试刷新 Dashboard 页面
- [ ] 检查是否在正确的账户/组织下
- [ ] 查看 Worker 的部署历史，确认部署成功

### 替代方法：

1. **查看部署日志**：在 Worker 的 **Deployments** 标签中，部署记录会显示 Worker URL
2. **查看浏览器历史**：如果你之前访问过 Worker，可以在浏览器历史中查找
3. **查看前端代码**：`auth.js` 和 `api.js` 中的 `apiBase` 就是 Worker URL

