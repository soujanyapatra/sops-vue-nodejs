import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { 
  setCorsHeaders, 
  NEWS_API_URL, 
  MOCK_NEWS_DATABASE, 
  mapExternalArticles 
} from './_utils/news';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.NEWS_API_AI_KEY;
  const category = (req.query.category as string) || 'World';

  if (!apiKey) {
    const filteredMock = MOCK_NEWS_DATABASE.filter(
      item => item.category.toLowerCase() === category.toLowerCase()
    );
    return res.status(200).json({
      articles: filteredMock.length > 0 ? filteredMock : MOCK_NEWS_DATABASE,
      fetchedFrom: 'Local Fallback (NEWS_API_AI_KEY Missing)',
      secretLoaded: false
    });
  }

  try {
    const response = await axios.post(NEWS_API_URL, {
      action: "getArticles",
      lang: "eng",
      keyword: category,
      articlesCount: 15,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      apiKey: apiKey
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000
    });

    const results = response.data?.articles?.results || [];
    const mapped = mapExternalArticles(results, category);

    return res.status(200).json({
      articles: mapped.length > 0 ? mapped : MOCK_NEWS_DATABASE.filter(item => item.category.toLowerCase() === category.toLowerCase()),
      fetchedFrom: 'Real NewsAPI.ai Service via Secure Proxy',
      secretLoaded: true
    });
  } catch (error: any) {
    console.error('Error calling NewsAPI.ai:', error.message);
    const filteredMock = MOCK_NEWS_DATABASE.filter(
      item => item.category.toLowerCase() === category.toLowerCase()
    );
    return res.status(200).json({
      articles: filteredMock.length > 0 ? filteredMock : MOCK_NEWS_DATABASE,
      fetchedFrom: `Local Fallback (Network error: ${error.message})`,
      secretLoaded: true
    });
  }
}
