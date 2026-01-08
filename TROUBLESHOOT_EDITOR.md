# 编辑器不显示问题排查

## 🔍 问题：登录后看不到编辑器

如果登录后看不到编辑界面，请按以下步骤排查：

## ✅ 检查清单

### 1. 确认已登录

- [ ] 页面右上角显示用户名（例如：👤 your-username）
- [ ] 显示"退出"按钮而不是"登录"按钮
- [ ] 显示"保存"按钮

### 2. 检查浏览器控制台

1. 按 `F12` 打开开发者工具
2. 点击 **Console**（控制台）标签
3. 查看是否有错误信息

**常见错误**：
- `Cannot read property 'loadContent' of undefined` - 编辑器未初始化
- `Failed to fetch` - API 连接失败
- `401 Unauthorized` - 认证失败

### 3. 检查网络请求

1. 在开发者工具中，点击 **Network**（网络）标签
2. 刷新页面
3. 查找 `/auth/check` 请求
4. 查看响应：
   - 应该返回 `{"authenticated": true, "user": {...}}`
   - 如果返回 `{"authenticated": false}`，说明未登录

### 4. 检查元素显示

1. 在开发者工具中，点击 **Elements**（元素）标签
2. 查找 `id="editorScreen"` 的元素
3. 检查样式：
   - `display` 应该是 `flex` 而不是 `none`
   - 如果显示 `display: none`，说明编辑器被隐藏了

## 🔧 解决方案

### 方案 1: 清除缓存和 Cookies

1. 按 `Ctrl+Shift+Delete` (Windows) 或 `Cmd+Shift+Delete` (Mac)
2. 选择清除 Cookies 和缓存
3. 重新访问网站并登录

### 方案 2: 检查认证状态

在浏览器控制台中运行：

```javascript
// 检查认证状态
fetch('https://webnotes.1259233520.workers.dev/auth/check', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('Auth status:', data));
```

如果返回 `{"authenticated": false}`，需要重新登录。

### 方案 3: 手动触发编辑器显示

在浏览器控制台中运行：

```javascript
// 手动显示编辑器
document.getElementById('loginScreen').style.display = 'none';
document.getElementById('editorScreen').style.display = 'flex';
document.getElementById('saveBtn').style.display = 'inline-block';
document.getElementById('logoutBtn').style.display = 'inline-block';
```

### 方案 4: 检查 Worker 连接

在浏览器控制台中运行：

```javascript
// 测试 Worker 连接
fetch('https://webnotes.1259233520.workers.dev/')
.then(r => r.text())
.then(text => console.log('Worker response:', text));
```

应该返回 "WebNotes API"。

## 🐛 常见问题

### 问题 1: 登录后仍然显示登录界面

**原因**：认证检查失败

**解决**：
1. 检查 Worker 是否正确部署
2. 检查 KV 命名空间是否配置
3. 检查环境变量是否设置
4. 查看 Worker 日志

### 问题 2: 编辑器区域是空白的

**原因**：编辑器内容未加载

**解决**：
1. 检查浏览器控制台错误
2. 检查 `/api/get-doc` 请求是否成功
3. 手动触发加载：
   ```javascript
   window.editorManager.loadContent();
   ```

### 问题 3: 无法输入文字

**原因**：编辑器未获得焦点或 contenteditable 属性问题

**解决**：
1. 点击编辑器区域
2. 检查编辑器元素：
   ```javascript
   const editor = document.getElementById('editor');
   console.log('Contenteditable:', editor.contentEditable);
   console.log('Display:', window.getComputedStyle(editor).display);
   ```

### 问题 4: 工具栏按钮不工作

**原因**：JavaScript 函数未定义

**解决**：
1. 检查 `editor.js` 是否正确加载
2. 在控制台检查：
   ```javascript
   console.log('formatText:', typeof formatText);
   console.log('editorManager:', window.editorManager);
   ```

## 📋 调试步骤

### 完整调试流程：

1. **打开开发者工具** (`F12`)

2. **检查认证**：
   ```javascript
   fetch('https://webnotes.1259233520.workers.dev/auth/check', {
     credentials: 'include'
   }).then(r => r.json()).then(console.log);
   ```

3. **检查编辑器元素**：
   ```javascript
   const editor = document.getElementById('editor');
   const editorScreen = document.getElementById('editorScreen');
   console.log('Editor exists:', !!editor);
   console.log('Editor screen display:', window.getComputedStyle(editorScreen).display);
   ```

4. **检查编辑器管理器**：
   ```javascript
   console.log('EditorManager:', window.editorManager);
   if (window.editorManager) {
     window.editorManager.loadContent();
   }
   ```

5. **手动显示编辑器**（如果隐藏）：
   ```javascript
   document.getElementById('loginScreen').style.display = 'none';
   document.getElementById('editorScreen').style.display = 'flex';
   ```

## 💡 提示

1. **使用无痕模式测试**：排除浏览器扩展和缓存问题
2. **检查浏览器兼容性**：确保使用现代浏览器（Chrome、Firefox、Safari、Edge）
3. **查看完整错误**：在控制台中查看完整的错误堆栈

## 🔗 相关文件

- `index.html` - 页面结构
- `auth.js` - 认证逻辑
- `editor.js` - 编辑器逻辑
- `api.js` - API 调用

## ✅ 正常状态

登录成功后，你应该看到：

1. **顶部**：
   - 标题：📝 WebNotes - 在线记事本
   - 保存按钮（💾 保存）
   - 用户信息（👤 username）
   - 退出按钮

2. **工具栏**：
   - B（粗体）、I（斜体）、U（下划线）
   - 🔗（链接）、🖼️（图片）、📎（文件）

3. **编辑器区域**：
   - 白色编辑框
   - 可以输入文字
   - 显示占位符："开始输入你的笔记..."

4. **状态栏**：
   - 显示状态（就绪、编辑中、保存中...）
   - 显示最后保存时间

如果看不到这些，按照上面的步骤排查。

