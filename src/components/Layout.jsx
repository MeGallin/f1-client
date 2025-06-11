import React from 'react';

function Layout({ children }) {
  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            🏁 F1 MCP LangGraph
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#dashboard">
                  📊 Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#seasons">
                  🏆 Seasons
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#drivers">
                  👨‍🏎️ Drivers
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#races">
                  🏁 Races
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#tools">
                  🔧 MCP Tools
                </a>
              </li>
            </ul>
            <span className="navbar-text">
              <small className="text-light">
                Live Production Data • 76 Seasons • 14 MCP Tools
              </small>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-fluid py-4">{children}</main>

      {/* Footer */}
      <footer className="bg-dark text-light py-3 mt-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <small>🏎️ F1 MCP LangGraph System • Production Ready</small>
            </div>
            <div className="col-md-6 text-end">
              <small>
                Powered by:
                <a
                  href="https://f1-api-proxy.onrender.com"
                  className="text-light ms-1"
                  target="_blank"
                  rel="noopener"
                >
                  F1 API Proxy
                </a>{' '}
                •
                <a
                  href="https://f1-mcp-server-5dh3.onrender.com"
                  className="text-light ms-1"
                  target="_blank"
                  rel="noopener"
                >
                  F1 MCP Server
                </a>
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
