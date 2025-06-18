/**
 * Navigation Component
 *
 * Provides consistent navigation across the application with
 * active route highlighting and responsive design.
 */

import React, { memo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../config';
import F1AgentChat from './F1AgentChat';

const Navigation = memo(() => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        background: 'var(--f1-gradient-dark)',
        boxShadow: 'var(--shadow-racing)',
        borderBottom: `3px solid var(--f1-red-primary)`,
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand"
          to="/"
          style={{
            fontFamily: 'var(--font-racing)',
            fontWeight: 'var(--fw-black)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--f1-white)',
            textDecoration: 'none',
            letterSpacing: '1px',
            transition: 'var(--transition-racing)',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--f1-red-light)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--f1-white)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <i
            className="fas fa-flag-checkered me-2"
            style={{ color: 'var(--f1-red-primary)' }}
          ></i>
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
          style={{
            borderColor: 'var(--f1-red-primary)',
            color: 'var(--f1-white)',
          }}
        >
          <span
            className="navbar-toggler-icon"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 255, 255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='m4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E")`,
            }}
          ></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                style={{
                  color: isActive('/')
                    ? 'var(--f1-red-light)'
                    : 'var(--f1-grey-300)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: isActive('/')
                    ? 'var(--fw-semibold)'
                    : 'var(--fw-normal)',
                  fontSize: 'var(--text-base)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius)',
                  transition: 'var(--transition-normal)',
                  textDecoration: 'none',
                  background: isActive('/')
                    ? 'var(--f1-red-muted)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/')) {
                    e.target.style.color = 'var(--f1-white)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/')) {
                    e.target.style.color = 'var(--f1-grey-300)';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <i className="fas fa-home me-1"></i>
                F1 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/history"
                style={{
                  color: isActive('/history')
                    ? 'var(--f1-red-light)'
                    : 'var(--f1-grey-300)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: isActive('/history')
                    ? 'var(--fw-semibold)'
                    : 'var(--fw-normal)',
                  fontSize: 'var(--text-base)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius)',
                  transition: 'var(--transition-normal)',
                  textDecoration: 'none',
                  background: isActive('/history')
                    ? 'var(--f1-red-muted)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/history')) {
                    e.target.style.color = 'var(--f1-white)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/history')) {
                    e.target.style.color = 'var(--f1-grey-300)';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <i className="fas fa-history me-1"></i>
                Historical Data
              </Link>
            </li>
            <li className="nav-item">
<<<<<<< HEAD
              <Link
                className="nav-link"
                to="/motorsport-news"
                style={{
                  color: isActive('/motorsport-news')
                    ? 'var(--f1-red-light)'
                    : 'var(--f1-grey-300)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: isActive('/motorsport-news')
                    ? 'var(--fw-semibold)'
                    : 'var(--fw-normal)',
=======
              <button
                className="nav-link btn btn-link"
                onClick={() => setIsChatOpen(true)}
                style={{
                  color: 'var(--f1-grey-300)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 'var(--fw-normal)',
>>>>>>> cbf3e4a (added agent mode)
                  fontSize: 'var(--text-base)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius)',
                  transition: 'var(--transition-normal)',
                  textDecoration: 'none',
<<<<<<< HEAD
                  background: isActive('/motorsport-news')
                    ? 'var(--f1-red-muted)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/motorsport-news')) {
                    e.target.style.color = 'var(--f1-white)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/motorsport-news')) {
                    e.target.style.color = 'var(--f1-grey-300)';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <i className="fas fa-newspaper me-1"></i>
                Motorsport News
              </Link>
=======
                  background: 'transparent',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--f1-white)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--f1-grey-300)';
                  e.target.style.background = 'transparent';
                }}
              >
                <i className="fas fa-robot me-1"></i>
                AI Assistant
              </button>
>>>>>>> cbf3e4a (added agent mode)
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
                style={{
                  color: 'var(--f1-grey-300)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 'var(--fw-normal)',
                  fontSize: 'var(--text-base)',
                  padding: '0.75rem 1rem',
                  transition: 'var(--transition-normal)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--f1-white)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--f1-grey-300)';
                }}
              >
                <i className="fas fa-external-link-alt me-1"></i>
                Quick Links
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                style={{
                  background: 'var(--f1-white)',
                  border: `1px solid var(--f1-grey-200)`,
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem 0',
                }}
              >
                <li>
                  <a
                    className="dropdown-item"
                    href="https://www.formula1.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--f1-grey-700)',
                      fontFamily: 'var(--font-primary)',
                      padding: '0.5rem 1rem',
                      transition: 'var(--transition-fast)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--f1-red-pale)';
                      e.target.style.color = 'var(--f1-red-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--f1-grey-700)';
                    }}
                  >
                    <i
                      className="fas fa-globe me-2"
                      style={{ color: 'var(--f1-red-primary)' }}
                    ></i>
                    Formula 1 Official
                  </a>
                </li>
                <li>
                  <hr
                    className="dropdown-divider"
                    style={{ borderColor: 'var(--f1-grey-200)' }}
                  />
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="https://f1-mcp-server-5dh3.onrender.com/health"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--f1-grey-700)',
                      fontFamily: 'var(--font-primary)',
                      padding: '0.5rem 1rem',
                      transition: 'var(--transition-fast)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--f1-red-pale)';
                      e.target.style.color = 'var(--f1-red-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--f1-grey-700)';
                    }}
                  >
                    <i
                      className="fas fa-server me-2"
                      style={{ color: 'var(--f1-success)' }}
                    ></i>
                    MCP Server Status
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* F1 Agent Chat Modal */}
      <F1AgentChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
