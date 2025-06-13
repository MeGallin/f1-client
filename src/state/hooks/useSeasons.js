/**
 * Custom hooks for seasons data management
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  // Data atoms
  seasonsAtom,
  currentSeasonAtom,
  // Derived atoms
  availableYearsAtom,
} from '../atoms';
import {
  // Action atoms
  fetchSeasonsAtom,
  fetchCurrentSeasonAtom,
} from '../actions';

/**
 * Hook for seasons data with fetch capability
 */
export const useSeasons = () => {
  const seasons = useAtomValue(seasonsAtom);
  const fetchSeasons = useSetAtom(fetchSeasonsAtom);
  const availableYears = useAtomValue(availableYearsAtom);

  return {
    seasons,
    availableYears,
    fetchSeasons,
  };
};

/**
 * Hook for current season data
 */
export const useCurrentSeason = () => {
  const currentSeason = useAtomValue(currentSeasonAtom);
  const fetchCurrentSeason = useSetAtom(fetchCurrentSeasonAtom);

  return {
    currentSeason,
    fetchCurrentSeason,
  };
};
