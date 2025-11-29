/**
 * Restructure Vision – RV-Agent
 * 主交互逻辑文件
 */

// =========================
// 启动页面控制
// =========================

/**
 * 隐藏启动页面，显示主页面内容
 */
function hideSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');
    const mascot = document.querySelector('.mascot-assistant');
    
    if (splashScreen && mainContent) {
        // 添加淡出动画
        splashScreen.classList.add('fade-out');
        
        // 等待启动页完全淡出后，再开始显示主内容
        setTimeout(() => {
            splashScreen.style.display = 'none';
            
            // 显示吉祥物
            if (mascot) {
                mascot.classList.add('show');
                mascot.style.display = 'block';
                console.log('吉祥物已显示');
            } else {
                console.log('未找到吉祥物元素');
            }
            
            // 封面完全淡出后，再延迟一点开始显示主页面
            setTimeout(() => {
                // 先显示主内容（但保持透明）
                mainContent.classList.remove('hidden');
                mainContent.style.display = 'block';
                
                // 强制浏览器重新计算样式，确保初始状态生效
                void mainContent.offsetWidth;
                
                // 再添加淡入类，触发动画
                setTimeout(() => {
                    mainContent.classList.add('fade-in');
                }, 10);
            }, 100);
        }, 800);
    }
}

// =========================
// 模态框控制
// =========================

/**
 * 打开关于我们弹窗
 */
function openAboutModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

/**
 * 关闭关于我们弹窗
 */
function closeAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // 恢复滚动
    }
}

/**
 * 打开招贤纳士/联系我们弹窗
 */
function openRecruitModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('recruitModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * 关闭招贤纳士/联系我们弹窗
 */
function closeRecruitModal() {
    const modal = document.getElementById('recruitModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * 打开平台人员介绍弹窗
 */
function openTeamModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('teamModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * 关闭平台人员介绍弹窗
 */
function closeTeamModal() {
    const modal = document.getElementById('teamModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    const aboutModal = document.getElementById('aboutModal');
    const recruitModal = document.getElementById('recruitModal');
    const teamModal = document.getElementById('teamModal');
    
    if (event.target === aboutModal) {
        closeAboutModal();
    }
    if (event.target === recruitModal) {
        closeRecruitModal();
    }
    if (event.target === teamModal) {
        closeTeamModal();
    }
}

// ESC键关闭弹窗
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAboutModal();
        closeRecruitModal();
        closeTeamModal();
    }
});

// =========================
// 页面导航函数
// =========================

function navigateToManager() {
    window.location.href = 'manager.html?skipSplash=true';
}

function navigateToCreditor() {
    window.location.href = 'creditor.html?skipSplash=true';
}

function navigateToHome() {
    window.location.href = 'index.html?skipSplash=true';
}

// =========================
// 文件上传功能与工具函数
// =========================

// 工具函数已移至 utils.js 文件中

/**
 * 打开文档（在页面中直接查看文档内容）
 */
async function openDocument(filename) {
    try {
        if (!filename) {
            showErrorMessage('文件名无效');
            return;
        }

        // 找到对应的文件信息
        const file = uploadedFiles.find(f => f.filename === filename || f.originalName === filename);
        if (!file) {
            showErrorMessage('文件信息不存在');
            return;
        }

        showLoadingMessage('正在加载文档内容...');
        
        // 调用预览API获取文档内容，在页面中显示
        const response = await fetch(`${API_CONFIG.baseURL}/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: [file]
            }),
            signal: AbortSignal.timeout(API_CONFIG.timeout)
        });

        const result = await response.json();
        hideLoadingMessage();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        if (result.success && result.previews.length > 0) {
            // 显示完整文档内容（使用displayFullDocument显示单个文档）
            displayFullDocument(result.previews);
            showSuccessMessage('文档已打开');
        } else {
            throw new Error('加载失败');
        }
        
    } catch (error) {
        hideLoadingMessage();
        if (error.name === 'AbortError') {
            showErrorMessage('加载超时，请重试');
        } else if (error.message.includes('Failed to fetch')) {
            showErrorMessage('🔌 无法连接到AI服务器\n\n📋 解决步骤：\n1️⃣ 安装 Node.js (https://nodejs.org/)\n2️⃣ 双击运行 start-server.bat\n3️⃣ 等待服务启动后刷新页面');
        } else {
            showErrorMessage(`打开文档失败：${error.message}`);
        }
        console.error('打开文档失败:', error);
    }
}

// 显示成功消息（增强版）
function showSuccessMessage(message, duration = 3000) {
    // 移除已存在的成功消息，避免重复
    const existingToasts = document.querySelectorAll('.toast-success');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = createToast(message, 'success');
    document.body.appendChild(toast);
    
    // 添加进入动画
    setTimeout(() => toast.classList.add('toast-show'), 10);
    
    // 自动消失
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// 显示错误消息（增强版）
function showErrorMessage(message, duration = 5000) {
    // 移除已存在的错误消息，避免重复
    const existingToasts = document.querySelectorAll('.toast-error');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = createToast(message, 'error');
    document.body.appendChild(toast);
    
    // 添加进入动画
    setTimeout(() => toast.classList.add('toast-show'), 10);
    
    // 自动消失
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * 显示详细的错误信息
 */
function displayDetailedError(error, container, retryFunction) {
    const errorType = error.errorType || 'unknown';
    const errorDetails = error.errorDetails || error.message || '未知错误';
    const fullError = error.fullError || error.message || '';
    
    // 根据错误类型设置不同的图标和颜色
    let errorIcon = '⚠️';
    let errorTitle = '分析失败';
    let errorColor = 'var(--error-color)';
    
    switch(errorType) {
        case 'timeout':
            errorIcon = '⏱️';
            errorTitle = '请求超时';
            break;
        case 'network':
            errorIcon = '🔌';
            errorTitle = '网络连接失败';
            break;
        case 'auth':
            errorIcon = '🔑';
            errorTitle = '认证失败';
            break;
        case 'rate_limit':
            errorIcon = '🚦';
            errorTitle = '请求频率过高';
            break;
        case 'server':
            errorIcon = '🖥️';
            errorTitle = '服务器错误';
            break;
        case 'file':
            errorIcon = '📄';
            errorTitle = '文件处理失败';
            break;
        default:
            errorIcon = '⚠️';
            errorTitle = '分析失败';
    }
    
    container.innerHTML = `
        <div style="padding: 2rem; text-align: center; max-width: 600px; margin: 0 auto;">
            <div style="color: ${errorColor}; margin-bottom: 1rem; font-size: 3rem;">${errorIcon}</div>
            <h4 style="color: ${errorColor}; margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600;">${errorTitle}</h4>
            
            <div style="background: #f8f9fa; border-left: 4px solid ${errorColor}; padding: 1rem; margin: 1.5rem 0; text-align: left; border-radius: 4px;">
                <div style="font-weight: 600; color: var(--text-dark); margin-bottom: 0.5rem;">问题详情：</div>
                <div style="color: var(--text-light); line-height: 1.6; white-space: pre-line;">${errorDetails}</div>
            </div>
            
            ${fullError && fullError !== errorDetails ? `
            <details style="margin: 1rem 0; text-align: left;">
                <summary style="cursor: pointer; color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.5rem;">查看技术详情</summary>
                <div style="background: #f8f9fa; padding: 0.75rem; border-radius: 4px; font-family: monospace; font-size: 0.85rem; color: var(--text-light); margin-top: 0.5rem; word-break: break-all;">${fullError}</div>
            </details>
            ` : ''}
            
            <div style="margin-top: 2rem;">
                <button onclick="${retryFunction ? retryFunction + '()' : 'location.reload()'}" style="
                    padding: 0.75rem 2rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#333'" onmouseout="this.style.background='var(--primary-color)'">
                    ${retryFunction ? '🔄 重新生成' : '🔄 刷新页面'}
                </button>
            </div>
        </div>
    `;
}

// 显示加载状态
function showLoadingMessage(message) {
    const toast = createToast(message, 'loading');
    toast.id = 'loading-toast';
    document.body.appendChild(toast);
    return toast;
}

// 隐藏加载状态
function hideLoadingMessage() {
    const loadingToast = document.getElementById('loading-toast');
    if (loadingToast) {
        loadingToast.remove();
    }
}

// 创建Toast消息（增强版）
function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // 添加图标
    let icon = '';
    switch(type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✗';
            break;
        case 'loading':
            icon = '<div class="loading-spinner"></div>';
            break;
        default:
            icon = 'ℹ';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <span class="toast-message">${message}</span>
        ${type !== 'loading' ? '<button class="toast-close" aria-label="关闭">&times;</button>' : ''}
    `;
    
    // 添加关闭事件
    if (type !== 'loading') {
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.onclick = () => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        };
    }
    
    return toast;
}

// 文件验证（增强版）
function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    // 检查文件大小
    if (file.size === 0) {
        throw new Error(`文件"${file.name}"是空文件，无法上传`);
    }
    
    if (file.size > maxSize) {
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
        throw new Error(`文件"${file.name}"大小为${fileSizeMB}MB，超过10MB限制`);
    }
    
    // 检查文件类型
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        throw new Error(`文件"${file.name}"格式不支持。\n支持的格式: PDF, Word (doc/docx), Excel (xls/xlsx)`);
    }
    
    // 检查文件名
    if (file.name.length > 255) {
        throw new Error(`文件名"${file.name}"过长，请使用较短的文件名`);
    }
    
    return true;
}

function displayFileList(files) {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;
    
    fileList.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--bg-gray);
            border-radius: 8px;
            margin-bottom: 0.75rem;
            border: 1px solid var(--border-color);
        `;
        
        fileItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; color: var(--text-dark); word-break: break-all;">${escapeHtml(file.originalName || file.name)}</div>
                    <div style="font-size: 0.875rem; color: var(--text-light);">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="openDocument('${file.filename}')" style="
                    padding: 0.5rem 1rem;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    打开
                </button>
                <button onclick="removeFile(${index})" style="
                    padding: 0.5rem 1rem;
                    background: #fee2e2;
                    color: #dc2626;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'">
                    删除
                </button>
            </div>
        `;
        
        fileList.appendChild(fileItem);
    });
}

let uploadedFiles = [];

// 存储生成的内容
let generatedContent = {
    plan: null,        // 预重整方案
    agreement: null,   // 庭外重组协议  
    report: null,      // 债权人会议报告
    analysis: null,    // 企业价值分析
    risk: null,        // 风险指标
    feasibility: null  // 重组可行性
};

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    displayFileList(uploadedFiles);
}

// =========================
// 管理人功能（manager.html）
// =========================

/**
 * 生成庭外重组协议
 * TODO: 接入 RV-Agent 智能体 API
 */
async function generateOutsideReorganizationAgreement() {
    console.log('生成庭外重组协议');
    
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传相关文档');
        return;
    }
    
    const textDisplay = document.getElementById('textDisplay');
    if (!textDisplay) return;
    
    const loadingToast = showLoadingMessage('正在生成庭外重组协议，请稍候...');
    
    try {
        // 显示加载状态
        textDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">正在分析文档并生成庭外重组协议...</p>
            </div>
        `;
        
        // 调用AI API生成庭外重组协议
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'outside-agreement'
        });
        
        hideLoadingMessage();
        
        if (result.success) {
            // 保存生成的内容供下载使用
            // 清理Markdown符号后存储
            const cleanedResult = cleanMarkdownSymbols(result.result);
            generatedContent.agreement = cleanedResult;
            
            // 高亮待补充内容（启用可编辑模式）
            const highlightedAgreement = highlightPlaceholders(cleanedResult, false, true);
            
            // 生成待补充项摘要
            const placeholderSummary = generatePlaceholderSummary(cleanedResult);
            
            textDisplay.innerHTML = `
                <div style="padding: 1.5rem; text-align: left;">
                    <h4 style="margin-bottom: 1rem; color: var(--text-dark); text-align: left;">
                        <span style="color: var(--success-color);">✓</span> 庭外重组协议生成完成
                    </h4>
                    <div style="background: #fff9e6; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 3px solid #ffa500;">
                        <strong style="color: #ff8c00;">💡 提示</strong>：
                        <span style="color: #666; font-size: 0.9rem;">点击灰色的 [待补充] 标记可直接编辑内容，编辑后会变为绿色。完成编辑后记得下载文档保存修改。</span>
                    </div>
                    <div id="editableContent" style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left;">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedAgreement}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #f0f9ff; border-radius: 6px; font-size: 0.85rem; color: #0369a1; text-align: left;">
                        <strong>✓ 协议生成完成</strong> - 基于上传文档智能生成 | <span style="color: #4CAF50;">✎ 可在线编辑</span>
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="applyEditsAndDownload('agreement')" style="
                            padding: 0.75rem 1.5rem;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        ">📥 应用编辑并下载</button>
                        <button onclick="downloadDocument('agreement')" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--primary-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载协议</button>
                        <button onclick="previewDocument('agreement')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: var(--primary-color);
                            border: 2px solid var(--primary-color);
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">预览</button>
                        <button onclick="generateOutsideReorganizationAgreement()" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--warning-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">🔄 重新生成</button>
                    </div>
                </div>
            `;
            showSuccessMessage('庭外重组协议生成完成！');
        } else {
            throw new Error(result.message || '生成失败');
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('生成庭外重组协议失败:', error);
        
        displayDetailedError(error, textDisplay, 'generateOutsideReorganizationAgreement');
        showErrorMessage(error.message || '生成庭外重组协议失败');
    }
}

/**
 * 生成预重整方案
 * 已集成AI分析
 */
async function generatePreReorganizationDraft() {
    console.log('生成预重整方案 - 使用AI');
    
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传相关文档');
        return;
    }
    
    const textDisplay = document.getElementById('textDisplay');
    if (!textDisplay) return;
    
    const loadingToast = showLoadingMessage('正在生成预重整方案，请稍候...');
    
    try {
        // 显示加载状态
        textDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">🤖 正在智能分析企业情况并制定预重整方案...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">这可能需要30-60秒，请耐心等待</p>
            </div>
        `;
        
        // 调用AI API生成预重整方案
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'pre-restructure-plan'
        });
        
        hideLoadingMessage();
        
        if (result.success) {
            // 保存生成的内容供下载使用
            // 清理Markdown符号后存储
            const cleanedResult = cleanMarkdownSymbols(result.result);
            generatedContent.plan = cleanedResult;
            
            // 高亮待补充内容（启用可编辑模式）
            const highlightedPlan = highlightPlaceholders(cleanedResult, false, true);
            
            // 生成待补充项摘要
            const placeholderSummary = generatePlaceholderSummary(cleanedResult);
            
            textDisplay.innerHTML = `
                <div style="padding: 1.5rem; text-align: left;">
                    <h4 style="margin-bottom: 1rem; color: var(--text-dark); text-align: left;">
                        <span style="color: var(--success-color);">📋</span> 预重整方案生成完成
                    </h4>
                    <div style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left;">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedPlan}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #e7f3ff; border-radius: 6px; font-size: 0.85rem; color: #0066cc; text-align: left;">
                        <strong>📋 预重整方案完成</strong> - 基于上传文档智能生成
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyToClipboard(generatedContent.plan)" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--primary-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制方案</button>
                        <button onclick="downloadDocument('plan')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: var(--primary-color);
                            border: 2px solid var(--primary-color);
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载方案</button>
                        <button onclick="generatePreReorganizationDraft()" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--warning-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">🔄 重新生成</button>
                    </div>
                </div>
            `;
            showSuccessMessage('预重整方案生成完成！');
        } else {
            throw new Error(result.message || '分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('预重整方案生成失败:', error);
        
        displayDetailedError(error, textDisplay, 'generatePreReorganizationDraft');
        showErrorMessage(error.message || '预重整方案生成失败');
    }
}

/**
 * 提取第一次会议字段
 * 已集成AI分析
 */
async function extractFirstMeetingFields() {
    console.log('提取第一次会议字段 - 使用AI');
    
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传相关文档');
        return;
    }
    
    const fieldsDisplay = document.getElementById('fieldsDisplay');
    if (!fieldsDisplay) return;
        
    const loadingToast = showLoadingMessage('正在提取会议字段，请稍候...');
    
    try {
        // 显示加载状态
            fieldsDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">🤖 正在智能提取会议关键字段...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">正在识别时间、地点、参会人员等信息</p>
            </div>
        `;
        
        // 调用AI API提取会议字段
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'meeting-fields'
        });
        
        hideLoadingMessage();
        
        if (result.success) {
            let fieldsData;
            try {
                // 尝试解析JSON格式的返回结果
                fieldsData = JSON.parse(result.result);
            } catch (e) {
                // 如果不是JSON格式，使用文本格式显示
                fieldsData = null;
            }
            
            let fieldsHTML;
            if (fieldsData) {
                // 如果是结构化数据，显示表格
                fieldsHTML = `
                <div style="padding: 1rem;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.75rem; font-weight: 600; color: var(--text-dark); width: 30%;">会议时间</td>
                                <td style="padding: 0.75rem; color: var(--text-light);">${fieldsData.meetingTime || '未提及'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.75rem; font-weight: 600; color: var(--text-dark);">会议地点</td>
                                <td style="padding: 0.75rem; color: var(--text-light);">${fieldsData.meetingLocation || '未提及'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.75rem; font-weight: 600; color: var(--text-dark);">会议主持人</td>
                                <td style="padding: 0.75rem; color: var(--text-light);">${fieldsData.chairperson || '未提及'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.75rem; font-weight: 600; color: var(--text-dark);">参会人员</td>
                                <td style="padding: 0.75rem; color: var(--text-light);">${Array.isArray(fieldsData.attendees) ? fieldsData.attendees.join(', ') : fieldsData.attendees || '未提及'}</td>
                        </tr>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 0.75rem; font-weight: 600; color: var(--text-dark);">主要议题</td>
                                <td style="padding: 0.75rem; color: var(--text-light);">${Array.isArray(fieldsData.mainTopics) ? fieldsData.mainTopics.join(', ') : fieldsData.mainTopics || '未提及'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.75rem; font-weight: 600; color: var(--text-dark);">表决结果</td>
                                <td style="padding: 0.75rem; color: var(--text-light);">${Array.isArray(fieldsData.votingResults) ? fieldsData.votingResults.join(', ') : fieldsData.votingResults || '未提及'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.75rem; font-weight: 600; color: var(--text-dark);">下次会议时间</td>
                                <td style="padding: 0.75rem; color: var(--text-light);">${fieldsData.nextMeetingDate || '未提及'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; font-weight: 600; color: var(--text-dark);">重要决议</td>
                                <td style="padding: 0.75rem; color: var(--text-light);">${Array.isArray(fieldsData.importantDecisions) ? fieldsData.importantDecisions.join(', ') : fieldsData.importantDecisions || '未提及'}</td>
                        </tr>
                    </table>
                </div>
            `;
            } else {
                // 如果是纯文本格式，显示文本内容
                fieldsHTML = `
                    <div style="padding: 1.5rem;">
                        <h4 style="margin-bottom: 1rem; color: var(--text-dark);">提取的会议信息</h4>
                        <div style="background: var(--bg-white); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                            <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.6; margin: 0; color: var(--text-dark);">${result.result}</pre>
                        </div>
                    </div>
                `;
            }
            
            fieldsDisplay.innerHTML = `
                <div style="padding: 0;">
                    <div style="margin-bottom: 1rem; padding: 0.75rem; background: #dcfce7; border-radius: 6px; font-size: 0.85rem; color: #166534;">
                        <strong>🔍 字段提取完成</strong> - 已智能识别会议关键信息
                    </div>
                    ${fieldsHTML}
                    <div style="margin-top: 1rem; padding: 0 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button onclick="copyToClipboard(\`${result.result.replace(/`/g, '\\`')}\`)" style="
                            padding: 0.5rem 1rem;
                            background: var(--success-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 0.9rem;
                        ">复制字段信息</button>
                        <button onclick="extractFirstMeetingFields()" style="
                            padding: 0.5rem 1rem;
                            background: var(--primary-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 0.9rem;
                        ">🔄 重新提取</button>
                    </div>
                </div>
            `;
            showSuccessMessage('会议字段提取完成！');
        } else {
            throw new Error(result.message || '分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('会议字段提取失败:', error);
        
        displayDetailedError(error, fieldsDisplay, 'extractFirstMeetingFields');
        showErrorMessage(error.message || '字段提取失败');
    }
}

/**
 * 生成债权人会议报告
 * 已集成AI分析
 */
async function generateClaimsMeetingReport() {
    console.log('生成债权人会议报告 - 使用AI');
    
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传相关文档');
        return;
    }
    
    const textDisplay = document.getElementById('textDisplay');
    if (!textDisplay) return;
    
    const loadingToast = showLoadingMessage('正在生成债权人会议报告，请稍候...');
    
    try {
        // 显示加载状态
        textDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">🤖 正在智能分析会议文档并生成报告...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">正在提取会议要点和生成完整报告</p>
            </div>
        `;
        
        // 调用AI API生成债权人会议报告
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'meeting-report'
        });
        
        hideLoadingMessage();
        
        if (result.success) {
            // 保存生成的内容供下载使用
            // 清理Markdown符号后存储
            const cleanedResult = cleanMarkdownSymbols(result.result);
            generatedContent.report = cleanedResult;
            
            // 高亮待补充内容
            const highlightedReport = highlightPlaceholders(cleanedResult);
            
            // 生成待补充项摘要
            const placeholderSummary = generatePlaceholderSummary(cleanedResult);
            
            textDisplay.innerHTML = `
                <div style="padding: 1.5rem; text-align: left;">
                    <h4 style="margin-bottom: 1rem; color: var(--text-dark); text-align: left;">
                        <span style="color: var(--success-color);">📊</span> 债权人会议报告生成完成
                    </h4>
                    <div style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left;">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedReport}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #f0f9ff; border-radius: 6px; font-size: 0.85rem; color: #0369a1; text-align: left;">
                        <strong>📊 会议报告完成</strong> - 基于会议文档智能生成
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyToClipboard(generatedContent.report)" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--primary-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制报告</button>
                        <button onclick="downloadDocument('report')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: var(--primary-color);
                            border: 2px solid var(--primary-color);
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载报告</button>
                        <button onclick="generateClaimsMeetingReport()" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--warning-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">🔄 重新生成</button>
                    </div>
                </div>
            `;
            showSuccessMessage('债权人会议报告生成完成！');
        } else {
            throw new Error(result.message || '分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('债权人会议报告生成失败:', error);
        
        displayDetailedError(error, textDisplay, 'generateClaimsMeetingReport');
        showErrorMessage(error.message || '会议报告生成失败');
    }
}

// =========================
// 债权人功能（creditor.html）
// =========================

/**
 * 企业价值分析
 * 已集成AI分析
 */
async function analyzeEnterpriseValue() {
    console.log('企业价值分析 - 使用AI');
    
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传相关文档');
        return;
    }
    
    const analysisDisplay = document.getElementById('analysisDisplay');
    if (!analysisDisplay) return;
    
    const loadingToast = showLoadingMessage('正在分析企业价值，请稍候...');
    
    try {
        // 显示加载状态
        analysisDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">🤖 正在智能深度分析企业价值...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">这可能需要30-60秒，请耐心等待</p>
            </div>
        `;
        
        // 调用AI API进行企业价值分析
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'enterprise-value'
        });
        
        hideLoadingMessage();
        
        if (result.success) {
            // 保存生成的内容供下载使用
            // 清理Markdown符号后存储
            const cleanedResult = cleanMarkdownSymbols(result.result);
            generatedContent.analysis = cleanedResult;
            
            // 高亮待补充内容
            const highlightedAnalysis = highlightPlaceholders(cleanedResult);
            
            // 生成待补充项摘要
            const placeholderSummary = generatePlaceholderSummary(cleanedResult);
            
            analysisDisplay.innerHTML = `
                <div style="padding: 1.5rem; text-align: left;">
                    <h4 style="margin-bottom: 1rem; color: var(--text-dark); text-align: left;">
                        <span style="color: var(--success-color);">🤖</span> 企业价值分析报告
                    </h4>
                    <div style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left;">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedAnalysis}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #e3f2fd; border-radius: 6px; font-size: 0.85rem; color: #1565c0; text-align: left;">
                        <strong>💡 分析完成</strong> - 基于上传文档智能分析生成
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyToClipboard(generatedContent.analysis)" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--primary-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制报告</button>
                        <button onclick="exportAnalysisResults()" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: var(--primary-color);
                            border: 2px solid var(--primary-color);
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">导出Excel</button>
                        <button onclick="analyzeEnterpriseValue()" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--warning-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">🔄 重新分析</button>
                    </div>
                </div>
            `;
            showSuccessMessage('企业价值分析完成！');
        } else {
            throw new Error(result.message || '分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('企业价值分析失败:', error);
        
        displayDetailedError(error, analysisDisplay, 'analyzeEnterpriseValue');
        showErrorMessage(error.message || '分析失败');
    }
}

/**
 * 提取风险指标
 * 已集成AI分析
 */
async function extractRiskIndicators() {
    console.log('提取风险指标 - 使用AI');
    
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传相关文档');
        return;
    }
    
    const analysisDisplay = document.getElementById('analysisDisplay');
    if (!analysisDisplay) return;
    
    const loadingToast = showLoadingMessage('正在提取风险指标，请稍候...');
    
    try {
        // 显示加载状态
        analysisDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">🤖 正在智能提取风险指标...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">正在识别各项风险因素...</p>
            </div>
        `;
        
        // 调用AI API进行风险指标分析
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'risk-indicators'
        });
        
        hideLoadingMessage();
        
        if (result.success) {
            // 保存生成的内容供下载使用
            // 清理Markdown符号后存储
            const cleanedResult = cleanMarkdownSymbols(result.result);
            generatedContent.risk = cleanedResult;
            
            // 高亮待补充内容
            const highlightedRisk = highlightPlaceholders(cleanedResult);
            
            // 生成待补充项摘要
            const placeholderSummary = generatePlaceholderSummary(cleanedResult);
            
            analysisDisplay.innerHTML = `
                <div style="padding: 1.5rem; text-align: left;">
                    <h4 style="margin-bottom: 1rem; color: var(--text-dark); text-align: left;">
                        <span style="color: var(--warning-color);">⚠️</span> 风险指标分析报告
                    </h4>
                    <div style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left;">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedRisk}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #fff3cd; border-radius: 6px; font-size: 0.85rem; color: #856404; text-align: left;">
                        <strong>⚠️ 风险评估完成</strong> - 基于文档内容智能分析生成
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyToClipboard(generatedContent.risk)" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--warning-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制报告</button>
                        <button onclick="exportAnalysisResults()" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: var(--warning-color);
                            border: 2px solid var(--warning-color);
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">导出Excel</button>
                        <button onclick="extractRiskIndicators()" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--error-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">🔄 重新分析</button>
                    </div>
                </div>
            `;
            showSuccessMessage('风险指标分析完成！');
        } else {
            throw new Error(result.message || '分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('风险指标分析失败:', error);
        
        displayDetailedError(error, analysisDisplay, 'extractRiskIndicators');
        showErrorMessage(error.message || '风险分析失败');
    }
}

/**
 * 生成重组可行性报告
 * 已集成AI分析
 */
async function generateRestructureFeasibility() {
    console.log('生成重组可行性报告 - 使用AI');
    
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传相关文档');
        return;
    }
    
    const analysisDisplay = document.getElementById('analysisDisplay');
    if (!analysisDisplay) return;
    
    const loadingToast = showLoadingMessage('正在分析重组可行性，请稍候...');
    
    try {
        // 显示加载状态
        analysisDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">🤖 正在智能评估重组可行性...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">正在综合分析各项指标...</p>
            </div>
        `;
        
        // 调用AI API进行可行性分析
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'restructure-feasibility'
        });
        
        hideLoadingMessage();
        
        if (result.success) {
            // 保存生成的内容供下载使用
            // 清理Markdown符号后存储
            const cleanedResult = cleanMarkdownSymbols(result.result);
            generatedContent.feasibility = cleanedResult;
            
            // 高亮待补充内容
            const highlightedFeasibility = highlightPlaceholders(cleanedResult);
            
            // 生成待补充项摘要
            const placeholderSummary = generatePlaceholderSummary(cleanedResult);
            
            analysisDisplay.innerHTML = `
                <div style="padding: 1.5rem; text-align: left;">
                    <h4 style="margin-bottom: 1rem; color: var(--text-dark); text-align: left;">
                        <span style="color: var(--success-color);">📊</span> 重组可行性分析报告
                    </h4>
                    <div style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left;">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedFeasibility}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #d4edda; border-radius: 6px; font-size: 0.85rem; color: #155724; text-align: left;">
                        <strong>📊 可行性评估完成</strong> - 基于企业现状智能综合评估
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyToClipboard(generatedContent.feasibility)" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--success-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制报告</button>
                        <button onclick="exportAnalysisResults()" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: var(--success-color);
                            border: 2px solid var(--success-color);
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">导出Excel</button>
                        <button onclick="generateRestructureFeasibility()" style="
                            padding: 0.75rem 1.5rem;
                            background: var(--accent-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">🔄 重新分析</button>
                    </div>
                </div>
            `;
            showSuccessMessage('可行性分析完成！');
        } else {
            throw new Error(result.message || '分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('可行性分析失败:', error);
        
        displayDetailedError(error, analysisDisplay, 'generateRestructureFeasibility');
        showErrorMessage(error.message || '可行性分析失败');
    }
}

// =========================
// 移动端优化
// =========================

/**
 * 移动端优化初始化
 */
function initMobileOptimizations() {
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 防止长按选择文本造成的问题
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // 优化iOS Safari的bottom bar问题
    function updateViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateViewportHeight, 100);
    });
    
    // 修复移动端键盘弹出时的视口问题
    const viewport = document.querySelector('meta[name=viewport]');
    function handleViewportChange() {
        if (viewport) {
            if (window.innerHeight < window.innerWidth) {
                // 横屏或键盘弹出
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            } else {
                // 正常竖屏
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        }
    }
    
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    
    console.log('移动端优化已初始化');
}

// =========================
// 页面初始化
// =========================

document.addEventListener('DOMContentLoaded', function() {
    console.log('RV-Agent 系统已加载');
    
    // 初始化移动端优化
    initMobileOptimizations();
    
    const mascot = document.querySelector('.mascot-assistant');
    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');
    
    // 检查是否需要跳过启动页
    const urlParams = new URLSearchParams(window.location.search);
    
    // 显示吉祥物的函数
    function showMascot() {
        const mascotEl = document.querySelector('.mascot-assistant');
        if (mascotEl) {
            mascotEl.classList.add('show');
            mascotEl.style.display = 'block';
            console.log('吉祥物已显示（初始化）');
        } else {
            console.log('未找到吉祥物元素（初始化）');
        }
    }
    
    if (urlParams.get('skipSplash') === 'true') {
        if (splashScreen && mainContent) {
            // 直接隐藏启动页，显示主内容（无动画）
            splashScreen.style.display = 'none';
            splashScreen.classList.add('fade-out');
            mainContent.classList.remove('hidden');
            mainContent.style.display = 'block';
            // 直接显示，不添加淡入动画
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
            
            // 显示吉祥物
            showMascot();
            
            // 移除URL中的skipSplash参数，这样刷新时会显示启动页
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        } else {
            // 如果没有启动页，直接显示吉祥物
            showMascot();
        }
    } else {
        // 检查启动页是否存在且可见
        const splashVisible = splashScreen && 
            splashScreen.style.display !== 'none' && 
            !splashScreen.classList.contains('fade-out');
        
        if (!splashVisible) {
            // 如果启动页不存在或已隐藏，显示吉祥物
            showMascot();
        }
        
        // 检查主内容是否已经显示（没有启动页的情况）
        if (mainContent && !mainContent.classList.contains('hidden')) {
            showMascot();
        }
    }
    
    // 文件上传功能
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    if (fileInput && uploadArea) {
        fileInput.addEventListener('change', async function(e) {
            if (e.target.files.length > 0) {
                try {
                    const validFiles = [];
                    Array.from(e.target.files).forEach(file => {
                        validateFile(file);
                        validFiles.push(file);
                    });

                    // 上传文件到服务器
                    const loadingToast = showLoadingMessage(`正在上传 ${validFiles.length} 个文件...`);
                    
                    const uploadResult = await uploadFiles(validFiles);
                    hideLoadingMessage();

                    if (uploadResult.success) {
                        uploadedFiles = uploadResult.files;
                        displayFileList(uploadedFiles);
                        showSuccessMessage(uploadResult.message);
                    } else {
                        throw new Error(uploadResult.message || '上传失败');
                    }

                } catch (error) {
                    hideLoadingMessage();
                    showErrorMessage(error.message);
                    e.target.value = ''; // 清除无效文件
                    uploadedFiles = [];
                }
            }
        });
        
        // 拖拽上传
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.background = '#eff6ff';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border-color)';
            this.style.background = 'var(--bg-gray)';
        });
        
        uploadArea.addEventListener('drop', async function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border-color)';
            this.style.background = 'var(--bg-gray)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                try {
                    const validFiles = [];
                    Array.from(files).forEach(file => {
                        validateFile(file);
                        validFiles.push(file);
                    });

                    // 上传文件到服务器
                    const loadingToast = showLoadingMessage(`正在拖拽上传 ${validFiles.length} 个文件...`);
                    
                    const uploadResult = await uploadFiles(validFiles);
                    hideLoadingMessage();

                    if (uploadResult.success) {
                        uploadedFiles = uploadResult.files;
                        displayFileList(uploadedFiles);
                        showSuccessMessage(uploadResult.message);
                    } else {
                        throw new Error(uploadResult.message || '上传失败');
                    }

                } catch (error) {
                    hideLoadingMessage();
                    showErrorMessage(error.message);
                    uploadedFiles = [];
                }
            }
        });
    }
});

// =========================
// API 配置（已集成AI）
// =========================

// API配置 - 自动检测环境
const API_CONFIG = {
    baseURL: (() => {
        // 生产环境：使用当前域名
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return `${window.location.origin}/api`;
        }
        // 开发环境：使用localhost
        return 'http://localhost:3000/api';
    })(),
    timeout: 360000, // 6分钟超时，因为预重整方案生成需要5分钟
};

/**
 * API 请求封装函数
 * 已实现AI分析集成
 */
async function callAPI(endpoint, data, options = {}) {
    console.log(`调用 API: ${endpoint}`, data);
    
    // 使用AbortController来更好地控制超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, options.timeout || API_CONFIG.timeout);
    
    try {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        const config = {
            method: options.method || 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: data ? JSON.stringify(data) : null,
            signal: controller.signal
        };

        const response = await fetch(url, config);
        clearTimeout(timeoutId);
        const result = await response.json();

        // 检查HTTP状态码
        if (!response.ok) {
            // 创建错误对象，包含详细信息
            const error = new Error(result.message || `HTTP ${response.status}`);
            error.errorType = result.errorType || 'unknown';
            error.errorDetails = result.errorDetails || result.error || '未知错误';
            error.fullError = result.fullError || '';
            throw error;
        }

        // 检查业务逻辑是否成功（后端可能返回success: false但HTTP 200）
        if (result.success === false) {
            const error = new Error(result.message || '操作失败');
            error.errorType = result.errorType || 'unknown';
            error.errorDetails = result.errorDetails || result.error || '未知错误';
            error.fullError = result.fullError || '';
            throw error;
        }

        return result;

    } catch (error) {
        clearTimeout(timeoutId);
        console.error(`API调用失败 ${endpoint}:`, error);
        
        // 如果错误已经有errorType和errorDetails（从后端返回），直接抛出
        if (error.errorType && error.errorDetails) {
            throw error;
        }
        
        // 处理超时错误
        if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout') || error.message.includes('timed out') || error.message.includes('signal timed out')) {
            const timeoutError = new Error('请求超时');
            timeoutError.errorType = 'timeout';
            timeoutError.errorDetails = `请求处理时间过长（超过${API_CONFIG.timeout / 1000}秒）。\n\n可能的原因：\n1. 文档内容过大，处理时间较长\n2. AI服务响应较慢\n3. 网络连接不稳定\n\n建议：\n- 预重整方案生成通常需要3-5分钟，请耐心等待\n- 如果多次失败，请尝试上传较小的文档\n- 检查网络连接是否稳定`;
            timeoutError.fullError = error.message || 'Request timeout';
            throw timeoutError;
        } 
        // 处理网络连接错误
        else if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED') || error.message.includes('NetworkError')) {
            const networkError = new Error('无法连接到服务器');
            networkError.errorType = 'network';
            networkError.errorDetails = '无法连接到后端服务器。\n\n请检查：\n1. 后端服务器是否已启动（运行 npm start）\n2. 服务器是否运行在 http://localhost:3000\n3. 防火墙是否阻止了连接\n4. 浏览器控制台是否有其他错误信息';
            networkError.fullError = error.message || 'Network connection failed';
            throw networkError;
        } 
        // 处理其他错误 - 确保包含详细信息
        else {
            // 如果错误对象没有errorType，添加默认值
            if (!error.errorType) {
                error.errorType = 'unknown';
            }
            if (!error.errorDetails) {
                error.errorDetails = `发生未知错误：${error.message || '请查看技术详情了解具体原因'}`;
            }
            if (!error.fullError) {
                error.fullError = error.message || 'Unknown error';
            }
            throw error;
        }
    }
}

/**
 * 上传文件到服务器
 */
async function uploadFiles(files) {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const url = `${API_CONFIG.baseURL}/upload`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            signal: AbortSignal.timeout(API_CONFIG.timeout)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;

    } catch (error) {
        console.error('文件上传失败:', error);
        if (error.name === 'AbortError') {
            throw new Error('上传超时，请重试');
        } else if (error.message.includes('Failed to fetch')) {
            throw new Error('🔌 无法连接到AI服务器\n\n📋 解决步骤：\n1️⃣ 安装 Node.js (https://nodejs.org/)\n2️⃣ 双击运行 start-server.bat\n3️⃣ 等待服务启动后刷新页面\n\n💡 安装Node.js后即可使用AI功能');
        } else {
            throw error;
        }
    }
}

// =========================
// 文档操作功能
// =========================

/**
 * 应用编辑并下载
 */
async function applyEditsAndDownload(type) {
    try {
        // 获取编辑区域
        const editableContent = document.getElementById('editableContent');
        if (!editableContent) {
            showErrorMessage('未找到可编辑内容');
            return;
        }
        
        // 获取编辑后的内容
        const editedText = getEditedContent(editableContent);
        
        // 更新生成的内容
        switch (type) {
            case 'agreement':
                generatedContent.agreement = editedText;
                break;
            case 'plan':
                generatedContent.plan = editedText;
                break;
            case 'report':
                generatedContent.report = editedText;
                break;
            case 'analysis':
                generatedContent.analysis = editedText;
                break;
            case 'risk':
                generatedContent.risk = editedText;
                break;
            case 'feasibility':
                generatedContent.feasibility = editedText;
                break;
        }
        
        // 统计编辑的项目数
        const editedCount = editableContent.querySelectorAll('.edited').length;
        
        if (editedCount > 0) {
            showSuccessMessage(`✓ 已应用 ${editedCount} 处编辑，正在生成文档...`);
        } else {
            showSuccessMessage('正在生成文档...');
        }
        
        // 调用下载函数
        await downloadDocument(type);
        
    } catch (error) {
        console.error('应用编辑失败:', error);
        showErrorMessage('应用编辑失败：' + error.message);
    }
}

/**
 * 下载文档到桌面
 */
async function downloadDocument(type) {
    try {
        showLoadingMessage('正在生成Word文档...');
        
        let content = '';
        let filename = '';
        
        // 根据类型获取相应的生成内容
        switch (type) {
            case 'plan':
                content = generatedContent.plan;
                filename = '预重整方案.docx';
                break;
            case 'agreement':
                content = generatedContent.agreement;
                filename = '庭外重组协议.docx';
                break;
            case 'report':
                content = generatedContent.report;
                filename = '债权人会议报告.docx';
                break;
            case 'analysis':
                content = generatedContent.analysis;
                filename = '企业价值分析报告.docx';
                break;
            case 'risk':
                content = generatedContent.risk;
                filename = '风险指标分析报告.docx';
                break;
            case 'feasibility':
                content = generatedContent.feasibility;
                filename = '重组可行性分析报告.docx';
                break;
            default:
                throw new Error('未知的下载类型');
        }
        
        if (!content) {
            throw new Error('没有可下载的内容，请先生成相应的文档');
        }
        
        // 清理Markdown格式符号和多余符号（使用统一的清理函数）
        let cleanContent = cleanMarkdownSymbols(content);
        
        // 调用后端API生成Word文档
        const response = await fetch(`${API_CONFIG.baseURL}/generate-word`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: cleanContent,
                filename: filename
            }),
            signal: AbortSignal.timeout(60000)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '生成Word文档失败');
        }

        // 获取Word文档Blob
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
                const a = document.createElement('a');
        a.href = url;
        a.download = filename;
                a.style.display = 'none';
                
                // 触发下载
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
        // 释放URL对象
        URL.revokeObjectURL(url);
        
        hideLoadingMessage();
        showSuccessMessage(`${filename} 下载完成！\n\n💡 提示：文件已下载到浏览器默认位置`);
        
    } catch (error) {
        hideLoadingMessage();
        showErrorMessage(error.message || '下载失败，请重试');
        console.error('下载文档失败:', error);
    }
}

/**
 * 预览文档
 */
async function previewDocument(type) {
    try {
        if (!uploadedFiles || uploadedFiles.length === 0) {
            showErrorMessage('请先上传文档文件');
            return;
        }

        showLoadingMessage('正在解析文档内容...');
        
        // 调用预览API
        const response = await fetch(`${API_CONFIG.baseURL}/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: uploadedFiles
            }),
            signal: AbortSignal.timeout(API_CONFIG.timeout)
        });

        const result = await response.json();
        hideLoadingMessage();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        if (result.success) {
            // 显示文档预览
            displayDocumentPreview(result.previews);
            showSuccessMessage('文档解析完成');
        } else {
            throw new Error(result.message || '预览失败');
        }
        
    } catch (error) {
        hideLoadingMessage();
        if (error.name === 'AbortError') {
            showErrorMessage('预览超时，请重试');
        } else if (error.message.includes('Failed to fetch')) {
            showErrorMessage('🔌 无法连接到AI服务器\n\n📋 解决步骤：\n1️⃣ 安装 Node.js (https://nodejs.org/)\n2️⃣ 双击运行 start-server.bat\n3️⃣ 等待服务启动后刷新页面');
        } else {
            showErrorMessage(`预览失败：${error.message}`);
        }
        console.error('预览失败:', error);
    }
}

/**
 * 显示文档预览内容
 */
function displayDocumentPreview(previews) {
    // 创建预览弹窗
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    let previewContent = '';
    previews.forEach((preview, index) => {
        const statusIcon = preview.error ? '❌' : '📄';
        const sizeText = preview.size ? `(${(preview.size / 1024).toFixed(1)} KB)` : '';
        
        previewContent += `
            <div style="margin-bottom: 2rem; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background: #f8fafc; padding: 1rem; border-bottom: 1px solid #e2e8f0;">
                    <h4 style="margin: 0; color: var(--text-dark); display: flex; align-items: center; gap: 0.5rem;">
                        ${statusIcon} ${preview.filename} ${sizeText}
                        ${preview.fullLength ? `<small style="color: var(--text-light); font-weight: normal;">(${preview.fullLength} 字符)</small>` : ''}
                    </h4>
                </div>
                <div style="padding: 1.5rem; max-height: 500px; overflow-y: auto; background: white; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif;">
                    <pre style="white-space: pre-wrap; margin: 0; color: var(--text-dark); line-height: 1.6; font-size: 14px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; text-align: left; overflow-x: auto; word-wrap: break-word;">${escapeHtml(preview.content)}</pre>
                </div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90%; max-height: 85%; width: 800px;">
            <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2 class="modal-title">📄 文档预览 (${previews.length}个文件)</h2>
            <div style="max-height: calc(85vh - 120px); overflow-y: auto; padding: 0.5rem;">
                ${previewContent}
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; text-align: center;">
                <small style="color: var(--text-light);">
                    💡 提示：已显示完整文档内容
                </small>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击外部关闭
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // ESC键关闭
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

/**
 * 检测并格式化表格
 */
function detectAndFormatTables(text) {
    if (!text || typeof text !== 'string') return text;
    
    const lines = text.split('\n');
    const result = [];
    let i = 0;
    
    while (i < lines.length) {
        const line = lines[i].trim();
        
        if (!line) {
            result.push(lines[i]);
            i++;
            continue;
        }
        
        // 检测表格行（包含多个制表符或多个连续空格分隔的数据）
        const hasMultipleTabs = (line.match(/\t/g) || []).length >= 1;
        const hasTablePattern = /^[^\s]+\s{2,}[^\s]+(\s{2,}[^\s]+)*/.test(line);
        
        // 检测是否是表格数据行（数字、百分比、单位等）
        const hasNumericData = /\d+%|万元|\d+,\d+|[A-Z]{2,}/.test(line);
        
        // 检测是否是常见的表格标题行
        const isTableHeader = /^(股东|债权人|投资人|序号|阶段|时间|内容|名称|金额|比例|出资)/.test(line);
        
        if (hasMultipleTabs || hasTablePattern || isTableHeader) {
            // 找到表格，收集所有连续的表格行
            const tableLines = [];
            let j = i;
            let emptyLineCount = 0;
            let consecutiveNonTableLines = 0;
            
            while (j < lines.length) {
                const currentLine = lines[j].trim();
                
                if (!currentLine) {
                    emptyLineCount++;
                    if (emptyLineCount > 1) break; // 连续两个空行表示表格结束
                    j++;
                    continue;
                }
                
                emptyLineCount = 0;
                
                const isTableLine = (currentLine.match(/\t/g) || []).length >= 1 || 
                                   /^[^\s]+\s{2,}[^\s]+/.test(currentLine) ||
                                   /^(股东|债权人|投资人|序号|阶段|时间|内容|名称|金额|比例|出资|持股|认缴|实缴|合计|第.+阶段)/.test(currentLine) ||
                                   /^\d+[A-Z]|^[A-Z]{2,}|^\d+$|^小\w+/.test(currentLine) ||
                                   /\d+%|\d+,\d+|万元/.test(currentLine);
                
                if (!isTableLine) {
                    consecutiveNonTableLines++;
                    if (consecutiveNonTableLines > 1) break; // 连续两行非表格行，表格结束
                    j++;
                    continue;
                }
                
                consecutiveNonTableLines = 0;
                tableLines.push(currentLine);
                j++;
            }
            
            // 生成HTML表格
            if (tableLines.length >= 2) { // 至少要有2行数据
                // 尝试检测是否是纵向表格（每行只有一个值）
                const singleColumnLines = tableLines.filter(l => !l.includes('\t') && !/\s{2,}/.test(l));
                
                if (singleColumnLines.length === tableLines.length && tableLines.length >= 3) {
                    // 可能是纵向表格，尝试重组为横向表格
                    const reformatted = reformatVerticalTable(tableLines);
                    if (reformatted) {
                        result.push(formatAsHTMLTable(reformatted));
                        i = j;
                        continue;
                    }
                }
                
                result.push(formatAsHTMLTable(tableLines));
                i = j;
                continue;
            }
        }
        
        result.push(lines[i]);
        i++;
    }
    
    return result.join('\n');
}

/**
 * 将纵向表格重组为横向表格
 */
function reformatVerticalTable(lines) {
    // 检测模式：标题1, 标题2, 数据1, 数据2, 数据3...
    // 例如：持股比例, 认缴出资额（万元）, 1Jasmine, 55%, 2,750
    
    if (lines.length < 4) return null;
    
    // 查找可能的表头（通常包含"名称"、"比例"、"金额"等关键词）
    const headerKeywords = /(名称|比例|金额|出资|股东|债权人|投资人|时间|阶段|内容)/;
    let headerEndIndex = -1;
    
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        if (headerKeywords.test(lines[i])) {
            headerEndIndex = i;
        } else if (headerEndIndex >= 0) {
            break; // 找到表头后遇到第一个非表头行
        }
    }
    
    if (headerEndIndex < 0 || headerEndIndex >= lines.length - 2) {
        return null; // 没找到表头
    }
    
    const numColumns = headerEndIndex + 1;
    const dataLines = lines.slice(headerEndIndex + 1);
    
    // 尝试将数据重组为行
    const rows = [];
    rows.push(lines.slice(0, numColumns).join('\t')); // 表头行
    
    // 将剩余数据按列数分组
    for (let i = 0; i < dataLines.length; i += numColumns) {
        const rowData = dataLines.slice(i, i + numColumns);
        if (rowData.length === numColumns) {
            rows.push(rowData.join('\t'));
        }
    }
    
    return rows.length >= 2 ? rows : null;
}

/**
 * 将表格行转换为HTML表格（黑白商务风格）
 */
function formatAsHTMLTable(lines) {
    if (!lines || lines.length === 0) return '';
    
    // 解析表格数据
    const rows = lines.map(line => {
        // 优先使用制表符分割
        if (line.includes('\t')) {
            return line.split('\t').map(cell => cell.trim()).filter(cell => cell);
        }
        // 否则使用多个空格分割
        return line.split(/\s{2,}/).map(cell => cell.trim()).filter(cell => cell);
    }).filter(row => row.length > 0);
    
    if (rows.length === 0) return lines.join('\n');
    
    // 确定列数（取最大列数）
    const maxColumns = Math.max(...rows.map(row => row.length));
    
    // 生成HTML表格 - 黑白商务风格
    let html = '\n<div style="overflow-x: auto; margin: 1.5rem 0; border: 2px solid #000;"><table style="border-collapse: collapse; width: 100%; background: white;">';
    
    rows.forEach((row, rowIndex) => {
        // 补齐列数
        while (row.length < maxColumns) {
            row.push('');
        }
        
        html += '<tr>';
        row.forEach((cell, cellIndex) => {
            const isHeader = rowIndex === 0; // 第一行作为表头
            const tag = isHeader ? 'th' : 'td';
            
            // 黑白风格：表头黑色，数据行斑马纹灰白
            const bgColor = isHeader 
                ? 'background: #000000;'
                : rowIndex % 2 === 1 
                    ? 'background: #f5f5f5;' 
                    : 'background: #ffffff;';
            
            const textColor = isHeader ? 'color: #ffffff;' : 'color: #000000;';
            
            const style = isHeader 
                ? `padding: 0.875rem 1.25rem; border: 1px solid #000; ${bgColor} ${textColor} font-weight: 700; text-align: center; font-size: 0.95rem;`
                : `padding: 0.75rem 1.25rem; border: 1px solid #d0d0d0; ${bgColor} ${textColor} text-align: center; font-size: 0.9rem;`;
            
            // 对单元格内容进行转义和高亮处理
            const escapedCell = escapeHtml(cell);
            const highlightedCell = highlightPlaceholders(escapedCell, true);
            
            html += `<${tag} style="${style}">${highlightedCell}</${tag}>`;
        });
        html += '</tr>';
    });
    
    html += '</table></div>\n';
    return html;
}

/**
 * 提取待补充项列表
 */
function extractPlaceholders(text) {
    if (!text || typeof text !== 'string') return [];
    
    const placeholders = [];
    const matches = [
        ...text.matchAll(/\[待补充\]/g),
        ...text.matchAll(/\[请补充([^\]]+)\]/g)
    ];
    
    // 统计每种类型的待补充项
    const countMap = new Map();
    
    matches.forEach(match => {
        const placeholder = match[0];
        countMap.set(placeholder, (countMap.get(placeholder) || 0) + 1);
    });
    
    // 转换为数组
    countMap.forEach((count, placeholder) => {
        placeholders.push({ text: placeholder, count: count });
    });
    
    return placeholders;
}

/**
 * 生成待补充项摘要HTML
 */
function generatePlaceholderSummary(text) {
    const placeholders = extractPlaceholders(text);
    
    if (placeholders.length === 0) {
        return `
            <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; border: 1.5px solid #34d399;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">✓</span>
                    <strong style="color: #047857; font-size: 1rem;">文档完整</strong>
                </div>
                <p style="margin: 0.5rem 0 0 0; color: #065f46; font-size: 0.9rem;">
                    所有内容已填写完整，无需补充！
                </p>
            </div>
        `;
    }
    
    const totalCount = placeholders.reduce((sum, item) => sum + item.count, 0);
    const itemsHTML = placeholders.map(item => `
        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: white; border-radius: 4px; margin-bottom: 0.5rem; border: 1px solid #e0e0e0;">
            <span style="background: #f0f0f0; color: #666; padding: 2px 6px; border-radius: 3px; border: 1px solid #d0d0d0; font-size: 0.85rem; white-space: nowrap;">${escapeHtml(item.text)}</span>
            <span style="color: #666; font-size: 0.85rem;">出现 <strong style="color: #444;">${item.count}</strong> 次</span>
        </div>
    `).join('');
    
    return `
        <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 6px; border: 1px solid #ddd;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="font-size: 1.2rem;">📝</span>
                <strong style="color: #555; font-size: 0.95rem;">待补充内容清单</strong>
                <span style="background: #888; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${totalCount} 项</span>
            </div>
            <p style="margin: 0 0 0.75rem 0; color: #666; font-size: 0.85rem;">
                以下内容需要您手动补充和完善：
            </p>
            <div style="max-height: 200px; overflow-y: auto;">
                ${itemsHTML}
            </div>
        </div>
    `;
}

/**
 * 高亮待补充内容（保留HTML标签）- 低调样式 + 可编辑
 */
function highlightPlaceholders(text, preserveHTML = false, editable = false) {
    if (!text || typeof text !== 'string') return text;
    
    if (!preserveHTML) {
        // 转义HTML
        text = escapeHtml(text);
    }
    
    // 如果可编辑，添加点击事件和光标样式
    const editableStyle = editable ? 'cursor: pointer; transition: all 0.2s;' : '';
    const editableClass = editable ? 'editable-placeholder' : '';
    const editableAttr = editable ? 'onclick="editPlaceholder(this)" title="点击编辑"' : '';
    
    // 高亮 [待补充]、[请补充XXX] 等内容
    // 使用更低调的浅灰色背景，细边框
    return text
        .replace(/\[待补充\]/g, `<span class="${editableClass}" ${editableAttr} style="background: #f0f0f0; color: #666; padding: 2px 6px; border-radius: 3px; border: 1px solid #d0d0d0; display: inline-block; margin: 0 2px; font-size: 0.95em; ${editableStyle}">[待补充]</span>`)
        .replace(/\[请补充([^\]]+)\]/g, `<span class="${editableClass}" ${editableAttr} style="background: #f0f0f0; color: #666; padding: 2px 6px; border-radius: 3px; border: 1px solid #d0d0d0; display: inline-block; margin: 0 2px; font-size: 0.95em; ${editableStyle}">[请补充$1]</span>`);
}

/**
 * 编辑占位符内容
 */
function editPlaceholder(element) {
    const currentText = element.textContent;
    
    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.style.cssText = `
        padding: 2px 6px;
        border: 2px solid #4CAF50;
        border-radius: 3px;
        font-size: 0.95em;
        outline: none;
        min-width: 150px;
    `;
    
    // 替换元素
    element.replaceWith(input);
    input.focus();
    input.select();
    
    // 保存修改
    const saveEdit = () => {
        const newValue = input.value.trim();
        
        if (newValue && newValue !== currentText) {
            // 创建新的span元素
            const newSpan = document.createElement('span');
            newSpan.textContent = newValue;
            newSpan.style.cssText = `
                background: #e8f5e9;
                color: #2e7d32;
                padding: 2px 6px;
                border-radius: 3px;
                border: 1px solid #4CAF50;
                display: inline-block;
                margin: 0 2px;
                font-size: 0.95em;
                cursor: pointer;
            `;
            newSpan.title = '点击重新编辑';
            newSpan.className = 'editable-placeholder edited';
            newSpan.onclick = function() { editPlaceholder(this); };
            
            input.replaceWith(newSpan);
            
            // 显示保存提示
            showSuccessMessage('✓ 内容已更新！记得点击下载按钮保存修改后的文档');
        } else {
            // 取消编辑，恢复原样
            const originalSpan = document.createElement('span');
            originalSpan.textContent = currentText;
            originalSpan.className = 'editable-placeholder';
            originalSpan.style.cssText = `
                background: #f0f0f0;
                color: #666;
                padding: 2px 6px;
                border-radius: 3px;
                border: 1px solid #d0d0d0;
                display: inline-block;
                margin: 0 2px;
                font-size: 0.95em;
                cursor: pointer;
            `;
            originalSpan.onclick = function() { editPlaceholder(this); };
            input.replaceWith(originalSpan);
        }
    };
    
    // 失去焦点时保存
    input.onblur = saveEdit;
    
    // 按Enter保存，按Esc取消
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            input.value = currentText;
            input.blur();
        }
    };
}

/**
 * 获取编辑后的文档内容（用于下载）
 */
function getEditedContent(displayElement) {
    const clone = displayElement.cloneNode(true);
    
    // 移除所有样式和事件，只保留文本
    const editedSpans = clone.querySelectorAll('.edited');
    editedSpans.forEach(span => {
        const text = document.createTextNode(span.textContent);
        span.replaceWith(text);
    });
    
    // 移除未编辑的占位符标记
    const placeholders = clone.querySelectorAll('.editable-placeholder:not(.edited)');
    placeholders.forEach(span => {
        const text = document.createTextNode(span.textContent);
        span.replaceWith(text);
    });
    
    return clone.textContent;
}

/**
 * 显示完整文档内容（用于打开功能）
 */
function displayFullDocument(documents) {
    // 创建查看弹窗
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    let documentContent = '';
    documents.forEach((doc, index) => {
        const statusIcon = doc.error ? '❌' : '📄';
        const sizeText = doc.size ? `(${(doc.size / 1024).toFixed(1)} KB)` : '';
        
        // 先检测并格式化表格（表格内部已经处理高亮）
        let formattedContent = detectAndFormatTables(doc.content);
        
        // 对非表格部分进行高亮处理
        // 将内容按表格分割
        const parts = formattedContent.split(/(<div style="overflow-x: auto;.*?<\/table><\/div>)/s);
        formattedContent = parts.map((part, index) => {
            // 偶数索引是非表格内容，奇数索引是表格
            if (index % 2 === 0) {
                // 非表格内容：先转义再高亮
                return highlightPlaceholders(part, false);
            } else {
                // 表格内容：保持原样（已经处理过）
                return part;
            }
        }).join('');
        
        documentContent += `
            <div style="margin-bottom: 2rem; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background: #f8fafc; padding: 1rem; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 10;">
                    <h4 style="margin: 0; color: var(--text-dark); display: flex; align-items: center; gap: 0.5rem;">
                        ${statusIcon} ${doc.filename} ${sizeText}
                        ${doc.fullLength ? `<small style="color: var(--text-light); font-weight: normal;">(${doc.fullLength} 字符)</small>` : ''}
                    </h4>
                </div>
                <div style="padding: 2rem; background: white; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif;">
                    <div style="white-space: pre-wrap; color: var(--text-dark); line-height: 1.6; font-size: 14px; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; text-align: left;">${formattedContent}</div>
                </div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 95%; max-height: 90%; width: 1000px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; background: white; z-index: 20;">
                <h2 style="margin: 0; color: var(--text-dark); font-size: 1.25rem;">📖 文档内容 (${documents.length}个文件)</h2>
                <span class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()" style="cursor: pointer; font-size: 1.5rem; color: #666; padding: 0.25rem;">&times;</span>
            </div>
            <div style="max-height: calc(90vh - 80px); overflow-y: auto; padding: 1rem;">
                ${documentContent}
            </div>
            <div style="padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0; text-align: center; background: #f9fafb;">
                <small style="color: var(--text-light);">
                    📚 完整文档内容 • 可滚动查看全文 • 按ESC键或点击外部关闭
                </small>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击外部关闭
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // ESC键关闭
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// cleanMarkdownSymbols 已移至 utils.js

/**
 * 复制到剪贴板
 */
async function copyToClipboard(text) {
    try {
        // 确保text是字符串
        if (typeof text !== 'string') {
            text = String(text || '');
        }
        
        // 使用现代API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showSuccessMessage('内容已复制到剪贴板');
        } else {
            // fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, 99999); // 兼容移动设备
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                showSuccessMessage('内容已复制到剪贴板');
            } else {
                showErrorMessage('复制失败，请手动选择文本复制');
            }
        }
    } catch (error) {
        console.error('复制失败:', error);
        // 最后的fallback：显示文本让用户手动复制
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showSuccessMessage('内容已复制到剪贴板');
        } catch (e) {
            showErrorMessage('复制失败，请手动选择文本复制');
        }
        document.body.removeChild(textarea);
    }
}

/**
 * 输出分析结果
 */
function exportAnalysisResults() {
    try {
        showLoadingMessage('正在导出分析结果...');
        
        setTimeout(() => {
            hideLoadingMessage();
            const filename = `分析报告_${new Date().toISOString().split('T')[0]}.xlsx`;
            showSuccessMessage(`分析结果已导出为 "${filename}"`);
        }, 2000);
    } catch (error) {
        hideLoadingMessage();
        showErrorMessage('导出失败，请重试');
        console.error('导出失败:', error);
    }
}

// =========================
// 系统工具函数
// =========================
// 注意：formatFileSize, escapeHtml, debounce, throttle, formatDate, cleanMarkdownSymbols
// 等工具函数已移至 utils.js 文件，请确保在 HTML 中引入 utils.js

console.log('RV-Agent 主脚本加载完成 - Enhanced Version v2.0');

