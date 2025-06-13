/**
 * Circuit Actions
 *
 * Action atoms for managing circuit-related data fetching and state updates.
 */

import { atom } from 'jotai';
import { F1API } from '../../services';
import {
  circuitsAtom,
  circuitsByYearAtom,
  selectedCircuitDetailsAtom,
  statusCodesAtom,
} from '../atoms/dataAtoms';
import { selectedYearAtom } from '../atoms/configAtoms';
import { handleApiCall } from './actionUtils';

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

/**
 * Fetch circuits for a specific year
 */
export const fetchCircuitsByYearAtom = atom(
  null,
  async (get, set, year = null) => {
    const selectedYear = year || get(selectedYearAtom);

    return handleApiCall(
      set,
      'circuits',
      () => F1API.CircuitsAPI.getCircuitsByYear(selectedYear),
      circuitsByYearAtom,
    );
  },
);

/**
 * Fetch specific circuit details
 */
export const fetchCircuitDetailsAtom = atom(
  null,
  async (get, set, circuitId) => {
    return handleApiCall(
      set,
      'circuits',
      () => F1API.CircuitsAPI.getCircuit(circuitId),
      selectedCircuitDetailsAtom,
    );
  },
);

// =============================================================================
// STATUS ACTIONS
// =============================================================================

/**
 * Fetch all status codes
 */
export const fetchStatusCodesAtom = atom(null, async (get, set) => {
  return handleApiCall(
    set,
    'results',
    () => F1API.StatusAPI.getAllStatusCodes(),
    statusCodesAtom,
  );
});
