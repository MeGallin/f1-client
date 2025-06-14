/**
 * Derived Atoms
 *
 * Computed state atoms that derive their values from other atoms.
 * These provide convenient computed values for components.
 */

import { atom } from 'jotai';
import { selectedYearAtom, selectedRoundAtom } from './configAtoms';
import {
  seasonsAtom,
  racesAtom,
  currentDriverStandingsAtom,
  currentConstructorStandingsAtom,
  driverStandingsAtom,
  constructorStandingsAtom,
} from './dataAtoms';

// =============================================================================
// SELECTION DERIVED ATOMS
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

// =============================================================================
// STANDINGS DERIVED ATOMS
// =============================================================================

/**
 * Derived atom: All drivers from current standings
 */
export const topDriversAtom = atom((get) => {
  const standings = get(currentDriverStandingsAtom);

  if (
    !standings?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
  ) {
    return [];
  }

  return standings.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(
    (standing) => ({
      position: parseInt(standing.position),
      driver: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
      constructor: standing.Constructors[0]?.name || 'N/A',
      points: parseInt(standing.points),
      wins: parseInt(standing.wins),
    }),
  );
});

/**
 * Derived atom: All constructors from current standings
 */
export const topConstructorsAtom = atom((get) => {
  const standings = get(currentConstructorStandingsAtom);

  if (
    !standings?.MRData?.StandingsTable?.StandingsLists?.[0]
      ?.ConstructorStandings
  ) {
    return [];
  }

  return standings.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(
    (standing) => ({
      position: parseInt(standing.position),
      name: standing.Constructor.name,
      nationality: standing.Constructor.nationality,
      points: parseInt(standing.points),
      wins: parseInt(standing.wins),
    }),
  );
});

/**
 * Derived atom: Top 5 drivers from historical standings (for History page)
 */
export const historicalTopDriversAtom = atom((get) => {
  const standings = get(driverStandingsAtom);

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
 * Derived atom: Top 5 constructors from historical standings (for History page)
 */
export const historicalTopConstructorsAtom = atom((get) => {
  const standings = get(constructorStandingsAtom);

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
