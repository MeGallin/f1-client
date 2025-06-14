/**
 * Custom hooks for constructors data management
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  // Data atoms
  constructorsAtom,
  constructorsByYearAtom,
} from '../atoms';
import {
  // Action atoms
  fetchConstructorsAtom,
  fetchConstructorsByYearAtom,
} from '../actions';

/**
 * Hook for constructors data
 */
export const useConstructors = () => {
  const constructors = useAtomValue(constructorsAtom);
  const constructorsByYear = useAtomValue(constructorsByYearAtom);
  const fetchConstructors = useSetAtom(fetchConstructorsAtom);
  const fetchConstructorsByYear = useSetAtom(fetchConstructorsByYearAtom);

  return {
    constructors,
    constructorsByYear,
    fetchConstructors,
    fetchConstructorsByYear,
  };
};
