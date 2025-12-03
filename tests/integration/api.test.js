/**
 * API 集成测试
 */

const request = require('supertest');
const app = require('../../api-server');

describe('API Endpoints', () => {
    describe('GET /api/health', () => {
        test('should return success', async () => {
            const response = await request(app).get('/api/health');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('timestamp');
        });
    });
    
    describe('POST /api/upload', () => {
        test('should reject request without files', async () => {
            const response = await request(app)
                .post('/api/upload');
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
        });
        
        // 注意：实际文件上传测试需要准备测试文件
        // test('should accept valid files', async () => {
        //     const response = await request(app)
        //         .post('/api/upload')
        //         .attach('files', 'tests/fixtures/sample.pdf');
        //     
        //     expect(response.status).toBe(200);
        //     expect(response.body).toHaveProperty('success', true);
        // });
    });
    
    describe('POST /api/analyze', () => {
        test('should reject request without files', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
        });
        
        test('should reject request with empty files array', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .send({ files: [] });
            
            expect(response.status).toBe(400);
        });
    });
    
    describe('GET /api/task/:taskId', () => {
        test('should return 404 for non-existent task', async () => {
            const response = await request(app)
                .get('/api/task/non-existent-task-id');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('success', false);
        });
    });
    
    describe('404 Handler', () => {
        test('should return 404 for non-existent routes', async () => {
            const response = await request(app)
                .get('/api/non-existent-route');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('success', false);
        });
    });
});

