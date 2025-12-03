/**
 * 日志系统
 * 使用 Winston 进行结构化日志记录
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// 确保日志目录存在
const logDir = process.env.LOG_DIR || 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * 自定义日志格式
 */
const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        
        // 添加元数据
        if (Object.keys(meta).length > 0) {
            // 过滤掉 Symbol 属性
            const cleanMeta = Object.keys(meta)
                .filter(key => typeof key === 'string')
                .reduce((obj, key) => {
                    obj[key] = meta[key];
                    return obj;
                }, {});
            
            if (Object.keys(cleanMeta).length > 0) {
                log += `\n${JSON.stringify(cleanMeta, null, 2)}`;
            }
        }
        
        return log;
    })
);

/**
 * 控制台格式（带颜色）
 */
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({
        format: 'HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let log = `${timestamp} ${level}: ${message}`;
        
        // 简化的元数据显示
        if (meta.error) {
            log += `\n  Error: ${meta.error}`;
        }
        if (meta.stack) {
            log += `\n  Stack: ${meta.stack}`;
        }
        
        return log;
    })
);

/**
 * 创建日志轮转传输器
 */
function createRotateTransport(filename, level = 'info') {
    return new DailyRotateFile({
        filename: path.join(logDir, `${filename}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        level: level,
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
        format: customFormat,
        zippedArchive: true
    });
}

/**
 * Logger 配置
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    defaultMeta: { 
        service: 'rv-agent',
        env: process.env.NODE_ENV || 'development'
    },
    transports: [
        // 控制台输出
        new winston.transports.Console({
            format: consoleFormat,
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        }),
        
        // 所有日志
        createRotateTransport('combined', 'info'),
        
        // 错误日志
        createRotateTransport('error', 'error'),
        
        // 警告日志
        createRotateTransport('warn', 'warn')
    ],
    
    // 异常处理
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'exceptions.log'),
            format: customFormat
        })
    ],
    
    // Promise 拒绝处理
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'rejections.log'),
            format: customFormat
        })
    ],
    
    // 静默退出
    exitOnError: false
});

/**
 * 开发环境额外配置
 */
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.File({
        filename: path.join(logDir, 'debug.log'),
        level: 'debug',
        format: customFormat
    }));
}

/**
 * HTTP 请求日志中间件
 */
logger.httpLogger = (req, res, next) => {
    const start = Date.now();
    
    // 响应完成时记录
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        };
        
        // 根据状态码选择日志级别
        if (res.statusCode >= 500) {
            logger.error('HTTP请求', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('HTTP请求', logData);
        } else {
            logger.info('HTTP请求', logData);
        }
    });
    
    next();
};

/**
 * API 调用日志
 */
logger.apiCall = (service, action, data = {}) => {
    logger.info(`API调用: ${service}.${action}`, {
        service,
        action,
        timestamp: new Date().toISOString(),
        ...data
    });
};

/**
 * 性能监控日志
 */
logger.performance = (operation, duration, metadata = {}) => {
    const level = duration > 5000 ? 'warn' : 'info';
    logger.log(level, `性能监控: ${operation}`, {
        operation,
        duration: `${duration}ms`,
        ...metadata
    });
};

/**
 * 数据库操作日志
 */
logger.database = (operation, query, duration) => {
    logger.debug('数据库操作', {
        operation,
        query: typeof query === 'string' ? query.substring(0, 200) : query,
        duration: `${duration}ms`
    });
};

/**
 * 安全事件日志
 */
logger.security = (event, severity = 'medium', details = {}) => {
    const level = severity === 'high' ? 'error' : severity === 'medium' ? 'warn' : 'info';
    logger.log(level, `安全事件: ${event}`, {
        event,
        severity,
        timestamp: new Date().toISOString(),
        ...details
    });
};

/**
 * 业务日志
 */
logger.business = (action, details = {}) => {
    logger.info(`业务操作: ${action}`, {
        action,
        timestamp: new Date().toISOString(),
        ...details
    });
};

/**
 * AI 服务日志
 */
logger.ai = (operation, provider, details = {}) => {
    logger.info(`AI服务: ${provider}.${operation}`, {
        provider,
        operation,
        timestamp: new Date().toISOString(),
        ...details
    });
};

/**
 * 文件操作日志
 */
logger.file = (operation, filename, details = {}) => {
    logger.info(`文件操作: ${operation}`, {
        operation,
        filename,
        ...details
    });
};

/**
 * 定期清理旧日志
 */
function cleanupOldLogs() {
    const maxAge = 30; // 保留30天
    const now = Date.now();
    
    try {
        const files = fs.readdirSync(logDir);
        let deletedCount = 0;
        
        files.forEach(file => {
            const filePath = path.join(logDir, file);
            const stats = fs.statSync(filePath);
            const fileAge = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24); // 天数
            
            if (fileAge > maxAge) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        });
        
        if (deletedCount > 0) {
            logger.info(`清理了 ${deletedCount} 个旧日志文件`);
        }
    } catch (error) {
        logger.error('清理日志文件失败', { error: error.message });
    }
}

// 每天凌晨2点清理旧日志
const schedule = require('node-schedule');
schedule.scheduleJob('0 2 * * *', cleanupOldLogs);

/**
 * 日志查询工具
 */
logger.query = (options = {}) => {
    return new Promise((resolve, reject) => {
        const queryOptions = {
            from: options.from || new Date(Date.now() - 24 * 60 * 60 * 1000),
            until: options.until || new Date(),
            limit: options.limit || 100,
            start: options.start || 0,
            order: options.order || 'desc',
            fields: options.fields
        };
        
        logger.query(queryOptions, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * 优雅关闭
 */
logger.close = () => {
    return new Promise((resolve) => {
        logger.info('关闭日志系统...');
        logger.end();
        setTimeout(resolve, 1000);
    });
};

module.exports = logger;

