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
            {/* Race Selection */}
            <div className="row mb-4">
              <div className="col-12">
                <h6>Select a Race:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {raceList.map((race) => (
                    <button
                      key={race.round}
                      className={`btn ${
                        selectedRace?.round === race.round
                          ? 'btn-primary'
                          : 'btn-outline-primary'
                      } btn-sm`}
                      onClick={() => handleRaceSelect(race)}
                    >
                      R{race.round} - {race.raceName}
                    </button>
                  ))}
                </div>
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
            {!selectedRace && (
              <div className="text-center py-5">
                <i className="fas fa-flag-checkered fa-3x text-muted mb-3"></i>
                <h5>Select a race to view detailed results</h5>
                <p className="text-muted">
                  Choose from the race calendar above to see qualifying, race
                  results, lap times, and pit stop data.
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
