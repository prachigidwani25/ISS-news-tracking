import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchISSLocation, fetchAstronauts, reverseGeocode, calculateSpeed } from '../services/issService';
import { fetchNews } from '../services/newsService';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [issData, setIssData] = useState(null);
  const [issHistory, setIssHistory] = useState([]); 
  const [astros, setAstros] = useState({ people: [], number: 0 });
  const [locationName, setLocationName] = useState('Fetching location...');
  const [issLoading, setIssLoading] = useState(true);
  const [issError, setIssError] = useState(null);

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);

  const lastPositionRef = useRef(null);
  const lastFetchTimeRef = useRef(Date.now());

  const updateISS = async () => {
    try {
      const data = await fetchISSLocation();
      if (!data || isNaN(data.latitude)) {
        throw new Error('Invalid satellite data');
      }

      const now = Date.now();
      const timeDiff = (now - lastFetchTimeRef.current) / 1000;
      
      const prev = lastPositionRef.current;
      const speed = calculateSpeed(
        prev?.latitude || data.latitude,
        prev?.longitude || data.longitude,
        data.latitude,
        data.longitude,
        timeDiff || 15
      );

      const newData = { ...data, speed: Math.round(speed), timestamp: now };
      
      setIssData(newData);
      setIssHistory(prevHistory => [...prevHistory, newData].slice(-30));
      
      lastPositionRef.current = newData;
      lastFetchTimeRef.current = now;

      const name = await reverseGeocode(data.latitude, data.longitude);
      setLocationName(name);
      setIssError(null);
    } catch (err) {
      console.error('ISS Update Error:', err);
      setIssError(`ISS Connection Lost: ${err.message}`);
    } finally {
      setIssLoading(false);
    }
  };

  const updateNews = async (query = '', sort = 'publishedAt') => {
    setNewsLoading(true);
    try {
      const articles = await fetchNews(query, sort);
      setNews(articles);
      setNewsError(null);
    } catch (err) {
      setNewsError('Failed to fetch news');
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.allSettled([
        updateISS(),
        updateNews(),
        fetchAstronauts().then(setAstros)
      ]);
    };
    init();
    const interval = setInterval(updateISS, 15000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    issData,
    issHistory,
    astros,
    locationName,
    issLoading,
    issError,
    news,
    newsLoading,
    newsError,
    refreshISS: () => {
      updateISS();
      fetchAstronauts().then(setAstros);
    },
    refreshNews: updateNews,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
