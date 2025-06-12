/**
 * F1 Data Display Component - Enhanced with Jotai State Management
 *
 * This component demonstrates the use of Jotai atoms for state management
 * in a production-ready F1 dashboard application.
 */

import React from 'react';
import {
  useF1AppState,
  useStandings,
  useCurrentAndNextRace,
  useSeasons,
  useRaces,
  useIsLoading,
  useHasError,
} from '../state';
import { FeatureFlag, useFeatureFlag } from './FeatureFlag';
import { APP_CONFIG, UI_CONFIG } from '../config';

const F1DataDisplay = () => {
  const {
    selectedYear,
    selectedRound,
    selectedRace,
    currentRace,
    nextRace,
    topDrivers,
    topConstructors,
    raceCalendar,
    setSelectedYear,
    setSelectedRound,
  } = useF1AppState();
  const { availableYears } = useSeasons();
  const { availableRounds } = useRaces();
  const isLoading = useIsLoading();
  const hasError = useHasError();

  // Feature flags
  const showHistoricalData = useFeatureFlag('enableHistoricalData');
  const showCircuits = useFeatureFlag('enableCircuits');
  const showRaceResults = useFeatureFlag('enableRaceResults');

  // Handle year selection change
  const handleYearChange = async (e) => {
    const year = parseInt(e.target.value);
    await setSelectedYear(year);
  };

  // Handle round selection change
  const handleRoundChange = async (e) => {
    const round = parseInt(e.target.value);
    await setSelectedRound(round);
  };

  if (hasError) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading F1 Data</h4>
          <p>
            There was an error loading the F1 data. Please try refreshing the
            page.
          </p>
          <hr />
          <p className="mb-0">
            If the problem persists, please check your internet connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {' '}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-4 text-center mb-3">🏎️ {APP_CONFIG.name}</h1>
          <p className="lead text-center text-muted">
            v{APP_CONFIG.version} - Powered by Jotai State Management
          </p>
        </div>
      </div>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Loading F1 data...</span>
            </div>
          </div>
        </div>
      )}
      {/* Season and Round Selection */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            Season & Race Selection
          </h2>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="yearSelect" className="form-label fw-bold">
                Select Season:
              </label>
              <select
                id="yearSelect"
                className="form-select"
                value={selectedYear}
                onChange={handleYearChange}
                disabled={isLoading}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="roundSelect" className="form-label fw-bold">
                Select Round:
              </label>
              <select
                id="roundSelect"
                className="form-select"
                value={selectedRound}
                onChange={handleRoundChange}
                disabled={isLoading || !availableRounds.length}
              >
                {availableRounds.map((round) => (
                  <option key={round.round} value={round.round}>
                    Round {round.round}: {round.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRace && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="fw-bold">Selected Race Details:</h6>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Race:</strong> {selectedRace.raceName}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {selectedRace.date}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Circuit:</strong> {selectedRace.Circuit.circuitName}
                  </p>
                  <p className="mb-1">
                    <strong>Location:</strong>{' '}
                    {selectedRace.Circuit.Location.locality},{' '}
                    {selectedRace.Circuit.Location.country}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Current and Next Race Info */}
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-success text-white">
              <h2 className="h5 mb-0">
                <i className="fas fa-flag-checkered me-2"></i>
                Current Race
              </h2>
            </div>
            <div className="card-body">
              {currentRace &&
              currentRace.MRData &&
              currentRace.MRData.RaceTable &&
              currentRace.MRData.RaceTable.Races.length > 0 ? (
                <div>
                  <h5 className="card-title">
                    {currentRace.MRData.RaceTable.Races[0].raceName}
                  </h5>
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
                        {currentRace.MRData.RaceTable.Races[0].time || 'TBA'}
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
                  <p className="text-muted mt-2">
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
                </div>
              ) : (
                <p className="text-muted">
                  No current race information available
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-info text-white">
              <h2 className="h5 mb-0">
                <i className="fas fa-arrow-right me-2"></i>
                Next Race
              </h2>
            </div>
            <div className="card-body">
              {nextRace &&
              nextRace.MRData &&
              nextRace.MRData.RaceTable &&
              nextRace.MRData.RaceTable.Races.length > 0 ? (
                <div>
                  <h5 className="card-title">
                    {nextRace.MRData.RaceTable.Races[0].raceName}
                  </h5>
                  <div className="row">
                    <div className="col-sm-6">
                      <p className="mb-1">
                        <strong>Round:</strong>{' '}
                        {nextRace.MRData.RaceTable.Races[0].round}
                      </p>
                      <p className="mb-1">
                        <strong>Date:</strong>{' '}
                        {nextRace.MRData.RaceTable.Races[0].date}
                      </p>
                    </div>
                    <div className="col-sm-6">
                      <p className="mb-1">
                        <strong>Time:</strong>{' '}
                        {nextRace.MRData.RaceTable.Races[0].time || 'TBA'}
                      </p>
                      <p className="mb-1">
                        <strong>Circuit:</strong>{' '}
                        {nextRace.MRData.RaceTable.Races[0].Circuit.circuitName}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted mt-2">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    {
                      nextRace.MRData.RaceTable.Races[0].Circuit.Location
                        .locality
                    }
                    ,{' '}
                    {
                      nextRace.MRData.RaceTable.Races[0].Circuit.Location
                        .country
                    }
                  </p>
                </div>
              ) : (
                <p className="text-muted">
                  No upcoming race information available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Standings Tables */}
      <div className="row">
        {/* Driver Standings */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h2 className="h5 mb-0">
                <i className="fas fa-trophy me-2"></i>
                Top 5 Drivers
              </h2>
            </div>
            <div className="card-body p-0">
              {topDrivers && topDrivers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">#</th>
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
                          className={index === 0 ? 'table-warning' : ''}
                        >
                          <td className="text-center fw-bold">
                            {driver.position}
                          </td>
                          <td className="fw-semibold">{driver.driver}</td>
                          <td className="text-muted">{driver.constructor}</td>
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
                <div className="p-3 text-muted text-center">
                  No driver standings available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Constructor Standings */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">
              <h2 className="h5 mb-0">
                <i className="fas fa-car me-2"></i>
                Top 5 Constructors
              </h2>
            </div>
            <div className="card-body p-0">
              {topConstructors && topConstructors.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">#</th>
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
                          className={
                            index === 0 ? 'table-danger text-white' : ''
                          }
                        >
                          <td className="text-center fw-bold">
                            {constructor.position}
                          </td>
                          <td className="fw-semibold">{constructor.name}</td>
                          <td className="text-muted">
                            {constructor.nationality}
                          </td>
                          <td className="text-center fw-bold">
                            {constructor.points}
                          </td>
                          <td className="text-center">{constructor.wins}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-3 text-muted text-center">
                  No constructor standings available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>{' '}
      {/* Race Calendar Preview */}
      <FeatureFlag feature="enableHistoricalData">
        {raceCalendar && raceCalendar.length > 0 && (
          <div className="row mt-4">
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
                  <h2 className="h5 mb-0">
                    <i className="fas fa-calendar me-2"></i>
                    {selectedYear} Race Calendar
                  </h2>
                </div>
                <div className="card-body">
                  <div className="row">
                    {raceCalendar.slice(0, 6).map((race) => (
                      <div key={race.round} className="col-md-4 col-lg-2 mb-3">
                        <div className="card h-100 border-0 bg-light">
                          <div className="card-body p-2 text-center">
                            <div className="fw-bold text-primary">
                              Round {race.round}
                            </div>
                            <div className="small fw-semibold">{race.name}</div>
                            <div className="small text-muted">
                              {race.circuit.location}
                            </div>
                            <div className="small">
                              {race.date.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {raceCalendar.length > 6 && (
                    <div className="text-center mt-3">
                      <span className="text-muted">
                        Showing first 6 of {raceCalendar.length} races
                      </span>
                    </div>
                  )}
                </div>{' '}
              </div>
            </div>
          </div>
        )}
      </FeatureFlag>
    </div>
  );
};

export default F1DataDisplay;
