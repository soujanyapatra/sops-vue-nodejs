import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './_utils/news';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.NEWS_API_AI_KEY;
  const environment = process.env.ENVIRONMENT || 'development';
  const buildVersion = process.env.BUILD_VERSION || '1.0.0';
  const deploymentTime = process.env.DEPLOYMENT_TIME || new Date().toISOString();
  const projectName = process.env.PROJECT_NAME || 'The Chronicle';

  return res.status(200).json({
    secretLoaded: typeof apiKey === 'string' && apiKey.length > 0,
    environment,
    buildVersion,
    deploymentTime,
    projectName
  });
}
