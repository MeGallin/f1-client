/**
 * Configuration Hooks
 *
 * Hooks for managing application configuration state like selected year,
 * round, driver, constructor, and circuit selections.
 */

import { useAtom, useSetAtom } from 'jotai';
import {
  selectedYearAtom,
  selectedRoundAtom,
  selectedDriverAtom,
  selectedConstructorAtom,
  selectedCircuitAtom,
} from '../atoms/configAtoms';
import { setSelectedYearAtom } from '../actions/seasonActions';
import { setSelectedRoundAtom } from '../actions/raceActions';

// =============================================================================
// CONFIGURATION HOOKS
// =============================================================================

/**
 * Hook for managing selected year
 */
export const useSelectedYear = () => {
  const [selectedYear, setYear] = useAtom(selectedYearAtom);
  const setSelectedYear = useSetAtom(setSelectedYearAtom);

  const handleYearChange = async (year) => {
    await setSelectedYear(year);
  };

  return {
    selectedYear,
    setSelectedYear: handleYearChange,
    setSelectedYearSync: setYear, // For immediate UI updates
  };
};

/**
 * Hook for managing selected round
 */
export const useSelectedRound = () => {
  const [selectedRound, setRound] = useAtom(selectedRoundAtom);
  const setSelectedRound = useSetAtom(setSelectedRoundAtom);

  const handleRoundChange = async (round) => {
    await setSelectedRound(round);
  };

  return {
    selectedRound,
    setSelectedRound: handleRoundChange,
    setSelectedRoundSync: setRound, // For immediate UI updates
  };
};

/**
 * Hook for managing selected driver
 */
export const useSelectedDriver = () => {
  return useAtom(selectedDriverAtom);
};

/**
 * Hook for managing selected constructor
 */
export const useSelectedConstructor = () => {
  return useAtom(selectedConstructorAtom);
};

/**
 * Hook for managing selected circuit
 */
export const useSelectedCircuit = () => {
  return useAtom(selectedCircuitAtom);
};
