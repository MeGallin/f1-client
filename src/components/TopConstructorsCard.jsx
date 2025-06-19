/**
 * TopConstructorsCard Component
 *
 * Top 3 constructors podium display card - Redesigned Constructor Elite
 */

import React from 'react';
import './TopConstructorsCard.css'; // Import the new styles
import './TopDriversCard.css'; // Re-using podium styles

const TopConstructorsCard = ({
  selectedSeason,
  loadingConstructors,
  topConstructors,
  onViewModeChange,
}) => {
  return (
    <div className="top-constructors-card">
      <div className="card-header">
        <h5 className="card-title">CONSTRUCTOR ELITE</h5>
        <p className="card-subtitle">Top 3 Teams - {selectedSeason}</p>
      </div>

      <div className="card-body">
        {loadingConstructors ? (
          <div className="text-center py-4">
            <div className="f1-loader mb-3" style={{ margin: '0 auto' }}></div>
            <h6>Loading Constructor Elite...</h6>
            <p className="text-muted mb-0">
              Fetching {selectedSeason} constructor standings
            </p>
          </div>
        ) : topConstructors && topConstructors.length >= 3 ? (
          <>
            <div className="podium-container">
              <div className="podium-step">
                <div className="podium-place silver">2</div>
                <div className="mt-3">
                  <p className="podium-constructor-name">
                    {topConstructors[1]?.name}
                  </p>
                  <p className="podium-constructor-points">
                    {topConstructors[1]?.points} PTS
                  </p>
                </div>
              </div>

              <div className="podium-step">
                <div
                  className="podium-place gold"
                  style={{
                    background: 'var(--f1-gradient-red)',
                    borderColor: 'var(--f1-red-dark)',
                  }}
                >
                  1
                </div>
                <div className="mt-3">
                  <p
                    className="podium-constructor-name"
                    style={{ color: 'var(--f1-red-primary)' }}
                  >
                    {topConstructors[0]?.name}
                  </p>
                  <p className="podium-constructor-points">
                    {topConstructors[0]?.points} PTS •{' '}
                    {topConstructors[0]?.wins || 0} WINS
                  </p>
                </div>
              </div>

              <div className="podium-step">
                <div className="podium-place bronze">3</div>
                <div className="mt-3">
                  <p className="podium-constructor-name">
                    {topConstructors[2]?.name}
                  </p>
                  <p className="podium-constructor-points">
                    {topConstructors[2]?.points} PTS
                  </p>
                </div>
              </div>
            </div>

            <button
              className="btn view-standings-btn w-100"
              onClick={() => onViewModeChange('constructors')}
            >
              View Constructor History
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <h6>No Constructor Data Available</h6>
            <p className="text-muted mb-0">
              Unable to load constructor standings for {selectedSeason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopConstructorsCard;
