/**
 * F1 State Management - Main Export File
 *
 * This file exports all state management components, atoms, and hooks
 * for easy importing throughout the application.
 */

// Atoms
export * from './atoms';

// Actions
export * from './actions';

// Hooks
export * from './hooks';

// Provider
export { default as F1StateProvider } from './provider';

// Import everything for default export
import F1StateProviderComponent from './provider';
import * as hooks from './hooks';
import * as atoms from './atoms';
import * as actions from './actions';

// Convenience exports for common use cases
export {
  // Most commonly used hooks
  useF1AppState,
  useSelectedYear,
  useSelectedRound,
  useStandings,
  useHistoricalStandings,
  useCurrentAndNextRace,
  useRaces,
  useAppInitialization,
} from './hooks';

// Export default for easy importing
export default {
  Provider: F1StateProviderComponent,
  hooks,
  atoms,
  actions,
};
