/**
 * DriversTable Component
 *
 * Driver standings table with sorting functionality
 */

import React from 'react';

const DriversTable = ({
  selectedSeason,
  loadingDrivers,
  sortedDrivers,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="f1-table">
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
              Driver Championship - {selectedSeason}
            </h5>
            <div>
              <div className="d-flex align-items-center">
                <select
                  className="form-select form-select-sm border-0 text-white me-2"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  <option value="position">Sort by Position</option>
                  <option value="points">Sort by Points</option>
                  <option value="wins">Sort by Wins</option>
                  <option value="driver">Sort by Name</option>
                </select>
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => onSortChange(sortBy)}
                  title={`Sort ${
                    sortOrder === 'asc' ? 'Descending' : 'Ascending'
                  }`}
                >
                  <i
                    className={`fas fa-sort-${
                      sortOrder === 'asc' ? 'up' : 'down'
                    }`}
                  ></i>
                </button>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            {loadingDrivers ? (
              <div className="p-4 text-center">
                <div className="f1-loader mb-3"></div>
                <h6>Loading Driver Championship</h6>
                <p className="text-muted mb-0">
                  Fetching {selectedSeason} driver standings...
                </p>
              </div>
            ) : sortedDrivers && sortedDrivers.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-success">
                    <tr>
                      <th
                        className="text-center user-select-none"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSortChange('position')}
                      >
                        #{' '}
                        {sortBy === 'position' && (
                          <i
                            className={`fas fa-sort-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ms-1`}
                          ></i>
                        )}
                      </th>
                      <th
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSortChange('driver')}
                      >
                        Driver{' '}
                        {sortBy === 'driver' && (
                          <i
                            className={`fas fa-sort-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ms-1`}
                          ></i>
                        )}
                      </th>
                      <th>Constructor</th>
                      <th
                        className="text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSortChange('points')}
                      >
                        Points{' '}
                        {sortBy === 'points' && (
                          <i
                            className={`fas fa-sort-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ms-1`}
                          ></i>
                        )}
                      </th>
                      <th
                        className="text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSortChange('wins')}
                      >
                        Wins{' '}
                        {sortBy === 'wins' && (
                          <i
                            className={`fas fa-sort-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ms-1`}
                          ></i>
                        )}
                      </th>
                      <th className="text-center">Podiums</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDrivers.map((driver, index) => (
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
                        <td className="text-center">{driver.podiums || '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center text-muted">
                <i className="fas fa-spinner fa-spin me-2"></i>
                Loading driver standings for {selectedSeason}...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversTable;
