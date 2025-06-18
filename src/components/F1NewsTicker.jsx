/**
 * F1 News Ticker Component
 *
 * Mobile-first news ticker using react-fast-marquee for smooth scrolling
 */

import React, { memo } from 'react';
import Marquee from 'react-fast-marquee';
import { useF1News } from '../hooks/useF1News';
import './F1NewsTicker.css';

const F1NewsTicker = memo(() => {
  const { newsItems, isLoading, error, hasNews } = useF1News();

  // Render ticker content based on state
  const renderTickerContent = () => {
    if (isLoading) {
      return (
        <div className="f1-ticker-item">
          <span className="f1-ticker-icon">🏎️</span>
          <span className="f1-ticker-text">Loading F1 news...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="f1-ticker-item error">
          <span className="f1-ticker-icon">⚠️</span>
          <span className="f1-ticker-text">
            F1 news feed temporarily unavailable
          </span>
        </div>
      );
    }

    if (!hasNews) {
      return (
        <div className="f1-ticker-item">
          <span className="f1-ticker-icon">🏎️</span>
          <span className="f1-ticker-text">No F1 news available</span>
        </div>
      );
    }

    // Render news items
    return newsItems.map((item, index) => (
      <div key={`${item.id}-${index}`} className="f1-ticker-item">
        <span className="f1-ticker-icon">🏎️</span>
        <span className="f1-ticker-text">{item.title}</span>
        <span className="f1-ticker-source">- {item.source}</span>
      </div>
    ));
  };
  return (
    <div className="f1-ticker-container">
      {/* Ticker Label */}
      <div className="f1-ticker-label">
        <span className="f1-ticker-brand">F1 NEWS</span>
        {hasNews && (
          <span className="f1-ticker-count">({newsItems.length})</span>
        )}
      </div>

      {/* Ticker Content using react-fast-marquee */}
      <div className="f1-ticker-content">
        <Marquee
          speed={60}
          pauseOnHover={true}
          gradient={true}
          gradientColor="rgb(17, 24, 39)"
          gradientWidth={50}
          autoFill={true}
        >
          {renderTickerContent()}
        </Marquee>
      </div>
    </div>
  );
});

F1NewsTicker.displayName = 'F1NewsTicker';

export default F1NewsTicker;
