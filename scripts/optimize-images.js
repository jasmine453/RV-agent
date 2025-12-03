/**
 * 图片优化脚本
 * 压缩 PNG/JPG 并生成 WebP 格式
 */

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    console.log('\n🎨 开始优化图片资源...\n');
    console.log('='.repeat(50));
    
    const assetsDir = path.join(__dirname, '..', 'assets');
    const outputDir = path.join(assetsDir, 'optimized');
    
    // 创建输出目录
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log('✓ 创建输出目录:', outputDir);
    }
    
    try {
        // 1. 压缩 PNG 文件
        console.log('\n📦 正在压缩 PNG 文件...');
        const pngFiles = await imagemin([path.join(assetsDir, '*.png')], {
            destination: outputDir,
            plugins: [
                imageminPngquant({
                    quality: [0.6, 0.8], // 压缩到 60-80% 质量
                    speed: 1 // 最高质量压缩
                })
            ]
        });
        console.log(`   ✓ 压缩了 ${pngFiles.length} 个 PNG 文件`);
        
        // 2. 压缩 JPG 文件
        console.log('\n📦 正在压缩 JPG 文件...');
        const jpgFiles = await imagemin([path.join(assetsDir, '*.{jpg,jpeg}')], {
            destination: outputDir,
            plugins: [
                imageminMozjpeg({
                    quality: 75, // 75% 质量
                    progressive: true
                })
            ]
        });
        console.log(`   ✓ 压缩了 ${jpgFiles.length} 个 JPG 文件`);
        
        // 3. 生成 WebP 格式
        console.log('\n📦 正在生成 WebP 格式...');
        const webpFiles = await imagemin([path.join(assetsDir, '*.{png,jpg,jpeg}')], {
            destination: outputDir,
            plugins: [
                imageminWebp({
                    quality: 75,
                    method: 6 // 最高质量压缩
                })
            ]
        });
        console.log(`   ✓ 生成了 ${webpFiles.length} 个 WebP 文件`);
        
        // 4. 统计压缩效果
        console.log('\n📊 压缩统计:');
        console.log('='.repeat(50));
        
        let originalSize = 0;
        let optimizedSize = 0;
        
        // 计算原始大小
        const glob = require('glob');
        glob.sync(path.join(assetsDir, '*.{png,jpg,jpeg}')).forEach(file => {
            try {
                originalSize += fs.statSync(file).size;
            } catch (e) {
                // 忽略错误
            }
        });
        
        // 计算优化后大小（不包括 WebP）
        glob.sync(path.join(outputDir, '*.{png,jpg,jpeg}')).forEach(file => {
            try {
                optimizedSize += fs.statSync(file).size;
            } catch (e) {
                // 忽略错误
            }
        });
        
        const savings = originalSize > 0 
            ? ((originalSize - optimizedSize) / originalSize * 100).toFixed(2) 
            : 0;
        
        console.log(`   原始大小: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   优化后:   ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   节省:     ${savings}% (${((originalSize - optimizedSize) / 1024 / 1024).toFixed(2)} MB)`);
        
        // 5. 列出优化的文件
        console.log('\n📁 优化的文件列表:');
        console.log('='.repeat(50));
        
        const allOptimizedFiles = glob.sync(path.join(outputDir, '*'));
        allOptimizedFiles.forEach((file, index) => {
            const filename = path.basename(file);
            const size = fs.statSync(file).size;
            console.log(`   ${index + 1}. ${filename} (${(size / 1024).toFixed(2)} KB)`);
        });
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ 图片优化完成！\n');
        console.log('💡 使用说明:');
        console.log('   1. 优化后的图片保存在: assets/optimized/');
        console.log('   2. 在HTML中使用 <picture> 标签优先加载 WebP 格式');
        console.log('   3. 示例代码:');
        console.log('      <picture>');
        console.log('        <source srcset="assets/optimized/image.webp" type="image/webp">');
        console.log('        <img src="assets/optimized/image.png" alt="">');
        console.log('      </picture>\n');
        
    } catch (error) {
        console.error('\n❌ 图片优化失败:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// 执行优化
optimizeImages().catch(error => {
    console.error('❌ 发生错误:', error);
    process.exit(1);
});

