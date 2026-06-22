import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/secret-status
app.get('/api/secret-status', (req, res) => {
  const apiKey = process.env.API_KEY;
  const environment = process.env.ENVIRONMENT || 'development';
  const buildVersion = process.env.BUILD_VERSION || '1.0.0';
  const deploymentTime = process.env.DEPLOYMENT_TIME || new Date().toISOString();

  res.json({
    secretLoaded: typeof apiKey === 'string' && apiKey.length > 0,
    environment,
    buildVersion,
    deploymentTime
  });
});

export default app;
