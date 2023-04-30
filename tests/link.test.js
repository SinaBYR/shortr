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

describe('GET /api/links', () => {
  it('should return all links', async () => {
    let res = await req.get('/api/links')
    expect(res.statusCode).toBe(200);
  })
})

describe('GET /api/links/:linkId', () => {
  it('should return a link', async () => {
    let res = await req.get('/api/links/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.original_url).toBe('sinabyr.ir');
  })
})

describe('POST /api/links', () => {
  it('should create a new link', async () => {
    let res = await req.post('/api/links').send({
      url: 'abc1.net',
      protocol: 'https'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.link_id).toBeDefined();
  })
})

describe('DELETE /api/links/:linkId', () => {
  it('should delete a link', async () => {
    let res = await req.delete('/api/links/1tt81709lh09cx65');
    expect(res.statusCode).toBe(204);
  })
})

describe('PATCH /api/links/:linkId', () => {
  it('should update a link', async () => {
    let res = await req.patch('/api/links/1234').send({
      linkId: '123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.link_id).toBeDefined();
  })
})

describe('POST /api/links/:linkId/switchActivationState', () => {
  it('should activate/deactivate a short link', async () => {
    let res = await req.post('/api/links/123/switchActivationState');
    expect(res.statusCode).toBe(204);
  })
})