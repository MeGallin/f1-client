/**
 * StatsCards Component
 *
 * Reusable stats cards for displaying F1 key statistics in a modern dashboard layout.
 */
import React from 'react';
import RaceCountdown from './RaceCountdown';
import RaceTop3 from './RaceTop3';
import useLatestRaceResults from '../hooks/useLatestRaceResults';
import './StatsCards.css'; // Import the new styles

const StatsCards = ({
  topDrivers,
  topConstructors,
  currentRace,
  nextRace,
  isLoading,
}) => {
  const { getTop3Finishers, loading: loadingResults } =
    useLatestRaceResults(currentRace);

  const renderLoading = () => (
    <div className="loading-overlay">
      <div className="f1-loader"></div>
    </div>
  );

  return (
    <div className="stats-grid">
      {/* Championship Leaders Card */}
      <div className="dashboard-card championship-card">
        <div className="card-header">
          <h3 className="card-title">Championship Leaders</h3>
        </div>
        <div className="card-content">
          <div className="leader-section">
            <div className="leader-header">
              <span className="icon">🏆</span> Driver Leader
            </div>
            <div className="leader-name">
              {topDrivers?.[0]?.driver || 'Loading...'}
            </div>
            <div className="leader-points">
              {topDrivers?.[0]?.points || '0'} points
            </div>
            {topDrivers?.[1] && (
              <div className="second-place">
                <span className="name">2. {topDrivers[1].driver}</span>
                <span>{topDrivers[1].points} pts</span>
              </div>
            )}
          </div>
          <div className="leader-section">
            <div className="leader-header">
              <span className="icon">🏗️</span> Constructor Leader
            </div>
            <div className="leader-name">
              {topConstructors?.[0]?.name || 'Loading...'}
            </div>
            <div className="leader-points">
              {topConstructors?.[0]?.points || '0'} points
            </div>
            {topConstructors?.[1] && (
              <div className="second-place">
                <span className="name">2. {topConstructors[1].name}</span>
                <span>{topConstructors[1].points} pts</span>
              </div>
            )}
          </div>
        </div>
        {isLoading &&
          (!topDrivers?.length || !topConstructors?.length) &&
          renderLoading()}
      </div>

      {/* Last Race Card */}
      <div className="dashboard-card last-race-card">
        <div className="card-header">
          <h3 className="card-title">Last Race</h3>
        </div>
        <div className="card-content">
          <div className="race-info-section">
            <div className="race-name">
              {currentRace?.MRData?.RaceTable?.Races?.[0]?.raceName?.replace(
                'Grand Prix',
                'GP',
              ) || 'Loading...'}
            </div>
            <div className="race-date">
              📅 {currentRace?.MRData?.RaceTable?.Races?.[0]?.date || ''}
            </div>
          </div>
          <div className="podium-section">
            <h4 className="podium-title">Podium Finishers</h4>
            <RaceTop3
              top3Finishers={getTop3Finishers()}
              isLoading={loadingResults}
            />
          </div>
        </div>
        {isLoading && !currentRace && renderLoading()}
      </div>

      {/* Next Race Card */}
      <div className="dashboard-card next-race-card">
        <div className="card-header">
          <h3 className="card-title">Next Race</h3>
        </div>
        <div className="card-content">
          <div className="race-info">
            <div className="race-name">
              {nextRace?.MRData?.RaceTable?.Races?.[0]?.raceName?.replace(
                'Grand Prix',
                'GP',
              ) || 'Loading...'}
            </div>
            <div className="race-date">
              📅 {nextRace?.MRData?.RaceTable?.Races?.[0]?.date || ''}
            </div>
            <div className="race-season">
              Season{' '}
              {nextRace?.MRData?.RaceTable?.season || new Date().getFullYear()}
            </div>
          </div>
          <div>
            <RaceCountdown
              eventDate={nextRace?.MRData?.RaceTable?.Races?.[0]?.date}
              eventTime={
                nextRace?.MRData?.RaceTable?.Races?.[0]?.time || '00:00:00Z'
              }
            />
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">🏁 EVENT</div>
                <div className="detail-value">
                  Round{' '}
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.round || 'TBA'}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">🏎️ CIRCUIT</div>
                <div className="detail-value">
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.Circuit?.circuitName?.replace(
                    ' Circuit',
                    '',
                  ) || 'TBA'}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">📍 LOCATION</div>
                <div className="detail-value">
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.Circuit?.Location
                    ?.locality || 'TBA'}
                  ,{' '}
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.Circuit?.Location
                    ?.country || ''}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">⏰ RACE START</div>
                <div className="detail-value">
                  {nextRace?.MRData?.RaceTable?.Races?.[0]?.time
                    ? new Date(
                        `1970-01-01T${nextRace.MRData.RaceTable.Races[0].time}`,
                      ).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC',
                      }) + ' UTC'
                    : 'TBA'}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLoading && !nextRace && renderLoading()}
      </div>
    </div>
  );
};

export default StatsCards;
