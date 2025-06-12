/**
 * Home Page - Live F1 Dashboard
 *
 * Landing page displaying ALL current F1 information:
 * - Latest race results
 * - Current championship standings
 * - Constructor standings
 * - Next race information
 * - Live data dashboard
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useF1AppState,
  useCurrentAndNextRace,
  useIsLoading,
  useHasError,
} from '../state';
import { FeatureFlag, useFeatureFlag } from '../components/FeatureFlag';
import { APP_CONFIG, UI_CONFIG } from '../config';

const HomePage = () => {
  const {
    currentRace,
    nextRace,
    topDrivers,
    topConstructors,
    setSelectedYear,
  } = useF1AppState();

  const isLoading = useIsLoading();
  const hasError = useHasError();

  // Feature flags
  const showRaceResults = useFeatureFlag('enableRaceResults');
  const showHistoricalData = useFeatureFlag('enableHistoricalData');

  // Initialize with current year data
  useEffect(() => {
    setSelectedYear(new Date().getFullYear());
  }, [setSelectedYear]);

  if (hasError) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">⚠️ Error Loading Data</h4>
          <p>
            Unable to load F1 data. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="home-page">
      {/* F1 Racing Hero Section */}
      <section
        className="text-white py-5 mb-4"
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
            opacity: 0.2,
          }}
        ></div>
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1
                style={{
                  fontFamily: 'var(--font-racing)',
                  fontSize: 'var(--text-4xl)',
                  fontWeight: 'var(--fw-black)',
                  marginBottom: '1rem',
                  letterSpacing: '-1px',
                  color: 'var(--f1-white)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                <i
                  className="fas fa-flag-checkered me-3"
                  style={{ color: 'var(--f1-red-light)' }}
                ></i>
                F1 Live Dashboard
              </h1>
              <p
                style={{
                  fontSize: 'var(--text-lg)',
                  fontFamily: 'var(--font-primary)',
                  opacity: 0.9,
                  marginBottom: 0,
                }}
              >
                Real-time Formula 1 championship data, race results, and live
                standings
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
                <i className="fas fa-broadcast-tower me-2"></i>
                LIVE DATA
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        {/* F1 Racing Quick Stats Cards */}
        <div className="row mb-5">
          <div className="col-md-3 mb-3">
            <div
              className="f1-stat-card"
              style={{ '--f1-accent-color': 'var(--f1-gold)' }}
            >
              <div className="card-body text-center">
                <i
                  className="fas fa-crown fa-2x mb-3"
                  style={{ color: 'var(--f1-gold)' }}
                ></i>
                <h5
                  style={{
                    fontFamily: 'var(--font-racing)',
                    color: 'var(--f1-grey-800)',
                    textTransform: 'uppercase',
                    fontSize: 'var(--text-sm)',
                    letterSpacing: '1px',
                    marginBottom: '0.5rem',
                  }}
                >
                  Championship Leader
                </h5>
                <div
                  className="f1-stat-number"
                  style={{ color: 'var(--f1-gold)' }}
                >
                  {topDrivers?.[0]?.driver || 'Loading...'}
                </div>
                <div className="f1-stat-label">
                  {topDrivers?.[0]?.points || 0} points
                </div>
                {isLoading && (
                  <div
                    className="f1-loader mt-2"
                    style={{ width: '2rem', height: '2rem', margin: '0 auto' }}
                  ></div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="f1-stat-card"
              style={{ '--f1-accent-color': 'var(--f1-success)' }}
            >
              <div className="card-body text-center">
                <i
                  className="fas fa-flag-checkered fa-2x mb-3"
                  style={{ color: 'var(--f1-success)' }}
                ></i>
                <h5
                  style={{
                    fontFamily: 'var(--font-racing)',
                    color: 'var(--f1-grey-800)',
                    textTransform: 'uppercase',
                    fontSize: 'var(--text-sm)',
                    letterSpacing: '1px',
                    marginBottom: '0.5rem',
                  }}
                >
                  Latest Race
                </h5>
                <div
                  className="f1-stat-number"
                  style={{
                    color: 'var(--f1-success)',
                    fontSize: 'var(--text-lg)',
                  }}
                >
                  {currentRace?.MRData?.RaceTable?.Races?.[0]?.raceName?.replace(
                    'Grand Prix',
                    'GP',
                  ) || 'Loading...'}
                </div>
                <div className="f1-stat-label">
                  {currentRace?.MRData?.RaceTable?.Races?.[0]?.date || ''}
                </div>
                {isLoading && (
                  <div
                    className="f1-loader mt-2"
                    style={{ width: '2rem', height: '2rem', margin: '0 auto' }}
                  ></div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="f1-stat-card"
              style={{ '--f1-accent-color': 'var(--f1-info)' }}
            >
              <div className="card-body text-center">
                <i
                  className="fas fa-calendar-check fa-2x mb-3"
                  style={{ color: 'var(--f1-info)' }}
                ></i>
                <h5
                  style={{
                    fontFamily: 'var(--font-racing)',
                    color: 'var(--f1-grey-800)',
                    textTransform: 'uppercase',
                    fontSize: 'var(--text-sm)',
                    letterSpacing: '1px',
                    marginBottom: '0.5rem',
                  }}
                >
                  Next Race
                </h5>
                <div
                  className="f1-stat-number"
                  style={{
                    color: 'var(--f1-info)',
                    fontSize: 'var(--text-lg)',
                  }}
                >
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.raceName?.replace(
                    'Grand Prix',
                    'GP',
                  ) || 'Loading...'}
                </div>
                <div className="f1-stat-label">
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.date || ''}
                </div>
                {isLoading && (
                  <div
                    className="f1-loader mt-2"
                    style={{ width: '2rem', height: '2rem', margin: '0 auto' }}
                  ></div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="f1-stat-card"
              style={{ '--f1-accent-color': 'var(--f1-danger)' }}
            >
              <div className="card-body text-center">
                <i
                  className="fas fa-car fa-2x mb-3"
                  style={{ color: 'var(--f1-danger)' }}
                ></i>
                <h5
                  style={{
                    fontFamily: 'var(--font-racing)',
                    color: 'var(--f1-grey-800)',
                    textTransform: 'uppercase',
                    fontSize: 'var(--text-sm)',
                    letterSpacing: '1px',
                    marginBottom: '0.5rem',
                  }}
                >
                  Constructor Leader
                </h5>
                <div
                  className="f1-stat-number"
                  style={{
                    color: 'var(--f1-danger)',
                    fontSize: 'var(--text-lg)',
                  }}
                >
                  {topConstructors?.[0]?.name || 'Loading...'}
                </div>
                <div className="f1-stat-label">
                  {topConstructors?.[0]?.points || 0} points
                </div>
                {isLoading && (
                  <div
                    className="f1-loader mt-2"
                    style={{ width: '2rem', height: '2rem', margin: '0 auto' }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* F1 Racing Championship Standings */}
        <div className="row mb-5">
          {/* Driver Championship */}
          <div className="col-lg-6 mb-4">
            <div className="f1-table h-100">
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
                          <th
                            className="text-center user-select-none"
                            width="50"
                          >
                            #
                          </th>
                          <th>Driver</th>
                          <th>Team</th>
                          <th className="text-center">Points</th>
                          <th className="text-center">Wins</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topDrivers.slice(0, 8).map((driver, index) => (
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
                    <p className="text-muted mb-0">
                      Fetching live driver data...
                    </p>
                  </div>
                )}
              </div>
              <div
                className="card-footer text-center"
                style={{
                  background: 'var(--f1-grey-50)',
                  borderTop: '2px solid var(--f1-grey-200)',
                }}
              >
                <Link to="/history" className="btn-f1-primary btn-sm">
                  <i className="fas fa-chart-line me-1"></i>
                  View Full Standings
                </Link>
              </div>
            </div>
          </div>

          {/* Constructor Championship */}
          <div className="col-lg-6 mb-4">
            <div className="f1-table h-100">
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
                          <th
                            className="text-center user-select-none"
                            width="50"
                          >
                            #
                          </th>
                          <th>Constructor</th>
                          <th>Nationality</th>
                          <th className="text-center">Points</th>
                          <th className="text-center">Wins</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topConstructors
                          .slice(0, 8)
                          .map((constructor, index) => (
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
                              <td className="text-center">
                                {constructor.wins}
                              </td>
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
                    <p className="text-muted mb-0">
                      Fetching live constructor data...
                    </p>
                  </div>
                )}
              </div>
              <div
                className="card-footer text-center"
                style={{
                  background: 'var(--f1-grey-50)',
                  borderTop: '2px solid var(--f1-grey-200)',
                }}
              >
                <Link to="/history" className="btn-f1-secondary btn-sm">
                  <i className="fas fa-chart-bar me-1"></i>
                  View Constructor History
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* F1 Racing Latest Race Information */}
        {currentRace?.MRData?.RaceTable?.Races?.[0] && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="f1-carbon-card">
                <div
                  className="card-header"
                  style={{
                    background: 'var(--f1-gradient-success)',
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
                    Latest Race:{' '}
                    {currentRace.MRData.RaceTable.Races[0].raceName}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div
                        className="f1-stat-card mb-3"
                        style={{ '--f1-accent-color': 'var(--f1-info)' }}
                      >
                        <div className="card-body">
                          <h6
                            className="fw-bold mb-3"
                            style={{
                              fontFamily: 'var(--font-racing)',
                              color: 'var(--f1-grey-800)',
                              textTransform: 'uppercase',
                            }}
                          >
                            <i
                              className="fas fa-info-circle me-2"
                              style={{ color: 'var(--f1-info)' }}
                            ></i>
                            Race Information
                          </h6>
                          <div className="row">
                            <div className="col-sm-6">
                              <p className="mb-2">
                                <strong style={{ color: 'var(--f1-grey-700)' }}>
                                  Round:
                                </strong>{' '}
                                <span className="racing-number">
                                  {currentRace.MRData.RaceTable.Races[0].round}
                                </span>
                              </p>
                              <p className="mb-2">
                                <strong style={{ color: 'var(--f1-grey-700)' }}>
                                  Date:
                                </strong>{' '}
                                <span className="racing-stat">
                                  {currentRace.MRData.RaceTable.Races[0].date}
                                </span>
                              </p>
                            </div>
                            <div className="col-sm-6">
                              <p className="mb-2">
                                <strong style={{ color: 'var(--f1-grey-700)' }}>
                                  Time:
                                </strong>{' '}
                                <span className="racing-stat">
                                  {currentRace.MRData.RaceTable.Races[0].time ||
                                    'TBA'}
                                </span>
                              </p>
                              <p className="mb-2">
                                <strong style={{ color: 'var(--f1-grey-700)' }}>
                                  Circuit:
                                </strong>{' '}
                                <span className="racing-stat">
                                  {
                                    currentRace.MRData.RaceTable.Races[0]
                                      .Circuit.circuitName
                                  }
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="f1-stat-card mb-3"
                        style={{ '--f1-accent-color': 'var(--f1-warning)' }}
                      >
                        <div className="card-body">
                          <h6
                            className="fw-bold mb-3"
                            style={{
                              fontFamily: 'var(--font-racing)',
                              color: 'var(--f1-grey-800)',
                              textTransform: 'uppercase',
                            }}
                          >
                            <i
                              className="fas fa-map-marker-alt me-2"
                              style={{ color: 'var(--f1-warning)' }}
                            ></i>
                            Circuit Location
                          </h6>
                          <p className="mb-3">
                            <i
                              className="fas fa-globe me-2"
                              style={{ color: 'var(--f1-warning)' }}
                            ></i>
                            <span className="racing-stat">
                              {
                                currentRace.MRData.RaceTable.Races[0].Circuit
                                  .Location.locality
                              }
                              ,{' '}
                              {
                                currentRace.MRData.RaceTable.Races[0].Circuit
                                  .Location.country
                              }
                            </span>
                          </p>
                          <div className="d-flex gap-2 flex-wrap">
                            <Link
                              to={`/history/2025/${currentRace.MRData.RaceTable.Races[0].round}`}
                              className="btn-f1-primary btn-sm"
                            >
                              <i className="fas fa-info-circle me-1"></i>
                              Race Details
                            </Link>
                            <Link
                              to="/history"
                              className="btn-f1-secondary btn-sm"
                            >
                              <i className="fas fa-history me-1"></i>
                              All Races
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* F1 Racing Quick Actions */}
        <div className="row">
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
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <Link to="/history" className="btn-f1-primary w-100">
                      <i className="fas fa-history me-2"></i>
                      Browse History
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link to="/history/2025" className="btn-f1-secondary w-100">
                      <i className="fas fa-calendar me-2"></i>
                      2025 Season
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <a
                      href="https://www.formula1.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-danger w-100 f1-interactive"
                      style={{
                        borderWidth: '2px',
                        fontFamily: 'var(--font-accent)',
                        fontWeight: 'var(--fw-semibold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      Official F1
                    </a>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-warning w-100 f1-interactive"
                      onClick={() => window.location.reload()}
                      style={{
                        borderWidth: '2px',
                        fontFamily: 'var(--font-accent)',
                        fontWeight: 'var(--fw-semibold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      <i className="fas fa-sync me-2"></i>
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Racing Divider */}
        <div className="f1-divider my-5"></div>
      </div>
    </div>
  );
};

export default HomePage;
