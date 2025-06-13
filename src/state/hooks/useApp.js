/**
 * Custom hooks for app management and initialization
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  // Derived atoms
  isLoadingAtom,
  hasErrorAtom,
} from '../atoms';
import {
  // Action atoms
  initializeAppAtom,
  refreshAllDataAtom,
} from '../actions';
import { useSelectedYear } from './useConfiguration';
import { useSelectedRound } from './useConfiguration';
import { useStandings } from './useStandings';
import { useCurrentAndNextRace } from './useRaces';
import { useRaces } from './useRaces';

/**
 * Hook for app initialization
 */
export const useAppInitialization = () => {
  const initializeApp = useSetAtom(initializeAppAtom);
  const refreshAllData = useSetAtom(refreshAllDataAtom);

  return {
    initializeApp,
    refreshAllData,
  };
};

/**
 * Hook for comprehensive app state
 * Returns commonly used state values in one hook
 */
export const useF1AppState = () => {
  const { selectedYear, setSelectedYear } = useSelectedYear();
  const { selectedRound, setSelectedRound } = useSelectedRound();
  const { topDrivers, topConstructors } = useStandings();
  const { currentRace, nextRace } = useCurrentAndNextRace();
  const { selectedRace, raceCalendar } = useRaces();
  const isLoading = useAtomValue(isLoadingAtom);
  const hasError = useAtomValue(hasErrorAtom);

  return {
    selectedYear,
    selectedRound,
    selectedRace,
    currentRace,
    nextRace,
    topDrivers,
    topConstructors,
    raceCalendar,
    isLoading,
    hasError,
    setSelectedYear,
    setSelectedRound,
  };
};
