/**
 * 错误处理中间件
 * 统一的错误处理机制
 */

const logger = require('../logger');

/**
 * 自定义应用错误类
 */
class AppError extends Error {
    constructor(message, statusCode = 500, errorType = 'unknown', details = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.details = details;
        this.isOperational = true; // 区分可预期的错误和程序错误
        
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 特定错误类型
 */
class ValidationError extends AppError {
    constructor(message, details = null) {
        super(message, 400, 'validation_error', details);
    }
}

class AuthenticationError extends AppError {
    constructor(message = '认证失败') {
        super(message, 401, 'authentication_error');
    }
}

class AuthorizationError extends AppError {
    constructor(message = '权限不足') {
        super(message, 403, 'authorization_error');
    }
}

class NotFoundError extends AppError {
    constructor(resource = '资源') {
        super(`${resource}不存在`, 404, 'not_found');
    }
}

class RateLimitError extends AppError {
    constructor(message = '请求过于频繁') {
        super(message, 429, 'rate_limit');
    }
}

class ExternalServiceError extends AppError {
    constructor(service, message) {
        super(`${service}服务错误: ${message}`, 503, 'external_service_error');
    }
}

/**
 * 错误响应格式化
 */
function formatErrorResponse(err, includeStack = false) {
    const response = {
        success: false,
        message: err.message || '服务器内部错误',
        errorType: err.errorType || 'server_error',
        timestamp: new Date().toISOString()
    };
    
    // 添加详细信息（如果有）
    if (err.details) {
        response.details = err.details;
    }
    
    // 开发环境包含堆栈信息
    if (includeStack && err.stack) {
        response.stack = err.stack;
    }
    
    return response;
}

/**
 * 记录错误日志
 */
function logError(err, req) {
    const logData = {
        message: err.message,
        errorType: err.errorType || 'unknown',
        statusCode: err.statusCode || 500,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
    };
    
    // 添加请求体（排除敏感信息）
    if (req.body && Object.keys(req.body).length > 0) {
        logData.body = { ...req.body };
        // 过滤敏感字段
        const sensitiveFields = ['password', 'apiKey', 'secret', 'token'];
        sensitiveFields.forEach(field => {
            if (logData.body[field]) {
                logData.body[field] = '***FILTERED***';
            }
        });
    }
    
    // 根据错误级别记录
    if (err.statusCode >= 500) {
        logger.error('服务器错误', {
            ...logData,
            stack: err.stack
        });
    } else if (err.statusCode >= 400) {
        logger.warn('客户端错误', logData);
    } else {
        logger.info('请求错误', logData);
    }
}

/**
 * 主错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
    // 设置默认值
    let statusCode = err.statusCode || 500;
    let errorType = err.errorType || 'server_error';
    let message = err.message || '服务器内部错误';
    
    // 处理特定类型的错误
    
    // Multer 文件上传错误
    if (err.name === 'MulterError') {
        statusCode = 400;
        errorType = 'file_upload_error';
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = '文件大小超过限制（最大10MB）';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            message = '上传文件数量超过限制';
        } else {
            message = '文件上传失败';
        }
    }
    
    // MongoDB/Mongoose 错误
    if (err.name === 'CastError') {
        statusCode = 400;
        errorType = 'validation_error';
        message = '无效的数据格式';
    }
    
    // Sequelize 错误
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        errorType = 'validation_error';
        message = err.errors.map(e => e.message).join(', ');
    }
    
    // JWT 错误
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorType = 'authentication_error';
        message = '无效的认证令牌';
    }
    
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        errorType = 'authentication_error';
        message = '认证令牌已过期';
    }
    
    // 记录错误
    logError({
        ...err,
        statusCode,
        errorType,
        message
    }, req);
    
    // 生产环境不暴露敏感信息
    if (process.env.NODE_ENV === 'production') {
        // 500 错误使用通用消息
        if (statusCode === 500 && !err.isOperational) {
            message = '服务器内部错误，请稍后重试';
        }
        
        // 不包含堆栈信息
        return res.status(statusCode).json(formatErrorResponse({
            message,
            errorType,
            details: err.isOperational ? err.details : null
        }));
    }
    
    // 开发环境返回详细信息
    return res.status(statusCode).json(formatErrorResponse(err, true));
};

/**
 * 404 错误处理
 */
const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError('请求的路径');
    error.statusCode = 404;
    next(error);
};

/**
 * 异步路由处理包装器
 * 自动捕获 async/await 错误
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * 验证错误处理
 * 与 express-validator 配合使用
 */
const handleValidationErrors = (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));
        
        throw new ValidationError('请求参数验证失败', extractedErrors);
    }
    
    next();
};

/**
 * 未捕获异常处理
 */
function setupGlobalErrorHandlers() {
    // 未捕获的 Promise 拒绝
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('未处理的 Promise 拒绝', {
            reason: reason instanceof Error ? reason.message : reason,
            stack: reason instanceof Error ? reason.stack : undefined,
            promise: promise.toString()
        });
        
        // 优雅关闭（生产环境）
        if (process.env.NODE_ENV === 'production') {
            console.error('💥 未处理的 Promise 拒绝，正在关闭服务器...');
            process.exit(1);
        }
    });
    
    // 未捕获的异常
    process.on('uncaughtException', (error) => {
        logger.error('未捕获的异常', {
            message: error.message,
            stack: error.stack
        });
        
        console.error('💥 未捕获的异常，正在关闭服务器...');
        console.error(error);
        
        // 必须退出进程
        process.exit(1);
    });
    
    // 进程终止信号
    process.on('SIGTERM', () => {
        logger.info('收到 SIGTERM 信号，正在优雅关闭...');
    });
    
    process.on('SIGINT', () => {
        logger.info('收到 SIGINT 信号，正在优雅关闭...');
    });
}

module.exports = {
    // 错误类
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    RateLimitError,
    ExternalServiceError,
    
    // 中间件
    errorHandler,
    notFoundHandler,
    asyncHandler,
    handleValidationErrors,
    
    // 工具函数
    setupGlobalErrorHandlers,
    formatErrorResponse,
    logError
};

