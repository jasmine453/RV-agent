@echo off
chcp 65001 >nul
:: RV-Agent 服务器启动脚本
:: 此脚本用于在 Windows 环境下启动服务器

color 0A
echo ========================================
echo   RV-Agent 服务器启动脚本
echo ========================================
echo.

:: 检查 Node.js 是否安装
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ 错误: 未检测到 Node.js
    echo 请先安装 Node.js (推荐版本: v18+^)
    echo 访问: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js 版本:
node -v
echo ✓ npm 版本:
npm -v
echo.

:: 检查 .env 文件
if not exist .env (
    color 0E
    echo ⚠️  警告: 未找到 .env 文件
    if exist .env.local.example (
        echo 正在从 .env.local.example 复制...
        copy .env.local.example .env >nul
    ) else if exist env.example (
        echo 正在从 env.example 复制...
        copy env.example .env >nul
    )
    echo ✓ .env 文件已创建
    echo 请编辑 .env 文件并填入你的 API 密钥
    echo.
)

:: 检查依赖是否安装
if not exist node_modules (
    color 0E
    echo 正在安装依赖...
    call npm install
    echo ✓ 依赖安装完成
    echo.
)

:: 显示配置信息
color 0B
echo 📝 当前配置:
echo    本地端口: 3000
echo    访问地址: http://localhost:3000
echo    环境: development
echo.

:: 启动服务器
color 0A
echo 🚀 正在启动服务器...
echo.
npm start

pause

