/**
 * Jotai Action Atoms for F1 Application
 *
 * These atoms handle side effects and API calls, updating the state atoms accordingly.
 * They provide a clean separation between data fetching logic and state management.
 */

import { atom } from 'jotai';
import { F1API } from '../services';
import {
  selectedYearAtom,
  selectedRoundAtom,
  loadingStatesAtom,
  errorStatesAtom,
  seasonsAtom,
  currentSeasonAtom,
  racesAtom,
  currentRaceAtom,
  nextRaceAtom,
  driversAtom,
  driversByYearAtom,
  constructorsAtom,
  constructorsByYearAtom,
  driverStandingsAtom,
  constructorStandingsAtom,
  currentDriverStandingsAtom,
  currentConstructorStandingsAtom,
  raceResultsAtom,
  qualifyingResultsAtom,
  sprintResultsAtom,
  lapTimesAtom,
  pitStopsAtom,
  circuitsAtom,
} from './atoms';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Helper function to update loading state
 */
const updateLoadingState = (set, dataType, isLoading) => {
  set(loadingStatesAtom, (prev) => ({
    ...prev,
    [dataType]: isLoading,
  }));
};

/**
 * Helper function to update error state
 */
const updateErrorState = (set, dataType, error) => {
  set(errorStatesAtom, (prev) => ({
    ...prev,
    [dataType]: error,
  }));
};

/**
 * Generic API call handler
 */
const handleApiCall = async (set, dataType, apiCall, targetAtom) => {
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

// =============================================================================
// SEASON ACTIONS
// =============================================================================

/**
 * Fetch all seasons
 */
export const fetchSeasonsAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'seasons',
    () => F1API.SeasonsAPI.getAllSeasons(),
    seasonsAtom,
  );
});

/**
 * Fetch current season
 */
export const fetchCurrentSeasonAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'seasons',
    () => F1API.SeasonsAPI.getCurrentSeason(),
    currentSeasonAtom,
  );
});

/**
 * Set selected year and fetch related data
 */
export const setSelectedYearAtom = atom(null, async (get, set, year) => {
  set(selectedYearAtom, year);
  set(selectedRoundAtom, 1); // Reset round when year changes

  // Fetch related data for the new year sequentially to avoid rate limiting
  try {
    await set(fetchRacesAtom, year);
    await set(fetchDriversByYearAtom, year);
    await set(fetchConstructorsByYearAtom, year);
    await set(fetchDriverStandingsAtom, year);
    await set(fetchConstructorStandingsAtom, year);
  } catch (error) {
    console.error('Error fetching data for year:', year, error);
  }
});

// =============================================================================
// RACE ACTIONS
// =============================================================================

/**
 * Fetch races for a specific year
 */
export const fetchRacesAtom = atom(null, async (get, set, year = null) => {
  const selectedYear = year || get(selectedYearAtom);

  return handleApiCall(
    set,
    'races',
    () => F1API.RacesAPI.getAllRaces(selectedYear),
    racesAtom,
  );
});

/**
 * Fetch current race
 */
export const fetchCurrentRaceAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'races',
    () => F1API.RacesAPI.getCurrentRace(),
    currentRaceAtom,
  );
});

/**
 * Fetch next race
 */
export const fetchNextRaceAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'races',
    () => F1API.RacesAPI.getNextRace(),
    nextRaceAtom,
  );
});

/**
 * Set selected round and fetch related data
 */
export const setSelectedRoundAtom = atom(null, async (get, set, round) => {
  set(selectedRoundAtom, round);
  const selectedYear = get(selectedYearAtom);

  // Fetch related data for the new round sequentially
  try {
    await set(fetchRaceResultsAtom, { year: selectedYear, round });
    await set(fetchQualifyingResultsAtom, { year: selectedYear, round });
    // Skip sprint results and lap data for now to reduce API calls
    // await set(fetchSprintResultsAtom, { year: selectedYear, round });
    // await set(fetchLapTimesAtom, { year: selectedYear, round });
    // await set(fetchPitStopsAtom, { year: selectedYear, round });
  } catch (error) {
    console.error('Error fetching data for round:', round, error);
  }
});

// =============================================================================
// DRIVER ACTIONS
// =============================================================================

/**
 * Fetch all drivers
 */
export const fetchDriversAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'drivers',
    () => F1API.DriversAPI.getAllDrivers(),
    driversAtom,
  );
});

/**
 * Fetch drivers for a specific year
 */
export const fetchDriversByYearAtom = atom(
  null,
  async (get, set, year = null) => {
    const selectedYear = year || get(selectedYearAtom);

    return handleApiCall(
      set,
      'drivers',
      () => F1API.DriversAPI.getDriversByYear(selectedYear),
      driversByYearAtom,
    );
  },
);

// =============================================================================
// CONSTRUCTOR ACTIONS
// =============================================================================

/**
 * Fetch all constructors
 */
export const fetchConstructorsAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'constructors',
    () => F1API.ConstructorsAPI.getAllConstructors(),
    constructorsAtom,
  );
});

/**
 * Fetch constructors for a specific year
 */
export const fetchConstructorsByYearAtom = atom(
  null,
  async (get, set, year = null) => {
    const selectedYear = year || get(selectedYearAtom);

    return handleApiCall(
      set,
      'constructors',
      () => F1API.ConstructorsAPI.getConstructorsByYear(selectedYear),
      constructorsByYearAtom,
    );
  },
);

// =============================================================================
// STANDINGS ACTIONS
// =============================================================================

/**
 * Fetch driver standings for a specific year
 */
export const fetchDriverStandingsAtom = atom(
  null,
  async (get, set, year = null) => {
    const selectedYear = year || get(selectedYearAtom);

    return handleApiCall(
      set,
      'standings',
      () => F1API.StandingsAPI.getDriverStandings(selectedYear),
      driverStandingsAtom,
    );
  },
);

/**
 * Fetch constructor standings for a specific year
 */
export const fetchConstructorStandingsAtom = atom(
  null,
  async (get, set, year = null) => {
    const selectedYear = year || get(selectedYearAtom);

    return handleApiCall(
      set,
      'standings',
      () => F1API.StandingsAPI.getConstructorStandings(selectedYear),
      constructorStandingsAtom,
    );
  },
);

/**
 * Fetch current driver standings
 */
export const fetchCurrentDriverStandingsAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'standings',
    () => F1API.StandingsAPI.getCurrentDriverStandings(),
    currentDriverStandingsAtom,
  );
});

/**
 * Fetch current constructor standings
 */
export const fetchCurrentConstructorStandingsAtom = atom(
  null,
  async (get, set) => {
    return handleApiCall(
      set,
      'standings',
      () => F1API.StandingsAPI.getCurrentConstructorStandings(),
      currentConstructorStandingsAtom,
    );
  },
);

// =============================================================================
// RACE RESULTS ACTIONS
// =============================================================================

/**
 * Fetch race results
 */
export const fetchRaceResultsAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.ResultsAPI.getRaceResults(selectedYear, selectedRound),
      raceResultsAtom,
    );
  },
);

/**
 * Fetch qualifying results
 */
export const fetchQualifyingResultsAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.ResultsAPI.getQualifyingResults(selectedYear, selectedRound),
      qualifyingResultsAtom,
    );
  },
);

/**
 * Fetch sprint results
 */
export const fetchSprintResultsAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.SprintAPI.getSprintResults(selectedYear, selectedRound),
      sprintResultsAtom,
    );
  },
);

// =============================================================================
// LAP DATA ACTIONS
// =============================================================================

/**
 * Fetch lap times
 */
export const fetchLapTimesAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.LapsAPI.getLapTimes(selectedYear, selectedRound),
      lapTimesAtom,
    );
  },
);

/**
 * Fetch pit stops
 */
export const fetchPitStopsAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.PitStopsAPI.getPitStops(selectedYear, selectedRound),
      pitStopsAtom,
    );
  },
);

// =============================================================================
// CIRCUIT ACTIONS
// =============================================================================

/**
 * Fetch all circuits
 */
export const fetchCircuitsAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'circuits',
    () => F1API.CircuitsAPI.getAllCircuits(),
    circuitsAtom,
  );
});

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
