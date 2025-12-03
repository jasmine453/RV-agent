# Render 部署问题排查指南

## 🔍 快速诊断清单

当你遇到 502 错误或 JSON 解析错误时，请按以下步骤检查：

### ✅ 步骤 1: 检查服务状态

1. 登录 [Render Dashboard](https://dashboard.render.com)
2. 找到你的服务
3. 检查服务状态是否为 **Live**（绿色）
4. 如果状态不是 Live，点击 **Manual Deploy** 重新部署

### ✅ 步骤 2: 检查环境变量

在 Render Dashboard 中，进入你的服务 → **Environment** 标签页，确认以下变量已配置：

| 变量名 | 是否必需 | 说明 |
|--------|---------|------|
| `DEEPSEEK_API_KEY` | ✅ 必需 | DeepSeek API 密钥 |
| `DOUBAO_API_KEY` | ⚠️ 可选 | 豆包图片生成 API 密钥（仅图表功能需要） |
| `NODE_ENV` | ✅ 必需 | 设置为 `production` |
| `PORT` | ✅ 必需 | 设置为 `10000`（Render 自动分配） |
| `TZ` | ⚠️ 可选 | 时区设置，建议 `Asia/Shanghai` |

**⚠️ 重要**: `DEEPSEEK_API_KEY` 必须配置，否则服务器会返回 500 错误。

### ✅ 步骤 3: 检查服务器日志

1. 在 Render Dashboard 中，点击 **Logs** 标签页
2. 查找以下错误信息：

#### 错误 1: API 密钥未配置
```
❌ 错误: DEEPSEEK_API_KEY 未设置
```
**解决方案**: 在 Environment Variables 中添加 `DEEPSEEK_API_KEY`

#### 错误 2: 服务器启动失败
```
Error: listen EADDRINUSE
Error: Cannot find module
```
**解决方案**: 
- 检查 `package.json` 中的依赖是否完整
- 确认 `startCommand` 为 `npm start`
- 重新部署服务

#### 错误 3: 请求超时
```
Request timeout
```
**解决方案**: Render 免费版有 15 秒超时限制，考虑：
- 升级到付费计划
- 优化请求处理时间
- 将大任务拆分为多个小任务

### ✅ 步骤 4: 测试健康检查端点

在浏览器中访问：
```
https://你的服务地址.onrender.com/api/health
```

**正常响应**:
```json
{
  "success": true,
  "message": "RV-Agent API服务运行正常",
  "timestamp": "2025-01-XX..."
}
```

**异常响应**:
- 502 Bad Gateway → 服务器未启动或崩溃
- 404 Not Found → 路由配置错误
- 500 Internal Server Error → 服务器内部错误，查看日志

### ✅ 步骤 5: 检查前端 API 配置

确认前端代码中的 API 配置正确：

```javascript
// main.js 中的配置应该是自动检测的
const API_CONFIG = {
    baseURL: window.location.hostname !== 'localhost' 
        ? `${window.location.origin}/api`
        : 'http://localhost:3000/api'
};
```

**验证方法**:
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页
3. 查找 API 调用日志，确认请求地址正确

## 🚨 常见问题及解决方案

### 问题 1: 502 Bad Gateway

**症状**:
- 控制台显示 `Failed to load resource: the server responded with a status of 502`
- 返回 HTML 错误页面而不是 JSON

**可能原因**:
1. 服务器未启动
2. 环境变量未配置
3. 服务器崩溃
4. Render 服务资源不足

**解决步骤**:
1. 检查 Render Dashboard 中的服务状态
2. 查看服务日志，查找错误信息
3. 确认环境变量已正确配置
4. 尝试重新部署服务

### 问题 2: JSON 解析错误

**症状**:
```
SyntaxError: Unexpected token '<', "<!DOCTYPE ... is not valid JSON"
```

**原因**: 服务器返回了 HTML 错误页面而不是 JSON 数据

**解决方案**:
1. 这通常是 502 错误的另一种表现形式
2. 按照"问题 1"的步骤进行排查
3. 检查服务器是否正确启动并运行

### 问题 3: 请求超时

**症状**:
- 请求在 15 秒后失败
- 控制台显示超时错误

**原因**: Render 免费版有 15 秒的请求超时限制

**解决方案**:
1. **升级 Render 计划**（推荐）: 付费计划支持更长的超时时间
2. **优化请求**: 将大任务拆分为多个小任务
3. **异步处理**: 实现任务队列，立即返回任务 ID，客户端轮询结果

### 问题 4: 环境变量未生效

**症状**:
- 服务器日志显示 `DEEPSEEK_API_KEY未设置`
- 但你在 Dashboard 中已经配置了

**解决方案**:
1. 确认环境变量名称拼写正确（区分大小写）
2. 确认变量值已保存（点击 Save Changes）
3. **重新部署服务**（重要！环境变量更改后需要重新部署）
4. 在服务设置中，点击 **Manual Deploy** → **Deploy latest commit**

## 📝 部署检查清单

在部署到 Render 之前，请确认：

- [ ] `package.json` 中的 `start` 脚本正确：`"start": "node api-server.js"`
- [ ] `render.yaml` 配置正确
- [ ] 所有必需的环境变量已准备
- [ ] 代码已推送到 Git 仓库
- [ ] Render 服务已连接到正确的 Git 仓库

## 🔧 手动重新部署

如果问题持续存在，尝试手动重新部署：

1. 在 Render Dashboard 中，进入你的服务
2. 点击 **Manual Deploy** 下拉菜单
3. 选择 **Deploy latest commit**
4. 等待部署完成（通常需要 2-5 分钟）
5. 检查服务状态是否为 **Live**
6. 测试健康检查端点

## 📞 获取帮助

如果以上步骤都无法解决问题：

1. **查看完整日志**: 在 Render Dashboard 的 Logs 标签页中，复制完整的错误日志
2. **检查服务指标**: 查看 CPU、内存使用情况，确认是否有资源限制
3. **联系 Render 支持**: 如果怀疑是 Render 平台问题，可以联系 Render 技术支持

## 💡 最佳实践

1. **使用环境变量**: 永远不要在代码中硬编码 API 密钥
2. **监控日志**: 定期查看服务日志，及时发现问题
3. **健康检查**: 定期访问 `/api/health` 端点，确认服务正常运行
4. **错误处理**: 前端已改进错误处理，会显示更详细的错误信息
5. **超时管理**: 对于长时间任务，考虑使用异步处理或任务队列

---

**最后更新**: 2025-01-XX
**适用版本**: RV-Agent 2.0+

