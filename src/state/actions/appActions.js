/**
 * App Actions
 *
 * Action atoms for managing application-level operations like
 * initialization and data refresh.
 */

import { atom } from 'jotai';
import { selectedYearAtom } from '../atoms/configAtoms';
import { errorStatesAtom } from '../atoms/uiAtoms';
import { fetchSeasonsAtom, fetchCurrentSeasonAtom } from './seasonActions';
import {
  fetchCurrentRaceAtom,
  fetchNextRaceAtom,
  fetchRacesAtom,
} from './raceActions';
import {
  fetchCurrentDriverStandingsAtom,
  fetchCurrentConstructorStandingsAtom,
} from './standingsActions';

// =============================================================================
// INITIALIZATION ACTION
// =============================================================================

/**
 * Initialize application data
 * Fetches essential data when the app starts
 */
export const initializeAppAtom = atom(null, async (get, set) => {
  try {
    console.log('Initializing F1 App...');

    // First, fetch the most essential data
    await set(fetchSeasonsAtom);
    await set(fetchCurrentSeasonAtom);

    // Then fetch current standings (most commonly viewed)
    await set(fetchCurrentDriverStandingsAtom);
    await set(fetchCurrentConstructorStandingsAtom);

    // Finally, fetch current and next race info
    await set(fetchCurrentRaceAtom);
    await set(fetchNextRaceAtom);

    // Fetch data for current year (but not all endpoints at once)
    const currentYear = get(selectedYearAtom);
    await set(fetchRacesAtom, currentYear);

    // Only fetch drivers and constructors for current year if needed
    // These will be loaded on-demand when user navigates to those sections

    console.log('F1 App initialized successfully');
  } catch (error) {
    console.error('Error initializing F1 app:', error);
    throw error;
  }
});

// =============================================================================
// REFRESH ACTION
// =============================================================================

/**
 * Refresh all data (bypass cache)
 */
export const refreshAllDataAtom = atom(null, async (get, set) => {
  // Clear all error states
  set(errorStatesAtom, {
    seasons: null,
    races: null,
    drivers: null,
    constructors: null,
    standings: null,
    results: null,
    circuits: null,
  });

  // Re-initialize the app
  return set(initializeAppAtom);
});
