/**
 * 文档解析模块
 * 负责解析各种格式的文档（PDF, Word, Excel）
 * 支持OCR识别扫描版PDF
 */

const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const Tesseract = require('tesseract.js');
const { createWorker } = Tesseract;
const { smartOCR } = require('./ocrService');

/**
 * 清理PDF文本中的异常换行 - 优化版
 */
function cleanPDFText(text) {
    if (!text) return text;
    
    // 第一步：使用优化的正则表达式批量处理格式错误
    let cleaned = text
        // 日期格式修复 (合并为一个通用模式)
        .replace(/(\d{4})\s*\n*\s*年\s*\n*\s*(\d{1,2})\s*\n*\s*月\s*\n*\s*(\d{1,2})\s*\n*\s*日/g, '$1年$2月$3日')
        // 数字单位修复
        .replace(/(\d+[,，]?\d*)\s*\n+\s*(万|亿|元|人|条|项|个|家|次|年|月|日|%|％)/g, '$1$2')
        // 货币符号修复
        .replace(/([￥$€£])\s*\n+\s*(\d)/g, '$1$2')
        // 公司名称修复
        .replace(/(有限|股份)\s*\n+\s*(公司|责任|有限)/g, '$1$2')
        // 序号修复
        .replace(/(\d+)\s*\n+\s*([A-Za-z])/g, '$1$2');
    
    // 第二步：智能合并短行 (简化逻辑)
    const lines = cleaned.split('\n');
    const merged = [];
    
    const isTitlePattern = /^([一二三四五六七八九十百千]+[、）)]|[（(][一二三四五六七八九十]+[)）]|\d+[、.]|第[一二三四五六七八九十百千]+条)|[：:]\s*$/;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line) {
            if (merged.length > 0 && merged[merged.length - 1] !== '') {
                merged.push('');
            }
            continue;
        }
        
        const isTitle = isTitlePattern.test(line);
        const isShortLine = line.length <= 5 && !isTitle;
        
        // 短行合并逻辑
        if (isShortLine && merged.length > 0) {
            const lastLine = merged[merged.length - 1];
            if (lastLine && lastLine.length < 80 && !/[：:]$/.test(lastLine)) {
                merged[merged.length - 1] = lastLine + line;
                continue;
            }
        }
        
        merged.push(line);
    }
    
    // 第三步：后处理
    return merged.join('\n')
        // 确保标题前后有适当的空行
        .replace(/([。！？；])\n([一二三四五六七八九十百千]+、)/g, '$1\n\n$2')
        .replace(/([。！？；])\n([（(][一二三四五六七八九十]+[)）])/g, '$1\n\n$2')
        
        // 清理多余的空行
        .replace(/\n{3,}/g, '\n\n')
        
        .trim();
}

/**
 * 解析 PDF 文件（带OCR支持）
 */
async function parsePDF(buffer, filename) {
    try {
        // pdf-parse 1.1.1 版本直接调用即可
        const pdfData = await pdfParse(buffer);
        
        // 清理PDF文本中的异常换行
        const cleanedText = cleanPDFText(pdfData.text);
        
        // 🔍 智能OCR检测：如果提取的文本很少，可能是扫描版PDF
        const ocrResult = await smartOCR(buffer, cleanedText, filename);
        
        if (ocrResult.isScanned) {
            // 这是扫描版PDF，返回提示信息
            console.log('   📝 返回扫描版PDF处理建议');
            return {
                success: false,
                text: ocrResult.text,
                pages: pdfData.numpages,
                filename,
                isScanned: true,
                needOCR: true
            };
        }
        
        // 正常的文本型PDF
        return {
            success: true,
            text: ocrResult.text || cleanedText,
            pages: pdfData.numpages,
            filename
        };
    } catch (error) {
        throw new Error(`PDF解析失败: ${error.message}。请确保PDF文件未加密且格式正确。`);
    }
}

/**
 * 解析 Word 文档
 */
async function parseWord(buffer, filename) {
    try {
        const result = await mammoth.extractRawText({ buffer: buffer });
        
        // 清理Word文本（使用相同的清理函数）
        const cleanedText = cleanPDFText(result.value);
        
        return {
            success: true,
            text: cleanedText,
            warnings: result.messages || [],
            filename
        };
    } catch (error) {
        throw new Error(`Word文档解析失败: ${error.message}`);
    }
}

/**
 * 解析 Excel 文件
 */
async function parseExcel(buffer, filename) {
    try {
        const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
        const sheetNames = workbook.SheetNames;
        let allSheetsText = '';
        
        sheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });
            
            allSheetsText += `\n【工作表: ${sheetName}】\n`;
            allSheetsText += `${'═'.repeat(60)}\n\n`;
            
            jsonData.forEach((row, rowIndex) => {
                if (row.length > 0 && row.some(cell => cell !== '' && cell !== null && cell !== undefined)) {
                    // 格式化每一行，使用更清晰的分隔符
                    const formattedRow = row.map((cell, colIndex) => {
                        // 处理空值
                        if (cell === '' || cell === null || cell === undefined) {
                            return '-';
                        }
                        // 处理日期对象
                        if (cell instanceof Date) {
                            return cell.toLocaleDateString('zh-CN');
                        }
                        // 处理数字格式
                        if (typeof cell === 'number') {
                            // 如果是大数字，保留2位小数
                            if (Math.abs(cell) > 1000) {
                                return cell.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            }
                            return cell.toString();
                        }
                        return cell.toString().trim();
                    }).filter(cell => cell !== '-' || row.some(c => c !== '' && c !== null)); // 过滤全空行
                    
                    // 只输出有内容的行
                    if (formattedRow.some(cell => cell !== '-')) {
                        allSheetsText += formattedRow.join('  |  ') + '\n';
                    }
                }
            });
            allSheetsText += '\n' + '─'.repeat(60) + '\n\n';
        });
        
        return {
            success: true,
            text: allSheetsText.trim(),
            sheets: sheetNames.length,
            filename
        };
    } catch (error) {
        throw new Error(`Excel文件解析失败: ${error.message}`);
    }
}

/**
 * 主文档解析函数
 */
async function extractTextFromFile(filepath, mimetype, originalname) {
    const startTime = Date.now();
    
    try {
        console.log(`📄 开始解析文件: ${originalname}`);
        console.log(`   类型: ${mimetype}`);
        
        // 检查文件是否存在
        if (!fs.existsSync(filepath)) {
            throw new Error('文件不存在或已被删除');
        }
        
        const buffer = fs.readFileSync(filepath);
        const fileSize = (buffer.length / 1024).toFixed(2);
        console.log(`   大小: ${fileSize} KB`);
        
        let result;
        
        // 根据文件类型选择解析器
        if (mimetype.includes('pdf') || originalname.toLowerCase().endsWith('.pdf')) {
            result = await parsePDF(buffer, originalname);
        } else if (mimetype.includes('word') || originalname.match(/\.(doc|docx)$/i)) {
            result = await parseWord(buffer, originalname);
        } else if (mimetype.includes('sheet') || mimetype.includes('excel') || originalname.match(/\.(xls|xlsx)$/i)) {
            result = await parseExcel(buffer, originalname);
        } else if (mimetype.includes('text') || originalname.toLowerCase().endsWith('.txt')) {
            // TXT文本文件解析
            console.log(`   📝 检测到TXT文本文件`);
            const text = buffer.toString('utf8');
            result = {
                success: true,
                text: text,
                filename: originalname
            };
            console.log(`   ✓ TXT文件读取成功`);
        } else {
            // 尝试作为文本文件读取（兜底处理）
            console.log(`   ⚠️ 未知文件类型，尝试按文本文件读取`);
            result = {
                success: true,
                text: buffer.toString('utf8'),
                filename: originalname
            };
        }
        
        const parseTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`   ✓ 解析成功 (${parseTime}秒)`);
        console.log(`   提取字符数: ${result.text.length}`);
        
        // 检查是否为扫描版PDF（已由OCR模块处理）
        if (result.isScanned || result.needOCR) {
            console.warn(`   🔍 检测到扫描版PDF: ${originalname}`);
            return result.text; // 返回OCR提示信息
        }
        
        // 检查提取的文本是否为空
        if (!result.text || result.text.trim().length === 0) {
            console.warn(`   ⚠️ 警告: 文件解析成功但未提取到任何文本内容`);
            return `文件"${originalname}"解析成功，但未能提取到任何文本内容。\n可能原因：\n1. 文件是图片型PDF或扫描件\n2. 文件内容为空\n3. 文件格式不标准`;
        }
        
        return result.text;
        
    } catch (error) {
        const parseTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.error(`   ✗ 文档解析失败 (${parseTime}秒):`, error.message);
        
        return `文档解析失败\n\n文件名: ${originalname}\n文件类型: ${mimetype}\n错误原因: ${error.message}\n\n建议：\n1. 确保文件格式正确且未损坏\n2. 如果是PDF，请确保不是扫描版或加密文件\n3. 尝试重新保存文件或转换格式后再上传`;
    }
}

/**
 * 批量解析多个文件
 */
async function extractTextFromMultipleFiles(files) {
    const results = [];
    let totalChars = 0;
    
    for (const file of files) {
        console.log(`📄 解析文件: ${file.originalName}`);
        let extractedText = await extractTextFromFile(file.path, file.mimetype, file.originalName);
        
        // 只清理多余的空行，保留换行符和单个空格
        extractedText = extractedText
            .replace(/[ \t]+/g, ' ')  // 只合并空格和tab，不处理换行
            .replace(/\n{3,}/g, '\n\n') // 最多保留2个连续换行
            .trim();
        
        totalChars += extractedText.length;
        
        results.push({
            filename: file.originalName,
            text: extractedText,
            length: extractedText.length
        });
    }
    
    console.log(`📊 提取文本总字符数: ${totalChars}`);
    
    // 合并所有文本
    const combinedText = results
        .map(r => `\n文件：${r.filename}\n${'-'.repeat(50)}\n${r.text}\n`)
        .join('\n');
    
    return {
        combinedText,
        totalChars,
        files: results
    };
}

module.exports = {
    extractTextFromFile,
    extractTextFromMultipleFiles,
    parsePDF  // 用于prompts.js加载模板
};

