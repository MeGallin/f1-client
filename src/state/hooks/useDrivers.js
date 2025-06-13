/**
 * Custom hooks for drivers data management
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  // Data atoms
  driversAtom,
  driversByYearAtom,
} from '../atoms';
import {
  // Action atoms
  fetchDriversAtom,
  fetchDriversByYearAtom,
} from '../actions';

/**
 * Hook for drivers data
 */
export const useDrivers = () => {
  const drivers = useAtomValue(driversAtom);
  const driversByYear = useAtomValue(driversByYearAtom);
  const fetchDrivers = useSetAtom(fetchDriversAtom);
  const fetchDriversByYear = useSetAtom(fetchDriversByYearAtom);

  return {
    drivers,
    driversByYear,
    fetchDrivers,
    fetchDriversByYear,
  };
};
