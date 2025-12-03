#!/bin/bash

echo "========================================"
echo "   RV-Agent DeepSeek API 服务启动脚本"
echo "========================================"
echo

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "[信息] Node.js 版本:"
node --version

echo
echo "[信息] 正在安装依赖包..."
npm install

if [ $? -ne 0 ]; then
    echo "[错误] 依赖包安装失败"
    exit 1
fi

echo
echo "[信息] 依赖包安装完成"
echo

# 创建uploads目录
if [ ! -d "uploads" ]; then
    mkdir uploads
    echo "[信息] 已创建uploads目录"
fi

echo "[信息] 正在启动RV-Agent API服务..."
echo "[信息] DeepSeek API已集成"
echo "[信息] 服务地址: http://localhost:3000"
echo "[信息] 前端页面: http://localhost:3000"
echo
echo "========================================"
echo "按 Ctrl+C 停止服务"
echo "========================================"
echo

# 启动服务器
node api-server.js

