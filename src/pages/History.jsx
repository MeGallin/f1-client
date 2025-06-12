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
      <section
        className="text-white py-5"
        style={{
          background: 'var(--f1-gradient-dark)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="f1-stripes-pattern"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
          }}
        ></div>
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb">
                <ol
                  className="breadcrumb mb-3"
                  style={{
                    '--bs-breadcrumb-divider-color': 'var(--f1-grey-300)',
                    '--bs-breadcrumb-item-active-color': 'var(--f1-red-light)',
                  }}
                >
                  <li className="breadcrumb-item">
                    <Link
                      to="/"
                      style={{
                        color: 'var(--f1-grey-300)',
                        textDecoration: 'none',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = 'var(--f1-white)')
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = 'var(--f1-grey-300)')
                      }
                    >
                      <i className="fas fa-home"></i> Home
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item active"
                    style={{ color: 'var(--f1-red-light)' }}
                  >
                    History
                  </li>
                  {season && (
                    <li
                      className="breadcrumb-item active"
                      style={{ color: 'var(--f1-red-light)' }}
                    >
                      {season}
                    </li>
                  )}
                  {round && (
                    <li
                      className="breadcrumb-item active"
                      style={{ color: 'var(--f1-red-light)' }}
                    >
                      Round {round}
                    </li>
                  )}
                </ol>
              </nav>
              <h1
                style={{
                  fontFamily: 'var(--font-racing)',
                  fontSize: 'var(--text-5xl)',
                  fontWeight: 'var(--fw-black)',
                  marginBottom: '1rem',
                  letterSpacing: '-1px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                <i
                  className="fas fa-history me-3"
                  style={{ color: 'var(--f1-red-light)' }}
                ></i>
                F1 Historical Data Browser
              </h1>
              <p
                style={{
                  fontSize: 'var(--text-lg)',
                  fontFamily: 'var(--font-primary)',
                  opacity: 0.9,
                  marginBottom: 0,
                }}
              >
                Explore past seasons, race results, and championship data
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div
                className="badge fs-6 px-4 py-3"
                style={{
                  background: 'var(--f1-gradient-champion)',
                  color: 'var(--f1-white)',
                  fontFamily: 'var(--font-accent)',
                  fontWeight: 'var(--fw-bold)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: 'var(--shadow-champion)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
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
            <div className="f1-card">
              <div className="card-body p-4">
                <h6
                  className="card-title mb-3 d-flex align-items-center"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--fw-semibold)',
                    color: 'var(--f1-grey-800)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <i
                    className="fas fa-filter me-2"
                    style={{ color: 'var(--f1-red-primary)' }}
                  ></i>
                  Season Selection
                  {(loadingDrivers ||
                    loadingConstructors ||
                    loadingOverview) && (
                    <div
                      className="f1-loader ms-3"
                      style={{ width: '20px', height: '20px' }}
                    ></div>
                  )}
                </h6>
                <div className="row g-3">
                  <div className="col-8">
                    <select
                      className="form-select"
                      value={selectedSeason}
                      onChange={(e) => handleSeasonChange(e.target.value)}
                      disabled={
                        loadingDrivers || loadingConstructors || loadingOverview
                      }
                      style={{
                        border: `2px solid var(--f1-grey-200)`,
                        borderRadius: 'var(--border-radius)',
                        padding: '0.75rem 1rem',
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'var(--text-base)',
                        transition: 'var(--transition-normal)',
                        background:
                          loadingDrivers ||
                          loadingConstructors ||
                          loadingOverview
                            ? 'var(--f1-grey-100)'
                            : 'var(--f1-white)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--f1-red-primary)';
                        e.target.style.boxShadow =
                          '0 0 0 3px rgba(220, 38, 38, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--f1-grey-200)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {availableSeasons.map((year) => (
                        <option key={year} value={year}>
                          {year} Season
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn-f1-secondary w-100"
                      onClick={() => handleSeasonChange(currentYear.toString())}
                      disabled={
                        loadingDrivers || loadingConstructors || loadingOverview
                      }
                      style={{
                        fontSize: 'var(--text-sm)',
                        padding: '0.75rem 0.5rem',
                      }}
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
            <div className="f1-card">
              <div className="card-body p-4">
                <h6
                  className="card-title mb-3"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--fw-semibold)',
                    color: 'var(--f1-grey-800)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <i
                    className="fas fa-eye me-2"
                    style={{ color: 'var(--f1-red-primary)' }}
                  ></i>
                  View Mode
                </h6>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${
                      viewMode === 'overview'
                        ? 'btn-f1-primary'
                        : 'btn-f1-secondary'
                    }`}
                    onClick={() => handleViewModeChange('overview')}
                    disabled={loadingOverview}
                    style={{
                      fontSize: 'var(--text-sm)',
                      padding: '0.75rem 0.5rem',
                    }}
                  >
                    <i className="fas fa-chart-pie me-1"></i>
                    Overview
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      viewMode === 'drivers'
                        ? 'btn-f1-primary'
                        : 'btn-f1-secondary'
                    }`}
                    onClick={() => handleViewModeChange('drivers')}
                    disabled={loadingDrivers}
                    style={{
                      fontSize: 'var(--text-sm)',
                      padding: '0.75rem 0.5rem',
                    }}
                  >
                    <i className="fas fa-user me-1"></i>
                    Drivers
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      viewMode === 'constructors'
                        ? 'btn-f1-primary'
                        : 'btn-f1-secondary'
                    }`}
                    onClick={() => handleViewModeChange('constructors')}
                    disabled={loadingConstructors}
                    style={{
                      fontSize: 'var(--text-sm)',
                      padding: '0.75rem 0.5rem',
                    }}
                  >
                    <i className="fas fa-car me-1"></i>
                    Teams
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      viewMode === 'races'
                        ? 'btn-f1-primary'
                        : 'btn-f1-secondary'
                    }`}
                    onClick={() => handleViewModeChange('races')}
                    style={{
                      fontSize: 'var(--text-sm)',
                      padding: '0.75rem 0.5rem',
                    }}
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
                  <div className="f1-stat-card">
                    <div className="card-body text-center">
                      <i
                        className="fas fa-trophy fa-2x mb-2"
                        style={{ color: 'var(--f1-gold)' }}
                      ></i>
                      <h5>Champion</h5>
                      {loadingOverview ? (
                        <div>
                          <div
                            className="f1-loader"
                            style={{
                              width: '2rem',
                              height: '2rem',
                              margin: '1rem auto',
                            }}
                          ></div>
                          <div
                            className="f1-stat-number"
                            style={{ fontSize: 'var(--text-lg)' }}
                          >
                            Loading...
                          </div>
                          <div className="f1-stat-label">Loading points...</div>
                        </div>
                      ) : (
                        <div>
                          <div className="f1-stat-number">
                            {topDrivers?.[0]?.driver || 'Loading...'}
                          </div>
                          <div className="f1-stat-label">
                            {topDrivers?.[0]?.points || 0} points
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="f1-stat-card"
                    style={{ '--f1-accent-color': 'var(--f1-danger)' }}
                  >
                    <div className="card-body text-center">
                      <i
                        className="fas fa-car fa-2x mb-2"
                        style={{ color: 'var(--f1-danger)' }}
                      ></i>
                      <h5>Constructor</h5>
                      {loadingOverview ? (
                        <div>
                          <div
                            className="f1-loader"
                            style={{
                              width: '2rem',
                              height: '2rem',
                              margin: '1rem auto',
                            }}
                          ></div>
                          <div
                            className="f1-stat-number"
                            style={{ fontSize: 'var(--text-lg)' }}
                          >
                            Loading...
                          </div>
                          <div className="f1-stat-label">Loading points...</div>
                        </div>
                      ) : (
                        <div>
                          <div
                            className="f1-stat-number"
                            style={{ color: 'var(--f1-danger)' }}
                          >
                            {topConstructors?.[0]?.name || 'Loading...'}
                          </div>
                          <div className="f1-stat-label">
                            {topConstructors?.[0]?.points || 0} points
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="f1-stat-card"
                    style={{ '--f1-accent-color': 'var(--f1-warning)' }}
                  >
                    <div className="card-body text-center">
                      <i
                        className="fas fa-flag-checkered fa-2x mb-2"
                        style={{ color: 'var(--f1-warning)' }}
                      ></i>
                      <h5>Total Races</h5>
                      <div
                        className="f1-stat-number"
                        style={{ color: 'var(--f1-warning)' }}
                      >
                        {currentRace?.MRData?.total || '0'}
                      </div>
                      <div className="f1-stat-label">Completed</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="f1-stat-card"
                    style={{ '--f1-accent-color': 'var(--f1-info)' }}
                  >
                    <div className="card-body text-center">
                      <i
                        className="fas fa-calendar fa-2x mb-2"
                        style={{ color: 'var(--f1-info)' }}
                      ></i>
                      <h5>Season</h5>
                      <div
                        className="f1-stat-number"
                        style={{ color: 'var(--f1-info)' }}
                      >
                        {selectedSeason}
                      </div>
                      <div className="f1-stat-label">Formula 1</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 Summary */}
            <div className="col-lg-6 mb-4">
              <div className="f1-carbon-card h-100">
                <div
                  className="card-header"
                  style={{
                    background: 'var(--f1-gradient-champion)',
                    color: 'var(--f1-white)',
                    borderRadius:
                      'var(--border-radius-lg) var(--border-radius-lg) 0 0',
                  }}
                >
                  <h5
                    className="mb-0"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-bold)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    <i className="fas fa-podium me-2"></i>
                    Top 3 Drivers - {selectedSeason}
                  </h5>
                </div>{' '}
                <div className="card-body">
                  {loadingDrivers ? (
                    <div className="text-center py-4">
                      <div className="f1-loader mb-3"></div>
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
                            className="d-flex align-items-center mb-3 f1-interactive"
                            style={{
                              padding: '1rem',
                              borderRadius: 'var(--border-radius)',
                              background:
                                index === 0
                                  ? 'var(--f1-red-pale)'
                                  : 'var(--f1-grey-50)',
                              border:
                                index === 0
                                  ? '2px solid var(--f1-red-light)'
                                  : '1px solid var(--f1-grey-200)',
                            }}
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
                              <div
                                className={`fw-bold ${colors[index]} f1-logo-text`}
                                style={{
                                  fontSize: 'var(--text-lg)',
                                  fontFamily: 'var(--font-data)',
                                }}
                              >
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
                    className="btn-f1-primary btn-sm w-100"
                    onClick={() => handleViewModeChange('drivers')}
                    disabled={loadingDrivers}
                  >
                    {loadingDrivers ? (
                      <>
                        <div
                          className="f1-loader me-2"
                          style={{
                            width: '1rem',
                            height: '1rem',
                            display: 'inline-block',
                          }}
                        ></div>
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
              <div className="f1-carbon-card h-100">
                <div
                  className="card-header"
                  style={{
                    background: 'var(--f1-gradient-red)',
                    color: 'var(--f1-white)',
                    borderRadius:
                      'var(--border-radius-lg) var(--border-radius-lg) 0 0',
                  }}
                >
                  <h5
                    className="mb-0"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-bold)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    <i className="fas fa-building me-2"></i>
                    Top 3 Constructors - {selectedSeason}
                  </h5>
                </div>{' '}
                <div className="card-body">
                  {loadingConstructors ? (
                    <div className="text-center py-4">
                      <div className="f1-loader mb-3"></div>
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
                            className="d-flex align-items-center mb-3 f1-interactive"
                            style={{
                              padding: '1rem',
                              borderRadius: 'var(--border-radius)',
                              background:
                                index === 0
                                  ? 'var(--f1-red-pale)'
                                  : 'var(--f1-grey-50)',
                              border:
                                index === 0
                                  ? '2px solid var(--f1-red-light)'
                                  : '1px solid var(--f1-grey-200)',
                            }}
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
                              <div
                                className={`fw-bold ${colors[index]} f1-logo-text`}
                                style={{
                                  fontSize: 'var(--text-lg)',
                                  fontFamily: 'var(--font-data)',
                                }}
                              >
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
                    className="btn-f1-secondary btn-sm w-100"
                    onClick={() => handleViewModeChange('constructors')}
                    disabled={loadingConstructors}
                  >
                    {loadingConstructors ? (
                      <>
                        <div
                          className="f1-loader me-2"
                          style={{
                            width: '1rem',
                            height: '1rem',
                            display: 'inline-block',
                          }}
                        ></div>
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
              <div className="f1-table">
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{
                    background: 'var(--f1-gradient-champion)',
                    color: 'var(--f1-white)',
                    borderRadius:
                      'var(--border-radius-lg) var(--border-radius-lg) 0 0',
                  }}
                >
                  <h5
                    className="mb-0"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-bold)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    <i className="fas fa-trophy me-2"></i>
                    Driver Championship - {selectedSeason}
                  </h5>{' '}
                  <div>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-select form-select-sm border-0 text-white me-2"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
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
                      <div className="f1-loader mb-3"></div>
                      <h6>Loading Driver Championship</h6>
                      <p className="text-muted mb-0">
                        Fetching {selectedSeason} driver standings...
                      </p>
                    </div>
                  ) : topDrivers && topDrivers.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
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
                            </th>
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
                              className={`${
                                index < 3 ? 'podium-' + (index + 1) : ''
                              } f1-zoom`}
                            >
                              <td className="text-center fw-bold">
                                {index < 3 && (
                                  <i className="fas fa-medal text-warning me-1"></i>
                                )}
                                {driver.position}
                              </td>
                              <td className="fw-semibold racing-stat">
                                {driver.driver}
                              </td>
                              <td className="text-muted">
                                {driver.constructor}
                              </td>
                              <td className="text-center fw-bold racing-number">
                                {driver.points}
                              </td>
                              <td className="text-center">{driver.wins}</td>
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
              <div className="f1-table">
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{
                    background: 'var(--f1-gradient-red)',
                    color: 'var(--f1-white)',
                    borderRadius:
                      'var(--border-radius-lg) var(--border-radius-lg) 0 0',
                  }}
                >
                  <h5
                    className="mb-0"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-bold)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    <i className="fas fa-car me-2"></i>
                    Constructor Championship - {selectedSeason}
                  </h5>{' '}
                  <div>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-select form-select-sm border-0 text-white me-2"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
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
                      <div className="f1-loader mb-3"></div>
                      <h6>Loading Constructor Championship</h6>
                      <p className="text-muted mb-0">
                        Fetching {selectedSeason} constructor standings...
                      </p>
                    </div>
                  ) : topConstructors && topConstructors.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
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
                              className={`${
                                index < 3 ? 'podium-' + (index + 1) : ''
                              } f1-zoom`}
                            >
                              <td className="text-center fw-bold">
                                {index < 3 && (
                                  <i className="fas fa-medal text-warning me-1"></i>
                                )}
                                {constructor.position}
                              </td>
                              <td className="fw-semibold racing-stat">
                                {constructor.name}
                              </td>
                              <td className="text-muted">
                                {constructor.nationality}
                              </td>
                              <td className="text-center fw-bold racing-number">
                                {constructor.points}
                              </td>
                              <td className="text-center">
                                {constructor.wins}
                              </td>
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
              <div className="f1-table">
                <div
                  className="card-header"
                  style={{
                    background: 'var(--f1-gradient-champion)',
                    color: 'var(--f1-white)',
                    borderRadius:
                      'var(--border-radius-lg) var(--border-radius-lg) 0 0',
                  }}
                >
                  <h5
                    className="mb-0"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 'var(--fw-bold)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    <i className="fas fa-flag-checkered me-2"></i>
                    Race Calendar - {selectedSeason}
                  </h5>
                </div>
                <div className="card-body">
                  <div
                    className="f1-carbon-card mb-4"
                    style={{
                      background: 'var(--f1-gradient-info)',
                      color: 'var(--f1-white)',
                      border: '2px solid var(--f1-info)',
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i
                          className="fas fa-rocket fa-2x me-3"
                          style={{ color: 'var(--f1-gold)' }}
                        ></i>
                        <div>
                          <h6
                            className="mb-1"
                            style={{
                              fontFamily: 'var(--font-racing)',
                              fontWeight: 'var(--fw-bold)',
                              textTransform: 'uppercase',
                            }}
                          >
                            Advanced Race Analytics
                          </h6>
                          <p className="mb-0 opacity-90">
                            Detailed race information and results will be
                            displayed here. This section will feature complete
                            race calendar with results, qualifying times, lap
                            analysis, and telemetry data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="text-center py-5 f1-interactive"
                    style={{
                      background: 'var(--pattern-carbon)',
                      borderRadius: 'var(--border-radius-lg)',
                      border: '2px dashed var(--f1-grey-300)',
                    }}
                  >
                    <div
                      className="f1-logo-text mb-4"
                      style={{
                        fontSize: '4rem',
                        color: 'var(--f1-red-primary)',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      🏁
                    </div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-racing)',
                        color: 'var(--f1-grey-800)',
                        marginBottom: '1rem',
                      }}
                    >
                      Race Analysis Dashboard
                    </h4>
                    <p
                      className="text-muted mb-4"
                      style={{
                        fontSize: 'var(--text-lg)',
                        maxWidth: '600px',
                        margin: '0 auto 2rem',
                      }}
                    >
                      Complete race weekend analysis featuring qualifying
                      results, race outcomes, lap times, pit strategies, and
                      championship implications.
                    </p>

                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <Link
                        to={`/history/${selectedSeason}`}
                        className="btn-f1-primary"
                      >
                        <i className="fas fa-chart-pie me-2"></i>
                        Back to Season Overview
                      </Link>
                      <button className="btn-f1-secondary">
                        <i className="fas fa-cog me-2"></i>
                        Coming Soon
                      </button>
                    </div>

                    <div className="row mt-4 g-3">
                      <div className="col-md-3">
                        <div
                          className="f1-stat-card"
                          style={{ '--f1-accent-color': 'var(--f1-success)' }}
                        >
                          <div className="card-body text-center">
                            <i
                              className="fas fa-flag-checkered fa-2x mb-2"
                              style={{ color: 'var(--f1-success)' }}
                            ></i>
                            <div
                              className="f1-stat-number"
                              style={{ color: 'var(--f1-success)' }}
                            >
                              Race Results
                            </div>
                            <div className="f1-stat-label">
                              Complete Analysis
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div
                          className="f1-stat-card"
                          style={{ '--f1-accent-color': 'var(--f1-warning)' }}
                        >
                          <div className="card-body text-center">
                            <i
                              className="fas fa-stopwatch fa-2x mb-2"
                              style={{ color: 'var(--f1-warning)' }}
                            ></i>
                            <div
                              className="f1-stat-number"
                              style={{ color: 'var(--f1-warning)' }}
                            >
                              Qualifying
                            </div>
                            <div className="f1-stat-label">Grid Positions</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div
                          className="f1-stat-card"
                          style={{ '--f1-accent-color': 'var(--f1-info)' }}
                        >
                          <div className="card-body text-center">
                            <i
                              className="fas fa-tachometer-alt fa-2x mb-2"
                              style={{ color: 'var(--f1-info)' }}
                            ></i>
                            <div
                              className="f1-stat-number"
                              style={{ color: 'var(--f1-info)' }}
                            >
                              Lap Times
                            </div>
                            <div className="f1-stat-label">Telemetry Data</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div
                          className="f1-stat-card"
                          style={{ '--f1-accent-color': 'var(--f1-danger)' }}
                        >
                          <div className="card-body text-center">
                            <i
                              className="fas fa-chess fa-2x mb-2"
                              style={{ color: 'var(--f1-danger)' }}
                            ></i>
                            <div
                              className="f1-stat-number"
                              style={{ color: 'var(--f1-danger)' }}
                            >
                              Strategy
                            </div>
                            <div className="f1-stat-label">Pit Analysis</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Racing Divider */}
        <div className="f1-divider my-5"></div>

        {/* Loading State */}
        {isLoading && (
          <div className="row">
            <div className="col-12">
              <div className="f1-carbon-card">
                <div className="card-body text-center py-5">
                  <div className="f1-loader mb-3"></div>
                  <h5
                    style={{
                      fontFamily: 'var(--font-racing)',
                      color: 'var(--f1-grey-800)',
                    }}
                  >
                    Loading {selectedSeason} Season Data
                  </h5>
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
            <div className="f1-grid-section">
              <div className="f1-carbon-card">
                <div className="card-body">
                  <h6
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-racing)',
                      color: 'var(--f1-red-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    <i className="fas fa-rocket me-2"></i>
                    Quick Navigation
                  </h6>
                  <div className="row g-2">
                    <div className="col-md-3">
                      <Link to="/" className="btn-f1-primary w-100">
                        <i className="fas fa-home me-1"></i>
                        Back to Live Dashboard
                      </Link>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn-f1-secondary w-100"
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
                        className="btn-f1-secondary w-100"
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
                        className="btn btn-outline-success w-100 f1-interactive"
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
      </div>

      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default HistoryPage;
