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
        <div className="f1-grid-section">
          <div className="f1-carbon-card">
            <div className="card-body">
              <h6
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-racing)',
                  color: 'var(--f1-red-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                <i className="fas fa-rocket me-2"></i>
                Quick Navigation
              </h6>
              <div className="row g-2">
                <div className="col-md-3">
                  <Link to="/" className="btn-f1-primary w-100">
                    <i className="fas fa-home me-1"></i>
                    Back to Live Dashboard
                  </Link>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn-f1-secondary w-100"
                    onClick={() =>
                      onSeasonChange((parseInt(selectedSeason) - 1).toString())
                    }
                    disabled={parseInt(selectedSeason) <= currentYear - 25}
                  >
                    <i className="fas fa-chevron-left me-1"></i>
                    Previous Season
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn-f1-secondary w-100"
                    onClick={() =>
                      onSeasonChange((parseInt(selectedSeason) + 1).toString())
                    }
                    disabled={parseInt(selectedSeason) >= currentYear}
                  >
                    <i className="fas fa-chevron-right me-1"></i>
                    Next Season
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-success w-100 f1-interactive"
                    onClick={() => window.location.reload()}
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
    </div>
  );
};

export default QuickNavigation;
