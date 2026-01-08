# 修复 Worker 异常错误

## ❌ 错误信息

```
Error 1101: Worker threw exception
```

这个错误表示 Worker 在运行时抛出了异常。需要查看日志来诊断具体问题。

## 🔍 步骤 1: 查看 Worker 日志

### 方法一：在 Cloudflare Dashboard 中查看

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 点击你的 Worker 名称（`webnotes`）
4. 点击 **Logs** 标签
5. 查看错误日志，找到具体的错误信息

### 方法二：使用 Wrangler CLI 查看实时日志

```bash
# 查看实时日志
wrangler tail

# 或查看特定 Worker 的日志
wrangler tail webnotes
```

## 🔧 常见问题和解决方案

### 问题 1: KV 命名空间未配置

**错误信息可能包含**：
- `SESSIONS is not defined`
- `Cannot read property 'put' of undefined`
- `KV namespace binding not found`

**解决方案**：
1. 确认 KV 命名空间已创建
2. 检查 `wrangler.toml` 中的 KV 配置是否正确
3. 确认 KV 已绑定到 Worker

**检查步骤**：
```bash
# 查看 KV 命名空间列表
wrangler kv:namespace list

# 检查 wrangler.toml 配置
cat wrangler.toml
```

### 问题 2: 环境变量未设置

**错误信息可能包含**：
- `GITHUB_CLIENT_ID is not defined`
- `env.GITHUB_CLIENT_ID is undefined`

**解决方案**：
1. 在 Cloudflare Dashboard 中设置环境变量：
   - 进入 Worker > **Settings** > **Variables**
   - 添加 **Encrypted variables**：
     - `GITHUB_CLIENT_ID`
     - `GITHUB_CLIENT_SECRET`

2. 或使用 Wrangler CLI：
   ```bash
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   ```

### 问题 3: GitHub API 调用失败

**错误信息可能包含**：
- `Failed to get GitHub user`
- `GitHub API error`
- `401 Unauthorized`

**解决方案**：
1. 检查 GitHub OAuth 密钥是否正确
2. 确认 OAuth App 有正确的权限（`repo` scope）
3. 检查网络连接

### 问题 4: 代码语法错误

**错误信息可能包含**：
- `SyntaxError`
- `ReferenceError`
- `TypeError`

**解决方案**：
1. 检查代码是否有语法错误
2. 确保所有函数都正确定义
3. 检查是否有未关闭的括号或引号

## 🔍 诊断步骤

### 步骤 1: 检查 Worker 配置

确认以下配置正确：

- [ ] KV 命名空间已创建并绑定
- [ ] `GITHUB_CLIENT_ID` 已设置
- [ ] `GITHUB_CLIENT_SECRET` 已设置
- [ ] `wrangler.toml` 配置正确

### 步骤 2: 查看详细日志

在 Cloudflare Dashboard 中：

1. 进入 Worker > **Logs**
2. 查看最近的错误日志
3. 注意错误消息和堆栈跟踪
4. 查找具体的错误原因

### 步骤 3: 测试 Worker 端点

尝试访问不同的端点，看哪个出错：

```bash
# 测试根路径
curl https://webnotes.1259233520.workers.dev

# 测试认证检查
curl https://webnotes.1259233520.workers.dev/auth/check

# 测试 API
curl https://webnotes.1259233520.workers.dev/api/get-doc
```

### 步骤 4: 检查代码

检查 `src/index.js` 中可能的问题：

1. **KV 访问**：确保使用 `env.SESSIONS` 而不是直接访问
2. **环境变量**：确保使用 `env.GITHUB_CLIENT_ID` 等
3. **错误处理**：检查是否有未捕获的异常

## 🛠️ 快速修复检查清单

### 1. KV 配置检查

```toml
# wrangler.toml 应该包含：
[[kv_namespaces]]
binding = "SESSIONS"
id = "真实的KV命名空间ID"  # 不是 "your-kv-namespace-id"
```

### 2. 环境变量检查

在 Cloudflare Dashboard 中确认：
- `GITHUB_CLIENT_ID` 已设置为加密变量
- `GITHUB_CLIENT_SECRET` 已设置为加密变量

### 3. 代码检查

确保代码中：
- 使用 `env.SESSIONS` 访问 KV
- 使用 `env.GITHUB_CLIENT_ID` 访问环境变量
- 所有异步函数都有错误处理

## 🔧 常见修复方法

### 修复方法 1: 重新部署 Worker

如果配置已更新但错误仍然存在：

```bash
# 重新部署
wrangler deploy

# 或通过 Dashboard
# Workers & Pages > webnotes > Deployments > Redeploy
```

### 修复方法 2: 检查 Worker 代码

确保代码中没有硬编码的值，所有配置都从环境变量读取：

```javascript
// ✅ 正确
const clientId = env.GITHUB_CLIENT_ID;

// ❌ 错误
const clientId = 'hardcoded-value';
```

### 修复方法 3: 添加错误处理

在代码中添加更详细的错误处理：

```javascript
try {
  // 你的代码
} catch (error) {
  console.error('Error details:', error);
  return new Response(JSON.stringify({ 
    error: error.message,
    stack: error.stack 
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## 📋 诊断命令

### 使用 Wrangler CLI

```bash
# 查看 Worker 信息
wrangler whoami

# 查看 Worker 配置
wrangler deploy --dry-run

# 查看实时日志
wrangler tail

# 列出 KV 命名空间
wrangler kv:namespace list

# 查看环境变量（不会显示 secrets）
wrangler secret list
```

## 🐛 根据错误类型排查

### 如果是 KV 相关错误

1. 确认 KV 命名空间已创建
2. 检查 `wrangler.toml` 中的 KV ID 是否正确
3. 确认 KV 已绑定到 Worker

### 如果是环境变量错误

1. 在 Dashboard 中检查环境变量
2. 确认变量名拼写正确
3. 确认已设置为加密变量（对于敏感信息）

### 如果是 GitHub API 错误

1. 检查 OAuth 密钥是否正确
2. 确认 GitHub OAuth App 已正确配置
3. 检查网络连接和 API 限制

## 💡 调试技巧

### 1. 添加日志

在代码中添加 `console.log` 来调试：

```javascript
console.log('Environment:', {
  hasClientId: !!env.GITHUB_CLIENT_ID,
  hasSessions: !!env.SESSIONS
});
```

### 2. 查看实时日志

使用 `wrangler tail` 查看实时日志输出。

### 3. 测试最小化代码

创建一个简单的测试 Worker 来验证配置：

```javascript
export default {
  async fetch(request, env) {
    return new Response(JSON.stringify({
      hasSessions: !!env.SESSIONS,
      hasClientId: !!env.GITHUB_CLIENT_ID
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

## 📞 获取帮助

如果问题仍然存在：

1. **查看详细日志**：在 Dashboard 的 Logs 标签中查看完整错误信息
2. **检查 Cloudflare 状态**：访问 status.cloudflare.com
3. **查看文档**：https://developers.cloudflare.com/workers/learning/errors-and-exceptions/
4. **社区支持**：访问 Cloudflare Community 论坛

## ✅ 验证修复

修复后，验证 Worker 是否正常工作：

1. 访问 Worker URL：`https://webnotes.1259233520.workers.dev`
2. 应该看到 "WebNotes API" 响应
3. 测试 `/auth/check` 端点
4. 查看日志确认没有错误

