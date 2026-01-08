// 认证管理
class AuthManager {
    constructor() {
        // 使用在线部署的 Worker 地址
        this.apiBase = 'https://webnotes.1259233520.workers.dev';
        
        // 临时关闭认证，直接显示编辑器（用于测试）
        const SKIP_AUTH = true; // 设置为 false 恢复认证
        
        if (SKIP_AUTH) {
            // 直接显示编辑器，跳过认证
            const showEditor = () => {
                console.log('SKIP_AUTH: Showing editor directly');
                this.onAuthSuccess({ login: '测试用户' });
                
                // 保护机制：定期检查并确保编辑器保持显示
                const protectEditor = () => {
                    if (!this.SKIP_AUTH) return;
                    
                    const editorScreen = document.getElementById('editorScreen');
                    const loginScreen = document.getElementById('loginScreen');
                    
                    if (editorScreen) {
                        const style = window.getComputedStyle(editorScreen);
                        if (style.display === 'none' || style.visibility === 'hidden') {
                            console.log('Editor was hidden, restoring...');
                            editorScreen.style.display = 'flex';
                            editorScreen.style.visibility = 'visible';
                        }
                    }
                    
                    if (loginScreen) {
                        const style = window.getComputedStyle(loginScreen);
                        if (style.display !== 'none') {
                            loginScreen.style.display = 'none';
                            loginScreen.style.visibility = 'hidden';
                        }
                    }
                };
                
                // 每 300ms 检查一次，持续 10 秒
                let checkCount = 0;
                const maxChecks = 33; // 约 10 秒
                const protectInterval = setInterval(() => {
                    protectEditor();
                    checkCount++;
                    if (checkCount >= maxChecks) {
                        clearInterval(protectInterval);
                        console.log('Editor protection stopped');
                    }
                }, 300);
            };
            
            // 确保 DOM 已加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(showEditor, 300);
                });
            } else {
                setTimeout(showEditor, 300);
            }
        } else {
            this.checkAuth();
        }
    }

    async checkAuth() {
        // 如果跳过了认证，不执行检查
        if (this.SKIP_AUTH) {
            console.log('Skipping auth check (SKIP_AUTH = true)');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/auth/check`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    this.onAuthSuccess(data.user);
                } else {
                    this.onAuthFailed();
                }
            } else {
                this.onAuthFailed();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // 如果跳过了认证，不要调用 onAuthFailed
            if (!this.SKIP_AUTH) {
                this.onAuthFailed();
            }
        }
    }

    // 确保编辑器在认证成功后显示
    ensureEditorVisible() {
        const editorScreen = document.getElementById('editorScreen');
        const loginScreen = document.getElementById('loginScreen');
        
        if (editorScreen && loginScreen) {
            editorScreen.style.display = 'flex';
            loginScreen.style.display = 'none';
        }
    }

    login() {
        window.location.href = `${this.apiBase}/auth/login`;
    }

    async logout() {
        try {
            await fetch(`${this.apiBase}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            this.onAuthFailed();
        } catch (error) {
            console.error('Logout failed:', error);
            this.onAuthFailed();
        }
    }

    onAuthSuccess(user) {
        console.log('Auth success, showing editor...', user);
        
        // 强制显示编辑器界面
        const loginScreen = document.getElementById('loginScreen');
        const editorScreen = document.getElementById('editorScreen');
        
        if (loginScreen) {
            loginScreen.style.display = 'none';
            loginScreen.style.visibility = 'hidden';
        }
        
        if (editorScreen) {
            editorScreen.style.display = 'flex';
            editorScreen.style.visibility = 'visible';
            console.log('Editor screen should be visible now');
        } else {
            console.error('Editor screen element not found!');
        }
        
        // 更新按钮显示
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const saveBtn = document.getElementById('saveBtn');
        
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
        if (saveBtn) {
            saveBtn.style.display = 'inline-block';
        }
        
        // 显示用户信息
        if (user) {
            const userInfo = document.getElementById('userInfo');
            if (userInfo) {
                userInfo.textContent = `👤 ${user.login || '用户'}`;
                userInfo.style.display = 'inline-block';
            }
        }
        
        // 确保编辑器元素存在
        const editor = document.getElementById('editor');
        if (!editor) {
            console.error('Editor element not found!');
        }
        
        // 加载笔记内容
        setTimeout(() => {
            if (window.editorManager) {
                window.editorManager.loadContent();
            } else {
                console.warn('EditorManager not initialized yet, waiting...');
                // 如果编辑器管理器还没初始化，等待一下
                setTimeout(() => {
                    if (window.editorManager) {
                        window.editorManager.loadContent();
                    } else {
                        console.error('EditorManager still not initialized!');
                    }
                }, 500);
            }
        }, 200);
    }

    onAuthFailed() {
        // 如果跳过了认证，不要隐藏编辑器
        if (this.SKIP_AUTH) {
            console.log('SKIP_AUTH is true, ignoring onAuthFailed()');
            return;
        }
        
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('editorScreen').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('userInfo').style.display = 'none';
    }
}

// 初始化
let authManager;

document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    
    document.getElementById('loginBtn').addEventListener('click', () => {
        authManager.login();
    });
    
    document.getElementById('githubLoginBtn').addEventListener('click', () => {
        authManager.login();
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        authManager.logout();
    });

    // 如果跳过了认证，不需要检查认证状态
    if (authManager.SKIP_AUTH) {
        console.log('SKIP_AUTH is true, skipping all auth checks');
        return;
    }

    // 检查 URL 中是否有 session 参数（OAuth 回调后）
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session')) {
        // OAuth 回调完成，session 已设置，检查认证状态
        setTimeout(() => {
            authManager.checkAuth();
            // 清理 URL 参数
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 500);
    } else {
        // 页面加载时检查认证状态
        setTimeout(() => {
            authManager.checkAuth();
        }, 100);
    }
});

window.authManager = authManager;
