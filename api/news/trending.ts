import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { 
  setCorsHeaders, 
  NEWS_API_URL, 
  MOCK_NEWS_DATABASE, 
  mapExternalArticles 
} from '../_utils/news';
import { config } from '../_utils/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = config.newsApiAiKey;

  if (!apiKey) {
    return res.status(200).json({
      articles: MOCK_NEWS_DATABASE.slice(0, 5),
      fetchedFrom: 'Local Fallback (NEWS_API_AI_KEY Missing)',
      secretLoaded: false
    });
  }

  try {
    const response = await axios.post(NEWS_API_URL, {
      action: "getArticles",
      lang: "eng",
      articlesCount: 6,
      articlesSortBy: "socialScore",
      articlesSortByAsc: false,
      apiKey: apiKey
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000
    });

    const results = response.data?.articles?.results || [];
    const mapped = mapExternalArticles(results, 'World');

    return res.status(200).json({
      articles: mapped.length > 0 ? mapped : MOCK_NEWS_DATABASE.slice(0, 5),
      fetchedFrom: 'Real NewsAPI.ai Service via Secure Proxy',
      secretLoaded: true
    });
  } catch (error: any) {
    console.error('Error fetching trending news:', error.message);
    return res.status(200).json({
      articles: MOCK_NEWS_DATABASE.slice(0, 5),
      fetchedFrom: `Local Fallback (Network error: ${error.message})`,
      secretLoaded: true
    });
  }
}
