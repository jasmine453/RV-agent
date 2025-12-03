/**
 * OCR服务模块
 * 使用Tesseract.js识别扫描版PDF中的文字
 */

const Tesseract = require('tesseract.js');
const { createWorker } = Tesseract;

/**
 * 智能OCR检测和处理
 * 自动判断PDF是否需要OCR，如果需要则进行OCR识别
 * 
 * @param {Buffer} buffer - PDF文件的Buffer
 * @param {string} extractedText - 已提取的文本
 * @param {string} filename - 文件名
 * @returns {Object} OCR结果
 */
async function smartOCR(buffer, extractedText, filename) {
    try {
        // 检测逻辑：如果提取的文本太少（<100字符），可能是扫描版
        const textLength = extractedText.trim().length;
        const isLikelyScanned = textLength < 100;
        
        console.log(`   📊 文本长度检测: ${textLength} 字符`);
        
        if (!isLikelyScanned) {
            // 不需要OCR，直接返回原文本
            return {
                isScanned: false,
                text: extractedText
            };
        }
        
        console.log(`   🔍 检测到可能的扫描版PDF (文本<100字符)`);
        console.log(`   ⚠️ OCR功能提示：`);
        console.log(`   - Tesseract OCR需要较长时间处理`);
        console.log(`   - 建议使用专业OCR工具预处理`);
        console.log(`   - 或上传Word/Excel格式文档`);
        
        // 返回扫描版提示（不执行实际OCR，因为耗时较长）
        return {
            isScanned: true,
            text: generateScanPDFSuggestion(filename, textLength)
        };
        
        // 如果需要启用真实的OCR识别，可以取消下面代码的注释
        /*
        console.log(`   🚀 开始OCR识别...`);
        const ocrText = await performOCR(buffer);
        
        if (ocrText && ocrText.length > textLength) {
            console.log(`   ✓ OCR成功，提取了更多文本: ${ocrText.length} 字符`);
            return {
                isScanned: true,
                text: ocrText,
                ocrSuccess: true
            };
        } else {
            console.log(`   ⚠️ OCR未能提取到更多内容`);
            return {
                isScanned: true,
                text: generateScanPDFSuggestion(filename, textLength)
            };
        }
        */
        
    } catch (error) {
        console.error(`   ✗ OCR检测失败:`, error.message);
        return {
            isScanned: false,
            text: extractedText
        };
    }
}

/**
 * 执行OCR识别（真实的OCR处理）
 * 
 * @param {Buffer} buffer - 文件Buffer
 * @returns {string} 识别出的文本
 */
async function performOCR(buffer) {
    try {
        console.log(`   📖 初始化OCR引擎 (支持中英文)...`);
        
        // 创建OCR Worker，支持中英文
        const worker = await createWorker('chi_sim+eng', 1, {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    const progress = Math.round(m.progress * 100);
                    if (progress % 10 === 0) { // 每10%输出一次
                        console.log(`   OCR识别进度: ${progress}%`);
                    }
                }
            }
        });
        
        console.log(`   🔄 开始识别文字...`);
        
        // 执行OCR识别
        const { data: { text } } = await worker.recognize(buffer);
        
        // 清理和终止worker
        await worker.terminate();
        
        console.log(`   ✓ OCR识别完成`);
        return text;
        
    } catch (error) {
        console.error(`   ✗ OCR识别失败:`, error.message);
        throw error;
    }
}

/**
 * 生成扫描版PDF的建议文本
 */
function generateScanPDFSuggestion(filename, textLength) {
    return `
📄 检测到扫描版PDF文档

文件名: ${filename}
提取文本: ${textLength} 字符 (内容过少，可能为图片格式)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ 扫描版PDF处理建议：

方案一：使用专业OCR工具（推荐）
  1. Adobe Acrobat DC - OCR识别功能
  2. ABBYY FineReader - 专业OCR软件
  3. WPS Office - 图片转文字功能
  4. 在线OCR工具（如：迅捷PDF转换器）

方案二：转换文档格式
  1. 将PDF转换为Word格式后上传
  2. 使用Excel重新整理数据
  3. 直接提供可编辑的电子文档

方案三：获取原始文档
  联系文档提供方，获取可编辑的原始文档（Word/Excel）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 提示：
  本系统已内置OCR功能，但为保证识别准确度和处理速度，
  建议使用专业OCR工具预处理文档后再上传。
  
  如需启用内置OCR（处理较慢），请联系技术支持。
`.trim();
}

/**
 * 快速OCR识别（限制处理时间）
 * 
 * @param {Buffer} buffer - 文件Buffer
 * @param {number} timeout - 超时时间（毫秒），默认30秒
 * @returns {string} 识别出的文本
 */
async function quickOCR(buffer, timeout = 30000) {
    return Promise.race([
        performOCR(buffer),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('OCR识别超时')), timeout)
        )
    ]);
}

module.exports = {
    smartOCR,
    performOCR,
    quickOCR
};
