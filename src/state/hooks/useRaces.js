/**
 * Custom hooks for races data management
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  // Data atoms
  racesAtom,
  currentRaceAtom,
  nextRaceAtom,
  // Derived atoms
  selectedRaceAtom,
  availableRoundsAtom,
  raceCalendarAtom,
} from '../atoms';
import {
  // Action atoms
  fetchRacesAtom,
  fetchCurrentRaceAtom,
  fetchNextRaceAtom,
} from '../actions';

/**
 * Hook for races data
 */
export const useRaces = () => {
  const races = useAtomValue(racesAtom);
  const selectedRace = useAtomValue(selectedRaceAtom);
  const availableRounds = useAtomValue(availableRoundsAtom);
  const raceCalendar = useAtomValue(raceCalendarAtom);
  const fetchRaces = useSetAtom(fetchRacesAtom);

  return {
    races,
    selectedRace,
    availableRounds,
    raceCalendar,
    fetchRaces,
  };
};

/**
 * Hook for current and next race data
 */
export const useCurrentAndNextRace = () => {
  const currentRace = useAtomValue(currentRaceAtom);
  const nextRace = useAtomValue(nextRaceAtom);
  const fetchCurrentRace = useSetAtom(fetchCurrentRaceAtom);
  const fetchNextRace = useSetAtom(fetchNextRaceAtom);

  return {
    currentRace,
    nextRace,
    fetchCurrentRace,
    fetchNextRace,
  };
};
