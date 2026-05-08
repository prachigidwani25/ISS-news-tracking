import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';
const CACHE_KEY = 'news_dashboard_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const MOCK_NEWS = [
  {
    title: "SpaceX Successfully Launches Next Generation Starlink Satellites",
    description: "In a spectacular night launch, SpaceX has successfully deployed 22 new Starlink satellites into low Earth orbit, further expanding its global internet constellation.",
    url: "https://spacex.com",
    urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000",
    publishedAt: new Date().toISOString(),
    source: { name: "Space Tech" },
    author: "Elon Jet"
  },
  {
    title: "NASA's James Webb Telescope Discovers Water Vapor in Distant Exoplanet Atmosphere",
    description: "Astronomers using the James Webb Space Telescope have identified significant traces of water vapor in the atmosphere of a gas giant exoplanet 700 light-years away.",
    url: "https://nasa.gov",
    urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000",
    publishedAt: new Date().toISOString(),
    source: { name: "NASA Insider" },
    author: "Sarah Orbit"
  },
  {
    title: "New Battery Technology Could Triple Electric Vehicle Range by 2026",
    description: "Researchers have announced a breakthrough in solid-state battery technology that promises to significantly increase energy density while reducing charge times.",
    url: "https://techcrunch.com",
    urlToImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000",
    publishedAt: new Date().toISOString(),
    source: { name: "Future Tech" },
    author: "Mike Volt"
  }
];

export const fetchNews = async (query = '', sortBy = 'publishedAt') => {
  // Check cache first
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { timestamp, articles, lastQuery, lastSort } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION && lastQuery === query && lastSort === sortBy) {
      return articles;
    }
  }

  if (!API_KEY) {
    console.warn('News API key missing. Returning mock data.');
    return MOCK_NEWS;
  }

  try {
    const endpoint = query ? `${BASE_URL}/everything` : `${BASE_URL}/top-headlines`;
    const params = query 
      ? { q: query, sortBy, apiKey: API_KEY, language: 'en', pageSize: 20 }
      : { country: 'us', apiKey: API_KEY, pageSize: 20 };

    const response = await axios.get(endpoint, { params });
    const articles = response.data.articles;

    if (!articles || articles.length === 0) return MOCK_NEWS;

    // Cache the results
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      articles,
      lastQuery: query,
      lastSort: sortBy
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return MOCK_NEWS;
  }
};
