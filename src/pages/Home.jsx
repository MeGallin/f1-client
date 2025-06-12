/**
 * Home Page - Live F1 Dashboard
 *
 * Landing page displaying ALL current F1 information using reusable components
 */

import React, { useEffect } from 'react';
import {
  useF1AppState,
  useCurrentAndNextRace,
  useIsLoading,
  useHasError,
} from '../state';
import { FeatureFlag, useFeatureFlag } from '../components/FeatureFlag';
import { APP_CONFIG, UI_CONFIG } from '../config';

// Import new reusable components
import HeroSection from '../components/HeroSection';
import StatsCards from '../components/StatsCards';
import ChampionshipTables from '../components/ChampionshipTables';
import LatestRaceInfo from '../components/LatestRaceInfo';
import QuickActions from '../components/QuickActions';

const HomePage = () => {
  const {
    currentRace,
    nextRace,
    topDrivers,
    topConstructors,
    setSelectedYear,
  } = useF1AppState();

  const isLoading = useIsLoading();
  const hasError = useHasError();

  // Feature flags
  const showRaceResults = useFeatureFlag('enableRaceResults');
  const showHistoricalData = useFeatureFlag('enableHistoricalData');

  // Initialize with current year data
  useEffect(() => {
    setSelectedYear(new Date().getFullYear());
  }, [setSelectedYear]);

  if (hasError) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">⚠️ Error Loading Data</h4>
          <p>
            Unable to load F1 data. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* F1 Racing Hero Section */}
      <HeroSection />

      <div className="container py-4">
        {/* F1 Racing Quick Stats Cards */}
        <StatsCards
          topDrivers={topDrivers}
          topConstructors={topConstructors}
          currentRace={currentRace}
          nextRace={nextRace}
          isLoading={isLoading}
        />

        {/* F1 Racing Championship Standings */}
        <ChampionshipTables
          topDrivers={topDrivers}
          topConstructors={topConstructors}
        />

        {/* F1 Racing Latest Race Information */}
        <LatestRaceInfo currentRace={currentRace} />

        {/* F1 Racing Quick Actions */}
        <QuickActions />

        {/* Racing Divider */}
        <div className="f1-divider my-5"></div>
      </div>
    </div>
  );
};

export default HomePage;
