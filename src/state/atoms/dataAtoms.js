/**
 * Data Atoms
 *
 * Atoms for storing F1 data including seasons, races, drivers,
 * constructors, standings, results, and circuits.
 */

import { atom } from 'jotai';

// =============================================================================
// CORE DATA ATOMS
// =============================================================================

/**
 * All seasons data
 */
export const seasonsAtom = atom(null);

/**
 * Current season data
 */
export const currentSeasonAtom = atom(null);

// =============================================================================
// RACE DATA ATOMS
// =============================================================================

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

// =============================================================================
// DRIVER DATA ATOMS
// =============================================================================

/**
 * All drivers data
 */
export const driversAtom = atom(null);

/**
 * Drivers for the selected year
 */
export const driversByYearAtom = atom(null);

/**
 * Selected driver details for specific driver view
 */
export const selectedDriverDetailsAtom = atom(null);

/**
 * Driver-specific lap times data
 */
export const driverLapTimesAtom = atom(null);

/**
 * Driver-specific pit stops data
 */
export const driverPitStopsAtom = atom(null);

// =============================================================================
// CONSTRUCTOR DATA ATOMS
// =============================================================================

/**
 * All constructors data
 */
export const constructorsAtom = atom(null);

/**
 * Constructors for the selected year
 */
export const constructorsByYearAtom = atom(null);

/**
 * Selected constructor details for specific constructor view
 */
export const selectedConstructorDetailsAtom = atom(null);

// =============================================================================
// STANDINGS DATA ATOMS
// =============================================================================

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

// =============================================================================
// RESULTS DATA ATOMS
// =============================================================================

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
 * Results by season data
 */
export const resultsBySeasonAtom = atom(null);

// =============================================================================
// LAP AND TIMING DATA ATOMS
// =============================================================================

/**
 * Lap times for selected race
 */
export const lapTimesAtom = atom(null);

/**
 * Specific lap data for a race
 */
export const specificLapAtom = atom(null);

/**
 * Pit stops for selected race
 */
export const pitStopsAtom = atom(null);

// =============================================================================
// CIRCUIT DATA ATOMS
// =============================================================================

/**
 * All circuits data
 */
export const circuitsAtom = atom(null);

/**
 * Circuits data for the selected year
 */
export const circuitsByYearAtom = atom(null);

/**
 * Selected circuit details for specific circuit view
 */
export const selectedCircuitDetailsAtom = atom(null);

// =============================================================================
// STATUS DATA ATOMS
// =============================================================================

/**
 * All status codes data
 */
export const statusCodesAtom = atom(null);
