/**
 * Season Actions
 *
 * Action atoms for managing season-related data fetching and state updates.
 */

import { atom } from 'jotai';
import { F1API } from '../../services';
import { seasonsAtom, currentSeasonAtom } from '../atoms/dataAtoms';
import { selectedYearAtom, selectedRoundAtom } from '../atoms/configAtoms';
import { handleApiCall } from './actionUtils';

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

  // Import other fetch actions to avoid circular dependencies
  const { fetchRacesAtom } = await import('./raceActions');
  const { fetchDriversByYearAtom } = await import('./driverActions');
  const { fetchConstructorsByYearAtom } = await import('./constructorActions');
  const { fetchDriverStandingsAtom, fetchConstructorStandingsAtom } =
    await import('./standingsActions');

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
