import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './_utils/news';
import { config } from './_utils/config';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = config.newsApiAiKey;
  const environment = config.environment;
  const buildVersion = config.buildVersion;
  const deploymentTime = config.deploymentTime;
  const projectName = config.projectName;

  return res.status(200).json({
    secretLoaded: typeof apiKey === 'string' && apiKey.length > 0,
    environment,
    buildVersion,
    deploymentTime,
    projectName
  });
}
