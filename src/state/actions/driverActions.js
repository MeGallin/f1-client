/**
 * Driver Actions
 *
 * Action atoms for managing driver-related data fetching and state updates.
 */

import { atom } from 'jotai';
import { F1API } from '../../services';
import {
  driversAtom,
  driversByYearAtom,
  selectedDriverDetailsAtom,
  driverLapTimesAtom,
  driverPitStopsAtom,
} from '../atoms/dataAtoms';
import { selectedYearAtom, selectedRoundAtom } from '../atoms/configAtoms';
import { handleApiCall } from './actionUtils';

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

/**
 * Fetch specific driver details
 */
export const fetchDriverDetailsAtom = atom(null, async (get, set, driverId) => {
  return handleApiCall(
    set,
    'drivers',
    () => F1API.DriversAPI.getDriver(driverId),
    selectedDriverDetailsAtom,
  );
});

/**
 * Fetch driver details for a specific year
 */
export const fetchDriverByYearAtom = atom(
  null,
  async (get, set, { year = null, driverId } = {}) => {
    const selectedYear = year || get(selectedYearAtom);

    return handleApiCall(
      set,
      'drivers',
      () => F1API.DriversAPI.getDriverByYear(selectedYear, driverId),
      selectedDriverDetailsAtom,
    );
  },
);

/**
 * Fetch driver lap times
 */
export const fetchDriverLapTimesAtom = atom(
  null,
  async (get, set, { year = null, round = null, driverId } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () =>
        F1API.LapsAPI.getDriverLapTimes(selectedYear, selectedRound, driverId),
      driverLapTimesAtom,
    );
  },
);

/**
 * Fetch driver-specific pit stops
 */
export const fetchDriverPitStopsAtom = atom(
  null,
  async (get, set, { year = null, round = null, driverId } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () =>
        F1API.PitStopsAPI.getDriverPitStops(
          selectedYear,
          selectedRound,
          driverId,
        ),
      driverPitStopsAtom,
    );
  },
);
