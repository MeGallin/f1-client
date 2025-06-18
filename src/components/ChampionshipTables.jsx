/**
 * ChampionshipTables Component
 *
 * Reusable championship tables for drivers and constructors
 */

import React from 'react';
import { Link } from 'react-router-dom';

const ChampionshipTables = ({ topDrivers, topConstructors }) => {
  return (
    <div className="row mb-5">
      {/* Driver Championship */}
      <div className="col-lg-6 mb-4">
        <div className="f1-carbon-card h-100">
          <div
            className="card-header d-flex justify-content-between align-items-center"
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
              <i className="fas fa-trophy me-2"></i>
              Driver Championship
            </h5>
            <div
              className="badge"
              style={{
                background: 'var(--f1-gradient-gold)',
                color: 'var(--f1-white)',
                fontFamily: 'var(--font-accent)',
                fontWeight: 'var(--fw-bold)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              2025
            </div>
          </div>
          <div className="card-body p-0">
            {topDrivers && topDrivers.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-success">
                    <tr>
                      <th className="text-center user-select-none" width="50">
                        #
                      </th>
                      <th>Driver</th>
                      <th>Team</th>
                      <th className="text-center">Points</th>
                      <th className="text-center">Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDrivers.map((driver, index) => (
                      <tr
                        key={driver.position}
                        className={`${
                          index < 3 ? 'podium-' + (index + 1) : ''
                        } f1-zoom`}
                      >
                        <td className="text-center fw-bold">
                          {index < 3 && (
                            <i className="fas fa-medal text-warning me-1"></i>
                          )}
                          {driver.position}
                        </td>
                        <td className="fw-semibold racing-stat">
                          {driver.driver}
                        </td>
                        <td className="text-muted">{driver.constructor}</td>
                        <td className="text-center fw-bold racing-number">
                          {driver.points}
                        </td>
                        <td className="text-center">{driver.wins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="f1-loader mb-3"></div>
                <h6
                  style={{
                    fontFamily: 'var(--font-racing)',
                    color: 'var(--f1-grey-800)',
                  }}
                >
                  Loading Championship Standings
                </h6>
                <p className="text-muted mb-0">Fetching driver data...</p>
              </div>
            )}
          </div>
          <div className="card-footer text-center">
            <Link
              to="/history"
              className="btn btn-danger btn-sm px-4 mt-1 mb-1"
              style={{
                fontFamily: 'var(--font-accent)',
                fontWeight: 'var(--fw-bold)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
                borderRadius: '4px',
              }}
            >
              <i className="fas fa-list me-1"></i>
              VIEW FULL STANDINGS
            </Link>
          </div>
        </div>
      </div>

      {/* Constructor Championship */}
      <div className="col-lg-6 mb-4">
        <div className="f1-carbon-card h-100">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{
              background: 'var(--f1-gradient-red)',
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
              <i className="fas fa-car me-2"></i>
              Constructor Championship
            </h5>
            <div
              className="badge"
              style={{
                background: 'var(--f1-gradient-gold)',
                color: 'var(--f1-white)',
                fontFamily: 'var(--font-accent)',
                fontWeight: 'var(--fw-bold)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              2025
            </div>
          </div>
          <div className="card-body p-0">
            {topConstructors && topConstructors.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-danger">
                    <tr>
                      <th className="text-center user-select-none" width="50">
                        #
                      </th>
                      <th>Constructor</th>
                      <th>Nationality</th>
                      <th className="text-center">Points</th>
                      <th className="text-center">Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topConstructors.map((constructor, index) => (
                      <tr
                        key={constructor.position}
                        className={`${
                          index < 3 ? 'podium-' + (index + 1) : ''
                        } f1-zoom`}
                      >
                        <td className="text-center fw-bold">
                          {index < 3 && (
                            <i className="fas fa-medal text-warning me-1"></i>
                          )}
                          {constructor.position}
                        </td>
                        <td className="fw-semibold racing-stat">
                          {constructor.name}
                        </td>
                        <td className="text-muted">
                          {constructor.nationality}
                        </td>
                        <td className="text-center fw-bold racing-number">
                          {constructor.points}
                        </td>
                        <td className="text-center">{constructor.wins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="f1-loader mb-3"></div>
                <h6
                  style={{
                    fontFamily: 'var(--font-racing)',
                    color: 'var(--f1-grey-800)',
                  }}
                >
                  Loading Constructor Standings
                </h6>
                <p className="text-muted mb-0">Fetching constructor data...</p>
              </div>
            )}
          </div>
          <div className="card-footer text-center">
            <Link
              to="/history"
              className="btn btn-outline-danger btn-sm px-4 mt-1 mb-1"
              style={{
                fontFamily: 'var(--font-accent)',
                fontWeight: 'var(--fw-bold)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
                borderRadius: '4px',
                borderWidth: '2px',
              }}
            >
              <i className="fas fa-list me-1"></i>
              VIEW CONSTRUCTOR HISTORY
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionshipTables;
