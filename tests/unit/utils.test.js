/**
 * 工具函数单元测试
 */

const { formatFileSize, formatDate, cleanMarkdownSymbols } = require('../../server/utils');

describe('Utils Module', () => {
    describe('formatFileSize', () => {
        test('should format 0 bytes correctly', () => {
            expect(formatFileSize(0)).toBe('0 Bytes');
        });
        
        test('should format KB correctly', () => {
            expect(formatFileSize(1024)).toBe('1.00 KB');
            expect(formatFileSize(2048)).toBe('2.00 KB');
        });
        
        test('should format MB correctly', () => {
            expect(formatFileSize(1048576)).toBe('1.00 MB');
            expect(formatFileSize(5242880)).toBe('5.00 MB');
        });
        
        test('should format GB correctly', () => {
            expect(formatFileSize(1073741824)).toBe('1.00 GB');
        });
    });
    
    describe('formatDate', () => {
        test('should format date correctly', () => {
            const date = new Date('2025-01-01T12:00:00Z');
            const formatted = formatDate(date);
            expect(formatted).toContain('2025');
        });
        
        test('should handle default date', () => {
            const formatted = formatDate();
            expect(formatted).toBeTruthy();
            expect(typeof formatted).toBe('string');
        });
    });
    
    describe('cleanMarkdownSymbols', () => {
        test('should remove markdown headers', () => {
            expect(cleanMarkdownSymbols('# Title')).toBe('Title');
            expect(cleanMarkdownSymbols('## Subtitle')).toBe('Subtitle');
        });
        
        test('should remove bold markers', () => {
            expect(cleanMarkdownSymbols('**bold text**')).toBe('bold text');
            expect(cleanMarkdownSymbols('*italic*')).toBe('italic');
        });
        
        test('should handle null/undefined', () => {
            expect(cleanMarkdownSymbols(null)).toBeNull();
            expect(cleanMarkdownSymbols(undefined)).toBeUndefined();
        });
        
        test('should preserve line breaks', () => {
            const input = '第一行\n第二行\n第三行';
            const output = cleanMarkdownSymbols(input);
            expect(output.split('\n').length).toBe(3);
        });
    });
});

