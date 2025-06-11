import React, { useState, useEffect } from 'react';
import f1MCPClient from '../services/api.js';

function F1Dashboard() {
  const [systemHealth, setSystemHealth] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [nextRace, setNextRace] = useState(null);
  const [driverStandings, setDriverStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🏁 Loading F1 Dashboard data...');

      // Load dashboard data in parallel
      const [health, season, race, standings] = await Promise.all([
        f1MCPClient.checkSystemHealth(),
        f1MCPClient.getCurrentSeason(),
        f1MCPClient.getNextRace(),
        f1MCPClient.getDriverStandings(2025).catch(() => null), // Optional
      ]);

      setSystemHealth(health);
      setCurrentSeason(season);
      setNextRace(race);
      setDriverStandings(standings);

      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Dashboard load error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick action handlers
  const handleQuickAction = async (action) => {
    try {
      console.log(`🚀 Quick action: ${action}`);

      let result;
      switch (action) {
        case 'seasons':
          result = await f1MCPClient.getF1Seasons();
          break;
        case 'drivers':
          result = await f1MCPClient.getF1Drivers(2025);
          break;
        case 'races':
          result = await f1MCPClient.getF1Races(2025);
          break;
        case 'constructors':
          result = await f1MCPClient.getF1Constructors(2025);
          break;
        default:
          return;
      }

      // Trigger a custom event with the result (for other components to listen)
      window.dispatchEvent(
        new CustomEvent('f1DataLoaded', {
          detail: { action, data: result },
        }),
      );

      console.log(`✅ Quick action ${action} completed:`, result);
    } catch (error) {
      console.error(`❌ Quick action ${action} failed:`, error);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '300px' }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading F1 Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">❌ Dashboard Error</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={loadDashboardData}>
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-2">🏁 F1 MCP Dashboard</h1>
          <p className="lead text-muted">
            Live Formula 1 data powered by MCP tools • Production System
          </p>
        </div>
      </div>

      {/* System Health & Key Info */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0">🔧 System Status</h6>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span
                  className={`badge ${
                    systemHealth?.status === 'healthy'
                      ? 'bg-success'
                      : 'bg-warning'
                  } me-2`}
                >
                  {systemHealth?.status?.toUpperCase()}
                </span>
              </div>
              <small className="text-muted">
                MCP Server: {systemHealth?.mcpServer?.status || 'Unknown'}
                <br />
                API Proxy: {systemHealth?.apiProxy?.status || 'Unknown'}
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0">🏎️ Current Season</h6>
            </div>
            <div className="card-body">
              <h3 className="mb-1">{currentSeason?.season || '2025'}</h3>
              <p className="mb-0 small">Formula 1 World Championship</p>
              <small className="text-muted">
                {currentSeason?.total || '24'} races scheduled
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">🏁 Next Race</h6>
            </div>
            <div className="card-body">
              <h6 className="mb-1">{nextRace?.raceName || 'Loading...'}</h6>
              <p className="text-muted mb-1 small">
                {nextRace?.circuitName || ''}
              </p>
              <small className="text-muted">{nextRace?.date || 'TBD'}</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">🛠️ MCP Tools</h6>
            </div>
            <div className="card-body">
              <h3 className="mb-1">14</h3>
              <p className="mb-0 small">Tools Available</p>
              <small className="text-muted">All operational</small>
            </div>
          </div>
        </div>
      </div>

      {/* Championship Leader (if available) */}
      {driverStandings && driverStandings.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-dark text-white">
                <h6 className="mb-0">🏆 Championship Leader</h6>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h4 className="mb-1">
                      {driverStandings[0].Driver?.givenName}{' '}
                      {driverStandings[0].Driver?.familyName}
                    </h4>
                    <p className="text-muted mb-0">
                      {driverStandings[0].Constructors?.[0]?.name} •{' '}
                      {driverStandings[0].points} points
                    </p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <span className="badge bg-primary fs-6">
                      P{driverStandings[0].position}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">🚀 Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleQuickAction('seasons')}
                  >
                    📊 Load All Seasons
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-success w-100"
                    onClick={() => handleQuickAction('drivers')}
                  >
                    👨‍🏎️ Current Drivers
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-info w-100"
                    onClick={() => handleQuickAction('races')}
                  >
                    📅 2025 Races
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-warning w-100"
                    onClick={() => handleQuickAction('constructors')}
                  >
                    🏗️ Teams
                  </button>
                </div>
              </div>

              <hr className="my-3" />

              <div className="row g-2">
                <div className="col-md-6">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={loadDashboardData}
                  >
                    🔄 Refresh Dashboard
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-outline-dark w-100"
                    onClick={() =>
                      f1MCPClient.testAllMCPTools().then(console.log)
                    }
                  >
                    🧪 Test All MCP Tools
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production URLs Info */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">🌐 Live Production Services</h6>
              <div className="row">
                <div className="col-md-6">
                  <small>
                    <strong>F1 MCP Server:</strong>
                    <br />
                    <a
                      href="https://f1-mcp-server-5dh3.onrender.com/health"
                      target="_blank"
                      rel="noopener"
                      className="text-decoration-none"
                    >
                      https://f1-mcp-server-5dh3.onrender.com
                    </a>
                  </small>
                </div>
                <div className="col-md-6">
                  <small>
                    <strong>F1 API Proxy:</strong>
                    <br />
                    <a
                      href="https://f1-api-proxy.onrender.com/health"
                      target="_blank"
                      rel="noopener"
                      className="text-decoration-none"
                    >
                      https://f1-api-proxy.onrender.com
                    </a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default F1Dashboard;
