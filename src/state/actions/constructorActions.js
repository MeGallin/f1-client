/**
 * Constructor Actions
 *
 * Action atoms for managing constructor-related data fetching and state updates.
 */

import { atom } from 'jotai';
import { F1API } from '../../services';
import {
  constructorsAtom,
  constructorsByYearAtom,
  selectedConstructorDetailsAtom,
} from '../atoms/dataAtoms';
import { selectedYearAtom } from '../atoms/configAtoms';
import { handleApiCall } from './actionUtils';

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

/**
 * Fetch specific constructor details
 */
export const fetchConstructorDetailsAtom = atom(
  null,
  async (get, set, constructorId) => {
    return handleApiCall(
      set,
      'constructors',
      () => F1API.ConstructorsAPI.getConstructor(constructorId),
      selectedConstructorDetailsAtom,
    );
  },
);

/**
 * Fetch constructor details for a specific year
 */
export const fetchConstructorByYearAtom = atom(
  null,
  async (get, set, { year = null, constructorId } = {}) => {
    const selectedYear = year || get(selectedYearAtom);

    return handleApiCall(
      set,
      'constructors',
      () =>
        F1API.ConstructorsAPI.getConstructorByYear(selectedYear, constructorId),
      selectedConstructorDetailsAtom,
    );
  },
);
