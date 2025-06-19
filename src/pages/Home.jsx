/**
 * Home Page - F1 Dashboard
 *
 * Landing page displaying ALL current F1 information using reusable components
 */

import React, { useEffect } from 'react';
import { useF1AppState, useIsLoading, useHasError } from '../state';
import HeroSection from '../components/HeroSection';
import StatsCards from '../components/StatsCards';
import ChampionshipTables from '../components/ChampionshipTables';
import QuickActions from '../components/QuickActions';
import './Home.css'; // Import the new styles

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
      <HeroSection />

      <div className="container py-5">
        <div className="home-section">
          <StatsCards
            topDrivers={topDrivers}
            topConstructors={topConstructors}
            currentRace={currentRace}
            nextRace={nextRace}
            isLoading={isLoading}
          />
        </div>

        <div className="home-section">
          <div className="section-header">
            <h2 className="section-title">Current Season Leaders</h2>
            <p className="section-subtitle">
              Follow the championship battle with current driver and constructor
              standings.
            </p>
          </div>
          <div className="championship-tables-container">
            <ChampionshipTables
              topDrivers={topDrivers}
              topConstructors={topConstructors}
            />
          </div>
        </div>

        <div className="home-section">
          <div className="quick-actions-container">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
