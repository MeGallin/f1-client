/**
 * React hooks for F1 API
 * Custom hooks to simplify API interactions within components
 */

import { useState, useEffect, useCallback } from 'react';
import F1API from './api';

/**
 * Custom hook for fetching data from the F1 API
 * @param {Function} apiFn - API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useF1Data = (apiFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data
  const fetchData = useCallback(
    async (useCache = true) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFn(useCache);
        setData(response);
        return response;
      } catch (err) {
        setError(err);
        console.error('Error fetching F1 data:', err);
      } finally {
        setLoading(false);
      }
    },
    [apiFn],
  );

  // Effect to fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  // Refetch function that bypasses cache
  const refetch = useCallback(() => fetchData(false), [fetchData]);

  return { data, loading, error, refetch };
};

/**
 * Hook for seasons data
 */
export const useSeasons = () => {
  return useF1Data(F1API.SeasonsAPI.getAllSeasons);
};

/**
 * Hook for specific season data
 * @param {number} year - Season year
 */
export const useSeason = (year) => {
  return useF1Data(() => F1API.SeasonsAPI.getSeason(year), [year]);
};

/**
 * Hook for current season
 */
export const useCurrentSeason = () => {
  return useF1Data(F1API.SeasonsAPI.getCurrentSeason);
};

/**
 * Hook for races in a specific season
 * @param {number} year - Season year
 */
export const useRaces = (year) => {
  return useF1Data(() => F1API.RacesAPI.getAllRaces(year), [year]);
};

/**
 * Hook for a specific race
 * @param {number} year - Season year
 * @param {number} round - Race round number
 */
export const useRace = (year, round) => {
  return useF1Data(() => F1API.RacesAPI.getRace(year, round), [year, round]);
};

/**
 * Hook for current race
 */
export const useCurrentRace = () => {
  return useF1Data(F1API.RacesAPI.getCurrentRace);
};

/**
 * Hook for next race
 */
export const useNextRace = () => {
  return useF1Data(F1API.RacesAPI.getNextRace);
};

/**
 * Hook for all drivers
 */
export const useDrivers = () => {
  return useF1Data(F1API.DriversAPI.getAllDrivers);
};

/**
 * Hook for drivers in a specific season
 * @param {number} year - Season year
 */
export const useDriversByYear = (year) => {
  return useF1Data(() => F1API.DriversAPI.getDriversByYear(year), [year]);
};

/**
 * Hook for a specific driver
 * @param {string} driverId - Driver ID
 */
export const useDriver = (driverId) => {
  return useF1Data(() => F1API.DriversAPI.getDriver(driverId), [driverId]);
};

/**
 * Hook for a specific driver in a specific year
 * @param {number} year - Season year
 * @param {string} driverId - Driver ID
 */
export const useDriverByYear = (year, driverId) => {
  return useF1Data(
    () => F1API.DriversAPI.getDriverByYear(year, driverId),
    [year, driverId],
  );
};

/**
 * Hook for constructors (teams)
 */
export const useConstructors = () => {
  return useF1Data(F1API.ConstructorsAPI.getAllConstructors);
};

/**
 * Hook for constructors in a specific season
 * @param {number} year - Season year
 */
export const useConstructorsByYear = (year) => {
  return useF1Data(
    () => F1API.ConstructorsAPI.getConstructorsByYear(year),
    [year],
  );
};

/**
 * Hook for a specific constructor
 * @param {string} constructorId - Constructor ID
 */
export const useConstructor = (constructorId) => {
  return useF1Data(
    () => F1API.ConstructorsAPI.getConstructor(constructorId),
    [constructorId],
  );
};

/**
 * Hook for a specific constructor in a specific year
 * @param {number} year - Season year
 * @param {string} constructorId - Constructor ID
 */
export const useConstructorByYear = (year, constructorId) => {
  return useF1Data(
    () => F1API.ConstructorsAPI.getConstructorByYear(year, constructorId),
    [year, constructorId],
  );
};

/**
 * Hook for race results by season
 * @param {number} year - Season year
 */
export const useResultsBySeason = (year) => {
  return useF1Data(() => F1API.ResultsAPI.getResultsBySeason(year), [year]);
};

/**
 * Hook for race results
 * @param {number} year - Season year
 * @param {number} round - Race round number
 */
export const useRaceResults = (year, round) => {
  return useF1Data(
    () => F1API.ResultsAPI.getRaceResults(year, round),
    [year, round],
  );
};

/**
 * Hook for qualifying results
 * @param {number} year - Season year
 * @param {number} round - Race round number
 */
export const useQualifyingResults = (year, round) => {
  return useF1Data(
    () => F1API.ResultsAPI.getQualifyingResults(year, round),
    [year, round],
  );
};

/**
 * Hook for driver standings
 * @param {number} year - Season year
 */
export const useDriverStandings = (year) => {
  return useF1Data(() => F1API.StandingsAPI.getDriverStandings(year), [year]);
};

/**
 * Hook for constructor standings
 * @param {number} year - Season year
 */
export const useConstructorStandings = (year) => {
  return useF1Data(
    () => F1API.StandingsAPI.getConstructorStandings(year),
    [year],
  );
};

/**
 * Hook for current driver standings
 */
export const useCurrentDriverStandings = () => {
  return useF1Data(F1API.StandingsAPI.getCurrentDriverStandings);
};

/**
 * Hook for current constructor standings
 */
export const useCurrentConstructorStandings = () => {
  return useF1Data(F1API.StandingsAPI.getCurrentConstructorStandings);
};

/**
 * Hook for lap times
 * @param {number} year - Season year
 * @param {number} round - Race round number
 */
export const useLapTimes = (year, round) => {
  return useF1Data(() => F1API.LapsAPI.getLapTimes(year, round), [year, round]);
};

/**
 * Hook for circuits in a specific season
 * @param {number} year - Season year
 */
export const useCircuitsByYear = (year) => {
  return useF1Data(() => F1API.CircuitsAPI.getCircuitsByYear(year), [year]);
};

/**
 * Hook for a specific circuit
 * @param {string} circuitId - Circuit ID
 */
export const useCircuit = (circuitId) => {
  return useF1Data(() => F1API.CircuitsAPI.getCircuit(circuitId), [circuitId]);
};

/**
 * Hook for driver lap times
 * @param {number} year - Season year
 * @param {number} round - Race round number
 * @param {string} driverId - Driver ID
 */
export const useDriverLapTimes = (year, round, driverId) => {
  return useF1Data(
    () => F1API.LapsAPI.getDriverLapTimes(year, round, driverId),
    [year, round, driverId],
  );
};

/**
 * Hook for specific lap
 * @param {number} year - Season year
 * @param {number} round - Race round number
 * @param {number} lap - Lap number
 */
export const useSpecificLap = (year, round, lap) => {
  return useF1Data(
    () => F1API.LapsAPI.getSpecificLap(year, round, lap),
    [year, round, lap],
  );
};

/**
 * Hook for pit stops
 * @param {number} year - Season year
 * @param {number} round - Race round number
 */
export const usePitStops = (year, round) => {
  return useF1Data(
    () => F1API.PitStopsAPI.getPitStops(year, round),
    [year, round],
  );
};

/**
 * Hook for driver pit stops
 * @param {number} year - Season year
 * @param {number} round - Race round number
 * @param {string} driverId - Driver ID
 */
export const useDriverPitStops = (year, round, driverId) => {
  return useF1Data(
    () => F1API.PitStopsAPI.getDriverPitStops(year, round, driverId),
    [year, round, driverId],
  );
};

/**
 * Hook for all status codes
 */
export const useAllStatusCodes = () => {
  return useF1Data(F1API.StatusAPI.getAllStatusCodes);
};

/**
 * Hook for all status codes (alias for useAllStatusCodes)
 */
export const useStatusCodes = useAllStatusCodes;

/**
 * Hook for sprint results
 * @param {number} year - Season year
 * @param {number} round - Race round number
 */
export const useSprintResults = (year, round) => {
  return useF1Data(
    () => F1API.SprintAPI.getSprintResults(year, round),
    [year, round],
  );
};

// Export all hooks
export default {
  useF1Data,
  useSeasons,
  useSeason,
  useCurrentSeason,
  useRaces,
  useRace,
  useCurrentRace,
  useNextRace,
  useDrivers,
  useDriversByYear,
  useDriver,
  useDriverByYear,
  useConstructors,
  useConstructorsByYear,
  useConstructor,
  useConstructorByYear,
  useResultsBySeason,
  useRaceResults,
  useQualifyingResults,
  useDriverStandings,
  useConstructorStandings,
  useCurrentDriverStandings,
  useCurrentConstructorStandings,
  useLapTimes,
  usePitStops,
  useSprintResults,
  useCircuitsByYear,
  useCircuit,
  useDriverLapTimes,
  useSpecificLap,
  useDriverPitStops,
  useAllStatusCodes,
  useStatusCodes,
};
