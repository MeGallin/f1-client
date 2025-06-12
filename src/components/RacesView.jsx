/**
 * RacesView Component
 *
 * Race calendar and analytics view for the History page
 */

import React from 'react';
import { Link } from 'react-router-dom';

const RacesView = ({ selectedSeason }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="f1-table">
          <div
            className="card-header"
            style={{
              background: 'var(--f1-gradient-champion)',
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
              <i className="fas fa-flag-checkered me-2"></i>
              Race Calendar - {selectedSeason}
            </h5>
          </div>
          <div className="card-body">
            <div
              className="f1-carbon-card mb-4"
              style={{
                background: 'var(--f1-gradient-info)',
                color: 'var(--f1-white)',
                border: '2px solid var(--f1-info)',
              }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <i
                    className="fas fa-rocket fa-2x me-3"
                    style={{ color: 'var(--f1-gold)' }}
                  ></i>
                  <div>
                    <h6
                      className="mb-1"
                      style={{
                        fontFamily: 'var(--font-racing)',
                        fontWeight: 'var(--fw-bold)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Advanced Race Analytics
                    </h6>
                    <p className="mb-0 opacity-90">
                      Detailed race information and results will be displayed
                      here. This section will feature complete race calendar
                      with results, qualifying times, lap analysis, and
                      telemetry data.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="text-center py-5 f1-interactive"
              style={{
                background: 'var(--pattern-carbon)',
                borderRadius: 'var(--border-radius-lg)',
                border: '2px dashed var(--f1-grey-300)',
              }}
            >
              <div
                className="f1-logo-text mb-4"
                style={{
                  fontSize: '4rem',
                  color: 'var(--f1-red-primary)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                🏁
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-racing)',
                  color: 'var(--f1-grey-800)',
                  marginBottom: '1rem',
                }}
              >
                Race Analysis Dashboard
              </h4>
              <p
                className="text-muted mb-4"
                style={{
                  fontSize: 'var(--text-lg)',
                  maxWidth: '600px',
                  margin: '0 auto 2rem',
                }}
              >
                Complete race weekend analysis featuring qualifying results,
                race outcomes, lap times, pit strategies, and championship
                implications.
              </p>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link
                  to={`/history/${selectedSeason}`}
                  className="btn-f1-primary"
                >
                  <i className="fas fa-chart-pie me-2"></i>
                  Back to Season Overview
                </Link>
                <button className="btn-f1-secondary">
                  <i className="fas fa-cog me-2"></i>
                  Coming Soon
                </button>
              </div>

              <div className="row mt-4 g-3">
                <div className="col-md-3">
                  <div
                    className="f1-stat-card"
                    style={{ '--f1-accent-color': 'var(--f1-success)' }}
                  >
                    <div className="card-body text-center">
                      <i
                        className="fas fa-flag-checkered fa-2x mb-2"
                        style={{ color: 'var(--f1-success)' }}
                      ></i>
                      <div
                        className="f1-stat-number"
                        style={{ color: 'var(--f1-success)' }}
                      >
                        Race Results
                      </div>
                      <div className="f1-stat-label">Complete Analysis</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="f1-stat-card"
                    style={{ '--f1-accent-color': 'var(--f1-warning)' }}
                  >
                    <div className="card-body text-center">
                      <i
                        className="fas fa-stopwatch fa-2x mb-2"
                        style={{ color: 'var(--f1-warning)' }}
                      ></i>
                      <div
                        className="f1-stat-number"
                        style={{ color: 'var(--f1-warning)' }}
                      >
                        Qualifying
                      </div>
                      <div className="f1-stat-label">Grid Positions</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="f1-stat-card"
                    style={{ '--f1-accent-color': 'var(--f1-info)' }}
                  >
                    <div className="card-body text-center">
                      <i
                        className="fas fa-tachometer-alt fa-2x mb-2"
                        style={{ color: 'var(--f1-info)' }}
                      ></i>
                      <div
                        className="f1-stat-number"
                        style={{ color: 'var(--f1-info)' }}
                      >
                        Lap Times
                      </div>
                      <div className="f1-stat-label">Telemetry Data</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="f1-stat-card"
                    style={{ '--f1-accent-color': 'var(--f1-danger)' }}
                  >
                    <div className="card-body text-center">
                      <i
                        className="fas fa-chess fa-2x mb-2"
                        style={{ color: 'var(--f1-danger)' }}
                      ></i>
                      <div
                        className="f1-stat-number"
                        style={{ color: 'var(--f1-danger)' }}
                      >
                        Strategy
                      </div>
                      <div className="f1-stat-label">Pit Analysis</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RacesView;
