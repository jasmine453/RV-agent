/**
 * 前端工具函数模块
 * 通用的辅助函数集合
 */

/**
 * 文件大小格式化
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * HTML转义函数（防止XSS攻击）
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * 格式化日期
 */
function formatDate(date = new Date()) {
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

/**
 * 清理Markdown符号（用于Word导出）
 * 重要：保留换行符以维持文档格式，但删除Markdown语法
 */
function cleanMarkdownSymbols(text) {
    if (!text || typeof text !== 'string') return text;
    return text
        .replace(/#{1,6}\s*/g, '')              // 标题
        .replace(/\*{1,3}/g, '')                // 星号
        .replace(/^[═─]{3,}$/gm, '')            // 装饰性分隔线
        .replace(/^---+$/gm, '')                // 分隔线
        .replace(/```[\s\S]*?```/g, (match) => {  // 代码块：保留内容但去除```
            return match.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '');
        })
        .replace(/`([^`]+)`/g, '$1')            // 行内代码：保留内容但去除`
        .replace(/^\s*[-*+]\s+/gm, '')          // 列表
        .replace(/^\s*[●○◯◦⭘◌]\s*/gm, '')     // 圆圈符号列表
        .replace(/[●○◯◦⭘◌]\s*/g, '')           // 行内圆圈符号
        .replace(/\|/g, ' ')                    // 表格分隔符转为空格
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').trim())
        .filter(line => line.length > 0 || line === '')  // 保留空行用于段落分隔
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * 增强内容显示（用于网页显示）
 * 保留Markdown格式，并转换为HTML以便更好地显示
 */
function enhanceContentDisplay(text) {
    if (!text || typeof text !== 'string') return text;
    
    // 保留Markdown表格和代码块，转换为HTML
    let enhanced = text;
    
    // 1. 转换表格为HTML
    enhanced = enhanced.replace(/\|(.+)\|/g, (match) => {
        // 检测是否是表格行
        if (match.includes('|---') || match.includes('|--')) {
            return match; // 跳过分隔行
        }
        const cells = match.split('|').filter(c => c.trim());
        const htmlCells = cells.map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${htmlCells}</tr>`;
    });
    
    // 2. 包装表格
    enhanced = enhanced.replace(/(<tr>.*<\/tr>\s*)+/gs, (match) => {
        return `<table>${match}</table>`;
    });
    
    // 3. 转换代码块为HTML
    enhanced = enhanced.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code>${code.trim()}</code></pre>`;
    });
    
    // 4. 转换行内代码
    enhanced = enhanced.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 5. 转换粗体
    enhanced = enhanced.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    return enhanced;
}

/**
 * 延迟函数
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 截断文本
 */
function truncate(text, maxLength = 100, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
}

/**
 * 生成唯一ID
 */
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
