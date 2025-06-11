// Enhanced F1 MCP Client for LangGraph Agents Integration
class F1MCPClient {
  constructor() {
    // Your live production URLs - UPDATED INTEGRATION FLOW
    this.langGraphAgentsUrl =
      import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL || 'http://localhost:3000';
    this.mcpServerUrl =
      import.meta.env.VITE_F1_MCP_SERVER_URL ||
      'https://f1-mcp-server-5dh3.onrender.com';
    this.apiProxyUrl =
      import.meta.env.VITE_F1_API_PROXY_URL ||
      'https://f1-api-proxy.onrender.com';

    console.log('🏁 F1 MCP Client initialized with LangGraph Agents');
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

  // MCP Tools Integration - Using the exact endpoints from your production system
  async callMCPTool(toolName, parameters = {}) {
    try {
      console.log(`🔧 Calling MCP tool: ${toolName}`, parameters);

      const response = await fetch(`${this.mcpServerUrl}/tools/${toolName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parameters }),
      });

      const result = await this.handleResponse(response);
      console.log(`✅ MCP tool ${toolName} success:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Error calling MCP tool ${toolName}:`, error);
      throw error;
    }
  }

  // Direct API calls for faster queries (using your f1-api-proxy endpoints)
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

  // === LANGGRAPH AGENTS INTEGRATION (PRIMARY) ===

  // Multi-Agent Analysis (Primary Method)
  async analyzeWithAgents(query, options = {}) {
    try {
      console.log(`🤖 Analyzing with LangGraph agents: ${query}`, options);

      const response = await fetch(
        `${this.langGraphAgentsUrl}/agents/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, options }),
        },
      );

      const result = await this.handleResponse(response);
      console.log(`✅ LangGraph agents analysis success:`, result);
      return result;
    } catch (error) {
      console.error(`❌ LangGraph agents analysis failed:`, error);
      throw error;
    }
  }

  // Season Analysis Agent
  async analyzeSeasonWithAgent(query, options = {}) {
    try {
      console.log(`🏎️ Season analysis with agent: ${query}`, options);

      const response = await fetch(
        `${this.langGraphAgentsUrl}/agents/season/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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

  // Get Available Agents
  async getAvailableAgents() {
    try {
      console.log('🔍 Getting available LangGraph agents...');

      const response = await fetch(`${this.langGraphAgentsUrl}/agents`);
      const result = await this.handleResponse(response);

      console.log('✅ Available agents retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to get available agents:', error);
      throw error;
    }
  }

  // === SMART QUERY ROUTING ===

  // Intelligent query that routes to appropriate agent or MCP tool
  async smartQuery(query, options = {}) {
    try {
      // First try with LangGraph agents (more intelligent)
      return await this.analyzeWithAgents(query, options);
    } catch (agentError) {
      console.warn(
        '🔄 LangGraph agents failed, falling back to direct MCP tools:',
        agentError.message,
      );

      // Fallback to direct MCP tools
      return await this.fallbackToMCPTools(query, options);
    }
  }

  async fallbackToMCPTools(query, options = {}) {
    // Parse query to determine which MCP tool to use
    const params = this.parseQuery(query);

    // Simple routing logic
    if (
      query.toLowerCase().includes('season') ||
      query.toLowerCase().includes('championship')
    ) {
      if (params.year) {
        return await this.getDriverStandings(params.year);
      }
      return await this.getCurrentSeason();
    }

    if (
      query.toLowerCase().includes('driver') ||
      query.toLowerCase().includes('standings')
    ) {
      return await this.getDriverStandings(params.year || 2025);
    }

    if (
      query.toLowerCase().includes('race') ||
      query.toLowerCase().includes('next')
    ) {
      return await this.getNextRace();
    }

    // Default to current season
    return await this.getCurrentSeason();
  }

  // Season & Race Tools
  async getF1Seasons() {
    return this.callMCPTool('get_f1_seasons');
  }

  async getCurrentSeason() {
    return this.callMCPTool('get_current_f1_season');
  }

  async getF1Races(year = 2025) {
    return this.callMCPTool('get_f1_races', { year: year.toString() });
  }

  async getF1RaceDetails(year, round) {
    return this.callMCPTool('get_f1_race_details', {
      year: year.toString(),
      round: round.toString(),
    });
  }

  async getCurrentRace() {
    return this.callMCPTool('get_current_f1_race');
  }

  async getNextRace() {
    return this.callMCPTool('get_next_f1_race');
  }

  // Driver & Team Tools
  async getF1Drivers(year = 2025) {
    return this.callMCPTool('get_f1_drivers', { year: year.toString() });
  }

  async getDriverDetails(driverId, year = 2025) {
    return this.callMCPTool('get_f1_driver_details', {
      driverId,
      year: year.toString(),
    });
  }

  async getF1Constructors(year = 2025) {
    return this.callMCPTool('get_f1_constructors', { year: year.toString() });
  }

  async getConstructorDetails(constructorId, year = 2025) {
    return this.callMCPTool('get_f1_constructor_details', {
      constructorId,
      year: year.toString(),
    });
  }

  // Results & Standings Tools
  async getRaceResults(year, round) {
    return this.callMCPTool('get_f1_race_results', {
      year: year.toString(),
      round: round.toString(),
    });
  }

  async getQualifyingResults(year, round) {
    return this.callMCPTool('get_f1_qualifying_results', {
      year: year.toString(),
      round: round.toString(),
    });
  }

  async getDriverStandings(year = 2025) {
    return this.callMCPTool('get_f1_driver_standings', {
      year: year.toString(),
    });
  }

  async getConstructorStandings(year = 2025) {
    return this.callMCPTool('get_f1_constructor_standings', {
      year: year.toString(),
    });
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

      const [langGraphHealth, mcpHealth, apiHealth] = await Promise.all([
        fetch(`${this.langGraphAgentsUrl}/health`)
          .then((r) => r.json())
          .catch(() => ({ status: 'error', service: 'f1-langgraph-agents' })),
        fetch(`${this.mcpServerUrl}/health`)
          .then((r) => r.json())
          .catch(() => ({ status: 'error', service: 'f1-mcp-server' })),
        fetch(`${this.apiProxyUrl}/health`)
          .then((r) => r.json())
          .catch(() => ({ status: 'error', service: 'f1-api-proxy' })),
      ]);

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

  // Parse query for intelligent parameter extraction
  parseQuery(query) {
    const params = {};

    // Extract year
    const yearMatch = query.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) params.year = yearMatch[0];

    // Extract driver names (basic implementation)
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
}

// Export singleton instance
const f1MCPClient = new F1MCPClient();
export default f1MCPClient;
