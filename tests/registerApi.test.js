const request = require('supertest');
const app = require('../app');

describe('POST /register', () => {
    it('should return 201 when valid password and email are provided', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                password: 'testpassword',
                email: 'testuser@test.com'
            });
        expect(response.statusCode).toBe(200);
    });

    it('should return 400 when email already exists', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                password: 'testpassword',
                email: 'existinguser@test.com'
            });
        expect(response.statusCode).toBe(400);
    });

    it('should return 500 when server error occurs', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                password: 'testpassword',
                email: 'testuser@test.com'
            });
        expect(response.statusCode).toBe(500);
    });
});
