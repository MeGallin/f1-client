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

// Response caching mechanism
const cache = new Map();

// Request queue for rate limiting
class RequestQueue {
  constructor(maxConcurrent = 3, delayBetweenRequests = 500) {
    this.maxConcurrent = maxConcurrent;
    this.delayBetweenRequests = delayBetweenRequests;
    this.currentRequests = 0;
    this.queue = [];
    this.lastRequestTime = 0;
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
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
      resolve(result);
    } catch (error) {
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
  if (useCache && cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_CONFIG.duration) {
      return cachedData.data;
    }
    // Cache expired, remove it
    cache.delete(cacheKey);
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
          cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
          });
        }

        return response.data;
      } catch (error) {
        // Handle rate limiting specifically
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 2;
          console.warn(
            `Rate limited. Waiting ${retryAfter} seconds before retry...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, retryAfter * 1000),
          );
        }

        if (retries === 0) {
          console.error(
            `API request failed after ${API_CONFIG.retries} retries:`,
            {
              endpoint,
              params,
              error: error.message,
              status: error.response?.status,
            },
          );
          throw error;
        } // Wait before retrying (exponential backoff)
        const delay =
          Math.pow(
            API_CONFIG.rateLimit.retryDelayMultiplier,
            API_CONFIG.retries - retries,
          ) * 1000;
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
};
