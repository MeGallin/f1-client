/**
 * TopConstructorsCard Component
 *
 * Top 3 constructors podium display card
 */

import React from 'react';

const TopConstructorsCard = ({
  selectedSeason,
  loadingConstructors,
  topConstructors,
  onViewModeChange,
}) => {
  return (
    <div className="col-lg-6 mb-4">
      <div className="f1-carbon-card h-100">
        <div
          className="card-header"
          style={{
            background: 'var(--f1-gradient-red)',
            color: 'var(--f1-white)',
            borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0',
          }}
        >
          <h5
            className="mb-0"
            style={{
              fontFamily: 'var(--font-racing)',
              fontWeight: 'var(--fw-bold)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            <i className="fas fa-building me-2"></i>
            Top 3 Constructors - {selectedSeason}
          </h5>
        </div>
        <div className="card-body">
          {loadingConstructors ? (
            <div className="text-center py-4">
              <div className="f1-loader mb-3"></div>
              <h6>Loading Top 3 Constructors...</h6>
              <p className="text-muted mb-0">
                Fetching {selectedSeason} championship data
              </p>
            </div>
          ) : topConstructors && topConstructors.length >= 3 ? (
            <>
              {topConstructors.slice(0, 3).map((constructor, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                const colors = [
                  'text-warning',
                  'text-secondary',
                  'text-warning',
                ];
                return (
                  <div
                    key={constructor.position}
                    className="d-flex align-items-center mb-3 f1-interactive"
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--border-radius)',
                      background:
                        index === 0
                          ? 'var(--f1-red-pale)'
                          : 'var(--f1-grey-50)',
                      border:
                        index === 0
                          ? '2px solid var(--f1-red-light)'
                          : '1px solid var(--f1-grey-200)',
                    }}
                  >
                    <div className="me-3">
                      <span className="fs-2">{medals[index]}</span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold">{constructor.name}</h6>
                      <small className="text-muted">
                        {constructor.nationality}
                      </small>
                    </div>
                    <div className="text-end">
                      <div
                        className={`fw-bold ${colors[index]} f1-logo-text`}
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontFamily: 'var(--font-data)',
                        }}
                      >
                        {constructor.points} pts
                      </div>
                      <small className="text-muted">
                        {constructor.wins} wins
                      </small>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-spinner fa-spin me-2"></i>
              Loading constructor data...
            </div>
          )}
        </div>
        <div className="card-footer">
          <button
            className="btn-f1-secondary btn-sm w-100"
            onClick={() => onViewModeChange('constructors')}
            disabled={loadingConstructors}
          >
            {loadingConstructors ? (
              <>
                <div
                  className="f1-loader me-2"
                  style={{
                    width: '1rem',
                    height: '1rem',
                    display: 'inline-block',
                  }}
                ></div>
                Loading...
              </>
            ) : (
              <>
                <i className="fas fa-list me-1"></i>
                View Full Constructor Standings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopConstructorsCard;
