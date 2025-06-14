/**
 * RaceCountdownDemo Component
 *
 * Example component demonstrating how to use the RaceCountdown component independently
 */

import React, { useState } from 'react';
import RaceCountdown from './RaceCountdown';

const RaceCountdownDemo = () => {
  // Example usage with different event dates
  const [events] = useState([
    {
      name: 'Monaco Grand Prix',
      date: '2025-05-25T14:00:00',
      style: {
        background: 'var(--f1-grey-100)',
        padding: '1rem',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--f1-grey-300)',
        marginBottom: '1rem',
      },
    },
    {
      name: 'British Grand Prix',
      date: '2025-07-06T14:00:00',
      style: {
        background: 'var(--f1-gradient-red)',
        padding: '1rem',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--f1-red-dark)',
        marginBottom: '1rem',
        color: 'var(--f1-white)',
      },
    },
    {
      name: 'Abu Dhabi Grand Prix (Season Finale)',
      date: '2025-11-23T14:00:00',
      style: {
        background: 'var(--f1-gradient-dark)',
        padding: '1rem',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--f1-grey-800)',
        marginBottom: '1rem',
        color: 'var(--f1-white)',
      },
    },
  ]);

  return (
    <div className="container my-4">
      <h3
        style={{
          fontFamily: 'var(--font-racing)',
          fontWeight: 'var(--fw-bold)',
          marginBottom: '1.5rem',
        }}
      >
        Race Countdown Demo
      </h3>

      <div className="row">
        {events.map((event, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <RaceCountdown
              eventDate={event.date}
              eventName={event.name}
              style={event.style}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h5>Usage Instructions:</h5>
        <pre
          style={{
            background: 'var(--f1-grey-100)',
            padding: '1rem',
            borderRadius: 'var(--border-radius)',
            fontFamily: 'var(--font-data)',
            overflow: 'auto',
          }}
        >
          {`// Import the component
import RaceCountdown from './components/RaceCountdown';

// Basic usage
<RaceCountdown 
  eventDate="2025-05-25T14:00:00" 
  eventName="Monaco Grand Prix" 
/>

// Custom styling
<RaceCountdown 
  eventDate="2025-05-25T14:00:00" 
  eventName="Monaco Grand Prix"
  style={{
    background: 'var(--f1-gradient-red)',
    padding: '1rem',
    borderRadius: 'var(--border-radius)'
  }} 
/>`}
        </pre>
      </div>
    </div>
  );
};

export default RaceCountdownDemo;
