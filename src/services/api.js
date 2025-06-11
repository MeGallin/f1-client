// Enhanced F1 MCP Client for LangGraph Agents Integration
class F1MCPClient {
  constructor() {
    // Production-only configuration - All services live on Render.com
    this.langGraphAgentsUrl = 'https://f1-langgraph-agents.onrender.com';
    this.mcpServerUrl = 'https://f1-mcp-server-5dh3.onrender.com';
    this.apiProxyUrl = 'https://f1-api-proxy.onrender.com';

    // Debug environment variables
    console.log('🔍 Environment check:');
    console.log(
      'VITE_F1_LANGGRAPH_AGENTS_URL:',
      import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL,
    );
    console.log(
      'VITE_F1_MCP_SERVER_URL:',
      import.meta.env.VITE_F1_MCP_SERVER_URL,
    );
    console.log(
      'VITE_F1_API_PROXY_URL:',
      import.meta.env.VITE_F1_API_PROXY_URL,
    );
    console.log('NODE_ENV:', import.meta.env.NODE_ENV);
    console.log('DEV:', import.meta.env.DEV);

    // Override with env vars only if they exist and are not localhost
    if (
      import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL &&
      !import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL.includes('localhost')
    ) {
      this.langGraphAgentsUrl = import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL;
    }

    if (
      import.meta.env.VITE_F1_MCP_SERVER_URL &&
      !import.meta.env.VITE_F1_MCP_SERVER_URL.includes('localhost')
    ) {
      this.mcpServerUrl = import.meta.env.VITE_F1_MCP_SERVER_URL;
    }

    if (
      import.meta.env.VITE_F1_API_PROXY_URL &&
      !import.meta.env.VITE_F1_API_PROXY_URL.includes('localhost')
    ) {
      this.apiProxyUrl = import.meta.env.VITE_F1_API_PROXY_URL;
    }

    // Request configuration - REDUCED for better UX
    this.defaultTimeout = 5000; // 5 seconds instead of 15
    this.maxRetries = 1; // 1 retry instead of 2

    // Dynamic driver cache
    this.driverCache = null;
    this.driverCacheTimestamp = null;
    this.driverCacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

    console.log('🏁 F1 MCP Client initialized');
    console.log('✅ LangGraph Agents:', this.langGraphAgentsUrl);
    console.log('✅ MCP Server:', this.mcpServerUrl);
    console.log('✅ API Proxy:', this.apiProxyUrl);
    console.log(
      '🔧 Environment:',
      import.meta.env.DEV ? 'Development' : 'Production',
    );
  }

  // Enhanced request method with CORS and retry support
  async makeRequest(url, options = {}) {
    // Extract timeout from options to avoid passing it to fetch
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;

    const defaultOptions = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...fetchOptions.headers,
      },
      credentials: 'omit',
      ...fetchOptions,
    };

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Enhanced retry mechanism
  async requestWithRetry(url, options = {}, retries = this.maxRetries) {
    try {
      return await this.makeRequest(url, options);
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        console.warn(
          `🔄 Retrying request (${retries} attempts left):`,
          error.message,
        );
        await this.delay(1000); // Wait 1 second before retry
        return this.requestWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  // Check if error is retryable
  isRetryableError(error) {
    return (
      error.name === 'AbortError' ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('TypeError')
    );
  }

  // Utility delay function
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Enhanced error handling
  async handleResponse(response) {
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error;

      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          error =
            errorData.message || errorData.error || `HTTP ${response.status}`;
        } catch {
          error = await response.text();
        }
      } else {
        error = await response.text();
      }

      throw new Error(`API Error (${response.status}): ${error}`);
    }
    return await response.json();
  }

  // MCP Tools Integration - Enhanced with retry
  async callMCPTool(toolName, parameters = {}) {
    try {
      console.log(`🔧 Calling MCP tool: ${toolName}`, parameters);

      const response = await this.requestWithRetry(
        `${this.mcpServerUrl}/tools/${toolName}`,
        {
          method: 'POST',
          body: JSON.stringify({ parameters }),
        },
      );

      const result = await this.handleResponse(response);
      console.log(`✅ MCP tool ${toolName} success:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Error calling MCP tool ${toolName}:`, error);
      throw error;
    }
  }

  // Direct API calls - Enhanced with retry
  async callDirectAPI(endpoint) {
    try {
      console.log(`🚀 Direct API call: ${endpoint}`);

      const response = await this.requestWithRetry(
        `${this.apiProxyUrl}${endpoint}`,
      );
      const result = await this.handleResponse(response);

      console.log(`✅ Direct API ${endpoint} success:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Direct API error for ${endpoint}:`, error);
      throw error;
    }
  }

  // === LANGGRAPH AGENTS INTEGRATION (PRIMARY) ===

  // Multi-Agent Analysis - FIXED with proper CORS and retry
  async analyzeWithAgents(query, options = {}) {
    try {
      console.log(`🤖 Analyzing with LangGraph agents: ${query}`, options);

      const response = await this.requestWithRetry(
        `${this.langGraphAgentsUrl}/agents/analyze`,
        {
          method: 'POST',
          body: JSON.stringify({ query, options }),
        },
      );

      const result = await this.handleResponse(response);
      console.log(`✅ LangGraph agents analysis success:`, result);
      return result;
    } catch (error) {
      console.error(`❌ LangGraph agents analysis failed:`, error);

      // Provide more specific error information
      if (error.name === 'AbortError') {
        throw new Error(
          'Request timed out - LangGraph service may be starting up',
        );
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error(
          'Network error - LangGraph service may be temporarily unavailable',
        );
      }

      throw error;
    }
  }

  // Get Available Agents - Enhanced with better error handling
  async getAvailableAgents() {
    try {
      console.log('🔍 Getting available LangGraph agents from live service...');

      const response = await this.requestWithRetry(
        `${this.langGraphAgentsUrl}/agents`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      console.log('✅ Available agents retrieved from live service:', result);
      return {
        ...result,
        systemStatus: 'live_production',
        message: 'LangGraph agents service is live and operational!',
      };
    } catch (error) {
      console.warn(
        '⚠️ LangGraph service error - falling back to direct API:',
        error.message,
      );

      return {
        available: ['seasonAnalysis', 'multiAgent'],
        details: {
          seasonAnalysis: {
            status: 'service_temporarily_unavailable',
            description: 'Season analysis agent (service may be starting up)',
            note: 'Render services may take 30-60 seconds to wake up from sleep',
          },
          multiAgent: {
            status: 'service_temporarily_unavailable',
            description:
              'Multi-agent orchestrator (service may be starting up)',
            note: 'Please try again in a few moments',
          },
        },
        systemStatus: 'service_temporarily_unavailable',
        message:
          'LangGraph service temporarily unavailable. This is normal for Render free tier - services sleep after inactivity.',
        errorDetails: error.message,
      };
    }
  }

  // Season Analysis Agent - Enhanced
  async analyzeSeasonWithAgent(query, options = {}) {
    try {
      console.log(`🏎️ Season analysis with agent: ${query}`, options);

      const response = await this.requestWithRetry(
        `${this.langGraphAgentsUrl}/agents/season/analyze`,
        {
          method: 'POST',
          body: JSON.stringify({ query, options }),
        },
      );

      const result = await this.handleResponse(response);
      console.log(`✅ Season analysis success:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Season analysis failed:`, error);
      throw error;
    }
  }

  // === SMART QUERY ROUTING ===

  // Intelligent query - Enhanced with better fallback messaging
  async smartQuery(query, options = {}) {
    try {
      console.log('🔄 Attempting LangGraph agents (primary method)...');
      return await this.analyzeWithAgents(query, options);
    } catch (agentError) {
      console.warn(
        '🔄 LangGraph agents failed, falling back to direct MCP tools:',
        agentError.message,
      );

      // Provide user-friendly fallback message
      const fallbackResult = await this.fallbackToMCPTools(query, options);

      return {
        ...fallbackResult,
        fallbackUsed: true,
        originalError: agentError.message,
        message:
          'Used direct API fallback - LangGraph agents may be starting up (this is normal on Render free tier)',
      };
    }
  }

  async fallbackToMCPTools(query, options = {}) {
    // Enhanced query parsing for better routing
    const params = await this.parseQuery(query);
    const queryLower = query.toLowerCase();

    console.log(`🔍 Parsing query for fallback routing: "${query}"`, params);

    // Check if we have any drivers at all
    if (!params.drivers || params.drivers.length === 0) {
      console.log('⚠️ No drivers detected in query, using general fallback');

      // Check for specific query patterns even without driver names
      if (queryLower.includes('fastest') || queryLower.includes('speed')) {
        return {
          type: 'general_fastest_query',
          query: query,
          message:
            'Fastest driver queries require specific driver names or LangGraph agents',
          suggestion:
            'Try: "Who is the fastest driver?" or "Max Verstappen speed comparison"',
          fallbackData: await this.getCurrentSeason(),
          fallbackUsed: true,
        };
      }

      // Default to current season for general queries
      return await this.getCurrentSeason();
    }

    // Complex query routing logic

    // Driver comparison queries
    if (
      queryLower.includes('compare') &&
      (queryLower.includes('driver') || params.drivers?.length > 1)
    ) {
      console.log('📊 Detected driver comparison query');
      return await this.handleDriverComparison(query, params);
    }

    // Career statistics queries
    if (
      queryLower.includes('career') ||
      queryLower.includes('statistics') ||
      queryLower.includes('stats')
    ) {
      console.log('📈 Detected career statistics query');
      return await this.handleCareerStats(query, params);
    }

    // Championship/season queries
    if (
      queryLower.includes('season') ||
      queryLower.includes('championship') ||
      queryLower.includes('standings')
    ) {
      console.log('🏆 Detected season/championship query');
      if (params.year) {
        return await this.getDriverStandings(params.year);
      }
      return await this.getDriverStandings(2025);
    }

    // Specific driver queries
    if (params.drivers?.length === 1 || queryLower.includes('driver')) {
      console.log('🏎️ Detected single driver query');
      return await this.handleSingleDriverQuery(query, params);
    }

    // Race-specific queries
    if (
      queryLower.includes('race') ||
      queryLower.includes('next') ||
      queryLower.includes('current')
    ) {
      console.log('🏁 Detected race query');
      if (queryLower.includes('next')) {
        return await this.getNextRace();
      }
      return await this.getCurrentRace();
    }

    // Default fallback
    console.log('⚡ Using default fallback - current season');
    return await this.getCurrentSeason();
  }

  // Handle driver comparison queries
  async handleDriverComparison(query, params) {
    try {
      const drivers = params.drivers || (await this.extractDriverNames(query));
      console.log('🔄 Handling driver comparison for:', drivers);

      if (drivers.length < 2) {
        const standingsResponse = await this.getDriverStandings(2025);
        return {
          error: 'Driver comparison requires at least two drivers',
          suggestion: 'Try: "Compare Max Verstappen and Lewis Hamilton"',
          fallbackData: standingsResponse,
        };
      }

      // Get current standings for comparison context
      const standingsResponse = await this.getDriverStandings(2025);
      console.log('📊 Raw standings response:', standingsResponse);

      // Extract standings array from API response - handle nested structure
      let standings = [];

      if (
        standingsResponse?.data?.MRData?.StandingsTable?.StandingsLists?.[0]
          ?.DriverStandings
      ) {
        standings =
          standingsResponse.data.MRData.StandingsTable.StandingsLists[0]
            .DriverStandings;
      } else if (standingsResponse?.data?.standings) {
        standings = standingsResponse.data.standings;
      } else if (
        standingsResponse?.data &&
        Array.isArray(standingsResponse.data)
      ) {
        standings = standingsResponse.data;
      } else if (Array.isArray(standingsResponse)) {
        standings = standingsResponse;
      }

      console.log('📊 Extracted standings array:', standings);

      if (!Array.isArray(standings) || standings.length === 0) {
        console.warn('⚠️ No valid standings data found:', standingsResponse);
        return {
          error: 'Unable to retrieve driver standings data',
          message: 'No standings data available for 2025 season',
          rawResponse: standingsResponse,
          note: 'This may be because the 2025 season has not started yet',
        };
      }

      // Filter standings to show only the requested drivers
      const driverStandings = standings.filter((standing) =>
        drivers.some(
          (driver) =>
            standing.Driver?.familyName
              ?.toLowerCase()
              .includes(driver.toLowerCase().split(' ').pop()) ||
            standing.Driver?.givenName
              ?.toLowerCase()
              .includes(driver.toLowerCase().split(' ')[0]) ||
            `${standing.Driver?.givenName} ${standing.Driver?.familyName}`
              .toLowerCase()
              .includes(driver.toLowerCase()),
        ),
      );

      return {
        type: 'driver_comparison',
        query: query,
        drivers: drivers,
        comparison: {
          requestedDrivers: drivers,
          foundInStandings: driverStandings.map((standing) => ({
            name: `${standing.Driver?.givenName} ${standing.Driver?.familyName}`,
            position: standing.position,
            points: standing.points,
            team: standing.Constructors?.[0]?.name || 'Unknown',
            wins: standing.wins || 0,
          })),
          totalDriversInSeason: standings.length,
        },
        message: `Driver comparison: ${drivers.join(' vs ')}`,
        note: 'Full career statistics comparison requires LangGraph agents service',
        fallbackUsed: true,
      };
    } catch (error) {
      console.error('❌ Driver comparison fallback failed:', error);
      return await this.getCurrentSeason();
    }
  }

  // Handle career statistics queries
  async handleCareerStats(query, params) {
    try {
      const drivers = params.drivers || (await this.extractDriverNames(query));
      console.log('📊 Handling career stats for:', drivers);

      if (drivers.length === 0) {
        const standingsResponse = await this.getDriverStandings(2025);
        return {
          error: 'Career statistics query requires driver name(s)',
          suggestion: 'Try: "Max Verstappen career statistics"',
          fallbackData: standingsResponse,
        };
      }

      // Get multiple years of data for career context
      const currentYear = 2025;
      const years = [currentYear, 2024, 2023];

      const careerData = {};
      for (const year of years) {
        try {
          const yearStandingsResponse = await this.getDriverStandings(year);

          // Handle nested API response structure
          let yearStandings = [];
          if (
            yearStandingsResponse?.data?.MRData?.StandingsTable
              ?.StandingsLists?.[0]?.DriverStandings
          ) {
            yearStandings =
              yearStandingsResponse.data.MRData.StandingsTable.StandingsLists[0]
                .DriverStandings;
          } else if (yearStandingsResponse?.data?.standings) {
            yearStandings = yearStandingsResponse.data.standings;
          } else if (Array.isArray(yearStandingsResponse?.data)) {
            yearStandings = yearStandingsResponse.data;
          }

          if (Array.isArray(yearStandings) && yearStandings.length > 0) {
            // Filter for requested drivers
            careerData[year] = yearStandings
              .filter((standing) =>
                drivers.some(
                  (driver) =>
                    standing.Driver?.familyName
                      ?.toLowerCase()
                      .includes(driver.toLowerCase().split(' ').pop()) ||
                    `${standing.Driver?.givenName} ${standing.Driver?.familyName}`
                      .toLowerCase()
                      .includes(driver.toLowerCase()),
                ),
              )
              .map((standing) => ({
                name: `${standing.Driver?.givenName} ${standing.Driver?.familyName}`,
                position: standing.position,
                points: standing.points,
                team: standing.Constructors?.[0]?.name || 'Unknown',
                wins: standing.wins || 0,
              }));
          } else {
            careerData[year] = [];
          }
        } catch (error) {
          console.warn(`Could not get data for ${year}:`, error.message);
          careerData[year] = [];
        }
      }

      return {
        type: 'career_statistics',
        query: query,
        drivers: drivers,
        careerSummary: careerData,
        message: `Career statistics for: ${drivers.join(', ')}`,
        note: 'Limited historical data available in fallback mode - full career data requires LangGraph agents',
        fallbackUsed: true,
      };
    } catch (error) {
      console.error('❌ Career stats fallback failed:', error);
      return await this.getCurrentSeason();
    }
  }

  // Handle single driver queries - FIXED null/undefined checks
  async handleSingleDriverQuery(query, params) {
    try {
      const drivers = params.drivers || (await this.extractDriverNames(query));
      const driver = drivers?.[0]; // Safe access

      console.log('🏎️ Handling single driver query for:', driver);

      // If no driver found, return helpful message
      if (!driver) {
        const standingsResponse = await this.getDriverStandings(2025);
        return {
          error: 'No driver name detected in query',
          suggestion: 'Try: "Max Verstappen" or "Lewis Hamilton stats"',
          query: query,
          fallbackData: standingsResponse,
          type: 'no_driver_detected',
        };
      }

      const standingsResponse = await this.getDriverStandings(2025);

      // Handle nested API response structure
      let standings = [];
      if (
        standingsResponse?.data?.MRData?.StandingsTable?.StandingsLists?.[0]
          ?.DriverStandings
      ) {
        standings =
          standingsResponse.data.MRData.StandingsTable.StandingsLists[0]
            .DriverStandings;
      } else if (standingsResponse?.data?.standings) {
        standings = standingsResponse.data.standings;
      } else if (
        standingsResponse?.data &&
        Array.isArray(standingsResponse.data)
      ) {
        standings = standingsResponse.data;
      } else if (Array.isArray(standingsResponse)) {
        standings = standingsResponse;
      }

      if (!Array.isArray(standings) || standings.length === 0) {
        return {
          error: 'Unable to retrieve driver standings data',
          message: 'No standings data available for 2025 season',
          note: 'This may be because the 2025 season has not started yet',
        };
      }

      // Find the specific driver in standings - FIXED with proper null checks
      const driverInfo = standings.find((standing) => {
        if (!standing?.Driver || !driver) return false;

        const driverLower = driver.toLowerCase();
        const familyName = standing.Driver.familyName?.toLowerCase() || '';
        const givenName = standing.Driver.givenName?.toLowerCase() || '';
        const fullName = `${givenName} ${familyName}`.toLowerCase();

        // Check if driver query matches family name, given name, or full name
        return (
          familyName.includes(driverLower.split(' ').pop()) ||
          givenName.includes(driverLower.split(' ')[0]) ||
          fullName.includes(driverLower)
        );
      });

      return {
        type: 'single_driver',
        query: query,
        driver: driver,
        driverInfo: driverInfo
          ? {
              name: `${driverInfo.Driver?.givenName} ${driverInfo.Driver?.familyName}`,
              position: driverInfo.position,
              points: driverInfo.points,
              team: driverInfo.Constructors?.[0]?.name || 'Unknown',
              wins: driverInfo.wins || 0,
              nationality: driverInfo.Driver?.nationality || 'Unknown',
            }
          : null,
        message: driverInfo
          ? `Current season info for ${driverInfo.Driver?.givenName} ${driverInfo.Driver?.familyName}`
          : `Driver "${driver}" not found in current standings`,
        fallbackUsed: true,
      };
    } catch (error) {
      console.error('❌ Single driver query fallback failed:', error);
      return {
        error: 'Single driver query failed',
        message: error.message,
        query: query,
        fallbackData: await this.getCurrentSeason(),
        type: 'single_driver_error',
      };
    }
  }

  // Dynamic driver cache management
  async getCachedDrivers(year = 2025) {
    const now = Date.now();

    // Check if cache is valid
    if (
      this.driverCache &&
      this.driverCacheTimestamp &&
      now - this.driverCacheTimestamp < this.driverCacheExpiry
    ) {
      console.log('📋 Using cached driver data');
      return this.driverCache;
    }

    try {
      console.log('🔄 Fetching fresh driver data...');
      const driversResponse = await this.getF1Drivers(year);

      // Handle nested API response structure
      let drivers = [];
      if (driversResponse?.data?.MRData?.DriverTable?.Drivers) {
        drivers = driversResponse.data.MRData.DriverTable.Drivers;
      } else if (driversResponse?.data?.drivers) {
        drivers = driversResponse.data.drivers;
      } else if (Array.isArray(driversResponse?.data)) {
        drivers = driversResponse.data;
      } else if (Array.isArray(driversResponse)) {
        drivers = driversResponse;
      }

      this.driverCache = drivers;
      this.driverCacheTimestamp = now;

      console.log(`✅ Cached ${drivers.length} drivers`);
      return drivers;
    } catch (error) {
      console.warn(
        '⚠️ Failed to fetch drivers, using existing cache:',
        error.message,
      );
      return this.driverCache || [];
    }
  }

  // Generate dynamic driver patterns from current driver data
  async generateDriverPatterns(year = 2025) {
    const drivers = await this.getCachedDrivers(year);

    return drivers.map((driver) => {
      const givenName = driver.givenName || driver.firstName || '';
      const familyName = driver.familyName || driver.lastName || '';
      const fullName = `${givenName} ${familyName}`.trim();

      // Create flexible pattern that matches various forms
      const patterns = [
        familyName.toLowerCase(),
        `${givenName}\\s+${familyName}`.toLowerCase(),
        fullName.toLowerCase(),
      ].filter(Boolean);

      const patternString = patterns.join('|');

      return {
        pattern: new RegExp(patternString, 'i'),
        name: fullName,
        givenName,
        familyName,
        driverId: driver.driverId,
      };
    });
  }

  // Extract driver names from query text - now dynamic
  async extractDriverNames(query) {
    try {
      const driverPatterns = await this.generateDriverPatterns();
      const drivers = [];

      for (const { pattern, name } of driverPatterns) {
        if (pattern.test(query)) {
          drivers.push(name);
        }
      }

      return [...new Set(drivers)]; // Remove duplicates
    } catch (error) {
      console.warn(
        '⚠️ Could not extract drivers dynamically, using basic extraction:',
        error.message,
      );

      // Fallback to simple word-based extraction
      const words = query.toLowerCase().split(/\s+/);
      const possibleDrivers = words.filter(
        (word) =>
          word.length > 3 &&
          /^[a-zA-Z]+$/.test(word) &&
          ![
            'driver',
            'compare',
            'versus',
            'career',
            'statistics',
            'season',
            'championship',
          ].includes(word),
      );

      return possibleDrivers.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1),
      );
    }
  }

  // Enhanced query parsing - updated to use dynamic extraction
  async parseQuery(query) {
    const params = {};

    // Extract year
    const yearMatch = query.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) params.year = yearMatch[0];

    // Extract driver names using the dynamic method
    params.drivers = await this.extractDriverNames(query);

    // Extract query type indicators
    params.isComparison =
      query.toLowerCase().includes('compare') ||
      query.toLowerCase().includes('vs');
    params.isCareerStats =
      query.toLowerCase().includes('career') ||
      query.toLowerCase().includes('statistics');
    params.isRaceQuery =
      query.toLowerCase().includes('race') ||
      query.toLowerCase().includes('next');

    return params;
  }

  // Season & Race Tools - FIXED TO USE DIRECT API
  async getF1Seasons() {
    return this.callDirectAPI('/seasons');
  }

  async getCurrentSeason() {
    return this.callDirectAPI('/seasons/2025');
  }

  async getF1Races(year = 2025) {
    return this.callDirectAPI(`/races/${year}`);
  }

  async getF1RaceDetails(year, round) {
    return this.callDirectAPI(`/results/${year}/${round}`);
  }

  async getCurrentRace() {
    try {
      const races = await this.getF1Races(2025);
      return (
        races.find((race) => new Date(race.date) >= new Date()) || races[0]
      );
    } catch (error) {
      console.warn('Could not get current race, using fallback');
      return { raceName: 'Loading...', date: 'TBD', circuitName: 'TBD' };
    }
  }

  async getNextRace() {
    try {
      const races = await this.getF1Races(2025);
      const nextRace = races.find((race) => new Date(race.date) > new Date());
      return nextRace || races[races.length - 1];
    } catch (error) {
      console.warn('Could not get next race, using fallback');
      return { raceName: 'Loading...', date: 'TBD', circuitName: 'TBD' };
    }
  }

  // Driver & Team Tools - FIXED TO USE DIRECT API
  async getF1Drivers(year = 2025) {
    return this.callDirectAPI(`/drivers/${year}`);
  }

  async getDriverDetails(driverId, year = 2025) {
    return this.callDirectAPI(`/drivers/${year}/${driverId}`);
  }

  async getF1Constructors(year = 2025) {
    return this.callDirectAPI(`/constructors/${year}`);
  }

  async getConstructorDetails(constructorId, year = 2025) {
    return this.callDirectAPI(`/constructors/${year}/${constructorId}`);
  }

  // Results & Standings Tools - FIXED TO USE DIRECT API
  async getRaceResults(year, round) {
    return this.callDirectAPI(`/results/${year}/${round}`);
  }

  async getQualifyingResults(year, round) {
    return this.callDirectAPI(`/qualifying/${year}/${round}`);
  }

  async getDriverStandings(year = 2025) {
    return this.callDirectAPI(`/standings/${year}`);
  }

  async getConstructorStandings(year = 2025) {
    return this.callDirectAPI(`/standings/${year}/constructors`);
  }

  // === DIRECT API ENDPOINTS (Faster for simple queries) ===

  async getSeasonsDirect() {
    return this.callDirectAPI('/seasons');
  }

  async getCurrentSeasonDirect() {
    return this.callDirectAPI('/seasons/current');
  }

  async getRacesDirect(year = 2025) {
    return this.callDirectAPI(`/races/${year}`);
  }

  async getDriversDirect(year = 2025) {
    return this.callDirectAPI(`/drivers/${year}`);
  }

  async getConstructorsDirect(year = 2025) {
    return this.callDirectAPI(`/constructors/${year}`);
  }

  // === ENHANCED HEALTH CHECKS ===

  async checkSystemHealth() {
    try {
      console.log('🔍 Checking complete system health...');

      const healthPromises = [
        this.requestWithRetry(`${this.langGraphAgentsUrl}/health`, {
          timeout: 3000, // Reduced to 3 seconds
        })
          .then((r) => r.json())
          .catch((error) => ({
            status: 'error',
            service: 'f1-langgraph-agents',
            error: error.message,
            note: 'Service may be sleeping on Render free tier',
          })),
        this.requestWithRetry(`${this.mcpServerUrl}/health`, { timeout: 3000 })
          .then((r) => r.json())
          .catch((error) => ({
            status: 'error',
            service: 'f1-mcp-server',
            error: error.message,
          })),
        this.requestWithRetry(`${this.apiProxyUrl}/health`, { timeout: 3000 })
          .then((r) => r.json())
          .catch((error) => ({
            status: 'error',
            service: 'f1-api-proxy',
            error: error.message,
          })),
      ];

      const [langGraphHealth, mcpHealth, apiHealth] = await Promise.all(
        healthPromises,
      );

      const systemStatus = {
        langGraphAgents: langGraphHealth,
        mcpServer: mcpHealth,
        apiProxy: apiHealth,
        status: this.calculateOverallStatus([
          langGraphHealth,
          mcpHealth,
          apiHealth,
        ]),
        timestamp: new Date().toISOString(),
        integrationFlow:
          'UI → LangGraph Agents → MCP Server → API Proxy → Jolpica F1 API',
        note: 'Render free tier services may take 30-60 seconds to wake up from sleep',
      };

      console.log('✅ Complete system health check:', systemStatus);
      return systemStatus;
    } catch (error) {
      console.error('❌ System health check failed:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  calculateOverallStatus(healthChecks) {
    const healthyCount = healthChecks.filter(
      (h) => h.status === 'ok' || h.status === 'healthy',
    ).length;

    if (healthyCount === healthChecks.length) return 'healthy';
    if (healthyCount >= healthChecks.length / 2) return 'degraded';
    return 'error';
  }

  // === UTILITY METHODS ===

  async testAllMCPTools() {
    const tools = [
      'get_f1_seasons',
      'get_current_f1_season',
      'get_f1_races',
      'get_current_f1_race',
      'get_next_f1_race',
      'get_f1_drivers',
      'get_f1_constructors',
      'get_f1_driver_standings',
      'get_f1_constructor_standings',
    ];

    const results = {};

    for (const tool of tools) {
      try {
        const result = await this.callMCPTool(tool, { year: '2025' });
        results[tool] = { status: 'success', data: result };
      } catch (error) {
        results[tool] = { status: 'error', error: error.message };
      }
    }

    return results;
  }
}

// Export singleton instance
const f1MCPClient = new F1MCPClient();
export default f1MCPClient;
