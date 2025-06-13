/**
 * Custom hooks for circuits data management
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  // Data atoms
  circuitsAtom,
} from '../atoms';
import {
  // Action atoms
  fetchCircuitsAtom,
} from '../actions';

/**
 * Hook for circuits data
 */
export const useCircuits = () => {
  const circuits = useAtomValue(circuitsAtom);
  const fetchCircuits = useSetAtom(fetchCircuitsAtom);

  return {
    circuits,
    fetchCircuits,
  };
};
