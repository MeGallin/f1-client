/**
 * TopDriversCard Component
 *
 * Top 3 drivers podium display card - Redesigned Championship Podium
 */

import React from 'react';
import './TopDriversCard.css'; // Import the new styles

const TopDriversCard = ({
  selectedSeason,
  loadingDrivers,
  topDrivers,
  onViewModeChange,
}) => {
  return (
    <div className="top-drivers-card">
      <div className="card-header">
        <h5 className="card-title">CHAMPIONSHIP PODIUM</h5>
        <p className="card-subtitle">Top 3 Drivers - {selectedSeason}</p>
      </div>

      <div className="card-body">
        {loadingDrivers ? (
          <div className="text-center py-4">
            <div className="f1-loader mb-3" style={{ margin: '0 auto' }}></div>
            <h6>Loading Championship Podium...</h6>
            <p className="text-muted mb-0">
              Fetching {selectedSeason} driver standings
            </p>
          </div>
        ) : topDrivers && topDrivers.length >= 3 ? (
          <>
            <div className="podium-container">
              <div className="podium-step">
                <div className="podium-place silver">2</div>
                <div className="mt-3">
                  <p className="podium-driver-name">{topDrivers[1]?.driver}</p>
                  <p className="podium-driver-points">
                    {topDrivers[1]?.points} PTS
                  </p>
                </div>
              </div>

              <div className="podium-step">
                <div className="podium-place gold">1</div>
                <div className="mt-3">
                  <p className="podium-driver-name">{topDrivers[0]?.driver}</p>
                  <p className="podium-driver-points">
                    {topDrivers[0]?.points} PTS • {topDrivers[0]?.wins || 0}{' '}
                    WINS
                  </p>
                </div>
              </div>

              <div className="podium-step">
                <div className="podium-place bronze">3</div>
                <div className="mt-3">
                  <p className="podium-driver-name">{topDrivers[2]?.driver}</p>
                  <p className="podium-driver-points">
                    {topDrivers[2]?.points} PTS
                  </p>
                </div>
              </div>
            </div>

            <button
              className="btn view-standings-btn w-100"
              onClick={() => onViewModeChange('drivers')}
            >
              View Full Standings
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <h6>No Driver Data Available</h6>
            <p className="text-muted mb-0">
              Unable to load championship standings for {selectedSeason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TopDriversCard;
