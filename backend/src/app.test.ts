import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from './app';

describe('Backend API Endpoints', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/secret-status should return loaded: false when API_KEY is missing', async () => {
    delete process.env.API_KEY;
    const res = await request(app).get('/api/secret-status');
    expect(res.status).toBe(200);
    expect(res.body.secretLoaded).toBe(false);
    expect(res.body.environment).toBe('development');
  });

  it('GET /api/secret-status should return loaded: true when API_KEY is present', async () => {
    process.env.API_KEY = 'test-api-key';
    process.env.ENVIRONMENT = 'production';
    process.env.BUILD_VERSION = '2.0.0';
    process.env.DEPLOYMENT_TIME = '2026-06-22T12:00:00Z';

    const res = await request(app).get('/api/secret-status');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      secretLoaded: true,
      environment: 'production',
      buildVersion: '2.0.0',
      deploymentTime: '2026-06-22T12:00:00Z'
    });
    
    // Ensure the key itself is not leaked
    expect(JSON.stringify(res.body)).not.toContain('test-api-key');
  });
});
