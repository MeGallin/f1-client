/**
 * History Page - F1 Historical Data Browser
 *
 * Comprehensive history browser with:
 * - Season selector and browser
 * - Past race results and detailed views
 * - Championship data
 * - Advanced filtering and statistics
 * - Sub-routes for specific seasons/rounds
 */

import React, { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  Link,
  Outlet,
  useLocation,
} from 'react-router-dom';
import {
  useF1AppState,
  useIsLoading,
  useHasError,
  useHistoricalStandings,
} from '../state';

// Import all the components we created
import HeroSection from '../components/HeroSection';
import SeasonControls from '../components/SeasonControls';
import TopDriversCard from '../components/TopDriversCard';
import TopConstructorsCard from '../components/TopConstructorsCard';
import DriversTable from '../components/DriversTable';
import ConstructorsTable from '../components/ConstructorsTable';
import RacesView from '../components/RacesView';
import LoadingState from '../components/LoadingState';
import QuickNavigation from '../components/QuickNavigation';
import './History.css'; // Import the new styles

const HistoryPage = () => {
  const { season, round } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedYear } = useF1AppState();
  const {
    topDrivers,
    topConstructors,
    fetchDriverStandings,
    fetchConstructorStandings,
  } = useHistoricalStandings();

  const isLoading = useIsLoading();
  const hasError = useHasError();

  // Local state for filtering and UI
  const [selectedSeason, setSelectedSeason] = useState(
    season || new Date().getFullYear().toString(),
  );
  const [viewMode, setViewMode] = useState('overview'); // overview, drivers, constructors, races
  const [sortBy, setSortBy] = useState('position');
  const [sortOrder, setSortOrder] = useState('asc');
  // Loading states for individual components
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingConstructors, setLoadingConstructors] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Update selected season from URL params
  useEffect(() => {
    if (season && season !== selectedSeason) {
      setSelectedSeason(season);
    }
  }, [season]);

  // Sorting function for drivers
  const sortDrivers = (drivers, sortBy, sortOrder) => {
    if (!drivers || drivers.length === 0) return [];

    return [...drivers].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'position':
          aVal = parseInt(a.position);
          bVal = parseInt(b.position);
          break;
        case 'points':
          aVal = parseInt(a.points);
          bVal = parseInt(b.points);
          break;
        case 'wins':
          aVal = parseInt(a.wins);
          bVal = parseInt(b.wins);
          break;
        case 'driver':
          aVal = a.driver.toLowerCase();
          bVal = b.driver.toLowerCase();
          break;
        default:
          aVal = parseInt(a.position);
          bVal = parseInt(b.position);
      }

      if (sortBy === 'driver') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });
  };

  // Sorting function for constructors
  const sortConstructors = (constructors, sortBy, sortOrder) => {
    if (!constructors || constructors.length === 0) return [];

    return [...constructors].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'position':
          aVal = parseInt(a.position);
          bVal = parseInt(b.position);
          break;
        case 'points':
          aVal = parseInt(a.points);
          bVal = parseInt(b.points);
          break;
        case 'wins':
          aVal = parseInt(a.wins);
          bVal = parseInt(b.wins);
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        default:
          aVal = parseInt(a.position);
          bVal = parseInt(b.position);
      }

      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });
  };
  // Get sorted data
  const sortedDrivers = sortDrivers(topDrivers, sortBy, sortOrder);
  const sortedConstructors = sortConstructors(
    topConstructors,
    sortBy,
    sortOrder,
  );

  // Handle sort change and toggle order
  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Change column and reset to ascending
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Available seasons (last 25 years of F1)
  const currentYear = new Date().getFullYear();
  const availableSeasons = Array.from(
    { length: 25 },
    (_, i) => currentYear - i,
  );

  const handleSeasonChange = (newSeason) => {
    if (newSeason === selectedSeason) {
      setLoadingDrivers(true);
      setLoadingConstructors(true);
      setLoadingOverview(true);

      const year = parseInt(newSeason);
      const timeoutId = setTimeout(() => {
        setLoadingDrivers(false);
        setLoadingConstructors(false);
        setLoadingOverview(false);
      }, 30000);

      const fetchData = async () => {
        try {
          await Promise.all([
            fetchDriverStandings(year),
            fetchConstructorStandings(year),
          ]);
          clearTimeout(timeoutId);
          setLoadingDrivers(false);
          setLoadingConstructors(false);
          setLoadingOverview(false);
        } catch (error) {
          console.error('Error refreshing data:', error);
          clearTimeout(timeoutId);
          setLoadingDrivers(false);
          setLoadingConstructors(false);
          setLoadingOverview(false);
        }
      };
      fetchData();
      return;
    }

    setLoadingDrivers(true);
    setLoadingConstructors(true);
    setLoadingOverview(true);
    setSelectedSeason(newSeason);
    setSelectedYear(parseInt(newSeason));
    navigate(`/history/${newSeason}`);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    navigate(`/history/${selectedSeason}/${mode}`);
  };

  useEffect(() => {
    if (season && season !== selectedSeason) {
      setSelectedSeason(season);
      setSelectedYear(parseInt(season));
    }
  }, [season, selectedSeason, setSelectedYear]);

  useEffect(() => {
    if (selectedSeason) {
      const year = parseInt(selectedSeason);
      let isCancelled = false;

      setLoadingDrivers(true);
      setLoadingConstructors(true);
      setLoadingOverview(true);

      const timeoutId = setTimeout(() => {
        if (!isCancelled) {
          setLoadingDrivers(false);
          setLoadingConstructors(false);
          setLoadingOverview(false);
        }
      }, 30000);

      const fetchData = async () => {
        try {
          await Promise.all([
            fetchDriverStandings(year),
            fetchConstructorStandings(year),
          ]);
          clearTimeout(timeoutId);
          if (!isCancelled) {
            setTimeout(() => {
              if (!isCancelled) {
                setLoadingDrivers(false);
                setLoadingConstructors(false);
                setLoadingOverview(false);
              }
            }, 100);
          }
        } catch (error) {
          console.error('Error fetching historical data:', error);
          clearTimeout(timeoutId);
          if (!isCancelled) {
            setLoadingDrivers(false);
            setLoadingConstructors(false);
            setLoadingOverview(false);
          }
        }
      };
      fetchData();

      return () => {
        isCancelled = true;
        clearTimeout(timeoutId);
      };
    }
  }, [selectedSeason, fetchDriverStandings, fetchConstructorStandings]);

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    if (pathSegments.length >= 4) {
      const lastSegment = pathSegments[3];
      if (['drivers', 'constructors', 'races'].includes(lastSegment)) {
        setViewMode(lastSegment);
      } else {
        setViewMode('overview');
      }
    } else {
      setViewMode('overview');
    }
  }, [location.pathname]);

  if (hasError) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">⚠️ Error Loading Historical Data</h4>
          <p>
            Unable to load F1 historical data. Please check your connection and
            try again.
          </p>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home me-1"></i>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <HeroSection
        title="F1 Historical Data"
        subtitle="Explore past seasons, race results, and championship data"
      />

      <div className="container py-4">
        <div className="season-controls">
          <SeasonControls
            selectedSeason={selectedSeason}
            availableSeasons={availableSeasons}
            currentYear={currentYear}
            viewMode={viewMode}
            loadingDrivers={loadingDrivers}
            loadingConstructors={loadingConstructors}
            loadingOverview={loadingOverview}
            onSeasonChange={handleSeasonChange}
            onViewModeChange={handleViewModeChange}
          />
        </div>

        {viewMode === 'overview' && (
          <div className="view-mode-cards">
            <TopDriversCard
              selectedSeason={selectedSeason}
              loadingDrivers={loadingDrivers}
              topDrivers={topDrivers}
              onViewModeChange={handleViewModeChange}
            />
            <TopConstructorsCard
              selectedSeason={selectedSeason}
              loadingConstructors={loadingConstructors}
              topConstructors={topConstructors}
              onViewModeChange={handleViewModeChange}
            />
          </div>
        )}

        {viewMode === 'drivers' && (
          <div className="table-container">
            <DriversTable
              selectedSeason={selectedSeason}
              loadingDrivers={loadingDrivers}
              topDrivers={topDrivers}
              sortBy={sortBy}
              sortOrder={sortOrder}
              sortedDrivers={sortedDrivers}
              onSortChange={handleSortChange}
              onSortOrderChange={() =>
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }
            />
          </div>
        )}

        {viewMode === 'constructors' && (
          <div className="table-container">
            <ConstructorsTable
              selectedSeason={selectedSeason}
              loadingConstructors={loadingConstructors}
              topConstructors={topConstructors}
              sortBy={sortBy}
              sortOrder={sortOrder}
              sortedConstructors={sortedConstructors}
              onSortChange={handleSortChange}
              onSortOrderChange={() =>
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }
            />
          </div>
        )}

        {viewMode === 'races' && (
          <div className="table-container">
            <RacesView selectedSeason={selectedSeason} />
          </div>
        )}

        {isLoading && <LoadingState selectedSeason={selectedSeason} />}
      </div>

      <Outlet />
    </div>
  );
};

export default HistoryPage;
