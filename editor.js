// 编辑器管理
class EditorManager {
    constructor() {
        this.editor = document.getElementById('editor');
        this.saveBtn = document.getElementById('saveBtn');
        this.statusText = document.getElementById('statusText');
        this.lastSaved = document.getElementById('lastSaved');
        this.fileInput = document.getElementById('fileInput');
        this.autoSaveTimer = null;
        this.isSaving = false;
        this.currentPath = 'docs/index.json';
        
        this.init();
    }

    init() {
        // 保存按钮
        this.saveBtn.addEventListener('click', () => {
            this.saveContent();
        });

        // 自动保存（每 30 秒）
        this.editor.addEventListener('input', () => {
            this.updateStatus('编辑中...');
            this.debounceAutoSave();
        });

        // 粘贴图片
        this.editor.addEventListener('paste', (e) => {
            this.handlePaste(e);
        });

        // 拖拽文件
        this.editor.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.editor.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleDrop(e);
        });

        // 文件选择
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveContent();
            }
        });
    }

    async loadContent() {
        try {
            this.updateStatus('加载中...');
            const data = await window.apiManager.getDocument(this.currentPath);
            
            if (data && data.content) {
                this.editor.innerHTML = data.content;
            } else {
                this.editor.innerHTML = '<p>欢迎使用 WebNotes！开始记录你的想法吧 🎉</p>';
            }
            
            this.updateStatus('已加载');
        } catch (error) {
            this.updateStatus('加载失败');
            console.error('Load content error:', error);
        }
    }

    async saveContent() {
        if (this.isSaving) return;
        
        try {
            this.isSaving = true;
            this.saveBtn.disabled = true;
            this.updateStatus('保存中...');
            
            const content = this.editor.innerHTML;
            const result = await window.apiManager.saveDocument(this.currentPath, content);
            
            this.updateStatus('已保存');
            this.lastSaved.textContent = `最后保存: ${new Date().toLocaleTimeString()}`;
            
            setTimeout(() => {
                this.updateStatus('就绪');
            }, 2000);
        } catch (error) {
            this.updateStatus('保存失败');
            alert('保存失败，请重试');
            console.error('Save error:', error);
        } finally {
            this.isSaving = false;
            this.saveBtn.disabled = false;
        }
    }

    debounceAutoSave() {
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveContent();
        }, 30000); // 30 秒后自动保存
    }

    async handlePaste(e) {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                await this.uploadAndInsertImage(file);
                break;
            }
        }
    }

    async handleDrop(e) {
        const files = e.dataTransfer.files;
        
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                await this.uploadAndInsertImage(file);
            } else {
                await this.uploadAndInsertFile(file);
            }
        }
    }

    async handleFileSelect(e) {
        const files = e.target.files;
        
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                await this.uploadAndInsertImage(file);
            } else {
                await this.uploadAndInsertFile(file);
            }
        }
        
        // 清空 input，允许重复选择同一文件
        e.target.value = '';
    }

    async uploadAndInsertImage(file) {
        try {
            this.updateStatus('上传图片中...');
            const result = await window.apiManager.uploadFile(file);
            
            if (result.url) {
                const img = document.createElement('img');
                img.src = result.url;
                img.alt = file.name;
                
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(img);
                    range.collapse(false);
                } else {
                    this.editor.appendChild(img);
                }
                
                this.updateStatus('图片已插入');
                setTimeout(() => this.updateStatus('就绪'), 2000);
            }
        } catch (error) {
            this.updateStatus('上传失败');
            alert('图片上传失败，请重试');
            console.error('Upload image error:', error);
        }
    }

    async uploadAndInsertFile(file) {
        try {
            this.updateStatus('上传文件中...');
            const result = await window.apiManager.uploadFile(file);
            
            if (result.url) {
                const link = document.createElement('a');
                link.href = result.url;
                link.textContent = `📎 ${file.name}`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(link);
                    range.collapse(false);
                } else {
                    this.editor.appendChild(link);
                }
                
                this.updateStatus('文件已插入');
                setTimeout(() => this.updateStatus('就绪'), 2000);
            }
        } catch (error) {
            this.updateStatus('上传失败');
            alert('文件上传失败，请重试');
            console.error('Upload file error:', error);
        }
    }

    updateStatus(text) {
        this.statusText.textContent = text;
    }
}

// 格式化工具函数
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('editor').focus();
}

function insertLink() {
    const url = prompt('请输入链接地址:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function insertImage() {
    document.getElementById('fileInput').click();
}

// 初始化
let editorManager;

document.addEventListener('DOMContentLoaded', () => {
    editorManager = new EditorManager();
    window.editorManager = editorManager;
});
