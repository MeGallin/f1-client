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
      {/* Header Section */}
      <section className="bg-primary text-white py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">
                      <i className="fas fa-home"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-white">History</li>
                  {season && (
                    <li className="breadcrumb-item active text-white">
                      {season}
                    </li>
                  )}
                  {round && (
                    <li className="breadcrumb-item active text-white">
                      Round {round}
                    </li>
                  )}
                </ol>
              </nav>
              <h1 className="h2 mb-0">
                <i className="fas fa-history me-2"></i>
                F1 Historical Data Browser
              </h1>
              <p className="mb-0 opacity-75">
                Explore past seasons, race results, and championship data
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="badge bg-warning text-dark fs-6 px-3 py-2">
                <i className="fas fa-database me-2"></i>
                ARCHIVE DATA
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        {/* Controls and Filters */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                {' '}
                <h6 className="card-title mb-3">
                  <i className="fas fa-filter me-2"></i>
                  Season Selection
                  {(loadingDrivers ||
                    loadingConstructors ||
                    loadingOverview) && (
                    <div
                      className="spinner-border spinner-border-sm ms-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </h6>
                <div className="row g-2">
                  <div className="col-8">
                    {' '}
                    <select
                      className="form-select"
                      value={selectedSeason}
                      onChange={(e) => handleSeasonChange(e.target.value)}
                      disabled={
                        loadingDrivers || loadingConstructors || loadingOverview
                      }
                    >
                      {availableSeasons.map((year) => (
                        <option key={year} value={year}>
                          {year} Season
                        </option>
                      ))}
                    </select>
                  </div>{' '}
                  <div className="col-4">
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => handleSeasonChange(currentYear.toString())}
                    >
                      <i className="fas fa-calendar-day me-1"></i>
                      Current Season
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title mb-3">
                  <i className="fas fa-eye me-2"></i>
                  View Mode
                </h6>{' '}
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${
                      viewMode === 'overview'
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    }`}
                    onClick={() => handleViewModeChange('overview')}
                    disabled={loadingOverview}
                  >
                    <i className="fas fa-chart-pie me-1"></i>
                    Overview
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      viewMode === 'drivers'
                        ? 'btn-success'
                        : 'btn-outline-success'
                    }`}
                    onClick={() => handleViewModeChange('drivers')}
                    disabled={loadingDrivers}
                  >
                    <i className="fas fa-user me-1"></i>
                    Drivers
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      viewMode === 'constructors'
                        ? 'btn-danger'
                        : 'btn-outline-danger'
                    }`}
                    onClick={() => handleViewModeChange('constructors')}
                    disabled={loadingConstructors}
                  >
                    <i className="fas fa-car me-1"></i>
                    Teams
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      viewMode === 'races'
                        ? 'btn-warning'
                        : 'btn-outline-warning'
                    }`}
                    onClick={() => handleViewModeChange('races')}
                  >
                    <i className="fas fa-flag me-1"></i>
                    Races
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="row">
            {/* Season Stats Cards */}
            <div className="col-12 mb-4">
              <div className="row g-3">
                {' '}
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-trophy fa-2x mb-2"></i>
                      <h5>Champion</h5>
                      {loadingOverview ? (
                        <div>
                          <div
                            className="spinner-border spinner-border-sm mb-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <h4 className="mb-0">Loading...</h4>
                          <small>Loading points...</small>
                        </div>
                      ) : (
                        <div>
                          <h4 className="mb-0">
                            {topDrivers?.[0]?.driver || 'Loading...'}
                          </h4>
                          <small>{topDrivers?.[0]?.points || 0} points</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-car fa-2x mb-2"></i>
                      <h5>Constructor</h5>
                      {loadingOverview ? (
                        <div>
                          <div
                            className="spinner-border spinner-border-sm mb-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <h4 className="mb-0">Loading...</h4>
                          <small>Loading points...</small>
                        </div>
                      ) : (
                        <div>
                          <h4 className="mb-0">
                            {topConstructors?.[0]?.name || 'Loading...'}
                          </h4>
                          <small>
                            {topConstructors?.[0]?.points || 0} points
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning text-dark">
                    <div className="card-body text-center">
                      <i className="fas fa-flag-checkered fa-2x mb-2"></i>
                      <h5>Total Races</h5>
                      <h4 className="mb-0">
                        {currentRace?.MRData?.total || '0'}
                      </h4>
                      <small>Completed</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-calendar fa-2x mb-2"></i>
                      <h5>Season</h5>
                      <h4 className="mb-0">{selectedSeason}</h4>
                      <small>Formula 1</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 Summary */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-podium me-2"></i>
                    Top 3 Drivers - {selectedSeason}
                  </h5>
                </div>{' '}
                <div className="card-body">
                  {loadingDrivers ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-success mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h6>Loading Top 3 Drivers...</h6>
                      <p className="text-muted mb-0">
                        Fetching {selectedSeason} championship data
                      </p>
                    </div>
                  ) : topDrivers && topDrivers.length >= 3 ? (
                    <>
                      {topDrivers.slice(0, 3).map((driver, index) => {
                        const medals = ['🥇', '🥈', '🥉'];
                        const colors = [
                          'text-warning',
                          'text-secondary',
                          'text-warning',
                        ];
                        return (
                          <div
                            key={driver.position}
                            className="d-flex align-items-center mb-3"
                          >
                            <div className="me-3">
                              <span className="fs-2">{medals[index]}</span>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-bold">{driver.driver}</h6>
                              <small className="text-muted">
                                {driver.constructor}
                              </small>
                            </div>
                            <div className="text-end">
                              <div className={`fw-bold ${colors[index]}`}>
                                {driver.points} pts
                              </div>
                              <small className="text-muted">
                                {driver.wins} wins
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Loading championship data...
                    </div>
                  )}
                </div>{' '}
                <div className="card-footer">
                  <button
                    className="btn btn-success btn-sm w-100"
                    onClick={() => handleViewModeChange('drivers')}
                    disabled={loadingDrivers}
                  >
                    {loadingDrivers ? (
                      <>
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-list me-1"></i>
                        View Full Driver Standings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-danger text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-building me-2"></i>
                    Top 3 Constructors - {selectedSeason}
                  </h5>
                </div>{' '}
                <div className="card-body">
                  {loadingConstructors ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-danger mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h6>Loading Top 3 Constructors...</h6>
                      <p className="text-muted mb-0">
                        Fetching {selectedSeason} championship data
                      </p>
                    </div>
                  ) : topConstructors && topConstructors.length >= 3 ? (
                    <>
                      {topConstructors.slice(0, 3).map((constructor, index) => {
                        const medals = ['🥇', '🥈', '🥉'];
                        const colors = [
                          'text-warning',
                          'text-secondary',
                          'text-warning',
                        ];
                        return (
                          <div
                            key={constructor.position}
                            className="d-flex align-items-center mb-3"
                          >
                            <div className="me-3">
                              <span className="fs-2">{medals[index]}</span>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-bold">
                                {constructor.name}
                              </h6>
                              <small className="text-muted">
                                {constructor.nationality}
                              </small>
                            </div>
                            <div className="text-end">
                              <div className={`fw-bold ${colors[index]}`}>
                                {constructor.points} pts
                              </div>
                              <small className="text-muted">
                                {constructor.wins} wins
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Loading constructor data...
                    </div>
                  )}
                </div>{' '}
                <div className="card-footer">
                  <button
                    className="btn btn-danger btn-sm w-100"
                    onClick={() => handleViewModeChange('constructors')}
                    disabled={loadingConstructors}
                  >
                    {loadingConstructors ? (
                      <>
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-list me-1"></i>
                        View Full Constructor Standings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drivers Mode */}
        {viewMode === 'drivers' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-trophy me-2"></i>
                    Driver Championship - {selectedSeason}
                  </h5>{' '}
                  <div>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-select form-select-sm bg-success border-0 text-white me-2"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        <option value="position">Sort by Position</option>
                        <option value="points">Sort by Points</option>
                        <option value="wins">Sort by Wins</option>
                        <option value="driver">Sort by Name</option>
                      </select>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() =>
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                        }
                        title={`Sort ${
                          sortOrder === 'asc' ? 'Descending' : 'Ascending'
                        }`}
                      >
                        <i
                          className={`fas fa-sort-${
                            sortOrder === 'asc' ? 'up' : 'down'
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>{' '}
                <div className="card-body p-0">
                  {loadingDrivers ? (
                    <div className="p-4 text-center">
                      <div
                        className="spinner-border text-success mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h6>Loading Driver Championship</h6>
                      <p className="text-muted mb-0">
                        Fetching {selectedSeason} driver standings...
                      </p>
                    </div>
                  ) : topDrivers && topDrivers.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        {' '}
                        <thead className="table-success">
                          <tr>
                            <th
                              className="text-center user-select-none"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSortChange('position')}
                            >
                              #{' '}
                              {sortBy === 'position' && (
                                <i
                                  className={`fas fa-sort-${
                                    sortOrder === 'asc' ? 'up' : 'down'
                                  } ms-1`}
                                ></i>
                              )}
                            </th>
                            <th
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSortChange('driver')}
                            >
                              Driver{' '}
                              {sortBy === 'driver' && (
                                <i
                                  className={`fas fa-sort-${
                                    sortOrder === 'asc' ? 'up' : 'down'
                                  } ms-1`}
                                ></i>
                              )}
                            </th>
                            <th>Constructor</th>
                            <th
                              className="text-center"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSortChange('points')}
                            >
                              Points{' '}
                              {sortBy === 'points' && (
                                <i
                                  className={`fas fa-sort-${
                                    sortOrder === 'asc' ? 'up' : 'down'
                                  } ms-1`}
                                ></i>
                              )}
                            </th>{' '}
                            <th
                              className="text-center"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSortChange('wins')}
                            >
                              Wins{' '}
                              {sortBy === 'wins' && (
                                <i
                                  className={`fas fa-sort-${
                                    sortOrder === 'asc' ? 'up' : 'down'
                                  } ms-1`}
                                ></i>
                              )}
                            </th>
                            <th className="text-center">Podiums</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedDrivers.map((driver, index) => (
                            <tr
                              key={driver.position}
                              className={index < 3 ? 'table-warning' : ''}
                            >
                              <td className="text-center fw-bold">
                                {index < 3 && (
                                  <i className="fas fa-medal text-warning me-1"></i>
                                )}
                                {driver.position}
                              </td>
                              <td className="fw-semibold">{driver.driver}</td>
                              <td className="text-muted">
                                {driver.constructor}
                              </td>
                              <td className="text-center fw-bold">
                                {driver.points}
                              </td>
                              <td className="text-center">{driver.wins}</td>{' '}
                              <td className="text-center">
                                {driver.podiums || '0'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted">
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Loading driver standings for {selectedSeason}...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Constructors Mode */}
        {viewMode === 'constructors' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-car me-2"></i>
                    Constructor Championship - {selectedSeason}
                  </h5>{' '}
                  <div>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-select form-select-sm bg-danger border-0 text-white me-2"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        <option value="position">Sort by Position</option>
                        <option value="points">Sort by Points</option>
                        <option value="wins">Sort by Wins</option>
                        <option value="name">Sort by Name</option>
                      </select>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() =>
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                        }
                        title={`Sort ${
                          sortOrder === 'asc' ? 'Descending' : 'Ascending'
                        }`}
                      >
                        <i
                          className={`fas fa-sort-${
                            sortOrder === 'asc' ? 'up' : 'down'
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>{' '}
                <div className="card-body p-0">
                  {loadingConstructors ? (
                    <div className="p-4 text-center">
                      <div
                        className="spinner-border text-danger mb-3"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h6>Loading Constructor Championship</h6>
                      <p className="text-muted mb-0">
                        Fetching {selectedSeason} constructor standings...
                      </p>
                    </div>
                  ) : topConstructors && topConstructors.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        {' '}
                        <thead className="table-danger">
                          <tr>
                            <th
                              className="text-center user-select-none"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSortChange('position')}
                            >
                              #{' '}
                              {sortBy === 'position' && (
                                <i
                                  className={`fas fa-sort-${
                                    sortOrder === 'asc' ? 'up' : 'down'
                                  } ms-1`}
                                ></i>
                              )}
                            </th>
                            <th
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSortChange('name')}
                            >
                              Constructor{' '}
                              {sortBy === 'name' && (
                                <i
                                  className={`fas fa-sort-${
                                    sortOrder === 'asc' ? 'up' : 'down'
                                  } ms-1`}
                                ></i>
                              )}
                            </th>
                            <th>Nationality</th>
                            <th
                              className="text-center"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSortChange('points')}
                            >
                              Points{' '}
                              {sortBy === 'points' && (
                                <i
                                  className={`fas fa-sort-${
                                    sortOrder === 'asc' ? 'up' : 'down'
                                  } ms-1`}
                                ></i>
                              )}
                            </th>
                            <th
                              className="text-center"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSortChange('wins')}
                            >
                              {' '}
                              Wins{' '}
                              {sortBy === 'wins' && (
                                <i
                                  className={`fas fa-sort-${
                                    sortOrder === 'asc' ? 'up' : 'down'
                                  } ms-1`}
                                ></i>
                              )}
                            </th>
                            <th className="text-center">Podiums</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedConstructors.map((constructor, index) => (
                            <tr
                              key={constructor.position}
                              className={index < 3 ? 'table-warning' : ''}
                            >
                              <td className="text-center fw-bold">
                                {index < 3 && (
                                  <i className="fas fa-medal text-warning me-1"></i>
                                )}
                                {constructor.position}
                              </td>
                              <td className="fw-semibold">
                                {constructor.name}
                              </td>
                              <td className="text-muted">
                                {constructor.nationality}
                              </td>
                              <td className="text-center fw-bold">
                                {constructor.points}
                              </td>
                              <td className="text-center">
                                {constructor.wins}
                              </td>{' '}
                              <td className="text-center">
                                {constructor.podiums || '0'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted">
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Loading constructor standings for {selectedSeason}...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Races Mode */}
        {viewMode === 'races' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-warning text-dark">
                  <h5 className="mb-0">
                    <i className="fas fa-flag-checkered me-2"></i>
                    Race Calendar - {selectedSeason}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Race Calendar Feature</strong> - Detailed race
                    information and results will be displayed here. This section
                    would show the complete race calendar with results,
                    qualifying times, and detailed race analysis.
                  </div>
                  <div className="text-center py-4">
                    <i className="fas fa-construction text-warning fa-3x mb-3"></i>
                    <h5>Race Details Coming Soon</h5>
                    <p className="text-muted">
                      Advanced race analysis and detailed results viewer
                    </p>
                    <Link
                      to={`/history/${selectedSeason}`}
                      className="btn btn-warning"
                    >
                      <i className="fas fa-arrow-left me-1"></i>
                      Back to Overview
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5>Loading {selectedSeason} Season Data</h5>
                  <p className="text-muted">
                    Please wait while we fetch the historical information...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-md-3">
                    <Link to="/" className="btn btn-primary w-100">
                      <i className="fas fa-home me-1"></i>
                      Back to Live Dashboard
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() =>
                        handleSeasonChange(
                          (parseInt(selectedSeason) - 1).toString(),
                        )
                      }
                      disabled={parseInt(selectedSeason) <= currentYear - 25}
                    >
                      <i className="fas fa-chevron-left me-1"></i>
                      Previous Season
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() =>
                        handleSeasonChange(
                          (parseInt(selectedSeason) + 1).toString(),
                        )
                      }
                      disabled={parseInt(selectedSeason) >= currentYear}
                    >
                      <i className="fas fa-chevron-right me-1"></i>
                      Next Season
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-success w-100"
                      onClick={() => window.location.reload()}
                    >
                      <i className="fas fa-sync me-1"></i>
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default HistoryPage;
