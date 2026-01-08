# 在 Web 端查看 Worker 日志和修复错误

## 🔍 步骤 1: 查看 Worker 日志

### 方法一：在 Worker 详情页查看日志

1. **访问 Cloudflare Dashboard**
   - 打开浏览器，访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - 使用你的账号登录

2. **进入 Workers & Pages**
   - 在左侧菜单中，点击 **Workers & Pages**
   - 你会看到所有已创建的 Workers 列表

3. **选择你的 Worker**
   - 在列表中，找到并点击你的 Worker 名称（`webnotes`）
   - 进入 Worker 详情页

4. **查看日志**
   - 在 Worker 详情页顶部，你会看到几个标签：
     - **Overview**（概览）
     - **Deployments**（部署历史）
     - **Logs**（日志）← **点击这里**
     - **Settings**（设置）
   - 点击 **Logs** 标签

5. **查看错误信息**
   - 在日志页面，你会看到实时的日志流
   - 查找红色的错误消息
   - 点击错误消息可以查看详细信息

### 方法二：在概览页查看最近错误

1. 在 Worker 详情页，点击 **Overview** 标签
2. 在页面中查找 **Recent errors**（最近错误）部分
3. 点击错误可以查看详细信息

## 🔧 步骤 2: 根据日志诊断问题

### 常见错误类型和位置

#### 错误 1: KV 命名空间未找到

**日志中可能显示**：
- `SESSIONS is not defined`
- `Cannot read property 'put' of undefined`
- `KV namespace binding not found`

**在 Web 端修复**：

1. **检查 KV 绑定**：
   - 在 Worker 详情页，点击 **Settings** 标签
   - 向下滚动找到 **Variables**（变量）部分
   - 查找 **KV Namespace Bindings**（KV 命名空间绑定）
   - 确认是否有 `SESSIONS` 绑定

2. **如果没有绑定，添加 KV 绑定**：
   - 点击 **Add binding** 或 **Create namespace**
   - 如果看到 **Create a new namespace**，点击它
   - 输入名称：`SESSIONS`
   - 点击 **Add** 创建
   - 创建后，确保绑定名称是 `SESSIONS`

3. **如果已有 KV，检查配置**：
   - 确认绑定名称是 `SESSIONS`（必须与代码中的一致）
   - 如果名称不对，删除后重新创建

#### 错误 2: 环境变量未设置

**日志中可能显示**：
- `GITHUB_CLIENT_ID is not defined`
- `env.GITHUB_CLIENT_ID is undefined`

**在 Web 端修复**：

1. **进入 Worker 设置**：
   - 在 Worker 详情页，点击 **Settings** 标签
   - 向下滚动找到 **Variables**（变量）部分

2. **添加加密变量**：
   - 找到 **Encrypted variables**（加密变量）或 **Secrets** 部分
   - 点击 **Add variable** 或 **Add secret**

3. **添加 GITHUB_CLIENT_ID**：
   - **Variable name**: 输入 `GITHUB_CLIENT_ID`
   - **Value**: 输入你的 GitHub OAuth App Client ID
   - 确保勾选 **Encrypt**（加密）选项
   - 点击 **Save**

4. **添加 GITHUB_CLIENT_SECRET**：
   - 再次点击 **Add variable**
   - **Variable name**: 输入 `GITHUB_CLIENT_SECRET`
   - **Value**: 输入你的 GitHub OAuth App Client Secret
   - 确保勾选 **Encrypt**（加密）选项
   - 点击 **Save**

#### 错误 3: GitHub API 调用失败

**日志中可能显示**：
- `Failed to get GitHub user`
- `GitHub API error: 401 Unauthorized`

**在 Web 端修复**：

1. **检查环境变量**：
   - 在 **Settings** > **Variables** 中
   - 确认 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET` 已正确设置

2. **验证 GitHub OAuth App**：
   - 访问 [GitHub Developer Settings](https://github.com/settings/developers)
   - 检查 OAuth App 的配置
   - 确认 Client ID 和 Client Secret 正确

## 🔄 步骤 3: 重新部署 Worker

修复配置后，需要重新部署 Worker：

### 方法一：通过 Dashboard 重新部署

1. **进入部署历史**：
   - 在 Worker 详情页，点击 **Deployments** 标签
   - 你会看到所有部署记录

2. **重新部署**：
   - 找到最新的部署记录
   - 点击部署记录右侧的 **...**（三个点）菜单
   - 选择 **Redeploy**（重新部署）
   - 或点击页面上的 **Redeploy** 按钮

### 方法二：通过代码编辑器重新部署

1. **编辑代码**：
   - 在 Worker 详情页，点击 **Edit code** 或 **Quick edit** 按钮
   - 代码编辑器会打开

2. **保存并部署**：
   - 即使不修改代码，也可以点击 **Save and deploy**
   - 这会触发新的部署，应用最新的配置更改

## 📋 完整检查清单

在 Web 端按以下步骤检查：

### 1. 检查 KV 命名空间绑定

- [ ] 进入 Worker > **Settings** > **Variables**
- [ ] 找到 **KV Namespace Bindings**
- [ ] 确认有 `SESSIONS` 绑定
- [ ] 如果没有，点击 **Add binding** 创建

### 2. 检查环境变量

- [ ] 在 **Settings** > **Variables** 中
- [ ] 找到 **Encrypted variables** 或 **Secrets**
- [ ] 确认 `GITHUB_CLIENT_ID` 已设置
- [ ] 确认 `GITHUB_CLIENT_SECRET` 已设置
- [ ] 如果没有，点击 **Add variable** 添加

### 3. 查看日志

- [ ] 进入 Worker > **Logs** 标签
- [ ] 查看最近的错误消息
- [ ] 记录错误的具体内容

### 4. 重新部署

- [ ] 修复配置后，进入 **Deployments** 标签
- [ ] 点击 **Redeploy** 重新部署
- [ ] 等待部署完成

### 5. 验证修复

- [ ] 访问 Worker URL：`https://webnotes.1259233520.workers.dev`
- [ ] 应该看到 "WebNotes API" 响应
- [ ] 查看 **Logs** 确认没有新错误

## 🎯 快速操作流程

### 如果看到 "Worker threw exception" 错误：

1. **查看日志**：
   ```
   Dashboard > Workers & Pages > webnotes > Logs
   ```

2. **检查配置**：
   ```
   Dashboard > Workers & Pages > webnotes > Settings > Variables
   ```

3. **修复问题**：
   - 如果缺少 KV 绑定 → 添加 KV 绑定
   - 如果缺少环境变量 → 添加环境变量

4. **重新部署**：
   ```
   Dashboard > Workers & Pages > webnotes > Deployments > Redeploy
   ```

5. **验证**：
   - 访问 Worker URL
   - 查看日志确认没有错误

## 📸 界面导航

### Worker 详情页结构：

```
┌─────────────────────────────────────┐
│  webnotes                            │ ← Worker 名称
│  https://webnotes.1259233520...      │ ← Worker URL
├─────────────────────────────────────┤
│  [Overview] [Deployments] [Logs]     │ ← 标签页
│              [Settings] [Edit code]  │
├─────────────────────────────────────┤
│                                     │
│  日志内容或设置选项...                │
│                                     │
└─────────────────────────────────────┘
```

### Settings 页面结构：

```
Settings
├── Variables（变量）
│   ├── Environment Variables（环境变量）
│   ├── Encrypted Variables（加密变量/Secrets）
│   └── KV Namespace Bindings（KV 绑定）
├── Triggers（触发器）
└── Resources（资源）
```

## 💡 提示

1. **日志实时更新**：Logs 标签会显示实时日志，可以实时查看错误
2. **过滤日志**：在日志页面可以使用过滤器查看特定级别的日志（Error, Warning, Info）
3. **搜索日志**：可以使用搜索功能查找特定的错误消息
4. **保存日志**：某些情况下可以导出日志进行分析

## 🐛 如果仍然无法解决

1. **查看详细错误**：
   - 在 Logs 标签中，点击错误消息查看完整堆栈跟踪
   - 记录完整的错误信息

2. **检查 Worker 状态**：
   - 在 Overview 标签中查看 Worker 的健康状态
   - 检查是否有其他警告或错误

3. **验证配置**：
   - 在 Settings 中逐一检查所有配置项
   - 确认没有遗漏的配置

4. **联系支持**：
   - 如果问题持续，可以访问 Cloudflare Community 论坛
   - 或查看 Cloudflare 文档获取更多帮助

