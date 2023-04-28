require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const pool = require('../db/db');

afterAll(async () => {
  await pool.end();
})

describe('POST /auth/login', () => {
  it('should sign in the user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test@test.com',
      password: 'testtest'
    });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/dashboard');
    expect(res.headers['set-cookie'][0]).toMatch(/shortr/);
  })
})

describe('POST /auth/new', () => {
  it('should create a new user', async () => {
    const res = await request(app).post('/auth/new').send({
      fullName: 'سینا بیرق دار',
      email: 'test1@test.com',
      password: 'testtest',
      repeatPassword: 'testtest'
    });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/dashboard');
    expect(res.headers['set-cookie'][0]).toMatch(/shortr/);
  })
})

describe('GET /auth/logout', () => {
  it('should redirect unauthorized user to /login', async () => {
    const res = await request(app).get('/auth/logout');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/login');
  })

  it('should sign out the user', async () => {
    let requestAgent = request.agent(app);
    let loginRes = await request.agent(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'testtest'
      });
    expect(loginRes.headers.location).toBe('/dashboard');
    expect(loginRes.headers['set-cookie'][0]).toMatch(/shortr/);
    const logoutRes = await requestAgent.get('/auth/logout');
    expect(logoutRes.statusCode).toBe(302);
    expect(logoutRes.headers.location).toBe('/login');
  })
})