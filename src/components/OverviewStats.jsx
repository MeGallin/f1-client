/**
 * OverviewStats Component
 *
 * Season statistics cards for champion, constructor, races, and season info
 */

import React from 'react';

const OverviewStats = ({
  selectedSeason,
  loadingOverview,
  topDrivers,
  topConstructors,
  currentRace,
}) => {
  return (
    <div className="col-12 mb-4">
      <div className="row g-3">
        <div className="col-md-3">
          <div className="f1-stat-card">
            <div className="card-body text-center">
              <i
                className="fas fa-trophy fa-2x mb-2"
                style={{ color: 'var(--f1-gold)' }}
              ></i>
              <h5>Champion</h5>
              {loadingOverview ? (
                <div>
                  <div
                    className="f1-loader"
                    style={{
                      width: '2rem',
                      height: '2rem',
                      margin: '1rem auto',
                    }}
                  ></div>
                  <div
                    className="f1-stat-number"
                    style={{ fontSize: 'var(--text-lg)' }}
                  >
                    Loading...
                  </div>
                  <div className="f1-stat-label">Loading points...</div>
                </div>
              ) : (
                <div>
                  <div className="f1-stat-number">
                    {topDrivers?.[0]?.driver || 'Loading...'}
                  </div>
                  <div className="f1-stat-label">
                    {topDrivers?.[0]?.points || 0} points
                  </div>
                </div>
              )}
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
                className="fas fa-car fa-2x mb-2"
                style={{ color: 'var(--f1-danger)' }}
              ></i>
              <h5>Constructor</h5>
              {loadingOverview ? (
                <div>
                  <div
                    className="f1-loader"
                    style={{
                      width: '2rem',
                      height: '2rem',
                      margin: '1rem auto',
                    }}
                  ></div>
                  <div
                    className="f1-stat-number"
                    style={{ fontSize: 'var(--text-lg)' }}
                  >
                    Loading...
                  </div>
                  <div className="f1-stat-label">Loading points...</div>
                </div>
              ) : (
                <div>
                  <div
                    className="f1-stat-number"
                    style={{ color: 'var(--f1-danger)' }}
                  >
                    {topConstructors?.[0]?.name || 'Loading...'}
                  </div>
                  <div className="f1-stat-label">
                    {topConstructors?.[0]?.points || 0} points
                  </div>
                </div>
              )}
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
                className="fas fa-flag-checkered fa-2x mb-2"
                style={{ color: 'var(--f1-warning)' }}
              ></i>
              <h5>Total Races</h5>
              <div
                className="f1-stat-number"
                style={{ color: 'var(--f1-warning)' }}
              >
                {currentRace?.MRData?.total || '0'}
              </div>
              <div className="f1-stat-label">Completed</div>
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
                className="fas fa-calendar fa-2x mb-2"
                style={{ color: 'var(--f1-info)' }}
              ></i>
              <h5>Season</h5>
              <div
                className="f1-stat-number"
                style={{ color: 'var(--f1-info)' }}
              >
                {selectedSeason}
              </div>
              <div className="f1-stat-label">Formula 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewStats;
