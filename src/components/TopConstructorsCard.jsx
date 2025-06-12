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
    <div className="f1-carbon-card h-100">
      <div
        className="card-header text-center"
        style={{
          background: 'var(--f1-gradient-red)',
          color: 'var(--f1-white)',
          borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(45deg, rgba(220,38,38,0.2) 0%, transparent 50%)',
          }}
        ></div>
        <div className="position-relative">
          <i
            className="fas fa-car-side fa-2x mb-2"
            style={{ color: 'var(--f1-white)' }}
          ></i>
          <h5
            className="mb-1"
            style={{
              fontFamily: 'var(--font-racing)',
              fontWeight: 'var(--fw-black)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: 'var(--text-lg)',
            }}
          >
            CONSTRUCTOR ELITE
          </h5>
          <p className="mb-0 opacity-90" style={{ fontSize: 'var(--text-sm)' }}>
            Top 3 Teams - {selectedSeason}
          </p>
        </div>
      </div>

      <div
        className="card-body p-3"
        style={{ background: 'var(--f1-grey-50)' }}
      >
        {loadingConstructors ? (
          <div className="text-center py-3">
            <div className="f1-loader mb-2"></div>
            <h6>Loading Constructor Elite...</h6>
            <p className="text-muted mb-0">
              Fetching {selectedSeason} constructor standings
            </p>
          </div>
        ) : topConstructors && topConstructors.length >= 3 ? (
          <div className="constructor-showcase">
            {topConstructors.slice(0, 3).map((constructor, index) => {
              const rankings = [
                {
                  icon: 'fas fa-crown',
                  color: 'var(--f1-gold)',
                  bgGradient:
                    'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  borderColor: '#DAA520',
                  shadow: '0 2px 6px rgba(255,215,0,0.3)',
                },
                {
                  icon: 'fas fa-medal',
                  color: '#C0C0C0',
                  bgGradient:
                    'linear-gradient(135deg, #C0C0C0 0%, #E5E5E5 100%)',
                  borderColor: '#A8A8A8',
                  shadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
                {
                  icon: 'fas fa-award',
                  color: '#CD7F32',
                  bgGradient:
                    'linear-gradient(135deg, #CD7F32 0%, #D4AF37 100%)',
                  borderColor: '#B87333',
                  shadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
              ];

              return (
                <div
                  key={constructor.position}
                  className="constructor-card mb-2 f1-interactive"
                  style={{
                    background: rankings[index].bgGradient,
                    borderRadius: 'var(--border-radius)',
                    border: `2px solid ${rankings[index].borderColor}`,
                    padding: '0.5rem',
                    boxShadow: rankings[index].shadow,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Background Pattern */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      fontSize: '2rem',
                      opacity: 0.15,
                      color: 'white',
                      lineHeight: 1,
                      transform: 'rotate(15deg)',
                    }}
                  >
                    <i className={rankings[index].icon}></i>
                  </div>

                  <div className="row align-items-center position-relative g-1">
                    <div className="col-2 text-center">
                      <div
                        className="ranking-badge"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.95)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-racing)',
                            fontWeight: 'var(--fw-black)',
                            fontSize: '0.8rem',
                            color: rankings[index].borderColor,
                          }}
                        >
                          {constructor.position}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <h6
                        className="mb-0 fw-bold"
                        style={{
                          fontFamily: 'var(--font-racing)',
                          color:
                            index === 0
                              ? 'var(--f1-white)'
                              : 'var(--f1-grey-800)',
                          fontSize: '13px',
                          textShadow:
                            index === 0
                              ? '1px 1px 2px rgba(0,0,0,0.5)'
                              : 'none',
                          lineHeight: '1.2',
                        }}
                      >
                        {constructor.name}
                      </h6>
                      <div
                        style={{
                          color:
                            index === 0
                              ? 'rgba(255,255,255,0.9)'
                              : 'var(--f1-grey-600)',
                          fontWeight: 'var(--fw-semibold)',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {constructor.nationality}
                      </div>
                    </div>

                    <div className="col-4 text-end">
                      <div
                        className="constructor-points"
                        style={{
                          fontFamily: 'var(--font-racing)',
                          fontWeight: 'var(--fw-black)',
                          fontSize: index === 0 ? '16px' : '14px',
                          color:
                            index === 0
                              ? 'var(--f1-white)'
                              : 'var(--f1-grey-800)',
                          textShadow:
                            index === 0
                              ? '1px 1px 2px rgba(0,0,0,0.5)'
                              : 'none',
                          lineHeight: '1',
                        }}
                      >
                        {constructor.points}
                      </div>
                      <div
                        style={{
                          color:
                            index === 0
                              ? 'rgba(255,255,255,0.9)'
                              : 'var(--f1-grey-600)',
                          fontWeight: 'var(--fw-bold)',
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        POINTS • {constructor.wins}W
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-3">
            <i className="fas fa-spinner fa-spin me-2"></i>
            Loading constructor data...
          </div>
        )}
      </div>

      <div className="card-footer text-center">
        <button
          className="btn-f1-secondary btn-sm mt-1 mb-1"
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
              VIEW CONSTRUCTOR HISTORY
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TopConstructorsCard;
