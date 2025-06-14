/**
 * Loading Indicator Component
 * Shows loading states and handles API errors gracefully
 * Enhanced with routing-specific loading messages
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useIsLoading, useHasError, useErrorStates } from '../state';

export const LoadingIndicator = () => {
  const isLoading = useIsLoading();
  const hasError = useHasError();
  const errorStates = useErrorStates();
  const location = useLocation();

  // Determine loading message based on current route
  const getLoadingMessage = () => {
    if (location.pathname === '/') {
      return 'Loading live F1 dashboard data...';
    }
    if (location.pathname.startsWith('/history')) {
      const pathParts = location.pathname.split('/');
      if (pathParts.length >= 3) {
        const season = pathParts[2];
        return `Loading ${season} season data...`;
      }
      return 'Loading historical F1 data...';
    }
    return 'Loading F1 data...';
  };

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
              <span>{getLoadingMessage()}</span>
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
