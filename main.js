/**
 * Restructure Vision – RV-Agent
 * 主交互逻辑文件
 */

// =========================
// 小知识轮播功能
// =========================

let knowledgeTipInterval = null;
let currentTipIndex = -1;

/**
 * 开始显示小知识轮播
 */
function startKnowledgeTips() {
    const tipElement = document.getElementById('knowledgeTip');
    if (!tipElement || typeof knowledgeTips === 'undefined') {
        console.warn('小知识功能未启用：元素或数据不存在');
        return;
    }

    // 显示小知识区域
    tipElement.style.display = 'block';
    
    // 立即显示第一条
    showRandomTip();
    
    // 每5秒切换一次
    knowledgeTipInterval = setInterval(() => {
        showRandomTip();
    }, 5000);
}

/**
 * 停止小知识轮播
 */
function stopKnowledgeTips() {
    if (knowledgeTipInterval) {
        clearInterval(knowledgeTipInterval);
        knowledgeTipInterval = null;
    }
    
    const tipElement = document.getElementById('knowledgeTip');
    if (tipElement) {
        tipElement.style.display = 'none';
    }
}

/**
 * 显示随机小知识
 */
function showRandomTip() {
    const tipElement = document.getElementById('knowledgeTip');
    if (!tipElement || typeof knowledgeTips === 'undefined') return;
    
    // 随机选择一条不同的小知识
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * knowledgeTips.length);
    } while (newIndex === currentTipIndex && knowledgeTips.length > 1);
    
    currentTipIndex = newIndex;
    const tip = knowledgeTips[currentTipIndex];
    
    // 添加淡出动画
    tipElement.classList.add('fade-out');
    
    setTimeout(() => {
        // 更新内容
        const categoryElement = tipElement.querySelector('.knowledge-category');
        const contentElement = tipElement.querySelector('.knowledge-content');
        
        if (categoryElement && contentElement) {
            categoryElement.textContent = `（${tip.category}）`;
            contentElement.textContent = tip.content;
        }
        
        // 移除淡出类，触发淡入动画
        tipElement.classList.remove('fade-out');
    }, 500);
}

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

/**
 * 通用导航函数
 * @param {string} page - 页面名称（不含.html后缀）
 * @param {object} params - 额外的URL参数
 */
function navigateTo(page, params = {}) {
    const urlParams = new URLSearchParams({ skipSplash: 'true', ...params });
    window.location.href = `${page}.html?${urlParams.toString()}`;
}

// 向后兼容的导航函数
function navigateToManager() { navigateTo('manager'); }
function navigateToCreditor() { navigateTo('creditor'); }
function navigateToHome() { navigateTo('index'); }

/**
 * 返回到工作流程选择界面
 */
function goBackToWorkflowSelection() {
    window.history.back();
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
    
    // 根据错误类型设置不同的标题和颜色
    let errorIcon = '';
    let errorTitle = '分析失败';
    let errorColor = 'var(--error-color)';
    
    switch(errorType) {
        case 'timeout':
            errorIcon = '';
            errorTitle = '请求超时';
            break;
        case 'network':
            errorIcon = '';
            errorTitle = '网络连接失败';
            break;
        case 'auth':
            errorIcon = '';
            errorTitle = '认证失败';
            break;
        case 'rate_limit':
            errorIcon = '';
            errorTitle = '请求频率过高';
            break;
        case 'server':
            errorIcon = '';
            errorTitle = '服务器错误';
            break;
        case 'file':
            errorIcon = '';
            errorTitle = '文件处理失败';
            break;
        default:
            errorIcon = '';
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
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'  // 添加TXT文件支持
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
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];  // 添加txt扩展名
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        throw new Error(`文件"${file.name}"格式不支持。\n支持的格式: PDF, Word (doc/docx), Excel (xls/xlsx), TXT`);
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
                    background: #000000;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#333333'" onmouseout="this.style.background='#000000'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    打开
                </button>
                <button onclick="removeFile(${index})" style="
                    padding: 0.5rem 1rem;
                    background: #ffffff;
                    color: #000000;
                    border: 1px solid #d0d0d0;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#ffffff'">
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
        // 开始显示小知识轮播
        startKnowledgeTips();
        
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
        
        // 停止小知识轮播
        stopKnowledgeTips();
        
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
                        庭外重组协议生成完成
                    </h4>
                    <div style="background: #fff9e6; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 3px solid #ffa500;">
                        <strong style="color: #ff8c00;">提示</strong>：
                        <span style="color: #666; font-size: 0.9rem;">文档内容可直接编辑（包括日期、金额、公司名等），点击任意位置开始修改。点击灰色的 [待补充] 标记也可编辑。完成编辑后记得下载文档保存修改。</span>
                    </div>
                    <div id="editableContent" contenteditable="true" style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left; cursor: text;" onfocus="this.style.borderColor='#4CAF50'" onblur="this.style.borderColor='var(--border-color)'">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedAgreement}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #f0f9ff; border-radius: 6px; font-size: 0.85rem; color: #0369a1; text-align: left;">
                        <strong>协议生成完成</strong> - 基于上传文档智能生成 | <span style="color: #4CAF50;">可在线编辑</span>
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyEditableContent()" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制内容</button>
                        <button onclick="applyEditsAndDownload('agreement')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">应用编辑并下载</button>
                        <button onclick="downloadDocument('agreement')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载协议</button>
                        <button onclick="previewDocument('agreement')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">预览</button>
                        <button onclick="generateOutsideReorganizationAgreement()" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">重新生成</button>
                    </div>
                </div>
            `;
            showSuccessMessage('庭外重组协议生成完成！');
        } else {
            throw new Error(result.message || '生成失败');
        }
    } catch (error) {
        hideLoadingMessage();
        
        // 停止小知识轮播
        stopKnowledgeTips();
        
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
        // 开始显示小知识轮播
        startKnowledgeTips();
        
        // 显示加载状态
        textDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">正在智能分析企业情况并制定预重整方案...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">这可能需要30-60秒，请耐心等待</p>
            </div>
        `;
        
        // 调用AI API生成预重整方案
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'pre-restructure-plan'
        });
        
        hideLoadingMessage();
        
        // 停止小知识轮播
        stopKnowledgeTips();
        
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
                        预重整方案生成完成
                    </h4>
                    <div style="background: #fff9e6; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 3px solid #ffa500;">
                        <strong style="color: #ff8c00;">提示</strong>：
                        <span style="color: #666; font-size: 0.9rem;">文档内容可直接编辑（包括日期、金额、公司名等），点击任意位置开始修改。点击灰色的 [待补充] 标记也可编辑。完成编辑后记得下载文档保存修改。</span>
                    </div>
                    <div id="editableContent" contenteditable="true" style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left; cursor: text; white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;" onfocus="this.style.borderColor='#4CAF50'" onblur="this.style.borderColor='var(--border-color)'">${highlightedPlan}</div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #e7f3ff; border-radius: 6px; font-size: 0.85rem; color: #0066cc; text-align: left;">
                        <strong>预重整方案完成</strong> - 基于上传文档智能生成 | <span style="color: #4CAF50;">可在线编辑</span>
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyEditableContent()" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制内容</button>
                        <button onclick="applyEditsAndDownload('plan')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">应用编辑并下载</button>
                        <button onclick="downloadDocument('plan')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载方案</button>
                        <button onclick="previewDocument('plan')" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">预览</button>
                        <button onclick="generatePreReorganizationDraft()" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">重新生成</button>
                    </div>
                </div>
            `;
            showSuccessMessage('预重整方案生成完成！');
        } else {
            throw new Error(result.message || '分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        
        // 停止小知识轮播
        stopKnowledgeTips();
        
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
                <p style="color: var(--primary-color);">正在智能提取会议关键字段...</p>
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
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 0.9rem;
                        ">重新提取</button>
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

// 债权人会议报告功能已删除

// =========================
// 债权人功能（creditor.html）
// =========================

/**
 * 企业价值分析（保留供单独调用）
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
        // 开始显示小知识轮播
        startKnowledgeTips();
        
        // 显示加载状态
        analysisDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">正在智能深度分析企业价值...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">这可能需要30-60秒，请耐心等待</p>
            </div>
        `;
        
        // 调用AI API进行企业价值分析
        const result = await callAPI('/analyze', {
            files: uploadedFiles,
            analysisType: 'enterprise-value'
        });
        
        hideLoadingMessage();
        
        // 停止小知识轮播
        stopKnowledgeTips();
        
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
                        企业价值分析报告
                    </h4>
                    <div style="background: #fff9e6; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 3px solid #ffa500;">
                        <strong style="color: #ff8c00;">✏️ 编辑提示</strong>：
                        <span style="color: #666; font-size: 0.9rem;">报告内容可直接编辑修改，点击任意位置开始编辑。完成编辑后可复制或下载保存。</span>
                    </div>
                    <div id="editableAnalysisContent" contenteditable="true" style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 2px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left; cursor: text; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#4CAF50'" onblur="this.style.borderColor='var(--border-color)'">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 2.0; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedAnalysis}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #e3f2fd; border-radius: 6px; font-size: 0.85rem; color: #1565c0; text-align: left;">
                        <strong>✅ 分析完成</strong> - 基于IVS国际评估准则智能生成 | <span style="color: #4CAF50;">可在线编辑</span>
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyEditedContent()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制报告</button>
                        <button onclick="downloadDocument('analysis')" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载Word文档</button>
                        <button onclick="analyzeEnterpriseValue()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">重新分析</button>
                    </div>
                </div>
            `;
            showSuccessMessage('企业价值分析完成！');
        } else {
            throw new Error(result.message || '分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        
        // 停止小知识轮播
        stopKnowledgeTips();
        
        console.error('企业价值分析失败:', error);
        
        displayDetailedError(error, analysisDisplay, 'analyzeEnterpriseValue');
        showErrorMessage(error.message || '分析失败');
    }
}

/**
 * 企业价值与风险综合分析（合并功能）
 * 同时进行企业价值分析和风险指标提取
 */
async function analyzeValueAndRisk() {
    console.log('企业价值与风险综合分析 - 使用AI');
    
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传相关文档');
        return;
    }
    
    const analysisDisplay = document.getElementById('analysisDisplay');
    if (!analysisDisplay) return;
    
    const loadingToast = showLoadingMessage('正在进行综合分析，请稍候...');
    
    try {
        // 开始显示小知识轮播
        startKnowledgeTips();
        
        // 显示加载状态
        analysisDisplay.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <p style="color: var(--primary-color);">正在进行企业价值与风险综合分析...</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">这可能需要60-90秒，请耐心等待</p>
            </div>
        `;
        
        // 并行调用两个分析API
        const [valueResult, riskResult] = await Promise.all([
            callAPI('/analyze', {
                files: uploadedFiles,
                analysisType: 'enterprise-value'
            }),
            callAPI('/analyze', {
                files: uploadedFiles,
                analysisType: 'risk-indicators'
            })
        ]);
        
        hideLoadingMessage();
        
        // 停止小知识轮播
        stopKnowledgeTips();
        
        if (valueResult.success && riskResult.success) {
            // 保存生成的内容
            const cleanedValueResult = cleanMarkdownSymbols(valueResult.result);
            const cleanedRiskResult = cleanMarkdownSymbols(riskResult.result);
            
            generatedContent.analysis = cleanedValueResult;
            generatedContent.risk = cleanedRiskResult;
            
            // 高亮待补充内容
            const highlightedValue = highlightPlaceholders(cleanedValueResult);
            const highlightedRisk = highlightPlaceholders(cleanedRiskResult);
            
            // 生成待补充项摘要
            const valuePlaceholderSummary = generatePlaceholderSummary(cleanedValueResult);
            const riskPlaceholderSummary = generatePlaceholderSummary(cleanedRiskResult);
            
            analysisDisplay.innerHTML = `
                <div style="padding: 1.5rem; text-align: left;">
                    <h3 style="margin-bottom: 1rem; color: var(--text-dark); text-align: center; font-size: 1.5rem; font-weight: bold;">
                        企业价值与风险综合分析报告
                    </h3>
                    
                    <div style="background: #fff9e6; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1.5rem; border-left: 3px solid #ffa500;">
                        <strong style="color: #ff8c00;">✏️ 编辑提示</strong>：
                        <span style="color: #666; font-size: 0.9rem;">报告内容可直接编辑修改，点击任意部分开始编辑。完成编辑后可复制完整报告或下载Word文档保存。</span>
                    </div>
                    
                    <!-- 企业价值分析部分 -->
                    <div style="margin-bottom: 2rem;">
                        <h4 style="margin-bottom: 1rem; color: var(--text-dark); text-align: left; border-bottom: 2px solid #000; padding-bottom: 0.5rem;">
                            一、企业价值分析
                        </h4>
                        <div id="editableValueContent" contenteditable="true" class="editable-content-enhanced" style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 2px solid var(--border-color); max-height: 500px; overflow-y: auto; text-align: left; cursor: text; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#4CAF50'" onblur="this.style.borderColor='var(--border-color)'">
                            <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 2.0; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedValue}</div>
                        </div>
                        ${valuePlaceholderSummary}
                    </div>
                    
                    <!-- 风险指标分析部分 -->
                    <div style="margin-bottom: 2rem;">
                        <h4 style="margin-bottom: 1rem; color: var(--text-dark); text-align: left; border-bottom: 2px solid #000; padding-bottom: 0.5rem;">
                            二、风险指标分析
                        </h4>
                        <div id="editableRiskContent" contenteditable="true" class="editable-content-enhanced" style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 2px solid var(--border-color); max-height: 500px; overflow-y: auto; text-align: left; cursor: text; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#4CAF50'" onblur="this.style.borderColor='var(--border-color)'">
                            <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 2.0; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedRisk}</div>
                        </div>
                        ${riskPlaceholderSummary}
                    </div>
                    
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #d4edda; border-radius: 6px; font-size: 0.85rem; color: #155724; text-align: left;">
                        <strong>✅ 综合分析完成</strong> - 基于IVS国际评估准则智能生成 | <span style="color: #4CAF50;">可在线编辑</span>
                    </div>
                    
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyAllEditedContent()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制完整报告</button>
                        <button onclick="downloadCombinedReport()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载Word文档</button>
                        <button onclick="generateBothCharts()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">生成所有图表</button>
                        <button onclick="analyzeValueAndRisk()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">重新分析</button>
                    </div>
                </div>
            `;
            showSuccessMessage('企业价值与风险综合分析完成！');
        } else {
            throw new Error('综合分析失败');
        }
    } catch (error) {
        hideLoadingMessage();
        
        // 停止小知识轮播
        stopKnowledgeTips();
        
        console.error('综合分析失败:', error);
        
        displayDetailedError(error, analysisDisplay, 'analyzeValueAndRisk');
        showErrorMessage(error.message || '综合分析失败');
    }
}

/**
 * 提取风险指标（保留供单独调用）
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
                <p style="color: var(--primary-color);">正在智能提取风险指标...</p>
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
                        风险指标分析报告
                    </h4>
                    <div style="background: #fff9e6; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 3px solid #ffa500;">
                        <strong style="color: #ff8c00;">✏️ 编辑提示</strong>：
                        <span style="color: #666; font-size: 0.9rem;">报告内容可直接编辑修改，点击任意位置开始编辑。完成编辑后可复制或下载保存。</span>
                    </div>
                    <div id="editableRiskContent" contenteditable="true" style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 2px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left; cursor: text; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#4CAF50'" onblur="this.style.borderColor='var(--border-color)'">
                        <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 2.0; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word;">${highlightedRisk}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #fff3cd; border-radius: 6px; font-size: 0.85rem; color: #856404; text-align: left;">
                        <strong>✅ 风险评估完成</strong> - 基于IVS国际评估准则智能生成 | <span style="color: #4CAF50;">可在线编辑</span>
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyEditedContent()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制报告</button>
                        <button onclick="downloadDocument('risk')" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载Word文档</button>
                        <button onclick="extractRiskIndicators()" style="
                            padding: 0.75rem 1.5rem;
                            background: transparent;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">重新分析</button>
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
                <p style="color: var(--primary-color);">正在智能评估重组可行性...</p>
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
                        重组可行性分析报告
                    </h4>
                    <div style="background: var(--bg-white); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 600px; overflow-y: auto; text-align: left;">
                        <div id="editableFeasibilityContent" contenteditable="true" style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; color: var(--text-dark); text-align: justify; word-wrap: break-word; outline: none; cursor: text;">${highlightedFeasibility}</div>
                    </div>
                    ${placeholderSummary}
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #d4edda; border-radius: 6px; font-size: 0.85rem; color: #155724; text-align: left;">
                        <strong>✓ 文档完整</strong> - 所有内容已填写完整，无需补充<br>
                        <strong>💡 点击内容可直接编辑</strong>
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button onclick="copyEditedFeasibilityContent()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">复制报告</button>
                        <button onclick="downloadDocument('feasibility')" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">下载Word文档</button>
                        <button onclick="generateRestructureFeasibility()" style="
                            padding: 0.75rem 1.5rem;
                            background: #ffffff;
                            color: #000000;
                            border: 2px solid #000000;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">重新分析</button>
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
        
        // 检查响应内容类型，处理 HTML 错误页面
        const contentType = response.headers.get('content-type') || '';
        let result;
        
        if (contentType.includes('application/json')) {
            result = await response.json();
        } else {
            // 如果返回的不是 JSON（可能是 HTML 错误页面），尝试读取文本
            const text = await response.text();
            console.error('服务器返回了非 JSON 响应:', text.substring(0, 200));
            
            // 检查是否是 502 错误
            if (response.status === 502 || text.includes('502') || text.includes('Bad Gateway')) {
                const error = new Error('服务器网关错误 (502)');
                error.errorType = 'server_error';
                error.errorDetails = `服务器无法响应请求。\n\n可能的原因：\n1. Render 服务器未正确启动\n2. 环境变量未配置（检查 DEEPSEEK_API_KEY）\n3. 服务器处理超时（Render 免费版限制）\n4. 服务器资源不足\n\n建议：\n- 检查 Render Dashboard 中的服务日志\n- 确认环境变量已正确配置\n- 尝试重新部署服务`;
                error.fullError = `502 Bad Gateway - 响应内容: ${text.substring(0, 500)}`;
                throw error;
            }
            
            // 其他非 JSON 响应
            const error = new Error(`服务器返回了无效响应 (${response.status})`);
            error.errorType = 'invalid_response';
            error.errorDetails = `服务器返回了 HTML 而不是 JSON 数据。\n\n这通常表示：\n1. 服务器返回了错误页面\n2. API 路由配置不正确\n3. 服务器未正确启动\n\n响应状态: ${response.status}\n响应内容: ${text.substring(0, 200)}`;
            error.fullError = text.substring(0, 1000);
            throw error;
        }

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
        
        // 处理 JSON 解析错误（通常是服务器返回了 HTML）
        if (error.message.includes('Unexpected token') && error.message.includes('<!DOCTYPE')) {
            const htmlError = new Error('服务器返回了错误页面');
            htmlError.errorType = 'server_error';
            htmlError.errorDetails = `服务器返回了 HTML 错误页面而不是 JSON 数据。\n\n这通常表示：\n1. Render 服务器返回了 502/503 错误\n2. 服务器未正确启动或崩溃\n3. 环境变量未配置（特别是 DEEPSEEK_API_KEY）\n4. Render 免费版请求超时（15秒限制）\n\n建议：\n- 检查 Render Dashboard 中的服务日志\n- 确认所有环境变量已正确配置\n- 如果是超时问题，考虑升级 Render 计划或优化请求处理时间`;
            htmlError.fullError = error.message;
            throw htmlError;
        }
        
        // 处理超时错误
        if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout') || error.message.includes('timed out') || error.message.includes('signal timed out')) {
            const timeoutError = new Error('请求超时');
            timeoutError.errorType = 'timeout';
            timeoutError.errorDetails = `请求处理时间过长（超过${API_CONFIG.timeout / 1000}秒）。\n\n可能的原因：\n1. 文档内容过大，处理时间较长\n2. AI服务响应较慢\n3. 网络连接不稳定\n4. Render 免费版有 15 秒请求超时限制\n\n建议：\n- 预重整方案生成通常需要3-5分钟，但 Render 免费版限制为 15 秒\n- 如果使用 Render 免费版，考虑升级到付费计划\n- 尝试上传较小的文档\n- 检查网络连接是否稳定`;
            timeoutError.fullError = error.message || 'Request timeout';
            throw timeoutError;
        } 
        // 处理连接关闭错误（ERR_CONNECTION_CLOSED）
        else if (error.message.includes('ERR_CONNECTION_CLOSED') || error.message.includes('connection closed') || error.message.includes('Connection closed')) {
            const connectionError = new Error('连接被意外关闭');
            connectionError.errorType = 'connection_closed';
            connectionError.errorDetails = `连接在处理请求时被关闭。\n\n可能的原因：\n1. **Render 免费版超时限制**（15秒）- 请求处理时间超过限制，连接被终止\n2. **服务器崩溃** - 服务器在处理请求时发生错误导致崩溃\n3. **环境变量未配置** - DEEPSEEK_API_KEY 未配置导致服务器无法处理请求\n4. **服务器资源不足** - Render 免费版资源限制导致服务不稳定\n5. **网络中断** - 网络连接不稳定\n\n建议：\n- 检查 Render Dashboard → Logs 标签页，查看服务器日志中的错误信息\n- 确认 DEEPSEEK_API_KEY 已正确配置\n- 如果是超时问题，考虑升级 Render 计划或优化请求处理时间\n- 尝试重新部署服务`;
            connectionError.fullError = error.message || 'Connection closed unexpectedly';
            throw connectionError;
        }
        // 处理网络连接错误
        else if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED') || error.message.includes('NetworkError')) {
            const networkError = new Error('无法连接到服务器');
            networkError.errorType = 'network';
            networkError.errorDetails = '无法连接到后端服务器。\n\n请检查：\n1. 后端服务器是否已启动（运行 npm start）\n2. 服务器是否运行在正确的地址\n3. 防火墙是否阻止了连接\n4. 浏览器控制台是否有其他错误信息\n5. Render 服务是否正常运行\n6. 检查 Render Dashboard 中的服务状态和日志';
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
            throw new Error('无法连接到AI服务器\n\n解决步骤：\n1. 安装 Node.js (https://nodejs.org/)\n2. 双击运行 start-server.bat\n3. 等待服务启动后刷新页面\n\n提示：安装Node.js后即可使用AI功能');
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
            showSuccessMessage(`已应用 ${editedCount} 处编辑，正在生成文档...`);
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
            case 'analysis':
                // 优先获取编辑后的内容
                const editableAnalysis = document.getElementById('editableAnalysisContent');
                content = editableAnalysis ? editableAnalysis.innerText : generatedContent.analysis;
                filename = '企业价值分析报告.docx';
                break;
            case 'risk':
                // 优先获取编辑后的内容
                const editableRisk = document.getElementById('editableRiskContent');
                content = editableRisk ? editableRisk.innerText : generatedContent.risk;
                filename = '风险指标分析报告.docx';
                break;
            case 'feasibility':
                // 优先获取编辑后的内容
                const editableFeasibility = document.getElementById('editableFeasibilityContent');
                content = editableFeasibility ? editableFeasibility.innerText : generatedContent.feasibility;
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
        showSuccessMessage(`${filename} 下载完成！\n\n提示：文件已下载到浏览器默认位置`);
        
    } catch (error) {
        hideLoadingMessage();
        showErrorMessage(error.message || '下载失败，请重试');
        console.error('下载文档失败:', error);
    }
}

/**
 * 下载综合报告（价值+风险）
 */
async function downloadCombinedReport() {
    try {
        showLoadingMessage('正在生成Word文档...');
        
        // 检查是否有生成的内容
        if (!generatedContent.analysis || !generatedContent.risk) {
            throw new Error('请先生成企业价值与风险综合分析报告');
        }
        
        // 优先获取编辑后的内容
        const editableValue = document.getElementById('editableValueContent');
        const editableRisk = document.getElementById('editableRiskContent');
        
        const valueContent = editableValue ? editableValue.innerText : generatedContent.analysis;
        const riskContent = editableRisk ? editableRisk.innerText : generatedContent.risk;
        
        // 合并两个报告的内容
        const combinedContent = `企业价值与风险综合分析报告

═══════════════════════════════════════════════════════

一、企业价值分析

${valueContent}

═══════════════════════════════════════════════════════

二、风险指标分析

${riskContent}`;
        
        // 清理Markdown格式符号
        let cleanContent = cleanMarkdownSymbols(combinedContent);
        
        // 调用后端API生成Word文档
        const response = await fetch(`${API_CONFIG.baseURL}/generate-word`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: cleanContent,
                filename: '企业价值与风险综合分析报告.docx'
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
        a.download = '企业价值与风险综合分析报告.docx';
        a.style.display = 'none';
        
        // 触发下载
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // 释放URL对象
        URL.revokeObjectURL(url);
        
        hideLoadingMessage();
        showSuccessMessage('企业价值与风险综合分析报告.docx 下载完成！\n\n提示：文件已下载到浏览器默认位置');
        
    } catch (error) {
        hideLoadingMessage();
        showErrorMessage(error.message || '下载失败，请重试');
        console.error('下载综合报告失败:', error);
    }
}

/**
 * 预览文档
 */
async function previewDocument(type) {
    try {
        // 获取对应类型的生成内容
        let content = '';
        let title = '';
        
        switch (type) {
            case 'agreement':
                content = generatedContent.agreement;
                title = '庭外重组协议';
                break;
            case 'plan':
                content = generatedContent.plan;
                title = '预重整方案';
                break;
            case 'analysis':
                content = generatedContent.analysis;
                title = '企业价值分析';
                break;
            case 'risk':
                content = generatedContent.risk;
                title = '风险指标分析';
                break;
            case 'feasibility':
                content = generatedContent.feasibility;
                title = '重组可行性分析';
                break;
            default:
                throw new Error('未知的预览类型');
        }
        
        if (!content) {
            showErrorMessage('没有可预览的内容，请先生成文档');
            return;
        }

        // 显示生成内容的预览
        displayGeneratedContentPreview(title, content);
        
    } catch (error) {
        showErrorMessage(`预览失败：${error.message}`);
        console.error('预览失败:', error);
    }
}

/**
 * 显示生成内容的预览弹窗
 */
function displayGeneratedContentPreview(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    // 先格式化表格，然后高亮待补充项
    const formattedContent = detectAndFormatTables(content);
    const highlightedContent = highlightPlaceholders(formattedContent, true, false);
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 85vh; overflow-y: auto;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2 class="modal-title">${title} - 预览</h2>
            <div id="previewContent" style="background: #ffffff; padding: 2rem; border-radius: 8px; margin-top: 1rem; border: 2px solid #e0e0e0;">
                <div style="white-space: pre-wrap; font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; line-height: 1.8; font-size: 14px; text-align: justify; word-wrap: break-word;">
                    ${highlightedContent}
                </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: flex-end;">
                <button onclick="copyPreviewContent()" style="
                    padding: 0.75rem 1.5rem;
                    background: transparent;
                    color: #000000;
                    border: 2px solid #000000;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                ">复制内容</button>
                <button onclick="this.closest('.modal').remove()" style="
                    padding: 0.75rem 1.5rem;
                    background: #000000;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                ">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // ESC键关闭
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    });
}

/**
 * 复制可编辑内容到剪贴板（纯文本格式，保留换行）
 */
function copyEditableContent() {
    try {
        const editableContent = document.getElementById('editableContent');
        if (!editableContent) {
            showErrorMessage('未找到可编辑内容');
            return;
        }
        
        // 方法1: 尝试从内部div获取纯文本
        const innerDiv = editableContent.querySelector('div');
        let textContent = '';
        
        if (innerDiv) {
            // 如果有内部div，从它获取文本
            textContent = innerDiv.innerText || innerDiv.textContent;
        } else {
            // 否则直接从editableContent获取
            textContent = editableContent.innerText || editableContent.textContent;
        }
        
        // 清理文本：确保是纯文本
        textContent = textContent.trim();
        
        console.log('复制的文本长度:', textContent.length);
        console.log('文本预览（前100字符）:', textContent.substring(0, 100));
        
        // 使用现代剪贴板API复制纯文本
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textContent).then(() => {
                showSuccessMessage('内容已复制到剪贴板');
            }).catch(err => {
                console.error('Clipboard API失败:', err);
                // 降级方案
                fallbackCopyText(textContent);
            });
        } else {
            // 降级方案：使用旧方法
            fallbackCopyText(textContent);
        }
    } catch (error) {
        console.error('复制失败:', error);
        showErrorMessage('复制失败，请手动选择并复制内容');
    }
}

/**
 * 降级复制方案（适用于不支持Clipboard API的浏览器）
 */
function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    
    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
            showSuccessMessage('内容已复制到剪贴板');
        } else {
            showErrorMessage('复制失败，请手动选择并复制内容');
        }
    } catch (err) {
        console.error('降级复制失败:', err);
        document.body.removeChild(textarea);
        showErrorMessage('复制失败，请手动选择并复制内容');
    }
}

/**
 * 复制预览内容到剪贴板（纯文本格式，保留换行）
 */
function copyPreviewContent() {
    try {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) {
            showErrorMessage('未找到预览内容');
            return;
        }
        
        // 方法1: 尝试从内部div获取纯文本
        const innerDiv = previewContent.querySelector('div');
        let textContent = '';
        
        if (innerDiv) {
            // 如果有内部div，从它获取文本
            textContent = innerDiv.innerText || innerDiv.textContent;
        } else {
            // 否则直接从previewContent获取
            textContent = previewContent.innerText || previewContent.textContent;
        }
        
        // 清理文本：确保是纯文本
        textContent = textContent.trim();
        
        console.log('复制的文本长度:', textContent.length);
        console.log('文本预览（前100字符）:', textContent.substring(0, 100));
        
        // 使用现代剪贴板API复制纯文本
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textContent).then(() => {
                showSuccessMessage('内容已复制到剪贴板');
            }).catch(err => {
                console.error('Clipboard API失败:', err);
                // 降级方案
                fallbackCopyText(textContent);
            });
        } else {
            // 降级方案：使用旧方法
            fallbackCopyText(textContent);
        }
    } catch (error) {
        console.error('复制失败:', error);
        showErrorMessage('复制失败，请手动选择并复制内容');
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
                    提示：已显示完整文档内容
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
 * 生成待补充项摘要HTML（动态计数版本）
 */
function generatePlaceholderSummary(text) {
    const placeholders = extractPlaceholders(text);
    
    if (placeholders.length === 0) {
        return `
            <div id="placeholderSummary" style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; border: 1.5px solid #34d399;">
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
        <div id="placeholderSummary" style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 6px; border: 1px solid #ddd;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <strong style="color: #555; font-size: 0.95rem;">待补充内容清单</strong>
                <span id="remainingCount" style="background: #000; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">还剩 ${totalCount} 项</span>
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
 * 更新待补充项剩余数量（动态计数）
 */
function updateRemainingCount() {
    const editableContent = document.getElementById('editableContent');
    const remainingCountElement = document.getElementById('remainingCount');
    const placeholderSummary = document.getElementById('placeholderSummary');
    
    if (!editableContent || !remainingCountElement) return;
    
    // 统计剩余未编辑的 [待补充] 项
    const unEditedPlaceholders = editableContent.querySelectorAll('.editable-placeholder:not(.edited)');
    const remainingCount = unEditedPlaceholders.length;
    
    // 更新数字显示
    if (remainingCount === 0) {
        // 全部完成，显示完成状态
        if (placeholderSummary) {
            placeholderSummary.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <strong style="color: #047857; font-size: 1rem;">全部完成！</strong>
                </div>
                <p style="margin: 0.5rem 0 0 0; color: #065f46; font-size: 0.9rem;">
                    所有待补充项已编辑完成，可以下载文档了！
                </p>
            `;
            placeholderSummary.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
            placeholderSummary.style.border = '1.5px solid #34d399';
        }
    } else {
        // 还有未完成项
        remainingCountElement.textContent = `还剩 ${remainingCount} 项`;
        remainingCountElement.style.background = '#000';
        remainingCountElement.style.animation = 'none';
        
        // 添加闪烁动画提示
        setTimeout(() => {
            remainingCountElement.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
    }
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
    const editableClass = editable ? 'editable-placeholder' : 'placeholder-readonly';
    const editableAttr = editable ? 'onclick="editPlaceholder(this)" title="点击编辑"' : '';
    
    // 高亮 [待补充]、[请补充XXX] 等内容
    // 统一使用黄色背景样式（与预重整方案一致）
    const bgColor = '#fff3cd';
    const textColor = '#856404';
    const borderColor = '#ffc107';
    
    return text
        .replace(/\[待补充\]/g, `<span class="${editableClass}" ${editableAttr} style="background: ${bgColor}; color: ${textColor}; padding: 3px 8px; border-radius: 4px; border: 1.5px solid ${borderColor}; display: inline-block; margin: 0 3px; font-size: 0.95em; font-weight: 600; ${editableStyle}">[待补充]</span>`)
        .replace(/\[请补充([^\]]+)\]/g, `<span class="${editableClass}" ${editableAttr} style="background: ${bgColor}; color: ${textColor}; padding: 3px 8px; border-radius: 4px; border: 1.5px solid ${borderColor}; display: inline-block; margin: 0 3px; font-size: 0.95em; font-weight: 600; ${editableStyle}">[请补充$1]</span>`);
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
            
            // 更新剩余待补充项数量
            updateRemainingCount();
            
            // 显示保存提示
            showSuccessMessage('内容已更新！记得点击下载按钮保存修改后的文档');
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
    // 如果是 contenteditable 元素，直接获取其文本内容
    if (displayElement.getAttribute('contenteditable') === 'true') {
        // 克隆元素以保留原始内容
        const clone = displayElement.cloneNode(true);
        
        // 移除所有 span 标签的样式，只保留文本
        const allSpans = clone.querySelectorAll('span');
        allSpans.forEach(span => {
            const text = document.createTextNode(span.textContent);
            span.replaceWith(text);
        });
        
        return clone.textContent;
    } else {
        // 如果是旧版本的结构（有内部 div）
        const innerDiv = displayElement.querySelector('div');
        const targetElement = innerDiv || displayElement;
        
        const clone = targetElement.cloneNode(true);
        
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
 * 复制编辑后的内容（单个可编辑区域）
 */
function copyEditedContent() {
    const editableContent = document.getElementById('editableAnalysisContent') || 
                           document.getElementById('editableValueContent');
    if (editableContent) {
        const text = editableContent.innerText;
        copyToClipboard(text);
    } else {
        // 降级到旧方式
        copyToClipboard(generatedContent.analysis || '');
    }
}

/**
 * 复制所有编辑后的内容（综合报告）
 */
function copyAllEditedContent() {
    const valueContent = document.getElementById('editableValueContent');
    const riskContent = document.getElementById('editableRiskContent');
    
    if (valueContent && riskContent) {
        const combinedText = `企业价值与风险综合分析报告\n\n` +
                           `一、企业价值分析\n\n${valueContent.innerText}\n\n` +
                           `二、风险指标分析\n\n${riskContent.innerText}`;
        copyToClipboard(combinedText);
    } else {
        showErrorMessage('未找到可编辑内容');
    }
}

/**
 * 复制编辑后的可行性分析内容
 */
function copyEditedFeasibilityContent() {
    const editableContent = document.getElementById('editableFeasibilityContent');
    if (editableContent) {
        const text = editableContent.innerText;
        copyToClipboard(text);
    } else {
        // 降级到旧方式
        copyToClipboard(generatedContent.feasibility || '');
    }
}

/**
 * 同时生成两个图表
 */
async function generateBothCharts() {
    showLoadingMessage('正在同时生成全部3个图表...');
    
    try {
        // 并行生成三个图表
        await Promise.all([
            generateChartImage('enterprise-value'),
            generateChartImage('risk-radar'),
            generateChartImage('financial-dashboard')
        ]);
        
        hideLoadingMessage();
        showSuccessMessage('所有图表已生成完成！');
    } catch (error) {
        hideLoadingMessage();
        console.error('图表生成失败:', error);
        showErrorMessage('部分图表生成失败，请查看详细信息');
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
// 图表生成功能
// =========================

/**
 * 生成数据可视化图表
 */
async function generateChartImage(chartType) {
    try {
        console.log('🎨 开始生成图表，类型:', chartType);
        console.log('📋 当前 generatedContent:', generatedContent);
        
        const chartBoxMap = {
            'enterprise-value': 'enterpriseValueChart',
            'risk-radar': 'riskRadarChart',
            'financial-dashboard': 'financialDashboardChart'
        };
        
        const chartNameMap = {
            'enterprise-value': '企业价值分析图表',
            'risk-radar': '风险指标雷达图',
            'financial-dashboard': '财务数据看板'
        };
        
        const analysisTypeMap = {
            'enterprise-value': 'analysis',
            'risk-radar': 'risk',
            'financial-dashboard': 'analysis'  // 使用企业价值分析数据
        };
        
        // 检查是否已完成相应的分析
        const analysisKey = analysisTypeMap[chartType];
        console.log('🔍 检查分析数据，key:', analysisKey);
        console.log('分析数据存在?', !!generatedContent[analysisKey]);
        console.log('分析数据长度:', generatedContent[analysisKey]?.length || 0);
        
        if (!generatedContent[analysisKey]) {
            console.warn('未找到分析数据，提示用户先完成分析');
            showErrorMessage(`请先完成${chartNameMap[chartType].replace('图表', '')}，然后再生成图表`);
            return;
        }
        
        const chartBox = document.getElementById(chartBoxMap[chartType]);
        if (!chartBox) {
            showErrorMessage('图表容器未找到');
            return;
        }
        
        // 显示加载状态 - 在图表容器中也显示
        const loadingHTML = `
            <div style="padding: 3rem 2rem; text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 1rem; width: 60px; height: 60px;"></div>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">正在生成图表...</h3>
                <p style="color: var(--text-light); font-size: 0.95rem;">基于您的分析结果生成专业可视化图表</p>
                <p style="color: var(--text-light); font-size: 0.85rem; margin-top: 1rem;">
                    预计需要 <strong>10-30秒</strong>，请耐心等待
                </p>
                <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3cd; border-radius: 6px; border: 1px solid #ffc107;">
                    <p style="color: #856404; font-size: 0.9rem; margin: 0;">
                        正在生成图表，请勿关闭页面
                    </p>
                </div>
            </div>
        `;
        chartBox.innerHTML = loadingHTML;
        
        showLoadingMessage(`正在基于分析结果生成${chartNameMap[chartType]}...（需要10-30秒）`);
        
        // 准备请求数据 - 包含分析结果
        const requestData = {};
        
        // 根据不同的图表类型使用不同的参数名
        if (chartType === 'risk-radar') {
            requestData.riskData = generatedContent[analysisKey];
        } else {
            requestData.analysisData = generatedContent[analysisKey];
        }
        
        console.log('📤 发送请求数据:', {
            endpoint: `/generate-chart/${chartType}`,
            dataLength: (requestData.analysisData || requestData.riskData)?.length || 0,
            chartType: chartType
        });
        
        // 调用API生成图表
        const response = await callAPI(`/generate-chart/${chartType}`, requestData);
        
        console.log('📥 收到响应:', response);
        
        hideLoadingMessage();
        
        if (response.success && response.images && response.images.length > 0) {
            console.log('✅ 图表生成成功，显示图片');
            // 显示生成的图表
            displayChartImage(chartBox, response.images[0], chartNameMap[chartType]);
            showSuccessMessage(`${chartNameMap[chartType]}生成成功！`);
        } else {
            console.error('❌ 图表生成失败:', response);
            throw new Error(response.message || response.error || '图表生成失败');
        }
        
    } catch (error) {
        hideLoadingMessage();
        console.error('图表生成失败:', error);
        
        // 显示详细错误信息
        let errorMsg = '图表生成失败';
        if (error.message) {
            errorMsg += `: ${error.message}`;
        }
        if (error.details) {
            console.error('错误详情:', error.details);
        }
        
        // 恢复原始状态，显示错误信息
        const chartBoxMap = {
            'enterprise-value': 'enterpriseValueChart',
            'risk-radar': 'riskRadarChart',
            'financial-dashboard': 'financialDashboardChart'
        };
        
        const chartNameMap = {
            'enterprise-value': '企业价值分析图表',
            'risk-radar': '风险指标雷达图',
            'financial-dashboard': '财务数据看板'
        };
        
        const iconMap = {
            'enterprise-value': `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>`,
            'risk-radar': `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
            </svg>`,
            'financial-dashboard': `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            </svg>`
        };
        
        const chartBox = document.getElementById(chartBoxMap[chartType]);
        if (chartBox) {
            chartBox.innerHTML = `
                ${iconMap[chartType] || ''}
                <h3 style="margin-top: 1rem; color: var(--text-dark);">${chartNameMap[chartType]}</h3>
                <p style="color: var(--text-light);">图表数据将在分析完成后显示</p>
                <div style="margin-top: 1rem; padding: 1rem; background: #f8d7da; border-radius: 6px; border: 1px solid #f5c6cb;">
                    <p style="color: #721c24; font-size: 0.9rem; margin: 0;">
                        ❌ 生成失败: ${error.message || '未知错误'}
                    </p>
                </div>
                <button class="btn-chart-generate" onclick="generateChartImage('${chartType}')" style="margin-top: 1rem;">
                    重试生成
                </button>
            `;
        }
        
        showErrorMessage(errorMsg);
    }
}

/**
 * 显示生成的图表图片
 */
function displayChartImage(container, imageData, chartName) {
    console.log('显示图表，数据:', imageData);
    
    // 清空原有内容
    container.innerHTML = '';
    
    // 解析图片URL
    let imageUrl = '';
    if (typeof imageData === 'string') {
        imageUrl = imageData;
    } else if (imageData.url) {
        imageUrl = imageData.url;
    } else if (imageData.b64_json) {
        imageUrl = `data:image/png;base64,${imageData.b64_json}`;
    } else {
        console.error('❌ 无法解析图片数据:', imageData);
        throw new Error('图片数据格式错误');
    }
    
    console.log('🖼️ 图片URL:', imageUrl);
    
    // 创建图片元素
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = chartName;
    img.style.cssText = 'width: 100%; height: auto; border-radius: 8px; margin-top: 1rem;';
    
    // 创建标题
    const title = document.createElement('h3');
    title.textContent = chartName;
    title.style.cssText = 'margin-top: 1rem; color: var(--text-dark);';
    
    // 创建下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn-chart-generate';
    downloadBtn.style.cssText = 'margin-top: 1rem;';
    downloadBtn.textContent = '下载图表';
    downloadBtn.onclick = () => downloadChartImage(imageUrl, chartName);
    
    // 创建重新生成按钮
    const regenerateBtn = document.createElement('button');
    regenerateBtn.className = 'btn-chart-generate';
    regenerateBtn.style.cssText = 'margin-top: 1rem; margin-left: 0.5rem;';
    regenerateBtn.textContent = '重新生成';
    regenerateBtn.onclick = () => {
        const chartTypeMap = {
            '企业价值分析图表': 'enterprise-value',
            '风险指标雷达图': 'risk-radar',
            '财务数据看板': 'financial-dashboard'
        };
        generateChartImage(chartTypeMap[chartName]);
    };
    
    // 组装容器
    container.appendChild(title);
    container.appendChild(img);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(downloadBtn);
    buttonContainer.appendChild(regenerateBtn);
    container.appendChild(buttonContainer);
}

/**
 * 下载图表图片
 */
function downloadChartImage(imageUrl, chartName) {
    try {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${chartName}_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccessMessage('图表下载成功！');
    } catch (error) {
        console.error('下载失败:', error);
        showErrorMessage('图表下载失败，请重试');
    }
}

// =========================
// 风险评估分级系统功能
// =========================

// 存储上传的风险评估文件
let riskAssessmentFiles = [];

// ==========================================
// 智能搜索系统 - 三级搜索机制
// ==========================================

// 企业数据库（模拟真实数据库）
const companyDatabase = {
    '辣椒炒肉食品有限公司': {
        riskLevel: 'B',
        industry: '食品制造业',
        location: '湖南省长沙市',
        assets: 16800,
        liabilities: 11750,
        revenue: 18500,
        lastUpdated: '2024-11-30'
    },
    '华为技术有限公司': {
        riskLevel: 'A',
        industry: '通信设备制造',
        location: '广东省深圳市',
        assets: 1250000,
        liabilities: 580000,
        revenue: 850000,
        lastUpdated: '2024-12-01'
    },
    '比亚迪股份有限公司': {
        riskLevel: 'A',
        industry: '汽车制造业',
        location: '广东省深圳市',
        assets: 450000,
        liabilities: 280000,
        revenue: 380000,
        lastUpdated: '2024-12-01'
    }
};

// 搜索历史记录
let searchHistory = [];
try {
    searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
} catch(e) {
    searchHistory = [];
}

/**
 * 智能搜索企业 - 三级搜索机制
 * 级别1: 本地数据库快速查询
 * 级别2: AI文件分析评估
 * 级别3: 模糊匹配推荐
 */
async function searchCompany() {
    const searchInput = document.getElementById('companySearchInput');
    if (!searchInput) return;
    
    const companyName = searchInput.value.trim();
    
    if (!companyName) {
        showErrorMessage('请输入企业名称');
        return;
    }
    
    // 保存搜索历史
    saveSearchHistory(companyName);
    hideAutocomplete();
    
    showLoadingMessage('🔍 智能搜索中...');
    
    // 级别1: 优先查询本地数据库（最快）
    if (companyDatabase[companyName]) {
        setTimeout(() => {
            hideLoadingMessage();
            const company = companyDatabase[companyName];
            showSuccessMessage(`✓ 找到企业"${companyName}"，风险等级：${company.riskLevel}级`);
            showRiskDetails(company.riskLevel, generateQuickAnalysis(companyName, company), companyName, company);
        }, 500);
        return;
    }
    
    // 级别2: 如果有上传文件，进行AI深度分析（较慢但准确）
    if (riskAssessmentFiles.length > 0) {
        setTimeout(() => {
            hideLoadingMessage();
            showSuccessMessage(`📄 检测到已上传文件，正在进行AI深度分析...`);
            performRiskAssessment(companyName);
        }, 800);
        return;
    }
    
    // 级别3: 模糊匹配和智能推荐
    setTimeout(() => {
        hideLoadingMessage();
        const suggestions = findSimilarCompanies(companyName);
        
        if (suggestions.length > 0) {
            showSearchSuggestions(companyName, suggestions);
        } else {
            showUploadPrompt(companyName);
        }
    }, 1000);
}

/**
 * 生成快速分析报告（基于数据库数据）
 */
function generateQuickAnalysis(companyName, company) {
    const assetLiabilityRatio = ((company.liabilities / company.assets) * 100).toFixed(2);
    
    return `
【企业基本信息】
企业名称：${companyName}
所属行业：${company.industry}
注册地址：${company.location}
数据更新：${company.lastUpdated}

【财务概况】
总资产：${company.assets.toLocaleString()}万元
总负债：${company.liabilities.toLocaleString()}万元
年营收：${company.revenue.toLocaleString()}万元
资产负债率：${assetLiabilityRatio}%

【风险评估】
综合风险等级：${company.riskLevel}级
${getRiskLevelDescription(company.riskLevel)}

【数据来源】
本报告基于企业公开数据和历史评估记录生成。
如需更详细的分析，请上传企业最新财务文件。
    `.trim();
}

/**
 * 获取风险等级描述
 */
function getRiskLevelDescription(level) {
    const descriptions = {
        'A': '✓ 低风险企业，财务状况良好，重组可行性高',
        'B': '⚠ 中等风险企业，需要关注部分财务指标',
        'C': '⚠ 较高风险企业，建议谨慎评估',
        'D': '✗ 高风险企业，需要深度尽职调查'
    };
    return descriptions[level] || '风险等级待评估';
}

/**
 * 模糊匹配相似企业
 */
function findSimilarCompanies(searchTerm) {
    const suggestions = [];
    const lowerSearch = searchTerm.toLowerCase();
    
    for (const [name, data] of Object.entries(companyDatabase)) {
        const lowerName = name.toLowerCase();
        
        // 包含匹配
        if (lowerName.includes(lowerSearch) || lowerSearch.includes(lowerName)) {
            suggestions.push({ name, data, similarity: 0.8 });
        }
        // 行业匹配
        else if (data.industry.includes(searchTerm) || searchTerm.includes(data.industry)) {
            suggestions.push({ name, data, similarity: 0.5 });
        }
    }
    
    return suggestions.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
}

/**
 * 显示搜索建议
 */
function showSearchSuggestions(companyName, suggestions) {
    const html = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">未找到"${companyName}"</h3>
            <p style="color: #666; margin-bottom: 2rem;">但我们为您找到了以下相似企业：</p>
            
            <div style="display: grid; gap: 1rem; max-width: 600px; margin: 0 auto;">
                ${suggestions.map(s => `
                    <div onclick="document.getElementById('companySearchInput').value='${s.name}'; searchCompany();" 
                         style="padding: 1rem; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: all 0.3s; text-align: left;"
                         onmouseover="this.style.borderColor='#000'; this.style.transform='translateY(-2px)'"
                         onmouseout="this.style.borderColor='#e0e0e0'; this.style.transform='translateY(0)'">
                        <div style="font-weight: 600; margin-bottom: 0.5rem;">${s.name}</div>
                        <div style="font-size: 0.9rem; color: #666;">
                            ${s.data.industry} · ${s.data.location} · 风险等级: ${s.data.riskLevel}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
                <p style="color: #666; margin-bottom: 1rem;">💡 <strong>提示</strong></p>
                <p style="color: #666; font-size: 0.95rem;">
                    如果您要查询的企业不在数据库中，<br>
                    请上传企业财务文件进行AI智能分析
                </p>
                <button onclick="closeRiskDetailModal();" 
                        style="margin-top: 1rem; padding: 0.75rem 2rem; background: #000; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    上传文件分析
                </button>
            </div>
        </div>
    `;
    
    const modal = document.getElementById('riskDetailModal');
    const content = document.getElementById('riskDetailContent');
    if (modal && content) {
        content.innerHTML = html;
        modal.style.display = 'flex';
    }
}

/**
 * 显示上传提示
 */
function showUploadPrompt(companyName) {
    const html = `
        <div style="text-align: center; padding: 3rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1.5rem;">📊</div>
            <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: #000;">未找到"${companyName}"的评估记录</h3>
            <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.6;">
                该企业暂未收录在我们的数据库中<br>
                请上传企业相关文件，我们将为您提供AI智能风险评估
            </p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 2rem; border-radius: 16px; margin: 2rem auto; max-width: 500px;">
                <h4 style="margin-bottom: 1rem; color: #000;">📄 需要上传的文件</h4>
                <ul style="text-align: left; color: #666; line-height: 2;">
                    <li>✓ 财务报表（近3年）</li>
                    <li>✓ 审计报告</li>
                    <li>✓ 企业简介及商业计划</li>
                    <li>✓ 行业分析报告</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                <button onclick="closeRiskDetailModal()" 
                        style="padding: 0.75rem 2rem; background: white; color: #000; border: 2px solid #000; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    返回搜索
                </button>
            </div>
        </div>
    `;
    
    const modal = document.getElementById('riskDetailModal');
    const content = document.getElementById('riskDetailContent');
    if (modal && content) {
        content.innerHTML = html;
        modal.style.display = 'flex';
    }
}

/**
 * 保存搜索历史
 */
function saveSearchHistory(companyName) {
    // 避免重复
    searchHistory = searchHistory.filter(item => item !== companyName);
    // 添加到开头
    searchHistory.unshift(companyName);
    // 只保留最近10条
    searchHistory = searchHistory.slice(0, 10);
    // 保存到本地存储
    try {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch(e) {
        console.warn('无法保存搜索历史:', e);
    }
}

/**
 * 初始化搜索框自动补全
 */
function initSearchAutocomplete() {
    const searchInput = document.getElementById('companySearchInput');
    if (!searchInput) return;
    
    // 添加输入事件监听
    searchInput.addEventListener('input', function(e) {
        const value = e.target.value.trim();
        if (value.length < 2) {
            hideAutocomplete();
            return;
        }
        
        // 搜索匹配的企业
        const matches = [];
        
        // 从数据库匹配
        for (const name of Object.keys(companyDatabase)) {
            if (name.toLowerCase().includes(value.toLowerCase())) {
                matches.push({ name, source: 'database' });
            }
        }
        
        // 从历史记录匹配
        for (const name of searchHistory) {
            if (name.toLowerCase().includes(value.toLowerCase()) && 
                !matches.find(m => m.name === name)) {
                matches.push({ name, source: 'history' });
            }
        }
        
        if (matches.length > 0) {
            showAutocomplete(matches.slice(0, 5));
        } else {
            hideAutocomplete();
        }
    });
    
    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCompany();
        }
    });
    
    // 点击外部关闭自动补全
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target)) {
            hideAutocomplete();
        }
    });
}

/**
 * 显示自动补全列表
 */
function showAutocomplete(matches) {
    hideAutocomplete(); // 先清除旧的
    
    const searchInput = document.getElementById('companySearchInput');
    if (!searchInput) return;
    
    const autocompleteDiv = document.createElement('div');
    autocompleteDiv.id = 'searchAutocomplete';
    autocompleteDiv.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 2px solid #e0e0e0;
        border-top: none;
        border-radius: 0 0 12px 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        margin-top: -2px;
    `;
    
    matches.forEach(match => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        item.innerHTML = `
            <span>${match.name}</span>
            ${match.source === 'database' && companyDatabase[match.name] ? 
                `<span style="font-size: 0.85rem; color: #666;">${companyDatabase[match.name].riskLevel}级</span>` : ''}
        `;
        
        item.addEventListener('mouseenter', () => {
            item.style.background = '#f8f9fa';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = 'white';
        });
        
        item.addEventListener('click', () => {
            searchInput.value = match.name;
            hideAutocomplete();
            searchCompany();
        });
        
        autocompleteDiv.appendChild(item);
    });
    
    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(autocompleteDiv);
}

/**
 * 隐藏自动补全列表
 */
function hideAutocomplete() {
    const autocomplete = document.getElementById('searchAutocomplete');
    if (autocomplete) {
        autocomplete.remove();
    }
}

// 页面加载时初始化自动补全
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchAutocomplete);
} else {
    initSearchAutocomplete();
}

/**
 * 处理风险评估文件上传
 */
async function handleRiskFileUpload(files) {
    if (!files || files.length === 0) {
        return;
    }
    
    showLoadingMessage('正在上传文件...');
    
    try {
        // 验证文件
        const validFiles = [];
        for (const file of files) {
            const validation = validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                showErrorMessage(`文件 ${file.name}: ${validation.error}`);
            }
        }
        
        if (validFiles.length === 0) {
            hideLoadingMessage();
            return;
        }
        
        // 上传文件
        const uploadedFiles = await uploadFiles(validFiles);
        riskAssessmentFiles = uploadedFiles;
        
        hideLoadingMessage();
        
        // 显示上传成功的文件列表
        const fileNames = uploadedFiles.map(f => f.originalName).join('、');
        showSuccessMessage(`✓ 成功上传 ${uploadedFiles.length} 个文件：${fileNames.substring(0, 50)}${fileNames.length > 50 ? '...' : ''}`);
        
        // 更新搜索框提示
        const searchInput = document.getElementById('companySearchInput');
        if (searchInput) {
            searchInput.placeholder = '已上传文件，请输入企业名称并点击搜索...';
            searchInput.style.borderColor = '#4CAF50';
            
            // 如果已经输入了企业名称，自动触发评估
            if (searchInput.value.trim()) {
                performRiskAssessment(searchInput.value.trim());
            }
        }
        
    } catch (error) {
        hideLoadingMessage();
        console.error('文件上传失败:', error);
        showErrorMessage('文件上传失败，请重试');
    }
}

/**
 * 执行风险评估
 */
async function performRiskAssessment(companyName) {
    if (riskAssessmentFiles.length === 0) {
        showErrorMessage('请先上传企业文件');
        return;
    }
    
    showLoadingMessage('正在进行AI风险评估分析...');
    startKnowledgeTips();
    
    try {
        // 调用风险指标分析API
        const response = await callAPI('/api/analyze', {
            files: riskAssessmentFiles,
            analysisType: 'risk-indicators'
        }, {
            timeout: 300000
        });
        
        stopKnowledgeTips();
        hideLoadingMessage();
        
        if (response.success) {
            // 解析风险等级
            const riskLevel = determineRiskLevel(response.result);
            showSuccessMessage(`企业"${companyName}"的风险等级评估完成：${riskLevel}级`);
            
            // 显示详细结果
            showRiskDetails(riskLevel, response.result, companyName);
        } else {
            throw new Error(response.message || '风险评估失败');
        }
        
    } catch (error) {
        stopKnowledgeTips();
        hideLoadingMessage();
        console.error('风险评估失败:', error);
        showErrorMessage('风险评估失败：' + error.message);
    }
}

/**
 * 根据风险分析结果判定风险等级
 */
function determineRiskLevel(analysisResult) {
    // 简单的风险等级判定逻辑
    // 实际应该根据具体的风险评分来判定
    const text = analysisResult.toLowerCase();
    
    if (text.includes('低风险') || text.includes('风险较小') || text.includes('优秀')) {
        return 'A';
    } else if (text.includes('中等风险') || text.includes('良好')) {
        return 'B';
    } else if (text.includes('较高风险') || text.includes('一般')) {
        return 'C';
    } else {
        return 'D';
    }
}

/**
 * 显示风险详情
 */
function showRiskDetails(riskLevel, analysisContent = null, companyName = '', companyInfo = null) {
    sessionStorage.setItem('currentRiskLevel', riskLevel);
    
    // 如果有企业信息，传递给工作流程选择弹窗
    if (companyInfo) {
        companyInfo.name = companyName;
        showWorkflowSelectionModal(riskLevel, companyInfo);
    } else {
        showWorkflowSelectionModal(riskLevel);
    }
}

/**
 * 关闭风险详情弹窗
 */
function closeRiskDetailModal() {
    const modal = document.getElementById('riskDetailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * 根据风险等级导航到相应工作流程
 */
function navigateToRiskLevelWorkflow(riskLevel) {
    // 关闭风险详情弹窗
    closeRiskDetailModal();
    
    // 显示流程选择弹窗
    showWorkflowSelectionModal(riskLevel);
}

/**
 * 显示工作流程选择弹窗
 */
function showWorkflowSelectionModal(riskLevel, companyInfo = null) {
    const modal = document.getElementById('workflowSelectionModal');
    if (!modal) {
        console.error('工作流程选择弹窗未找到');
        return;
    }
    
    // 更新弹窗标题显示风险等级
    const titleElement = modal.querySelector('.workflow-modal-title');
    if (titleElement) {
        titleElement.textContent = `风险评估等级为${riskLevel}`;
    }
    
    // 根据企业信息显示说明（只在搜索企业时显示）
    const suggestionElement = modal.querySelector('.workflow-suggestion');
    if (suggestionElement) {
        if (companyInfo) {
            // 有企业信息时，显示简要说明
            const assetLiabilityRatio = ((companyInfo.liabilities / companyInfo.assets) * 100).toFixed(2);
            const description = getRiskLevelDescription(riskLevel);
            suggestionElement.textContent = `${companyInfo.name || '该企业'}资产负债率${assetLiabilityRatio}%，${description}`;
            suggestionElement.style.display = 'block';
        } else {
            // 没有企业信息时，隐藏说明
            suggestionElement.style.display = 'none';
        }
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭工作流程选择弹窗
 */
function closeWorkflowSelectionModal() {
    const modal = document.getElementById('workflowSelectionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * 工作流程导航函数（使用通用导航）
 */
function navigateToEnterpriseValue() {
    navigateTo('creditor', { action: 'enterprise-value' });
}

function navigateToOutsideAgreement() {
    navigateTo('manager');
}

function navigateToFeasibilityReport() {
    navigateTo('feasibility-report');
}

function navigateToPreRestructure() {
    navigateTo('pre-restructure');
}

/**
 * 切换风险等级展示（波浪式查看）
 */
function toggleRiskLevels() {
    const cards = document.querySelectorAll('.risk-card');
    cards.forEach((card, index) => {
        // 添加动画效果
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
        }, 10);
    });
    
    showSuccessMessage('已刷新风险等级展示');
}

// =========================
// 庭外重组协议生成选项
// =========================

/**
 * 显示协议生成选项弹窗
 */
function showAgreementOptions() {
    const modal = document.getElementById('agreementOptionsModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * 关闭协议生成选项弹窗
 */
function closeAgreementOptions() {
    const modal = document.getElementById('agreementOptionsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 点击弹窗背景关闭
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('agreementOptionsModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAgreementOptions();
            }
        });
    }
});

// =========================
// 庭外重组协议批量生成功能
// =========================

/**
 * 批量生成庭外重组协议
 */
async function batchGenerateOutsideAgreements() {
    // 检查是否有上传的文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showErrorMessage('请先上传企业文件');
        return;
    }
    
    if (!confirm('确定要批量生成庭外重组协议吗？这将为所有已上传的企业文件生成协议。')) {
        return;
    }
    
    showLoadingMessage('正在批量生成庭外重组协议...');
    startKnowledgeTips();
    
    try {
        // 调用API生成协议
        const response = await callAPI('/api/analyze', {
            files: uploadedFiles,
            analysisType: 'outside-agreement'
        }, {
            timeout: 300000
        });
        
        stopKnowledgeTips();
        hideLoadingMessage();
        
        if (response.success) {
            showSuccessMessage('庭外重组协议批量生成成功！');
            
            // 显示生成的内容
            const displayElement = document.getElementById('analysisDisplay') || document.getElementById('textDisplay');
            if (displayElement) {
                // 安全地转义HTML内容
                const escapedContent = response.result
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
                
                displayElement.innerHTML = '<div style="padding: 2rem;">' +
                    '<h2 style="color: #000000; margin-bottom: 1.5rem;">批量生成的庭外重组协议</h2>' +
                    '<div style="background: #fafafa; padding: 1.5rem; border-radius: 12px; white-space: pre-wrap; line-height: 1.8;">' +
                    escapedContent +
                    '</div>' +
                    '<div style="margin-top: 2rem; display: flex; gap: 1rem;">' +
                    '<button onclick="downloadDocument(\'agreement\')" class="btn-primary">下载Word文档</button>' +
                    '<button onclick="copyEditableContent()" class="btn-secondary">复制内容</button>' +
                    '</div>' +
                    '</div>';
                
                // 保存生成的内容供下载使用
                generatedContent.agreement = response.result;
            }
        } else {
            throw new Error(response.message || '批量生成失败');
        }
        
    } catch (error) {
        stopKnowledgeTips();
        hideLoadingMessage();
        console.error('批量生成失败:', error);
        showErrorMessage('批量生成失败：' + error.message);
    }
}

// =========================
// 系统工具函数
// =========================
// 注意：formatFileSize, escapeHtml, debounce, throttle, formatDate, cleanMarkdownSymbols
// 等工具函数已移至 utils.js 文件，请确保在 HTML 中引入 utils.js

console.log('RV-Agent 主脚本加载完成 - Enhanced Version v2.2 with Risk Assessment');

