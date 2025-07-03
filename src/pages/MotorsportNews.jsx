/**
 * Motorsport News Page
 *
 * Displays F1 news articles from RSS feed
 */

import React from 'react';
import { useF1News } from '../hooks/useF1News';
import LoadingIndicator from '../components/LoadingIndicator';
import './MotorsportNews.css'; // Import the new styles

const MotorsportNews = () => {
  const {
    newsItems,
    isLoading,
    isRefreshing,
    error,
    hasNews,
    refreshNews,
    lastUpdated,
  } = useF1News();

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  if (isLoading && !hasNews) {
    return <LoadingIndicator message="Loading F1 news..." />;
  }
  return (
    <div className="motorsport-news-page">
      <div className="container mx-auto px-4 py-8">
        <div className="news-header mb-8">
          <h1>Motorsport News</h1>
          <div className="news-header-meta">
            <p className="news-source">
              Latest F1 news from Autosport RSS feed
              {lastUpdated && (
                <span className="last-updated">
                  • Last updated: {formatDate(lastUpdated)}
                </span>
              )}
            </p>
            <button
              onClick={refreshNews}
              disabled={isRefreshing}
              className="refresh-button"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh News'}
            </button>
          </div>
        </div>

        {error && !hasNews && (
          <div className="error-state">
            <h2>Unable to Load News</h2>
            <p>{error}</p>
            <button
              onClick={refreshNews}
              disabled={isRefreshing}
              className="refresh-button"
            >
              {isRefreshing ? 'Loading...' : 'Try Again'}
            </button>
          </div>
        )}

        {hasNews && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {newsItems.map((article, index) => (
              <article
                key={`${article.id}-${index}`}
                className="news-article"
                onClick={() => window.open(article.link, '_blank')}
              >
                <div className="article-header">
                  <h2 className="article-title">{article.title}</h2>
                  <div className="article-meta">
                    <span className="article-source-badge">
                      {article.source}
                    </span>
                    {article.publishedAt && (
                      <time
                        dateTime={article.publishedAt}
                        className="article-time"
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                    )}
                  </div>
                </div>

                {article.description && (
                  <p className="article-description">{article.description}</p>
                )}

                {article.link && (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more-link"
                  >
                    Read Full Article
                    <i
                      className="fas fa-external-link-alt"
                      style={{ fontSize: 'var(--text-xs)' }}
                    ></i>
                  </a>
                )}
              </article>
            ))}
          </div>
        )}

        {!isLoading && !error && !hasNews && (
          <div className="empty-state">
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                filter: 'grayscale(1) brightness(0.8)',
              }}
            >
              🏎️
            </div>
            <h2>No News Available</h2>
            <p>There are currently no F1 news articles to display.</p>
            <button
              onClick={refreshNews}
              disabled={isRefreshing}
              className="refresh-button"
            >
              {isRefreshing ? 'Checking...' : 'Check for News'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotorsportNews;
