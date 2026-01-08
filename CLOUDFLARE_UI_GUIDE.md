# Cloudflare Worker Web UI 使用指南

本指南将教你如何通过 Cloudflare Dashboard（网页界面）来创建、部署和管理 Cloudflare Worker。

## 📋 前置准备

1. **Cloudflare 账号** - 如果没有，访问 [cloudflare.com](https://www.cloudflare.com) 免费注册
2. **GitHub 账号** - 用于存储代码（可选，也可以直接上传文件）

## 🚀 通过 Web UI 部署 Worker

### 步骤 1: 登录 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 使用你的账号登录

### 步骤 2: 进入 Workers & Pages

1. 登录后，在左侧菜单找到 **Workers & Pages**
2. 点击进入

### 步骤 3: 创建 Worker

#### 方式 A: 从零开始创建（适合首次使用）

1. 点击右上角的 **Create application** 或 **Create** 按钮
2. 选择 **Create Worker**
3. 你会看到一个代码编辑器界面

#### 方式 B: 从 GitHub 导入（推荐，适合已有代码）

1. 点击 **Create application**
2. 选择 **Create Worker**
3. 选择 **Deploy with Git**（如果可用）
4. 连接你的 GitHub 账号
5. 选择包含 Worker 代码的仓库

### 步骤 4: 配置 Worker

#### 4.1 设置 Worker 名称

在创建页面或设置页面：
- **Worker name**: 输入 `webnotes`（或你喜欢的名称）
- 这会生成 Worker URL：`https://webnotes.your-subdomain.workers.dev`

#### 4.2 上传代码

> 📖 **详细说明**: 如果不确定代码编辑器在哪里，查看 [CODE_EDITOR_GUIDE.md](./CODE_EDITOR_GUIDE.md)

**如果是从零开始**：

1. **找到代码编辑器**：
   - 创建 Worker 后，页面中央会显示一个代码编辑器
   - 编辑器默认显示一些示例代码（类似 "Hello World"）
   - 编辑器通常占据页面的大部分区域，有语法高亮

2. **准备代码**：
   - 打开你本地的 `src/index.js` 文件
   - 全选并复制所有内容（Ctrl+A / Cmd+A，然后 Ctrl+C / Cmd+C）
   - 或者直接打开项目中的 `/Users/apple/Desktop/myproject/webNotes/src/index.js` 文件

3. **粘贴代码**：
   - 在 Cloudflare 的代码编辑器中，全选默认代码（Ctrl+A / Cmd+A）
   - 删除默认代码（Delete 或 Backspace）
   - 粘贴你复制的代码（Ctrl+V / Cmd+V）
   - 代码应该完整显示在编辑器中

4. **保存并部署**：
   - 点击编辑器右上角或页面底部的 **Save and deploy** 按钮
   - 或者点击 **Deploy** 按钮
   - 等待几秒钟，部署完成后会显示成功消息

**如果是从 GitHub 导入**：
1. 选择包含代码的分支
2. 设置入口文件路径：`src/index.js`
3. 点击 **Deploy**

### 步骤 5: 创建 KV 命名空间

Worker 需要 KV 来存储会话数据。

#### 5.1 创建 KV 命名空间

1. 在 Dashboard 左侧菜单，找到 **Workers & Pages**
2. 点击 **KV**（或 **Workers KV**）
3. 点击 **Create a namespace**
4. 输入名称：`SESSIONS`
5. 点击 **Add**

#### 5.2 绑定 KV 到 Worker

1. 回到 **Workers & Pages** > 点击你的 Worker 名称（`webnotes`）
2. 点击 **Settings**（设置）标签
3. 向下滚动找到 **Variables**（变量）部分
4. 找到 **KV Namespace Bindings**（KV 命名空间绑定）
5. 点击 **Add binding**
6. 配置：
   - **Variable name**: `SESSIONS`（必须与代码中的 binding 名称一致）
   - **KV namespace**: 选择刚才创建的 `SESSIONS`
7. 点击 **Save**

#### 5.3 创建预览环境 KV（可选，用于本地开发）

1. 在 KV 页面，再次点击 **Create a namespace**
2. 输入名称：`SESSIONS-preview`
3. 创建后，在 Worker 设置中添加预览绑定：
   - 在 **KV Namespace Bindings** 中
   - 选择 **Preview** 标签
   - 添加绑定，选择 `SESSIONS-preview`

### 步骤 6: 配置环境变量（Secrets）

#### 6.1 设置 GitHub OAuth 密钥

这些是敏感信息，需要作为 Secrets 存储：

1. 在 Worker 页面，点击 **Settings** 标签
2. 向下滚动找到 **Variables** 部分
3. 找到 **Encrypted variables**（加密变量）或 **Secrets**
4. 点击 **Add variable** 或 **Add secret**

**添加 GITHUB_CLIENT_ID**:
- **Variable name**: `GITHUB_CLIENT_ID`
- **Value**: 输入你的 GitHub OAuth App Client ID
- 勾选 **Encrypt**（加密）
- 点击 **Save**

**添加 GITHUB_CLIENT_SECRET**:
- **Variable name**: `GITHUB_CLIENT_SECRET`
- **Value**: 输入你的 GitHub OAuth App Client Secret
- 勾选 **Encrypt**（加密）
- 点击 **Save**

#### 6.2 设置可选环境变量

如果需要自定义仓库名：

1. 在 **Variables** 部分，找到 **Environment Variables**
2. 点击 **Add variable**
3. 添加：
   - **Variable name**: `GITHUB_REPO`
   - **Value**: `webNotes`（或你的仓库名）
4. 点击 **Save**

### 步骤 7: 部署 Worker

#### 如果使用代码编辑器：

1. 确保代码已保存
2. 点击右上角的 **Save and deploy** 或 **Deploy** 按钮
3. 等待部署完成（通常几秒钟）

#### 如果使用 GitHub 集成：

1. 每次推送到 GitHub 仓库
2. Worker 会自动重新部署
3. 可以在 **Deployments** 标签查看部署历史

### 步骤 8: 获取 Worker URL

部署成功后：

1. 在 Worker 页面顶部，你会看到 Worker URL
2. 格式通常是：`https://webnotes.your-subdomain.workers.dev`
3. **记录下这个 URL**，用于更新前端配置

### 步骤 9: 测试 Worker

1. 在浏览器中访问 Worker URL
2. 应该看到 "WebNotes API" 的响应
3. 测试 API 端点：
   - `https://your-worker.workers.dev/auth/check` - 应该返回 JSON

## 🔧 在 Web UI 中管理 Worker

### 查看 Worker 日志

1. 在 Worker 页面，点击 **Logs** 标签
2. 可以查看实时日志和错误信息
3. 可以筛选日志级别（Info, Error, Debug）

### 查看部署历史

1. 点击 **Deployments** 标签
2. 查看所有部署记录
3. 可以回滚到之前的版本：
   - 点击某个部署记录
   - 选择 **Rollback to this deployment**

### 编辑代码

1. 点击 **Edit code** 或 **Quick edit** 按钮
2. 在代码编辑器中修改代码
3. 点击 **Save and deploy** 部署更改

### 查看 Worker 统计

1. 在 Worker 页面，查看 **Overview** 标签
2. 可以看到：
   - 请求数量
   - 错误率
   - CPU 时间
   - 响应时间

### 配置自定义域名

1. 在 Worker 设置中，找到 **Triggers**（触发器）
2. 点击 **Custom Domains**
3. 添加你的域名
4. 按照提示配置 DNS 记录

### 设置环境变量（不同环境）

1. 在 **Settings** > **Variables** 中
2. 可以为不同环境设置不同的变量：
   - **Production**（生产环境）
   - **Preview**（预览环境）

## 📝 完整配置检查清单

- [ ] Worker 已创建并部署
- [ ] KV 命名空间 `SESSIONS` 已创建
- [ ] KV 已绑定到 Worker（变量名：`SESSIONS`）
- [ ] `GITHUB_CLIENT_ID` 已设置为加密变量
- [ ] `GITHUB_CLIENT_SECRET` 已设置为加密变量
- [ ] `GITHUB_REPO` 已设置（可选，默认：webNotes）
- [ ] Worker URL 已记录
- [ ] Worker 可以正常访问
- [ ] 日志中没有错误信息

## 🐛 常见问题

### 问题 1: 找不到 KV 绑定选项

**解决方案**:
- 确保已创建 KV 命名空间
- 在 Worker 的 **Settings** > **Variables** 中查找
- 某些界面可能需要先保存 Worker 代码

### 问题 2: 无法添加 Secrets

**解决方案**:
- 确保在 **Encrypted variables** 或 **Secrets** 部分添加
- 变量名必须与代码中使用的名称完全一致
- 检查是否有权限设置 Secrets

### 问题 3: Worker 部署失败

**解决方案**:
- 查看 **Logs** 标签中的错误信息
- 检查代码语法是否正确
- 确认所有必需的变量都已设置
- 检查 KV 绑定是否正确

### 问题 4: 代码编辑器无法保存

**解决方案**:
- 确保已登录 Cloudflare 账号
- 刷新页面重试
- 检查浏览器控制台是否有错误
- 尝试使用 GitHub 集成方式

### 问题 5: Worker URL 无法访问

**解决方案**:
- 确认 Worker 已成功部署（查看 Deployments）
- 检查 Worker 是否被暂停
- 查看日志中是否有错误
- 尝试重新部署

## 💡 最佳实践

### 1. 使用 GitHub 集成

- 将代码存储在 GitHub 仓库
- 在 Cloudflare 中连接 GitHub
- 每次 Git push 自动部署
- 更好的版本控制和协作

### 2. 使用环境变量

- 敏感信息使用 **Encrypted variables**（加密变量）
- 普通配置使用 **Environment Variables**
- 为不同环境设置不同的值

### 3. 监控和日志

- 定期查看 Worker 日志
- 设置错误告警（如果可用）
- 监控请求量和性能指标

### 4. 版本管理

- 重要更改前先测试
- 使用预览环境测试
- 保留部署历史以便回滚

## 🔗 相关资源

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Workers 文档](https://developers.cloudflare.com/workers/)
- [Workers KV 文档](https://developers.cloudflare.com/workers/learning/how-kv-works/)
- [Workers 编辑器](https://developers.cloudflare.com/workers/learning/using-the-dashboard/)

## 📸 界面导航提示

### 主要菜单位置

1. **左侧菜单**:
   - Workers & Pages - 进入 Worker 管理
   - KV - 管理 KV 命名空间

2. **Worker 页面标签**:
   - Overview - 概览和统计
   - Deployments - 部署历史
   - Logs - 日志查看
   - Settings - 设置和配置
   - Edit code - 代码编辑器

3. **设置页面**:
   - Variables - 环境变量和 KV 绑定
   - Triggers - 触发器和域名
   - Resources - 资源绑定

## 🎯 快速参考

### 创建 Worker 的完整流程

1. Dashboard → Workers & Pages → Create Worker
2. 输入名称 → 上传代码 → Save and deploy
3. Settings → Variables → 添加 KV 绑定
4. Settings → Variables → 添加 Secrets
5. 记录 Worker URL
6. 测试访问

### 更新 Worker 代码

1. Workers & Pages → 选择 Worker
2. Edit code → 修改代码
3. Save and deploy

### 查看日志

1. Workers & Pages → 选择 Worker
2. Logs 标签
3. 查看实时日志或筛选错误

