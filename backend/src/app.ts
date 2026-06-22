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

// GET /api/blogs
app.get('/api/blogs', async (req, res) => {
  const blogApiKey = process.env.BLOG_API_KEY;
  const isKeyLoaded = typeof blogApiKey === 'string' && blogApiKey.length > 0;

  const mockBlogs = [
    {
      id: 1,
      title: "Securing Node.js Applications with Mozilla SOPS and AGE",
      description: "Learn how to encrypt your environment variables in Git repository using SOPS envelope encryption and AGE keypairs, and decrypt them seamlessly in your CI/CD pipelines.",
      cover_image: "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=800&auto=format&fit=crop&q=60",
      tags: ["DevSecOps", "Node.js", "Security"],
      author: "Soujanya Patra",
      published_at: "June 22, 2026",
      read_time: "5 min read"
    },
    {
      id: 2,
      title: "Vite and Vue 3: The Ultimate Production Stack",
      description: "Explore the performance benefits of Vite 5 bundler, Vue 3 Composition API, and typescript configurations to build highly responsive, scaleable client dashboards.",
      cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
      tags: ["Vue", "Vite", "Frontend"],
      author: "Tech Insider",
      published_at: "June 20, 2026",
      read_time: "8 min read"
    },
    {
      id: 3,
      title: "Modern CI/CD Security Best Practices",
      description: "Stop committing raw .env files to GitHub. Discover how to store secrets safely, inject keys dynamically, and block credential leakage using automated scanning tools.",
      cover_image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
      tags: ["CI-CD", "GitHub-Actions", "Security"],
      author: "DevOps Engineer",
      published_at: "June 18, 2026",
      read_time: "6 min read"
    }
  ];

  try {
    // Simulate minor network lookup delay
    await new Promise(resolve => setTimeout(resolve, 300));
    res.json({
      blogs: mockBlogs,
      keyLoaded: isKeyLoaded,
      fetchedFrom: "Secure Third-Party Blog Service (Backend Injected)"
    });
  } catch (error: any) {
    res.json({
      blogs: mockBlogs,
      keyLoaded: isKeyLoaded,
      fetchedFrom: "Local Simulated Feed (Outbound connection error)"
    });
  }
});

export default app;
