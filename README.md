# RV-Agent v2.0.2 - AI企业重整智能平台

> **华东政法大学** Restructure Vision 团队  
> 企业重组与破产重整 · AI智能分析 · 专业方案生成

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

---

## 📑 目录

- [项目简介](#-项目简介)
- [快速开始](#-快速开始)
- [核心功能](#-核心功能)
- [部署指南](#-部署指南)
- [问题排查](#-问题排查)
- [API配置](#-api配置)

---

## 🎯 项目简介

RV-Agent是基于AI的企业重整智能平台，为破产重整、预重整和债务重组提供专业的智能化解决方案。

### ✨ 核心特点

- 🤖 **AI智能分析** - DeepSeek AI自动分析，生成专业方案
- 📄 **文档自动生成** - 重组协议、预重整方案、可行性报告
- 💰 **企业价值评估** - 基于IVS 2025国际评估准则
- ⚠️ **风险指标分析** - 13维度全面风险评估
- 📊 **图表可视化** - AI生成专业商务图表
- 📥 **Word文档导出** - 完整排版的Word格式

### 🆕 v2.0.2 优化

- 🔒 **安全增强** - Helmet安全头、速率限制、文件验证
- 📝 **日志系统** - Winston分级日志、按天轮转
- ⚡ **性能优化** - 异步处理、智能文本截断、按类型优化
- 🎨 **UI优化** - 拖拽上传、进度显示、黑色知识提示框、响应式设计
- 🔧 **错误处理** - 统一格式、友好提示、Premature close修复
- 📚 **完善文档** - 详细的使用和部署指南
- 🐛 **Bug修复** - 修复庭外重组协议分析失败问题

---

## 🚀 快速开始

### 📋 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- DeepSeek API密钥（必需）
- 豆包API密钥（可选，用于图表）

### 🎯 本地运行

#### Windows用户

```bash
# 双击运行（推荐）
start.bat

# 或命令行运行
.\start.bat
```

#### Mac/Linux用户

```bash
# 添加执行权限（首次）
chmod +x start.sh stop.sh

# 启动服务器
./start.sh
```

**启动脚本功能**:
- ✅ 自动检查 Node.js 环境
- ✅ 自动配置 API 密钥
- ✅ 自动安装依赖
- ✅ 自动创建必要目录
- ✅ 启动服务器

**停止服务器**:
```bash
# Windows
stop.bat

# Mac/Linux  
./stop.sh
```

### 🌐 访问应用

服务启动后，打开浏览器访问：
- 本地: http://localhost:3000
- Render: https://你的域名.onrender.com

---

## 🎨 核心功能

### 1️⃣ 智能文档分析

- 支持 PDF、Word、Excel、图片（OCR）
- 多文件智能合并分析
- 自动提取关键信息

### 2️⃣ AI方案生成

| 功能 | 说明 |
|------|------|
| 🏢 **企业价值评估** | 基于IVS 2025标准，多维度价值分析 |
| 📊 **价值与风险分析** | 财务、运营、市场等多维度评估 |
| ⚠️ **风险指标提取** | 13项核心风险指标智能识别 |
| 📋 **重组可行性报告** | 法律、财务、运营可行性专业报告 |
| 📝 **预重整方案** | 完整的预重整执行方案 |
| 🤝 **庭外重组协议** | 标准化债务重组协议文本 |

### 3️⃣ 专业报告输出

- 📄 **Word格式导出** - 保持完整排版
- ✏️ **在线编辑** - 所见即所得编辑器
- 📊 **图表可视化** - 专业商务风格图表
- 💾 **内容保存** - 支持多次编辑和导出

---

## 📦 项目结构

```
RV-Agent/
├── api-server.js              # 主服务器
├── package.json              # 依赖管理
├── render.yaml               # Render配置
├── server/                   # 后端代码
│   ├── aiService.js         # AI分析服务
│   ├── documentParser.js    # 文档解析
│   ├── prompts.js           # AI提示词
│   └── wordGenerator.js     # Word生成
├── index.html               # 首页
├── manager.html             # 管理页面
├── main.js                  # 前端逻辑
├── style.css                # 样式
├── upload-enhancement.js    # 上传增强
├── upload-enhancement.css   # 上传样式
├── assets/                  # 静态资源
├── run.bat                  # 快速启动
├── stop-server.bat          # 停止服务器
├── setup-api.bat            # API配置
└── README.md                # 项目文档
```

---

## 🌩️ 部署到Render

### 📋 部署前准备

确保本地测试通过：
```bash
# 测试API连接
node test-api.js

# 测试服务器
run.bat
```

### 🚀 部署步骤

#### 1. 上传到GitHub

```bash
git add .
git commit -m "Deploy v2.0.2 to Render"
git push origin main
```

#### 2. 创建Render服务

1. 访问 [render.com](https://render.com) 并登录
2. 点击 **New +** → **Web Service**
3. 连接你的GitHub账号和仓库
4. 选择 `RV-Agent` 仓库

#### 3. 配置服务

Render会自动读取 `render.yaml`，但你需要手动添加API密钥：

**在 Environment 标签页添加**：
```
DEEPSEEK_API_KEY = sk-11a15d0858604a3ba89f77dcbf83e7e1
DOUBAO_API_KEY = 050bd037-12a5-4933-8f70-cf49d9484850
```

**自动配置（来自render.yaml）**：
```
NODE_ENV = production
PORT = 10000
TZ = Asia/Shanghai
```

#### 4. 部署

- 点击 **Create Web Service**
- 等待构建和部署（约3-5分钟）
- 查看日志确认启动成功

#### 5. 验证部署

访问你的Render URL：
```
https://你的服务名.onrender.com
```

检查项：
- ✅ 页面能正常打开
- ✅ 上传文件功能正常
- ✅ AI分析功能正常（可能需要2-5分钟）

### 📤 GitHub上传清单

**必须上传**:
```
api-server.js, package.json, render.yaml
server/*.js
*.html, *.js, *.css
assets/
README.md, env.example
```

**不要上传**:
```
.env                 # 密钥文件
node_modules/        # 依赖包
uploads/, logs/      # 运行时数据
```

---

## 🔧 API配置

### DeepSeek API

1. 获取API密钥：https://platform.deepseek.com
2. 配置方式：

**方式1：自动配置（Windows）**
```bash
# 双击运行
setup-api.bat
```

**方式2：手动配置**
编辑 `.env` 文件：
```env
DEEPSEEK_API_KEY=sk-11a15d0858604a3ba89f77dcbf83e7e1
DOUBAO_API_KEY=050bd037-12a5-4933-8f70-cf49d9484850
PORT=3000
NODE_ENV=development
```

### 豆包API（可选）

用于生成专业图表，不配置不影响基本功能。

获取地址：https://www.volcengine.com/

---

## 🛠️ 问题排查

### 常见问题

#### 1. 端口被占用（EADDRINUSE）

**症状**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# Windows
stop-server.bat

# 或手动查找并终止
netstat -ano | findstr :3000
taskkill /PID [进程ID] /F
```

#### 2. AI分析报错：Premature close

**症状**: 
- `Invalid response body while trying to fetch`
- `Premature close`
- 任务卡在30%或直接失败

**根本原因**:
- 文档内容过长，超过DeepSeek API处理限制
- 输入+输出token总量过大

**解决方案**:
1. **减少上传文档数量**（推荐2-3个核心文档）
2. **上传更小的文件**（每个 < 5MB）
3. **优先上传结构化文档**（Excel/Word而不是PDF）

**已自动优化**:
- ✅ 系统已按分析类型智能截断文本
- ✅ 庭外重组协议：6,000字符
- ✅ 预重整方案：6,000字符
- ✅ 重组可行性：7,000字符
- ✅ 其他分析：8,000字符

#### 3. AI分析卡在30%

**症状**: 任务状态显示 `processing - 进度: 30%`，一直不完成

**可能原因**:
- API密钥未配置或无效
- 网络连接问题
- 文档内容过长（参见上一条）

**解决方案**:
```bash
# 1. 测试API连接
node test-api.js

# 2. 检查.env配置
# 确保DEEPSEEK_API_KEY正确

# 3. 查看服务器日志
# 本地：查看终端输出
# Render：查看Logs标签页

# 4. 重启服务器
stop-server.bat
run.bat
```

**Render部署特别注意**:
- 确保在 Render Dashboard → Environment 中添加了 `DEEPSEEK_API_KEY`
- 添加后需要手动重新部署（Manual Deploy）
- 免费版有冷启动，首次访问可能慢

#### 3. API连接失败

**症状**: `Premature close` 或 `ECONNRESET`

**解决方案**:
1. 运行 `node test-api.js` 测试连接
2. 检查API密钥是否正确
3. 确认DeepSeek账户有余额
4. 检查网络连接和防火墙

#### 4. 文档上传失败

**症状**: 上传后无响应或报错

**解决方案**:
1. 检查文件大小 < 10MB
2. 支持格式：PDF, Word, Excel, 图片
3. 清空浏览器缓存重试
4. 查看浏览器Console日志

#### 5. AI分析无结果或内容为空

**症状**: 分析完成但内容为空

**解决方案**:
1. 确认文件内容可读（不是扫描图片）
2. 文件内容不要过长（>10000字会自动截断）
3. 查看浏览器Console日志
4. 查看服务器日志（本地终端或Render Logs）

#### 6. Render部署失败

**症状**: 构建或启动失败

**解决方案**:
1. 检查 `package.json` 中的依赖
2. 确保 `render.yaml` 配置正确
3. 在Environment中添加所有必需的环境变量
4. 查看Build Logs和Deploy Logs
5. 手动触发重新部署

#### 7. Favicon 404错误

**症状**: 浏览器控制台显示 `Failed to load resource: favicon.ico:1 404`

**说明**: 这是正常的，不影响功能。已在代码中处理，返回204状态码。

#### 8. Word导出失败

**症状**: 导出按钮无响应或文件损坏

**解决方案**:
1. 确保内容已生成完成
2. 浏览器允许下载
3. 尝试刷新页面重新生成
4. 检查生成的内容是否过长

---

## 💻 使用指南

### 基本流程

1. **上传文档**
   - 拖拽或点击上传
   - 支持多文件
   - 实时进度显示

2. **选择功能**
   - 企业价值评估
   - 价值与风险分析
   - 风险指标提取
   - 重组可行性报告
   - 预重整方案
   - 庭外重组协议

3. **AI分析**
   - 自动解析文档
   - AI智能分析（约2-5分钟）
   - 实时进度显示

4. **查看和编辑**
   - 在线预览结果
   - 所见即所得编辑
   - 添加图表

5. **导出文档**
   - 下载Word格式
   - 完整保留格式

### 高级功能

#### 图表生成

1. 在编辑器中点击"生成图表"
2. 输入图表数据（JSON格式）
3. AI自动生成专业商务图表
4. 插入到文档中

#### 批量处理

1. 一次性上传多个文件
2. 系统自动合并内容
3. 统一进行AI分析

#### 历史记录

浏览器自动保存最近的分析结果，刷新页面不会丢失。

---

## 📊 技术栈

### 后端

- **Node.js** + **Express.js** - Web服务器
- **DeepSeek API** - AI分析引擎
- **Multer** - 文件上传
- **docx** - Word文档生成
- **pdf-parse** - PDF解析
- **mammoth** - Word解析
- **xlsx** - Excel解析
- **tesseract.js** - OCR识别
- **Winston** - 日志系统

### 前端

- **原生JavaScript** - 无框架，轻量高效
- **Responsive Design** - 移动端适配
- **Progressive Enhancement** - 渐进增强

### 安全

- **Helmet** - HTTP安全头
- **Rate Limiting** - 请求速率限制
- **CORS** - 跨域资源共享
- **File Validation** - 文件类型验证

---

## 📈 性能指标

- ⚡ 文档解析: < 2秒
- 🤖 AI分析: 2-6分钟（取决于内容长度）
- 📄 Word生成: < 1秒
- 📊 图表生成: 10-30秒
- 💾 文件上传: 支持10MB以内

---

## 🔐 安全特性

- ✅ API密钥加密存储
- ✅ 文件类型白名单
- ✅ 文件大小限制
- ✅ 请求速率限制
- ✅ CORS跨域保护
- ✅ XSS防护
- ✅ 安全HTTP头
- ✅ 输入验证和清洗

---

## 📝 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或直接运行
node api-server.js
```

### 环境变量

参考 `env.example` 文件配置完整的环境变量。

### 日志查看

日志文件位于 `logs/` 目录：
- `combined.log` - 所有日志
- `error.log` - 错误日志
- `app-YYYY-MM-DD.log` - 按日期归档

### 代码结构

- `api-server.js` - 主入口，路由定义
- `server/aiService.js` - AI调用逻辑
- `server/documentParser.js` - 文档解析
- `server/prompts.js` - AI提示词模板
- `server/wordGenerator.js` - Word生成
- `main.js` - 前端交互逻辑
- `upload-enhancement.js` - 上传UI增强
- `test-api.js` - API测试脚本

### 测试工具

```bash
# 测试API连接和AI分析
npm test
# 或直接运行
node test-api.js
```

测试脚本会检查：
- ✅ 环境变量配置
- ✅ AI客户端创建
- ✅ DeepSeek API连接
- ✅ 文档分析功能
- ✅ 返回结果格式

### 📋 部署检查清单

**上传到GitHub前**:
- [ ] 本地测试通过 (`npm test`)
- [ ] 服务器正常运行 (`run.bat`)
- [ ] `.env` 未提交
- [ ] API密钥准备就绪

**Render部署时**:
- [ ] 环境变量已配置（`DEEPSEEK_API_KEY`, `DOUBAO_API_KEY`）
- [ ] 构建成功
- [ ] 服务启动正常
- [ ] 功能测试通过

**详细部署指南**: 查看 [`RENDER_DEPLOY.md`](RENDER_DEPLOY.md)

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 👥 团队

**华东政法大学 Restructure Vision 团队**

- 项目指导：华东政法大学法学院
- 技术支持：AI技术实验室
- 法律支持：破产法研究中心

---

## 📮 联系我们

- 🌐 项目网站：[待添加]
- 📧 Email：[待添加]
- 🐛 问题反馈：[GitHub Issues](https://github.com/你的用户名/RV-Agent/issues)

---

## 🙏 致谢

- DeepSeek - 提供强大的AI能力
- 豆包（火山引擎）- 图表生成服务
- Render - 云托管平台
- 所有开源贡献者

---

## 📌 重要提示

1. ⚠️ **API密钥安全**：
   - 不要将 `.env` 文件上传到GitHub
   - 不要在前端代码中硬编码密钥
   - 定期更换API密钥

2. 📝 **数据隐私**：
   - 上传的文件仅用于AI分析
   - 不会保存或分享您的数据
   - 建议部署私有实例处理敏感信息

3. 🔧 **技术支持**：
   - 优先查看本文档的问题排查部分
   - 查看浏览器Console和后端logs/目录
   - 提Issue时附上详细的错误信息

4. 🚀 **性能优化**：
   - 文档内容过长会自动截断（保留前5000-10000字）
   - 建议上传关键章节而不是完整文档
   - 大文件可能需要更长的分析时间

---

## 🔄 更新日志

### v2.0.2 (2025-01-03)
- ✅ 优化API配置流程
- ✅ 简化启动脚本
- ✅ 改进错误提示
- ✅ 优化文档结构
- ✅ 删除冗余文件

### v2.0.1 (2025-01-02)
- ✅ 修复API连接问题
- ✅ 实现文本智能截断
- ✅ 优化异步任务处理
- ✅ 增强UI/UX体验
- ✅ 添加响应式设计

### v2.0.0 (2025-01-01)
- 🎉 全面重构和优化
- ✅ 安全性增强
- ✅ 性能优化
- ✅ 日志系统
- ✅ 完善文档

---

<div align="center">

**🌟 如果这个项目对你有帮助，请给我们一个Star！🌟**

Made with ❤️ by 华东政法大学 RV Team

</div>
