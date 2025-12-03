/**
 * 📤 文件上传增强模块
 * 提供拖拽上传、进度条、文件预览等功能
 */

// =========================
// 拖拽上传功能
// =========================

/**
 * 初始化拖拽上传区域
 */
function initDragDropUpload() {
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea) return;

    // 防止默认的拖拽行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // 添加拖拽效果
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('drag-over');
        }, false);
    });

    // 处理文件拖拽
    uploadArea.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    handleFiles(files);
}

// =========================
// 文件上传进度条
// =========================

/**
 * 显示上传进度
 */
function showUploadProgress(fileName, progress) {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;

    let progressElement = document.getElementById(`progress-${fileName}`);
    
    if (!progressElement) {
        // 创建进度条元素
        progressElement = document.createElement('div');
        progressElement.id = `progress-${fileName}`;
        progressElement.className = 'upload-progress-item';
        progressElement.innerHTML = `
            <div class="upload-file-info">
                <span class="upload-file-icon"></span>
                <span class="upload-file-name">${fileName}</span>
            </div>
            <div class="upload-progress-bar-container">
                <div class="upload-progress-bar" style="width: 0%">
                    <span class="upload-progress-text">0%</span>
                </div>
            </div>
        `;
        fileList.appendChild(progressElement);
    }

    // 更新进度
    const progressBar = progressElement.querySelector('.upload-progress-bar');
    const progressText = progressElement.querySelector('.upload-progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
        
        // 完成时添加成功样式
        if (progress === 100) {
            progressBar.classList.add('complete');
            setTimeout(() => {
                progressElement.classList.add('fade-out');
                setTimeout(() => {
                    progressElement.remove();
                }, 500);
            }, 1000);
        }
    }
}

// =========================
// 文件预览功能
// =========================

/**
 * 生成文件预览卡片
 */
function createFilePreviewCard(file, fileInfo) {
    const card = document.createElement('div');
    card.className = 'file-preview-card';
    card.setAttribute('data-file-id', fileInfo.id);
    
    const fileSize = (file.size / 1024).toFixed(2);
    const fileExtension = file.name.split('.').pop().toUpperCase();
    
    card.innerHTML = `
        <div class="file-preview-header">
            <div class="file-icon ${fileExtension.toLowerCase()}">${getFileIcon(fileExtension)}</div>
            <div class="file-info">
                <div class="file-name" title="${file.name}">${file.name}</div>
                <div class="file-meta">
                    <span class="file-size">${fileSize} KB</span>
                    <span class="file-type">${fileExtension}</span>
                </div>
            </div>
            <button class="file-remove-btn" onclick="removeUploadedFile('${fileInfo.id}')" title="删除文件">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="file-preview-body">
            <div class="file-preview-placeholder" id="preview-${fileInfo.id}">
                <span>预览加载中...</span>
            </div>
        </div>
        <div class="file-preview-footer">
            <button class="btn-sm btn-outline" onclick="previewFile('${fileInfo.id}')">👁️ 预览</button>
            <button class="btn-sm btn-outline" onclick="downloadFile('${fileInfo.id}', '${file.name}')">💾 下载</button>
        </div>
    `;
    
    return card;
}

/**
 * 根据文件类型返回图标
 */
function getFileIcon(extension) {
    const icons = {
        'PDF': '',
        'DOC': '',
        'DOCX': '',
        'XLS': '',
        'XLSX': '',
        'TXT': '',
        'PPT': '',
        'PPTX': ''
    };
    return icons[extension] || '';
}

/**
 * 预览文件
 */
async function previewFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    // 创建预览模态框
    const modal = document.createElement('div');
    modal.className = 'file-preview-modal';
    modal.innerHTML = `
        <div class="file-preview-modal-content">
            <div class="file-preview-modal-header">
                <h3>${file.originalName}</h3>
                <button class="modal-close-btn" onclick="this.closest('.file-preview-modal').remove()">×</button>
            </div>
            <div class="file-preview-modal-body">
                <div class="loading-spinner">加载中...</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 模拟加载预览内容
    setTimeout(() => {
        const body = modal.querySelector('.file-preview-modal-body');
        body.innerHTML = `
            <div class="preview-info">
                <p><strong>文件名：</strong>${file.originalName}</p>
                <p><strong>类型：</strong>${file.type}</p>
                <p><strong>上传时间：</strong>${new Date(file.uploadTime).toLocaleString()}</p>
            </div>
            <p class="preview-note">提示：完整预览功能正在开发中...</p>
        `;
    }, 500);
}

// =========================
// AI分析进度显示优化
// =========================

/**
 * 创建增强版加载动画
 */
function showEnhancedLoading(analysisType) {
    const existingLoading = document.querySelector('.enhanced-loading-overlay');
    if (existingLoading) {
        existingLoading.remove();
    }

    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'enhanced-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="enhanced-loading-content">
            <div class="loading-animation">
                <div class="loading-circle"></div>
                <div class="loading-circle"></div>
                <div class="loading-circle"></div>
            </div>
            <h3 class="loading-title">AI 正在分析中...</h3>
            <div class="loading-progress-container">
                <div class="loading-progress-bar">
                    <div class="loading-progress-fill" id="analysisProgress"></div>
                </div>
                <div class="loading-progress-info">
                    <span id="progressPercent">0%</span>
                </div>
            </div>
            <div class="loading-stage" id="loadingStage">解析文档...</div>
            <div id="knowledgeTip" class="knowledge-tip">
                <div class="knowledge-icon"></div>
                <div class="knowledge-text">
                    <span class="knowledge-category">小知识</span>
                    <span class="knowledge-content">加载中...</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // 启动进度模拟
    simulateAnalysisProgress(analysisType);
    
    // 启动知识提示轮播
    if (typeof startKnowledgeTips === 'function') {
        startKnowledgeTips();
    }
    
    return loadingOverlay;
}

/**
 * 模拟分析进度
 */
function simulateAnalysisProgress(analysisType) {
    const stages = [
        { percent: 10, stage: '解析文档结构...' },
        { percent: 25, stage: '提取关键信息...' },
        { percent: 40, stage: 'AI 深度分析...' },
        { percent: 60, stage: '生成数据图表...' },
        { percent: 80, stage: '撰写分析报告...' },
        { percent: 95, stage: '优化排版格式...' }
    ];
    
    let currentStageIndex = 0;
    
    const updateProgress = () => {
        if (currentStageIndex >= stages.length) return;
        
        const stage = stages[currentStageIndex];
        const progressFill = document.getElementById('analysisProgress');
        const progressPercent = document.getElementById('progressPercent');
        const progressTime = document.getElementById('progressTime');
        const loadingStage = document.getElementById('loadingStage');
        
        if (progressFill && progressPercent && loadingStage) {
            progressFill.style.width = `${stage.percent}%`;
            progressPercent.textContent = `${stage.percent}%`;
            loadingStage.textContent = stage.stage;
        }
        
        currentStageIndex++;
        
        // 根据阶段设置不同的时间间隔
        const nextDelay = currentStageIndex < 3 ? 3000 : 5000;
        setTimeout(updateProgress, nextDelay);
    };
    
    // 开始更新进度
    setTimeout(updateProgress, 1000);
}

/**
 * 隐藏加载动画
 */
function hideEnhancedLoading() {
    const loadingOverlay = document.querySelector('.enhanced-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }
    
    // 停止知识提示
    if (typeof stopKnowledgeTips === 'function') {
        stopKnowledgeTips();
    }
}

// =========================
// 用户引导提示
// =========================

/**
 * 显示首次使用引导
 */
function showFirstTimeGuide() {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (hasSeenGuide) return;

    const guide = document.createElement('div');
    guide.className = 'first-time-guide';
    guide.innerHTML = `
        <div class="guide-content">
            <div class="guide-header">
                <h2>🎉 欢迎使用 RV-Agent！</h2>
                <button class="guide-skip" onclick="skipGuide()">跳过</button>
            </div>
            <div class="guide-body">
                <div class="guide-step active" data-step="1">
                    <div class="guide-step-icon">📤</div>
                    <h3>第一步：上传文档</h3>
                    <p>支持 PDF、Word、Excel 等格式<br>单个文件不超过 10MB</p>
                </div>
                <div class="guide-step" data-step="2">
                    <div class="guide-step-icon"></div>
                    <h3>第二步：AI 分析</h3>
                    <p>AI 正在智能分析中<br>请稍候</p>
                </div>
                <div class="guide-step" data-step="3">
                    <div class="guide-step-icon"></div>
                    <h3>第三步：查看结果</h3>
                    <p>获得专业分析报告<br>支持在线编辑和导出</p>
                </div>
            </div>
            <div class="guide-footer">
                <button class="btn-guide-prev" onclick="prevGuideStep()">上一步</button>
                <div class="guide-dots">
                    <span class="dot active" data-dot="1"></span>
                    <span class="dot" data-dot="2"></span>
                    <span class="dot" data-dot="3"></span>
                </div>
                <button class="btn-guide-next" onclick="nextGuideStep()">下一步</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(guide);
}

let currentGuideStep = 1;
const totalGuideSteps = 3;

function nextGuideStep() {
    if (currentGuideStep < totalGuideSteps) {
        currentGuideStep++;
        updateGuideStep();
    } else {
        completeGuide();
    }
}

function prevGuideStep() {
    if (currentGuideStep > 1) {
        currentGuideStep--;
        updateGuideStep();
    }
}

function updateGuideStep() {
    const steps = document.querySelectorAll('.guide-step');
    const dots = document.querySelectorAll('.guide-dots .dot');
    const nextBtn = document.querySelector('.btn-guide-next');
    
    steps.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentGuideStep);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentGuideStep);
    });
    
    if (nextBtn) {
        nextBtn.textContent = currentGuideStep === totalGuideSteps ? '开始使用' : '下一步';
    }
}

function skipGuide() {
    localStorage.setItem('hasSeenGuide', 'true');
    document.querySelector('.first-time-guide').remove();
}

function completeGuide() {
    localStorage.setItem('hasSeenGuide', 'true');
    document.querySelector('.first-time-guide').classList.add('fade-out');
    setTimeout(() => {
        document.querySelector('.first-time-guide').remove();
    }, 500);
}

// =========================
// 错误提示优化
// =========================

/**
 * 显示友好的错误提示
 */
function showFriendlyError(errorType, errorDetails = {}) {
    const errorMessages = {
        'file_too_large': {
            icon: '⚠️',
            title: '文件过大',
            message: '上传的文件超过 10MB 限制',
            solutions: [
                '尝试压缩文件',
                '只上传核心页面',
                '使用更小的文件格式'
            ]
        },
        'network_error': {
            icon: '🌐',
            title: '网络连接失败',
            message: '无法连接到服务器',
            solutions: [
                '检查网络连接',
                '刷新页面重试',
                '联系技术支持'
            ]
        },
        'analysis_failed': {
            icon: '❌',
            title: 'AI 分析失败',
            message: errorDetails.message || '分析过程中出现错误',
            solutions: [
                '减少上传文档数量（1-3个）',
                '使用更小的文件（< 5MB）',
                '避免上传扫描件和大PDF',
                '查看常见问题解答'
            ]
        },
        'invalid_file': {
            icon: '📁',
            title: '不支持的文件格式',
            message: '请上传 PDF、Word、Excel 或 TXT 格式',
            solutions: [
                '转换文件格式',
                '检查文件是否损坏'
            ]
        }
    };
    
    const errorConfig = errorMessages[errorType] || {
        icon: '⚠️',
        title: '发生错误',
        message: '操作未能完成',
        solutions: ['刷新页面重试']
    };
    
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
        <div class="error-modal-content">
            <div class="error-icon">${errorConfig.icon}</div>
            <h3 class="error-title">${errorConfig.title}</h3>
            <p class="error-message">${errorConfig.message}</p>
            <div class="error-solutions">
                <h4>解决方案：</h4>
                <ul>
                    ${errorConfig.solutions.map(solution => `<li>${solution}</li>`).join('')}
                </ul>
            </div>
            <div class="error-actions">
                <button class="btn-primary" onclick="this.closest('.error-modal').remove()">知道了</button>
                <button class="btn-secondary" onclick="window.location.href='#faq'">查看帮助</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    
    // 3秒后自动关闭（如果用户没有操作）
    setTimeout(() => {
        if (errorModal.parentElement) {
            errorModal.classList.add('fade-out');
            setTimeout(() => errorModal.remove(), 500);
        }
    }, 10000);
}

// =========================
// 页面初始化
// =========================

document.addEventListener('DOMContentLoaded', () => {
    // 初始化拖拽上传
    initDragDropUpload();
    
    // 显示首次使用引导
    setTimeout(() => {
        showFirstTimeGuide();
    }, 1000);
    
    console.log('✅ 文件上传增强模块已加载');
});

