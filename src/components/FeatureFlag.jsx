/**
 * Feature Flag Component
 * Conditionally renders components based on feature flags from environment variables
 */

import React from 'react';
import { FEATURE_FLAGS } from '../config';

/**
 * FeatureFlag component for conditional rendering
 * @param {string} feature - The feature flag name
 * @param {React.ReactNode} children - Components to render if feature is enabled
 * @param {React.ReactNode} fallback - Optional fallback component if feature is disabled
 */
export const FeatureFlag = ({ feature, children, fallback = null }) => {
  const isEnabled = FEATURE_FLAGS[feature];

  if (isEnabled) {
    return children;
  }

  return fallback;
};

/**
 * Hook to check if a feature is enabled
 * @param {string} feature - The feature flag name
 * @returns {boolean} - Whether the feature is enabled
 */
export const useFeatureFlag = (feature) => {
  return FEATURE_FLAGS[feature] || false;
};

/**
 * Higher-order component for feature flagging
 * @param {string} feature - The feature flag name
 * @param {React.Component} Component - Component to wrap
 * @param {React.Component} FallbackComponent - Optional fallback component
 */
export const withFeatureFlag = (
  feature,
  Component,
  FallbackComponent = null,
) => {
  return function FeatureFlaggedComponent(props) {
    const isEnabled = FEATURE_FLAGS[feature];

    if (isEnabled) {
      return <Component {...props} />;
    }

    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }

    return null;
  };
};

export default FeatureFlag;
