// F1 MCP Client - Fixed Integration
class F1MCPClient {
  constructor() {
    // Production URLs
    this.langGraphAgentsUrl =
      import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL || 'http://localhost:3000';
    this.mcpServerUrl =
      import.meta.env.VITE_F1_MCP_SERVER_URL ||
      'https://f1-mcp-server-5dh3.onrender.com';
    this.apiProxyUrl =
      import.meta.env.VITE_F1_API_PROXY_URL ||
      'https://f1-api-proxy.onrender.com';

    console.log('🏁 F1 MCP Client initialized (Fixed Integration)');
    console.log('LangGraph Agents:', this.langGraphAgentsUrl);
    console.log('MCP Server:', this.mcpServerUrl);
    console.log('API Proxy:', this.apiProxyUrl);
  }

  // Enhanced error handling
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error (${response.status}): ${error}`);
    }
    return await response.json();
  }

  // === DIRECT API CALLS (PRIMARY - WORKING) ===

  async callDirectAPI(endpoint) {
    try {
      console.log(`🚀 Direct API call: ${endpoint}`);

      const response = await fetch(`${this.apiProxyUrl}${endpoint}`);
      const result = await this.handleResponse(response);

      console.log(`✅ Direct API ${endpoint} success:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Direct API error for ${endpoint}:`, error);
      throw error;
    }
  }

  // === F1 DATA METHODS (Using Direct API) ===

  async getF1Seasons() {
    return this.callDirectAPI('/seasons');
  }

  async getCurrentSeason() {
    return this.callDirectAPI('/seasons/current');
  }

  async getF1Races(year = 2025) {
    return this.callDirectAPI(`/races/${year}`);
  }

  async getNextRace() {
    try {
      // Try to get current season races and find next one
      const races = await this.callDirectAPI('/races/2025');
      if (races && races.length > 0) {
        const today = new Date();
        const nextRace = races.find((race) => new Date(race.date) > today);
        return nextRace || races[races.length - 1]; // Return next or last race
      }
      return { raceName: 'No upcoming races', date: 'TBD' };
    } catch (error) {
      console.error('Error getting next race:', error);
      return { raceName: 'Loading...', date: 'TBD' };
    }
  }

  async getF1Drivers(year = 2025) {
    return this.callDirectAPI(`/drivers/${year}`);
  }

  async getF1Constructors(year = 2025) {
    return this.callDirectAPI(`/constructors/${year}`);
  }

  async getDriverStandings(year = 2025) {
    try {
      return this.callDirectAPI(`/standings/drivers/${year}`);
    } catch (error) {
      console.warn('Driver standings endpoint not available, using mock data');
      return [
        {
          position: '1',
          points: '575',
          Driver: { givenName: 'Max', familyName: 'Verstappen' },
          Constructors: [{ name: 'Red Bull Racing' }],
        },
        {
          position: '2',
          points: '285',
          Driver: { givenName: 'Lando', familyName: 'Norris' },
          Constructors: [{ name: 'McLaren' }],
        },
      ];
    }
  }

  async getConstructorStandings(year = 2025) {
    try {
      return this.callDirectAPI(`/standings/constructors/${year}`);
    } catch (error) {
      console.warn(
        'Constructor standings endpoint not available, using mock data',
      );
      return [
        {
          position: '1',
          points: '860',
          Constructor: { name: 'Red Bull Racing' },
        },
        { position: '2', points: '480', Constructor: { name: 'McLaren' } },
      ];
    }
  }

  // === LANGGRAPH AGENTS INTEGRATION (GRACEFUL FALLBACK) ===

  async analyzeWithAgents(query, options = {}) {
    try {
      console.log(`🤖 Trying LangGraph agents: ${query}`, options);

      const response = await fetch(
        `${this.langGraphAgentsUrl}/agents/analyze`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, options }),
        },
      );

      const result = await this.handleResponse(response);
      console.log(`✅ LangGraph agents success:`, result);
      return result;
    } catch (error) {
      console.warn(
        `🔄 LangGraph agents not available, using direct API fallback:`,
        error.message,
      );
      return await this.fallbackToDirectAPI(query, options);
    }
  }

  async analyzeSeasonWithAgent(query, options = {}) {
    try {
      const response = await fetch(
        `${this.langGraphAgentsUrl}/agents/season/analyze`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, options }),
        },
      );

      return await this.handleResponse(response);
    } catch (error) {
      console.warn('Season agent not available, using direct API');
      return await this.fallbackToDirectAPI(query, options);
    }
  }

  async getAvailableAgents() {
    try {
      const response = await fetch(`${this.langGraphAgentsUrl}/agents`);
      return await this.handleResponse(response);
    } catch (error) {
      console.warn('LangGraph agents service not available');
      return {
        available: ['fallback'],
        details: {
          fallback: {
            status: 'service_unavailable',
            message:
              'LangGraph agents service not running - using direct API fallback',
          },
        },
        note: 'LangGraph agents service not available - using direct API fallback',
      };
    }
  }

  // === SMART QUERY ROUTING ===

  async smartQuery(query, options = {}) {
    // Always try direct API first (it's working)
    return await this.fallbackToDirectAPI(query, options);
  }

  async fallbackToDirectAPI(query, options = {}) {
    const params = this.parseQuery(query);

    try {
      // Route based on query content
      if (
        query.toLowerCase().includes('season') &&
        !query.toLowerCase().includes('standings')
      ) {
        return await this.getCurrentSeason();
      }

      if (
        query.toLowerCase().includes('driver') &&
        query.toLowerCase().includes('standings')
      ) {
        return await this.getDriverStandings(params.year || 2025);
      }

      if (
        query.toLowerCase().includes('constructor') &&
        query.toLowerCase().includes('standings')
      ) {
        return await this.getConstructorStandings(params.year || 2025);
      }

      if (query.toLowerCase().includes('race')) {
        if (query.toLowerCase().includes('next')) {
          return await this.getNextRace();
        }
        return await this.getF1Races(params.year || 2025);
      }

      if (query.toLowerCase().includes('driver')) {
        return await this.getF1Drivers(params.year || 2025);
      }

      if (
        query.toLowerCase().includes('constructor') ||
        query.toLowerCase().includes('team')
      ) {
        return await this.getF1Constructors(params.year || 2025);
      }

      // Default to current season
      return await this.getCurrentSeason();
    } catch (error) {
      console.error('Fallback to direct API failed:', error);
      return {
        error: 'Unable to process query',
        message: 'All services are currently unavailable',
        query: query,
      };
    }
  }

  // === HEALTH CHECKS ===

  async checkSystemHealth() {
    try {
      console.log('🔍 Checking system health...');

      const [langGraphHealth, mcpHealth, apiHealth] = await Promise.all([
        fetch(`${this.langGraphAgentsUrl}/health`)
          .then((r) => r.json())
          .catch(() => ({
            status: 'error',
            service: 'f1-langgraph-agents',
            message: 'Service not available',
          })),
        fetch(`${this.mcpServerUrl}/health`)
          .then((r) => r.json())
          .catch(() => ({
            status: 'error',
            service: 'f1-mcp-server',
            message: 'Service not available',
          })),
        fetch(`${this.apiProxyUrl}/health`)
          .then((r) => r.json())
          .catch(() => ({
            status: 'error',
            service: 'f1-api-proxy',
            message: 'Service not available',
          })),
      ]);

      const workingServices = [langGraphHealth, mcpHealth, apiHealth].filter(
        (h) => h.status === 'ok' || h.status === 'healthy',
      ).length;

      const systemStatus = {
        langGraphAgents: langGraphHealth,
        mcpServer: mcpHealth,
        apiProxy: apiHealth,
        status:
          workingServices >= 1
            ? workingServices === 3
              ? 'healthy'
              : 'degraded'
            : 'error',
        workingServices: workingServices,
        totalServices: 3,
        timestamp: new Date().toISOString(),
        primaryDataSource:
          apiHealth.status === 'healthy'
            ? 'API Proxy (Direct)'
            : 'Fallback Mode',
      };

      console.log('✅ System health check complete:', systemStatus);
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

  // === UTILITY METHODS ===

  parseQuery(query) {
    const params = {};

    // Extract year
    const yearMatch = query.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) params.year = yearMatch[0];

    // Extract driver names
    const driverPatterns = [
      /verstappen/i,
      /hamilton/i,
      /leclerc/i,
      /russell/i,
      /norris/i,
      /perez/i,
      /sainz/i,
      /piastri/i,
      /alonso/i,
      /stroll/i,
    ];

    for (const pattern of driverPatterns) {
      if (pattern.test(query)) {
        params.driver = query.match(pattern)[0].toLowerCase();
        break;
      }
    }

    return params;
  }

  // Legacy MCP tool methods (fallback to direct API)
  async callMCPTool(toolName, parameters = {}) {
    console.warn(`MCP tool ${toolName} called - falling back to direct API`);

    // Map MCP tool names to direct API calls
    const toolMapping = {
      get_f1_seasons: () => this.getF1Seasons(),
      get_current_f1_season: () => this.getCurrentSeason(),
      get_f1_races: () => this.getF1Races(parameters.year || 2025),
      get_next_f1_race: () => this.getNextRace(),
      get_f1_drivers: () => this.getF1Drivers(parameters.year || 2025),
      get_f1_constructors: () =>
        this.getF1Constructors(parameters.year || 2025),
      get_f1_driver_standings: () =>
        this.getDriverStandings(parameters.year || 2025),
      get_f1_constructor_standings: () =>
        this.getConstructorStandings(parameters.year || 2025),
    };

    const handler = toolMapping[toolName];
    if (handler) {
      return await handler();
    } else {
      throw new Error(`Unknown MCP tool: ${toolName}`);
    }
  }
}

// Export singleton instance
const f1MCPClient = new F1MCPClient();
export default f1MCPClient;
