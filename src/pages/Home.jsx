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
      <div className="container py-4">
        {/* Quick Stats Cards */}
        <div className="row mb-5">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white h-100">
              <div className="card-body text-center">
                <i className="fas fa-trophy fa-2x mb-2"></i>
                <h5 className="card-title">Championship Leader</h5>
                <h3 className="mb-0">
                  {topDrivers?.[0]?.driver || 'Loading...'}
                </h3>
                <small>{topDrivers?.[0]?.points || 0} points</small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body text-center">
                <i className="fas fa-flag fa-2x mb-2"></i>
                <h5 className="card-title">Latest Race</h5>
                <h6 className="mb-0">
                  {currentRace?.MRData?.RaceTable?.Races?.[0]?.raceName ||
                    'Loading...'}
                </h6>
                <small>
                  {currentRace?.MRData?.RaceTable?.Races?.[0]?.date || ''}
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white h-100">
              <div className="card-body text-center">
                <i className="fas fa-calendar fa-2x mb-2"></i>
                <h5 className="card-title">Next Race</h5>
                <h6 className="mb-0">
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.raceName ||
                    'Loading...'}
                </h6>
                <small>
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.date || ''}
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-dark h-100">
              <div className="card-body text-center">
                <i className="fas fa-car fa-2x mb-2"></i>
                <h5 className="card-title">Constructor Leader</h5>
                <h6 className="mb-0">
                  {topConstructors?.[0]?.name || 'Loading...'}
                </h6>
                <small>{topConstructors?.[0]?.points || 0} points</small>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Race Results & Standings */}
        <div className="row mb-5">
          {/* Driver Championship */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-trophy me-2"></i>
                  Driver Championship
                </h5>
                <span className="badge bg-light text-dark">2025</span>
              </div>
              <div className="card-body p-0">
                {topDrivers && topDrivers.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center" width="50">
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
                            className={index === 0 ? 'table-warning' : ''}
                          >
                            <td className="text-center fw-bold">
                              {driver.position}
                            </td>
                            <td className="fw-semibold">{driver.driver}</td>
                            <td className="text-muted small">
                              {driver.constructor}
                            </td>
                            <td className="text-center fw-bold">
                              {driver.points}
                            </td>
                            <td className="text-center">{driver.wins}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted">
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Loading championship standings...
                  </div>
                )}
              </div>
              <div className="card-footer text-center">
                <Link to="/history" className="btn btn-sm btn-outline-primary">
                  <i className="fas fa-chart-line me-1"></i>
                  View Full Standings
                </Link>
              </div>
            </div>
          </div>

          {/* Constructor Championship */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-car me-2"></i>
                  Constructor Championship
                </h5>
                <span className="badge bg-light text-dark">2025</span>
              </div>
              <div className="card-body p-0">
                {topConstructors && topConstructors.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center" width="50">
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
                              className={
                                index === 0 ? 'table-danger text-white' : ''
                              }
                            >
                              <td className="text-center fw-bold">
                                {constructor.position}
                              </td>
                              <td className="fw-semibold">
                                {constructor.name}
                              </td>
                              <td className="text-muted small">
                                {constructor.nationality}
                              </td>
                              <td className="text-center fw-bold">
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
                  <div className="p-4 text-center text-muted">
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Loading constructor standings...
                  </div>
                )}
              </div>
              <div className="card-footer text-center">
                <Link to="/history" className="btn btn-sm btn-outline-danger">
                  <i className="fas fa-chart-bar me-1"></i>
                  View Constructor History
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Race Information */}
        {currentRace?.MRData?.RaceTable?.Races?.[0] && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-flag-checkered me-2"></i>
                    Latest Race:{' '}
                    {currentRace.MRData.RaceTable.Races[0].raceName}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Race Information</h6>
                      <div className="row">
                        <div className="col-sm-6">
                          <p className="mb-1">
                            <strong>Round:</strong>{' '}
                            {currentRace.MRData.RaceTable.Races[0].round}
                          </p>
                          <p className="mb-1">
                            <strong>Date:</strong>{' '}
                            {currentRace.MRData.RaceTable.Races[0].date}
                          </p>
                        </div>
                        <div className="col-sm-6">
                          <p className="mb-1">
                            <strong>Time:</strong>{' '}
                            {currentRace.MRData.RaceTable.Races[0].time ||
                              'TBA'}
                          </p>
                          <p className="mb-1">
                            <strong>Circuit:</strong>{' '}
                            {
                              currentRace.MRData.RaceTable.Races[0].Circuit
                                .circuitName
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">Circuit Location</h6>
                      <p className="mb-1">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {
                          currentRace.MRData.RaceTable.Races[0].Circuit.Location
                            .locality
                        }
                        ,{' '}
                        {
                          currentRace.MRData.RaceTable.Races[0].Circuit.Location
                            .country
                        }
                      </p>
                      <div className="mt-3">
                        <Link
                          to={`/history/2025/${currentRace.MRData.RaceTable.Races[0].round}`}
                          className="btn btn-success me-2"
                        >
                          <i className="fas fa-info-circle me-1"></i>
                          Race Details
                        </Link>
                        <Link to="/history" className="btn btn-outline-success">
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
        )}

        {/* Quick Actions */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-rocket me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <Link
                      to="/history"
                      className="btn btn-outline-primary w-100"
                    >
                      <i className="fas fa-history me-2"></i>
                      Browse History
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link
                      to="/history/2025"
                      className="btn btn-outline-success w-100"
                    >
                      <i className="fas fa-calendar me-2"></i>
                      2025 Season
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <a
                      href="https://www.formula1.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-danger w-100"
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      Official F1
                    </a>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-warning w-100"
                      onClick={() => window.location.reload()}
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
      </div>
    </div>
  );
};

export default HomePage;
