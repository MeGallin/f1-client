/**
 * Custom hook for F1 News data
 */

import { useState, useEffect, useCallback } from 'react';
import { rssService } from '../services/rssService';

export const useF1News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch news from RSS feed
  const fetchNews = useCallback(
    async (force = false) => {
      // Skip if already loading
      if (isLoading && !force) return;

      try {
        setIsLoading(true);
        setError(null);

        // Clear cache if force refresh
        if (force) {
          rssService.clearCache();
        }

        const news = await rssService.fetchF1News();

        setNewsItems(news);
        setLastUpdated(new Date());
        console.log(`✅ Loaded ${news.length} F1 news items`);
      } catch (err) {
        console.error('❌ Error fetching F1 news:', err);
        setError('Unable to load F1 news feed');
        // Don't clear news items on error, keep previous data
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  // Auto-refresh news every 30 minutes
  useEffect(() => {
    // Initial fetch
    fetchNews();

    // Set up auto-refresh interval
    const interval = setInterval(() => {
      fetchNews();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [fetchNews]);

  // Manual refresh function
  const refreshNews = useCallback(() => {
    fetchNews(true);
  }, [fetchNews]);

  return {
    newsItems,
    isLoading,
    error,
    lastUpdated,
    refreshNews,
    hasNews: newsItems && newsItems.length > 0,
  };
};
