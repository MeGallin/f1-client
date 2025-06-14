/**
 * RacesView Component
 *
 * Race calendar and analytics view for the History page
 * Displays race results, qualifying, lap times, and strategy data
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useRaces,
  useRaceResults,
  useLapData,
  useSelectedYear,
} from '../state';

const RacesView = ({ selectedSeason }) => {
  const [selectedRace, setSelectedRace] = useState(null);
  const [activeTab, setActiveTab] = useState('results');

  const { races, fetchRaces } = useRaces();
  const {
    raceResults,
    qualifyingResults,
    fetchRaceResults,
    fetchQualifyingResults,
  } = useRaceResults();
  const { lapTimes, pitStops, fetchLapTimes, fetchPitStops } = useLapData();
  const { setSelectedYear } = useSelectedYear();
  // Set the selected year when component mounts
  useEffect(() => {
    if (selectedSeason) {
      setSelectedYear(parseInt(selectedSeason));
      fetchRaces(selectedSeason);
    }
  }, [selectedSeason]); // Only depend on selectedSeason to prevent infinite loop

  // Get race list from API data
  const raceList = races?.MRData?.RaceTable?.Races || [];

  // Function to check if a race has been completed (date has passed)
  const isRaceCompleted = (raceDate) => {
    const today = new Date();
    const race = new Date(raceDate);

    // Set time to end of day for race date to account for timezone differences
    race.setHours(23, 59, 59, 999);

    return race < today;
  };

  // Filter races to only show completed ones
  const completedRaces = raceList.filter((race) => isRaceCompleted(race.date));

  // Handle race selection
  const handleRaceSelect = (race) => {
    setSelectedRace(race);
    const round = parseInt(race.round);
    const year = parseInt(selectedSeason);

    // Fetch race data
    fetchRaceResults({ year, round });
    fetchQualifyingResults({ year, round });
    fetchLapTimes({ year, round });
    fetchPitStops({ year, round });
  };

  // Race results data
  const raceResultsList =
    raceResults?.MRData?.RaceTable?.Races?.[0]?.Results || [];
  const qualifyingResultsList =
    qualifyingResults?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults || [];
  const lapTimesList = lapTimes?.MRData?.RaceTable?.Races?.[0]?.Laps || [];
  const pitStopsList = pitStops?.MRData?.RaceTable?.Races?.[0]?.PitStops || [];

  return (
    <div className="row">
      <div className="col-12">
        <div className="f1-table">
          <div
            className="card-header"
            style={{
              background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
              color: 'var(--f1-grey-900)',
              borderRadius:
                'var(--border-radius-lg) var(--border-radius-lg) 0 0',
            }}
          >
            <h3
              className="fw-bold mb-0"
              style={{
                fontFamily: 'var(--font-racing)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              RACE CALENDAR & TELEMETRY - {selectedSeason}
            </h3>
          </div>
          <div className="card-body">
            {/* Race Selection */}
            <div className="row mb-4">
              <div className="col-12">
                <p
                  className="mb-3 fw-semibold"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Select a Race:
                </p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {completedRaces.map((race) => (
                    <button
                      key={race.round}
                      type="button"
                      className={`btn ${
                        selectedRace?.round === race.round
                          ? 'btn-primary'
                          : 'btn-outline-primary'
                      } rounded-pill px-3 py-1 text-nowrap fw-medium shadow-sm`}
                      style={{ fontFamily: "'Orbitron', monospace" }}
                      onClick={() => handleRaceSelect(race)}
                    >
                      R{race.round} - {race.raceName}
                    </button>
                  ))}
                </div>

                {!selectedRace && (
                  <div
                    className="text-center text-muted fst-italic"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                  >
                    Select a completed race to view detailed results
                    <br />
                    <small className="fw-light">
                      Only completed races are shown. Choose from the race
                      calendar above to see qualifying, race results, lap times,
                      and pit stop data.
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Race Details */}
            {selectedRace && (
              <div className="row">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5>{selectedRace.raceName}</h5>
                      <small>
                        {selectedRace.Circuit.circuitName} - {selectedRace.date}
                      </small>
                    </div>
                    <div className="card-body">
                      {/* Tabs */}
                      <ul className="nav nav-tabs mb-3">
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              activeTab === 'results' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('results')}
                          >
                            Race Results
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              activeTab === 'qualifying' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('qualifying')}
                          >
                            Qualifying
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              activeTab === 'laps' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('laps')}
                          >
                            Lap Times
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              activeTab === 'pitstops' ? 'active' : ''
                            }`}
                            onClick={() => setActiveTab('pitstops')}
                          >
                            Pit Stops
                          </button>
                        </li>
                      </ul>

                      {/* Tab Content */}
                      {activeTab === 'results' && (
                        <RaceResultsTable results={raceResultsList} />
                      )}

                      {activeTab === 'qualifying' && (
                        <QualifyingResultsTable
                          results={qualifyingResultsList}
                        />
                      )}

                      {activeTab === 'laps' && (
                        <LapTimesTable laps={lapTimesList} />
                      )}

                      {activeTab === 'pitstops' && (
                        <PitStopsTable pitStops={pitStopsList} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No race selected message */}
            {!selectedRace && completedRaces.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-flag-checkered fa-3x text-muted mb-3"></i>
                <h5>No completed races available</h5>
                <p className="text-muted">
                  There are no completed races for this season yet. Please check
                  back after races have been completed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Race Results Table Component
const RaceResultsTable = ({ results }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Driver</th>
          <th>Constructor</th>
          <th>Time/Retired</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={index}>
            <td>{result.position}</td>
            <td>
              {result.Driver.givenName} {result.Driver.familyName}
            </td>
            <td>{result.Constructor.name}</td>
            <td>{result.Time?.time || result.status}</td>
            <td>{result.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Qualifying Results Table Component
const QualifyingResultsTable = ({ results }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Driver</th>
          <th>Constructor</th>
          <th>Q1</th>
          <th>Q2</th>
          <th>Q3</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={index}>
            <td>{result.position}</td>
            <td>
              {result.Driver.givenName} {result.Driver.familyName}
            </td>
            <td>{result.Constructor.name}</td>
            <td>{result.Q1 || '-'}</td>
            <td>{result.Q2 || '-'}</td>
            <td>{result.Q3 || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Lap Times Table Component
const LapTimesTable = ({ laps }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Lap</th>
          <th>Fastest Driver</th>
          <th>Time</th>
          <th>Speed (km/h)</th>
        </tr>
      </thead>
      <tbody>
        {laps.slice(0, 10).map((lap, index) => {
          const fastestTiming = lap.Timings?.reduce((fastest, timing) =>
            !fastest || timing.time < fastest.time ? timing : fastest,
          );
          return (
            <tr key={index}>
              <td>{lap.number}</td>
              <td>{fastestTiming?.driverId || '-'}</td>
              <td>{fastestTiming?.time || '-'}</td>
              <td>-</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// Pit Stops Table Component
const PitStopsTable = ({ pitStops }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Driver</th>
          <th>Stop</th>
          <th>Lap</th>
          <th>Time</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {pitStops.map((stop, index) => (
          <tr key={index}>
            <td>{stop.driverId}</td>
            <td>{stop.stop}</td>
            <td>{stop.lap}</td>
            <td>{stop.time}</td>
            <td>{stop.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RacesView;
