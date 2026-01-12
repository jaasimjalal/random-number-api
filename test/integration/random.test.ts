import request from 'supertest';
import app from '../../src/server';

describe('Random Number API', () => {
  describe('GET /v1/random', () => {
    it('should return a random number with default parameters', async () => {
      const response = await request(app).get('/v1/random');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.numbers).toHaveLength(1);
      expect(response.body.data.min).toBe(0);
      expect(response.body.data.max).toBe(100);
      expect(response.body.data.numbers[0]).toBeGreaterThanOrEqual(0);
      expect(response.body.data.numbers[0]).toBeLessThanOrEqual(100);
    });

    it('should return random numbers within specified range', async () => {
      const response = await request(app).get('/v1/random?min=10&max=50');
      
      expect(response.status).toBe(200);
      expect(response.body.data.min).toBe(10);
      expect(response.body.data.max).toBe(50);
      expect(response.body.data.numbers[0]).toBeGreaterThanOrEqual(10);
      expect(response.body.data.numbers[0]).toBeLessThanOrEqual(50);
    });

    it('should return multiple random numbers', async () => {
      const response = await request(app).get('/v1/random?min=1&max=100&count=5');
      
      expect(response.status).toBe(200);
      expect(response.body.data.numbers).toHaveLength(5);
      expect(response.body.data.count).toBe(5);
    });

    it('should fail with min >= max', async () => {
      const response = await request(app).get('/v1/random?min=100&max=50');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail with invalid count', async () => {
      const response = await request(app).get('/v1/random?count=150');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with non-numeric parameters', async () => {
      const response = await request(app).get('/v1/random?min=abc&max=50');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('should return API info', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/v1/unknown');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});