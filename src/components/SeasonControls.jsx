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
    <div className="row mb-4 g-4">
      {/* Season Selection */}
      <div className="col-lg-6 col-md-12">
        {' '}
        <div
          className="f1-card h-100"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(220, 38, 38, 0.1)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6
                className="card-title mb-0 d-flex align-items-center"
                style={{
                  fontFamily: 'var(--font-racing)',
                  fontSize: '0.9rem',
                  fontWeight: 'var(--fw-black)',
                  color: 'var(--f1-grey-800)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                }}
              >
                <i
                  className="fas fa-calendar-alt me-2"
                  style={{ color: 'var(--f1-red-primary)' }}
                ></i>
                Season Selection
              </h6>
              {(loadingDrivers || loadingConstructors || loadingOverview) && (
                <div
                  className="f1-loader"
                  style={{
                    width: '18px',
                    height: '18px',
                    margin: '0',
                  }}
                ></div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-8">
                <div className="position-relative">
                  <select
                    className="form-select"
                    value={selectedSeason}
                    onChange={(e) => onSeasonChange(e.target.value)}
                    disabled={
                      loadingDrivers || loadingConstructors || loadingOverview
                    }
                    aria-label="Select racing season"
                    style={{
                      border: '2px solid rgba(220, 38, 38, 0.2)',
                      borderRadius: '8px',
                      padding: '0.875rem 2.5rem 0.875rem 1rem',
                      fontFamily: 'var(--font-primary)',
                      fontSize: '0.95rem',
                      fontWeight: 'var(--fw-semibold)',
                      transition: 'all 0.3s ease',
                      background:
                        loadingDrivers || loadingConstructors || loadingOverview
                          ? 'var(--f1-grey-100)'
                          : 'var(--f1-white)',
                      color: 'var(--f1-grey-800)',
                      cursor:
                        loadingDrivers || loadingConstructors || loadingOverview
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--f1-red-primary)';
                      e.target.style.boxShadow =
                        '0 0 0 3px rgba(220, 38, 38, 0.15)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(220, 38, 38, 0.2)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    onMouseEnter={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.borderColor = 'var(--f1-red-primary)';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.borderColor = 'rgba(220, 38, 38, 0.2)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {availableSeasons.map((year) => (
                      <option key={year} value={year}>
                        {year} Season
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: 'var(--f1-red-primary)',
                    }}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <button
                  className="btn w-100"
                  onClick={() => onSeasonChange(currentYear.toString())}
                  disabled={
                    loadingDrivers || loadingConstructors || loadingOverview
                  }
                  aria-label="Jump to current season"
                  style={{
                    background:
                      selectedSeason === currentYear.toString()
                        ? 'var(--f1-gradient-red)'
                        : 'transparent',
                    border: '2px solid var(--f1-red-primary)',
                    color:
                      selectedSeason === currentYear.toString()
                        ? 'var(--f1-white)'
                        : 'var(--f1-red-primary)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 'var(--fw-bold)',
                    padding: '0.875rem 0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-accent)',
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow =
                        '0 4px 15px rgba(220, 38, 38, 0.3)';
                      if (selectedSeason !== currentYear.toString()) {
                        e.target.style.background = 'var(--f1-red-primary)';
                        e.target.style.color = 'var(--f1-white)';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      if (selectedSeason !== currentYear.toString()) {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--f1-red-primary)';
                      }
                    }
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

      {/* View Mode Controls */}
      <div className="col-lg-6 col-md-12">
        {' '}
        <div
          className="f1-card h-100"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="card-body p-4">
            <h6
              className="card-title mb-3"
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: '0.9rem',
                fontWeight: 'var(--fw-black)',
                color: 'var(--f1-grey-800)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              <i
                className="fas fa-th-large me-2"
                style={{ color: 'var(--f1-info)' }}
              ></i>
              View Mode
            </h6>

            {/* Enhanced Button Group */}
            <div
              className="btn-group w-100"
              role="radiogroup"
              aria-label="Select view mode"
              style={{
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '10px',
                padding: '4px',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              {[
                {
                  mode: 'overview',
                  icon: 'fas fa-chart-pie',
                  label: 'Overview',
                },
                {
                  mode: 'drivers',
                  icon: 'fas fa-user-circle',
                  label: 'Drivers',
                },
                {
                  mode: 'constructors',
                  icon: 'fas fa-industry',
                  label: 'Teams',
                },
                {
                  mode: 'races',
                  icon: 'fas fa-flag-checkered',
                  label: 'Races',
                },
              ].map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  className="btn"
                  onClick={() => onViewModeChange(mode)}
                  disabled={
                    (mode === 'overview' && loadingOverview) ||
                    (mode === 'drivers' && loadingDrivers) ||
                    (mode === 'constructors' && loadingConstructors)
                  }
                  aria-pressed={viewMode === mode}
                  aria-label={`Switch to ${label} view`}
                  style={{
                    background:
                      viewMode === mode ? 'var(--f1-white)' : 'transparent',
                    border: 'none',
                    color:
                      viewMode === mode
                        ? 'var(--f1-info)'
                        : 'var(--f1-grey-600)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight:
                      viewMode === mode
                        ? 'var(--fw-bold)'
                        : 'var(--fw-semibold)',
                    padding: '0.75rem 0.5rem',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow:
                      viewMode === mode
                        ? '0 2px 8px rgba(59, 130, 246, 0.2)'
                        : 'none',
                    transform:
                      viewMode === mode ? 'translateY(-1px)' : 'translateY(0)',
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled && viewMode !== mode) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                      e.target.style.color = 'var(--f1-info)';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled && viewMode !== mode) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--f1-grey-600)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = '2px solid var(--f1-info)';
                    e.target.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = 'none';
                  }}
                >
                  <i className={`${icon} me-1`}></i>
                  <span className="d-none d-sm-inline">{label}</span>
                  <span className="d-sm-none">{label.charAt(0)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonControls;
