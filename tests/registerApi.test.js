const request = require('supertest');
const app = require('../app');

describe('POST /register', () => {
    it('should return 201 when valid username, password and email are provided', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'testpassword',
                email: 'testuser@test.com'
            });
        expect(response.statusCode).toBe(200);
    });

    it('should return 400 when username or email already exists', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'existinguser',
                password: 'testpassword',
                email: 'existinguser@test.com'
            });
        expect(response.statusCode).toBe(400);
    });

    it('should return 500 when server error occurs', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'testpassword',
                email: 'testuser@test.com'
            });
        expect(response.statusCode).toBe(500);
    });
});
