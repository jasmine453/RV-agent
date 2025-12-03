/**
 * 项目初始化设置脚本
 * 创建必要的目录结构
 * 适用于本地开发和 Render 部署
 */

const fs = require('fs');
const path = require('path');

// 检测是否在 Render 环境
const isRender = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';

console.log('\n🚀 RV-Agent 项目初始化...');
console.log(`环境: ${isRender ? 'Render/Production' : 'Local Development'}\n`);

// 1. 创建必要的目录
const directories = [
    'logs',
    'uploads'
];

console.log('📁 创建必要的目录...');
let created = 0;
let existing = 0;

directories.forEach(dir => {
    try {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`   ✓ 创建: ${dir}`);
            created++;
        } else {
            console.log(`   → 已存在: ${dir}`);
            existing++;
        }
    } catch (error) {
        console.log(`   ⚠️  无法创建 ${dir}: ${error.message}`);
    }
});

// 2. 创建 .gitkeep 文件（保持空目录在 git 中）
console.log('\n📝 创建 .gitkeep 文件...');
directories.forEach(dir => {
    try {
        const gitkeepPath = path.join(process.cwd(), dir, '.gitkeep');
        if (!fs.existsSync(gitkeepPath)) {
            fs.writeFileSync(gitkeepPath, '');
            console.log(`   ✓ 创建: ${dir}/.gitkeep`);
        }
    } catch (error) {
        // 忽略错误，不是关键文件
    }
});

// 3. 本地开发环境的额外配置
if (!isRender) {
    console.log('\n🔐 检查环境变量配置...');
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), 'env.example');
    const envLocalExamplePath = path.join(process.cwd(), '.env.local.example');

    if (!fs.existsSync(envPath)) {
        let templatePath = null;
        if (fs.existsSync(envLocalExamplePath)) {
            templatePath = envLocalExamplePath;
        } else if (fs.existsSync(envExamplePath)) {
            templatePath = envExamplePath;
        }

        if (templatePath) {
            try {
                fs.copyFileSync(templatePath, envPath);
                console.log('   ✓ 创建 .env 文件');
                console.log('   ⚠️  请编辑 .env 文件，配置你的 API 密钥！');
            } catch (error) {
                console.log('   ⚠️  无法创建 .env 文件');
            }
        }
    } else {
        console.log('   → .env 文件已存在');
    }
}

// 4. 显示完成信息
console.log('\n' + '='.repeat(50));
console.log('✅ 项目初始化完成！');
console.log(`   创建目录: ${created} 个`);
console.log(`   已存在: ${existing} 个`);

if (!isRender) {
    console.log('\n📋 下一步操作:');
    console.log('   1. 编辑 .env 文件，配置 DEEPSEEK_API_KEY');
    console.log('   2. 运行 npm start 启动服务器');
    console.log('   3. 访问 http://localhost:3000');
}

console.log('='.repeat(50) + '\n');

