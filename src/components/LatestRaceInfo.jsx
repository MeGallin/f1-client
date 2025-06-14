/**
 * LatestRaceInfo Component
 *
 * Reusable component for displaying latest race information
 */

import React from 'react';
import { Link } from 'react-router-dom';

const LatestRaceInfo = ({ currentRace }) => {
  if (!currentRace?.MRData?.RaceTable?.Races?.[0]) {
    return null;
  }

  const race = currentRace.MRData.RaceTable.Races[0];

  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="f1-carbon-card">
          <div
            className="card-header"
            style={{
              background: 'var(--f1-gradient-dark)',
              color: 'var(--f1-white)',
              borderRadius:
                'var(--border-radius-lg) var(--border-radius-lg) 0 0',
              borderBottom: '3px solid var(--f1-red-primary)',
            }}
          >
            <h5
              className="mb-0"
              style={{
                fontFamily: 'var(--font-racing)',
                fontWeight: 'var(--fw-bold)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: 'var(--text-lg)',
              }}
            >
              LATEST RACE: {race.raceName?.toUpperCase()}
            </h5>
          </div>
          <div
            className="card-body"
            style={{ background: 'var(--f1-grey-50)' }}
          >
            <div className="row">
              <div className="col-md-6">
                <div
                  className="border-start border-4 ps-3"
                  style={{ borderColor: 'var(--f1-red-primary) !important' }}
                >
                  <h6
                    className="fw-bold mb-3"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      color: 'var(--f1-grey-800)',
                      textTransform: 'uppercase',
                      fontSize: 'var(--text-base)',
                    }}
                  >
                    RACE INFORMATION
                  </h6>
                  <div className="mb-2">
                    <strong style={{ color: 'var(--f1-grey-700)' }}>
                      Round:
                    </strong>{' '}
                    <span className="racing-number">{race.round}</span>
                  </div>
                  <div className="mb-2">
                    <strong style={{ color: 'var(--f1-grey-700)' }}>
                      Date:
                    </strong>{' '}
                    <span className="racing-stat">{race.date}</span>
                  </div>
                  <div className="mb-2">
                    <strong style={{ color: 'var(--f1-grey-700)' }}>
                      Time:
                    </strong>{' '}
                    <span
                      className="racing-stat"
                      style={{ color: 'var(--f1-red-primary)' }}
                    >
                      {race.time || '13:00:00Z'}
                    </span>
                  </div>
                  <div className="mb-0">
                    <strong style={{ color: 'var(--f1-grey-700)' }}>
                      Circuit:
                    </strong>{' '}
                    <span
                      className="racing-stat"
                      style={{ color: 'var(--f1-red-primary)' }}
                    >
                      {race.Circuit.circuitName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className="border-start border-4 ps-3"
                  style={{ borderColor: 'var(--f1-red-primary) !important' }}
                >
                  <h6
                    className="fw-bold mb-3"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      color: 'var(--f1-grey-800)',
                      textTransform: 'uppercase',
                      fontSize: 'var(--text-base)',
                    }}
                  >
                    CIRCUIT LOCATION
                  </h6>
                  <div
                    className="mb-3"
                    style={{
                      color: 'var(--f1-red-primary)',
                      fontWeight: 'bold',
                    }}
                  >
                    {race.Circuit.Location.locality},{' '}
                    {race.Circuit.Location.country}
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-danger btn-sm"
                      style={{
                        fontFamily: 'var(--font-accent)',
                        fontWeight: 'var(--fw-bold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      RACE DETAILS
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      style={{
                        fontFamily: 'var(--font-accent)',
                        fontWeight: 'var(--fw-bold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      ALL RACES
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

export default LatestRaceInfo;
