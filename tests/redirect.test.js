require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');

describe('GET /:linkId', () => {
  it('should redirect to the link associated with linkId', async () => {
    const req = await request(app).get('/1');
    expect(req.statusCode).toBe(302);
    expect(req.headers.location).toBe('https://sinabyr.ir');
  })
})