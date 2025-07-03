/**
 * F1 Application Configuration
 *
 * This module centralizes all configuration values from environment variables
 * and provides typed access to configuration throughout the application.
 */

// Helper function to parse boolean environment variables
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse number environment variables
const parseNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// API Configuration
export const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_F1_API_BASE_URL || 'https://api.jolpi.ca/ergast/f1',
  format: import.meta.env.VITE_F1_API_FORMAT || 'json',
  timeout: parseNumber(import.meta.env.VITE_F1_API_TIMEOUT, 30000),
  retries: parseNumber(import.meta.env.VITE_F1_API_RETRIES, 3),
  rateLimit: {
    maxConcurrent: parseNumber(
      import.meta.env.VITE_F1_API_MAX_CONCURRENT_REQUESTS,
      3,
    ),
    delayBetweenRequests: parseNumber(
      import.meta.env.VITE_F1_API_DELAY_BETWEEN_REQUESTS,
      500,
    ),
    retryDelayMultiplier: parseNumber(
      import.meta.env.VITE_F1_API_RETRY_DELAY_MULTIPLIER,
      2,
    ),
  },
};

// Cache Configuration
export const CACHE_CONFIG = {
  duration: parseNumber(import.meta.env.VITE_F1_CACHE_DURATION, 300000), // 5 minutes
  maxSize: parseNumber(import.meta.env.VITE_F1_CACHE_MAX_SIZE, 100),
};

// Application Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_F1_APP_NAME || 'F1 Data Explorer',
  version: import.meta.env.VITE_F1_APP_VERSION || '1.0.0',
  defaultSeason: parseNumber(import.meta.env.VITE_F1_DEFAULT_SEASON, 2024),
  defaultRound: parseNumber(import.meta.env.VITE_F1_DEFAULT_ROUND, 1),
};

// UI Configuration
export const UI_CONFIG = {
  defaultTheme: import.meta.env.VITE_F1_DEFAULT_THEME || 'light',
  enableAnimations: parseBoolean(
    import.meta.env.VITE_F1_ENABLE_ANIMATIONS,
    true,
  ),
  sidebarCollapsed: parseBoolean(
    import.meta.env.VITE_F1_SIDEBAR_COLLAPSED,
    false,
  ),
  tablePageSize: parseNumber(import.meta.env.VITE_F1_TABLE_PAGE_SIZE, 20),
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableRaceResults: parseBoolean(
    import.meta.env.VITE_F1_ENABLE_RACE_RESULTS,
    true,
  ),
  enableQualifyingResults: parseBoolean(
    import.meta.env.VITE_F1_ENABLE_QUALIFYING_RESULTS,
    true,
  ),
  enableSprintResults: parseBoolean(
    import.meta.env.VITE_F1_ENABLE_SPRINT_RESULTS,
    false,
  ),
  enableLapTimes: parseBoolean(import.meta.env.VITE_F1_ENABLE_LAP_TIMES, false),
  enablePitStops: parseBoolean(import.meta.env.VITE_F1_ENABLE_PIT_STOPS, false),
  enableCircuits: parseBoolean(import.meta.env.VITE_F1_ENABLE_CIRCUITS, true),
  enableHistoricalData: parseBoolean(
    import.meta.env.VITE_F1_ENABLE_HISTORICAL_DATA,
    true,
  ),
};

// Development Configuration
export const DEV_CONFIG = {
  debugMode: parseBoolean(import.meta.env.VITE_F1_DEBUG_MODE, false),
  logLevel: import.meta.env.VITE_F1_LOG_LEVEL || 'info',
  enableConsoleLogs: parseBoolean(
    import.meta.env.VITE_F1_ENABLE_CONSOLE_LOGS,
    true,
  ),
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  enableLazyLoading: parseBoolean(
    import.meta.env.VITE_F1_ENABLE_LAZY_LOADING,
    true,
  ),
  prefetchNextSeason: parseBoolean(
    import.meta.env.VITE_F1_PREFETCH_NEXT_SEASON,
    false,
  ),
  enableServiceWorker: parseBoolean(
    import.meta.env.VITE_F1_ENABLE_SERVICE_WORKER,
    false,
  ),
};

// External Services Configuration
export const EXTERNAL_CONFIG = {
  analyticsId: import.meta.env.VITE_F1_ANALYTICS_ID || '',
  sentryDsn: import.meta.env.VITE_F1_SENTRY_DSN || '',
  feedbackUrl: import.meta.env.VITE_F1_FEEDBACK_URL || '',
  mcpServerUrl:
    import.meta.env.VITE_F1_MCP_SERVER_URL || 'https://f1-mcp-server-5dh3.onrender.com',
  langgraphAgentsUrl:
    import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL || 'http://localhost:8000',
};

// Environment Detection
export const ENVIRONMENT = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

// Validation function to check if all required environment variables are set
export const validateConfig = () => {
  const requiredVars = ['VITE_F1_API_BASE_URL'];

  const missing = requiredVars.filter((varName) => !import.meta.env[varName]);

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }

  // Log configuration in development mode
  if (DEV_CONFIG.debugMode && DEV_CONFIG.enableConsoleLogs) {
    console.group('🏎️ F1 App Configuration');
    console.log('API Config:', API_CONFIG);
    console.log('App Config:', APP_CONFIG);
    console.log('Feature Flags:', FEATURE_FLAGS);
    console.log('Environment:', ENVIRONMENT);
    console.groupEnd();
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
};

// Default export with all configurations
export default {
  API: API_CONFIG,
  CACHE: CACHE_CONFIG,
  APP: APP_CONFIG,
  UI: UI_CONFIG,
  FEATURES: FEATURE_FLAGS,
  DEV: DEV_CONFIG,
  PERFORMANCE: PERFORMANCE_CONFIG,
  EXTERNAL: EXTERNAL_CONFIG,
  ENVIRONMENT,
  validateConfig,
};
