/**
 * 图片生成服务模块
 * 使用豆包（火山引擎）API生成数据可视化图表
 */

const https = require('https');
const { URL } = require('url');

/**
 * 调用豆包图片生成API
 */
async function generateVisualization(prompt, options = {}) {
    // 使用环境变量或默认的API Key
    const apiKey = process.env.DOUBAO_API_KEY || '050bd037-12a5-4933-8f70-cf49d9484850';
    
    const requestBody = {
        model: options.model || "doubao-seedream-4-0-250828",
        prompt: prompt,
        response_format: options.responseFormat || "url",
        size: options.size || "2K",
        watermark: options.watermark !== undefined ? options.watermark : true,
        ...options.extraParams
    };

    return new Promise((resolve, reject) => {
        const url = new URL('https://ark.cn-beijing.volces.com/api/v3/images/generations');
        
        const requestOptions = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    if (res.statusCode === 200) {
                        // 尝试解析JSON
                        let response;
                        try {
                            response = JSON.parse(data);
                        } catch (parseError) {
                            console.error('❌ JSON解析失败，响应内容:', data.substring(0, 200));
                            reject({
                                success: false,
                                error: 'API响应格式错误',
                                details: `无法解析JSON响应: ${parseError.message}`
                            });
                            return;
                        }
                        
                        console.log('✅ 豆包API返回数据:', JSON.stringify(response).substring(0, 500));
                        console.log('📊 图片数据:', response.data);
                        
                        resolve({
                            success: true,
                            images: response.data || [],
                            usage: response.usage || {}
                        });
                    } else {
                        console.error(`❌ API返回错误状态码: ${res.statusCode}`);
                        console.error('响应内容:', data.substring(0, 200));
                        reject({
                            success: false,
                            error: `API返回错误: ${res.statusCode}`,
                            details: data.substring(0, 500)
                        });
                    }
                } catch (error) {
                    console.error('❌ 处理响应时出错:', error);
                    reject({
                        success: false,
                        error: '处理响应失败',
                        details: error.message
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject({
                success: false,
                error: '网络请求失败',
                details: error.message
            });
        });

        req.write(JSON.stringify(requestBody));
        req.end();
    });
}

/**
 * 生成企业价值分析图表
 */
async function generateEnterpriseValueChart(analysisData) {
    // 从分析数据中提取关键信息（如果有的话）
    let dataContext = '';
    if (analysisData && typeof analysisData === 'string') {
        // 提取前500字符作为上下文
        dataContext = analysisData.substring(0, 500);
    }
    
    const prompt = `Generate a professional business data visualization chart for enterprise valuation analysis.

Context from analysis: ${dataContext}

Requirements:
- Title: "企业价值分析" (Enterprise Value Analysis) in Chinese
- Chart type: Modern bar chart or composed chart
- Show key metrics: Assets (资产), Liabilities (负债), Net Value (净值), Revenue (营收)
- Professional blue and gray color scheme
- Clean, modern corporate style
- Clear data labels in Chinese
- Professional business infographic style
- 2K resolution, no watermark

Style: Corporate dashboard, data-driven, clean and professional`;

    return await generateVisualization(prompt, {
        size: '2K',
        watermark: false
    });
}

/**
 * 生成风险指标雷达图
 */
async function generateRiskRadarChart(riskData) {
    // 从风险数据中提取信息
    let dataContext = '';
    if (riskData && typeof riskData === 'string') {
        dataContext = riskData.substring(0, 500);
    }
    
    const prompt = `Generate a professional risk assessment radar/spider chart.

Context from risk analysis: ${dataContext}

Requirements:
- Title: "风险指标评估" (Risk Assessment) in Chinese
- Chart type: Radar chart / Spider chart
- 5 dimensions with Chinese labels:
  * 流动性风险 (Liquidity Risk)
  * 偿债能力风险 (Solvency Risk)  
  * 经营风险 (Operational Risk)
  * 市场风险 (Market Risk)
  * 财务风险 (Financial Risk)
- Color scheme: Red and orange gradient to indicate risk levels
- Clear axis labels and values
- Professional business visualization
- 2K resolution, no watermark

Style: Business intelligence dashboard, modern, professional, data-centric`;

    return await generateVisualization(prompt, {
        size: '2K',
        watermark: false
    });
}

/**
 * 生成可行性分析图表
 */
async function generateFeasibilityChart(feasibilityScore, analysisData) {
    // 提取分析数据上下文
    let dataContext = '';
    if (analysisData && typeof analysisData === 'string') {
        dataContext = analysisData.substring(0, 500);
    }
    
    const score = feasibilityScore || 75;
    
    const prompt = `Generate a professional restructuring feasibility analysis visualization.

Context from feasibility analysis: ${dataContext}

Requirements:
- Title: "重组可行性分析" (Restructuring Feasibility Analysis) in Chinese
- Main metric: Feasibility Score ${score}/100 displayed prominently
- Chart elements:
  * Large score indicator (gauge/dashboard style)
  * Success probability percentage
  * Key success factors visualization
  * Timeline or progress indicator
- Color scheme: Green and blue gradient (professional)
- Modern KPI dashboard style
- Clean, easy-to-understand business visualization
- Chinese labels and text
- 2K resolution, no watermark

Style: Executive dashboard, KPI visualization, modern and professional`;

    return await generateVisualization(prompt, {
        size: '2K',
        watermark: false
    });
}

/**
 * 生成多图序列（用于时间序列分析）
 */
async function generateSequentialCharts(basePrompt, count = 3) {
    const prompt = `${basePrompt}
    Generate ${count} variations showing different time periods or scenarios.
    Maintain consistent style and professional business visualization approach.`;

    return await generateVisualization(prompt, {
        sequential_image_generation: 'auto',
        sequential_image_generation_options: {
            max_images: count
        },
        size: '2K',
        watermark: false
    });
}

module.exports = {
    generateVisualization,
    generateEnterpriseValueChart,
    generateRiskRadarChart,
    generateFeasibilityChart,
    generateSequentialCharts
};

