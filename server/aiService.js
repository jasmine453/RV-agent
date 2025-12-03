/**
 * AI 服务模块
 * 负责与 DeepSeek API 交互
 */

const { OpenAI } = require('openai');
const { getPrompt, getTimeoutConfig } = require('./prompts');
const { cleanMarkdownSymbols } = require('./utils');

/**
 * 检查并处理未替换的占位符 (优化版)
 */
function checkAndReplacePlaceholders(text) {
    if (!text) return text;
    
    const hasPlaceholders = /XXX+|XX(?![一二三四五六七八九十])|_{3,}/.test(text);
    
    if (hasPlaceholders) {
        console.warn('⚠️ 检测到未替换的占位符，正在自动处理...');
        
        const replacements = {
            '公司名称[：:]\\s*XXX+': '公司名称：[请补充公司名称]',
            '(债务人|管理人|律师事务所|会计师事务所)XXX+': '$1[请补充名称]',
            '法定代表人[：:]\\s*XX(?![一二三四五六七八九十])': '法定代表人：[请补充姓名]',
            '注册资本[：:]\\s*XXX+': '注册资本：[请补充金额]',
            '注册地址[：:]\\s*XXX+': '注册地址：[请补充地址]',
            'XXX+年XX月XX日': '[待补充日期]',
            'XXX+有限公司': '[请补充公司名称]有限公司',
            'XXX+(?=万元|亿元|元)': '[请补充金额]'
        };
        
        Object.entries(replacements).forEach(([pattern, replacement]) => {
            text = text.replace(new RegExp(pattern, 'g'), replacement);
        });
        
        // 通用替换
        text = text
            .replace(/XXX+/g, '[待补充]')
            .replace(/XX(?![一二三四五六七八九十年月日])/g, '[待补充]')
            .replace(/_{3,}/g, '[待补充]');
        
        console.log('✓ 已将占位符替换为明确提示');
    }
    
    return text;
}

/**
 * 智能格式化 - 只修复明显的格式问题
 * 保持AI输出的原有段落结构，只做必要的修复
 */
function forceFormatLegalDocument(text) {
    const lines = text.split('\n');
    const avgLineLength = text.length / lines.length;
    
    // 如果平均行长度太短（<20字符），说明断行过度，需要合并
    // 如果平均行长度太长（>200字符），说明断行不足，需要拆分
    if (avgLineLength < 20) {
        console.log('⚠️ 检测到过度断行，执行段落合并...');
        return smartMergeLines(text);
    } else if (avgLineLength > 200 || lines.length < 10) {
        console.log('⚠️ 检测到断行不足，执行智能分段...');
        return smartSplitLines(text);
    } else {
        console.log('✓ 文档格式正常，仅执行轻量清理...');
        return lightClean(text);
    }
}

/**
 * 智能合并过度断行的文本 (优化版)
 */
function smartMergeLines(text) {
    const titlePattern = /^([一二三四五六七八九十百千]+、|[（(][一二三四五六七八九十]+[)）]|第[一二三四五六七八九十百千]+条|目录|释义|说明|前言|摘要|正文)/;
    
    const result = text
        .replace(/([释义说明前言摘要正文])\s*\.{2,}\s*\d+/g, '$1')
        .split('\n')
        .reduce((acc, line) => {
            const trimmed = line.trim();
            if (!trimmed) {
                acc.push('');
                return acc;
            }
            
            const isTitle = titlePattern.test(trimmed);
            const lastLine = acc[acc.length - 1];
            
            if (!isTitle && lastLine && lastLine.length < 50 && !/[。！？；：]$/.test(lastLine)) {
                acc[acc.length - 1] = lastLine + trimmed;
            } else {
                acc.push(trimmed);
            }
            
            return acc;
        }, [])
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
    
    console.log(`  段落合并：${text.split('\n').length}行 → ${result.split('\n').length}行`);
    return result;
}

/**
 * 智能拆分断行不足的文本 (优化版)
 */
function smartSplitLines(text) {
    const result = text
        .replace(/([释义说明前言摘要正文])\s*\.{2,}\s*\d+/g, '$1')
        .replace(/(有限公司|股份有限公司)(重整计划草案|庭外重组协议|债权人会议)/g, '$1\n\n$2')
        .replace(/([。！？；])\s*([一二三四五六七八九十百千]+、|[（(][一二三四五六七八九十]+[)）]|第[一二三四五六七八九十百千]+条)/g, '$1\n\n$2')
        .replace(/(目录|释义|说明|前言|摘要)\s+/g, '$1\n\n')
        .replace(/(\d{4}年\d+月\d+日)/g, '$1\n\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/ {2,}/g, ' ')
        .trim();
    
    console.log(`  智能分段：${text.split('\n').length}行 → ${result.split('\n').length}行`);
    return result;
}

/**
 * 轻量清理 - 格式已经不错时使用
 */
function lightClean(text) {
    return text
        // 移除目录页码
        .replace(/([释义说明前言摘要正文])\s*\.{2,}\s*\d+/g, '$1')
        .replace(/([一二三四五六七八九十百千]+、[^。\n]+?)\.{2,}\s*\d+/g, '$1')
        
        // 清理多余空格和换行
        .replace(/\n{4,}/g, '\n\n')
        .replace(/ {2,}/g, ' ')
        .trim();
}

/**
 * 初始化 AI 客户端
 */
function createAIClient(apiKey) {
    if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY 未设置');
    }
    
    return new OpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com',
        // 为了支持长文档和长模板场景，将底层HTTP超时时间提升到10分钟，避免在我们自己的超时控制之前被切断
        timeout: 600000, // 10分钟超时（与长文本类型的超时配置保持一致）
        maxRetries: 2
    });
}

/**
 * 解析 AI API 错误
 */
function parseAIError(error, analysisType) {
    const errorDetails = {
        type: 'unknown',
        message: error.message || '未知错误',
        details: ''
    };

    // 根据当前分析类型动态计算超时时间（分钟），避免文案和真实配置不一致
    const { timeout } = getTimeoutConfig(analysisType || '');
    const timeoutMinutes = Math.max(1, Math.round(timeout / 60000));

    if (error.name === 'AbortError' || error.name === 'TimeoutError' || 
        error.message.includes('timeout') || error.message.includes('timed out')) {
        errorDetails.type = 'timeout';
        errorDetails.message = '请求超时';
        if (analysisType === 'pre-restructure-plan' || analysisType === 'outside-agreement') {
            errorDetails.details = `长文档生成需要较长时间（通常需要数分钟），但本次请求已超过${timeoutMinutes}分钟的超时限制。\n\n可能的原因：\n1. 文档内容或模板过大，处理时间较长\n2. AI服务响应较慢\n3. 网络连接不稳定\n\n建议：\n- 请稍后重试\n- 如经常超时，可考虑拆分文档或精简模板\n- 检查网络连接是否稳定`;
        } else {
            errorDetails.details = `AI分析请求超时（超过${timeoutMinutes}分钟）。\n\n可能的原因：\n1. 文档内容过大，处理时间较长\n2. 网络连接较慢\n3. AI服务响应较慢\n\n建议：\n- 请稍后重试\n- 尝试上传较小的文档`;
        }
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorDetails.type = 'auth';
        errorDetails.message = 'API密钥错误';
        errorDetails.details = '请检查DEEPSEEK_API_KEY环境变量是否正确配置。';
    } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        errorDetails.type = 'rate_limit';
        errorDetails.message = '请求频率过高';
        errorDetails.details = 'API调用频率超过限制，请稍后再试。';
    } else if (error.message.includes('ECONNRESET')) {
        errorDetails.type = 'connection_reset';
        errorDetails.message = '连接被重置';
        errorDetails.details = `与AI服务的连接被中断。\n\n可能的原因：\n1. API密钥未配置或无效 - 请检查.env文件中的DEEPSEEK_API_KEY\n2. 网络连接不稳定\n3. 防火墙或代理阻止了连接\n4. DeepSeek服务暂时不可用\n\n建议：\n- 确认已创建.env文件并配置有效的DEEPSEEK_API_KEY\n- 检查网络连接是否正常\n- 稍后重试`;
    } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        errorDetails.type = 'network';
        errorDetails.message = '网络连接失败';
        errorDetails.details = '无法连接到AI服务，请检查网络连接或API服务是否可用。';
    } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        errorDetails.type = 'server';
        errorDetails.message = 'AI服务内部错误';
        errorDetails.details = 'AI服务暂时不可用，请稍后重试。';
    } else {
        errorDetails.details = `错误详情: ${error.message}`;
    }

    return errorDetails;
}

/**
 * 使用 AI 分析文档内容
 */
async function analyzeDocument(client, documentText, analysisType) {
    try {
        // 获取 prompt（异步）
        const { system: systemPrompt, user: userPrompt } = await getPrompt(analysisType, documentText);
        
        // 获取超时配置
        const { timeout, maxTokens, temperature } = getTimeoutConfig(analysisType);
        
        // 创建超时控制器
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await client.chat.completions.create({
                model: "deepseek-chat",
                messages: [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": userPrompt }
                ],
                stream: false,
                max_tokens: maxTokens,
                temperature: temperature || 0.1
            }, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // 获取AI原始输出
            const rawContent = response.choices[0].message.content;
            
            // 【调试日志】检查AI输出的换行符
            console.log('\n=== AI输出检查 ===');
            console.log('原始内容长度:', rawContent.length);
            console.log('原始内容行数:', rawContent.split('\n').length);
            console.log('前200字符:', rawContent.substring(0, 200).replace(/\n/g, '[换行]'));
            
            // 清理 Markdown 符号
            const cleanedAnalysis = cleanMarkdownSymbols(rawContent);
            
            // 【调试日志】检查清理后的内容
            console.log('清理后行数:', cleanedAnalysis.split('\n').length);
            console.log('清理后前200字符:', cleanedAnalysis.substring(0, 200).replace(/\n/g, '[换行]'));
            
            // 【新增】检查并替换未处理的占位符
            const replacedAnalysis = checkAndReplacePlaceholders(cleanedAnalysis);
            
            // 【紧急修复】强制格式化
            const formattedAnalysis = forceFormatLegalDocument(replacedAnalysis);
            console.log('最终行数:', formattedAnalysis.split('\n').length);
            console.log('===================\n');

            return {
                success: true,
                analysis: formattedAnalysis,
                usage: response.usage
            };

        } catch (apiError) {
            clearTimeout(timeoutId);
            throw apiError;
        }

    } catch (error) {
        console.error('AI API调用失败:', error);
        
        const errorDetails = parseAIError(error, analysisType);

        return {
            success: false,
            error: errorDetails.message,
            errorType: errorDetails.type,
            errorDetails: errorDetails.details,
            fullError: error.message
        };
    }
}

module.exports = {
    createAIClient,
    analyzeDocument,
    parseAIError
};

