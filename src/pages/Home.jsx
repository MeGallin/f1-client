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
      {/* Enhanced F1 Racing Hero Section */}
      <HeroSection />

      {/* Main Content with Enhanced Spacing */}
      <div className="container py-5">
        {/* F1 Racing Quick Stats Cards with Animation */}
        <div
          className="mb-5"
          style={{ animation: 'heroTextSlide 1s ease-out 0.5s both' }}
        >
          <StatsCards
            topDrivers={topDrivers}
            topConstructors={topConstructors}
            currentRace={currentRace}
            nextRace={nextRace}
            isLoading={isLoading}
          />
        </div>

        {/* Enhanced Championship Section */}
        <div
          className="mb-5"
          style={{ animation: 'heroTextSlide 1s ease-out 0.8s both' }}
        >
          {/* Section Header */}
          <div className="text-center mb-4">
            <h2
              className="display-5 fw-bold mb-4"
              style={{
                fontFamily: 'var(--font-racing)',
                color: 'var(--f1-grey-900)',
                letterSpacing: '-1px',
                fontSize: '2.5rem',
                fontWeight: 'var(--fw-black)',
                position: 'relative',
              }}
            >
              Current Season Leaders
              {/* Decorative accent line */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, var(--f1-red), var(--f1-gold))',
                  borderRadius: '2px',
                }}
              ></div>
            </h2>
            <p
              className="lead mb-5"
              style={{
                fontFamily: 'var(--font-primary)',
                maxWidth: '650px',
                margin: '0 auto 3rem auto',
                color: 'var(--f1-grey-700)',
                fontSize: '1.15rem',
                lineHeight: '1.6',
                fontWeight: 'var(--fw-medium)',
              }}
            >
              Follow the championship battle live with up-to-date driver and
              constructor standings
            </p>

            {/* Enhanced horizontal divider */}
            <div
              style={{
                width: '100%',
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent 0%, var(--f1-red-primary) 30%, var(--f1-gold) 50%, var(--f1-red-primary) 70%, transparent 100%)',
                marginBottom: '2.5rem',
                opacity: 0.6,
              }}
            ></div>
          </div>

          {/* Championship Tables with Enhanced Cards */}
          <div className="f1-card-enhanced">
            <ChampionshipTables
              topDrivers={topDrivers}
              topConstructors={topConstructors}
            />
          </div>
        </div>

        {/* Enhanced Quick Actions Section */}
        <div
          className="mb-5"
          style={{ animation: 'heroTextSlide 1s ease-out 1.1s both' }}
        >
          {/* Enhanced Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
