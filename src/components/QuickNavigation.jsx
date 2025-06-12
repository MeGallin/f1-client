/**
 * QuickNavigation Component
 *
 * Quick navigation section with season controls and action buttons
 */

import React from 'react';
import { Link } from 'react-router-dom';

const QuickNavigation = ({ selectedSeason, currentYear, onSeasonChange }) => {
  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="f1-carbon-card">
          <div
            className="card-header"
            style={{
              background: 'var(--f1-gradient-dark)',
              color: 'var(--f1-white)',
              borderRadius:
                'var(--border-radius-lg) var(--border-radius-lg) 0 0',
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
              <i className="fas fa-rocket me-2"></i>
              Quick Navigation
            </h5>
          </div>
          <div
            className="card-body p-4"
            style={{ background: 'var(--f1-grey-900)' }}
          >
            <div className="row g-2">
              <div className="col-md-3">
                <Link
                  to="/"
                  className="btn btn-danger w-100 mt-1 mb-1"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 'var(--fw-bold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <i className="fas fa-home me-1"></i>
                  Back to Live Dashboard
                </Link>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-outline-danger w-100 mt-1 mb-1"
                  onClick={() =>
                    onSeasonChange((parseInt(selectedSeason) - 1).toString())
                  }
                  disabled={parseInt(selectedSeason) <= currentYear - 25}
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 'var(--fw-bold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <i className="fas fa-chevron-left me-1"></i>
                  Previous Season
                </button>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-outline-secondary w-100 mt-1 mb-1"
                  onClick={() =>
                    onSeasonChange((parseInt(selectedSeason) + 1).toString())
                  }
                  disabled={parseInt(selectedSeason) >= currentYear}
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 'var(--fw-bold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <i className="fas fa-chevron-right me-1"></i>
                  Next Season
                </button>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-outline-warning w-100 mt-1 mb-1"
                  onClick={() => window.location.reload()}
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 'var(--fw-bold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <i className="fas fa-sync me-1"></i>
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickNavigation;
