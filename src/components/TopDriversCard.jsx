/**
 * TopDriversCard Component
 *
 * Top 3 drivers podium display card
 */

import React from 'react';

const TopDriversCard = ({
  selectedSeason,
  loadingDrivers,
  topDrivers,
  onViewModeChange,
}) => {
  return (
    <div className="f1-carbon-card h-100">
      <div
        className="card-header text-center"
        style={{
          background: 'var(--f1-gradient-champion)',
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
              'linear-gradient(45deg, rgba(255,215,0,0.1) 0%, transparent 50%)',
          }}
        ></div>
        <div className="position-relative">
          <i
            className="fas fa-trophy fa-2x mb-2"
            style={{ color: 'var(--f1-gold)' }}
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
            CHAMPIONSHIP PODIUM
          </h5>
          <p className="mb-0 opacity-90" style={{ fontSize: 'var(--text-sm)' }}>
            Top 3 Drivers - {selectedSeason}
          </p>
        </div>
      </div>

      <div
        className="card-body p-3"
        style={{ background: 'var(--f1-grey-50)' }}
      >
        {loadingDrivers ? (
          <div className="text-center py-3">
            <div className="f1-loader mb-2"></div>
            <h6>Loading Championship Podium...</h6>
            <p className="text-muted mb-0">
              Fetching {selectedSeason} driver standings
            </p>
          </div>
        ) : topDrivers && topDrivers.length >= 3 ? (
          <div className="podium-container">
            {/* Podium Layout */}
            <div className="row g-1 mb-3">
              {/* 2nd Place */}
              <div className="col-4 d-flex flex-column align-items-center">
                <div
                  className="podium-step podium-second mb-2"
                  style={{
                    height: '60px',
                    width: '100%',
                    background:
                      'linear-gradient(135deg, #C0C0C0 0%, #E5E5E5 100%)',
                    borderRadius:
                      'var(--border-radius) var(--border-radius) 0 0',
                    border: '2px solid #A8A8A8',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    className="podium-number"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-black)',
                      fontSize: '1.2rem',
                      color: '#666',
                    }}
                  >
                    2
                  </div>
                  <div className="podium-medal mb-1">
                    <i
                      className="fas fa-medal"
                      style={{ fontSize: '1.2rem', color: '#C0C0C0' }}
                    ></i>
                  </div>
                </div>
                <div className="text-center px-1">
                  <div
                    className="driver-name fw-bold mb-1"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontSize: '11px',
                      color: 'var(--f1-grey-800)',
                      lineHeight: '1.2',
                      wordBreak: 'break-word',
                    }}
                  >
                    {topDrivers[1]?.driver}
                  </div>
                  <div
                    className="driver-points"
                    style={{
                      color: 'var(--f1-red-primary)',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      fontFamily: 'var(--font-racing)',
                    }}
                  >
                    {topDrivers[1]?.points}
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      color: 'var(--f1-grey-600)',
                      fontWeight: 'bold',
                    }}
                  >
                    POINTS
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="col-4 d-flex flex-column align-items-center">
                <div
                  className="podium-step podium-first mb-2"
                  style={{
                    height: '80px',
                    width: '100%',
                    background:
                      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius:
                      'var(--border-radius) var(--border-radius) 0 0',
                    border: '2px solid #DAA520',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(255,215,0,0.3)',
                  }}
                >
                  <div
                    className="podium-crown"
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      fontSize: '1.2rem',
                    }}
                  >
                    👑
                  </div>
                  <div
                    className="podium-number"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-black)',
                      fontSize: '1.2rem',
                      color: '#B8860B',
                    }}
                  >
                    1
                  </div>
                  <div className="podium-medal mb-1">
                    <i
                      className="fas fa-medal"
                      style={{ fontSize: '1.2rem', color: '#FFD700' }}
                    ></i>
                  </div>
                </div>
                <div className="text-center px-1">
                  <div
                    className="driver-name fw-bold mb-1"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontSize: '12px',
                      color: 'var(--f1-red-primary)',
                      textTransform: 'uppercase',
                      lineHeight: '1.2',
                      wordBreak: 'break-word',
                    }}
                  >
                    {topDrivers[0]?.driver}
                  </div>
                  <div
                    className="driver-points"
                    style={{
                      color: 'var(--f1-gold)',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      fontFamily: 'var(--font-racing)',
                    }}
                  >
                    {topDrivers[0]?.points}
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      color: 'var(--f1-grey-600)',
                      fontWeight: 'bold',
                    }}
                  >
                    POINTS • {topDrivers[0]?.wins} WINS
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="col-4 d-flex flex-column align-items-center">
                <div
                  className="podium-step podium-third mb-2"
                  style={{
                    height: '45px',
                    width: '100%',
                    background:
                      'linear-gradient(135deg, #CD7F32 0%, #D4AF37 100%)',
                    borderRadius:
                      'var(--border-radius) var(--border-radius) 0 0',
                    border: '2px solid #B87333',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    className="podium-number"
                    style={{
                      position: 'absolute',
                      top: '6px',
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-black)',
                      fontSize: '1.2rem',
                      color: '#8B4513',
                    }}
                  >
                    3
                  </div>
                  <div className="podium-medal mb-1">
                    <i
                      className="fas fa-medal"
                      style={{ fontSize: '1.2rem', color: '#CD7F32' }}
                    ></i>
                  </div>
                </div>
                <div className="text-center px-1">
                  <div
                    className="driver-name fw-bold mb-1"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontSize: '11px',
                      color: 'var(--f1-grey-800)',
                      lineHeight: '1.2',
                      wordBreak: 'break-word',
                    }}
                  >
                    {topDrivers[2]?.driver}
                  </div>
                  <div
                    className="driver-points"
                    style={{
                      color: 'var(--f1-red-primary)',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      fontFamily: 'var(--font-racing)',
                    }}
                  >
                    {topDrivers[2]?.points}
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      color: 'var(--f1-grey-600)',
                      fontWeight: 'bold',
                    }}
                  >
                    POINTS
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <i className="fas fa-spinner fa-spin me-2"></i>
            Loading championship data...
          </div>
        )}
      </div>

      <div className="card-footer text-center">
        <button
          className="btn-f1-primary btn-sm mt-1 mb-1"
          onClick={() => onViewModeChange('drivers')}
          disabled={loadingDrivers}
        >
          {loadingDrivers ? (
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
              VIEW FULL STANDINGS
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TopDriversCard;
