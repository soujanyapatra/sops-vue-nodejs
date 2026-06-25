const newsApiAiKey = process.env.NEWS_API_AI_KEY;
const environment = process.env.ENVIRONMENT || 'development';
const buildVersion = process.env.BUILD_VERSION || '1.0.0';
const deploymentTime = process.env.DEPLOYMENT_TIME || new Date().toISOString();
const projectName = process.env.PROJECT_NAME || 'The Chronicle';

export const config = {
  newsApiAiKey,
  environment,
  buildVersion,
  deploymentTime,
  projectName,
};
