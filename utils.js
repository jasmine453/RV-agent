/**
 * 前端工具函数模块
 * 通用的辅助函数集合
 * 
 * @module utils
 * @description 提供文件处理、文本格式化、防抖节流、日期处理等常用工具函数
 */

/**
 * 文件大小格式化
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小字符串，如 "1.5 MB"
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
function formatFileSize(bytes) {
    if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
        return '0 Bytes';
    }
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizeIndex = Math.min(i, sizes.length - 1);
    const value = bytes / Math.pow(k, sizeIndex);
    
    return parseFloat(value.toFixed(2)) + ' ' + sizes[sizeIndex];
}

/**
 * HTML转义函数（防止XSS攻击）
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的HTML安全文本
 * @example
 * escapeHtml('<script>alert("xss")</script>') // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 */
function escapeHtml(text) {
    if (text == null) return '';
    if (typeof text !== 'string') {
        text = String(text);
    }
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 防抖函数 - 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行（默认false）
 * @returns {Function} 防抖后的函数
 * @example
 * const debouncedSearch = debounce(() => console.log('search'), 300);
 * input.addEventListener('input', debouncedSearch);
 */
function debounce(func, wait, immediate = false) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    if (typeof wait !== 'number' || wait < 0) {
        wait = 300;
    }
    
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

/**
 * 节流函数 - 限制函数执行频率，在指定时间间隔内最多执行一次
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 时间间隔（毫秒）
 * @param {Object} options - 配置选项
 * @param {boolean} options.leading - 是否在开始时执行（默认true）
 * @param {boolean} options.trailing - 是否在结束时执行（默认true）
 * @returns {Function} 节流后的函数
 * @example
 * const throttledScroll = throttle(() => console.log('scroll'), 100);
 * window.addEventListener('scroll', throttledScroll);
 */
function throttle(func, limit, options = {}) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    if (typeof limit !== 'number' || limit < 0) {
        limit = 100;
    }
    
    const { leading = true, trailing = true } = options;
    let timeout;
    let previous = 0;
    
    return function(...args) {
        const context = this;
        const now = Date.now();
        
        if (!previous && !leading) previous = now;
        
        const remaining = limit - (now - previous);
        
        if (remaining <= 0 || remaining > limit) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
        } else if (!timeout && trailing) {
            timeout = setTimeout(() => {
                previous = leading ? Date.now() : 0;
                timeout = null;
                func.apply(context, args);
            }, remaining);
        }
    };
}

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
 * @param {Object} options - 格式化选项
 * @param {boolean} options.includeTime - 是否包含时间（默认true）
 * @param {string} options.locale - 语言环境（默认'zh-CN'）
 * @returns {string} 格式化后的日期字符串
 * @example
 * formatDate() // "2024/01/01 12:00:00"
 * formatDate(new Date(), { includeTime: false }) // "2024/01/01"
 */
function formatDate(date = new Date(), options = {}) {
    const { includeTime = true, locale = 'zh-CN' } = options;
    
    if (typeof date === 'string' || typeof date === 'number') {
        date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        date = new Date();
    }
    
    const formatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    
    if (includeTime) {
        formatOptions.hour = '2-digit';
        formatOptions.minute = '2-digit';
        formatOptions.second = '2-digit';
    }
    
    return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

/**
 * 清理Markdown符号（用于Word导出）
 * 重要：保留换行符以维持文档格式，但删除Markdown语法
 * @param {string} text - 包含Markdown格式的文本
 * @returns {string} 清理后的纯文本
 * @example
 * cleanMarkdownSymbols("# 标题\n**粗体**") // "标题\n粗体"
 */
function cleanMarkdownSymbols(text) {
    if (!text || typeof text !== 'string') return text || '';
    
    try {
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
    } catch (error) {
        console.error('清理Markdown符号时出错:', error);
        return text;
    }
}

/**
 * 增强内容显示（用于网页显示）
 * 保留Markdown格式，并转换为HTML以便更好地显示
 * @param {string} text - Markdown格式的文本
 * @returns {string} 转换后的HTML字符串
 * @example
 * enhanceContentDisplay("**粗体** `代码`") // "<strong>粗体</strong> <code>代码</code>"
 */
function enhanceContentDisplay(text) {
    if (!text || typeof text !== 'string') return text || '';
    
    try {
        // 保留Markdown表格和代码块，转换为HTML
        let enhanced = escapeHtml(text); // 先转义，防止XSS
        
        // 1. 转换代码块为HTML（在转义之前处理，因为代码块需要特殊处理）
        enhanced = text.replace(/```([a-z]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
            const escapedCode = escapeHtml(code.trim());
            return `<pre><code class="language-${lang || 'text'}">${escapedCode}</code></pre>`;
        });
        
        // 2. 转换表格为HTML
        enhanced = enhanced.replace(/\|(.+)\|/g, (match) => {
            // 检测是否是表格分隔行
            if (match.includes('|---') || match.includes('|--') || match.includes('|:--')) {
                return ''; // 移除分隔行
            }
            const cells = match.split('|').filter(c => c.trim());
            if (cells.length === 0) return '';
            const htmlCells = cells.map(c => `<td>${escapeHtml(c.trim())}</td>`).join('');
            return `<tr>${htmlCells}</tr>`;
        });
        
        // 3. 包装表格
        enhanced = enhanced.replace(/(<tr>.*?<\/tr>\s*)+/gs, (match) => {
            return `<table class="markdown-table">${match}</table>`;
        });
        
        // 4. 转换行内代码（需要在转义后处理）
        enhanced = enhanced.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 5. 转换粗体
        enhanced = enhanced.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        enhanced = enhanced.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // 6. 转换标题
        enhanced = enhanced.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        enhanced = enhanced.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        enhanced = enhanced.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // 7. 转换链接
        enhanced = enhanced.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // 8. 转换换行
        enhanced = enhanced.replace(/\n/g, '<br>');
        
        return enhanced;
    } catch (error) {
        console.error('增强内容显示时出错:', error);
        return escapeHtml(text);
    }
}

/**
 * 延迟函数（异步等待）
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise<void>} Promise对象
 * @example
 * await sleep(1000); // 等待1秒
 */
function sleep(ms) {
    if (typeof ms !== 'number' || ms < 0) {
        ms = 0;
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 截断文本
 * @param {string} text - 需要截断的文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 截断后的后缀（默认'...'）
 * @returns {string} 截断后的文本
 * @example
 * truncate("这是一段很长的文本", 5) // "这是一段..."
 */
function truncate(text, maxLength = 100, suffix = '...') {
    if (!text || typeof text !== 'string') return text || '';
    if (typeof maxLength !== 'number' || maxLength < 0) {
        maxLength = 100;
    }
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
}

/**
 * 生成唯一ID
 * @param {string} prefix - ID前缀（可选）
 * @returns {string} 唯一ID字符串
 * @example
 * generateUniqueId() // "1704067200000-abc123def"
 * generateUniqueId('task') // "task-1704067200000-abc123def"
 */
function generateUniqueId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * 深拷贝对象
 * @param {*} obj - 需要拷贝的对象
 * @returns {*} 拷贝后的新对象
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const copied = deepClone(original);
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    return obj;
}

/**
 * 检查值是否为空（null、undefined、空字符串、空数组、空对象）
 * @param {*} value - 需要检查的值
 * @returns {boolean} 如果为空返回true，否则返回false
 * @example
 * isEmpty(null) // true
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty('text') // false
 */
function isEmpty(value) {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * 格式化数字（添加千分位分隔符）
 * @param {number} num - 需要格式化的数字
 * @param {number} decimals - 保留小数位数（默认0）
 * @returns {string} 格式化后的数字字符串
 * @example
 * formatNumber(1234567.89, 2) // "1,234,567.89"
 */
function formatNumber(num, decimals = 0) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return num.toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @param {string} url - URL字符串（可选，默认使用当前页面URL）
 * @returns {string|null} 参数值，如果不存在返回null
 * @example
 * getUrlParam('id') // 获取URL中的id参数
 */
function getUrlParam(name, url = window.location.href) {
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 需要复制的文本
 * @returns {Promise<boolean>} 复制是否成功
 * @example
 * await copyToClipboard('要复制的文本');
 */
async function copyToClipboard(text) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // 降级方案：使用传统方法
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    } catch (err) {
        console.error('复制到剪贴板失败:', err);
        return false;
    }
}

/**
 * 下载文件
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME类型（默认'text/plain'）
 * @example
 * downloadFile('文件内容', 'example.txt', 'text/plain');
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
    if (!content || !filename) {
        console.error('下载文件失败: 内容或文件名为空');
        return;
    }
    
    try {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('下载文件失败:', error);
    }
}

/**
 * 防抖装饰器（用于类方法）
 * @param {Function} func - 需要防抖的方法
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的方法
 */
function debounceMethod(func, wait) {
    return debounce(func, wait);
}

/**
 * 节流装饰器（用于类方法）
 * @param {Function} func - 需要节流的方法
 * @param {number} limit - 时间间隔（毫秒）
 * @returns {Function} 节流后的方法
 */
function throttleMethod(func, limit) {
    return throttle(func, limit);
}
