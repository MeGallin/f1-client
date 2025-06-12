/**
 * Loading Indicator Component
 * Shows loading states and handles API errors gracefully
 */

import React from 'react';
import { useIsLoading, useHasError, useErrorStates } from '../state';

export const LoadingIndicator = () => {
  const isLoading = useIsLoading();
  const hasError = useHasError();
  const errorStates = useErrorStates();

  if (!isLoading && !hasError) {
    return null;
  }

  return (
    <div className="fixed-top" style={{ zIndex: 1050 }}>
      <div className="container-fluid">
        {isLoading && (
          <div
            className="alert alert-info alert-dismissible fade show mb-0"
            role="alert"
          >
            <div className="d-flex align-items-center">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading F1 data...</span>
            </div>
          </div>
        )}

        {hasError && (
          <div
            className="alert alert-warning alert-dismissible fade show mb-0"
            role="alert"
          >
            <div className="d-flex align-items-center">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <div>
                <strong>API Rate Limited</strong>
                <div className="small">
                  The F1 API is temporarily rate limiting requests. Some data
                  may load slowly.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingIndicator;
