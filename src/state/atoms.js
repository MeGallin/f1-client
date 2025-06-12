/**
 * Jotai Atoms for F1 Application State Management
 *
 * This file contains all the atomic state definitions for the F1 application.
 * Jotai provides a bottom-up approach to state management with atoms as the building blocks.
 */

import { atom } from 'jotai';
import { APP_CONFIG, UI_CONFIG } from '../config';

// =============================================================================
// CONFIGURATION ATOMS
// =============================================================================

/**
 * Current selected season year
 */
export const selectedYearAtom = atom(APP_CONFIG.defaultSeason);

/**
 * Current selected race round
 */
export const selectedRoundAtom = atom(APP_CONFIG.defaultRound);

/**
 * Selected driver ID for detailed view
 */
export const selectedDriverAtom = atom(null);

/**
 * Selected constructor ID for detailed view
 */
export const selectedConstructorAtom = atom(null);

/**
 * Selected circuit ID for detailed view
 */
export const selectedCircuitAtom = atom(null);

// =============================================================================
// UI STATE ATOMS
// =============================================================================

/**
 * Loading states for different data types
 */
export const loadingStatesAtom = atom({
  seasons: false,
  races: false,
  drivers: false,
  constructors: false,
  standings: false,
  results: false,
  circuits: false,
});

/**
 * Error states for different data types
 */
export const errorStatesAtom = atom({
  seasons: null,
  races: null,
  drivers: null,
  constructors: null,
  standings: null,
  results: null,
  circuits: null,
});

/**
 * Active tab/view in the dashboard
 */
export const activeViewAtom = atom('dashboard'); // dashboard, standings, races, drivers, constructors

/**
 * Theme preference (light/dark)
 */
export const themeAtom = atom(UI_CONFIG.defaultTheme);

/**
 * Sidebar collapsed state
 */
export const sidebarCollapsedAtom = atom(UI_CONFIG.sidebarCollapsed);

// =============================================================================
// DATA ATOMS
// =============================================================================

/**
 * All seasons data
 */
export const seasonsAtom = atom(null);

/**
 * Current season data
 */
export const currentSeasonAtom = atom(null);

/**
 * Races data for the selected year
 */
export const racesAtom = atom(null);

/**
 * Current race data
 */
export const currentRaceAtom = atom(null);

/**
 * Next race data
 */
export const nextRaceAtom = atom(null);

/**
 * All drivers data
 */
export const driversAtom = atom(null);

/**
 * Drivers for the selected year
 */
export const driversByYearAtom = atom(null);

/**
 * All constructors data
 */
export const constructorsAtom = atom(null);

/**
 * Constructors for the selected year
 */
export const constructorsByYearAtom = atom(null);

/**
 * Driver standings for the selected year
 */
export const driverStandingsAtom = atom(null);

/**
 * Constructor standings for the selected year
 */
export const constructorStandingsAtom = atom(null);

/**
 * Current driver standings
 */
export const currentDriverStandingsAtom = atom(null);

/**
 * Current constructor standings
 */
export const currentConstructorStandingsAtom = atom(null);

/**
 * Race results for selected race
 */
export const raceResultsAtom = atom(null);

/**
 * Qualifying results for selected race
 */
export const qualifyingResultsAtom = atom(null);

/**
 * Sprint results for selected race
 */
export const sprintResultsAtom = atom(null);

/**
 * Lap times for selected race
 */
export const lapTimesAtom = atom(null);

/**
 * Pit stops for selected race
 */
export const pitStopsAtom = atom(null);

/**
 * All circuits data
 */
export const circuitsAtom = atom(null);

// =============================================================================
// DERIVED ATOMS (COMPUTED STATE)
// =============================================================================

/**
 * Derived atom: Selected race data from races list
 */
export const selectedRaceAtom = atom((get) => {
  const races = get(racesAtom);
  const selectedRound = get(selectedRoundAtom);

  if (!races?.MRData?.RaceTable?.Races) return null;

  return races.MRData.RaceTable.Races.find(
    (race) => parseInt(race.round) === selectedRound,
  );
});

/**
 * Derived atom: Available years from seasons data
 */
export const availableYearsAtom = atom((get) => {
  const seasons = get(seasonsAtom);

  if (!seasons?.MRData?.SeasonTable?.Seasons) return [];

  return seasons.MRData.SeasonTable.Seasons.map((season) =>
    parseInt(season.season),
  ).sort((a, b) => b - a); // Latest first
});

/**
 * Derived atom: Available rounds for selected year
 */
export const availableRoundsAtom = atom((get) => {
  const races = get(racesAtom);

  if (!races?.MRData?.RaceTable?.Races) return [];

  return races.MRData.RaceTable.Races.map((race) => ({
    round: parseInt(race.round),
    name: race.raceName,
    date: race.date,
    circuit: race.Circuit.circuitName,
  }));
});

/**
 * Derived atom: Top 5 drivers from current standings
 */
export const topDriversAtom = atom((get) => {
  const standings = get(currentDriverStandingsAtom);

  if (
    !standings?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
  ) {
    return [];
  }

  return standings.MRData.StandingsTable.StandingsLists[0].DriverStandings.slice(
    0,
    5,
  ).map((standing) => ({
    position: parseInt(standing.position),
    driver: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
    constructor: standing.Constructors[0]?.name || 'N/A',
    points: parseInt(standing.points),
    wins: parseInt(standing.wins),
  }));
});

/**
 * Derived atom: Top 5 constructors from current standings
 */
export const topConstructorsAtom = atom((get) => {
  const standings = get(currentConstructorStandingsAtom);

  if (
    !standings?.MRData?.StandingsTable?.StandingsLists?.[0]
      ?.ConstructorStandings
  ) {
    return [];
  }

  return standings.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.slice(
    0,
    5,
  ).map((standing) => ({
    position: parseInt(standing.position),
    name: standing.Constructor.name,
    nationality: standing.Constructor.nationality,
    points: parseInt(standing.points),
    wins: parseInt(standing.wins),
  }));
});

/**
 * Derived atom: Race calendar for selected year
 */
export const raceCalendarAtom = atom((get) => {
  const races = get(racesAtom);

  if (!races?.MRData?.RaceTable?.Races) return [];

  return races.MRData.RaceTable.Races.map((race) => ({
    round: parseInt(race.round),
    name: race.raceName,
    date: new Date(race.date),
    time: race.time || null,
    circuit: {
      name: race.Circuit.circuitName,
      location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
      coordinates: {
        lat: parseFloat(race.Circuit.Location.lat),
        lng: parseFloat(race.Circuit.Location.long),
      },
    },
  }));
});

/**
 * Derived atom: Overall loading state
 */
export const isLoadingAtom = atom((get) => {
  const loadingStates = get(loadingStatesAtom);
  return Object.values(loadingStates).some((loading) => loading === true);
});

/**
 * Derived atom: Any error state
 */
export const hasErrorAtom = atom((get) => {
  const errorStates = get(errorStatesAtom);
  return Object.values(errorStates).some((error) => error !== null);
});
