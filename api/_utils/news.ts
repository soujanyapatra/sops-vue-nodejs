// Shared helper library for news api routes

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  source: string;
  author: string;
  published_at: string;
  category: string;
}

export const CATEGORIES = ["Technology", "Business", "AI", "World", "Sports"];

export const NEWS_API_URL = 'https://eventregistry.org/api/v1/article/getArticles';

// High-quality Mock Articles Database (Fallback)
export const MOCK_NEWS_DATABASE: Article[] = [
  // AI Category
  {
    id: "mock-ai-1",
    title: "The Dawn of Autonomous Coding Agents",
    description: "AI coding assistants are evolving from simple autocompleters to fully autonomous agents capable of pair programming, debugging, and systems engineering.",
    content: "The landscape of software development is undergoing a seismic shift. Generative AI systems, which started as basic code generators, are now acting as agentic partners. These tools can analyze entire codebases, write unit tests, execute CI/CD workflows, and resolve deployment issues autonomously. Developers are shifting from writing syntax to directing intent, raising questions about the future role of human engineers.",
    url: "https://example.com/dawn-autonomous-coding-agents",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60",
    source: "TechPulse",
    author: "Elena Rostova",
    published_at: new Date().toISOString(),
    category: "AI"
  },
  {
    id: "mock-ai-2",
    title: "Large Language Models Break Context Window Barriers",
    description: "New models feature context windows of up to 2 million tokens, enabling the analysis of entire code repositories or novels in a single query.",
    content: "Memory constraints in LLMs are fast becoming a thing of the past. Recent breakthroughs have extended active context windows to millions of tokens. This allows developers to pass entire structural architectures, API documentations, and historical codebases to the AI, receiving highly accurate contextual recommendations. However, managing the latency and cost of these massive prompts remains a challenge for production engineering.",
    url: "https://example.com/llm-context-window-breakthrough",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60",
    source: "Cognitive Digest",
    author: "Dr. Marcus Vance",
    published_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    category: "AI"
  },

  // Technology Category
  {
    id: "mock-tech-1",
    title: "DevSecOps: Moving Security to the Left",
    description: "Why modern software teams are encrypting their secrets using Mozilla SOPS and AGE inside version control instead of risking raw .env file leaks.",
    content: "Security is no longer an afterthought. With DevSecOps practices gaining widespread adoption, developers are integrating vulnerability scans and secret cryptography directly into Git workflows. By using envelope encryption tools like Mozilla SOPS and public key cryptography via AGE, teams can keep credentials protected in plain sight in their repositories, decrypting them dynamically only at run-time or within secure runners.",
    url: "https://example.com/devsecops-shift-left-secrets",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=800&auto=format&fit=crop&q=60",
    source: "SecureDev",
    author: "Soujanya Patra",
    published_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: "Technology"
  },
  {
    id: "mock-tech-2",
    title: "Vite 6 release sets new speed benchmarks for frontend dev",
    description: "The new Vite framework speeds up hot module replacement (HMR) and optimizes asset splitting in large-scale Vue 3 and React SPA apps.",
    content: "The bundling ecosystem continues to advance. Vite 6 has been released with optimized modular rendering and built-in Rust compilation helpers. This framework drastically decreases boot times for complex Single Page Applications (SPAs) and provides highly customized code-splitting mechanisms, allowing next-generation production builds to load in milliseconds.",
    url: "https://example.com/vite-6-bundling-speed",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
    source: "Frontend Insider",
    author: "Klaus Weber",
    published_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    category: "Technology"
  },

  // Business Category
  {
    id: "mock-biz-1",
    title: "Global Markets Rally Amid Tech Sector Growth",
    description: "Major stock indices close at record highs as enterprise cloud adoption and cybersecurity spends drive massive tech earnings.",
    content: "Global markets showed robust momentum this week, with major tech stocks leading the gains. Investors have shown renewed confidence as corporate spending on cybersecurity, AI development, and enterprise SaaS platforms continues to beat quarterly guidance. Financial analysts project this trend to persist as more traditional industries automate their operations.",
    url: "https://example.com/global-markets-tech-earnings",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60",
    source: "MarketWire",
    author: "Sarah Jenkins",
    published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    category: "Business"
  },
  {
    id: "mock-biz-2",
    title: "The Rise of Green Bonds in Tech Financing",
    description: "Tech companies issue record-breaking volume of eco-bonds to fund renewable energy projects for hyperscale datacenters.",
    content: "Environmental sustainability is becoming a core component of technology financing. Corporate tech majors are turning to Green Bonds to raise capital specifically earmarked for carbon-neutral server infrastructure. These bonds offer favorable terms to issuers while providing institutional investors with verified sustainable asset options, aligning capital flows with climate goals.",
    url: "https://example.com/green-bonds-tech-datacenter",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    source: "FinTech Journal",
    author: "Richard Croft",
    published_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    category: "Business"
  },

  // World Category
  {
    id: "mock-world-1",
    title: "Global Climate Summit Reaches Landmark Energy Agreement",
    description: "Delegates from over 180 countries sign a pact to triple renewable energy capacity and phase down fossil fuel subsidies by 2035.",
    content: "In a historic session, international climate negotiators concluded terms on a global energy treaty. The deal outlines binding benchmarks to scale up wind, solar, and geothermal power grids globally, alongside target reductions in fossil fuel financing. Developing nations will receive structural financial support to ensure equitable transitions to clean energy.",
    url: "https://example.com/climate-summit-landmark-treaty",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    source: "Global Newsroom",
    author: "Amara Okoro",
    published_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    category: "World"
  },

  // Sports Category
  {
    id: "mock-sports-1",
    title: "Championship Finals: Underdog Team Claims Victory",
    description: "A dramatic 90th-minute goal seals a historic championship win for the league's lowest-budget club.",
    content: "It was a night that will go down in sporting history. Overcoming all odds, the league underdogs secured the championship cup in a thrilling final match. The team's defensive discipline combined with a spectacular counter-attack in the final minutes allowed them to break the stalemate, spiking emotional celebrations across their home city.",
    url: "https://example.com/underdog-championship-victory",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60",
    source: "SportsNetwork",
    author: "Tom Fletcher",
    published_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    category: "Sports"
  }
];

// Helper: Map NewsAPI.ai (Event Registry) response structure to standard Article format
export const mapExternalArticles = (results: any[], defaultCategory: string): Article[] => {
  if (!Array.isArray(results)) return [];
  
  return results.map((item: any) => {
    const bodyStr = typeof item.body === 'string' ? item.body : '';
    let description = bodyStr.slice(0, 160);
    if (bodyStr.length > 160) description += '...';

    let author = 'Staff Writer';
    if (Array.isArray(item.authors) && item.authors.length > 0) {
      author = item.authors[0].name || item.authors[0].uri || 'Staff Writer';
    }

    let defaultImg = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60';
    if (defaultCategory.toLowerCase() === 'ai') {
      defaultImg = 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60';
    } else if (defaultCategory.toLowerCase() === 'technology') {
      defaultImg = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60';
    } else if (defaultCategory.toLowerCase() === 'business') {
      defaultImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60';
    } else if (defaultCategory.toLowerCase() === 'sports') {
      defaultImg = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60';
    }

    return {
      id: item.uri || Math.random().toString(),
      title: item.title || 'Untitled News Article',
      description: description || 'No summary description available for this article.',
      content: item.body || 'No detailed content available.',
      url: item.url || '#',
      image: item.image || defaultImg,
      source: item.source?.title || item.source?.uri || 'Global News',
      author: author,
      published_at: item.dateTime || new Date().toISOString(),
      category: defaultCategory
    };
  });
};

// Enable CORS utility for Vercel Serverless Functions
export function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}
