/**
 * History Page - F1 Historical Data Browser
 *
 * Comprehensive history browser with:
 * - Season selector and browser
 * - Past race results and detailed views
 * - Historical championship data
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
import OverviewStats from '../components/OverviewStats';
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
  // Debug current state (reduced logging)
  useEffect(() => {
    console.log('🏎️ History Page State Update:', {
      selectedSeason,
      viewMode,
      pathname: location.pathname,
    });
  }, [selectedSeason, viewMode, location.pathname]);

  // Available seasons (last 25 years of F1)
  const currentYear = new Date().getFullYear();
  const availableSeasons = Array.from(
    { length: 25 },
    (_, i) => currentYear - i,
  ); // Handle season change
  const handleSeasonChange = (newSeason) => {
    console.log(
      '📅 Changing season to:',
      newSeason,
      'from current:',
      selectedSeason,
    );

    // Immediately show loading states for better UX
    setLoadingDrivers(true);
    setLoadingConstructors(true);
    setLoadingOverview(true);

    setSelectedSeason(newSeason);
    setSelectedYear(parseInt(newSeason));
    navigate(`/history/${newSeason}`);
  }; // Handle view mode change
  const handleViewModeChange = (mode) => {
    console.log('🔄 Changing view mode to:', mode, 'from current:', viewMode);
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
    console.log('🏁 Season Effect triggered:', { season, selectedSeason });

    if (season && season !== selectedSeason) {
      console.log('📅 Updating season state from URL:', season);
      setSelectedSeason(season);
      setSelectedYear(parseInt(season));
    }
  }, [season]); // Only depend on season, not selectedSeason to avoid loops
  // Fetch historical data when selectedSeason changes
  useEffect(() => {
    console.log('📊 Fetching data for season:', selectedSeason);

    if (selectedSeason) {
      const year = parseInt(selectedSeason);

      // Set loading states
      setLoadingDrivers(true);
      setLoadingConstructors(true);
      setLoadingOverview(true);

      // Fetch driver and constructor standings for the selected year
      Promise.all([fetchDriverStandings(year), fetchConstructorStandings(year)])
        .then(() => {
          // Clear loading states after both requests complete
          setLoadingDrivers(false);
          setLoadingConstructors(false);
          setLoadingOverview(false);
        })
        .catch((error) => {
          console.error('Error fetching historical data:', error);
          setLoadingDrivers(false);
          setLoadingConstructors(false);
          setLoadingOverview(false);
        });
    }
  }, [selectedSeason, fetchDriverStandings, fetchConstructorStandings]); // Determine current view from URL
  useEffect(() => {
    console.log('🔍 URL Effect triggered:', {
      pathname: location.pathname,
      round,
      pathSegments: location.pathname.split('/'),
    });

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
            <OverviewStats
              selectedSeason={selectedSeason}
              loadingOverview={loadingOverview}
              topDrivers={topDrivers}
              topConstructors={topConstructors}
              currentRace={currentRace}
            />

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

        {/* Racing Divider */}
        <div className="f1-divider my-5"></div>

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
