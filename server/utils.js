/**
 * 服务器端工具函数模块
 */

/**
 * 清理 Markdown 格式符号和多余符号
 * 注意：保留换行符以维持文档格式
 */
function cleanMarkdownSymbols(text) {
    if (!text || typeof text !== 'string') {
        return text;
    }
    return text
        // 移除所有Markdown标题符号
        .replace(/###+/g, '')
        .replace(/##+/g, '')
        .replace(/#+/g, '')
        // 移除所有星号符号
        .replace(/\*\*\*/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        // 移除分隔线
        .replace(/^---+$/gm, '')
        .replace(/---+$/gm, '')
        .replace(/^---+/gm, '')
        // 移除斜杠符号（但保留日期格式中的斜杠）
        .replace(/\/\/+/g, '')
        .replace(/(?<!\d)\/(?!\d)/g, '')
        // 移除反引号
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`/g, '')
        // 移除列表符号（-、*、+ 开头的列表）
        .replace(/^\s*[-*+]\s+/gm, '')
        // ⚠️ 重要修改：只清理同一行内的多余空格，保留换行符
        // 将每行内的多个空格替换为单个空格，但不影响换行
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').trim())
        .join('\n')
        // 清理多余的连续空行（保留最多一个空行）
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成唯一ID
 */
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 安全的 JSON 解析
 */
function safeJsonParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON解析失败:', error.message);
        return defaultValue;
    }
}

/**
 * 延迟函数
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
async function retry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`重试 ${i + 1}/${retries}...`);
            await sleep(delay);
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
 * 验证邮箱格式
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 截断文本
 */
function truncate(text, maxLength = 100, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
}

module.exports = {
    cleanMarkdownSymbols,
    formatFileSize,
    generateUniqueId,
    safeJsonParse,
    sleep,
    retry,
    formatDate,
    isValidEmail,
    truncate
};

