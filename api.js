// API 调用管理
class APIManager {
    constructor() {
        // 使用在线部署的 Worker 地址
        this.apiBase = 'https://webnotes.1259233520.workers.dev';
    }

    async saveDocument(path, content) {
        try {
            const response = await fetch(`${this.apiBase}/api/save-doc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ path, content })
            });

            if (!response.ok) {
                throw new Error(`保存失败: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Save document error:', error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.apiBase}/api/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`上传失败: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Upload file error:', error);
            throw error;
        }
    }

    async getDocument(path) {
        try {
            const response = await fetch(`${this.apiBase}/api/get-doc?path=${encodeURIComponent(path)}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null; // 文档不存在
                }
                throw new Error(`获取失败: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get document error:', error);
            throw error;
        }
    }
}

// 初始化
const apiManager = new APIManager();
window.apiManager = apiManager;
