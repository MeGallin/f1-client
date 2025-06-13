/**
 * RaceTop3 Component
 *
 * Displays the top 3 finishers of a race with their positions and teams
 */
import React from 'react';

const RaceTop3 = ({ top3Finishers, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-2">
        <div
          className="f1-loader"
          style={{ width: '2rem', height: '2rem', margin: '0 auto' }}
        ></div>
      </div>
    );
  }

  if (!top3Finishers || top3Finishers.length === 0) {
    return (
      <div className="mt-2 text-center" style={{ color: 'var(--f1-grey-600)' }}>
        No results available
      </div>
    );
  }

  const positionColors = {
    1: 'var(--f1-gold)',
    2: 'var(--f1-grey-400)',
    3: 'var(--f1-bronze)',
  };
  return (
    <div className="f1-top3-results">
      <div
        className="f1-top3-grid"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        {top3Finishers.map((result) => (
          <div
            key={result.position}
            className="f1-top3-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              background: `${positionColors[result.position]}08`,
              borderRadius: '8px',
              border: `1px solid ${positionColors[result.position]}20`,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = `${
                positionColors[result.position]
              }15`;
              e.target.style.borderColor = `${
                positionColors[result.position]
              }40`;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = `${
                positionColors[result.position]
              }08`;
              e.target.style.borderColor = `${
                positionColors[result.position]
              }20`;
            }}
          >
            {' '}
            <div
              className="f1-position"
              style={{
                color:
                  result.position === 2
                    ? 'var(--f1-grey-900)'
                    : 'var(--f1-white)',
                fontWeight: 'var(--fw-black)',
                fontSize: '0.9rem',
                marginRight: '0.75rem',
                width: '2rem',
                height: '2rem',
                background:
                  result.position === 1
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                    : result.position === 2
                    ? 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)'
                    : 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  result.position === 1
                    ? '0 4px 12px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : result.position === 2
                    ? '0 4px 12px rgba(192, 192, 192, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                    : '0 4px 12px rgba(205, 127, 50, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                fontFamily: 'var(--font-racing)',
                textShadow:
                  result.position === 2
                    ? 'none'
                    : '0 1px 2px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
              }}
            >
              {/* Medal icon for accessibility */}
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  fontSize: '0.6rem',
                  opacity: 0.8,
                }}
              >
                {result.position === 1
                  ? '🥇'
                  : result.position === 2
                  ? '🥈'
                  : '🥉'}
              </span>
              {result.position}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--f1-grey-900)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-primary)',
                  marginBottom: '0.1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {result.driver}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: positionColors[result.position],
                  fontWeight: 'var(--fw-medium)',
                  fontFamily: 'var(--font-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {result.constructor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RaceTop3;
