require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const pool = require('../db/db');

afterAll(async () => {
  await pool.end();
})

let req;
beforeEach(async () => {
  req = request.agent(app);
  await req.post('/auth/login').send({
    email: 'test@test.com',
    password: 'testtest'
  })
})

describe('GET /api/urls', () => {
  it('should return all short links', async () => {
    let res = await req.get('/api/urls')
    expect(res.statusCode).toBe(200);
  })
})

describe('GET /api/urls/:urlId', () => {
  it('should return a short link', async () => {
    let res = await req.get('/api/urls/1tt86fdlguk0ify')
    expect(res.statusCode).toBe(200);
    expect(res.body.original_url).toBe('google.com');
  })
})

describe('POST /api/new', () => {
  it('should create a new short link', async () => {
    let res = await req.post('/api/new').send({
      url: 'abc.net',
      protocol: 'https'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.url_id).toBeDefined();
  })
})

describe('DELETE /api/urls/:urlId', () => {
  it('should delete a short link', async () => {
    let res = await req.delete('/api/urls/1tt816balh08yiwx');
    expect(res.statusCode).toBe(204);
  })
})

describe('PATCH /api/urls/:urlId', () => {
  it('should update a short link', async () => {
    let res = await req.patch('/api/urls/123').send({
      urlId: '1234'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.url_id).toBeDefined();
  })
})

describe('POST /api/urls/:urlId/switchActivationState', () => {
  it('should activate/deactivate a short link', async () => {
    let res = await req.post('/api/urls/1234/switchActivationState');
    expect(res.statusCode).toBe(204);
  })
})

describe('PUT /api/me', () => {
  it('should update user info', async () => {
    let res = await req.put('/api/me').send({
      email: 'test@test.com',
      fullName: 'سینا بیرق دار'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.fullname).toBeDefined();
    expect(res.body.email).toBeDefined();
  })
})

describe('POST /api/me/changePassword', () => {
  it('should update user password', async () => {
    let res = await req.post('/api/me/changePassword').send({
      currentPassword: 'testtest',
      newPassword: 'testtest1'
    });
    expect(res.statusCode).toBe(200);
  })
})