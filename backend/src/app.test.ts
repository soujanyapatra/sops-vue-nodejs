import request from 'supertest';
import app from './app';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Backend API Endpoints', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NEWS_API_AI_KEY;
    delete process.env.API_KEY;
  });

  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/categories should return categories list', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(["Technology", "Business", "AI", "World", "Sports"]);
  });

  it('GET /api/secret-status should return loaded: false when NEWS_API_AI_KEY is missing', async () => {
    const res = await request(app).get('/api/secret-status');
    expect(res.status).toBe(200);
    expect(res.body.secretLoaded).toBe(false);
  });

  it('GET /api/secret-status should return loaded: true when NEWS_API_AI_KEY is present', async () => {
    process.env.NEWS_API_AI_KEY = 'mock-key-value';
    const res = await request(app).get('/api/secret-status');
    expect(res.status).toBe(200);
    expect(res.body.secretLoaded).toBe(true);
    expect(JSON.stringify(res.body)).not.toContain('mock-key-value');
  });

  it('GET /api/news should return fallback when NEWS_API_AI_KEY is missing', async () => {
    const res = await request(app).get('/api/news').query({ category: 'AI' });
    expect(res.status).toBe(200);
    expect(res.body.articles).toBeInstanceOf(Array);
    expect(res.body.articles.length).toBeGreaterThan(0);
    expect(res.body.fetchedFrom).toContain('Local Fallback');
    expect(res.body.secretLoaded).toBe(false);
  });

  it('GET /api/news should fetch from NewsAPI.ai when key is present', async () => {
    process.env.NEWS_API_AI_KEY = 'valid-key';
    const mockApiResponse = {
      data: {
        articles: {
          results: [
            {
              uri: 'external-uri-1',
              title: 'External News Title',
              body: 'This is the body content of the news article.',
              url: 'https://news-source.com/article',
              image: 'https://news-source.com/img.jpg',
              source: { title: 'External Publisher' },
              dateTime: '2026-06-22T10:00:00Z',
              authors: [{ name: 'Reporter Name' }]
            }
          ]
        }
      }
    };
    (axios.post as jest.Mock).mockResolvedValue(mockApiResponse);

    const res = await request(app).get('/api/news').query({ category: 'AI' });
    expect(res.status).toBe(200);
    expect(res.body.articles[0].id).toBe('external-uri-1');
    expect(res.body.articles[0].title).toBe('External News Title');
    expect(res.body.articles[0].author).toBe('Reporter Name');
    expect(res.body.fetchedFrom).toBe('Real NewsAPI.ai Service via Secure Proxy');
    expect(res.body.secretLoaded).toBe(true);
  });

  it('GET /api/news/trending should return trending articles', async () => {
    process.env.NEWS_API_AI_KEY = 'valid-key';
    const mockApiResponse = {
      data: {
        articles: {
          results: [
            {
              uri: 'trending-uri-1',
              title: 'Trending Article Title',
              body: 'Trending body.',
              url: 'https://trending.com',
              source: { title: 'Trending Source' }
            }
          ]
        }
      }
    };
    (axios.post as jest.Mock).mockResolvedValue(mockApiResponse);

    const res = await request(app).get('/api/news/trending');
    expect(res.status).toBe(200);
    expect(res.body.articles).toBeInstanceOf(Array);
    expect(res.body.articles[0].id).toBe('trending-uri-1');
  });

  it('GET /api/news/search should search news by query and restrict API key leakage', async () => {
    process.env.NEWS_API_AI_KEY = 'secret-search-key';
    const mockApiResponse = {
      data: {
        articles: {
          results: [
            {
              uri: 'search-uri-1',
              title: 'Search Result Article',
              body: 'Search description.',
              url: 'https://search.com'
            }
          ]
        }
      }
    };
    (axios.post as jest.Mock).mockResolvedValue(mockApiResponse);

    const res = await request(app).get('/api/news/search').query({ q: 'sops' });
    expect(res.status).toBe(200);
    expect(res.body.articles[0].title).toBe('Search Result Article');
    expect(JSON.stringify(res.body)).not.toContain('secret-search-key');
  });
});
