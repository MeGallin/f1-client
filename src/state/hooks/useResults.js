/**
 * Custom hooks for race results data management
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  // Data atoms
  raceResultsAtom,
  qualifyingResultsAtom,
  sprintResultsAtom,
  lapTimesAtom,
  pitStopsAtom,
} from '../atoms';
import {
  // Action atoms
  fetchRaceResultsAtom,
  fetchQualifyingResultsAtom,
  fetchSprintResultsAtom,
  fetchLapTimesAtom,
  fetchPitStopsAtom,
} from '../actions';

/**
 * Hook for race results data
 */
export const useRaceResults = () => {
  const raceResults = useAtomValue(raceResultsAtom);
  const qualifyingResults = useAtomValue(qualifyingResultsAtom);
  const sprintResults = useAtomValue(sprintResultsAtom);

  const fetchRaceResults = useSetAtom(fetchRaceResultsAtom);
  const fetchQualifyingResults = useSetAtom(fetchQualifyingResultsAtom);
  const fetchSprintResults = useSetAtom(fetchSprintResultsAtom);

  return {
    raceResults,
    qualifyingResults,
    sprintResults,
    fetchRaceResults,
    fetchQualifyingResults,
    fetchSprintResults,
  };
};

/**
 * Hook for lap data
 */
export const useLapData = () => {
  const lapTimes = useAtomValue(lapTimesAtom);
  const pitStops = useAtomValue(pitStopsAtom);

  const fetchLapTimes = useSetAtom(fetchLapTimesAtom);
  const fetchPitStops = useSetAtom(fetchPitStopsAtom);

  return {
    lapTimes,
    pitStops,
    fetchLapTimes,
    fetchPitStops,
  };
};
