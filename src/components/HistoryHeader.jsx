/**
 * HistoryHeader Component
 *
 * Header section for the History page with breadcrumbs, title, and archive badge
 */

import React from 'react';
import { Link } from 'react-router-dom';

const HistoryHeader = ({ season, round }) => {
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

      <div className="container position-relative h-100 d-flex align-items-center">
        <div className="row align-items-center w-100">
          <div className="col-lg-8">
            {/* Main Title with Enhanced Typography */}
            <div className="mb-4">
              {' '}
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
                  className="fas fa-history me-3"
                  style={{
                    color: 'var(--f1-red-light)',
                    animation: 'flagWave 3s ease-in-out infinite',
                  }}
                ></i>
                F1 Historical Data
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
                Explore past seasons, race results, and championship data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryHeader;
