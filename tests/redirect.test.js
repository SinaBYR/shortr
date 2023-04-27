require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');

describe('GET /:urlId', () => {
  it('should redirect to url associated with urlId', async () => {
    const req = await request(app).get('/1tt86fdlguk0ify');
    console.log(process.env.NODE_ENV);
    expect(req.statusCode).toBe(302);
    expect(req.headers.location).toBe('https://google.com');
  })
})