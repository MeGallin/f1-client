/**
 * Optimized Data Atoms
 * 
 * Consolidated atom structure to reduce memory usage and improve performance.
 * Uses data normalization and selective updates to minimize re-renders.
 */

import { atom } from 'jotai';

// =============================================================================
// NORMALIZED DATA STORES
// =============================================================================

/**
 * Normalized data store - reduces duplication and improves performance
 * Structure: { seasons: {...}, races: {...}, drivers: {...}, etc. }
 */
export const normalizedDataAtom = atom({
  seasons: new Map(),
  races: new Map(),
  drivers: new Map(),
  constructors: new Map(),
  circuits: new Map(),
  standings: new Map(),
  results: new Map(),
  lapTimes: new Map(),
  pitStops: new Map(),
  lastUpdated: new Map() // Track when each entity was last updated
});

// =============================================================================
// CURRENT SELECTION ATOMS
// =============================================================================

/**
 * Current selected year
 */
export const selectedYearAtom = atom(new Date().getFullYear());

/**
 * Current selected round
 */
export const selectedRoundAtom = atom(null);

/**
 * Current selected driver ID
 */
export const selectedDriverIdAtom = atom(null);

/**
 * Current selected constructor ID
 */
export const selectedConstructorIdAtom = atom(null);

/**
 * Current selected circuit ID
 */
export const selectedCircuitIdAtom = atom(null);

// =============================================================================
// DERIVED DATA ATOMS (Computed from normalized store)
// =============================================================================

/**
 * Current season races - derived from normalized store
 */
export const currentSeasonRacesAtom = atom((get) => {
  const data = get(normalizedDataAtom);
  const year = get(selectedYearAtom);
  const raceKey = `races_${year}`;
  return data.races.get(raceKey) || null;
});

/**
 * Current driver standings - derived from normalized store
 */
export const currentDriverStandingsAtom = atom((get) => {
  const data = get(normalizedDataAtom);
  const year = get(selectedYearAtom);
  const standingsKey = `driver_standings_${year}`;
  return data.standings.get(standingsKey) || null;
});

/**
 * Current constructor standings - derived from normalized store
 */
export const currentConstructorStandingsAtom = atom((get) => {
  const data = get(normalizedDataAtom);
  const year = get(selectedYearAtom);
  const standingsKey = `constructor_standings_${year}`;
  return data.standings.get(standingsKey) || null;
});

/**
 * Selected driver details - derived from normalized store
 */
export const selectedDriverDetailsAtom = atom((get) => {
  const data = get(normalizedDataAtom);
  const driverId = get(selectedDriverIdAtom);
  if (!driverId) return null;
  return data.drivers.get(driverId) || null;
});

/**
 * Selected constructor details - derived from normalized store
 */
export const selectedConstructorDetailsAtom = atom((get) => {
  const data = get(normalizedDataAtom);
  const constructorId = get(selectedConstructorIdAtom);
  if (!constructorId) return null;
  return data.constructors.get(constructorId) || null;
});

/**
 * Current and next race info - derived from normalized store
 */
export const currentAndNextRaceAtom = atom((get) => {
  const data = get(normalizedDataAtom);
  return {
    current: data.races.get('current_race'),
    next: data.races.get('next_race')
  };
});

// =============================================================================
// UPDATE ACTIONS FOR NORMALIZED STORE
// =============================================================================

/**
 * Update seasons data in normalized store
 */
export const updateSeasonsDataAtom = atom(
  null,
  (get, set, seasonsData) => {
    set(normalizedDataAtom, (prev) => {
      const newData = { ...prev };
      newData.seasons.set('all_seasons', seasonsData);
      newData.lastUpdated.set('all_seasons', Date.now());
      return newData;
    });
  }
);

/**
 * Update races data for a specific year
 */
export const updateRacesDataAtom = atom(
  null,
  (get, set, { year, racesData }) => {
    set(normalizedDataAtom, (prev) => {
      const newData = { ...prev };
      const raceKey = `races_${year}`;
      newData.races.set(raceKey, racesData);
      newData.lastUpdated.set(raceKey, Date.now());
      return newData;
    });
  }
);

/**
 * Update current and next race data
 */
export const updateCurrentNextRaceAtom = atom(
  null,
  (get, set, { current, next }) => {
    set(normalizedDataAtom, (prev) => {
      const newData = { ...prev };
      if (current) {
        newData.races.set('current_race', current);
        newData.lastUpdated.set('current_race', Date.now());
      }
      if (next) {
        newData.races.set('next_race', next);
        newData.lastUpdated.set('next_race', Date.now());
      }
      return newData;
    });
  }
);

/**
 * Update driver standings for a specific year
 */
export const updateDriverStandingsAtom = atom(
  null,
  (get, set, { year, standingsData }) => {
    set(normalizedDataAtom, (prev) => {
      const newData = { ...prev };
      const standingsKey = `driver_standings_${year}`;
      newData.standings.set(standingsKey, standingsData);
      newData.lastUpdated.set(standingsKey, Date.now());
      return newData;
    });
  }
);

/**
 * Update constructor standings for a specific year
 */
export const updateConstructorStandingsAtom = atom(
  null,
  (get, set, { year, standingsData }) => {
    set(normalizedDataAtom, (prev) => {
      const newData = { ...prev };
      const standingsKey = `constructor_standings_${year}`;
      newData.standings.set(standingsKey, standingsData);
      newData.lastUpdated.set(standingsKey, Date.now());
      return newData;
    });
  }
);

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

/**
 * Check if data is stale (older than 5 minutes)
 */
export const isDataStaleAtom = atom((get) => (key) => {
  const data = get(normalizedDataAtom);
  const lastUpdated = data.lastUpdated.get(key);
  if (!lastUpdated) return true;
  return Date.now() - lastUpdated > 300000; // 5 minutes
});

/**
 * Clear stale data from normalized store
 */
export const clearStaleDataAtom = atom(
  null,
  (get, set) => {
    const isStale = get(isDataStaleAtom);
    set(normalizedDataAtom, (prev) => {
      const newData = { ...prev };
      
      // Remove stale entries
      for (const [key] of newData.lastUpdated) {
        if (isStale(key)) {
          newData.races.delete(key);
          newData.standings.delete(key);
          newData.results.delete(key);
          newData.lapTimes.delete(key);
          newData.pitStops.delete(key);
          newData.lastUpdated.delete(key);
        }
      }
      
      return newData;
    });
  }
);

/**
 * Get memory usage statistics
 */
export const memoryStatsAtom = atom((get) => {
  const data = get(normalizedDataAtom);
  return {
    totalEntries: data.races.size + data.standings.size + data.results.size + 
                 data.lapTimes.size + data.pitStops.size + data.drivers.size + 
                 data.constructors.size + data.circuits.size + data.seasons.size,
    races: data.races.size,
    standings: data.standings.size,
    results: data.results.size,
    drivers: data.drivers.size,
    constructors: data.constructors.size,
    circuits: data.circuits.size,
    seasons: data.seasons.size,
    lastUpdatedEntries: data.lastUpdated.size
  };
});