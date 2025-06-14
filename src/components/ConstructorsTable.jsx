/**
 * ConstructorsTable Component
 *
 * Constructor standings table with sorting functionality
 */

import React from 'react';

const ConstructorsTable = ({
  selectedSeason,
  loadingConstructors,
  sortedConstructors,
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
              Constructor Championship - {selectedSeason}
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
                  <option value="name">Sort by Name</option>
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
            {loadingConstructors ? (
              <div className="p-4 text-center">
                <div className="f1-loader mb-3"></div>
                <h6>Loading Constructor Championship</h6>
                <p className="text-muted mb-0">
                  Fetching {selectedSeason} constructor standings...
                </p>
              </div>
            ) : sortedConstructors && sortedConstructors.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-danger">
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
                        onClick={() => onSortChange('name')}
                      >
                        Constructor{' '}
                        {sortBy === 'name' && (
                          <i
                            className={`fas fa-sort-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ms-1`}
                          ></i>
                        )}
                      </th>
                      <th>Nationality</th>
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
                    {sortedConstructors.map((constructor, index) => (
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
                        <td className="text-center">
                          {constructor.podiums || '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center text-muted">
                <i className="fas fa-spinner fa-spin me-2"></i>
                Loading constructor standings for {selectedSeason}...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructorsTable;
