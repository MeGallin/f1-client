/**
 * RaceCountdown Component
 *
 * A reusable countdown timer for F1 race events
 * Shows weeks, days, hours, minutes and seconds until a given event date
 */

import React, { useState, useEffect } from 'react';

const RaceCountdown = ({
  eventDate,
  eventTime = '00:00:00Z',
  eventName = '',
  style = {},
}) => {
  const [timeLeft, setTimeLeft] = useState({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    hasExpired: false,
  });

  useEffect(() => {
    // Return early if no valid date is provided
    if (!eventDate) {
      return;
    }

    // Combine date and time for accurate countdown
    let targetDateStr = eventDate;
    if (eventTime) {
      targetDateStr = `${eventDate}T${eventTime}`;
    }

    // Convert string date to Date object if needed
    const targetDate =
      targetDateStr instanceof Date ? targetDateStr : new Date(targetDateStr);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate - now;

      // Check if the date has passed
      if (difference <= 0) {
        return {
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          hasExpired: true,
        };
      }

      // Calculate time units
      const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
      const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 7);
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return {
        weeks,
        days,
        hours,
        minutes,
        seconds,
        hasExpired: false,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [eventDate]);

  // Helper to add leading zeros
  const padWithZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  // Add pulse animation to seconds
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Create a pulse effect on each second change
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timer);
  }, [timeLeft.seconds]);
  const timeUnits = [
    { label: 'W', value: timeLeft.weeks },
    { label: 'D', value: timeLeft.days },
    { label: 'H', value: padWithZero(timeLeft.hours) },
    { label: 'M', value: padWithZero(timeLeft.minutes) },
    { label: 'S', value: padWithZero(timeLeft.seconds), pulse: true },
  ];

  // Determine if we're in the last hour before the race
  const isLastHour =
    !timeLeft.hasExpired &&
    timeLeft.weeks === 0 &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0;

  // Determine which units to display (hide weeks if 0)
  const displayUnits = timeLeft.weeks > 0 ? timeUnits : timeUnits.slice(1);

  if (!eventDate) {
    return <div className="text-center">No event date provided</div>;
  }

  return (
    <div className="f1-countdown-container" style={style}>
      {/* Title */}
      {eventName && (
        <div
          className="countdown-title"
          style={{
            fontFamily: 'var(--font-racing)',
            fontWeight: 'var(--fw-bold)',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            letterSpacing: '1px',
            textAlign: 'center',
            color: isLastHour ? 'var(--f1-danger)' : 'var(--f1-info)',
            marginBottom: '0.5rem',
            animation: isLastHour ? 'pulse 1s infinite ease-in-out' : 'none',
          }}
        >
          <i
            className={`${
              isLastHour ? 'fas fa-exclamation-circle' : 'fas fa-stopwatch'
            } me-1`}
          ></i>
          {isLastHour ? 'STARTING SOON' : eventName}
        </div>
      )}
      {/* Countdown Display */}
      <div
        className="countdown-display"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.4rem',
          textAlign: 'center',
        }}
      >
        {displayUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="time-unit"
            style={{
              position: 'relative',
              padding: '0.25rem 0',
            }}
          >
            {' '}
            <div
              className="time-value"
              style={{
                background:
                  displayUnits.length > 4 && index === 0
                    ? 'var(--f1-gradient-red)'
                    : unit.label === 'D'
                    ? 'var(--f1-gradient-dark)'
                    : unit.label === 'H'
                    ? 'linear-gradient(135deg, var(--f1-info) 0%, var(--f1-grey-700) 100%)'
                    : unit.label === 'M'
                    ? 'linear-gradient(135deg, var(--f1-purple) 0%, var(--f1-grey-700) 100%)'
                    : unit.label === 'S'
                    ? 'linear-gradient(135deg, var(--f1-accent) 0%, var(--f1-grey-700) 100%)'
                    : 'var(--f1-gradient-dark)',
                color: 'var(--f1-white)',
                borderRadius: 'var(--border-radius)',
                fontSize:
                  displayUnits.length > 4 && index === 0
                    ? 'var(--text-md)'
                    : 'var(--text-sm)',
                fontWeight: 'var(--fw-black)',
                fontFamily: 'var(--font-data)',
                minWidth: '2rem',
                padding: '0.25rem 0.5rem',
                display: 'block',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden',
                transform: timeLeft.hasExpired ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Background accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(45deg, rgba(255,255,255,0.15) 0%, transparent 70%)',
                  zIndex: 0,
                }}
              ></div>{' '}
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  transform: unit.pulse && pulse ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.15s ease',
                  display: 'inline-block',
                }}
              >
                {unit.value}
              </span>
            </div>
            <div
              className="time-label"
              style={{
                fontFamily: 'var(--font-racing)',
                color: 'var(--f1-grey-600)',
                fontSize: '0.65rem',
                fontWeight: 'var(--fw-bold)',
                marginTop: '0.2rem',
                textTransform: 'uppercase',
              }}
            >
              {unit.label}
            </div>
          </div>
        ))}
      </div>{' '}
      {/* Racing flags decorative element - show when expired or in last hour */}
      {(timeLeft.hasExpired || isLastHour) && (
        <div
          className="racing-flags"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '0.75rem',
          }}
        >
          <span
            style={{
              color: 'var(--f1-red-primary)',
              fontWeight: 'var(--fw-bold)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-racing)',
              letterSpacing: '1px',
              animation: isLastHour
                ? 'pulse 1.5s infinite ease-in-out'
                : 'none',
            }}
          >
            {timeLeft.hasExpired ? (
              <>
                <i className="fas fa-flag-checkered me-1"></i> Race Day!
              </>
            ) : isLastHour ? (
              <>
                <i className="fas fa-bolt me-1"></i> Get Ready!
              </>
            ) : null}
          </span>
        </div>
      )}
    </div>
  );
};

export default RaceCountdown;
