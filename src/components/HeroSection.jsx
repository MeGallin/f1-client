/**
 * HeroSection Component
 *
 * Reusable hero section for the F1 dashboard with gradient background and title
 */

import React from 'react';

const HeroSection = ({
  title = 'F1 Live Dashboard',
  subtitle = 'Real-time Formula 1 championship data, race results, and live standings',
  badge = 'LIVE DATA',
  badgeIcon = 'fas fa-broadcast-tower',
}) => {
  return (
    <section
      className="text-white py-3 mb-4"
      style={{
        background: 'var(--f1-gradient-dark)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="f1-stripes-pattern"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.2,
        }}
      ></div>
      <div className="container position-relative">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--fw-black)',
                marginBottom: '1rem',
                letterSpacing: '-1px',
                color: 'var(--f1-white)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              <i
                className="fas fa-flag-checkered me-3"
                style={{ color: 'var(--f1-red-light)' }}
              ></i>
              {title}
            </h1>
            <p
              style={{
                fontSize: 'var(--text-lg)',
                fontFamily: 'var(--font-primary)',
                opacity: 0.9,
                marginBottom: 0,
              }}
            >
              {subtitle}
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <div
              className="badge fs-6 px-4 py-3"
              style={{
                background: 'var(--f1-gradient-champion)',
                color: 'var(--f1-white)',
                fontFamily: 'var(--font-accent)',
                fontWeight: 'var(--fw-bold)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: 'var(--shadow-champion)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <i className={`${badgeIcon} me-2`}></i>
              {badge}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
