/**
 * StatsCards Component
 *
 * Reusable stats cards for displaying F1 key statistics
 */

import React from 'react';

const StatsCards = ({
  topDrivers,
  topConstructors,
  currentRace,
  nextRace,
  isLoading,
}) => {
  const statsData = [
    {
      title: 'Championship Leader',
      icon: 'fas fa-crown',
      color: 'var(--f1-gold)',
      value: topDrivers?.[0]?.driver || 'Loading...',
      subtitle: `${topDrivers?.[0]?.points || 0} points`,
      showLoader: isLoading && !topDrivers?.[0]?.driver,
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
      showLoader:
        isLoading && !nextRace?.MRData?.RaceTable?.Races?.[0]?.raceName,
    },
    {
      title: 'Constructor Leader',
      icon: 'fas fa-car',
      color: 'var(--f1-danger)',
      value: topConstructors?.[0]?.name || 'Loading...',
      subtitle: `${topConstructors?.[0]?.points || 0} points`,
      showLoader: isLoading && !topConstructors?.[0]?.name,
    },
  ];

  return (
    <div className="row mb-5">
      {statsData.map((stat, index) => (
        <div key={index} className="col-md-3 mb-3">
          <div
            className="f1-stat-card"
            style={{ '--f1-accent-color': stat.color }}
          >
            <div className="card-body text-center">
              <i
                className={`${stat.icon} fa-2x mb-3`}
                style={{ color: stat.color }}
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
                {stat.title}
              </h5>
              <div
                className="f1-stat-number"
                style={{
                  color: stat.color,
                  fontSize:
                    index === 1 || index === 2 ? 'var(--text-lg)' : undefined,
                }}
              >
                {stat.value}
              </div>
              <div className="f1-stat-label">{stat.subtitle}</div>
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
