# 如何找到和创建 KV 命名空间

如果在 Cloudflare Dashboard 中找不到 KV 选项，这里有多种方法可以创建和获取 KV 命名空间 ID。

## 🔍 方法一：通过 Worker 设置创建 KV

### 步骤 1: 进入 Worker 设置

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单点击 **Workers & Pages**
3. 点击你的 Worker 名称（例如：`webnotes`）
4. 点击 **Settings**（设置）标签

### 步骤 2: 在 Variables 部分创建 KV 绑定

1. 在 Settings 页面，向下滚动找到 **Variables**（变量）部分
2. 找到 **KV Namespace Bindings**（KV 命名空间绑定）
3. 点击 **Add binding** 或 **Create namespace** 按钮
4. 如果看到 **Create a new namespace** 选项，点击它
5. 输入名称：`SESSIONS`
6. 点击 **Add** 或 **Create**

### 步骤 3: 获取 KV ID

创建后：
- 在绑定列表中，你会看到新创建的 KV 命名空间
- **Variable name** 应该是 `SESSIONS`
- 旁边会显示 **Namespace ID**，复制这个 ID

## 🔍 方法二：使用搜索功能

1. 在 Cloudflare Dashboard 顶部，有一个搜索框
2. 输入 "KV" 或 "Workers KV"
3. 从搜索结果中选择相关选项

## 🔍 方法三：直接访问 KV 页面

尝试直接访问以下 URL：

```
https://dash.cloudflare.com/[你的账户ID]/workers/kv/namespaces
```

或者：

```
https://dash.cloudflare.com/[你的账户ID]/workers/kv
```

## 🔍 方法四：通过左侧菜单查找

在不同版本的 Dashboard 中，KV 可能位于：

1. **Workers & Pages** > **KV**
2. **Workers** > **KV**
3. **Storage** > **Workers KV**
4. **R2 & Workers KV** > **KV**

尝试点击左侧菜单的各个选项，查找包含 "KV" 或 "Storage" 的选项。

## 🔍 方法五：使用 Wrangler CLI（最简单）

如果你有命令行访问权限，这是最简单的方法：

### 步骤 1: 安装并登录 Wrangler

```bash
npm install -g wrangler
wrangler login
```

### 步骤 2: 创建 KV 命名空间

```bash
# 创建生产环境 KV
wrangler kv:namespace create "SESSIONS"
```

执行后会显示：
```
🌀  Creating namespace with title "webnotes-SESSIONS"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "SESSIONS", id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" }
```

**复制这个 ID**！

### 步骤 3: 创建预览环境 KV（可选）

```bash
wrangler kv:namespace create "SESSIONS" --preview
```

同样会返回预览环境的 ID。

### 步骤 4: 更新 wrangler.toml

将获取的 ID 更新到 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"  # 替换为你的真实 ID
preview_id = "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7"  # 替换为预览环境 ID（可选）
```

## 🔍 方法六：在 Worker 编辑器中创建

某些版本的 Dashboard 允许在 Worker 代码编辑器中创建：

1. 进入 Worker 页面
2. 点击 **Edit code** 或 **Quick edit**
3. 在编辑器右侧或底部，查找 **Add binding** 或 **Bindings** 选项
4. 选择 **KV Namespace** > **Create new namespace**
5. 输入名称并创建

## 🔍 方法七：查看现有 KV 命名空间

如果你之前创建过 KV，可以这样查找：

### 使用 Wrangler CLI：

```bash
# 列出所有 KV 命名空间
wrangler kv:namespace list
```

这会显示所有 KV 命名空间及其 ID。

### 在 Dashboard 中：

1. 进入 **Workers & Pages**
2. 查看是否有 **Storage** 或 **Resources** 标签
3. 或者在 Worker 的 **Settings** > **Variables** 中查看已绑定的 KV

## 📸 界面位置参考

在不同版本的 Cloudflare Dashboard 中，KV 可能出现在：

### 新版界面：
```
左侧菜单
├── Workers & Pages
│   ├── Overview
│   ├── Workers
│   ├── Pages
│   └── KV  ← 可能在这里
```

### 旧版界面：
```
左侧菜单
├── Workers
│   └── KV  ← 可能在这里
├── Storage
│   └── Workers KV  ← 或者在这里
```

## ⚠️ 如果所有方法都找不到

### 检查账户权限

1. 确认你使用的是正确的 Cloudflare 账户
2. 确认账户有 Workers 权限
3. 免费账户也应该可以使用 KV

### 尝试不同的浏览器

1. 清除浏览器缓存
2. 尝试使用 Chrome、Firefox 或 Safari
3. 使用无痕模式访问

### 联系支持

如果仍然找不到，可以：
1. 使用 Wrangler CLI（方法五，最简单）
2. 访问 Cloudflare 社区论坛
3. 查看 [Cloudflare 文档](https://developers.cloudflare.com/workers/learning/how-kv-works/)

## ✅ 推荐方案

**最简单的方法**：使用 Wrangler CLI（方法五）

只需要：
1. 安装 Wrangler：`npm install -g wrangler`
2. 登录：`wrangler login`
3. 创建 KV：`wrangler kv:namespace create "SESSIONS"`
4. 复制返回的 ID
5. 更新 `wrangler.toml`

## 🎯 快速操作

如果你有命令行访问权限，直接运行：

```bash
# 1. 安装 Wrangler（如果还没安装）
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 创建生产环境 KV
wrangler kv:namespace create "SESSIONS"

# 4. 创建预览环境 KV（可选）
wrangler kv:namespace create "SESSIONS" --preview

# 5. 查看所有 KV（验证）
wrangler kv:namespace list
```

然后复制返回的 ID 到 `wrangler.toml` 文件中。

