/**
 * Custom hook to fetch and process latest race results
 */

import { useState, useEffect } from 'react';
import { F1API } from '../services';

const useLatestRaceResults = (currentRace) => {
  const [latestRaceResults, setLatestRaceResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!currentRace?.MRData?.RaceTable?.Races?.[0]) {
        return;
      }

      try {
        setLoading(true);
        const race = currentRace.MRData.RaceTable.Races[0];
        const year = race.season;
        const round = race.round;

        // Fetch race results
        const resultsData = await F1API.ResultsAPI.getRaceResults(year, round);
        setLatestRaceResults(resultsData);
      } catch (err) {
        console.error('Error fetching latest race results:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [currentRace]);
  // Get the top 3 finishers if results are available
  const getTop3Finishers = () => {
    if (!latestRaceResults?.MRData?.RaceTable?.Races?.[0]?.Results) {
      return [];
    }

    try {
      const results = latestRaceResults.MRData.RaceTable.Races[0].Results;

      // Make sure we have results
      if (!Array.isArray(results) || results.length === 0) {
        return [];
      }

      // Sort by position to ensure correct order
      const sortedResults = [...results].sort(
        (a, b) => parseInt(a.position) - parseInt(b.position),
      );

      return sortedResults
        .filter((result) => parseInt(result.position) <= 3)
        .map((result) => ({
          position: result.position,
          driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
          constructor: result.Constructor.name,
          time: result.Time?.time || 'DNF',
        }));
    } catch (err) {
      console.error('Error processing race results:', err);
      return [];
    }
  };
  return {
    latestRaceResults,
    loading,
    error,
    getTop3Finishers,
  };
};

export default useLatestRaceResults;
