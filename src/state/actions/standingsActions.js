/**
 * Standings Actions
 *
 * Action atoms for managing standings-related data fetching and state updates.
 */

import { atom } from 'jotai';
import { F1API } from '../../services';
import {
  driverStandingsAtom,
  constructorStandingsAtom,
  currentDriverStandingsAtom,
  currentConstructorStandingsAtom,
} from '../atoms/dataAtoms';
import { selectedYearAtom } from '../atoms/configAtoms';
import { handleApiCall } from './actionUtils';

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
