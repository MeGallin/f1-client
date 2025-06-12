/**
 * Custom Jotai Hooks for F1 Application
 *
 * These hooks provide a convenient interface for components to interact
 * with the Jotai atoms, following React patterns and best practices.
 */

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  // Configuration atoms
  selectedYearAtom,
  selectedRoundAtom,
  selectedDriverAtom,
  selectedConstructorAtom,
  selectedCircuitAtom,

  // UI state atoms
  loadingStatesAtom,
  errorStatesAtom,
  activeViewAtom,
  themeAtom,
  sidebarCollapsedAtom,

  // Data atoms
  seasonsAtom,
  currentSeasonAtom,
  racesAtom,
  currentRaceAtom,
  nextRaceAtom,
  driversAtom,
  driversByYearAtom,
  constructorsAtom,
  constructorsByYearAtom,
  driverStandingsAtom,
  constructorStandingsAtom,
  currentDriverStandingsAtom,
  currentConstructorStandingsAtom,
  raceResultsAtom,
  qualifyingResultsAtom,
  sprintResultsAtom,
  lapTimesAtom,
  pitStopsAtom,
  circuitsAtom,

  // Derived atoms
  selectedRaceAtom,
  availableYearsAtom,
  availableRoundsAtom,
  topDriversAtom,
  topConstructorsAtom,
  raceCalendarAtom,
  isLoadingAtom,
  hasErrorAtom,
} from './atoms';

import {
  // Action atoms
  fetchSeasonsAtom,
  fetchCurrentSeasonAtom,
  setSelectedYearAtom,
  fetchRacesAtom,
  fetchCurrentRaceAtom,
  fetchNextRaceAtom,
  setSelectedRoundAtom,
  fetchDriversAtom,
  fetchDriversByYearAtom,
  fetchConstructorsAtom,
  fetchConstructorsByYearAtom,
  fetchDriverStandingsAtom,
  fetchConstructorStandingsAtom,
  fetchCurrentDriverStandingsAtom,
  fetchCurrentConstructorStandingsAtom,
  fetchRaceResultsAtom,
  fetchQualifyingResultsAtom,
  fetchSprintResultsAtom,
  fetchLapTimesAtom,
  fetchPitStopsAtom,
  fetchCircuitsAtom,
  initializeAppAtom,
  refreshAllDataAtom,
} from './actions';

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

// =============================================================================
// DATA HOOKS
// =============================================================================

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

// =============================================================================
// APP MANAGEMENT HOOKS
// =============================================================================

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
  const isLoading = useIsLoading();
  const hasError = useHasError();

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
