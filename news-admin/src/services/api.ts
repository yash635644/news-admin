/**
 * api.ts
 * Admin-side API service for managing News, RSS Feeds, and Subscribers.
 * Communicates with the News Backend.
 */
// Helper to safely get env vars without crashing
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key] || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

// If VITE_API_URL is set, use it. Otherwise, default to empty string.
const API_URL = getEnv('VITE_API_URL');

const mapCategory = (cat?: string) => {
  if (cat === 'Tech') return 'Technology';
  return cat || 'World';
};

// Client RSS Feeds (Legacy Fallback)
export const CLIENT_RSS_FEEDS: Record<string, string[]> = {
  World: ['http://feeds.bbci.co.uk/news/world/rss.xml']
};

// Fallback: Fetch RSS directly from browser (Works in Preview)
const fetchClientSideRSS = async (category: string) => {
  if (category === 'Originals') return { articles: [] };

  let feedsToUse: string[] = [];

  try {
    // Try to get dynamic feeds from backend first
    if (API_URL) {
      const dynamicFeeds = await api.getRSSFeeds();
      const mappedCategory = mapCategory(category);
      // Filter by category
      feedsToUse = dynamicFeeds
        .filter((f: any) => f.category === mappedCategory || f.category === category)
        .map((f: any) => f.url);
    }
  } catch (e) {
    console.warn("Failed to fetch dynamic feeds for client-side fallback", e);
  }

  // If no dynamic feeds found (or backend down), use hardcoded fallback
  if (feedsToUse.length === 0) {
    feedsToUse = CLIENT_RSS_FEEDS[mapCategory(category)] || CLIENT_RSS_FEEDS['World'] || [];
  }

  const feedsToFetch = feedsToUse.slice(0, 4);

  try {
    const promises = feedsToFetch.map(url =>
      fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
        .then(res => res.json())
        .catch(() => null)
    );

    const results = await Promise.all(promises);
    let allArticles: any[] = [];

    results.forEach(data => {
      if (data && data.status === 'ok') {
        allArticles = [...allArticles, ...data.items.map((item: any) => ({
          title: item.title,
          summary: [item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'],
          link: item.link,
          pubDate: item.pubDate,
          source: data.feed.title,
          category: category,
          imageUrl: item.thumbnail || item.enclosure?.link
        }))];
      }
    });

    // Simple deduplication and sorting
    const sourceCounts: Record<string, number> = {};
    const diverseItems: any[] = [];
    allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    for (const item of allArticles) {
      const source = item.source || 'Unknown';
      if (!sourceCounts[source]) sourceCounts[source] = 0;
      if (sourceCounts[source] < 5) {
        sourceCounts[source]++;
        diverseItems.push(item);
      }
    }

    return { articles: diverseItems };

  } catch (e) {
    console.error("Client-side RSS fallback failed", e);
    return { articles: [] };
  }
};

const clientSideSearch = async (query: string) => {
  const searchLower = query.toLowerCase();
  const categoriesToSearch = ['World', 'India', 'Technology'];

  const searchPromises = categoriesToSearch.map(async (cat) => {
    const feeds = CLIENT_RSS_FEEDS[cat].slice(0, 2);
    try {
      const catResults = await Promise.all(feeds.map(url =>
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`).then(r => r.json()).catch(() => null)
      ));

      let catMatches: any[] = [];
      catResults.forEach(data => {
        if (data && data.status === 'ok') {
          const matches = data.items.filter((item: any) =>
            item.title.toLowerCase().includes(searchLower) ||
            (item.description && item.description.toLowerCase().includes(searchLower))
          );
          catMatches = [...catMatches, ...matches.map((item: any) => ({
            title: item.title,
            summary: [item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'],
            category: cat,
            source: data.feed.title,
            url: item.link,
            imageUrl: item.thumbnail || item.enclosure?.link,
            publishedAt: item.pubDate
          }))];
        }
      });
      return catMatches;
    } catch (e) { return []; }
  });

  const results = (await Promise.all(searchPromises)).flat();
  return { articles: results };
};

export const api = {
  /**
   * Generates AI content (summary/article) from a prompt or URL.
   */
  generateContent: async (prompt: string) => {
    if (!API_URL) {
      return {
        headline: "AI Only Available with Backend",
        summary: ["Please connect to the backend."],
        category: "System",
        tags: ["Preview"]
      };
    }

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) throw new Error('Backend request failed');
      return await response.json();
    } catch (error) {
      return { headline: "AI Offline", summary: ["Backend unavailable."], category: "World", tags: ["Error"] };
    }
  },

  /**
   * Publishes a new Original News article.
   */
  publishNews: async (newsData: any) => {
    if (!API_URL) throw new Error("Backend not configured");

    const response = await fetch(`${API_URL}/api/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });

    if (!response.ok) throw new Error('Failed to publish');
    return await response.json();
  },

  updateNews: async (id: string, newsData: any) => {
    if (!API_URL) throw new Error("Backend not configured");

    const response = await fetch(`${API_URL}/api/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });

    if (!response.ok) throw new Error('Failed to update news');
    return await response.json();
  },

  deleteNews: async (id: string) => {
    if (!API_URL) throw new Error('Backend unreachable');

    const res = await fetch(`${API_URL}/api/news/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete news');
    return true;
  },

  /**
   * Fetches all RSS Feeds configured in the system.
   */
  getRSSFeeds: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/rss-feeds`);
      if (!res.ok) throw new Error('Failed to fetch feeds');
      return await res.json();
    }
    return [];
  },

  addRSSFeed: async (name: string, url: string, category: string) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/rss-feeds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, category })
      });
      if (!res.ok) throw new Error('Failed to add feed');
      return await res.json();
    }
  },

  deleteRSSFeed: async (id: string) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/rss-feeds/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete feed');
      return true;
    }
  },

  searchNews: async (query: string) => {
    if (API_URL) {
      try {
        const response = await fetch(`${API_URL}/api/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error('Search request failed');
        return await response.json();
      } catch (error) {
        return await clientSideSearch(query);
      }
    }
    return await clientSideSearch(query);
  },

  getLiveFeed: async (category?: string) => {
    const mappedCategory = mapCategory(category);

    if (API_URL) {
      try {
        const url = new URL(`${API_URL}/api/live-feed`);
        if (mappedCategory) url.searchParams.append('category', mappedCategory);
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Backend feed request failed');
        return await response.json();
      } catch (error) {
        console.warn("Backend unavailable, using client-side fallback");
      }
    }
    return await fetchClientSideRSS(mappedCategory || 'World');
  },

  getSubscribers: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/subscribers`);
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      return await res.json();
    }
    return [];
  },

  checkRSSHealth: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/rss-feeds/health`);
      if (!res.ok) throw new Error('Failed to check health');
      return await res.json();
    }
    return {};
  },

  sendNewsletter: async (subject: string, content: string) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/newsletter/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content })
      });
      if (!res.ok) throw new Error('Failed to send newsletter');
      return await res.json();
    }
    return { success: false };
  },

  getAllNews: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/news`);
      if (!res.ok) throw new Error('Failed to fetch news');
      return await res.json();
    }
    return [];
  },

  login: async (email, password) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      return await res.json();
    }
    throw new Error('Backend unreachable');
  },

  getStats: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    }
    return {
      total: 0, aiCount: 0, breakingCount: 0, featuredCount: 0, originals: 0, live: 0, feeds: 0
    };
  }
};