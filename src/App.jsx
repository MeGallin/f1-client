import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import F1Dashboard from './components/F1Dashboard';
import LangGraphQueryForm from './components/LangGraphQueryForm';
import QueryForm from './components/QueryForm';
import QueryResults from './components/QueryResults';
import './styles/custom.css';

function App() {
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('langgraph'); // 'langgraph' or 'mcp'

  useEffect(() => {
    // Listen for F1 data events from dashboard quick actions
    const handleF1DataLoaded = (event) => {
      const { action, data } = event.detail;

      const result = {
        tool: `quick_${action}`,
        toolName: `Quick Action: ${action}`,
        query: `Dashboard quick action: ${action}`,
        data: data,
        timestamp: new Date().toISOString(),
        success: true,
      };

      handleNewResults(result);

      // Show notification
      addNotification(
        `✅ Quick action "${action}" completed successfully!`,
        'success',
      );
    };

    window.addEventListener('f1DataLoaded', handleF1DataLoaded);

    return () => {
      window.removeEventListener('f1DataLoaded', handleF1DataLoaded);
    };
  }, []);

  const handleNewResults = (newResult) => {
    setResults((prev) => {
      const updated = [newResult, ...prev];
      return updated.slice(0, 10); // Keep last 10 results
    });
  };

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 1050 }}
          >
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`alert alert-${
                  notification.type === 'success' ? 'success' : 'info'
                } alert-dismissible fade show mb-2`}
                role="alert"
              >
                {notification.message}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => removeNotification(notification.id)}
                ></button>
              </div>
            ))}
          </div>
        )}
        {/* Dashboard Overview */}
        <F1Dashboard />

        {/* Query Interface Tabs */}
        <div className="row mt-4">
          <div className="col-12">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === 'langgraph' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('langgraph')}
                  type="button"
                >
                  🤖 LangGraph Agents (Recommended)
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'mcp' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mcp')}
                  type="button"
                >
                  🔧 Direct MCP Tools
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Query Interface */}
        <div className="row mt-3">
          <div className="col-lg-6 mb-4">
            {activeTab === 'langgraph' ? (
              <LangGraphQueryForm onResults={handleNewResults} />
            ) : (
              <QueryForm onResults={handleNewResults} />
            )}
          </div>
          <div className="col-lg-6 mb-4">
            <QueryResults results={results} />
          </div>
        </div>

        {/* System Information */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="fw-bold">🚀 Production System</h6>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <small>✅ F1 MCP Server: Live</small>
                      </li>
                      <li>
                        <small>✅ F1 API Proxy: Live</small>
                      </li>
                      <li>
                        <small>✅ 14 MCP Tools: Available</small>
                      </li>
                      <li>
                        <small>✅ 76 F1 Seasons: 1950-2025</small>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold">📊 Data Coverage</h6>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <small>🏁 Races: Complete schedules</small>
                      </li>
                      <li>
                        <small>👨‍🏎️ Drivers: All seasons</small>
                      </li>
                      <li>
                        <small>🏗️ Constructors: Team data</small>
                      </li>
                      <li>
                        <small>🏆 Results: Race & qualifying</small>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold">🔧 Available Tools</h6>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <small>Season Analysis Tools</small>
                      </li>
                      <li>
                        <small>Race & Calendar Tools</small>
                      </li>
                      <li>
                        <small>Driver & Team Tools</small>
                      </li>
                      <li>
                        <small>Results & Standings Tools</small>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        {results.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">📈 Recent Activity</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 text-center">
                      <h4 className="text-primary">{results.length}</h4>
                      <small className="text-muted">Total Queries</small>
                    </div>
                    <div className="col-md-3 text-center">
                      <h4 className="text-success">
                        {results.filter((r) => r.success).length}
                      </h4>
                      <small className="text-muted">Successful</small>
                    </div>
                    <div className="col-md-3 text-center">
                      <h4 className="text-danger">
                        {results.filter((r) => !r.success).length}
                      </h4>
                      <small className="text-muted">Failed</small>
                    </div>
                    <div className="col-md-3 text-center">
                      <h4 className="text-info">
                        {new Set(results.map((r) => r.tool)).size}
                      </h4>
                      <small className="text-muted">Tools Used</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
