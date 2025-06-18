/**
 * StatsCards Component
 *
 * Reusable stats cards for displaying F1 key statistics
 */

import React from 'react';
import RaceCountdown from './RaceCountdown';
import RaceTop3 from './RaceTop3';
import useLatestRaceResults from '../hooks/useLatestRaceResults';

const StatsCards = ({
  topDrivers,
  topConstructors,
  currentRace,
  nextRace,
  isLoading,
}) => {
  // Fetch latest race results for top 3 finishers
  const { getTop3Finishers, loading: loadingResults } =
    useLatestRaceResults(currentRace);
  const statsData = [
    {
      title: 'Championship Leaders',
      icon: 'fas fa-trophy',
      color: 'var(--f1-gold)',
      value: topDrivers?.[0]?.driver || 'Loading...',
      subtitle: `${topDrivers?.[0]?.points || 0} points`,
      constructorName: topConstructors?.[0]?.name || 'Loading...',
      constructorPoints: `${topConstructors?.[0]?.points || 0} points`,
      showLoader:
        isLoading && (!topDrivers?.[0]?.driver || !topConstructors?.[0]?.name),
    },
    {
      title: 'Last Race',
      icon: 'fas fa-flag-checkered',
      color: 'var(--f1-success)',
      value:
        currentRace?.MRData?.RaceTable?.Races?.[0]?.raceName?.replace(
          'Grand Prix',
          'GP',
        ) || 'Loading...',
      subtitle: currentRace?.MRData?.RaceTable?.Races?.[0]?.date || '',
      showLoader:
        isLoading && !currentRace?.MRData?.RaceTable?.Races?.[0]?.raceName,
    },
    {
      title: 'Next Race',
      icon: 'fas fa-calendar-check',
      color: 'var(--f1-info)',
      value:
        nextRace?.MRData?.RaceTable?.Races?.[0]?.raceName?.replace(
          'Grand Prix',
          'GP',
        ) || 'Loading...',
      subtitle: nextRace?.MRData?.RaceTable?.Races?.[0]?.date || '',
      dateTime: nextRace?.MRData?.RaceTable?.Races?.[0]?.date || '',
      showLoader:
        isLoading && !nextRace?.MRData?.RaceTable?.Races?.[0]?.raceName,
    },
  ];
  return (
    <div className="row mb-5">
      {statsData.map((stat, index) => (
        <div key={index} className="col-lg-4 col-md-6 mb-4">
          {' '}
          <div
            className="modern-f1-card"
            style={{
              '--accent-color': stat.color,
              background:
                index === 0
                  ? 'rgba(255, 255, 255, 0.85)'
                  : index === 1
                  ? 'rgba(255, 255, 255, 0.85)'
                  : 'rgba(255, 255, 255, 0.85)',
              border: `1px solid ${stat.color}20`,
              borderRadius: '16px',
              padding: '0',
              overflow: 'hidden',
              position: 'relative',
              height: '100%',
              minHeight: '280px',
              boxShadow: `0 8px 25px ${stat.color}15`,
            }}
          >
            {/* Animated Background Pattern */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
                animation: 'pulseGlow 4s ease-in-out infinite',
              }}
            ></div>{' '}
            {/* Header Section with Semi-transparent Overlay */}
            <div
              style={{
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`,
                padding: '2rem 2rem 1.25rem 2rem',
                borderBottom: `2px solid ${stat.color}25`,
                position: 'relative',
              }}
            >
              {' '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <h6
                  style={{
                    fontFamily: 'var(--font-racing)',
                    color: stat.color,
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    fontWeight: 'var(--fw-black)',
                    letterSpacing: '2px',
                    margin: 0,
                    lineHeight: '1.2',
                    flex: 1,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {stat.title}
                </h6>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {/* Visual pattern indicator for accessibility */}
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      background:
                        index === 0
                          ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, ' +
                            stat.color +
                            ' 2px, ' +
                            stat.color +
                            ' 4px)'
                          : index === 1
                          ? 'repeating-linear-gradient(90deg, transparent, transparent 1px, ' +
                            stat.color +
                            ' 1px, ' +
                            stat.color +
                            ' 3px)'
                          : 'repeating-linear-gradient(135deg, transparent, transparent 1px, ' +
                            stat.color +
                            ' 1px, ' +
                            stat.color +
                            ' 2px)',
                      borderRadius: '2px',
                    }}
                  ></div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: stat.color,
                      animation: 'pulseGlow 2s ease-in-out infinite',
                    }}
                  ></div>
                </div>
              </div>
            </div>{' '}
            {/* Content Section with Enhanced Spacing */}
            <div
              style={{
                padding: '2rem',
                height: 'calc(100% - 100px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.01)',
              }}
            >
              {index === 0 ? (
                // Championship Leaders Card - Driver & Constructor
                <div style={{ textAlign: 'left' }}>
                  {/* Driver Section */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '24px',
                          background: 'var(--f1-gold)',
                          borderRadius: '2px',
                          marginRight: '1rem',
                        }}
                      ></div>
                      <span
                        style={{
                          fontFamily: 'var(--font-racing)',
                          color: 'var(--f1-grey-800)',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1.8px',
                          fontWeight: 'var(--fw-black)',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        🏆 Driver Leader
                      </span>
                    </div>{' '}
                    <div
                      style={{
                        fontFamily: 'var(--font-racing)',
                        fontSize: '1.5rem',
                        fontWeight: 'var(--fw-black)',
                        color: 'var(--f1-grey-900)',
                        lineHeight: '1.2',
                        marginBottom: '0.5rem',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {stat.value}
                    </div>{' '}
                    <div
                      style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: '0.95rem',
                        color: 'var(--f1-gold)',
                        fontWeight: 'var(--fw-bold)',
                        background:
                          'linear-gradient(90deg, var(--f1-gold), #FFA500)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {stat.subtitle}
                    </div>
                    {/* Second Place Driver */}
                    {topDrivers?.[1] && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid rgba(255, 215, 0, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background:
                                  'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '0.5rem',
                                fontSize: '0.7rem',
                                fontWeight: 'var(--fw-black)',
                                color: 'var(--f1-grey-900)',
                                fontFamily: 'var(--font-racing)',
                              }}
                            >
                              2
                            </div>
                            <div>
                              <div
                                style={{
                                  fontFamily: 'var(--font-racing)',
                                  fontSize: '0.9rem',
                                  fontWeight: 'var(--fw-bold)',
                                  color: 'var(--f1-grey-800)',
                                  lineHeight: '1.2',
                                }}
                              >
                                {topDrivers[1].driver}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-primary)',
                              fontSize: '0.8rem',
                              color: 'var(--f1-grey-600)',
                              fontWeight: 'var(--fw-semibold)',
                            }}
                          >
                            {topDrivers[1].points} pts
                          </div>
                        </div>
                      </div>
                    )}{' '}
                  </div>

                  {/* Constructor Section with Better Alignment */}
                  <div style={{ marginTop: '5rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '24px',
                          background: 'var(--f1-red)',
                          borderRadius: '2px',
                          marginRight: '1rem',
                        }}
                      ></div>
                      <span
                        style={{
                          fontFamily: 'var(--font-racing)',
                          color: 'var(--f1-grey-800)',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1.8px',
                          fontWeight: 'var(--fw-black)',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        🏗️ Constructor Leader
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '20px',
                          background: 'var(--f1-red-primary)',
                          borderRadius: '2px',
                          marginRight: '0.75rem',
                        }}
                      ></div>
                      <span
                        style={{
                          fontFamily: 'var(--font-racing)',
                          color: 'var(--f1-grey-700)',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                          fontWeight: 'var(--fw-bold)',
                        }}
                      >
                        Constructor
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-racing)',
                        fontSize: '1.25rem',
                        fontWeight: 'var(--fw-black)',
                        color: 'var(--f1-grey-900)',
                        lineHeight: '1.2',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {stat.constructorName}
                    </div>{' '}
                    <div
                      style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: '0.9rem',
                        color: 'var(--f1-red-primary)',
                        fontWeight: 'var(--fw-semibold)',
                      }}
                    >
                      {stat.constructorPoints}
                    </div>
                    {/* Second Place Constructor */}
                    {topConstructors?.[1] && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid rgba(220, 38, 38, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background:
                                  'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '0.5rem',
                                fontSize: '0.7rem',
                                fontWeight: 'var(--fw-black)',
                                color: 'var(--f1-grey-900)',
                                fontFamily: 'var(--font-racing)',
                              }}
                            >
                              2
                            </div>
                            <div>
                              <div
                                style={{
                                  fontFamily: 'var(--font-racing)',
                                  fontSize: '0.9rem',
                                  fontWeight: 'var(--fw-bold)',
                                  color: 'var(--f1-grey-800)',
                                  lineHeight: '1.2',
                                }}
                              >
                                {topConstructors[1].name}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-primary)',
                              fontSize: '0.8rem',
                              color: 'var(--f1-grey-600)',
                              fontWeight: 'var(--fw-semibold)',
                            }}
                          >
                            {topConstructors[1].points} pts
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : index === 1 && currentRace?.MRData?.RaceTable?.Races?.[0] ? (
                // Latest Race Card with Grouped Info
                <div style={{ textAlign: 'left' }}>
                  {/* Race Info Group */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      marginBottom: '1.5rem',
                      border: '1px solid rgba(34, 197, 94, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-racing)',
                        fontSize: '1.6rem',
                        fontWeight: 'var(--fw-black)',
                        color: 'var(--f1-grey-900)',
                        lineHeight: '1.2',
                        marginBottom: '0.75rem',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: '0.95rem',
                        color: 'var(--f1-grey-600)',
                        fontWeight: 'var(--fw-medium)',
                        marginBottom: '1rem',
                      }}
                    >
                      📅 {stat.subtitle}
                    </div>

                    {/* Circuit Info - Grouped with Race Info */}
                    {currentRace?.MRData?.RaceTable?.Races?.[0]?.Circuit
                      ?.circuitName && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 0',
                          borderTop: '1px solid rgba(34, 197, 94, 0.15)',
                        }}
                      >
                        <div
                          style={{
                            width: '4px',
                            height: '20px',
                            background: 'var(--f1-success)',
                            borderRadius: '2px',
                          }}
                        ></div>
                        <div>
                          <div
                            style={{
                              fontFamily: 'var(--font-racing)',
                              fontSize: '0.75rem',
                              color: 'var(--f1-grey-700)',
                              textTransform: 'uppercase',
                              letterSpacing: '1.5px',
                              marginBottom: '0.25rem',
                              fontWeight: 'var(--fw-bold)',
                            }}
                          >
                            🏁 Circuit
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-primary)',
                              fontSize: '0.9rem',
                              color: 'var(--f1-success)',
                              fontWeight: 'var(--fw-semibold)',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            {
                              currentRace.MRData.RaceTable.Races[0].Circuit
                                .circuitName
                            }
                          </div>{' '}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Podium Section */}
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-racing)',
                        fontSize: '0.75rem',
                        color: 'var(--f1-grey-700)',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '16px',
                          background: 'var(--f1-success)',
                          borderRadius: '2px',
                          marginRight: '0.5rem',
                        }}
                      ></div>
                      Podium Finishers
                    </div>
                    <RaceTop3
                      top3Finishers={getTop3Finishers()}
                      isLoading={loadingResults}
                    />
                  </div>
                </div>
              ) : index === 2 &&
                nextRace?.MRData?.RaceTable?.Races?.[0]?.date &&
                !isLoading ? (
                // Next Race Card with Enhanced Layout
                <div style={{ textAlign: 'left' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontSize: '1.5rem',
                      fontWeight: 'var(--fw-black)',
                      color: 'var(--f1-grey-900)',
                      lineHeight: '1.2',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--f1-grey-600)',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {stat.subtitle}
                  </div>

                  {/* Countdown Timer */}
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-racing)',
                        fontSize: '0.75rem',
                        color: 'var(--f1-grey-700)',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '16px',
                          background: 'var(--f1-info)',
                          borderRadius: '2px',
                          marginRight: '0.5rem',
                        }}
                      ></div>
                      Event Starts In
                    </div>{' '}
                    <RaceCountdown
                      eventDate={nextRace.MRData.RaceTable.Races[0].date}
                      eventTime={
                        nextRace.MRData.RaceTable.Races[0].time || '00:00:00Z'
                      }
                      eventName=""
                      style={{
                        marginTop: '0',
                        fontSize: '0.85rem',
                      }}
                    />{' '}
                  </div>

                  {/* Race Details Section with Improved Spacing */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      {/* Event Number */}
                      <div
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(59, 130, 246, 0.15)',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow =
                            '0 4px 12px rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            'rgba(59, 130, 246, 0.15)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                        title="Formula 1 Race Round Number"
                        role="button"
                        tabIndex="0"
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-racing)',
                            color: 'var(--f1-grey-800)',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '0.5rem',
                            fontWeight: 'var(--fw-bold)',
                          }}
                        >
                          <span role="img" aria-label="Checkered Flag">
                            🏁
                          </span>{' '}
                          Event
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-primary)',
                            color: 'var(--f1-grey-900)',
                            fontWeight: 'var(--fw-bold)',
                            fontSize: '0.85rem',
                          }}
                        >
                          Round {nextRace.MRData.RaceTable.Races[0].round}
                        </div>
                      </div>

                      {/* Circuit */}
                      <div
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(59, 130, 246, 0.15)',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow =
                            '0 4px 12px rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            'rgba(59, 130, 246, 0.15)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                        title="Racing Circuit Information"
                        role="button"
                        tabIndex="0"
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-racing)',
                            color: 'var(--f1-grey-800)',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '0.5rem',
                            fontWeight: 'var(--fw-bold)',
                          }}
                        >
                          <span role="img" aria-label="Racing Car">
                            🏎️
                          </span>{' '}
                          Circuit
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-primary)',
                            color: 'var(--f1-grey-900)',
                            fontWeight: 'var(--fw-bold)',
                            fontSize: '0.85rem',
                            lineHeight: '1.2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {nextRace.MRData.RaceTable.Races[0].Circuit
                            ?.circuitName || 'TBA'}
                        </div>
                      </div>

                      {/* Location */}
                      <div
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(59, 130, 246, 0.15)',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow =
                            '0 4px 12px rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            'rgba(59, 130, 246, 0.15)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                        title="Race Location"
                        role="button"
                        tabIndex="0"
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-racing)',
                            color: 'var(--f1-grey-800)',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '0.5rem',
                            fontWeight: 'var(--fw-bold)',
                          }}
                        >
                          <span role="img" aria-label="Location Pin">
                            📍
                          </span>{' '}
                          Location
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-primary)',
                            color: 'var(--f1-grey-900)',
                            fontWeight: 'var(--fw-bold)',
                            fontSize: '0.85rem',
                          }}
                        >
                          {nextRace.MRData.RaceTable.Races[0].Circuit?.Location
                            ?.locality || 'TBA'}
                          ,{' '}
                          {nextRace.MRData.RaceTable.Races[0].Circuit?.Location
                            ?.country || 'TBA'}
                        </div>
                      </div>

                      {/* Race Time with Local/UTC Toggle */}
                      <div
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(59, 130, 246, 0.15)',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow =
                            '0 4px 12px rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            'rgba(59, 130, 246, 0.15)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                        onClick={() => {
                          // Toggle between UTC and local time display
                          const timeElement = document.getElementById(
                            `race-time-${nextRace.MRData.RaceTable.Races[0].round}`,
                          );
                          const isUTC = timeElement.dataset.showUtc === 'true';
                          const raceTime =
                            nextRace.MRData.RaceTable.Races[0].time;

                          if (raceTime) {
                            if (isUTC) {
                              // Show local time
                              const localTime = new Date(
                                `1970-01-01T${raceTime}`,
                              ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              });
                              timeElement.textContent = `${localTime} Local`;
                              timeElement.dataset.showUtc = 'false';
                            } else {
                              // Show UTC time
                              const utcTime = new Date(
                                `1970-01-01T${raceTime}`,
                              ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'UTC',
                              });
                              timeElement.textContent = `${utcTime} UTC`;
                              timeElement.dataset.showUtc = 'true';
                            }
                          }
                        }}
                        title="Click to toggle between UTC and local time"
                        role="button"
                        tabIndex="0"
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-racing)',
                            color: 'var(--f1-grey-800)',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '0.5rem',
                            fontWeight: 'var(--fw-bold)',
                          }}
                        >
                          <span role="img" aria-label="Clock">
                            ⏰
                          </span>{' '}
                          Race Start
                        </div>
                        <div
                          id={`race-time-${nextRace.MRData.RaceTable.Races[0].round}`}
                          data-show-utc="true"
                          style={{
                            fontFamily: 'var(--font-primary)',
                            color: 'var(--f1-grey-900)',
                            fontWeight: 'var(--fw-bold)',
                            fontSize: '0.85rem',
                          }}
                        >
                          {nextRace.MRData.RaceTable.Races[0].time
                            ? new Date(
                                `1970-01-01T${nextRace.MRData.RaceTable.Races[0].time}`,
                              ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'UTC',
                              }) + ' UTC'
                            : 'TBA'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Fallback Layout
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontSize: '1.5rem',
                      fontWeight: 'var(--fw-black)',
                      color: 'var(--f1-grey-900)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--f1-grey-600)',
                    }}
                  >
                    {stat.subtitle}
                  </div>
                </div>
              )}{' '}
              {/* Loading State */}
              {stat.showLoader && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${stat.color}20`,
                    boxShadow: `0 4px 15px ${stat.color}10`,
                  }}
                >
                  {' '}
                  <div
                    className="f1-loader"
                    style={{
                      width: '2rem',
                      height: '2rem',
                      '--accent-color': stat.color,
                      margin: '0',
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
