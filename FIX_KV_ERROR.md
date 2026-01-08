# 修复 KV 命名空间错误

## ❌ 错误信息

```
KV namespace 'your-kv-namespace-id' is not valid. [code: 10042]
```

这个错误表示 `wrangler.toml` 中的 KV 命名空间 ID 还是占位符，需要替换为真实的 ID。

## ✅ 解决步骤

### 方法一：通过 Cloudflare Dashboard 获取 KV ID（推荐）

#### 步骤 1: 创建 KV 命名空间

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单点击 **Workers & Pages**
3. 点击 **KV**（或 **Workers KV**）
4. 点击 **Create a namespace**
5. 输入名称：`SESSIONS`
6. 点击 **Add**

#### 步骤 2: 获取 KV 命名空间 ID

创建后，在 KV 列表中找到 `SESSIONS`：

1. 点击 `SESSIONS` 命名空间
2. 在详情页面，你会看到 **Namespace ID**
3. **复制这个 ID**（是一串长字符串，例如：`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`）

#### 步骤 3: 创建预览环境 KV（可选）

1. 再次点击 **Create a namespace**
2. 输入名称：`SESSIONS-preview`
3. 创建后，同样复制 **Namespace ID**

#### 步骤 4: 更新 wrangler.toml

编辑 `wrangler.toml` 文件，将占位符替换为真实的 ID：

```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "你的真实KV命名空间ID"           # 替换这里
preview_id = "你的预览环境KV命名空间ID"  # 替换这里（可选）
```

**示例**：
```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
preview_id = "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7"
```

### 方法二：使用 Wrangler CLI 创建并自动配置

如果你使用命令行，可以这样创建：

```bash
# 创建生产环境 KV
wrangler kv:namespace create "SESSIONS"
```

执行后会返回：
```
🌀  Creating namespace with title "webnotes-SESSIONS"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "SESSIONS", id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" }
```

然后创建预览环境：
```bash
wrangler kv:namespace create "SESSIONS" --preview
```

同样会返回预览环境的 ID。

## 📝 更新 wrangler.toml 文件

找到项目中的 `wrangler.toml` 文件，更新 KV 配置部分：

**当前（错误）**：
```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "your-kv-namespace-id"              # ❌ 占位符
preview_id = "your-preview-kv-namespace-id" # ❌ 占位符
```

**更新后（正确）**：
```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"    # ✅ 真实 ID
preview_id = "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7" # ✅ 真实 ID（可选）
```

## 🔍 如何找到 KV 命名空间 ID

### 在 Cloudflare Dashboard 中：

1. **Workers & Pages** > **KV**
2. 点击你的 KV 命名空间名称
3. 在详情页面查看 **Namespace ID**
4. 或者，在 KV 列表中，ID 可能直接显示在名称旁边

### 使用 Wrangler CLI：

```bash
# 列出所有 KV 命名空间
wrangler kv:namespace list
```

这会显示所有 KV 命名空间及其 ID。

## ⚠️ 注意事项

1. **ID 格式**：KV 命名空间 ID 通常是 32 位十六进制字符串
2. **区分生产和预览**：生产环境和预览环境需要不同的 KV 命名空间
3. **绑定名称**：`binding = "SESSIONS"` 必须与代码中的 `env.SESSIONS` 一致
4. **保存文件**：更新 `wrangler.toml` 后，确保保存文件

## ✅ 验证修复

更新 `wrangler.toml` 后：

1. 提交更改到 Git：
   ```bash
   git add wrangler.toml
   git commit -m "Fix KV namespace ID"
   git push
   ```

2. 重新部署 Worker，错误应该消失

3. 如果使用自动部署，推送后会自动重新部署

## 🐛 如果仍然出错

### 检查清单：

- [ ] KV 命名空间已创建
- [ ] ID 已正确复制（没有多余空格）
- [ ] `wrangler.toml` 文件已保存
- [ ] 代码已推送到 Git（如果使用自动部署）
- [ ] 重新部署了 Worker

### 常见问题：

**Q: 找不到 KV 命名空间 ID**
- A: 确保在正确的 Cloudflare 账户下查看
- A: 尝试刷新 Dashboard 页面

**Q: ID 格式不对**
- A: KV ID 应该是 32 位十六进制字符串
- A: 确保没有复制多余的空格或换行

**Q: 预览环境 ID 是必须的吗？**
- A: 不是必须的，如果不需要本地开发，可以删除 `preview_id` 行

## 📋 完整示例

一个正确配置的 `wrangler.toml` 应该类似这样：

```toml
name = "webnotes"
main = "src/index.js"
compatibility_date = "2026-01-08"

[[kv_namespaces]]
binding = "SESSIONS"
id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
preview_id = "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7"
```

