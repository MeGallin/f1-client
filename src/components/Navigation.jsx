/**
 * Navigation Component
 *
 * Provides consistent navigation across the application with
 * active route highlighting and responsive design.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../config';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-flag-checkered me-2"></i>
          {APP_CONFIG.name}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                to="/"
              >
                <i className="fas fa-home me-1"></i>
                Live Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/history') ? 'active' : ''}`}
                to="/history"
              >
                <i className="fas fa-history me-1"></i>
                Historical Data
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="quickLinksDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-external-link-alt me-1"></i>
                Quick Links
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    className="dropdown-item"
                    href="https://www.formula1.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-globe me-2"></i>
                    Formula 1 Official
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="https://f1-mcp-server-5dh3.onrender.com/health"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-server me-2"></i>
                    MCP Server Status
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
