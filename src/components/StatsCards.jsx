/**
 * StatsCards Component
 *
 * Reusable stats cards for displaying F1 key statistics
 */

import React from 'react';
import RaceCountdown from './RaceCountdown';
import RaceTop3 from './RaceTop3';
import useLatestRaceResults from '../hooks/useLatestRaceResults';

const StatsCards = ({
  topDrivers,
  topConstructors,
  currentRace,
  nextRace,
  isLoading,
}) => {
  // Fetch latest race results for top 3 finishers
  const { getTop3Finishers, loading: loadingResults } =
    useLatestRaceResults(currentRace);
  const statsData = [
    {
      title: 'Championship Leaders',
      icon: 'fas fa-trophy',
      color: 'var(--f1-gold)',
      value: topDrivers?.[0]?.driver || 'Loading...',
      subtitle: `${topDrivers?.[0]?.points || 0} points`,
      constructorName: topConstructors?.[0]?.name || 'Loading...',
      constructorPoints: `${topConstructors?.[0]?.points || 0} points`,
      showLoader:
        isLoading && (!topDrivers?.[0]?.driver || !topConstructors?.[0]?.name),
    },
    {
      title: 'Latest Race',
      icon: 'fas fa-flag-checkered',
      color: 'var(--f1-success)',
      value:
        currentRace?.MRData?.RaceTable?.Races?.[0]?.raceName?.replace(
          'Grand Prix',
          'GP',
        ) || 'Loading...',
      subtitle: currentRace?.MRData?.RaceTable?.Races?.[0]?.date || '',
      showLoader:
        isLoading && !currentRace?.MRData?.RaceTable?.Races?.[0]?.raceName,
    },
    {
      title: 'Next Race',
      icon: 'fas fa-calendar-check',
      color: 'var(--f1-info)',
      value:
        nextRace?.MRData?.RaceTable?.Races?.[0]?.raceName?.replace(
          'Grand Prix',
          'GP',
        ) || 'Loading...',
      subtitle: nextRace?.MRData?.RaceTable?.Races?.[0]?.date || '',
      dateTime: nextRace?.MRData?.RaceTable?.Races?.[0]?.date || '',
      showLoader:
        isLoading && !nextRace?.MRData?.RaceTable?.Races?.[0]?.raceName,
    },
  ];
  return (
    <div className="row mb-5">
      {statsData.map((stat, index) => (
        <div key={index} className="col-md-4 mb-3">
          <div
            className="f1-stat-card"
            style={{ '--f1-accent-color': stat.color }}
          >
            <div className="card-body text-center">
              <i
                className={`${stat.icon} fa-2x mb-3`}
                style={{ color: stat.color }}
              ></i>{' '}
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
                {stat.title}
              </h5>
              {/* Next Race card with countdown timer */}{' '}
              {index === 0 ? (
                // Championship Leaders Card (Drivers & Constructors)
                <>
                  <div className="f1-championship-leaders">
                    <div className="mb-3">
                      <div
                        style={{
                          fontFamily: 'var(--font-racing)',
                          color: 'var(--f1-grey-700)',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          borderLeft: '3px solid var(--f1-gold)',
                          paddingLeft: '0.5rem',
                          marginBottom: '0.5rem',
                          textAlign: 'left',
                        }}
                      >
                        <i className="fas fa-user me-1"></i> Driver
                      </div>
                      <div
                        className="f1-stat-number"
                        style={{
                          color: stat.color,
                          fontSize: 'var(--text-md)',
                        }}
                      >
                        {stat.value}
                      </div>
                      <div className="f1-stat-label">{stat.subtitle}</div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-racing)',
                          color: 'var(--f1-grey-700)',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          borderLeft: '3px solid var(--f1-danger)',
                          paddingLeft: '0.5rem',
                          marginBottom: '0.5rem',
                          textAlign: 'left',
                        }}
                      >
                        <i className="fas fa-car me-1"></i> Constructor
                      </div>
                      <div
                        className="f1-stat-number"
                        style={{
                          color: 'var(--f1-danger)',
                          fontSize: 'var(--text-md)',
                        }}
                      >
                        {stat.constructorName}
                      </div>
                      <div className="f1-stat-label">
                        {stat.constructorPoints}
                      </div>
                    </div>
                  </div>
                </>
              ) : index === 2 &&
                nextRace?.MRData?.RaceTable?.Races?.[0]?.date &&
                !isLoading ? (
                // Next Race card with countdown timer
                <>
                  <div
                    className="f1-stat-number mb-2"
                    style={{
                      color: stat.color,
                      fontSize: 'var(--text-lg)',
                    }}
                  >
                    {stat.value}
                  </div>{' '}
                  <div className="f1-stat-label mb-2">{stat.subtitle}</div>{' '}
                  <RaceCountdown
                    eventDate={nextRace.MRData.RaceTable.Races[0].date}
                    eventTime={
                      nextRace.MRData.RaceTable.Races[0].time || '00:00:00Z'
                    }
                    eventName="EVENT STARTS IN"
                    style={{ marginTop: '-0.5rem' }}
                  />
                </>
              ) : index === 1 && currentRace?.MRData?.RaceTable?.Races?.[0] ? (
                // Latest Race Card with top 3 finishers
                <>
                  <div
                    className="f1-stat-number mb-1"
                    style={{
                      color: stat.color,
                      fontSize: 'var(--text-lg)',
                    }}
                  >
                    {stat.value}
                  </div>{' '}
                  <div className="f1-stat-label mb-2">
                    {stat.subtitle}
                    {currentRace?.MRData?.RaceTable?.Races?.[0]?.Circuit
                      ?.circuitName && (
                      <div className="mt-1 text-center d-flex align-items-center justify-content-center">
                        <i
                          className="fas fa-flag-checkered me-1"
                          style={{ color: 'var(--f1-red-primary)' }}
                        ></i>
                        <span
                          style={{
                            color: 'var(--f1-red-primary)',
                            fontSize: '0.9rem',
                            fontWeight: 'var(--fw-medium)',
                          }}
                        >
                          {
                            currentRace.MRData.RaceTable.Races[0].Circuit
                              .circuitName
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  <RaceTop3
                    top3Finishers={getTop3Finishers()}
                    isLoading={loadingResults}
                  />
                </>
              ) : (
                <>
                  <div
                    className="f1-stat-number"
                    style={{
                      color: stat.color,
                      fontSize: 'var(--text-lg)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="f1-stat-label">{stat.subtitle}</div>
                </>
              )}
              {stat.showLoader && (
                <div
                  className="f1-loader mt-2"
                  style={{ width: '2rem', height: '2rem', margin: '0 auto' }}
                ></div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
