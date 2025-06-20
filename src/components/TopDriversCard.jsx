/**
 * TopDriversCard Component
 *
 * Top 3 drivers podium display card - Redesigned Championship Podium
 */

import React from 'react';

const TopDriversCard = ({
  selectedSeason,
  loadingDrivers,
  topDrivers,
  onViewModeChange,
}) => {
  return (
    <div className="modern-f1-card h-100">
      {/* Card Header */}
      <div
        className="card-header text-center"
        style={{
          background:
            'linear-gradient(135deg, var(--f1-gold) 0%, #FFA500 100%)',
          color: 'var(--f1-grey-900)',
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          overflow: 'hidden',
          padding: '1.5rem 1rem',
          border: 'none',
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
              'linear-gradient(45deg, rgba(255,215,0,0.15) 0%, transparent 50%)',
            animation: 'pulseGlow 4s ease-in-out infinite',
          }}
        ></div>
        <div className="position-relative">
          <h5
            className="mb-1"
            style={{
              fontFamily: 'var(--font-racing)',
              fontWeight: 'var(--fw-black)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: '1.1rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            CHAMPIONSHIP PODIUM
          </h5>
          <p
            className="mb-0"
            style={{
              fontSize: '0.85rem',
              opacity: 0.8,
              fontWeight: 'var(--fw-medium)',
            }}
          >
            Top 3 Drivers - {selectedSeason}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div
        className="card-body"
        style={{
          background: 'var(--f1-white)',
          padding: '2rem 1.5rem',
          borderRadius: '0 0 16px 16px',
        }}
      >
        {loadingDrivers ? (
          <div className="text-center py-4">
            <div className="f1-loader mb-3" style={{ margin: '0 auto' }}></div>
            <h6
              style={{
                fontFamily: 'var(--font-racing)',
                color: 'var(--f1-grey-800)',
                fontSize: '1rem',
                fontWeight: 'var(--fw-bold)',
              }}
            >
              Loading Championship Podium...
            </h6>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Fetching {selectedSeason} driver standings
            </p>
          </div>
        ) : topDrivers && topDrivers.length >= 3 ? (
          <>
            {/* Podium Layout - Based on Mockup Design */}
            <div
              className="d-flex justify-content-center align-items-end mb-4"
              style={{ gap: '1rem' }}
            >
              {/* 2nd Place - Silver */}
              <div className="text-center" style={{ flex: '0 0 28%' }}>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)',
                    color: 'var(--f1-grey-900)',
                    borderRadius: '12px',
                    padding: '1.25rem 0.75rem',
                    fontSize: '1.8rem',
                    fontWeight: 'var(--fw-black)',
                    fontFamily: 'var(--font-racing)',
                    boxShadow: '0 4px 15px rgba(192, 192, 192, 0.4)',
                    border: '2px solid #A8A8A8',
                    position: 'relative',
                    minHeight: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease',
                  }}
                  className="podium-step"
                >
                  2
                </div>
                <div className="mt-3">
                  <p
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-bold)',
                      fontSize: '0.9rem',
                      color: 'var(--f1-grey-800)',
                      lineHeight: '1.2',
                    }}
                  >
                    {topDrivers[1]?.driver}
                  </p>
                  <p
                    className="mb-0"
                    style={{
                      color: 'var(--f1-red-primary)',
                      fontWeight: 'var(--fw-bold)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {topDrivers[1]?.points} PTS
                  </p>
                </div>
              </div>

              {/* 1st Place - Gold (Elevated) */}
              <div className="text-center" style={{ flex: '0 0 32%' }}>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, var(--f1-gold) 0%, #FFA500 100%)',
                    color: 'var(--f1-grey-900)',
                    borderRadius: '12px',
                    padding: '1.75rem 0.75rem',
                    fontSize: '2.2rem',
                    fontWeight: 'var(--fw-black)',
                    fontFamily: 'var(--font-racing)',
                    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)',
                    border: '2px solid #DAA520',
                    position: 'relative',
                    minHeight: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'scale(1.05) translateY(-10px)',
                    transition: 'transform 0.3s ease',
                  }}
                  className="podium-step podium-winner"
                >
                  1
                </div>
                <div className="mt-3">
                  <p
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-black)',
                      fontSize: '1rem',
                      color: 'var(--f1-red-primary)',
                      lineHeight: '1.2',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {topDrivers[0]?.driver}
                  </p>
                  <p
                    className="mb-0"
                    style={{
                      color: 'var(--f1-red-primary)',
                      fontWeight: 'var(--fw-bold)',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {topDrivers[0]?.points} PTS • {topDrivers[0]?.wins || 0}{' '}
                    WINS
                  </p>
                </div>
              </div>

              {/* 3rd Place - Bronze */}
              <div className="text-center" style={{ flex: '0 0 28%' }}>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #CD7F32 0%, #D4AF37 100%)',
                    color: 'var(--f1-white)',
                    borderRadius: '12px',
                    padding: '1.25rem 0.75rem',
                    fontSize: '1.8rem',
                    fontWeight: 'var(--fw-black)',
                    fontFamily: 'var(--font-racing)',
                    boxShadow: '0 4px 15px rgba(205, 127, 50, 0.4)',
                    border: '2px solid #B87333',
                    position: 'relative',
                    minHeight: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease',
                  }}
                  className="podium-step"
                >
                  3
                </div>
                <div className="mt-3">
                  <p
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-bold)',
                      fontSize: '0.9rem',
                      color: 'var(--f1-grey-800)',
                      lineHeight: '1.2',
                    }}
                  >
                    {topDrivers[2]?.driver}
                  </p>
                  <p
                    className="mb-0"
                    style={{
                      color: 'var(--f1-red-primary)',
                      fontWeight: 'var(--fw-bold)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {topDrivers[2]?.points} PTS
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <button
              className="btn w-100"
              onClick={() => onViewModeChange('drivers')}
              style={{
                background: 'var(--f1-gradient-red)',
                color: 'var(--f1-white)',
                border: 'none',
                borderRadius: '10px',
                padding: '1rem 2rem',
                fontSize: '0.9rem',
                fontWeight: 'var(--fw-bold)',
                fontFamily: 'var(--font-accent)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
              }}
            >
              View Full Standings
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <h6
              style={{
                fontFamily: 'var(--font-racing)',
                color: 'var(--f1-grey-600)',
              }}
            >
              No Driver Data Available
            </h6>
            <p className="text-muted mb-0">
              Unable to load championship standings for {selectedSeason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TopDriversCard;
