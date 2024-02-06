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
        expect(response.statusCode).toBe(201);
    });

    it('should return 409 when username or email already exists', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'existinguser',
                password: 'testpassword',
                email: 'existinguser@test.com'
            });
        expect(response.statusCode).toBe(409);
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
