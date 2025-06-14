/**
 * F1 API Service
 * A comprehensive service to interact with the F1 API endpoints
 * Based on the Ergast F1 API (https://api.jolpi.ca/ergast/f1)
 */

import axios from 'axios';
import { API_CONFIG, CACHE_CONFIG, DEV_CONFIG } from '../config';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  params: {
    format: API_CONFIG.format,
  },
});

// Response caching mechanism with size limit and LRU eviction
class CacheManager {
  constructor(maxSize = 100, ttl = 300000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Move to end for LRU
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.data;
  }

  set(key, data) {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

const cache = new CacheManager();

// Circuit breaker pattern for API resilience
class CircuitBreaker {
  constructor(failureThreshold = 5, timeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }

  canExecute() {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.timeout) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true; // HALF_OPEN
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

// Request queue for rate limiting with circuit breaker
class RequestQueue {
  constructor(maxConcurrent = 3, delayBetweenRequests = 500) {
    this.maxConcurrent = maxConcurrent;
    this.delayBetweenRequests = delayBetweenRequests;
    this.currentRequests = 0;
    this.queue = [];
    this.lastRequestTime = 0;
    this.circuitBreaker = new CircuitBreaker();
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      if (!this.circuitBreaker.canExecute()) {
        reject(new Error('Circuit breaker is OPEN - API temporarily unavailable'));
        return;
      }
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.currentRequests >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { requestFn, resolve, reject } = this.queue.shift();
    this.currentRequests++;

    try {
      // Ensure minimum delay between requests
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.delayBetweenRequests) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.delayBetweenRequests - timeSinceLastRequest),
        );
      }

      this.lastRequestTime = Date.now();
      const result = await requestFn();
      this.circuitBreaker.onSuccess();
      resolve(result);
    } catch (error) {
      this.circuitBreaker.onFailure();
      reject(error);
    } finally {
      this.currentRequests--;
      // Process next item in queue
      setTimeout(() => this.processQueue(), 0);
    }
  }
}

const requestQueue = new RequestQueue(
  API_CONFIG.rateLimit.maxConcurrent,
  API_CONFIG.rateLimit.delayBetweenRequests,
);

/**
 * Makes an API request with caching, retry functionality, and rate limiting
 * @param {string} endpoint - API endpoint
 * @param {Object} params - URL parameters
 * @param {boolean} useCache - Whether to use cache
 * @returns {Promise} - The API response
 */
const makeRequest = async (endpoint, params = {}, useCache = true) => {
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
  
  // Check cache if enabled
  if (useCache) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  // Add request to queue for rate limiting
  return requestQueue.add(async () => {
    // Make the actual request with retries
    let retries = API_CONFIG.retries;

    while (retries >= 0) {
      try {
        const response = await apiClient.get(endpoint, { params });

        // Cache the response if caching is enabled
        if (useCache) {
          cache.set(cacheKey, response.data);
        }

        return response.data;
      } catch (error) {
        // Handle rate limiting specifically
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 2;
          if (typeof window !== 'undefined' && window.console) {
            console.warn(`Rate limited. Waiting ${retryAfter} seconds before retry...`);
          }
          await new Promise((resolve) =>
            setTimeout(resolve, retryAfter * 1000),
          );
        }

        if (retries === 0) {
          // Enhanced error with context for better debugging
          const enhancedError = new Error(`API request failed: ${error.message}`);
          enhancedError.originalError = error;
          enhancedError.endpoint = endpoint;
          enhancedError.params = params;
          enhancedError.status = error.response?.status;
          enhancedError.circuitBreakerState = requestQueue.circuitBreaker.state;
          
          if (typeof window !== 'undefined' && window.console) {
            console.error('API request failed after retries:', {
              endpoint,
              params,
              error: error.message,
              status: error.response?.status,
              circuitBreakerState: requestQueue.circuitBreaker.state
            });
          }
          throw enhancedError;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(
          Math.pow(API_CONFIG.rateLimit.retryDelayMultiplier, API_CONFIG.retries - retries) * 1000,
          30000 // Max 30 seconds
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries--;
      }
    }
  });
};

/**
 * Seasons API endpoints
 */
export const SeasonsAPI = {
  /**
   * Get all F1 seasons
   * @param {boolean} useCache - Whether to use cache
   */
  getAllSeasons: (useCache = true) => makeRequest('/seasons', {}, useCache),

  /**
   * Get specific season information
   * @param {number} year - Season year
   * @param {boolean} useCache - Whether to use cache
   */
  getSeason: (year, useCache = true) =>
    makeRequest(`/seasons/${year}`, {}, useCache),

  /**
   * Get current season information
   * @param {boolean} useCache - Whether to use cache
   */
  getCurrentSeason: (useCache = true) => makeRequest('/current', {}, useCache),
};

/**
 * Races API endpoints
 */
export const RacesAPI = {
  /**
   * Get all races for a specific season
   * @param {number} year - Season year
   * @param {boolean} useCache - Whether to use cache
   */
  getAllRaces: (year, useCache = true) => makeRequest(`/${year}`, {}, useCache),

  /**
   * Get specific race by round
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {boolean} useCache - Whether to use cache
   */
  getRace: (year, round, useCache = true) =>
    makeRequest(`/${year}/${round}`, {}, useCache),

  /**
   * Get current race
   * @param {boolean} useCache - Whether to use cache
   */
  getCurrentRace: (useCache = true) =>
    makeRequest('/current/last', {}, useCache),

  /**
   * Get next race
   * @param {boolean} useCache - Whether to use cache
   */
  getNextRace: (useCache = true) => makeRequest('/current/next', {}, useCache),
};

/**
 * Drivers API endpoints
 */
export const DriversAPI = {
  /**
   * Get all drivers
   * @param {boolean} useCache - Whether to use cache
   */
  getAllDrivers: (useCache = true) => makeRequest('/drivers', {}, useCache),

  /**
   * Get drivers for a specific season
   * @param {number} year - Season year
   * @param {boolean} useCache - Whether to use cache
   */
  getDriversByYear: (year, useCache = true) =>
    makeRequest(`/${year}/drivers`, {}, useCache),

  /**
   * Get specific driver information
   * @param {string} driverId - Driver ID
   * @param {boolean} useCache - Whether to use cache
   */
  getDriver: (driverId, useCache = true) =>
    makeRequest(`/drivers/${driverId}`, {}, useCache),

  /**
   * Get specific driver information for a specific season
   * @param {number} year - Season year
   * @param {string} driverId - Driver ID
   * @param {boolean} useCache - Whether to use cache
   */
  getDriverByYear: (year, driverId, useCache = true) =>
    makeRequest(`/${year}/drivers/${driverId}`, {}, useCache),
};

/**
 * Constructors API endpoints
 */
export const ConstructorsAPI = {
  /**
   * Get all constructors
   * @param {boolean} useCache - Whether to use cache
   */
  getAllConstructors: (useCache = true) =>
    makeRequest('/constructors', {}, useCache),

  /**
   * Get constructors for a specific season
   * @param {number} year - Season year
   * @param {boolean} useCache - Whether to use cache
   */
  getConstructorsByYear: (year, useCache = true) =>
    makeRequest(`/${year}/constructors`, {}, useCache),

  /**
   * Get specific constructor information
   * @param {string} constructorId - Constructor ID
   * @param {boolean} useCache - Whether to use cache
   */
  getConstructor: (constructorId, useCache = true) =>
    makeRequest(`/constructors/${constructorId}`, {}, useCache),

  /**
   * Get specific constructor information for a specific season
   * @param {number} year - Season year
   * @param {string} constructorId - Constructor ID
   * @param {boolean} useCache - Whether to use cache
   */
  getConstructorByYear: (year, constructorId, useCache = true) =>
    makeRequest(`/${year}/constructors/${constructorId}`, {}, useCache),
};

/**
 * Results API endpoints
 */
export const ResultsAPI = {
  /**
   * Get race results for a specific season
   * @param {number} year - Season year
   * @param {boolean} useCache - Whether to use cache
   */
  getResultsBySeason: (year, useCache = true) =>
    makeRequest(`/${year}/results`, {}, useCache),

  /**
   * Get race results for a specific race
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {boolean} useCache - Whether to use cache
   */
  getRaceResults: (year, round, useCache = true) =>
    makeRequest(`/${year}/${round}/results`, {}, useCache),

  /**
   * Get qualifying results for a specific race
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {boolean} useCache - Whether to use cache
   */
  getQualifyingResults: (year, round, useCache = true) =>
    makeRequest(`/${year}/${round}/qualifying`, {}, useCache),
};

/**
 * Standings API endpoints
 */
export const StandingsAPI = {
  /**
   * Get driver standings for a specific season
   * @param {number} year - Season year
   * @param {boolean} useCache - Whether to use cache
   */
  getDriverStandings: (year, useCache = true) =>
    makeRequest(`/${year}/driverStandings`, {}, useCache),

  /**
   * Get constructor standings for a specific season
   * @param {number} year - Season year
   * @param {boolean} useCache - Whether to use cache
   */
  getConstructorStandings: (year, useCache = true) =>
    makeRequest(`/${year}/constructorStandings`, {}, useCache),

  /**
   * Get current driver standings
   * @param {boolean} useCache - Whether to use cache
   */
  getCurrentDriverStandings: (useCache = true) =>
    makeRequest('/current/driverStandings', {}, useCache),

  /**
   * Get current constructor standings
   * @param {boolean} useCache - Whether to use cache
   */
  getCurrentConstructorStandings: (useCache = true) =>
    makeRequest('/current/constructorStandings', {}, useCache),
};

/**
 * Circuit API endpoints
 */
export const CircuitsAPI = {
  /**
   * Get all circuits
   * @param {boolean} useCache - Whether to use cache
   */
  getAllCircuits: (useCache = true) => makeRequest('/circuits', {}, useCache),

  /**
   * Get circuits for a specific season
   * @param {number} year - Season year
   * @param {boolean} useCache - Whether to use cache
   */
  getCircuitsByYear: (year, useCache = true) =>
    makeRequest(`/${year}/circuits`, {}, useCache),

  /**
   * Get specific circuit information
   * @param {string} circuitId - Circuit ID
   * @param {boolean} useCache - Whether to use cache
   */
  getCircuit: (circuitId, useCache = true) =>
    makeRequest(`/circuits/${circuitId}`, {}, useCache),
};

/**
 * Lap Times API endpoints
 */
export const LapsAPI = {
  /**
   * Get lap times for a specific race
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {boolean} useCache - Whether to use cache
   */
  getLapTimes: (year, round, useCache = true) =>
    makeRequest(`/${year}/${round}/laps`, {}, useCache),

  /**
   * Get lap times for a specific driver in a specific race
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {string} driverId - Driver ID
   * @param {boolean} useCache - Whether to use cache
   */
  getDriverLapTimes: (year, round, driverId, useCache = true) =>
    makeRequest(`/${year}/${round}/drivers/${driverId}/laps`, {}, useCache),

  /**
   * Get specific lap time for a specific race
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {number} lap - Lap number
   * @param {boolean} useCache - Whether to use cache
   */
  getSpecificLap: (year, round, lap, useCache = true) =>
    makeRequest(`/${year}/${round}/laps/${lap}`, {}, useCache),
};

/**
 * Pit Stops API endpoints
 */
export const PitStopsAPI = {
  /**
   * Get pit stops for a specific race
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {boolean} useCache - Whether to use cache
   */
  getPitStops: (year, round, useCache = true) =>
    makeRequest(`/${year}/${round}/pitstops`, {}, useCache),

  /**
   * Get pit stops for a specific driver in a specific race
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {string} driverId - Driver ID
   * @param {boolean} useCache - Whether to use cache
   */
  getDriverPitStops: (year, round, driverId, useCache = true) =>
    makeRequest(`/${year}/${round}/drivers/${driverId}/pitstops`, {}, useCache),
};

/**
 * Status API endpoints
 */
export const StatusAPI = {
  /**
   * Get all status codes
   * @param {boolean} useCache - Whether to use cache
   */
  getAllStatusCodes: (useCache = true) => makeRequest('/status', {}, useCache),
};

/**
 * Sprint API endpoints
 */
export const SprintAPI = {
  /**
   * Get sprint results for a specific race
   * @param {number} year - Season year
   * @param {number} round - Race round number
   * @param {boolean} useCache - Whether to use cache
   */
  getSprintResults: (year, round, useCache = true) =>
    makeRequest(`/${year}/${round}/sprint`, {}, useCache),
};

// API Health monitoring
export const APIHealth = {
  getMetrics: () => ({
    cacheSize: cache.size(),
    queueSize: requestQueue.queue.length,
    activeRequests: requestQueue.currentRequests,
    circuitBreakerState: requestQueue.circuitBreaker.state,
    circuitBreakerFailures: requestQueue.circuitBreaker.failureCount
  }),
  
  clearCache: () => cache.clear(),
  
  isHealthy: () => requestQueue.circuitBreaker.state !== 'OPEN'
};

// Export combined API
export default {
  SeasonsAPI,
  RacesAPI,
  DriversAPI,
  ConstructorsAPI,
  ResultsAPI,
  StandingsAPI,
  CircuitsAPI,
  LapsAPI,
  PitStopsAPI,
  StatusAPI,
  SprintAPI,
  APIHealth,
};
