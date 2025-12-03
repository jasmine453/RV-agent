/**
 * 安全中间件模块
 * 提供各种安全防护措施
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

/**
 * Helmet 安全头配置
 */
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "https://api.deepseek.com", "https://ark.cn-beijing.volces.com"],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    frameguard: {
        action: 'deny'
    },
    xssFilter: true
});

/**
 * 通用 API 速率限制
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 最多100个请求
    message: {
        success: false,
        message: '请求过于频繁，请稍后再试',
        errorType: 'rate_limit'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // 跳过健康检查
        return req.path === '/api/health';
    }
});

/**
 * 文件上传速率限制（更严格）
 */
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 10, // 最多10次上传
    message: {
        success: false,
        message: '文件上传过于频繁，请稍后再试',
        errorType: 'upload_rate_limit'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * AI 分析速率限制（最严格）
 */
const analysisLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1小时
    max: 20, // 最多20次分析
    message: {
        success: false,
        message: 'AI分析请求过于频繁，请稍后再试',
        errorType: 'analysis_rate_limit'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * 文件类型验证
 */
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
];

const allowedExtensions = /\.(pdf|doc|docx|xls|xlsx|txt)$/i;

/**
 * 验证文件类型（基于 MIME 和扩展名）
 */
function validateFileType(file) {
    const mimeValid = allowedMimeTypes.includes(file.mimetype);
    const extValid = allowedExtensions.test(file.originalname);
    
    if (!mimeValid || !extValid) {
        throw new Error('不支持的文件格式。支持：PDF、Word、Excel、TXT');
    }
    
    return true;
}

/**
 * 验证文件魔数（Magic Number）
 * 防止文件类型伪造
 */
async function validateFileMagicNumber(filePath) {
    const fs = require('fs').promises;
    const buffer = await fs.readFile(filePath);
    
    // 文件魔数映射
    const magicNumbers = {
        pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
        zip: [0x50, 0x4B, 0x03, 0x04], // PK.. (用于 docx/xlsx)
        doc: [0xD0, 0xCF, 0x11, 0xE0], // Word 97-2003
        xls: [0xD0, 0xCF, 0x11, 0xE0], // Excel 97-2003
    };
    
    // 检查前4个字节
    const header = Array.from(buffer.slice(0, 4));
    
    // PDF 检查
    if (header.every((byte, i) => byte === magicNumbers.pdf[i])) {
        return 'pdf';
    }
    
    // ZIP 检查（docx/xlsx）
    if (header.every((byte, i) => byte === magicNumbers.zip[i])) {
        return 'zip';
    }
    
    // DOC/XLS 检查
    if (header.every((byte, i) => byte === magicNumbers.doc[i])) {
        return 'ole';
    }
    
    // 纯文本检查
    const text = buffer.toString('utf8', 0, Math.min(1000, buffer.length));
    if (/^[\x20-\x7E\s\n\r]*$/.test(text)) {
        return 'text';
    }
    
    throw new Error('文件内容验证失败，可能是伪造的文件类型');
}

/**
 * 生成安全的随机文件名
 */
function generateSecureFileName(originalName) {
    const ext = require('path').extname(originalName);
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}-${randomBytes}${ext}`;
}

/**
 * 清理文件名（防止路径遍历攻击）
 */
function sanitizeFileName(filename) {
    return filename
        .replace(/[^a-zA-Z0-9.\-_]/g, '_') // 只保留安全字符
        .replace(/\.{2,}/g, '.') // 防止 .. 路径遍历
        .substring(0, 255); // 限制长度
}

/**
 * 请求 IP 获取（支持代理）
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           req.ip;
}

/**
 * 生成请求指纹（用于追踪和限流）
 */
function generateRequestFingerprint(req) {
    const ip = getClientIP(req);
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    
    const fingerprint = `${ip}:${userAgent}:${acceptLanguage}`;
    return crypto.createHash('sha256').update(fingerprint).digest('hex');
}

/**
 * 敏感信息过滤中间件
 */
function filterSensitiveData(req, res, next) {
    // 过滤请求体中的敏感信息
    if (req.body) {
        const sensitiveFields = ['password', 'apiKey', 'secret', 'token'];
        for (const field of sensitiveFields) {
            if (req.body[field]) {
                req.body[field] = '***FILTERED***';
            }
        }
    }
    next();
}

/**
 * CORS 配置
 */
function corsOptions() {
    return {
        origin: function (origin, callback) {
            const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
            
            // 开发环境允许所有来源
            if (process.env.NODE_ENV === 'development') {
                callback(null, true);
                return;
            }
            
            // 生产环境检查白名单
            if (allowedOrigins.includes('*') || !origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('不允许的CORS来源'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400 // 24小时
    };
}

module.exports = {
    helmetConfig,
    apiLimiter,
    uploadLimiter,
    analysisLimiter,
    validateFileType,
    validateFileMagicNumber,
    generateSecureFileName,
    sanitizeFileName,
    getClientIP,
    generateRequestFingerprint,
    filterSensitiveData,
    corsOptions
};

