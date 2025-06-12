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
      className="text-white py-5"
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
          opacity: 0.3,
        }}
      ></div>
      <div className="container position-relative">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <nav aria-label="breadcrumb">
              <ol
                className="breadcrumb mb-3"
                style={{
                  '--bs-breadcrumb-divider-color': 'var(--f1-grey-300)',
                  '--bs-breadcrumb-item-active-color': 'var(--f1-red-light)',
                }}
              >
                <li className="breadcrumb-item">
                  <Link
                    to="/"
                    style={{
                      color: 'var(--f1-grey-300)',
                      textDecoration: 'none',
                      transition: 'var(--transition-fast)',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = 'var(--f1-white)')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = 'var(--f1-grey-300)')
                    }
                  >
                    <i className="fas fa-home"></i> Home
                  </Link>
                </li>
                <li
                  className="breadcrumb-item active"
                  style={{ color: 'var(--f1-red-light)' }}
                >
                  History
                </li>
                {season && (
                  <li
                    className="breadcrumb-item active"
                    style={{ color: 'var(--f1-red-light)' }}
                  >
                    {season}
                  </li>
                )}
                {round && (
                  <li
                    className="breadcrumb-item active"
                    style={{ color: 'var(--f1-red-light)' }}
                  >
                    Round {round}
                  </li>
                )}
              </ol>
            </nav>
            <h1
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: 'var(--text-5xl)',
                fontWeight: 'var(--fw-black)',
                marginBottom: '1rem',
                letterSpacing: '-1px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              <i
                className="fas fa-history me-3"
                style={{ color: 'var(--f1-red-light)' }}
              ></i>
              F1 Historical Data Browser
            </h1>
            <p
              style={{
                fontSize: 'var(--text-lg)',
                fontFamily: 'var(--font-primary)',
                opacity: 0.9,
                marginBottom: 0,
              }}
            >
              Explore past seasons, race results, and championship data
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
              <i className="fas fa-database me-2"></i>
              ARCHIVE DATA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryHeader;
