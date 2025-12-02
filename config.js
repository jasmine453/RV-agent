/**
 * RV-Agent 配置文件
 * 集中管理系统配置参数
 */

module.exports = {
    // 服务器配置
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        environment: process.env.NODE_ENV || 'development'
    },
    
    // AI API配置
    ai: {
        provider: 'deepseek',
        apiKey: process.env.DEEPSEEK_API_KEY || '',
        baseURL: 'https://api.deepseek.com',
        timeout: 300000, // 5分钟
        maxRetries: 2,
        models: {
            chat: 'deepseek-chat'
        },
        maxTokens: {
            default: 4000,
            'pre-restructure-plan': 8000,
            'outside-agreement': 8000,
            'meeting-report': 8000
        }
    },
    
    // 豆包图片生成API配置
    doubao: {
        apiKey: process.env.DOUBAO_API_KEY || '',
        baseURL: 'https://ark.cn-beijing.volces.com',
        model: 'doubao-seedream-4-0-250828',
        defaultSize: '2K',
        timeout: 120000 // 2分钟
    },
    
    // 文件上传配置
    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
        uploadDir: 'uploads',
        allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
        // 临时文件保留时间（毫秒）
        fileRetentionTime: 24 * 60 * 60 * 1000 // 24小时
    },
    
    // 分析类型配置
    analysisTypes: {
        'enterprise-value': '企业价值分析',
        'risk-indicators': '风险指标提取',
        'restructure-feasibility': '重组可行性研究',
        'outside-agreement': '庭外重组协议生成',
        'pre-restructure-plan': '预重整方案生成',
        'meeting-report': '债权人会议报告生成',
        'meeting-fields': '会议字段提取'
    },
    
    // 日志配置
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        enableConsole: true,
        enableFile: false,
        logDir: 'logs'
    },
    
    // CORS配置
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },
    
    // 安全配置
    security: {
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15分钟
            max: 100 // 最多100个请求
        }
    }
};

