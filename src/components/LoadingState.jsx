/**
 * LoadingState Component
 *
 * Loading indicator for historical data
 */

import React from 'react';

const LoadingState = ({ selectedSeason }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="f1-carbon-card">
          <div className="card-body text-center py-5">
            <div className="f1-loader mb-3"></div>
            <h5
              style={{
                fontFamily: 'var(--font-racing)',
                color: 'var(--f1-grey-800)',
              }}
            >
              Loading {selectedSeason} Season Data
            </h5>
            <p className="text-muted">
              Please wait while we fetch the historical information...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
