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
 * 生成企业价值分析图表（专业商务风格）
 */
async function generateEnterpriseValueChart(analysisData) {
    // 从分析数据中提取关键信息
    let dataContext = '';
    if (analysisData && typeof analysisData === 'string') {
        dataContext = analysisData.substring(0, 800);
    }
    
    const prompt = `Create a professional business enterprise value analysis chart with maximum data clarity. This is for a serious business presentation.

Financial Context: ${dataContext}

CRITICAL REQUIREMENTS - NO WATERMARKS:
1. TITLE: "企业价值分析" (Enterprise Value Analysis) in large, bold, dark text at top center (32pt+)
2. LAYOUT: Clean professional layout with clear data visualization
3. BACKGROUND: Pure white or very light gray (#f8f9fa) - PROFESSIONAL BUSINESS STYLE
4. WATERMARK: ABSOLUTELY NO WATERMARKS OR LOGOS

CHART DESIGN:
Main Chart - "企业价值构成" (Enterprise Value Composition):
- Chart type: Stacked bar chart or waterfall chart
- Show 4-6 key metrics with actual values:
  * 总资产 (Total Assets): ¥348M
  * 流动资产 (Current Assets): ¥156M
  * 固定资产 (Fixed Assets): ¥104M
  * 无形资产 (Intangible Assets): ¥52M
  * 负债总额 (Total Liabilities): ¥182M
  * 净资产 (Net Assets): ¥166M
- Use professional blue gradient (#2563eb to #3b82f6)
- Clear value labels on each bar/segment
- Clean gridlines for reference
- Y-axis shows amounts in millions (¥M)

Secondary Metrics (KPI Cards):
- 资产负债率: 52.3%
- 流动比率: 1.85
- 净资产收益率: 12.4%
- 总资产周转率: 0.75

VISUAL STYLE REQUIREMENTS:
- Background: White (#ffffff)
- Chart borders: Light gray (#e5e7eb), 1px solid
- Text color: Dark gray or black (#1f2937) for maximum readability
- Font: Professional sans-serif (Arial, Helvetica, Roboto)
- Title font size: 32pt, bold
- Metric titles: 18pt, bold
- Data labels: 16pt minimum
- Numbers: 18pt, bold for emphasis

DATA VISUALIZATION BEST PRACTICES:
- Every metric MUST show actual numbers clearly
- Use clear, contrasting colors
- Include gridlines for easy reading
- Show axis labels and units (¥, %, etc.)
- Use data labels directly on charts
- Avoid 3D effects - use flat 2D charts
- Maximum clarity and readability
- Professional business presentation quality

COLOR PALETTE (Professional Business):
- Primary: #2563eb (Blue)
- Secondary: #3b82f6 (Light Blue)
- Success: #10b981 (Green)
- Warning: #f59e0b (Orange)
- Neutral: #6b7280 (Gray)
- Background: #ffffff (White)
- Text: #1f2937 (Dark Gray)

TECHNICAL SPECIFICATIONS:
- Resolution: 2K (2048x1152) or higher
- Aspect ratio: 16:9
- Format: High-quality PNG
- DPI: 300 for print quality
- NO WATERMARKS - This is critical
- NO LOGOS or branding
- Clean, professional appearance

STYLE REFERENCE:
Similar to: Microsoft Excel professional charts, PowerPoint business presentations, McKinsey/BCG consulting reports, Bloomberg Terminal, professional financial analyst reports.

AVOID:
- Sci-fi or futuristic elements
- Neon colors or glowing effects
- Dark backgrounds
- Cluttered layouts
- Decorative elements that don't add value
- Watermarks or logos
- Low contrast text
- Tiny fonts`;

    return await generateVisualization(prompt, {
        size: '2K',
        watermark: false
    });
}

/**
 * 生成风险指标雷达图（专业商务风格）
 */
async function generateRiskRadarChart(riskData) {
    // 从风险数据中提取信息
    let dataContext = '';
    if (riskData && typeof riskData === 'string') {
        dataContext = riskData.substring(0, 800);
    }
    
    const prompt = `Create a professional business risk assessment radar chart with maximum data clarity. This is for a serious business presentation.

Risk Analysis Context: ${dataContext}

CRITICAL REQUIREMENTS - NO WATERMARKS:
1. TITLE: "风险指标雷达图" (Risk Assessment Radar) in large, bold, dark text at top center (32pt+)
2. LAYOUT: Clean professional radar/spider chart layout
3. BACKGROUND: Pure white or very light gray (#f8f9fa) - PROFESSIONAL BUSINESS STYLE
4. WATERMARK: ABSOLUTELY NO WATERMARKS OR LOGOS

RADAR CHART DESIGN:
Chart Type: Pentagon/Hexagon Radar Chart (Spider Chart)

6 Risk Dimensions with Clear Labels and Values:
1. 流动性风险 (Liquidity Risk): 6.5/10
2. 偿债能力风险 (Solvency Risk): 7.2/10
3. 经营风险 (Operational Risk): 5.8/10
4. 市场风险 (Market Risk): 6.0/10
5. 财务风险 (Financial Risk): 7.5/10
6. 合规风险 (Compliance Risk): 4.2/10

Visual Elements:
- Filled area with semi-transparent color (rgba(239, 68, 68, 0.3) - light red)
- Solid border line (#ef4444 - red, 2px width)
- Clear axis lines from center (gray, 1px)
- Concentric circles/polygons showing scale (0, 2, 4, 6, 8, 10)
- Data points marked with solid circles at each dimension
- Value labels at each data point (16pt, bold)
- Dimension labels outside the chart (18pt, bold)

Risk Level Indicator:
- Overall Risk Score: 6.2/10 (Medium-High Risk)
- Color-coded: Green (0-3), Yellow (3-6), Orange (6-8), Red (8-10)
- Display prominently below chart

Legend/Scale:
- 0-3: 低风险 (Low Risk) - Green
- 3-6: 中等风险 (Medium Risk) - Yellow
- 6-8: 较高风险 (Medium-High Risk) - Orange
- 8-10: 高风险 (High Risk) - Red

VISUAL STYLE REQUIREMENTS:
- Background: White (#ffffff)
- Chart area: Light gray border (#e5e7eb), 1px solid
- Grid lines: Light gray (#d1d5db), 1px dashed
- Text color: Dark gray or black (#1f2937) for maximum readability
- Font: Professional sans-serif (Arial, Helvetica, Roboto)
- Title font size: 32pt, bold
- Dimension labels: 18pt, bold
- Value labels: 16pt, bold
- Scale numbers: 14pt

DATA VISUALIZATION BEST PRACTICES:
- Every dimension MUST show actual numeric values
- Use clear, contrasting colors
- Show scale clearly (0-10)
- Label all axes with dimension names
- Mark data points clearly
- Use semi-transparent fill for better readability
- Maximum clarity and readability
- Professional business presentation quality

COLOR PALETTE (Professional Risk Assessment):
- High Risk: #ef4444 (Red)
- Medium-High: #f59e0b (Orange)
- Medium: #eab308 (Yellow)
- Low Risk: #10b981 (Green)
- Grid/Border: #d1d5db (Light Gray)
- Background: #ffffff (White)
- Text: #1f2937 (Dark Gray)

TECHNICAL SPECIFICATIONS:
- Resolution: 2K (2048x1152) or higher
- Aspect ratio: 16:9
- Format: High-quality PNG
- DPI: 300 for print quality
- NO WATERMARKS - This is critical
- NO LOGOS or branding
- Clean, professional appearance

STYLE REFERENCE:
Similar to: Microsoft Excel professional charts, PowerPoint business presentations, McKinsey/BCG risk assessment reports, professional financial analyst reports, corporate risk dashboards.

AVOID:
- Sci-fi or futuristic elements
- Neon colors or glowing effects
- Dark backgrounds
- Cluttered layouts
- Decorative elements that don't add value
- Watermarks or logos
- Low contrast text
- Tiny fonts
- 3D effects`;

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
 * 生成财务数据看板（专业商务风格,数据清晰）
 */
async function generateFinancialDashboardChart(analysisData) {
    // 从分析数据中提取关键信息
    let dataContext = '';
    if (analysisData && typeof analysisData === 'string') {
        dataContext = analysisData.substring(0, 800);
    }
    
    const prompt = `Create an ultra-professional, crystal-clear financial dashboard for executive business presentation. CRITICAL: This must be 100% clean with ZERO watermarks, logos, or branding of any kind.

Financial Context: ${dataContext}

🚨 ABSOLUTE CRITICAL REQUIREMENTS - NO WATERMARKS/LOGOS 🚨
1. ZERO watermarks - NO "豆包", NO "Doubao", NO "火山引擎", NO "Bytedance", NO logos of any kind
2. ZERO branding elements - completely clean professional chart
3. Pure white background (#FFFFFF) - no gradients, no textures
4. Maximum text clarity - all text must be sharp, bold, and highly readable (minimum 18pt)
5. High contrast - pure black text (#000000) on white background only
6. TITLE: "财务数据看板" in extra large, extra bold text at top center (40pt+, font-weight: 900)
7. LAYOUT: Clean grid layout with 8 data panels in 2 rows × 4 columns
8. Every number must be LARGE, BOLD, and CRYSTAL CLEAR

DATA PANELS (Each panel MUST show clear data):

Row 1:
Panel 1 - "收入趋势" (Revenue Trend):
- Line chart with 5-6 data points
- Show actual numbers: 2020: ¥180M, 2021: ¥220M, 2022: ¥260M, 2023: ¥285M, 2024: ¥300M
- Use solid blue line (#2563eb)
- Clear axis labels and gridlines
- Y-axis shows values, X-axis shows years

Panel 2 - "成本分析" (Cost Analysis):
- Vertical bar chart with 4 categories
- Show values: 原材料 ¥120M, 人工 ¥45M, 运营 ¥35M, 其他 ¥20M
- Use different shades of blue
- Clear labels on each bar
- Percentage labels on top of bars

Panel 3 - "资产构成" (Asset Composition):
- Pie chart with 4-5 segments
- Show: 流动资产 45%, 固定资产 30%, 无形资产 15%, 其他 10%
- Use distinct colors: blue, green, orange, gray
- Large percentage labels inside each segment
- Legend with values

Panel 4 - "负债结构" (Liability Structure):
- Donut chart with clear segments
- Show: 短期负债 35%, 长期负债 40%, 所有者权益 25%
- Clear labels and percentages
- Center shows total amount

Row 2:
Panel 5 - "盈利能力" (Profitability):
- Horizontal bar chart comparing 3 years
- Show: 毛利率 35%, 净利率 18%, ROE 22%
- Use gradient bars (green for good performance)
- Clear percentage labels

Panel 6 - "现金流" (Cash Flow):
- Waterfall chart showing cash flow components
- Operating: +¥80M, Investing: -¥30M, Financing: -¥20M, Net: +¥30M
- Use green for positive, red for negative
- Clear connecting lines

Panel 7 - "财务比率" (Financial Ratios):
- Radar/spider chart with 6 dimensions
- Show: 流动比率, 速动比率, 资产负债率, 应收账款周转率, 存货周转率, 总资产周转率
- Use filled area with semi-transparent blue
- Clear axis labels with actual values

Panel 8 - "风险评估" (Risk Assessment):
- Gauge chart or horizontal bar
- Show risk score: 65/100 (Medium Risk)
- Color gradient: Green (low) → Yellow (medium) → Red (high)
- Clear risk level indicator

VISUAL STYLE REQUIREMENTS (ULTRA-CLEAR):
- Background: Pure white (#FFFFFF) - NO gradients, NO textures
- Panel borders: Light gray (#e5e7eb), 1px solid
- Panel background: Pure white with subtle shadow
- Text color: Pure black (#000000) for maximum readability and contrast
- Font: Professional sans-serif (Arial Black, Helvetica Bold, or Roboto Bold)
- Main title font size: 40pt, extra bold (font-weight: 900)
- Panel titles: 22pt, extra bold (font-weight: 900)
- Data labels: 18pt minimum, bold (font-weight: 700)
- Numbers: 20pt minimum, extra bold (font-weight: 900) for maximum emphasis
- All text must be SHARP, CLEAR, and HIGHLY READABLE
- NO blurry or fuzzy text - crystal clear only

DATA VISUALIZATION BEST PRACTICES:
- Every chart MUST show actual numbers, not just shapes
- Use clear, contrasting colors
- Include gridlines for reference
- Show axis labels and units (¥, %, etc.)
- Use data labels directly on charts
- Avoid 3D effects - use flat 2D charts
- Maximum clarity and readability
- Professional business presentation quality

COLOR PALETTE (Professional Business):
- Primary: #2563eb (Blue)
- Success: #10b981 (Green)
- Warning: #f59e0b (Orange)
- Danger: #ef4444 (Red)
- Neutral: #6b7280 (Gray)
- Background: #ffffff (White)
- Text: #1f2937 (Dark Gray)

TECHNICAL SPECIFICATIONS:
- Resolution: 2K (2048x1152) MINIMUM - prefer 4K if possible for maximum clarity
- Aspect ratio: 16:9
- Format: High-quality PNG (lossless compression)
- DPI: 300 minimum for print quality
- Color space: sRGB
- Anti-aliasing: Enabled for smooth, sharp text
- Compression: Minimal to preserve maximum clarity

🚨 WATERMARK REMOVAL INSTRUCTIONS (CRITICAL) 🚨
- NO "豆包" watermark anywhere on the image
- NO "Doubao" watermark anywhere on the image
- NO "火山引擎" watermark anywhere on the image
- NO "Bytedance" watermark anywhere on the image
- NO company logos of any kind
- NO URL watermarks
- NO semi-transparent overlays
- NO corner logos or branding
- NO text watermarks in any language
- COMPLETELY CLEAN IMAGE - 100% watermark-free
- If you detect ANY watermark, REMOVE IT IMMEDIATELY before generating

STYLE REFERENCE:
Exactly like: Microsoft Excel 2021 professional charts, Apple Keynote business templates, Google Data Studio dashboards, Tableau executive reports, professional financial analyst presentations, corporate annual reports.

✅ MUST HAVE:
✅ Pure white background (#FFFFFF)
✅ Sharp, bold, black text (minimum 18pt)
✅ High contrast colors
✅ Large, clear data labels (20pt+)
✅ Professional business style
✅ Clean, minimal design
✅ Maximum readability
✅ ZERO watermarks or branding of any kind

❌ MUST AVOID:
❌ ANY watermarks or logos (豆包, Doubao, 火山引擎, Bytedance, etc.)
❌ Blurry or fuzzy text
❌ Low contrast colors
❌ Tiny fonts (nothing below 16pt)
❌ 3D effects or shadows
❌ Dark backgrounds
❌ Neon or glowing effects
❌ Decorative elements
❌ Cluttered layouts
❌ Semi-transparent text
❌ Gradient backgrounds`;

    return await generateVisualization(prompt, {
        size: '2K',
        watermark: false,
        quality: 'high'
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
    generateFinancialDashboardChart,
    generateSequentialCharts
};

