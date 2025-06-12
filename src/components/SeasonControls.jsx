/**
 * SeasonControls Component
 *
 * Season selection and view mode controls for the History page
 */

import React from 'react';

const SeasonControls = ({
  selectedSeason,
  availableSeasons,
  currentYear,
  viewMode,
  loadingDrivers,
  loadingConstructors,
  loadingOverview,
  onSeasonChange,
  onViewModeChange,
}) => {
  return (
    <div className="row mb-4">
      <div className="col-md-6">
        <div className="f1-card">
          <div className="card-body p-4">
            <h6
              className="card-title mb-3 d-flex align-items-center"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--f1-grey-800)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <i
                className="fas fa-filter me-2"
                style={{ color: 'var(--f1-red-primary)' }}
              ></i>
              Season Selection
              {(loadingDrivers || loadingConstructors || loadingOverview) && (
                <div
                  className="f1-loader ms-3"
                  style={{ width: '20px', height: '20px' }}
                ></div>
              )}
            </h6>
            <div className="row g-3">
              <div className="col-8">
                <select
                  className="form-select"
                  value={selectedSeason}
                  onChange={(e) => onSeasonChange(e.target.value)}
                  disabled={
                    loadingDrivers || loadingConstructors || loadingOverview
                  }
                  style={{
                    border: `2px solid var(--f1-grey-200)`,
                    borderRadius: 'var(--border-radius)',
                    padding: '0.75rem 1rem',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--text-base)',
                    transition: 'var(--transition-normal)',
                    background:
                      loadingDrivers || loadingConstructors || loadingOverview
                        ? 'var(--f1-grey-100)'
                        : 'var(--f1-white)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--f1-red-primary)';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--f1-grey-200)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {availableSeasons.map((year) => (
                    <option key={year} value={year}>
                      {year} Season
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-4">
                <button
                  className="btn-f1-secondary w-100"
                  onClick={() => onSeasonChange(currentYear.toString())}
                  disabled={
                    loadingDrivers || loadingConstructors || loadingOverview
                  }
                  style={{
                    fontSize: 'var(--text-sm)',
                    padding: '0.75rem 0.5rem',
                  }}
                >
                  <i className="fas fa-calendar-day me-1"></i>
                  Current Season
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="f1-card">
          <div className="card-body p-4">
            <h6
              className="card-title mb-3"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--f1-grey-800)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <i
                className="fas fa-eye me-2"
                style={{ color: 'var(--f1-red-primary)' }}
              ></i>
              View Mode
            </h6>
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn ${
                  viewMode === 'overview'
                    ? 'btn-f1-primary'
                    : 'btn-f1-secondary'
                }`}
                onClick={() => onViewModeChange('overview')}
                disabled={loadingOverview}
                style={{
                  fontSize: 'var(--text-sm)',
                  padding: '0.75rem 0.5rem',
                }}
              >
                <i className="fas fa-chart-pie me-1"></i>
                Overview
              </button>
              <button
                type="button"
                className={`btn ${
                  viewMode === 'drivers' ? 'btn-f1-primary' : 'btn-f1-secondary'
                }`}
                onClick={() => onViewModeChange('drivers')}
                disabled={loadingDrivers}
                style={{
                  fontSize: 'var(--text-sm)',
                  padding: '0.75rem 0.5rem',
                }}
              >
                <i className="fas fa-user me-1"></i>
                Drivers
              </button>
              <button
                type="button"
                className={`btn ${
                  viewMode === 'constructors'
                    ? 'btn-f1-primary'
                    : 'btn-f1-secondary'
                }`}
                onClick={() => onViewModeChange('constructors')}
                disabled={loadingConstructors}
                style={{
                  fontSize: 'var(--text-sm)',
                  padding: '0.75rem 0.5rem',
                }}
              >
                <i className="fas fa-car me-1"></i>
                Teams
              </button>
              <button
                type="button"
                className={`btn ${
                  viewMode === 'races' ? 'btn-f1-primary' : 'btn-f1-secondary'
                }`}
                onClick={() => onViewModeChange('races')}
                style={{
                  fontSize: 'var(--text-sm)',
                  padding: '0.75rem 0.5rem',
                }}
              >
                <i className="fas fa-flag me-1"></i>
                Races
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonControls;
