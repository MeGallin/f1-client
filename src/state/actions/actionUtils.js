/**
 * Action Utilities
 *
 * Shared utility functions for action atoms to handle API calls,
 * loading states, and error management.
 */

import { loadingStatesAtom, errorStatesAtom } from '../atoms/uiAtoms';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Helper function to update loading state
 */
export const updateLoadingState = (set, dataType, isLoading) => {
  set(loadingStatesAtom, (prev) => ({
    ...prev,
    [dataType]: isLoading,
  }));
};

/**
 * Helper function to update error state
 */
export const updateErrorState = (set, dataType, error) => {
  set(errorStatesAtom, (prev) => ({
    ...prev,
    [dataType]: error,
  }));
};

/**
 * Generic API call handler
 */
export const handleApiCall = async (set, dataType, apiCall, targetAtom) => {
  try {
    updateLoadingState(set, dataType, true);
    updateErrorState(set, dataType, null);

    const data = await apiCall();
    set(targetAtom, data);

    return data;
  } catch (error) {
    console.error(`Error fetching ${dataType}:`, error);
    updateErrorState(set, dataType, error.message || error);
    throw error;
  } finally {
    updateLoadingState(set, dataType, false);
  }
};
