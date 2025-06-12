/**
 * QuickActions Component
 *
 * Reusable quick actions section with navigation and utility buttons
 */

import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ actions = [] }) => {
  const defaultActions = [
    {
      type: 'link',
      to: '/history',
      className: 'btn btn-danger',
      icon: 'fas fa-history',
      text: 'BROWSE HISTORY',
    },
    {
      type: 'link',
      to: '/history/2025',
      className: 'btn btn-outline-danger',
      icon: 'fas fa-calendar',
      text: '2025 SEASON',
    },
    {
      type: 'external',
      href: 'https://www.formula1.com',
      className: 'btn btn-outline-secondary',
      icon: 'fas fa-external-link-alt',
      text: 'OFFICIAL F1',
    },
    {
      type: 'button',
      onClick: () => window.location.reload(),
      className: 'btn btn-outline-warning',
      icon: 'fas fa-sync',
      text: 'REFRESH DATA',
    },
  ];

  const actionsToRender = actions.length > 0 ? actions : defaultActions;

  const renderAction = (action, index) => {
    const baseStyle = {
      fontFamily: 'var(--font-accent)',
      fontWeight: 'var(--fw-bold)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontSize: 'var(--text-sm)',
    };

    const content = (
      <>
        <i className={`${action.icon} me-2`}></i>
        {action.text}
      </>
    );

    switch (action.type) {
      case 'link':
        return (
          <Link
            key={index}
            to={action.to}
            className={`${action.className} w-100 mt-1 mb-1`}
            style={baseStyle}
          >
            {content}
          </Link>
        );
      case 'external':
        return (
          <a
            key={index}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${action.className} w-100 mt-1 mb-1`}
            style={baseStyle}
          >
            {content}
          </a>
        );
      case 'button':
        return (
          <button
            key={index}
            className={`${action.className} w-100 mt-1 mb-1`}
            onClick={action.onClick}
            style={baseStyle}
          >
            {content}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="f1-carbon-card">
          <div
            className="card-header"
            style={{
              background: 'var(--f1-gradient-dark)',
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
              <i className="fas fa-rocket me-2"></i>
              QUICK ACTIONS
            </h5>
          </div>
          <div
            className="card-body p-4"
            style={{ background: 'var(--f1-grey-900)' }}
          >
            <div className="row g-3">
              {actionsToRender.map((action, index) => (
                <div key={index} className="col-md-3">
                  {renderAction(action, index)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
