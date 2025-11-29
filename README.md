# RV-Agent - AI驱动的企业重组智能平台

> Restructure Vision - 华东政法大学开发的企业重组与重整智能化平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

## 🌟 项目简介

RV-Agent 是一个AI驱动的企业重组智能平台，为破产重整、预重整和债务重组提供智能化解决方案。平台集成了 DeepSeek AI API，能够自动分析文档、生成重组方案和会议报告。

## ✨ 核心功能

### 📋 债务人与管理人工作区
- **庭外重组协议生成**：自动生成符合法律规范的庭外重组协议
- **预重整方案起草**：智能填充预重整方案模板
- **会议字段提取**：从文档中智能提取关键会议信息
- **债权人会议报告**：自动生成第一次债权人会议资料

### 📊 债权人与投资人分析区
- **企业价值评估**：深度分析企业资产、负债和盈利能力
- **风险指标提取**：智能识别并评级各类经营风险
- **重组可行性分析**：评估重组成功概率并提供建议
- **数据可视化**：图表化展示分析结果

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/RV-agent.git
cd RV-agent
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp env.example .env
# 编辑 .env 文件，填入你的 DEEPSEEK_API_KEY
```

4. **启动服务**

**Windows:**
```bash
.\启动服务器.bat
```

**Linux/Mac:**
```bash
chmod +x start-server.sh
./start-server.sh
```

或直接使用 npm:
```bash
npm start
```

5. **访问应用**

打开浏览器访问：`http://localhost:3000`

## 📁 项目结构

```
RV-agent/
├── server/                    # 后端模块
│   ├── aiService.js          # AI服务模块
│   ├── documentParser.js    # 文档解析模块
│   ├── prompts.js            # AI Prompts配置
│   └── utils.js              # 服务器工具函数
├── assets/                    # 静态资源
│   ├── logo.png
│   ├── mascot.png
│   └── *.jpg
├── uploads/                   # 文件上传目录
├── 预重整方案/               # 模板文件
├── 庭外重组协议/
├── 一债会报告模板/
├── api-server.js             # 主服务器文件
├── config.js                  # 配置文件
├── utils.js                   # 前端工具函数
├── main.js                    # 前端主逻辑
├── style.css                  # 样式文件
├── index.html                 # 首页
├── manager.html               # 管理人工作区
├── creditor.html              # 债权人分析区
├── package.json               # 项目配置
├── .gitignore                 # Git忽略文件
└── README.md                  # 项目说明
```

## 🛠️ 技术栈

### 后端
- **Node.js + Express**: 服务器框架
- **DeepSeek AI API**: AI分析引擎
- **Multer**: 文件上传处理
- **pdf-parse**: PDF文档解析
- **mammoth**: Word文档解析
- **xlsx**: Excel文档解析
- **docx**: Word文档生成

### 前端
- **HTML5 + CSS3**: 页面结构与样式
- **Vanilla JavaScript**: 纯原生JS，无框架依赖
- **Fetch API**: 网络请求
- **现代化UI设计**: 响应式布局、深色模式支持

## 📖 使用指南

### 1. 上传文档
- 支持 PDF、Word（.doc/.docx）、Excel（.xls/.xlsx）格式
- 单个文件不超过 10MB
- 可同时上传多个文件
- 建议上传企业基本信息、财务报表、债权人名单等相关文档

### 2. 选择功能

#### 债务人/管理人工作区
- **庭外重组协议生成**：自动填充协议模板，生成时间约2-3分钟
- **预重整方案生成**：生成完整的预重整方案草案，生成时间约3-5分钟
- **会议字段提取**：从文档中提取关键会议信息
- **债权人会议报告**：自动生成第一次债权人会议资料，生成时间约2-3分钟

#### 债权人/投资人分析区
- **企业价值评估**：分析企业资产、负债、盈利能力
- **风险指标提取**：识别并评级经营风险、财务风险等
- **重组可行性分析**：评估重组成功概率，提供建议

### 3. AI分析
- 点击对应功能按钮，AI将自动分析文档内容
- 分析时间：普通分析 1-2分钟，长文档生成 3-5分钟
- 处理过程中请耐心等待，不要关闭页面

### 4. 导出结果
- **查看结果**：在线查看生成的文档，支持高亮待补充内容
- **复制文本**：一键复制结果到剪贴板
- **下载Word**：导出为可编辑的.docx文档（保留格式和表格）
- **在线编辑**：直接在页面上编辑待补充内容

### 5. 重要提示
⚠️ **AI生成的文档仅供参考，必须经过专业律师审核后方可正式使用**
- 核对所有填充的信息是否准确
- 检查法律条款是否完整、合理
- 确认日期、金额等关键数据
- 根据具体案件情况进行必要修改

## ⚙️ 配置说明

### 环境变量（`.env`）

```bash
# DeepSeek AI API密钥（必需）
DEEPSEEK_API_KEY=your_api_key_here

# 服务器端口（可选，默认3000）
PORT=3000

# 日志级别（可选）
LOG_LEVEL=info
```

### 配置文件（`config.js`）

- **AI配置**：API超时、重试次数、Token限制
- **文件上传**：大小限制、允许类型、保留时间
- **安全配置**：CORS、速率限制

## 🔧 开发指南

### 架构设计

项目采用模块化架构，职责分离：

#### 后端模块
- **aiService.js**: AI服务封装，处理与DeepSeek API的交互
- **documentParser.js**: 文档解析，支持PDF/Word/Excel
- **prompts.js**: AI Prompts管理，集中配置所有AI分析模板
- **utils.js**: 服务器端工具函数

#### 前端模块
- **main.js**: 核心业务逻辑
- **utils.js**: 通用工具函数（格式化、防抖节流等）
- **config.js**: 前端配置（API地址、超时设置）

### 添加新功能

1. **添加新的AI分析类型**：
   - 在 `server/prompts.js` 中添加新的prompt配置
   - 在 `api-server.js` 中处理新的分析类型（如需特殊处理）
   - 在前端添加对应的按钮和处理函数

2. **添加新的文档格式支持**：
   - 在 `server/documentParser.js` 中添加新的解析函数
   - 更新 `api-server.js` 的文件类型白名单

## ❓ 常见问题

### Q: 生成的文档可以直接使用吗？
A: 不可以。AI生成的文档需要经过专业律师审核和修改后才能正式使用。

### Q: 支持哪些文档格式？
A: 支持PDF、Word（.doc/.docx）、Excel（.xls/.xlsx）格式。建议使用可搜索的PDF或Word文档，避免扫描版PDF。

### Q: 生成失败怎么办？
A: 请检查：
1. DeepSeek API密钥是否正确配置
2. 网络连接是否正常
3. 上传的文档是否可以正确解析
4. 查看服务器日志获取详细错误信息

### Q: 如何获取DeepSeek API密钥？
A: 访问 [DeepSeek官网](https://www.deepseek.com/) 注册账号并获取API密钥。

### Q: 模板可以自定义吗？
A: 可以。替换对应的模板PDF文件即可。建议保持模板中的占位符格式。

## 🐛 故障排除

### 问题：`npm install` 失败
**解决方法**：
```bash
# 清除缓存
npm cache clean --force
# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json
# 重新安装
npm install
```

### 问题：端口3000被占用
**解决方法**：
```bash
# 修改.env文件中的PORT
PORT=3001
# 或在启动时指定端口
PORT=3001 npm start
```

### 问题：上传文件后无法解析
**解决方法**：
- 确保PDF不是扫描版（需要可搜索的PDF）
- Word文档使用.docx格式而非.doc
- 检查文件是否损坏

### 问题：AI生成超时
**解决方法**：
- 减少上传文档的数量
- 检查网络连接
- 查看DeepSeek API配额是否充足

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 团队

**华东政法大学 Restructure Vision团队**

- 项目负责人：负责整体规划与协调
- 技术开发团队：AI算法、系统架构、前后端开发
- 法律专家团队：提供专业法律指导
- 数据分析团队：企业数据挖掘与分析

## 📧 联系我们

- 邮箱：rjasmine756@163.com
- 项目地址：https://github.com/yourusername/RV-agent

## 🙏 致谢

感谢以下开源项目：
- [DeepSeek](https://www.deepseek.com/) - AI分析引擎
- [Express.js](https://expressjs.com/) - Web框架
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF解析
- [mammoth.js](https://www.npmjs.com/package/mammoth) - Word解析
- [xlsx](https://www.npmjs.com/package/xlsx) - Excel处理

---

© 2025 Restructure Vision. All rights reserved.
