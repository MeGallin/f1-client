/**
 * HeroSection Component
 *
 * Reusable hero section for the F1 dashboard with gradient background and title
 */

import React from 'react';
import './HeroSection.css'; // Import the new styles

const HeroSection = ({
  title = 'F1 Dashboard',
  subtitle = 'Formula 1 championship data, race results, and current standings',
}) => {
  return (
    <section className="hero-section text-white py-3 mb-3">
      <div className="hero-background-elements"></div>
      <div className="hero-stripes"></div>

      <div className="container position-relative h-100 d-flex align-items-center">
        <div className="row align-items-center w-100">
          <div className="col-lg-8">
            <div className="mb-2">
              <h1 className="display-4 hero-title">
                <i
                  className="fas fa-flag-checkered me-3"
                  style={{
                    color: 'var(--f1-red-light)',
                    animation: 'flagWave 3s ease-in-out infinite',
                  }}
                ></i>
                {title}
              </h1>
              <p className="lead mb-2 hero-subtitle">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
