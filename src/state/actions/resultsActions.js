/**
 * Results Actions
 *
 * Action atoms for managing race results, qualifying, and sprint data.
 */

import { atom } from 'jotai';
import { F1API } from '../../services';
import {
  raceResultsAtom,
  qualifyingResultsAtom,
  sprintResultsAtom,
  resultsBySeasonAtom,
  lapTimesAtom,
  specificLapAtom,
  pitStopsAtom,
} from '../atoms/dataAtoms';
import { selectedYearAtom, selectedRoundAtom } from '../atoms/configAtoms';
import { handleApiCall } from './actionUtils';

// =============================================================================
// RESULTS ACTIONS
// =============================================================================

/**
 * Fetch race results for a specific season
 */
export const fetchResultsBySeasonAtom = atom(
  null,
  async (get, set, year = null) => {
    const selectedYear = year || get(selectedYearAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.ResultsAPI.getResultsBySeason(selectedYear),
      resultsBySeasonAtom,
    );
  },
);

/**
 * Fetch race results
 */
export const fetchRaceResultsAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.ResultsAPI.getRaceResults(selectedYear, selectedRound),
      raceResultsAtom,
    );
  },
);

/**
 * Fetch qualifying results
 */
export const fetchQualifyingResultsAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.ResultsAPI.getQualifyingResults(selectedYear, selectedRound),
      qualifyingResultsAtom,
    );
  },
);

/**
 * Fetch sprint results
 */
export const fetchSprintResultsAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.SprintAPI.getSprintResults(selectedYear, selectedRound),
      sprintResultsAtom,
    );
  },
);

// =============================================================================
// LAP DATA ACTIONS
// =============================================================================

/**
 * Fetch lap times
 */
export const fetchLapTimesAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.LapsAPI.getLapTimes(selectedYear, selectedRound),
      lapTimesAtom,
    );
  },
);

/**
 * Fetch specific lap times
 */
export const fetchSpecificLapAtom = atom(
  null,
  async (get, set, { year = null, round = null, lap } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.LapsAPI.getSpecificLap(selectedYear, selectedRound, lap),
      specificLapAtom,
    );
  },
);

// =============================================================================
// PIT STOP ACTIONS
// =============================================================================

/**
 * Fetch pit stops
 */
export const fetchPitStopsAtom = atom(
  null,
  async (get, set, { year = null, round = null } = {}) => {
    const selectedYear = year || get(selectedYearAtom);
    const selectedRound = round || get(selectedRoundAtom);

    return handleApiCall(
      set,
      'results',
      () => F1API.PitStopsAPI.getPitStops(selectedYear, selectedRound),
      pitStopsAtom,
    );
  },
);
