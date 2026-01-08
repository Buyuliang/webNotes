# 修复重定向状态码错误

## ❌ 错误信息

```
0 is not a redirect status code. It must be one of: 301, 302, 303, 307, or 308.
```

这个错误发生在 OAuth 回调处理中，当使用 `Response.redirect()` 并传递 headers 时，需要明确指定重定向状态码。

## ✅ 已修复

### 问题代码

```javascript
// ❌ 错误：没有指定状态码
return Response.redirect(redirectUrl, {
  headers: {
    'Set-Cookie': `session=${sessionId}; ...`,
  },
});
```

### 修复后的代码

```javascript
// ✅ 正确：使用 Response 构造函数并指定状态码
return new Response(null, {
  status: 302,
  headers: {
    'Location': redirectUrl,
    'Set-Cookie': `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${86400 * 7}`,
  },
});
```

## 🔄 重新部署 Worker

修复代码后，需要重新部署 Worker：

### 方法一：通过 Web UI 部署

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** > 你的 Worker（`webnotes`）
3. 点击 **Edit code** 或 **Quick edit**
4. 粘贴修复后的代码
5. 点击 **Save and deploy**

### 方法二：通过 Git 部署

如果使用 Git 集成：

1. 提交更改：
   ```bash
   git add src/index.js
   git commit -m "Fix redirect status code error"
   git push
   ```

2. Cloudflare 会自动重新部署

## 📋 修复说明

### 为什么会出现这个错误？

在 Cloudflare Workers 中：
- `Response.redirect(url)` - 简单重定向，默认使用 302 状态码
- `Response.redirect(url, init)` - 当传递第二个参数时，需要明确指定状态码

但是，当需要同时设置 cookie 和其他 headers 时，使用 `new Response()` 构造函数更可靠。

### 修复方案

使用 `new Response()` 构造函数：
- `status: 302` - 明确指定重定向状态码
- `Location` header - 指定重定向目标
- `Set-Cookie` header - 设置会话 cookie

## ✅ 验证修复

修复并重新部署后：

1. **测试 OAuth 登录流程**：
   - 访问前端网站
   - 点击 "使用 GitHub 登录"
   - 完成 GitHub 授权
   - 应该能成功回调并登录

2. **检查日志**：
   - 在 Worker 的 **Logs** 标签中
   - 确认没有重定向相关的错误

3. **验证会话**：
   - 登录后，应该能看到用户信息
   - 可以正常使用编辑和保存功能

## 🐛 如果仍然出错

### 检查清单：

- [ ] 代码已更新并保存
- [ ] Worker 已重新部署
- [ ] 清除浏览器缓存和 cookies
- [ ] 查看日志确认没有其他错误

### 其他可能的问题：

1. **Cookie 设置问题**：
   - 确保 `Secure` 标志只在 HTTPS 下使用
   - 检查 `SameSite` 设置是否正确

2. **前端重定向问题**：
   - 确认前端代码正确处理回调
   - 检查 `auth.js` 中的 session 处理

3. **CORS 问题**：
   - 确认 CORS 头设置正确
   - 检查前端和 Worker 的域名配置

## 💡 相关代码位置

修复的代码在 `src/index.js` 的第 122-128 行（OAuth 回调处理部分）。

## 🔗 参考

- [Cloudflare Workers Response API](https://developers.cloudflare.com/workers/runtime-apis/response/)
- [HTTP 重定向状态码](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages)

