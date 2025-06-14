/**
 * Race Actions
 *
 * Action atoms for managing race-related data fetching and state updates.
 */

import { atom } from 'jotai';
import { F1API } from '../../services';
import { racesAtom, currentRaceAtom, nextRaceAtom } from '../atoms/dataAtoms';
import { selectedYearAtom, selectedRoundAtom } from '../atoms/configAtoms';
import { handleApiCall } from './actionUtils';

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

  // Import results actions to avoid circular dependencies
  const { fetchRaceResultsAtom, fetchQualifyingResultsAtom } = await import(
    './resultsActions'
  );

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
