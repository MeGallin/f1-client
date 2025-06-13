/**
 * History Page - F1 Historical Data Browser
 *
 * Comprehensive history browser with:
 * - Season selector and browser
 * - Past race results and detailed views
   }; championship data
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
import HistoryHeader from '../components/HistoryHeader';
import SeasonControls from '../components/SeasonControls';
import TopDriversCard from '../components/TopDriversCard';
import TopConstructorsCard from '../components/TopConstructorsCard';
import DriversTable from '../components/DriversTable';
import ConstructorsTable from '../components/ConstructorsTable';
import RacesView from '../components/RacesView';
import LoadingState from '../components/LoadingState';
import QuickNavigation from '../components/QuickNavigation';

const HistoryPage = () => {
  const { season, round } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedYear, setSelectedYear, currentRace } = useF1AppState();
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
  }, [season]); // Removed selectedSeason to prevent infinite loop

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
  ); // Handle season change
  const handleSeasonChange = (newSeason) => {
    // If it's the same season, still force a refresh of the data
    // This helps when the "Current Season" button is clicked
    if (newSeason === selectedSeason) {
      // Set loading states to show refresh is happening
      setLoadingDrivers(true);
      setLoadingConstructors(true);
      setLoadingOverview(true);

      // Force a refresh by re-fetching the data
      const year = parseInt(newSeason);

      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setLoadingDrivers(false);
        setLoadingConstructors(false);
        setLoadingOverview(false);
      }, 30000); // 30 second timeout

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
      return; // Don't change the season or navigate if it's the same
    }

    // Immediately show loading states for better UX
    setLoadingDrivers(true);
    setLoadingConstructors(true);
    setLoadingOverview(true);

    setSelectedSeason(newSeason);
    setSelectedYear(parseInt(newSeason));
    navigate(`/history/${newSeason}`);
  }; // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);

    // Navigate to the correct URL based on mode
    if (mode === 'overview') {
      navigate(`/history/${selectedSeason}`);
    } else if (mode === 'drivers') {
      navigate(`/history/${selectedSeason}/drivers`);
    } else if (mode === 'constructors') {
      navigate(`/history/${selectedSeason}/constructors`);
    } else if (mode === 'races') {
      navigate(`/history/${selectedSeason}/races`);
    }
  }; // Initialize with URL params or current season
  useEffect(() => {
    if (season && season !== selectedSeason) {
      setSelectedSeason(season);
      setSelectedYear(parseInt(season));
    }
  }, [season]); // Only depend on season, not selectedSeason to avoid loops
  // Fetch historical data when selectedSeason changes
  useEffect(() => {
    if (selectedSeason) {
      const year = parseInt(selectedSeason);
      let isCancelled = false; // To handle component unmount or race conditions

      // Set loading states
      setLoadingDrivers(true);
      setLoadingConstructors(true);
      setLoadingOverview(true);

      // Clear any previous data to show loading immediately
      // This ensures the UI reflects the loading state properly

      // Set a timeout to prevent infinite loading (30 seconds)
      const timeoutId = setTimeout(() => {
        if (!isCancelled) {
          setLoadingDrivers(false);
          setLoadingConstructors(false);
          setLoadingOverview(false);
        }
      }, 30000); // 30 second timeout

      // Fetch driver and constructor standings for the selected year
      const fetchData = async () => {
        try {
          // Fetch both in parallel
          const [driverResults, constructorResults] = await Promise.all([
            fetchDriverStandings(year),
            fetchConstructorStandings(year),
          ]);

          // Clear the timeout since we completed successfully
          clearTimeout(timeoutId);

          // Only update state if the effect hasn't been cancelled
          if (!isCancelled) {
            // Add a small delay to ensure data has propagated
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

          // Clear the timeout since we completed (with error)
          clearTimeout(timeoutId);

          // Only update state if the effect hasn't been cancelled
          if (!isCancelled) {
            setLoadingDrivers(false);
            setLoadingConstructors(false);
            setLoadingOverview(false);
          }
        }
      };

      fetchData();

      // Cleanup function to prevent state updates if component unmounts
      // or if a new effect is triggered
      return () => {
        isCancelled = true;
        clearTimeout(timeoutId);
      };
    }
  }, [selectedSeason, fetchDriverStandings, fetchConstructorStandings]); // Determine current view from URL
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    // pathSegments = ['', 'history', 'season', 'mode/round']

    if (pathSegments.length >= 4) {
      const lastSegment = pathSegments[3];

      // Check if the last segment is a specific mode
      if (lastSegment === 'drivers') {
        setViewMode('drivers');
      } else if (lastSegment === 'constructors') {
        setViewMode('constructors');
      } else if (lastSegment === 'races') {
        setViewMode('races');
      } else {
        // If it's a number (round), show races view
        if (/^\d+$/.test(lastSegment)) {
          setViewMode('races');
        } else {
          setViewMode('overview');
        }
      }
    } else {
      // Default to overview for /history or /history/:season
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
      <HistoryHeader season={season} round={round} />

      <div className="container py-4">
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

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <TopDriversCard
                    selectedSeason={selectedSeason}
                    loadingDrivers={loadingDrivers}
                    topDrivers={topDrivers}
                    onViewModeChange={handleViewModeChange}
                  />
                </div>

                <div className="col-lg-6 mb-4">
                  <TopConstructorsCard
                    selectedSeason={selectedSeason}
                    loadingConstructors={loadingConstructors}
                    topConstructors={topConstructors}
                    onViewModeChange={handleViewModeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drivers Mode */}
        {viewMode === 'drivers' && (
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
        )}

        {/* Constructors Mode */}
        {viewMode === 'constructors' && (
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
        )}

        {/* Races Mode */}
        {viewMode === 'races' && <RacesView selectedSeason={selectedSeason} />}

        {/* Loading State */}
        {isLoading && <LoadingState selectedSeason={selectedSeason} />}

        {/* Quick Navigation */}
        <QuickNavigation
          selectedSeason={selectedSeason}
          currentYear={currentYear}
          onSeasonChange={handleSeasonChange}
        />
      </div>

      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default HistoryPage;
