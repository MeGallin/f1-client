/**
 * Custom hook for F1 News data
 */

import { useState, useEffect, useCallback } from 'react';
import { rssService } from '../services/rssService';

export const useF1News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch news from RSS feed
  const fetchNews = useCallback(
    async (isManualRefresh = false) => {
      try {
        // Only show loading for initial load or manual refresh
        if (isInitialLoading) {
          setIsLoading(true);
        } else if (isManualRefresh) {
          setIsRefreshing(true);
        }

        setError(null);

        // Clear cache if manual refresh
        if (isManualRefresh) {
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
        setIsInitialLoading(false);
        setIsRefreshing(false);
      }
    },
    [isInitialLoading],
  );
  // Auto-refresh news every 30 minutes
  useEffect(() => {
    // Initial fetch
    fetchNews(false);

    // Set up auto-refresh interval (background updates)
    const interval = setInterval(() => {
      fetchNews(false); // Background refresh - no loading indicators
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [fetchNews]);

  // Manual refresh function
  const refreshNews = useCallback(() => {
    fetchNews(true); // Manual refresh - show loading indicators
  }, [fetchNews]);

  return {
    newsItems,
    isLoading: isInitialLoading, // Only show loading for initial load
    isRefreshing, // Separate state for manual refresh
    error,
    lastUpdated,
    refreshNews,
    hasNews: newsItems && newsItems.length > 0,
  };
};
