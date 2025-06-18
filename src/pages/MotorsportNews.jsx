/**
 * Motorsport News Page
 *
 * Displays F1 news articles from RSS feed
 */

import React from 'react';
import { useF1News } from '../hooks/useF1News';
import LoadingIndicator from '../components/LoadingIndicator';

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
    <div
      className="motorsport-news-page"
      style={{
        background: 'var(--f1-gradient-dark)',
        minHeight: '100vh',
        color: 'var(--f1-white)',
        fontFamily: 'var(--font-primary)',
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--fw-black)',
              fontFamily: 'var(--font-racing)',
              color: 'var(--f1-white)',
              marginBottom: '1rem',
              letterSpacing: '1px',
              textShadow: 'var(--shadow-racing-text)',
            }}
          >
            Motorsport News
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <p
              style={{
                color: 'var(--f1-grey-300)',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--font-primary)',
              }}
            >
              Latest F1 news from Autosport RSS feed
              {lastUpdated && (
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--f1-grey-400)',
                    marginLeft: '0.5rem',
                  }}
                >
                  • Last updated: {formatDate(lastUpdated)}
                </span>
              )}
            </p>{' '}
            <button
              onClick={refreshNews}
              disabled={isRefreshing}
              style={{
                background: isRefreshing
                  ? 'var(--f1-grey-600)'
                  : 'var(--f1-gradient-red)',
                color: 'var(--f1-white)',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--border-radius)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-semibold)',
                border: 'none',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                transition: 'var(--transition-racing)',
                boxShadow: 'var(--shadow-racing)',
                fontFamily: 'var(--font-primary)',
                opacity: isRefreshing ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isRefreshing) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-racing-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRefreshing) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-racing)';
                }
              }}
              onMouseDown={(e) => {
                if (!isRefreshing) {
                  e.target.style.transform = 'translateY(0)';
                }
              }}
              onMouseUp={(e) => {
                if (!isRefreshing) {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh News'}
            </button>
          </div>
        </div>{' '}
        {/* Error State */}
        {error && !hasNews && (
          <div
            style={{
              background: 'var(--f1-gradient-danger)',
              border: `2px solid var(--f1-red-primary)`,
              borderRadius: 'var(--border-radius-lg)',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-racing)',
              marginBottom: '2rem',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--f1-white)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-racing)',
              }}
            >
              Unable to Load News
            </h2>
            <p
              style={{
                color: 'var(--f1-grey-200)',
                marginBottom: '1.5rem',
                fontSize: 'var(--text-base)',
              }}
            >
              {error}
            </p>{' '}
            <button
              onClick={refreshNews}
              disabled={isRefreshing}
              style={{
                background: isRefreshing
                  ? 'var(--f1-grey-600)'
                  : 'var(--f1-gradient-red)',
                color: 'var(--f1-white)',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--border-radius)',
                fontWeight: 'var(--fw-semibold)',
                border: 'none',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                transition: 'var(--transition-racing)',
                boxShadow: 'var(--shadow-racing)',
                fontSize: 'var(--text-base)',
                opacity: isRefreshing ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isRefreshing) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-racing-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRefreshing) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-racing)';
                }
              }}
            >
              {isRefreshing ? 'Loading...' : 'Try Again'}
            </button>
          </div>
        )}
        {/* News Articles */}
        {hasNews && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {newsItems.map((article, index) => (
              <article
                key={`${article.id}-${index}`}
                style={{
                  background: 'var(--f1-gradient-grey)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: '1.5rem',
                  border: `1px solid var(--f1-grey-700)`,
                  boxShadow: 'var(--shadow-racing)',
                  transition: 'var(--transition-racing)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--f1-red-primary)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-racing-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--f1-grey-700)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-racing)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <h2
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--f1-white)',
                      flex: '1',
                      fontFamily: 'var(--font-racing)',
                      lineHeight: '1.4',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {article.title}
                  </h2>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--f1-grey-400)',
                    }}
                  >
                    <span
                      style={{
                        background: 'var(--f1-gradient-red)',
                        color: 'var(--f1-white)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--border-radius)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--fw-semibold)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {article.source}
                    </span>
                    {article.publishedAt && (
                      <time
                        dateTime={article.publishedAt}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                    )}
                  </div>
                </div>

                {article.description && (
                  <p
                    style={{
                      color: 'var(--f1-grey-300)',
                      marginBottom: '1.5rem',
                      lineHeight: '1.6',
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-primary)',
                    }}
                  >
                    {article.description}
                  </p>
                )}

                {article.link && (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--f1-red-light)',
                      fontWeight: 'var(--fw-semibold)',
                      textDecoration: 'none',
                      transition: 'var(--transition-fast)',
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'var(--font-primary)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--f1-red-primary)';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--f1-red-light)';
                      e.target.style.transform = 'translateX(0)';
                    }}
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
        )}{' '}
        {/* Empty State */}
        {!isLoading && !error && !hasNews && (
          <div
            style={{
              background: 'var(--f1-gradient-grey)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-racing)',
              border: `1px solid var(--f1-grey-700)`,
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                filter: 'grayscale(1) brightness(0.8)',
              }}
            >
              🏎️
            </div>
            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--f1-white)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-racing)',
              }}
            >
              No News Available
            </h2>
            <p
              style={{
                color: 'var(--f1-grey-300)',
                marginBottom: '1.5rem',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--font-primary)',
              }}
            >
              There are currently no F1 news articles to display.
            </p>{' '}
            <button
              onClick={refreshNews}
              disabled={isRefreshing}
              style={{
                background: isRefreshing
                  ? 'var(--f1-grey-600)'
                  : 'var(--f1-gradient-red)',
                color: 'var(--f1-white)',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--border-radius)',
                fontWeight: 'var(--fw-semibold)',
                border: 'none',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                transition: 'var(--transition-racing)',
                boxShadow: 'var(--shadow-racing)',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--font-primary)',
                opacity: isRefreshing ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isRefreshing) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-racing-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRefreshing) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-racing)';
                }
              }}
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
