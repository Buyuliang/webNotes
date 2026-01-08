// 认证管理
class AuthManager {
    constructor() {
        // 使用在线部署的 Worker 地址
        this.apiBase = 'https://webnotes.1259233520.workers.dev';
        this.checkAuth();
    }

    async checkAuth() {
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
            this.onAuthFailed();
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
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('editorScreen').style.display = 'flex';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        document.getElementById('saveBtn').style.display = 'inline-block';
        
        if (user) {
            document.getElementById('userInfo').textContent = `👤 ${user.login || '用户'}`;
            document.getElementById('userInfo').style.display = 'inline-block';
        }
        
        // 加载笔记内容
        if (window.editorManager) {
            window.editorManager.loadContent();
        }
    }

    onAuthFailed() {
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

    // 检查 URL 中是否有 session 参数（OAuth 回调后）
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session')) {
        // OAuth 回调完成，session 已设置，检查认证状态
        setTimeout(() => {
            authManager.checkAuth();
            // 清理 URL 参数
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 500);
    }
});

window.authManager = authManager;
