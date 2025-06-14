/**
 * Production-Ready Logging Service
 * 
 * Centralized logging with different levels and environment-aware output.
 * Supports structured logging and external service integration.
 */

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

class Logger {
  constructor() {
    this.level = this.getLogLevel();
    this.context = this.getContext();
  }

  getLogLevel() {
    if (typeof window === 'undefined') return LOG_LEVELS.INFO;
    
    // Production: Only errors and warnings
    if (process.env.NODE_ENV === 'production') {
      return LOG_LEVELS.WARN;
    }
    
    // Development: All logs
    return LOG_LEVELS.TRACE;
  }

  getContext() {
    const context = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location?.href : 'server',
      environment: process.env.NODE_ENV || 'development'
    };

    return context;
  }

  shouldLog(level) {
    return level <= this.level;
  }

  formatMessage(level, message, meta = {}) {
    const levelName = Object.keys(LOG_LEVELS)[level];
    
    return {
      level: levelName,
      message,
      meta,
      context: this.getContext()
    };
  }

  output(logEntry) {
    // Console output for development
    if (typeof window !== 'undefined' && window.console) {
      const { level, message, meta } = logEntry;
      
      switch (level) {
        case 'ERROR':
          console.error(`[F1] ${message}`, meta);
          break;
        case 'WARN':
          console.warn(`[F1] ${message}`, meta);
          break;
        case 'INFO':
          console.info(`[F1] ${message}`, meta);
          break;
        case 'DEBUG':
          console.debug(`[F1] ${message}`, meta);
          break;
        case 'TRACE':
          console.trace(`[F1] ${message}`, meta);
          break;
      }
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(logEntry);
    }
  }

  sendToExternalService(logEntry) {
    // Integration point for external logging services
    // (Sentry, LogRocket, DataDog, etc.)
    
    try {
      // Example: Send to Sentry
      if (typeof window !== 'undefined' && window.Sentry) {
        if (logEntry.level === 'ERROR') {
          window.Sentry.captureException(new Error(logEntry.message), {
            extra: logEntry.meta,
            contexts: { custom: logEntry.context }
          });
        } else {
          window.Sentry.addBreadcrumb({
            message: logEntry.message,
            level: logEntry.level.toLowerCase(),
            data: logEntry.meta
          });
        }
      }

      // Example: Send to custom analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'log', {
          event_category: 'F1App',
          event_label: logEntry.level,
          custom_parameter: logEntry.message
        });
      }
    } catch (error) {
      // Fail silently - don't break the app for logging failures
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to send log to external service:', error);
      }
    }
  }

  error(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      const logEntry = this.formatMessage(LOG_LEVELS.ERROR, message, meta);
      this.output(logEntry);
    }
  }

  warn(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      const logEntry = this.formatMessage(LOG_LEVELS.WARN, message, meta);
      this.output(logEntry);
    }
  }

  info(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      const logEntry = this.formatMessage(LOG_LEVELS.INFO, message, meta);
      this.output(logEntry);
    }
  }

  debug(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const logEntry = this.formatMessage(LOG_LEVELS.DEBUG, message, meta);
      this.output(logEntry);
    }
  }

  trace(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.TRACE)) {
      const logEntry = this.formatMessage(LOG_LEVELS.TRACE, message, meta);
      this.output(logEntry);
    }
  }

  // Specialized logging methods
  apiRequest(endpoint, params = {}) {
    this.debug('API Request', { endpoint, params, type: 'api_request' });
  }

  apiResponse(endpoint, response, duration) {
    this.debug('API Response', { 
      endpoint, 
      status: response?.status, 
      duration,
      type: 'api_response' 
    });
  }

  apiError(endpoint, error, duration) {
    this.error('API Error', { 
      endpoint, 
      error: error.message, 
      status: error.response?.status,
      duration,
      type: 'api_error' 
    });
  }

  userAction(action, meta = {}) {
    this.info('User Action', { action, ...meta, type: 'user_action' });
  }

  performance(metric, value, meta = {}) {
    this.info('Performance Metric', { metric, value, ...meta, type: 'performance' });
  }

  // F1-specific logging methods
  raceDataFetch(season, dataType) {
    this.debug('Fetching F1 Data', { season, dataType, type: 'f1_data_fetch' });
  }

  standingsUpdate(season, type, count) {
    this.info('Standings Updated', { season, type, count, type: 'f1_standings_update' });
  }

  circuitBreakerStateChange(state, endpoint) {
    this.warn('Circuit Breaker State Change', { state, endpoint, type: 'circuit_breaker' });
  }
}

// Create singleton instance
const logger = new Logger();

// Export logger instance and convenience functions
export default logger;

// Named exports for convenience
export const { error, warn, info, debug, trace } = logger;
export const { apiRequest, apiResponse, apiError, userAction, performance } = logger;
export const { raceDataFetch, standingsUpdate, circuitBreakerStateChange } = logger;