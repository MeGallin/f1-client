// Enhanced F1 MCP Client for Multi-Agent Orchestrator Integration
// Following SOLID principles and DRY architecture

class F1MCPClient {
  constructor() {
    this.initializeConfiguration();
    this.initializeCache();
    this.logInitialization();
  }

  // === INITIALIZATION METHODS (SOLID: Single Responsibility) ===

  initializeConfiguration() {
    // Production-only configuration - All services live on Render.com
    this.langGraphAgentsUrl = 'https://f1-langgraph-agents.onrender.com';
    this.mcpServerUrl = 'https://f1-mcp-server-5dh3.onrender.com';
    this.apiProxyUrl = 'https://f1-api-proxy.onrender.com';

    // Override with env vars only if they exist and are not localhost
    this.applyEnvironmentOverrides();

    // Request configuration - Optimized for UX
    this.defaultTimeout = 5000;
    this.maxRetries = 1;
  }

  applyEnvironmentOverrides() {
    const envMappings = [
      { env: 'VITE_F1_LANGGRAPH_AGENTS_URL', prop: 'langGraphAgentsUrl' },
      { env: 'VITE_F1_MCP_SERVER_URL', prop: 'mcpServerUrl' },
      { env: 'VITE_F1_API_PROXY_URL', prop: 'apiProxyUrl' },
    ];

    envMappings.forEach(({ env, prop }) => {
      const value = import.meta.env[env];
      if (value && !value.includes('localhost')) {
        this[prop] = value;
      }
    });
  }

  initializeCache() {
    this.driverCache = null;
    this.driverCacheTimestamp = null;
    this.driverCacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }

  logInitialization() {
    console.log(
      '🏁 F1 MCP Client initialized with Multi-Agent Orchestrator support',
    );
    console.log('✅ LangGraph Agents:', this.langGraphAgentsUrl);
    console.log('✅ MCP Server:', this.mcpServerUrl);
    console.log('✅ API Proxy:', this.apiProxyUrl);
    console.log(
      '🔧 Environment:',
      import.meta.env.DEV ? 'Development' : 'Production',
    );
  }

  // === HTTP REQUEST UTILITIES (SOLID: Single Responsibility) ===

  async makeRequest(url, options = {}) {
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

  async requestWithRetry(url, options = {}, retries = this.maxRetries) {
    try {
      return await this.makeRequest(url, options);
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(1000); // 1 second delay between retries
        return this.requestWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  isRetryableError(error) {
    return (
      error.name === 'AbortError' ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('TypeError')
    );
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

  // === MULTI-AGENT ORCHESTRATOR INTEGRATION (SOLID: Interface Segregation) ===

  async analyzeWithAgents(query, options = {}) {
    try {
      console.log(`🤖 Multi-Agent Analysis: "${query}"`, options);

      const requestPayload = this.buildAgentRequest(query, options);
      const response = await this.requestWithRetry(
        `${this.langGraphAgentsUrl}/agents/analyze`,
        {
          method: 'POST',
          body: JSON.stringify(requestPayload),
          timeout: 15000, // Longer timeout for multi-agent processing
        },
      );

      if (!response.ok) {
        throw new Error(
          `Multi-Agent Analysis failed: ${response.status} ${response.statusText}`,
        );
      }

      const result = await this.handleResponse(response);
      return this.enhanceAgentResult(result, options);
    } catch (error) {
      console.error(`❌ Multi-Agent Analysis failed:`, error);
      throw this.enhanceAgentError(error, 'Multi-Agent Analysis');
    }
  }

  buildAgentRequest(query, options) {
    return {
      query,
      options: {
        threadId: options.threadId || `thread_${Date.now()}`,
        includeMetadata: true,
        ...options,
      },
    };
  }

  enhanceAgentResult(result, options) {
    return {
      ...result,
      clientMetadata: {
        timestamp: new Date().toISOString(),
        requestId: options.requestId || `req_${Date.now()}`,
        source: 'f1-mcp-client',
        agentsUrl: this.langGraphAgentsUrl,
      },
    };
  }

  // === SPECIALIZED AGENT ENDPOINTS (SOLID: Open/Closed Principle) ===

  async getAvailableAgents() {
    try {
      console.log('🔍 Discovering Multi-Agent Orchestrator agents...');

      const response = await this.requestWithRetry(
        `${this.langGraphAgentsUrl}/agents`,
        { timeout: 8000 },
      );

      if (!response.ok) {
        throw new Error(
          `Agent discovery failed: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();
      const validatedAgents = this.validateAgentStructure(result);

      console.log('✅ Multi-Agent Orchestrator agents discovered:', {
        totalAgents: Object.keys(validatedAgents.agents || {}).length,
        healthyAgents: validatedAgents.healthStatus?.healthyCount || 0,
        status: validatedAgents.systemStatus,
      });

      return {
        ...validatedAgents,
        systemStatus: 'operational',
        discoveryTimestamp: new Date().toISOString(),
        clientVersion: '2.0.0',
        orchestratorReady: true,
      };
    } catch (error) {
      console.warn(
        '⚠️ Agent discovery failed - providing fallback:',
        error.message,
      );
      return this.getFallbackAgentInfo(error);
    }
  }

  async analyzeSeasonWithAgent(query, options = {}) {
    return this.callSpecializedAgent('season', query, {
      year: options.year || 2025,
      includeStandings: options.includeStandings !== false,
      includeRaces: options.includeRaces !== false,
      ...options,
    });
  }

  async analyzeDriverWithAgent(query, options = {}) {
    return this.callSpecializedAgent('driver', query, {
      year: options.year || 2025,
      includeCareerStats: options.includeCareerStats !== false,
      compareDrivers: options.compareDrivers || false,
      ...options,
    });
  }

  async analyzeRaceWithAgent(query, options = {}) {
    return this.callSpecializedAgent('race', query, {
      year: options.year || 2025,
      round: options.round,
      includeQualifying: options.includeQualifying !== false,
      includeStrategy: options.includeStrategy !== false,
      ...options,
    });
  }

  async analyzeChampionshipWithAgent(query, options = {}) {
    return this.callSpecializedAgent(
      'championship',
      query,
      {
        year: options.year || 2025,
        includePredictions: options.includePredictions !== false,
        includeScenarios: options.includeScenarios !== false,
        ...options,
      },
      12000,
    );
  }

  async analyzeHistoricalWithAgent(query, options = {}) {
    return this.callSpecializedAgent(
      'historical',
      query,
      {
        startYear: options.startYear,
        endYear: options.endYear || 2025,
        includeEras: options.includeEras !== false,
        includeComparisons: options.includeComparisons !== false,
        ...options,
      },
      15000,
    );
  }

  // DRY: Unified method for calling specialized agents
  async callSpecializedAgent(agentType, query, options, timeout = 10000) {
    try {
      console.log(`🎯 ${agentType.toUpperCase()} Agent: "${query}"`, options);

      const response = await this.requestWithRetry(
        `${this.langGraphAgentsUrl}/agents/${agentType}/analyze`,
        {
          method: 'POST',
          body: JSON.stringify({ query, options }),
          timeout,
        },
      );

      const result = await this.handleResponse(response);

      console.log(`✅ ${agentType.toUpperCase()} Agent completed:`, {
        responseLength: result.response?.length || 0,
        confidence: result.confidence,
      });

      return result;
    } catch (error) {
      console.error(`❌ ${agentType.toUpperCase()} Agent failed:`, error);
      throw this.enhanceAgentError(error, `${agentType.toUpperCase()} Agent`);
    }
  }

  // === SMART QUERY ROUTING (SOLID: Dependency Inversion) ===

  async smartQuery(query, options = {}) {
    try {
      console.log('🔄 Attempting Multi-Agent Orchestrator (primary method)...');
      return await this.analyzeWithAgents(query, options);
    } catch (agentError) {
      console.warn(
        '🔄 Multi-Agent Orchestrator failed, falling back to MCP tools:',
        agentError.message,
      );

      return {
        ...(await this.fallbackToMCPTools(query, options)),
        fallbackReason: agentError.message,
        message:
          'Response generated using fallback MCP tools due to agent service unavailability',
      };
    }
  }

  async fallbackToMCPTools(query, options = {}) {
    const params = await this.parseQuery(query);
    const queryLower = query.toLowerCase();

    console.log(`🔍 Parsing query for fallback routing: "${query}"`, params);

    // Route to appropriate fallback handler
    if (this.isDriverComparisonQuery(queryLower, params)) {
      return this.handleDriverComparison(query, params);
    }

    if (this.isCareerStatsQuery(queryLower)) {
      return this.handleCareerStats(query, params);
    }

    if (this.isSeasonQuery(queryLower)) {
      return this.getDriverStandings(params.year || 2025);
    }

    if (this.isSingleDriverQuery(queryLower, params)) {
      return this.handleSingleDriverQuery(query, params);
    }

    if (this.isRaceQuery(queryLower)) {
      return this.getCurrentRace();
    }

    // Default fallback
    console.log('⚡ Using default fallback - current season');
    return this.getCurrentSeason();
  }

  // === QUERY CLASSIFICATION (SOLID: Single Responsibility) ===

  isDriverComparisonQuery(queryLower, params) {
    return (
      queryLower.includes('compare') &&
      (queryLower.includes('driver') || params.drivers?.length > 1)
    );
  }

  isCareerStatsQuery(queryLower) {
    return (
      queryLower.includes('career') ||
      queryLower.includes('statistics') ||
      queryLower.includes('stats')
    );
  }

  isSeasonQuery(queryLower) {
    return (
      queryLower.includes('season') ||
      queryLower.includes('championship') ||
      queryLower.includes('standings')
    );
  }

  isSingleDriverQuery(queryLower, params) {
    return params.drivers?.length === 1 || queryLower.includes('driver');
  }

  isRaceQuery(queryLower) {
    return (
      queryLower.includes('race') ||
      queryLower.includes('next') ||
      queryLower.includes('current')
    );
  }

  // === AGENT UTILITY METHODS (SOLID: Interface Segregation) ===

  validateAgentStructure(agentData) {
    const expectedAgents = [
      'season',
      'driver',
      'race',
      'championship',
      'historical',
    ];

    if (!agentData || typeof agentData !== 'object') {
      return this.createDefaultAgentStructure();
    }

    return {
      agents: this.normalizeAgentData(
        agentData.agents || agentData.available || agentData,
        expectedAgents,
      ),
      healthStatus: this.normalizeHealthStatus(
        agentData.healthStatus || agentData.health || {},
        expectedAgents,
      ),
      systemStatus: agentData.systemStatus || 'operational',
      totalAgents: expectedAgents.length,
    };
  }

  normalizeAgentData(agents, expectedAgents) {
    const normalizedAgents = {};

    expectedAgents.forEach((agentName) => {
      normalizedAgents[agentName] = {
        name: agentName,
        status: 'healthy',
        description: this.getAgentDescription(agentName),
        capabilities: this.getAgentCapabilities(agentName),
      };
    });

    // Override with actual data if available
    if (Array.isArray(agents)) {
      agents.forEach((agent) => {
        if (typeof agent === 'string' && expectedAgents.includes(agent)) {
          normalizedAgents[agent].status = 'healthy';
        }
      });
    } else if (typeof agents === 'object') {
      Object.entries(agents).forEach(([key, value]) => {
        if (expectedAgents.includes(key)) {
          normalizedAgents[key] = { ...normalizedAgents[key], ...value };
        }
      });
    }

    return normalizedAgents;
  }

  normalizeHealthStatus(healthStatus, expectedAgents) {
    const defaultHealth = {
      totalAgents: expectedAgents.length,
      healthyCount: expectedAgents.length,
      unhealthyCount: 0,
      agents: {},
    };

    expectedAgents.forEach((agentName) => {
      defaultHealth.agents[agentName] = 'healthy';
    });

    if (!healthStatus || typeof healthStatus !== 'object') {
      return defaultHealth;
    }

    return {
      totalAgents: healthStatus.totalAgents || expectedAgents.length,
      healthyCount: healthStatus.healthyCount || expectedAgents.length,
      unhealthyCount: healthStatus.unhealthyCount || 0,
      agents: healthStatus.agents || defaultHealth.agents,
    };
  }

  getAgentDescription(agentName) {
    const descriptions = {
      season: 'Season analysis and statistics specialist',
      driver: 'Driver performance and career analysis expert',
      race: 'Race strategy and tactical analysis specialist',
      championship: 'Championship predictions and scenario analysis expert',
      historical: 'Historical data comparison and era analysis specialist',
    };
    return descriptions[agentName] || `${agentName} analysis specialist`;
  }

  getAgentCapabilities(agentName) {
    const capabilities = {
      season: ['season_statistics', 'standings_analysis', 'race_calendar'],
      driver: ['driver_performance', 'career_stats', 'driver_comparison'],
      race: ['race_analysis', 'strategy_insights', 'qualifying_results'],
      championship: [
        'championship_predictions',
        'scenario_analysis',
        'points_simulation',
      ],
      historical: [
        'historical_comparison',
        'era_analysis',
        'legacy_statistics',
      ],
    };
    return capabilities[agentName] || ['general_analysis'];
  }

  createDefaultAgentStructure() {
    const expectedAgents = [
      'season',
      'driver',
      'race',
      'championship',
      'historical',
    ];
    return {
      agents: this.normalizeAgentData({}, expectedAgents),
      healthStatus: this.normalizeHealthStatus({}, expectedAgents),
      systemStatus: 'initializing',
      totalAgents: expectedAgents.length,
    };
  }

  getFallbackAgentInfo(error) {
    return {
      agents: this.createDefaultAgentStructure().agents,
      systemStatus: 'service_unavailable',
      message:
        'Multi-Agent Orchestrator temporarily unavailable - services may be sleeping on Render free tier',
      errorDetails: error.message,
      fallbackMode: true,
      retryRecommendation:
        'Services typically wake up within 30-60 seconds. Please try again shortly.',
      discoveryTimestamp: new Date().toISOString(),
      clientVersion: '2.0.0',
      orchestratorReady: false,
    };
  }

  enhanceAgentError(error, agentType = 'Agent') {
    let enhancedMessage = `${agentType} operation failed: ${error.message}`;

    if (error.name === 'AbortError') {
      enhancedMessage = `${agentType} request timed out - service may be starting up (Render free tier)`;
    } else if (error.message.includes('Failed to fetch')) {
      enhancedMessage = `${agentType} network error - service temporarily unavailable`;
    } else if (error.message.includes('500')) {
      enhancedMessage = `${agentType} server error - service may be restarting`;
    }

    const enhancedError = new Error(enhancedMessage);
    enhancedError.originalError = error;
    enhancedError.agentType = agentType;
    enhancedError.timestamp = new Date().toISOString();

    return enhancedError;
  }

  // === FALLBACK HANDLERS (SOLID: Single Responsibility) ===

  async handleDriverComparison(query, params) {
    try {
      const drivers = params.drivers || (await this.extractDriverNames(query));
      console.log('🔄 Handling driver comparison for:', drivers);

      if (drivers.length < 2) {
        return {
          error: 'Driver comparison requires at least 2 driver names',
          suggestion: 'Try: "Compare Hamilton vs Verstappen"',
          query: query,
          type: 'insufficient_drivers',
        };
      }

      const standingsResponse = await this.getDriverStandings(2025);
      const standings = this.extractStandingsArray(standingsResponse);

      if (!Array.isArray(standings) || standings.length === 0) {
        return {
          error: 'Unable to retrieve driver standings for comparison',
          message: 'No standings data available for 2025 season',
          note: 'This may be because the 2025 season has not started yet',
        };
      }

      const driverStandings = this.filterDriverStandings(standings, drivers);

      return {
        type: 'driver_comparison',
        query: query,
        drivers: drivers,
        comparison: {
          requestedDrivers: drivers,
          foundInStandings: driverStandings.map((standing) =>
            this.formatDriverStanding(standing),
          ),
          totalDriversInSeason: standings.length,
        },
        message: `Driver comparison: ${drivers.join(' vs ')}`,
        note: 'Full career statistics comparison requires Multi-Agent Orchestrator service',
        fallbackUsed: true,
      };
    } catch (error) {
      console.error('❌ Driver comparison fallback failed:', error);
      return this.getCurrentSeason();
    }
  }

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

      const careerData = await this.gatherMultiYearData(drivers);

      return {
        type: 'career_statistics',
        query: query,
        drivers: drivers,
        careerSummary: careerData,
        message: `Career statistics for: ${drivers.join(', ')}`,
        note: 'Limited historical data available in fallback mode - full career data requires Multi-Agent Orchestrator',
        fallbackUsed: true,
      };
    } catch (error) {
      console.error('❌ Career stats fallback failed:', error);
      return this.getCurrentSeason();
    }
  }

  async handleSingleDriverQuery(query, params) {
    try {
      const drivers = params.drivers || (await this.extractDriverNames(query));
      const driver = drivers?.[0];

      console.log('🏎️ Handling single driver query for:', driver);

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
      const standings = this.extractStandingsArray(standingsResponse);

      if (!Array.isArray(standings) || standings.length === 0) {
        return {
          error: 'Unable to retrieve driver standings data',
          message: 'No standings data available for 2025 season',
          note: 'This may be because the 2025 season has not started yet',
        };
      }

      const driverInfo = this.findDriverInStandings(standings, driver);

      return {
        type: 'single_driver',
        query: query,
        driver: driver,
        driverInfo: driverInfo ? this.formatDriverInfo(driverInfo) : null,
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

  // === DATA EXTRACTION UTILITIES (DRY Principle) ===

  extractStandingsArray(standingsResponse) {
    if (
      standingsResponse?.data?.MRData?.StandingsTable?.StandingsLists?.[0]
        ?.DriverStandings
    ) {
      return standingsResponse.data.MRData.StandingsTable.StandingsLists[0]
        .DriverStandings;
    } else if (standingsResponse?.data?.standings) {
      return standingsResponse.data.standings;
    } else if (
      standingsResponse?.data &&
      Array.isArray(standingsResponse.data)
    ) {
      return standingsResponse.data;
    } else if (Array.isArray(standingsResponse)) {
      return standingsResponse;
    }
    return [];
  }

  filterDriverStandings(standings, drivers) {
    return standings.filter((standing) =>
      drivers.some((driver) => this.matchesDriver(standing, driver)),
    );
  }

  matchesDriver(standing, driver) {
    if (!standing?.Driver || !driver) return false;

    const driverLower = driver.toLowerCase();
    const familyName = standing.Driver.familyName?.toLowerCase() || '';
    const givenName = standing.Driver.givenName?.toLowerCase() || '';
    const fullName = `${givenName} ${familyName}`.toLowerCase();

    return (
      familyName.includes(driverLower.split(' ').pop()) ||
      givenName.includes(driverLower.split(' ')[0]) ||
      fullName.includes(driverLower)
    );
  }

  findDriverInStandings(standings, driver) {
    return standings.find((standing) => this.matchesDriver(standing, driver));
  }

  formatDriverStanding(standing) {
    return {
      name: `${standing.Driver?.givenName} ${standing.Driver?.familyName}`,
      position: standing.position,
      points: standing.points,
      team: standing.Constructors?.[0]?.name || 'Unknown',
      wins: standing.wins || 0,
    };
  }

  formatDriverInfo(driverInfo) {
    return {
      name: `${driverInfo.Driver?.givenName} ${driverInfo.Driver?.familyName}`,
      position: driverInfo.position,
      points: driverInfo.points,
      team: driverInfo.Constructors?.[0]?.name || 'Unknown',
      wins: driverInfo.wins || 0,
      nationality: driverInfo.Driver?.nationality || 'Unknown',
    };
  }

  async gatherMultiYearData(drivers) {
    const currentYear = 2025;
    const years = [currentYear, 2024, 2023];
    const careerData = {};

    for (const year of years) {
      try {
        const standingsResponse = await this.getDriverStandings(year);
        const standings = this.extractStandingsArray(standingsResponse);
        careerData[year] = standings.filter((standing) =>
          drivers.some((driver) => this.matchesDriver(standing, driver)),
        );
      } catch (error) {
        console.warn(`⚠️ Failed to get data for year ${year}:`, error.message);
        careerData[year] = [];
      }
    }

    return careerData;
  }

  // === DRIVER CACHE AND EXTRACTION (DRY Principle) ===

  async getCachedDrivers(year = 2025) {
    const now = Date.now();

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
      const drivers = this.extractDriversArray(driversResponse);

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

  extractDriversArray(driversResponse) {
    if (driversResponse?.data?.MRData?.DriverTable?.Drivers) {
      return driversResponse.data.MRData.DriverTable.Drivers;
    } else if (driversResponse?.data?.drivers) {
      return driversResponse.data.drivers;
    } else if (driversResponse?.data && Array.isArray(driversResponse.data)) {
      return driversResponse.data;
    } else if (Array.isArray(driversResponse)) {
      return driversResponse;
    }
    return [];
  }

  async extractDriverNames(query) {
    try {
      const patterns = await this.generateDriverPatterns(2025);
      const foundDrivers = [];

      patterns.forEach((pattern) => {
        if (query.toLowerCase().includes(pattern.name.toLowerCase())) {
          foundDrivers.push(pattern.name);
        }
      });

      return [...new Set(foundDrivers)]; // Remove duplicates
    } catch (error) {
      console.warn('⚠️ Driver name extraction failed:', error.message);
      return [];
    }
  }

  async generateDriverPatterns(year = 2025) {
    const drivers = await this.getCachedDrivers(year);

    return drivers.map((driver) => {
      const givenName = driver.givenName || driver.firstName || '';
      const familyName = driver.familyName || driver.lastName || '';
      const fullName = `${givenName} ${familyName}`.trim();

      return {
        name: fullName,
        familyName: familyName,
        givenName: givenName,
        pattern: new RegExp(`\\b${fullName.replace(/\s+/g, '\\s+')}\\b`, 'i'),
      };
    });
  }

  async parseQuery(query) {
    const params = {};

    // Extract year
    const yearMatch = query.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      params.year = parseInt(yearMatch[0]);
    }

    // Extract driver names using dynamic method
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

  // === MCP TOOLS INTEGRATION ===

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

  // === F1 DATA API METHODS ===

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
      const today = new Date();

      // Find current or next race
      return races; // Simplified for now
    } catch (error) {
      console.error('❌ Failed to get current race:', error);
      throw error;
    }
  }

  async getNextRace() {
    try {
      const races = await this.getF1Races(2025);
      // Logic to find next race
      return races; // Simplified for now
    } catch (error) {
      console.error('❌ Failed to get next race:', error);
      throw error;
    }
  }

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

  // === HEALTH CHECK ===

  async checkSystemHealth() {
    try {
      const healthChecks = await Promise.allSettled([
        this.makeRequest(`${this.langGraphAgentsUrl}/health`),
        this.makeRequest(`${this.mcpServerUrl}/health`),
        this.makeRequest(`${this.apiProxyUrl}/health`),
      ]);

      const healthResults = healthChecks.map((result, index) => ({
        service: ['LangGraph Agents', 'MCP Server', 'API Proxy'][index],
        status:
          result.status === 'fulfilled' && result.value.ok
            ? 'healthy'
            : 'unhealthy',
        url: [this.langGraphAgentsUrl, this.mcpServerUrl, this.apiProxyUrl][
          index
        ],
      }));

      const overallStatus = this.calculateOverallStatus(healthResults);

      return {
        status: overallStatus,
        services: healthResults,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  calculateOverallStatus(healthChecks) {
    const healthyCount = healthChecks.filter(
      (h) => h.status === 'healthy',
    ).length;

    if (healthyCount === healthChecks.length) return 'healthy';
    if (healthyCount >= healthChecks.length / 2) return 'degraded';
    return 'unhealthy';
  }
}

// Export singleton instance
const f1MCPClient = new F1MCPClient();
export default f1MCPClient;
