/**
 * 文档解析模块
 * 负责解析各种格式的文档（PDF, Word, Excel）
 */

const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

/**
 * 清理PDF文本中的异常换行 - 增强版
 */
function cleanPDFText(text) {
    if (!text) return text;
    
    // 第一步：先处理明显的格式错误
    let cleaned = text
        // 1. 合并被错误拆分的日期
        .replace(/(\d{4})\s*\n+\s*年\s*\n+\s*(\d{1,2})\s*\n+\s*月\s*\n+\s*(\d{1,2})\s*\n+\s*日/g, '$1年$2月$3日')
        // 更简单的日期格式
        .replace(/(\d{4})年(\d{1,2})\s*\n+\s*月\s*\n+\s*(\d{1,2})\s*\n+\s*日/g, '$1年$2月$3日')
        .replace(/(\d{4})\s*\n+\s*年(\d{1,2})月(\d{1,2})\s*\n+\s*日/g, '$1年$2月$3日')
        
        // 2. 合并被拆分的数字和单位
        .replace(/(\d+[,，]?\d*)\s*\n+\s*(万|亿|元|人|条|项|个|家|次|年|月|日|%|％)/g, '$1$2')
        
        // 3. 合并单独成行的年份（如"2019\n年"）
        .replace(/(\d{4})\s*\n+\s*年/g, '$1年')
        
        // 4. 合并被拆分的百分比（如"55\n%"）
        .replace(/(\d+)\s*\n+\s*(%|％)/g, '$1$2')
        
        // 5. 合并被拆分的货币符号
        .replace(/([￥$€£])\s*\n+\s*(\d)/g, '$1$2')
        
        // 6. 合并"公司"、"有限"等常见词语
        .replace(/(有限)\s*\n+\s*(公司|责任)/g, '$1$2')
        .replace(/(股份)\s*\n+\s*(有限|公司)/g, '$1$2')
        
        // 7. 合并被拆分的序号（如"1\nJasmine"）
        .replace(/(\d+)\s*\n+\s*([A-Za-z])/g, '$1$2');
    
    // 第二步：智能合并短行
    const lines = cleaned.split('\n');
    const merged = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line) {
            // 保留一个空行
            if (merged.length > 0 && merged[merged.length - 1] !== '') {
                merged.push('');
            }
            continue;
        }
        
        // 判断是否是标题或特殊行（应该独立成行）
        const isTitle = /^[一二三四五六七八九十百千]+[、）)]/.test(line) ||
                       /^[（(][一二三四五六七八九十]+[)）]/.test(line) ||
                       /^\d+[、.]/.test(line) ||
                       /^第[一二三四五六七八九十百千]+条/.test(line) ||
                       /[：:]\s*$/.test(line); // 以冒号结尾的标题
        
        // 判断是否是纯年份（如"2019"）
        const isYearOnly = /^\d{4}$/.test(line);
        
        // 判断是否是很短的行（可能需要合并）
        const isShortLine = line.length <= 5 && !isTitle;
        
        if (isYearOnly && merged.length > 0) {
            // 年份单独成行时，尝试与下一行合并
            const nextLine = lines[i + 1]?.trim();
            if (nextLine && /^年/.test(nextLine)) {
                // 下一行是"年..."，跳过当前行，让循环继续处理
                continue;
            } else if (nextLine && nextLine.length < 50) {
                // 与下一行合并
                merged.push(line + nextLine);
                i++; // 跳过下一行
                continue;
            }
        }
        
        if (isShortLine && merged.length > 0 && !isTitle) {
            const lastLine = merged[merged.length - 1];
            // 如果上一行不太长，且当前行很短，尝试合并
            if (lastLine && lastLine.length > 0 && lastLine.length < 80 && !lastLine.endsWith('：') && !lastLine.endsWith(':')) {
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
 * 解析 PDF 文件
 */
async function parsePDF(buffer, filename) {
    try {
        // pdf-parse 1.1.1 版本直接调用即可
        const pdfData = await pdfParse(buffer);
        
        // 清理PDF文本中的异常换行
        const cleanedText = cleanPDFText(pdfData.text);
        
        return {
            success: true,
            text: cleanedText,
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
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            
            allSheetsText += `\n工作表: ${sheetName}\n`;
            allSheetsText += `${'='.repeat(50)}\n`;
            
            jsonData.forEach((row) => {
                if (row.length > 0 && row.some(cell => cell !== '')) {
                    allSheetsText += row.map(cell => cell || '').join('\t') + '\n';
                }
            });
            allSheetsText += '\n';
        });
        
        return {
            success: true,
            text: allSheetsText,
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
        } else {
            // 尝试作为文本文件读取
            result = {
                success: true,
                text: buffer.toString('utf8'),
                filename: originalname
            };
        }
        
        const parseTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`   ✓ 解析成功 (${parseTime}秒)`);
        console.log(`   提取字符数: ${result.text.length}`);
        
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
        
        // 清理格式（合并多余空格）
        extractedText = extractedText.replace(/\s+/g, ' ').trim();
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
        .map(r => `\n文件：${r.filename}\n${r.text}\n`)
        .join('');
    
    return {
        combinedText,
        totalChars,
        files: results
    };
}

module.exports = {
    extractTextFromFile,
    extractTextFromMultipleFiles,
    parsePDF,
    parseWord,
    parseExcel
};

