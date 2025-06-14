/**
 * Custom hooks for standings data management
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  // Data atoms
  driverStandingsAtom,
  constructorStandingsAtom,
  currentDriverStandingsAtom,
  currentConstructorStandingsAtom,
  // Derived atoms
  topDriversAtom,
  topConstructorsAtom,
  historicalTopDriversAtom,
  historicalTopConstructorsAtom,
} from '../atoms';
import {
  // Action atoms
  fetchDriverStandingsAtom,
  fetchConstructorStandingsAtom,
  fetchCurrentDriverStandingsAtom,
  fetchCurrentConstructorStandingsAtom,
} from '../actions';

/**
 * Hook for standings data
 */
export const useStandings = () => {
  const driverStandings = useAtomValue(driverStandingsAtom);
  const constructorStandings = useAtomValue(constructorStandingsAtom);
  const currentDriverStandings = useAtomValue(currentDriverStandingsAtom);
  const currentConstructorStandings = useAtomValue(
    currentConstructorStandingsAtom,
  );
  const topDrivers = useAtomValue(topDriversAtom);
  const topConstructors = useAtomValue(topConstructorsAtom);

  const fetchDriverStandings = useSetAtom(fetchDriverStandingsAtom);
  const fetchConstructorStandings = useSetAtom(fetchConstructorStandingsAtom);
  const fetchCurrentDriverStandings = useSetAtom(
    fetchCurrentDriverStandingsAtom,
  );
  const fetchCurrentConstructorStandings = useSetAtom(
    fetchCurrentConstructorStandingsAtom,
  );

  return {
    driverStandings,
    constructorStandings,
    currentDriverStandings,
    currentConstructorStandings,
    topDrivers,
    topConstructors,
    fetchDriverStandings,
    fetchConstructorStandings,
    fetchCurrentDriverStandings,
    fetchCurrentConstructorStandings,
  };
};

/**
 * Hook for historical standings data (for History page)
 */
export const useHistoricalStandings = () => {
  const driverStandings = useAtomValue(driverStandingsAtom);
  const constructorStandings = useAtomValue(constructorStandingsAtom);
  const historicalTopDrivers = useAtomValue(historicalTopDriversAtom);
  const historicalTopConstructors = useAtomValue(historicalTopConstructorsAtom);

  const fetchDriverStandings = useSetAtom(fetchDriverStandingsAtom);
  const fetchConstructorStandings = useSetAtom(fetchConstructorStandingsAtom);

  return {
    driverStandings,
    constructorStandings,
    topDrivers: historicalTopDrivers,
    topConstructors: historicalTopConstructors,
    fetchDriverStandings,
    fetchConstructorStandings,
  };
};
