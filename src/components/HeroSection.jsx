/**
 * HeroSection Component
 *
 * Reusable hero section for the F1 dashboard with gradient background and title
 */

import React from 'react';

const HeroSection = ({
  title = 'F1 Live Dashboard',
  subtitle = 'Real-time Formula 1 championship data, race results, and live standings',
}) => {
  return (
    <section
      className="text-white py-4 mb-4 position-relative"
      style={{
        background: 'var(--f1-gradient-dark)',
        minHeight: '30vh',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
          `,
          animation: 'raceTrackGlow 8s ease-in-out infinite alternate',
        }}
      ></div>

      {/* Racing Stripes Pattern */}
      <div
        className="f1-stripes-pattern"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          animation: 'raceStripes 20s linear infinite',
        }}
      ></div>

      {/* Floating Speed Lines */}
      <div
        className="position-absolute"
        style={{
          top: '20%',
          left: '-10%',
          width: '120%',
          height: '2px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(220, 38, 38, 0.3) 50%, transparent 100%)',
          animation: 'speedLine1 4s ease-in-out infinite',
        }}
      ></div>
      <div
        className="position-absolute"
        style={{
          top: '60%',
          left: '-10%',
          width: '120%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.4) 50%, transparent 100%)',
          animation: 'speedLine2 6s ease-in-out infinite reverse',
        }}
      ></div>

      <div className="container position-relative h-100 d-flex align-items-center">
        <div className="row align-items-center w-100">
          <div className="col-lg-8">
            {/* Main Title with Enhanced Typography */}
            <div className="mb-4">
              <div
                className="badge mb-3"
                style={{
                  background: 'rgba(220, 38, 38, 0.2)',
                  color: 'var(--f1-red-light)',
                  fontFamily: 'var(--font-accent)',
                  fontWeight: 'var(--fw-bold)',
                  fontSize: '0.9rem',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  animation: 'pulseGlow 2s ease-in-out infinite',
                }}
              >
                🏁 Formula 1 Dashboard
              </div>
              <h1
                className="display-3 fw-black mb-3"
                style={{
                  fontFamily: 'var(--font-racing)',
                  fontWeight: 'var(--fw-black)',
                  letterSpacing: '-2px',
                  color: 'var(--f1-white)',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                  lineHeight: '1.1',
                  animation: 'heroTextSlide 1s ease-out',
                }}
              >
                <i
                  className="fas fa-flag-checkered me-3"
                  style={{
                    color: 'var(--f1-red-light)',
                    animation: 'flagWave 3s ease-in-out infinite',
                  }}
                ></i>
                {title}
              </h1>
              <p
                className="lead mb-4"
                style={{
                  fontSize: 'var(--text-xl)',
                  fontFamily: 'var(--font-primary)',
                  opacity: 0.9,
                  fontWeight: '300',
                  lineHeight: '1.6',
                  animation: 'heroTextSlide 1s ease-out 0.3s both',
                }}
              >
                {subtitle}
              </p>
              {/* Call to Action Buttons */}
              <div
                className="d-flex flex-wrap gap-3"
                style={{ animation: 'heroTextSlide 1s ease-out 0.6s both' }}
              >
                <button
                  className="btn btn-lg px-4 py-3"
                  style={{
                    background: 'var(--f1-gradient-red)',
                    color: 'var(--f1-white)',
                    border: 'none',
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 'var(--fw-bold)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderRadius: '8px',
                    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow =
                      '0 12px 35px rgba(220, 38, 38, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 8px 25px rgba(220, 38, 38, 0.3)';
                  }}
                >
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Live Standings
                </button>

                <button
                  className="btn btn-outline-light btn-lg px-4 py-3"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 'var(--fw-semibold)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderRadius: '8px',
                    borderWidth: '2px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-history me-2"></i>
                  Race History
                </button>
              </div>{' '}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
