/**
 * RV-Agent Backend API Server
 * 集成AI API用于文档处理
 */

// 加载环境变量（必须在最开始）
require('dotenv').config();

// 抑制 PDF.js 的 TrueType 字体警告
process.env.PDFJS_DISABLE_FONT_WARNINGS = 'true';

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');

// 导入自定义模块
const { createAIClient, analyzeDocument } = require('./server/aiService');
const { extractTextFromFile, extractTextFromMultipleFiles } = require('./server/documentParser');
const { formatFileSize, formatDate } = require('./server/utils');
const { 
    generateEnterpriseValueChart, 
    generateRiskRadarChart, 
    generateFeasibilityChart,
    generateFinancialDashboardChart
} = require('./server/imageService');

const app = express();
const PORT = process.env.PORT || 3000;

// 配置CORS和中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('.'));

// 过滤 PDF.js 的 TrueType 字体警告
const originalWarn = console.warn;
console.warn = function(...args) {
    const message = args.join(' ');
    // 过滤掉 TrueType 字体相关的警告
    if (message.includes('TT: undefined function') || 
        message.includes('Warning: TT:')) {
        return; // 忽略这些警告
    }
    originalWarn.apply(console, args);
};

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// 配置AI客户端
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) {
    console.error('❌ 错误: DEEPSEEK_API_KEY 未设置');
    console.error('请按照以下步骤配置：');
    console.error('1. 在项目根目录创建 .env 文件');
    console.error('2. 添加配置：DEEPSEEK_API_KEY=你的API密钥');
    console.error('3. 重启服务器');
    console.error('详细说明请查看 配置说明.md 文件');
}

const deepseekClient = DEEPSEEK_API_KEY ? createAIClient(DEEPSEEK_API_KEY) : null;

// 配置文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        const safeName = Buffer.from(name, 'utf8').toString('base64').replace(/[+/=]/g, '');
        cb(null, `${safeName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB限制
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain'  // 添加txt文件支持
        ];
        
        if (allowedTypes.includes(file.mimetype) || 
            file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|txt)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的文件格式。支持：PDF、Word、Excel、TXT'), false);
        }
    }
});

// 创建uploads目录
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
    console.log('✓ 已创建 uploads 目录');
}

// 定期清理临时文件（每小时清理一次超过24小时的文件）
setInterval(() => {
    try {
        const files = fs.readdirSync('uploads');
        const now = Date.now();
        let cleanedCount = 0;
        
        files.forEach(file => {
            if (file === '.gitkeep') return;
            
            const filePath = path.join('uploads', file);
            const stats = fs.statSync(filePath);
            const fileAge = now - stats.mtimeMs;
            
            if (fileAge > 24 * 60 * 60 * 1000) {
                fs.unlinkSync(filePath);
                cleanedCount++;
            }
        });
        
        if (cleanedCount > 0) {
            console.log(`🧹 清理了 ${cleanedCount} 个临时文件`);
        }
    } catch (error) {
        console.error('清理临时文件失败:', error);
    }
}, 60 * 60 * 1000);

// 存储已上传的文件信息
const fileStorage = new Map();

// ============================================
// API 路由
// ============================================

/**
 * 文档上传接口
 */
app.post('/api/upload', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: '没有上传文件'
            });
        }

        const uploadedFiles = req.files.map(file => {
            const fileInfo = {
                originalName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype,
                path: file.path,
                uploadTime: new Date().toISOString()
            };
            fileStorage.set(file.filename, fileInfo);
            return fileInfo;
        });

        console.log(`✓ 成功上传 ${uploadedFiles.length} 个文件`);
        uploadedFiles.forEach(file => {
            console.log(`  - ${file.originalName} (${formatFileSize(file.size)})`);
        });

        res.json({
            success: true,
            message: `成功上传 ${uploadedFiles.length} 个文件`,
            files: uploadedFiles
        });

    } catch (error) {
        console.error('❌ 文件上传失败:', error);
        res.status(500).json({
            success: false,
            message: '文件上传失败',
            error: error.message
        });
    }
});

/**
 * 文档分析接口
 */
app.post('/api/analyze', async (req, res) => {
    const startTime = Date.now();
    try {
        // 检查API密钥是否配置
        if (!deepseekClient) {
            return res.status(500).json({
                success: false,
                message: 'API密钥未配置',
                error: 'DEEPSEEK_API_KEY未设置',
                errorDetails: '请在项目根目录创建.env文件，并添加配置：DEEPSEEK_API_KEY=你的API密钥\n\n详细说明请查看 配置说明.md 文件'
            });
        }

        const { files, analysisType } = req.body;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: '请先上传文件'
            });
        }

        console.log(`\n${'='.repeat(50)}`);
        console.log(`🤖 开始AI分析`);
        console.log(`📋 分析类型: ${analysisType}`);
        console.log(`📁 文件数量: ${files.length}`);
        
        // 从文件中提取文本
        const { combinedText, totalChars } = await extractTextFromMultipleFiles(files);

        // 使用AI分析
        console.log(`⏳ 调用AI服务进行分析...`);
        const analysisResult = await analyzeDocument(deepseekClient, combinedText, analysisType);

        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

        if (analysisResult.success) {
            console.log(`✓ 分析完成 (耗时: ${elapsedTime}秒)`);
            console.log(`📝 生成内容长度: ${analysisResult.analysis.length} 字符`);
            console.log(`${'='.repeat(50)}\n`);
            
            res.json({
                success: true,
                message: '分析完成',
                result: analysisResult.analysis,
                usage: analysisResult.usage,
                processingTime: elapsedTime
            });
        } else {
            console.log(`❌ 分析失败 (耗时: ${elapsedTime}秒)`);
            console.log(`错误类型: ${analysisResult.errorType}`);
            console.log(`${'='.repeat(50)}\n`);
            
            res.status(500).json({
                success: false,
                message: analysisResult.error || 'AI分析失败',
                errorType: analysisResult.errorType || 'unknown',
                errorDetails: analysisResult.errorDetails || '未知错误',
                fullError: analysisResult.fullError || ''
            });
        }

    } catch (error) {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.error(`❌ 文档分析异常 (耗时: ${elapsedTime}秒):`, error.message);
        console.log(`${'='.repeat(50)}\n`);
        
        let errorType = 'unknown';
        let errorDetails = '文档分析过程中发生错误';
        
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
            errorType = 'timeout';
            errorDetails = '请求超时，可能是文档内容过大或网络连接较慢';
        } else if (error.message.includes('ENOENT') || error.message.includes('文件')) {
            errorType = 'file';
            errorDetails = '文件读取失败，请检查上传的文件是否完整';
        } else if (error.message.includes('ECONNREFUSED')) {
            errorType = 'network';
            errorDetails = '无法连接到AI服务，请检查网络连接';
        } else {
            errorDetails = error.message;
        }
        
        res.status(500).json({
            success: false,
            message: '文档分析失败',
            errorType: errorType,
            errorDetails: errorDetails,
            fullError: error.message,
            processingTime: elapsedTime
        });
    }
});

/**
 * 文档预览接口
 */
app.post('/api/preview', async (req, res) => {
    try {
        const { files } = req.body;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: '请先上传文件'
            });
        }

        console.log(`开始预览文档，文件数量：${files.length}`);
        
        const previews = [];
        for (const file of files) {
            try {
                const extractedText = await extractTextFromFile(file.path, file.mimetype, file.originalName);
                
                previews.push({
                    filename: file.originalName,
                    size: file.size,
                    mimetype: file.mimetype,
                    content: extractedText,
                    fullLength: extractedText.length
                });
                
            } catch (error) {
                console.error(`文件 ${file.originalName} 预览失败:`, error);
                previews.push({
                    filename: file.originalName,
                    size: file.size,
                    mimetype: file.mimetype,
                    content: `文档预览失败: ${error.message}`,
                    error: true
                });
            }
        }

        res.json({
            success: true,
            message: `成功预览 ${previews.length} 个文档`,
            previews: previews
        });

    } catch (error) {
        console.error('文档预览失败:', error);
        res.status(500).json({
            success: false,
            message: '文档预览失败',
            error: error.message
        });
    }
});

/**
 * 生成Word文档接口
 */
/**
 * 解析文本行，识别待补充标记并生成TextRun数组
 */
function parseLineWithHighlights(text) {
    const runs = [];
    const regex = /(\[待补充\]|\[请补充[^\]]+\])/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        // 添加标记前的普通文本
        if (match.index > lastIndex) {
            runs.push(new TextRun({
                text: text.substring(lastIndex, match.index),
                font: 'Microsoft YaHei',
                size: 22 // 11pt，标准正文大小
            }));
        }
        
        // 添加标记的待补充内容（低调灰色样式）
        runs.push(new TextRun({
            text: match[0],
            font: 'Microsoft YaHei',
            size: 22, // 11pt
            color: '666666', // 灰色
            highlight: 'lightGray' // 浅灰色高亮
        }));
        
        lastIndex = match.index + match[0].length;
    }
    
    // 添加剩余的普通文本
    if (lastIndex < text.length) {
        runs.push(new TextRun({
            text: text.substring(lastIndex),
            font: 'Microsoft YaHei',
            size: 22 // 11pt，标准正文大小
        }));
    }
    
    return runs.length > 0 ? runs : [new TextRun({ text: text, font: 'Microsoft YaHei', size: 22 })];
}

/**
 * 检测是否是表格行 (优化版)
 */
function isTableLine(line) {
    return /\t|^[^\s]+\s{2,}[^\s]+/.test(line);
}

/**
 * 解析表格并生成Word表格 (优化版)
 */
function parseTable(lines) {
    const rows = lines
        .map(line => (line.includes('\t') ? line.split('\t') : line.split(/\s{2,}/))
            .map(cell => cell.trim())
            .filter(cell => cell))
        .filter(row => row.length > 0);
    
    if (rows.length === 0) return null;
    
    const maxColumns = Math.max(...rows.map(row => row.length));
    const borderStyle = { style: BorderStyle.SINGLE, size: 2, color: '000000' };
    
    const tableRows = rows.map((row, rowIndex) => {
        while (row.length < maxColumns) row.push('');
        
        return new TableRow({
            children: row.map(cell => new TableCell({
                children: [new Paragraph({
                    children: parseLineWithHighlights(cell),
                    alignment: AlignmentType.CENTER
                })],
                shading: {
                    fill: rowIndex === 0 ? '000000' : (rowIndex % 2 === 1 ? 'F5F5F5' : 'FFFFFF')
                },
                borders: {
                    top: borderStyle,
                    bottom: borderStyle,
                    left: borderStyle,
                    right: borderStyle
                }
            }))
        });
    });
    
    return new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE }
    });
}

app.post('/api/generate-word', async (req, res) => {
    try {
        const { content, filename } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: '内容不能为空'
            });
        }

        // 将文本内容转换为Word文档格式
        const lines = content.split('\n');
        const children = [];
        let i = 0;

        while (i < lines.length) {
            const trimmedLine = lines[i].trim();
            
            if (!trimmedLine) {
                children.push(new Paragraph({ text: '', spacing: { after: 120, before: 0 }}));
                i++;
                continue;
            }
            
            // 检测表格
            if (isTableLine(trimmedLine)) {
                const tableLines = [];
                let j = i;
                
                while (j < lines.length && (isTableLine(lines[j].trim()) || !lines[j].trim())) {
                    if (lines[j].trim()) {
                        tableLines.push(lines[j].trim());
                    }
                    j++;
                }
                
                if (tableLines.length >= 2) {
                    const table = parseTable(tableLines);
                    if (table) {
                        children.push(table);
                        children.push(new Paragraph({ text: '', spacing: { after: 200 }}));
                        i = j;
                        continue;
                    }
                }
            }
            
            // 判断标题级别并应用相应格式
            let paragraph;
            
            // 1. 公司名称标题（居中，大字号）
            if (trimmedLine.includes('有限公司') && !trimmedLine.includes('重整计划草案') && lines.indexOf(lines[i]) < 5) {
                paragraph = new Paragraph({
                    children: parseLineWithHighlights(trimmedLine).map(run => {
                        run.size = 32; // 16pt
                        run.bold = true;
                        return run;
                    }),
                    spacing: { after: 200, before: 0 },
                    alignment: AlignmentType.CENTER
                });
            }
            // 2. 重整计划草案标题（居中）
            else if (trimmedLine === '重整计划草案' || trimmedLine === '预重整方案' || trimmedLine === '庭外重组协议') {
                paragraph = new Paragraph({
                    children: [new TextRun({ text: trimmedLine, font: 'Microsoft YaHei', size: 28, bold: true })], // 14pt
                    spacing: { after: 200, before: 0 },
                    alignment: AlignmentType.CENTER
                });
            }
            // 3. 日期（居中）
            else if (/^二〇二[〇一二三四五六七八九十]+年[一二三四五六七八九十]+月[一二三四五六七八九十]+日$/.test(trimmedLine)) {
                paragraph = new Paragraph({
                    children: [new TextRun({ text: trimmedLine, font: 'Microsoft YaHei', size: 28 })], // 14pt
                    spacing: { after: 300, before: 0 },
                    alignment: AlignmentType.CENTER
                });
            }
            // 4. 一级标题：一、二、三、等（加粗，左对齐）
            else if (/^[一二三四五六七八九十百]+[、]/.test(trimmedLine)) {
                paragraph = new Paragraph({
                    children: parseLineWithHighlights(trimmedLine).map(run => {
                        run.size = 28; // 14pt
                        run.bold = true;
                        return run;
                    }),
                    spacing: { after: 200, before: 200 },
                    alignment: AlignmentType.LEFT
                });
            }
            // 5. 二级标题：（一）（二）（三）等（加粗，左对齐，缩进）
            else if (/^（[一二三四五六七八九十]+）/.test(trimmedLine)) {
                paragraph = new Paragraph({
                    children: parseLineWithHighlights(trimmedLine).map(run => {
                        run.size = 24; // 12pt
                        run.bold = true;
                        return run;
                    }),
                    spacing: { after: 150, before: 150 },
                    alignment: AlignmentType.LEFT,
                    indent: { left: 420 } // 缩进
                });
            }
            // 6. 三级标题：1. 2. 3. 或 1、2、3、（普通，左对齐，缩进）
            else if (/^[0-9]+[、\.]/.test(trimmedLine)) {
                paragraph = new Paragraph({
                    children: parseLineWithHighlights(trimmedLine).map(run => {
                        run.size = 22; // 11pt
                        run.bold = false;
                        return run;
                    }),
                    spacing: { after: 120, before: 120 },
                    alignment: AlignmentType.LEFT,
                    indent: { left: 720 } // 更深缩进
                });
            }
            // 7. 普通正文段落（左对齐或首行缩进）
            else {
                paragraph = new Paragraph({
                    children: parseLineWithHighlights(trimmedLine),
                    spacing: { after: 150, before: 0 },
                    alignment: AlignmentType.LEFT,
                    indent: { firstLine: 480 } // 首行缩进2字符
                });
            }
            
            children.push(paragraph);
            i++;
        }

        // 创建Word文档
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        size: {
                            orientation: 'portrait',
                            width: 11906,
                            height: 16838
                        },
                        margins: {
                            top: 1440,
                            right: 1440,
                            bottom: 1440,
                            left: 1440
                        }
                    }
                },
                children: children
            }]
        });

        // 生成Word文档Buffer
        const buffer = await Packer.toBuffer(doc);

        // 设置响应头
        const downloadFilename = filename || '预重整方案.docx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFilename)}"`);
        
        res.send(buffer);

    } catch (error) {
        console.error('生成Word文档失败:', error);
        res.status(500).json({
            success: false,
            message: '生成Word文档失败',
            error: error.message
        });
    }
});

/**
 * 下载/查看文档接口
 */
app.get('/api/download/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const file = fileStorage.get(filename);
        
        if (!file) {
            return res.status(404).json({
                success: false,
                message: '文件不存在或已过期'
            });
        }

        const filePath = path.join(__dirname, file.path);
        
        if (!fs.existsSync(filePath)) {
            fileStorage.delete(filename);
            return res.status(404).json({
                success: false,
                message: '文件已删除或不存在'
            });
        }

        // 设置响应头
        const encodedFilename = encodeURIComponent(file.originalName);
        res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodedFilename}`);
        
        const ext = path.extname(file.originalName).toLowerCase();
        let contentType = file.mimetype || 'application/octet-stream';
        
        if (ext === '.pdf') {
            contentType = 'application/pdf';
        } else if (ext === '.docx') {
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (ext === '.doc') {
            contentType = 'application/msword';
        } else if (ext === '.xlsx') {
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (ext === '.xls') {
            contentType = 'application/vnd.ms-excel';
        }
        
        res.setHeader('Content-Type', contentType);
        res.sendFile(path.resolve(filePath));
        
    } catch (error) {
        console.error('文件下载失败:', error);
        res.status(500).json({
            success: false,
            message: '文件下载失败',
            error: error.message
        });
    }
});

/**
 * 图片生成接口 - 企业价值分析图表
 */
app.post('/api/generate-chart/enterprise-value', async (req, res) => {
    try {
        console.log('🎨 开始生成企业价值分析图表...');
        console.log('请求数据:', req.body);
        
        const { analysisData } = req.body;
        
        const result = await generateEnterpriseValueChart(analysisData);
        
        console.log('API返回结果:', result);
        
        if (result.success) {
            console.log('✓ 企业价值分析图表生成成功');
            res.json({
                success: true,
                images: result.images,
                message: '图表生成成功'
            });
        } else {
            throw new Error(result.error || 'API返回失败');
        }
    } catch (error) {
        console.error('❌ 图表生成失败:', error);
        console.error('错误详情:', error.details || error.message);
        res.status(500).json({
            success: false,
            message: '图表生成失败',
            error: error.message || '未知错误',
            details: error.details || ''
        });
    }
});

/**
 * 图片生成接口 - 风险指标雷达图
 */
app.post('/api/generate-chart/risk-radar', async (req, res) => {
    try {
        console.log('🎨 开始生成风险指标雷达图...');
        console.log('请求数据:', req.body);
        
        const { riskData } = req.body;
        
        const result = await generateRiskRadarChart(riskData);
        
        console.log('API返回结果:', result);
        
        if (result.success) {
            console.log('✓ 风险指标雷达图生成成功');
            res.json({
                success: true,
                images: result.images,
                message: '图表生成成功'
            });
        } else {
            throw new Error(result.error || 'API返回失败');
        }
    } catch (error) {
        console.error('❌ 图表生成失败:', error);
        console.error('错误详情:', error.details || error.message);
        res.status(500).json({
            success: false,
            message: '图表生成失败',
            error: error.message || '未知错误',
            details: error.details || ''
        });
    }
});

/**
 * 图片生成接口 - 可行性分析图表
 */
app.post('/api/generate-chart/feasibility', async (req, res) => {
    try {
        console.log('🎨 开始生成可行性分析图表...');
        console.log('请求数据:', req.body);
        
        const { feasibilityScore, analysisData } = req.body;
        
        const result = await generateFeasibilityChart(feasibilityScore, analysisData);
        
        console.log('API返回结果:', result);
        
        if (result.success) {
            console.log('✓ 可行性分析图表生成成功');
            res.json({
                success: true,
                images: result.images,
                message: '图表生成成功'
            });
        } else {
            throw new Error(result.error || 'API返回失败');
        }
    } catch (error) {
        console.error('❌ 图表生成失败:', error);
        console.error('错误详情:', error.details || error.message);
        res.status(500).json({
            success: false,
            message: '图表生成失败',
            error: error.message || '未知错误',
            details: error.details || ''
        });
    }
});

/**
 * 图片生成接口 - 公司年终财务数据看板
 */
app.post('/api/generate-chart/financial-dashboard', async (req, res) => {
    try {
        console.log('🎨 开始生成公司年终财务数据看板...');
        console.log('请求数据:', req.body);
        
        const { analysisData } = req.body;
        
        const result = await generateFinancialDashboardChart(analysisData);
        
        console.log('API返回结果:', result);
        
        if (result.success) {
            console.log('✓ 公司年终财务数据看板生成成功');
            res.json({
                success: true,
                images: result.images,
                message: '图表生成成功'
            });
        } else {
            throw new Error(result.error || 'API返回失败');
        }
    } catch (error) {
        console.error('❌ 图表生成失败:', error);
        console.error('错误详情:', error.details || error.message);
        res.status(500).json({
            success: false,
            message: '图表生成失败',
            error: error.message || '未知错误',
            details: error.details || ''
        });
    }
});

/**
 * 健康检查接口
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'RV-Agent API服务运行正常',
        timestamp: new Date().toISOString()
    });
});

/**
 * 静态文件服务
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
const server = app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 RV-Agent API服务已启动`);
    console.log(`📡 服务地址: http://localhost:${PORT}`);
    console.log(`🔗 API地址: http://localhost:${PORT}/api`);
    console.log(`🤖 AI API已集成 (DeepSeek)`);
    console.log(`📁 上传目录: ./uploads`);
    console.log(`⏰ 当前时间: ${formatDate()}`);
    console.log(`${'='.repeat(50)}\n`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('⏹️  收到 SIGTERM 信号，正在关闭服务器...');
    server.close(() => {
        console.log('✓ 服务器已关闭');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n⏹️  收到 SIGINT 信号，正在关闭服务器...');
    server.close(() => {
        console.log('✓ 服务器已关闭');
        process.exit(0);
    });
});

// 错误处理
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: error.message
    });
});

module.exports = app;
