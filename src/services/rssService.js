/**
 * RSS Service for F1 News
 *
 * Fetches and parses F1 news from Autosport RSS feed
 */

import axios from 'axios';

class RSSService {
  constructor() {
    // CORS proxies for accessing RSS feeds
    this.corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
    ];
    this.currentProxyIndex = 0;
    this.autosportRSSUrl = 'https://www.autosport.com/rss/f1/news/';
    this.cache = new Map();
    this.cacheTTL = 30 * 60 * 1000; // 30 minutes cache
  }

  /**
   * Parse XML string to DOM Document
   */
  parseXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error(`XML parsing error: ${parserError.textContent}`);
    }

    return xmlDoc;
  }

  /**
   * Extract news items from RSS XML
   */
  extractNewsItems(xmlDoc) {
    const items = xmlDoc.querySelectorAll('item');
    const newsItems = [];

    items.forEach((item, index) => {
      try {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        const link = item.querySelector('link')?.textContent?.trim() || '';
        const description =
          item.querySelector('description')?.textContent?.trim() || '';
        const pubDate =
          item.querySelector('pubDate')?.textContent?.trim() || '';
        const guid =
          item.querySelector('guid')?.textContent?.trim() || `item-${index}`;

        // Only add items with valid titles
        if (title) {
          newsItems.push({
            id: guid,
            title: this.cleanTitle(title),
            link,
            description: this.cleanDescription(description),
            publishedAt: pubDate ? new Date(pubDate) : new Date(),
            source: 'Autosport',
          });
        }
      } catch (error) {
        console.warn('Error parsing RSS item:', error);
      }
    });

    return newsItems;
  }

  /**
   * Clean and format title for ticker display
   */
  cleanTitle(title) {
    return title
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Clean description text
   */
  cleanDescription(description) {
    return description
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Get current CORS proxy
   */
  getCurrentProxy() {
    return this.corsProxies[this.currentProxyIndex];
  }

  /**
   * Switch to next proxy
   */
  switchToNextProxy() {
    this.currentProxyIndex =
      (this.currentProxyIndex + 1) % this.corsProxies.length;
  }

  /**
   * Build proxy URL
   */
  buildProxyUrl(proxy, targetUrl) {
    if (proxy.includes('allorigins.win')) {
      return `${proxy}${encodeURIComponent(targetUrl)}`;
    } else {
      return `${proxy}${targetUrl}`;
    }
  }

  /**
   * Check if cached data is valid
   */
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    return cached && Date.now() - cached.timestamp < this.cacheTTL;
  }

  /**
   * Get cached data
   */
  getCachedData(cacheKey) {
    const cached = this.cache.get(cacheKey);
    return cached ? cached.data : null;
  }

  /**
   * Set cache data
   */
  setCacheData(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Fetch F1 news from Autosport RSS feed
   */
  async fetchF1News() {
    const cacheKey = 'autosport-f1-news';

    // Return cached data if valid
    if (this.isCacheValid(cacheKey)) {
      console.log('📰 Using cached F1 news data');
      return this.getCachedData(cacheKey);
    }

    console.log('🏎️ Fetching F1 news from Autosport RSS...');

    // Try each proxy until one works
    for (let attempt = 0; attempt < this.corsProxies.length; attempt++) {
      try {
        const currentProxy = this.getCurrentProxy();
        const proxyUrl = this.buildProxyUrl(currentProxy, this.autosportRSSUrl);

        console.log(
          `📡 Attempt ${attempt + 1}/${this.corsProxies.length} using proxy`,
        );

        const response = await axios.get(proxyUrl, {
          timeout: 8000,
          headers: {
            Accept: 'application/rss+xml, application/xml, text/xml, */*',
            'User-Agent': 'F1-MCP-Client/1.0',
          },
        });

        if (!response.data) {
          throw new Error('No data received from RSS feed');
        }

        // Parse XML and extract news items
        const xmlDoc = this.parseXML(response.data);
        const newsItems = this.extractNewsItems(xmlDoc);

        if (newsItems.length === 0) {
          throw new Error('No news items found in RSS feed');
        }

        console.log(`✅ Successfully parsed ${newsItems.length} F1 news items`);

        // Cache the results
        this.setCacheData(cacheKey, newsItems);

        return newsItems;
      } catch (error) {
        console.warn(`❌ Proxy ${attempt + 1} failed:`, error.message);

        // Switch to next proxy for next attempt
        this.switchToNextProxy();

        // If this is the last attempt, handle the error
        if (attempt === this.corsProxies.length - 1) {
          console.error('❌ All proxy attempts failed');

          // Return cached data if available, even if expired
          const cachedData = this.getCachedData(cacheKey);
          if (cachedData) {
            console.log('🔄 Returning expired cached data');
            return cachedData;
          }

          // Return empty array instead of throwing
          console.log('📰 No data available, returning empty array');
          return [];
        }
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🧹 RSS cache cleared');
  }
}

// Export singleton instance
export const rssService = new RSSService();
export default rssService;
