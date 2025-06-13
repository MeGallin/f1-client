/**
 * UI State Hooks
 *
 * Hooks for managing UI state including loading states, errors,
 * theme preferences, and sidebar state.
 */

import { useAtom, useAtomValue } from 'jotai';
import {
  loadingStatesAtom,
  errorStatesAtom,
  activeViewAtom,
  themeAtom,
  sidebarCollapsedAtom,
  isLoadingAtom,
  hasErrorAtom,
} from '../atoms/uiAtoms';

// =============================================================================
// UI STATE HOOKS
// =============================================================================

/**
 * Hook for loading states
 */
export const useLoadingStates = () => {
  return useAtomValue(loadingStatesAtom);
};

/**
 * Hook for error states
 */
export const useErrorStates = () => {
  return useAtomValue(errorStatesAtom);
};

/**
 * Hook for active view management
 */
export const useActiveView = () => {
  return useAtom(activeViewAtom);
};

/**
 * Hook for theme management
 */
export const useTheme = () => {
  return useAtom(themeAtom);
};

/**
 * Hook for sidebar state
 */
export const useSidebar = () => {
  return useAtom(sidebarCollapsedAtom);
};

/**
 * Hook for overall loading state
 */
export const useIsLoading = () => {
  return useAtomValue(isLoadingAtom);
};

/**
 * Hook for overall error state
 */
export const useHasError = () => {
  return useAtomValue(hasErrorAtom);
};
