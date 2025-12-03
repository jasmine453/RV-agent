/**
 * 项目清理脚本
 * 用于整理项目文件结构，移动文档到docs目录
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 需要移动到 docs/optimization/ 的文件
const docsToMove = [
    '代码分析与优化报告.md',
    '优化实施指南.md',
    '优化总结.md',
    '快速开始.md',
    '开始使用优化版本.md',
    '✅ 优化完成清单.md',
];

// 创建 docs/optimization 目录
const docsOptimizationDir = path.join(rootDir, 'docs', 'optimization');
if (!fs.existsSync(docsOptimizationDir)) {
    fs.mkdirSync(docsOptimizationDir, { recursive: true });
    console.log('✅ 创建 docs/optimization 目录');
}

// 移动文档文件
let movedCount = 0;
let skippedCount = 0;

docsToMove.forEach(filename => {
    const sourcePath = path.join(rootDir, filename);
    const targetPath = path.join(docsOptimizationDir, filename);

    if (fs.existsSync(sourcePath)) {
        try {
            // 如果目标文件已存在，先删除
            if (fs.existsSync(targetPath)) {
                fs.unlinkSync(targetPath);
            }

            // 移动文件（复制后删除原文件）
            fs.copyFileSync(sourcePath, targetPath);
            fs.unlinkSync(sourcePath);

            console.log(`✅ 已移动: ${filename}`);
            movedCount++;
        } catch (error) {
            console.error(`❌ 移动失败: ${filename} - ${error.message}`);
        }
    } else {
        console.log(`⏭️  跳过（不存在）: ${filename}`);
        skippedCount++;
    }
});

console.log('\n📊 清理完成统计:');
console.log(`   ✅ 已移动: ${movedCount} 个文件`);
console.log(`   ⏭️  已跳过: ${skippedCount} 个文件`);
console.log(`\n💡 提示: 文档已整理到 docs/optimization/ 目录`);
console.log(`   查看结构: cat PROJECT_STRUCTURE.md`);

