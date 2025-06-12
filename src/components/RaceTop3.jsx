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
    <div className="f1-top3-results mt-2">
      {' '}
      <h6
        style={{
          fontFamily: 'var(--font-racing)',
          color: 'var(--f1-grey-800)',
          textTransform: 'uppercase',
          fontSize: 'var(--text-sm)',
          marginBottom: '0.5rem',
          borderLeft: '3px solid var(--f1-red-primary)',
          paddingLeft: '0.5rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <i
          className="fas fa-trophy me-2"
          style={{ color: 'var(--f1-gold)' }}
        ></i>
        PODIUM FINISHERS
      </h6>
      <div className="f1-top3-grid">
        {top3Finishers.map((result) => (
          <div
            key={result.position}
            className="f1-top3-item"
            style={{
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {' '}
            <div
              className="f1-position"
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                marginRight: '0.75rem',
                width: '1.5rem',
                height: '1.5rem',
                backgroundColor: positionColors[result.position],
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {result.position}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--f1-grey-800)' }}>
                {result.driver}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--f1-grey-600)' }}>
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
