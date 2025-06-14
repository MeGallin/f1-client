/**
 * UI State Atoms
 *
 * Atoms for managing UI state including loading states, errors,
 * theme preferences, and sidebar state.
 */

import { atom } from 'jotai';
import { UI_CONFIG } from '../../config';

// =============================================================================
// UI STATE ATOMS
// =============================================================================

/**
 * Loading states for different data types
 */
export const loadingStatesAtom = atom({
  seasons: false,
  races: false,
  drivers: false,
  constructors: false,
  standings: false,
  results: false,
  circuits: false,
});

/**
 * Error states for different data types
 */
export const errorStatesAtom = atom({
  seasons: null,
  races: null,
  drivers: null,
  constructors: null,
  standings: null,
  results: null,
  circuits: null,
});

/**
 * Active tab/view in the dashboard
 */
export const activeViewAtom = atom('dashboard'); // dashboard, standings, races, drivers, constructors

/**
 * Theme preference (light/dark)
 */
export const themeAtom = atom(UI_CONFIG.defaultTheme);

/**
 * Sidebar collapsed state
 */
export const sidebarCollapsedAtom = atom(UI_CONFIG.sidebarCollapsed);

// =============================================================================
// DERIVED UI STATE ATOMS
// =============================================================================

/**
 * Derived atom: Overall loading state
 */
export const isLoadingAtom = atom((get) => {
  const loadingStates = get(loadingStatesAtom);
  return Object.values(loadingStates).some((loading) => loading === true);
});

/**
 * Derived atom: Any error state
 */
export const hasErrorAtom = atom((get) => {
  const errorStates = get(errorStatesAtom);
  return Object.values(errorStates).some((error) => error !== null);
});
